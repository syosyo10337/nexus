---
tags:
  - nextjs
  - error-handling
  - error-boundary
  - typescript
created: 2026-02-24
updated_at: 2026-02-24
status: active
---

# エラーハンドリング三層構造

Next.js App Router (v15) における階層的エラーハンドリング戦略。グローバルエラー、ページレベルエラー、コンポーネントレベルエラーの三層構造により、適切な粒度でエラーをキャッチし、UIレベルで処理する。

## 関連ドキュメント

- [クライアントエラーレポーティング & グローバルハンドラ](./04b-error-reporting-handlers.md) - 本ドキュメントの続き
- [エラークラス設計](./05-error-class-design.md) - ApiError/NetworkError の型安全な分類
- [ロギングアーキテクチャ設計](./12a-logging-architecture.md) - クライアントエラーレポーティングの詳細設計
- [ロギング実装例とベストプラクティス](./12b-logging-implementation.md) - エラーログの実装例

## 三層構造の全体像

Next.js App Routerのエラーハンドリングは、**三層構造**で設計される。各層はキャッチするエラーの範囲とログレベルが異なり、漏れなくエラーを捕捉する。

```text
Layer 1: global-error.tsx (LogLevel.Fatal)
    └── ルートレイアウト(layout.tsx)自体のエラー
    └── 自前で <html><body> を描画（レイアウトが壊れているため）

Layer 2: error.tsx (LogLevel.Error)
    └── アプリケーション全体のエラー
    └── ルートレイアウト配下のError Boundary

Layer 3: ClientErrorBoundary (コンポーネントレベル)
    └── 個別コンポーネントのエラーをキャッチ
    └── カスタムFallback UI

補助: ClientErrorHandlerRegister (window.onerror / unhandledrejection)
    └── Error Boundaryでキャッチされないエラーのセーフティネット
    └── イベントハンドラー内のエラー、未処理のPromise rejectなど
```

### 各層の比較

| 層      | ファイル                     | LogLevel             | スコープ                   | UIの制御                         |
| ------- | ---------------------------- | -------------------- | -------------------------- | -------------------------------- |
| Layer 1 | `app/global-error.tsx`       | `Fatal`              | ルートレイアウトのエラー   | `<html><body>` から自前描画      |
| Layer 2 | `app/error.tsx`              | `Error`              | ルートレイアウト配下すべて | レイアウト内のコンテンツ差し替え |
| Layer 3 | `ClientErrorBoundary`        | - (呼び出し側で制御) | 個別コンポーネント         | カスタムFallback UI              |
| 補助    | `ClientErrorHandlerRegister` | `Warn`               | Error Boundary外のエラー   | UIなし（ログ記録のみ）           |

## Layer 1: `global-error.tsx`

Next.jsの最上位Error Boundary。ルートレイアウト（`app/layout.tsx`）自体でエラーが発生した場合にのみ発火する。レイアウトが壊れている状態なので、`<html>` と `<body>` タグを自前で描画する必要がある。

```typescript
// src/app/global-error.tsx
'use client'

import Link from 'next/link'
import { useEffect } from 'react'

import { Button } from '@/shared/components/ui/button'
import { ROUTES } from '@/shared/constants/routes'
import { reportClientError, ClientErrorType } from '@/shared/utils/logger/client'
import { LogLevel } from '@/shared/utils/logger/type'

interface GlobalErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

/**
 * グローバルエラーページ
 *
 * ルートレイアウト（app/layout.tsx）内でエラーが発生した場合に表示されます。
 * これはNext.jsの最上位のError Boundaryであり、通常のerror.tsxでキャッチできない
 * ルートレイアウト自体のエラーをキャッチします。
 *
 */
export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    void reportClientError({
      module: ClientErrorType.ErrorBoundary,
      level: LogLevel.Fatal,
      error: error,
      context: {
        requestUrl: window.location.href,
      },
    })
  }, [error])

  return (
    <html lang="ja">
      <body>
        <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
          <div className="max-w-md w-full space-y-8 text-center">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold tracking-tight">500</h1>
              <h2 className="text-2xl font-semibold text-muted-foreground">
                重大なエラーが発生しました
              </h2>
            </div>

            <div className="py-4">
              <p className="text-muted-foreground">
                申し訳ございません。システムで重大なエラーが発生しました。
                <br />
                ページを再読み込みしてください。
              </p>
            </div>

            <div className="pt-4 space-y-3">
              <Button
                onClick={reset}
                className="w-full"
              >
                再試行
              </Button>

              <Button
                variant="outline"
                className="w-full"
                asChild
              >
                <Link href={ROUTES.ROOT}>ホームに戻る</Link>
              </Button>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}
```

### 設計上のポイント

- **`LogLevel.Fatal`**: アプリケーション全体が壊れている深刻な状態。アラート対象。
- **`<html><body>` の自前描画**: `layout.tsx` のエラーなので、既存のレイアウト（ヘッダー、サイドバー等）は使えない。最低限のUIを直接レンダリングする。
- **`error.digest`**: サーバーサイドでハッシュ化されたエラーID。クライアントへの詳細なエラー情報の漏洩を防ぎつつ、ログとの突合に使用可能。

## Layer 2: `error.tsx`

ルートレイアウト配下のすべてのエラーをキャッチするError Boundary。通常のアプリケーションエラーはここで捕捉される。

```typescript
// src/app/error.tsx
'use client'

import Link from 'next/link'
import { useEffect } from 'react'

import { Button } from '@/shared/components/ui/button'
import { ROUTES } from '@/shared/constants/routes'
import { reportClientError, ClientErrorType } from '@/shared/utils/logger/client'
import { LogLevel } from '@/shared/utils/logger/type'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

/**
 * アプリケーション全体のエラーページ
 * このページはError Boundaryとして機能し、
 * 予期しないエラーが発生した場合に表示されます
 */
export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    void reportClientError({
      module: ClientErrorType.ErrorBoundary,
      level: LogLevel.Error,
      error: error,
    })
  }, [error])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">500</h1>
          <h2 className="text-2xl font-semibold text-muted-foreground">予期しないエラーが発生しました</h2>
        </div>

        <div className="py-4">
          <p className="text-muted-foreground">
            申し訳ございません。システムでエラーが発生しました。
            <br />
            しばらく待ってから再度お試しください。
          </p>
        </div>

        <div className="pt-4 space-y-3">
          <Button
            onClick={reset}
            className="w-full"
          >
            再試行
          </Button>

          <Button
            variant="outline"
            className="w-full"
            asChild
          >
            <Link href={ROUTES.ROOT}>
              ホームに戻る
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
```

### Layer 1との違い

| 項目       | `global-error.tsx`             | `error.tsx`                        |
| ---------- | ------------------------------ | ---------------------------------- |
| LogLevel   | `Fatal`                        | `Error`                            |
| HTMLタグ   | 自前で `<html><body>` を描画   | 既存のレイアウト内で表示           |
| スコープ   | ルートレイアウト自体のエラー   | レイアウト配下のすべてのエラー     |
| メッセージ | 「重大なエラーが発生しました」 | 「予期しないエラーが発生しました」 |

## Layer 3: `ClientErrorBoundary`

コンポーネントレベルでエラーを局所的にキャッチし、ページ全体を壊さずにFallback UIを表示するためのラッパーコンポーネント。内部的に `react-error-boundary` ライブラリを使用している。

```typescript
// src/shared/components/utility/client-error-boundary.tsx
'use client'

import type { ReactNode } from 'react'
import { ErrorBoundary, type FallbackProps } from 'react-error-boundary'

interface ClientErrorBoundaryProps {
  children: ReactNode
  fallback?: React.ComponentType<FallbackProps>
  onReset?: () => void
}

/**
 * ページ単位のエラーハンドリングはNextの機構を利用する。(error.tsx)
 * コンポーネントレベルでエラーをハンドリングする場合にはこちらを使う。
 *
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/error#how-errorjs-works
 */
export function ClientErrorBoundary({
  children,
  fallback,
  onReset,
}: ClientErrorBoundaryProps) {
  const FallbackComponent = fallback ?? _DefaultFallback

  return (
    <ErrorBoundary
      FallbackComponent={FallbackComponent}
      {...(onReset && { onReset })}
    >
      {children}
    </ErrorBoundary>
  )
}

function _DefaultFallback({
  error,
  resetErrorBoundary,
}: FallbackProps) {
  return (
    <div className="rounded-md bg-red-50 p-4">
      <div className="flex">
        <div className="ml-3">
          <h3 className="text-sm font-medium text-red-800">エラーが発生しました</h3>
          <div className="mt-2 text-sm text-red-700">
            <p>{error.message}</p>
          </div>
          <div className="mt-4">
            <button
              onClick={resetErrorBoundary}
              className="rounded bg-red-100 px-2 py-1 text-sm font-medium text-red-800 hover:bg-red-200"
            >
              再試行
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
```

### 使い分けの基準

- **ページ全体が壊れてもよい場合**: `error.tsx` に任せる（Layer 2）。明示的な対応は不要。
- **ページの一部だけエラーにしたい場合**: `ClientErrorBoundary` で該当コンポーネントを囲む（Layer 3）。
