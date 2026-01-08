---
tags:
  - trpc
  - api
  - typescript
  - nextjs
created: 2026-01-04
updated: 2026-01-08
status: active
---

## 概要

 **tRPC (TypeScript Remote Procedure Call)** は、TypeScriptの型システムを活用した**エンドツーエンドで型安全なAPI**を構築するためのフレームワークです。コード生成やスキーマ定義なしに、クライアントとサーバー間の型の整合性を保証します。

### 主な特徴

 **完全な型安全性**: TypeScriptの型推論により、クライアント・サーバー間の型の不整合を防ぐ
 **開発効率の向上**: APIスキーマの手動定義やコード生成が不要
 **優れたDX (Developer Experience)**: 自動補完、型チェック、リファクタリングが容易
 **Next.jsとの優れた統合**: App Router / Pages Router両方に対応
 **軽量**: 追加のランタイムオーバーヘッドがほぼない



## 基本概念

### Router（ルーター）

利用可能なプロシージャ（エンドポイント）とそれに対応するハンドラーを定義する中核的な要素。複数のルーターを組み合わせて、APIの構造を階層化できる。

### Procedure（プロシージャ）

単一のAPIエンドポイントを表現する。以下の2種類がある：

- **Query**: データ取得用（GETに相当）
- **Mutation**: データ変更用（POST/PUT/DELETEに相当）

### Context（コンテキスト）

すべてのプロシージャで利用可能なオブジェクト。以下のような情報を渡すために使用される：

- サービス層のインスタンス（DI）
- データベース接続
- 認証情報（ユーザー情報など）
- リクエストメタデータ

---

## 基本的なセットアップ

### 1. ルーターインスタンスの作成

tRPCの初期化は**バックエンドごとに1度だけ**行う。ヘルパー関数だけをエクスポートし、オブジェクトの再生成を避ける。

```typescript
import { initTRPC } from '@trpc/server';

/**
 * tRPCバックエンドの初期化
 * バックエンドごとに1度だけ実行すること！
 */
const t = initTRPC.create();

/**
 * 再利用可能なルーターとプロシージャヘルパーをエクスポート
 * これらはルーター全体で使用できる
 */
export const router = t.router;
export const publicProcedure = t.procedure;
```

### 2. ルーターの型シグネチャをエクスポート

クライアント側で型安全に呼び出すために、**ルーターの型のみ**をエクスポートする。

```typescript
import { router } from './trpc';

const appRouter = router({
  // プロシージャを定義...
});

// ルーター自体ではなく、型シグネチャのみをエクスポート
export type AppRouter = typeof appRouter;
```

### 3. プロシージャの追加

ルーターにプロシージャを追加して、APIのエンドポイントを定義する。

```typescript
import { z } from 'zod';
import { db } from './db';
import { publicProcedure, router } from './trpc';

const appRouter = router({
  // ユーザー一覧を取得（Query）
  userList: publicProcedure
    .query(async () => {
      const users = await db.user.findMany();
      // 戻り値の型: User[]
      return users;
    }),
  
  // IDでユーザーを取得（Query + Input）
  userById: publicProcedure
    .input(z.string()) // Zodでバリデーション
    .query(async (opts) => {
      const { input } = opts; // input: string
      const user = await db.user.findById(input);
      // 戻り値の型: User | undefined
      return user;
    }),
  
  // ユーザーを作成（Mutation）
  userCreate: publicProcedure
    .input(z.object({
      name: z.string(),
      email: z.string().email(),
    }))
    .mutation(async (opts) => {
      const { input } = opts;
      const user = await db.user.create(input);
      return user;
    }),
});
```

**プロシージャの構成要素:**

- **プロシージャ名**: クライアントから呼び出す際の識別子（例: `userList`, `userById`）
- **入力バリデーション**: `.input()` で入力値の型とバリデーションを定義
- **ハンドラー**: `.query()` または `.mutation()` で実際の処理を定義

---

## Dependency Injection（依存性注入）

Contextを使用してサービスやリポジトリを注入し、プロシージャ内で利用できるようにする。

```typescript
import { initTRPC } from "@trpc/server";
import { DrizzleClosedDayRepository } from "@/infrastructure/db/repositories/drizzleClosedDayRepository";
import { DrizzleEventRepository } from "@/infrastructure/db/repositories/drizzleEventRepository";
import { ClosedDayService } from "@/services/closedDayService";
import { EventService } from "@/services/eventService";

// リポジトリとサービスのインスタンスを生成
const eventRepository = new DrizzleEventRepository();
const eventService = new EventService(eventRepository);

const closedDayRepository = new DrizzleClosedDayRepository();
const closedDayService = new ClosedDayService(closedDayRepository);

// Contextの作成
export const createContext = () => {
  return { eventService, closedDayService };
};

// Contextの型を定義
export type Context = ReturnType<typeof createContext>;

// Contextを含めてtRPCを初期化
const t = initTRPC.context<Context>().create();

export const router = t.router;
export const publicProcedure = t.procedure;
```

**Contextを使用したプロシージャ例:**

```typescript
const appRouter = router({
  getEvents: publicProcedure
    .query(async ({ ctx }) => {
      // Contextからサービスを取得
      const events = await ctx.eventService.getAllEvents();
      return events;
    }),
});
```

---

## Next.jsとの統合

### 必要なパッケージのインストール

```bash
npm install @trpc/server @trpc/client @trpc/react-query @trpc/next @tanstack/react-query zod
```

### セットアップ手順

#### 1. tRPCの初期化（サーバー側）

`src/server/trpc.ts`

```typescript
import { initTRPC } from '@trpc/server';

const t = initTRPC.create();

export const router = t.router;
export const publicProcedure = t.procedure;
```

#### 2. ルーターの定義

`src/server/routers/_app.ts`

```typescript
import { router, publicProcedure } from '../trpc';
import { z } from 'zod';

export const appRouter = router({
  hello: publicProcedure
    .input(z.object({ name: z.string().optional() }))
    .query(({ input }) => {
      return {
        greeting: `Hello, ${input.name ?? 'World'}!`,
      };
    }),
  
  // 他のプロシージャ...
});

// 型のエクスポート（重要！）
export type AppRouter = typeof appRouter;
```

#### 3. Next.js APIルートの作成

 **Pages Router の場合:**

`src/pages/api/trpc/[trpc].ts`

```typescript
import { createNextApiHandler } from '@trpc/server/adapters/next';
import { appRouter } from '@/server/routers/_app';
import { createContext } from '@/server/context';

export default createNextApiHandler({
  router: appRouter,
  createContext, // Contextが必要な場合
});
```

 **App Router の場合:**

`src/app/api/trpc/[trpc]/route.ts`

```typescript
import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { appRouter } from '@/server/routers/_app';

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext: () => ({}),
  });

export { handler as GET, handler as POST };
```

#### 4. クライアントのセットアップ

`src/utils/trpc.ts`

```typescript
import { createTRPCReact } from '@trpc/react-query';
import type { AppRouter } from '@/server/routers/_app';

export const trpc = createTRPCReact<AppRouter>();
```

#### 5. Providerの設定

 **Pages Router の場合:**

`src/pages/_app.tsx`

```typescript
import { trpc } from '@/utils/trpc';
import { httpBatchLink } from '@trpc/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { AppProps } from 'next/app';
import { useState } from 'react';

function MyApp({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: '/api/trpc',
        }),
      ],
    })
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <Component {...pageProps} />
      </QueryClientProvider>
    </trpc.Provider>
  );
}

export default MyApp;
```

 **App Router の場合:**

`src/app/providers.tsx`

```typescript
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import { useState } from 'react';
import { trpc } from '@/utils/trpc';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: '/api/trpc',
        }),
      ],
    })
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </trpc.Provider>
  );
}
```

`src/app/layout.tsx`

```typescript
import { Providers } from './providers';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

#### 6. クライアント側での使用

```typescript
'use client'; // App Routerの場合

import { trpc } from '@/utils/trpc';

export default function HomePage() {
  // Query の使用例
  const { data, isLoading, error } = trpc.hello.useQuery({ 
    name: 'tRPC' 
  });

  // Mutation の使用例
  const mutation = trpc.userCreate.useMutation({
    onSuccess: (data) => {
      console.log('User created:', data);
    },
  });

  if (isLoading) return <div>読み込み中...</div>;
  if (error) return <div>エラー: {error.message}</div>;

  return (
    <div>
      <h1>{data?.greeting}</h1>
      <button onClick={() => mutation.mutate({ 
        name: 'John', 
        email: 'john@example.com' 
      })}>
        ユーザー作成
      </button>
    </div>
  );
}
```

---

## ベストプラクティス

 推奨される実装方法

1. **Zodを使用した入力バリデーション**: 型安全性とランタイムバリデーションの両立
2. **Contextを使ったDI**: テスタビリティと保守性の向上
3. **ルーターの分割**: 機能ごとにルーターを分けて管理しやすくする
4. **エラーハンドリング**: `TRPCError` を使用した適切なエラー処理

```typescript
import { TRPCError } from '@trpc/server';

const appRouter = router({
  getUserById: publicProcedure
    .input(z.string())
    .query(async ({ input, ctx }) => {
      const user = await ctx.db.user.findById(input);
      
      if (!user) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'ユーザーが見つかりません',
        });
      }
      
      return user;
    }),
});
```

### ⚠️ 注意点

- tRPCはREST APIの完全な代替ではない（同一モノレポ/同一言語環境に最適）
- 外部APIとの統合には従来のREST/GraphQLを使用
- Server Componentsでの使用には追加の設定が必要


### 参考リンク

- [Next.js with React Server Components](https://trpc.io/docs/client/react/server-components)
- [TanStack Query (React Query)](https://tanstack.com/query/latest)

- [公式ドキュメント](https://trpc.io/)
- [コンセプト解説](https://trpc.io/docs/concepts)
- [Qiita - tRPC解説](https://qiita.com/megmogmog1965/items/86ea05966027881afca0)
- [Zenn - tRPC入門](https://zenn.dev/big_tanukiudon/articles/2f5e6efd851686)
