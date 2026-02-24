# エラーハンドリング三層構造

## 三層構造の全体像

Birdcageのエラーハンドリングは、Next.js App Routerの機構を活かした**三層構造**で設計されている。各層はキャッチするエラーの範囲とログレベルが異なり、漏れなくエラーを捕捉する。

```
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

| 層 | ファイル | LogLevel | スコープ | UIの制御 |
|----|---------|----------|---------|---------|
| Layer 1 | `app/global-error.tsx` | `Fatal` | ルートレイアウトのエラー | `<html><body>` から自前描画 |
| Layer 2 | `app/error.tsx` | `Error` | ルートレイアウト配下すべて | レイアウト内のコンテンツ差し替え |
| Layer 3 | `ClientErrorBoundary` | - (呼び出し側で制御) | 個別コンポーネント | カスタムFallback UI |
| 補助 | `ClientErrorHandlerRegister` | `Warn` | Error Boundary外のエラー | UIなし（ログ記録のみ） |

---

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

---

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

| 項目 | `global-error.tsx` | `error.tsx` |
|------|-------------------|-------------|
| LogLevel | `Fatal` | `Error` |
| HTMLタグ | 自前で `<html><body>` を描画 | 既存のレイアウト内で表示 |
| スコープ | ルートレイアウト自体のエラー | レイアウト配下のすべてのエラー |
| メッセージ | 「重大なエラーが発生しました」 | 「予期しないエラーが発生しました」 |

---

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

```tsx
// 使用例: チケット一覧コンポーネントだけエラーにし、ページ全体は維持する
<div>
  <EventHeader />
  <ClientErrorBoundary fallback={TicketListErrorFallback}>
    <TicketList />
  </ClientErrorBoundary>
  <EventFooter />
</div>
```

---

## エラークラス階層

API通信で発生するエラーは、HTTPステータスコードに応じた専用クラスとして型安全に分類される。

### 基底クラスとサブクラス

```typescript
// src/shared/errors/api-error/api-error.ts

/**
 * 基本的なAPIエラークラス
 * すべてのAPIエラーの基底クラスとして機能
 */
export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public data?: unknown,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

/**
 * 400 Bad Requestエラー
 * クライアントからの不正なリクエストを示す
 */
export class BadRequestError extends ApiError {
  constructor(message: string, data?: unknown) {
    super(400, message, data)
    this.name = 'BadRequestError'
  }
}

/**
 * 401 Unauthorizedエラー
 * 認証が必要なリソースへのアクセスを示す
 */
export class UnauthorizedError extends ApiError {
  constructor(message: string, data?: unknown) {
    super(401, message, data)
    this.name = 'UnauthorizedError'
  }
}

/**
 * 403 Forbiddenエラー
 * アクセス権限がないリソースへのアクセスを示す
 */
export class ForbiddenError extends ApiError {
  constructor(message: string, data?: unknown) {
    super(403, message, data)
    this.name = 'ForbiddenError'
  }
}

/**
 * 404 Not Foundエラー
 * リソースが存在しないことを示す
 */
export class NotFoundError extends ApiError {
  constructor(message: string, data?: unknown) {
    super(404, message, data)
    this.name = 'NotFoundError'
  }
}

/**
 * 409 Conflictエラー
 * リクエストが現在のサーバーの状態と競合したことを示す
 */
export class ConflictError extends ApiError {
  constructor(message: string, data?: unknown) {
    super(409, message, data)
    this.name = 'ConflictError'
  }
}

/**
 * 500 Internal Server Error
 * サーバー側のエラーを示す
 */
export class InternalServerError extends ApiError {
  constructor(message: string, data?: unknown) {
    super(500, message, data)
    this.name = 'InternalServerError'
  }
}
```

### Factoryパターンによるエラー生成

ステータスコードから適切なエラークラスのインスタンスを自動的に生成するFactory関数。fetcherの内部で使用される。

```typescript
// src/shared/errors/api-error/api-error-factory.ts
import {
  ApiError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  InternalServerError,
  ConflictError,
} from './api-error'

/**
 * エラーファクトリーのインターフェース
 * Factory Patternの抽象化を提供
 */
interface ErrorFactory {
  create: (message: string, data?: unknown) => ApiError
}

/**
 * ステータスコードとエラーファクトリーのマッピング
 * Factory Patternの具象実装を提供
 */
const errorFactories: Record<number, ErrorFactory> = {
  400: { create: (message, data) => new BadRequestError(message, data) },
  401: { create: (message, data) => new UnauthorizedError(message, data) },
  403: { create: (message, data) => new ForbiddenError(message, data) },
  404: { create: (message, data) => new NotFoundError(message, data) },
  409: { create: (message, data) => new ConflictError(message, data) },
  500: { create: (message, data) => new InternalServerError(message, data) },
}

/**
 * APIエラーを作成するファクトリー関数
 * Factory Patternのエントリーポイント
 */
export const createApiError = (
  status: number,
  message: string,
  data?: unknown,
): ApiError => {
  const factory = errorFactories[status]
  return factory?.create(message, data) ?? new ApiError(status, message, data)
}
```

### 使い方

```typescript
// fetcherの内部で使用される
if (!response.ok) {
  throw createApiError(response.status, extractErrorMessage(data), data)
}

// 呼び出し側での型安全なエラーハンドリング
try {
  await getCommunityEvent(eventId)
} catch (error) {
  if (error instanceof NotFoundError) {
    // 404: イベントが見つからない場合の処理
    notFound()
  }
  if (error instanceof UnauthorizedError) {
    // 401: 認証切れの場合の処理
    redirect('/auth/signin')
  }
  throw error // その他のエラーはError Boundaryに委譲
}
```

マッピングに存在しないステータスコード（例: 422, 503等）の場合は、基底クラスの `ApiError` インスタンスが生成される。

---

## `NetworkError`

HTTPレスポンスが存在しない（リクエストがサーバーに到達しなかった）エラーを表現するクラス。`ApiError` とは別の継承階層に属する。

```typescript
// src/shared/errors/network-error/index.ts

/**
 * ネットワークエラー
 * ネットワーク接続の問題（オフライン、タイムアウトなど）を示す
 *
 * HTTPリクエストがサーバーに到達する前に発生するエラーを表現します。
 * - オフライン状態
 * - タイムアウト
 * - DNS解決失敗
 * - サーバーが応答しない
 *
 * NOTE: HTTPステータスコードが存在しない（リクエストが完了していないため）
 * NOTE: ApiErrorとは異なり、HTTPレスポンスに基づくエラーではありません
 */
export class NetworkError extends Error {
  constructor(message: string = 'ネットワークエラーが発生しました') {
    super(message)
    this.name = 'NetworkError'
  }
}
```

### エラー分類の全体像

```
Error (JavaScript標準)
  ├── ApiError (HTTPレスポンスあり)
  │     ├── BadRequestError     (400)
  │     ├── UnauthorizedError   (401)
  │     ├── ForbiddenError      (403)
  │     ├── NotFoundError       (404)
  │     ├── ConflictError       (409)
  │     └── InternalServerError (500)
  │
  └── NetworkError (HTTPレスポンスなし)
        └── オフライン、タイムアウト、DNS失敗等
```

`ApiError` と `NetworkError` を明確に分離することで、UIレベルで適切なメッセージを出し分けられる。

- `ApiError`: 「エラーが発生しました」（サーバーからのエラーレスポンス）
- `NetworkError`: 「ネットワーク接続を確認してください」（サーバーに到達していない）

---

## クライアントエラーレポーター

ブラウザで発生したエラーをサーバーサイドのログ機構（Pino）に送信する仕組み。通常のAPI通信エラーは `customServerFetch` 内でサーバーログに記録されるが、以下のケースではサーバーログが残らないため、専用のレポーターが必要。

- Error Boundary（`error.tsx` / `global-error.tsx`）でキャッチされたエラー
- `window.onerror` / `unhandledrejection`（グローバルハンドラー）でキャッチされたエラー
- ネットワークエラー（API Routesに到達しないため、サーバーログに残らない）

### `reportClientError`

```typescript
// src/shared/utils/logger/client/error-reporter.ts
'use client'

import { IS_SERVER } from '@/shared/constants/environment'

import type { ClientErrorPayload, ErrorInfo } from './types'

interface ReportClientErrorArgs extends Omit<ClientErrorPayload, 'error'> {
  /** エラーオブジェクト（unknown型で受け取る） */
  error: unknown
}

/**
 * client-side(browser)で発生したエラーをAPI Routeへ送信する
 *
 * サーバー側のログ機構を経由しないクライアント専用エラーを記録します：
 * - Error Boundary (error.tsx / global-error.tsx)
 * - window.onerror / unhandledrejection（フォールバック）
 * - ネットワークエラー（API Routesに到達しない）
 */
export async function reportClientError(
  payload: ReportClientErrorArgs,
): Promise<void> {
  if (IS_SERVER) {
    console.warn('reportClientError called in non-browser environment')
    return
  }

  try {
    const payloadWithErrorInfo: ClientErrorPayload = {
      ...payload,
      error: serializeError(payload.error),
    }
    await fetch('/api/logs/client-errors', {
      method: 'POST',
      body: JSON.stringify(payloadWithErrorInfo),
    })
  } catch (error) {
    // NOTE: ログ送信失敗は無視（無限ループ回避）
    if (process.env.NODE_ENV === 'development') {
      console.warn('Failed to report client error:', error)
    }
  }
}

/**
 * Errorオブジェクトをシリアライズ可能な形式に変換
 *
 * JSON.stringify()はErrorオブジェクトを正しくシリアライズしないため、
 * 明示的に message, stack, name を抽出する
 */
function serializeError(error: unknown): ErrorInfo {
  if (error instanceof Error) {
    return {
      message: error.message,
      name: error.name,
      ...(error.stack && { stack: error.stack }),
    }
  }

  // Errorオブジェクト以外はすべて文字列に変換
  return { message: String(error) }
}
```

### ペイロードの型定義

```typescript
// src/shared/utils/logger/client/types.ts
import { z } from 'zod'

import { LogLevel } from '../type'

/**
 * クライアントエラーの種類
 */
export const ClientErrorType = {
  ErrorBoundary: 'error-boundary',
  WindowError: 'window-error',
  NetworkError: 'network-error',
  UnhandledRejection: 'unhandled-rejection',
} as const
export type ClientErrorType = typeof ClientErrorType[keyof typeof ClientErrorType]

export const ErrorInfoSchema = z.object({
  message: z.string(),
  name: z.string().optional(),
  stack: z.string().optional(),
})
export type ErrorInfo = z.infer<typeof ErrorInfoSchema>

/**
 * クライアントエラー報告のペイロード
 *
 * `/api/logs/client-errors` に送信されるエラー情報
 */
export const ClientErrorPayloadSchema = z.object({
  module: z.string(),
  level: z.enum([LogLevel.Error, LogLevel.Warn, LogLevel.Fatal]),
  error: ErrorInfoSchema,
  context: z.record(z.string(), z.unknown()).optional(),
})
export type ClientErrorPayload = z.infer<typeof ClientErrorPayloadSchema>
```

### LogLevel

```typescript
// src/shared/utils/logger/type.ts
export const LogLevel = {
  Fatal: 'fatal',
  Error: 'error',
  Warn: 'warn',
  Info: 'info',
  Debug: 'debug',
  Trace: 'trace',
  Silent: 'silent',
} as const
export type LogLevel = typeof LogLevel[keyof typeof LogLevel]
```

---

## 補助: `ClientErrorHandlerRegister`

Error Boundaryでキャッチされないエラーの最終防衛線。`window.onerror` と `unhandledrejection` のグローバルイベントリスナーを登録し、漏れたエラーを `LogLevel.Warn` で記録する。

### 登録コンポーネント

```typescript
// src/shared/components/utility/client-error-handler-register.tsx
'use client'

import { useEffect } from 'react'

import { setupGlobalErrorHandlers } from '@/shared/utils/logger/client'

/**
 * グローバルエラーハンドラー登録コンポーネント
 *
 * Server ComponentであるRootLayout (app/layout.tsx) から
 * window.onerror と unhandledrejection のグローバルエラーハンドラーを登録する。
 *
 * 【使用例】
 * // app/layout.tsx
 * export default function RootLayout({ children }) {
 *   return (
 *     <html>
 *       <body>
 *         <ClientErrorHandlerRegister />
 *         {children}
 *       </body>
 *     </html>
 *   )
 * }
 */
export function ClientErrorHandlerRegister() {
  useEffect(() => setupGlobalErrorHandlers(), [])

  return null
}
```

### グローバルエラーハンドラの実装

```typescript
// src/shared/utils/logger/client/global-error-handler.ts
'use client'

import { IS_SERVER } from '@/shared/constants/environment'

import { LogLevel } from '../type'
import { reportClientError } from './error-reporter'
import { ClientErrorType } from './types'

/**
 * グローバルエラーハンドラーの登録（フォールバック）
 *
 * これらのハンドラーは「本来キャッチされるべきだったエラー」を記録するための
 * セーフティネットです。level: 'warn' で記録し、開発時のエラーハンドリング漏れを
 * 検出します。
 *
 * NOTE: Error Boundaryでキャッチされないエラーをキャッチする。
 */
export function setupGlobalErrorHandlers(): () => void {
  if (IS_SERVER) {
    console.warn('setupGlobalErrorHandlers called in non-browser environment')
    return () => { /* no-op */ }
  }

  // イベントハンドラー内のエラーをキャッチ
  const handleError = (event: ErrorEvent) => {
    void reportClientError({
      module: ClientErrorType.WindowError,
      level: LogLevel.Warn,
      error: event.error ?? event.message,
      context: {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
      },
    })
  }

  // キャッチされていないPromiseをキャッチするハンドラー
  const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
    void reportClientError({
      module: ClientErrorType.UnhandledRejection,
      level: LogLevel.Warn,
      error: event.reason,
    })
  }

  // イベントリスナーを登録
  window.addEventListener('error', handleError)
  window.addEventListener('unhandledrejection', handleUnhandledRejection)

  // クリーンアップ関数を返す
  return () => {
    window.removeEventListener('error', handleError)
    window.removeEventListener('unhandledrejection', handleUnhandledRejection)
  }
}
```

### なぜ `LogLevel.Warn` なのか

このグローバルハンドラーでキャッチされるエラーは、**本来はError Boundaryで捕捉されるべきもの**である。ここに到達するということは、エラーハンドリングの設計に漏れがある可能性が高い。

- `LogLevel.Error` / `Fatal`: 実際のアプリケーションエラーとして認識されるべきレベル（Error Boundaryが担当）
- `LogLevel.Warn`: 「本来キャッチされるべきだったエラー」として、開発時のハンドリング漏れの検出に使用

これにより、ログ監視で `Warn` レベルの `window-error` や `unhandled-rejection` が検出された場合、適切なError Boundaryの追加を検討するという運用フローが成立する。

---

## エラーの流れまとめ

```
[ブラウザでエラー発生]
    |
    |--- レンダリング中のエラー?
    |       |
    |       |--- ルートレイアウト自体のエラー?
    |       |       └── Layer 1: global-error.tsx (Fatal)
    |       |
    |       |--- ClientErrorBoundary内のエラー?
    |       |       └── Layer 3: ClientErrorBoundary (カスタムFallback)
    |       |
    |       └── それ以外
    |               └── Layer 2: error.tsx (Error)
    |
    |--- イベントハンドラー内のエラー?
    |       └── 補助: window.onerror (Warn)
    |
    |--- 未処理のPromise reject?
    |       └── 補助: unhandledrejection (Warn)
    |
    └--- API通信エラー?
            |
            |--- HTTPレスポンスあり?
            |       └── ApiError (サブクラスで分類)
            |              └── fetcherのcatch節でログ記録
            |
            └── HTTPレスポンスなし?
                    └── NetworkError
                           └── reportClientError で直接ログ送信
```
