---
tags:
  - nextjs
  - react-query
  - tanstack-query
  - caching
created: 2026-02-24
updated_at: 2026-02-24
status: active
---

# React Query設定思想

React Query（TanStack Query）の設定方針と、QueryClient の構成について解説する。

---

## QueryClient設定

Birdcage では、QueryClient の設定を `config.ts` に集約し、`createQueryClient()` ファクトリ関数経由でインスタンスを生成する。

```typescript
// src/shared/components/utility/query-client-provider/config.ts
import { QueryClient, type QueryClientConfig } from "@tanstack/react-query";

import {
  UnauthorizedError,
  BadRequestError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
} from "@/shared/errors/api-error";

/**
 * QueryClientのインスタンスを作成する関数
 */
export function createQueryClient(): QueryClient {
  return new QueryClient(queryClientConfig);
}

/**
 * QueryClientのデフォルト設定
 */
export const queryClientConfig: QueryClientConfig = {
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5分
      gcTime: 1000 * 60 * 10, // 10分
      retry: shouldRetry,
      retryDelay: (failureCount: number) =>
        Math.min(1000 * 2 ** failureCount, 30_000),
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: false,
    },
  },
};

/**
 * エラーがリトライ可能かどうかを判定する関数
 * @param failureCount 失敗回数
 * @param error エラーオブジェクト
 * @returns リトライ可能な場合はtrue、そうでなければfalse
 */
function shouldRetry(failureCount: number, error: unknown): boolean {
  // AbortErrorの場合はリトライしない
  if (error instanceof DOMException && error.name === "AbortError") {
    return false;
  }

  // 特定のAPIエラーの場合はリトライしない
  if (
    error instanceof BadRequestError ||
    error instanceof UnauthorizedError ||
    error instanceof ForbiddenError ||
    error instanceof NotFoundError ||
    error instanceof ConflictError
  ) {
    console.log(`[QueryClient] No retry for ${error.name} (${error.status})`);
    return false;
  }

  console.log(`[QueryClient] Retrying error (attempt ${failureCount + 1})`);
  return failureCount < 3;
}
```

---

## 各設定の根拠

### staleTime: 5分（`1000 * 60 * 5`）

管理画面のデータは頻繁に更新されるわけではないが、複数のオペレーターが同時に操作する可能性がある。そのため 5 分間をキャッシュの「新鮮」期間として設定している。

- **長すぎる場合のリスク**: 他のユーザーによる更新が反映されず、古いデータのまま操作してしまう
- **短すぎる場合のリスク**: ページ遷移のたびに不要な API リクエストが発生し、サーバー負荷が増加する

5 分間はこのバランスを取った値である。staleTime 内であれば、コンポーネントの再マウントや同じクエリの再実行時にキャッシュが即座に返却され、ネットワークリクエストは発生しない。

### gcTime: 10分（`1000 * 60 * 10`）

staleTime の 2 倍に設定している。これは、キャッシュが stale（古い）になった後も、バックグラウンドで再フェッチしつつ古いデータを即座に表示するための猶予期間である。

gcTime（Garbage Collection Time）は、クエリのオブザーバーがいなくなった（＝そのデータを表示するコンポーネントがアンマウントされた）後、キャッシュが保持される時間を意味する。例えば以下のようなシナリオで効果を発揮する:

1. イベント一覧ページ（データがキャッシュされる）
2. イベント詳細ページに遷移（一覧のオブザーバーが消える）
3. 8 分後に一覧ページに戻る → staleTime は過ぎているが gcTime 内なので、古いデータを **即座に表示** しつつ、バックグラウンドで最新データを取得する

gcTime が staleTime より短いと、stale なデータが GC で消えてしまい、このパターンが機能しなくなる。

### refetchOnWindowFocus: false

React Query のデフォルトでは、ブラウザのタブにフォーカスが戻った際に自動で再フェッチが行われる。Birdcage ではこれを無効化している。

- **管理画面特有の事情**: フォーム編集中にタブを切り替えて戻った際、裏側でデータが再フェッチされると、編集中の内容と不整合が起きるリスクがある
- **明示的な更新**: データの最新化が必要な場合は、`invalidateQueries` を明示的に呼び出す。Server Action の完了後に `revalidatePath` でキャッシュを無効化するパターンと組み合わせる

### retry: shouldRetry()

全てのエラーを一律にリトライするのではなく、**リトライしても解決しないエラー** を判別して即座に失敗させる。

```typescript
function shouldRetry(failureCount: number, error: unknown): boolean {
  // ナビゲーションによるキャンセル → リトライ不要
  if (error instanceof DOMException && error.name === "AbortError") {
    return false;
  }

  // クライアントエラー（4xx）→ リトライしても解決しない
  if (
    error instanceof BadRequestError || // 400
    error instanceof UnauthorizedError || // 401
    error instanceof ForbiddenError || // 403
    error instanceof NotFoundError || // 404
    error instanceof ConflictError // 409
  ) {
    return false;
  }

  // サーバーエラー（5xx）やネットワークエラー → 最大3回リトライ
  return failureCount < 3;
}
```

| エラー種別                | リトライ | 理由                                                               |
| ------------------------- | -------- | ------------------------------------------------------------------ |
| `AbortError`              | しない   | ページ遷移時のリクエストキャンセル。意図的な中断であり再実行は不要 |
| `BadRequestError` (400)   | しない   | リクエスト内容が不正。同じリクエストを送っても結果は変わらない     |
| `UnauthorizedError` (401) | しない   | 認証切れ。リトライではなく再ログインが必要                         |
| `ForbiddenError` (403)    | しない   | 権限不足。リトライしても権限は変わらない                           |
| `NotFoundError` (404)     | しない   | リソースが存在しない。リトライしても出現しない                     |
| `ConflictError` (409)     | しない   | 競合状態。同じ操作のリトライは状況を悪化させる可能性がある         |
| サーバーエラー (5xx)      | する     | 一時的な障害の可能性がある。時間をおけば回復する場合がある         |
| ネットワークエラー        | する     | 一時的な接続断の可能性がある                                       |

これらのカスタムエラークラスは `@/shared/errors/api-error` で定義されている:

```typescript
// src/shared/errors/api-error/api-error.ts
export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public data?: unknown
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export class BadRequestError extends ApiError {
  constructor(message: string, data?: unknown) {
    shouldRetry;
    super(400, message, data);
    this.name = "BadRequestError";
  }
}

// UnauthorizedError (401), ForbiddenError (403),
// NotFoundError (404), ConflictError (409) も同様の構造
```

### retryDelay: Exponential Backoff

```typescript
retryDelay: (failureCount: number) =>
  Math.min(1000 * 2 ** failureCount, 30_000);
```

リトライ間隔は指数関数的に増加する（Exponential Backoff）:

| リトライ回数 | 待機時間             |
| ------------ | -------------------- |
| 1 回目       | 2 秒（`1000 * 2^1`） |
| 2 回目       | 4 秒（`1000 * 2^2`） |
| 3 回目       | 8 秒（`1000 * 2^3`） |

上限は 30 秒（`30_000`）。サーバーの一時障害時に、短い間隔で連続リトライしてサーバーに過負荷をかけることを防ぐ。

### mutations.retry: false

```typescript
mutations: {
  retry: false,
}
```

Mutation（データの変更操作）は一切リトライしない。理由は以下の通り:

- **二重送信の防止**: イベント作成やチケット購入などの副作用がある操作を自動リトライすると、同じ操作が複数回実行される危険がある
- **ユーザー判断の尊重**: 変更操作が失敗した場合、ユーザーが状況を確認して再実行するかどうかを判断すべき
- **Birdcage の設計方針**: Mutation は主に Server Action 経由で実行され、`useActionState` によるフォーム送信で制御される。リトライはユーザーの明示的な再送信で行う

---

## QueryProvider実装

```typescript
// src/shared/components/utility/query-client-provider/index.tsx
'use client'

import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import type { ReactNode } from 'react'
import { useState } from 'react'

import { createQueryClient } from './config'

interface Props {
  children: ReactNode
}

export function QueryProvider({ children }: Props) {
  // QueryClientをuseStateで作成し、再レンダリング時に新しいインスタンスが作られることを防ぐ
  const [queryClient] = useState(createQueryClient)

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV !== 'production' && <ReactQueryDevtools />}
    </QueryClientProvider>
  )
}
```

### 実装のポイント

- `useState(createQueryClient)` による Lazy Initialization

`useState` に関数そのもの（`createQueryClient` であり `createQueryClient()` ではない）を渡すことで、初回レンダリング時のみ `createQueryClient` が実行される。

```typescript
// NG: 毎回のレンダリングで新しい QueryClient が生成される（即座に破棄されるが無駄）
const [queryClient] = useState(new QueryClient(queryClientConfig));

// OK: 関数参照を渡すことで、useState が初回のみ実行する
const [queryClient] = useState(createQueryClient);
```

React の再レンダリング時に QueryClient が再作成されると、全てのキャッシュが失われる。`useState` の Lazy Initialization パターンにより、コンポーネントのライフサイクル全体で同一の QueryClient インスタンスが維持される。

- DevTools の条件付きレンダリング

```typescript
{process.env.NODE_ENV !== 'production' && <ReactQueryDevtools />}
```

React Query DevTools はキャッシュの状態確認やクエリのデバッグに有用だが、本番環境ではバンドルサイズの増加を避けるため除外する。`process.env.NODE_ENV` はビルド時に静的に置換されるため、本番ビルドではこのコードブロック自体がツリーシェイキングで除去される。

---

## 配置場所

QueryProvider はルートレイアウトに配置し、アプリケーション全体で単一の QueryClient を共有する。

```typescript
// src/app/layout.tsx
import 'server-only'
import { Inter } from 'next/font/google'
import type React from 'react'

import { Toaster } from '@/shared/components/ui/sonner'
import { ClientErrorHandlerRegister } from '@/shared/components/utility/client-error-handler-register'
import { QueryProvider } from '@/shared/components/utility/query-client-provider'
import { ENV } from '@/shared/constants/environment'

const inter = Inter({ subsets: ['latin'] })

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const envClass = ENV !== 'local' ? `env-${ENV}` : ''

  return (
    <QueryProvider>
      <html
        lang="ja"
        className={envClass}
      >
        <body className={`${inter.className} bg-background`}>
          <ClientErrorHandlerRegister />
          {children}
          <Toaster expand={true} />
        </body>
      </html>
    </QueryProvider>
  )
}
```

### 配置に関する注意点

**QueryProvider は `<html>` 要素の外側に配置されている。** これは一見奇妙に見えるが、Next.js App Router では有効なパターンである。React のコンテキストプロバイダーは DOM ノードを生成せず、論理的なツリー構造として機能するため、HTML 構造に影響しない。

**Server Component から Client Component をラップする構造:**

```text
RootLayout（Server Component, async function）
  └── QueryProvider（'use client'）
        └── <html>
              └── <body>
                    └── {children}
```

`layout.tsx` は `import 'server-only'` を宣言した Server Component であり、内部で `QueryProvider`（Client Component）をレンダリングしている。Server Component は Client Component を子として持てるが、その逆はできない（Server Component を Client Component の内部でインポートすることはできない）。この境界をルートレイアウトで設定することで、アプリ全体の Client Component が QueryClient にアクセスできる。
