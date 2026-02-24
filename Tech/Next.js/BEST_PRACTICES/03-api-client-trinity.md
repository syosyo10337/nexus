# APIクライアント3種の使い分け

## 全体像

Birdcageでは、OpenAPI仕様から[Orval](https://orval.dev/)を使って**3種類のクライアント**を自動生成している。それぞれ用途・実行環境・通信経路が異なるため、正しく使い分けることが重要である。

| 種別 | ファイル拡張子 | fetcher | 用途 | baseUrl |
|------|--------------|---------|------|---------|
| Server Fetch | `*.ts` | `customServerFetch` | RSC / Server Actions | 直接BE API (`IBIS_API_SSR_BASE_PATH`) |
| Client Fetch (React Query) | `*.query.ts` | `customClientFetch` | Client Components (`useQuery` / `useMutation`) | `/api/proxy` 経由 |
| Zod Schema | `*.zod.ts` | - | バリデーション（リクエストボディ・パラメータ） | - |

**誤ったファイルからimportするとランタイムエラーになる。** Server Componentで `*.query.ts` を使うとReact Queryのクライアント依存でエラーになり、Client Componentで `*.ts` を使うと `server-only` モジュールにより即座にビルドエラーとなる。

```typescript
// Server Component / Server Action
import { getCommunityEvent } from '@/api/__generated__/endpoints/community-event-service/community-event-service'

// Client Component
import { useGetCommunityEvent } from '@/api/__generated__/endpoints/community-event-service/community-event-service.query'
```

---

## Orval設定 (`orval.config.ts`)

3種類のクライアント生成は、すべて `orval.config.ts` の `defineConfig` で宣言的に定義されている。

```typescript
// orval.config.ts
import { defineConfig } from 'orval'

import { replaceRequestInitType } from './orval-hooks/replace-request-init-type.ts'

const IBIS_SPEC_PATH = './wagtail/ibis/openapi/openapi3.yaml'
const OUTPUT_BASE_PATH = './src/api/__generated__'
const IBIS_API_SSR_BASE_PATH = process.env.IBIS_API_SSR_BASE_PATH ?? ''

// NOTE: 他サービス向けの内部スキーマを除外する
const IBIS_INPUT = {
  target: IBIS_SPEC_PATH,
  filters: {
    mode: 'exclude' as const,
    schemas: [/^ForDuckSvcGrpc/, /^ForWoodpeckerSvcGrpc/],
  },
}

export default defineConfig({
  // ─────────────────────────────────────────────
  // 1. apiIbis: サーバーサイド用fetchクライアント
  // ─────────────────────────────────────────────
  // RSC・Server Actionsから直接BE APIを呼ぶためのクライアント。
  // customServerFetch をmutatorに指定し、認証・テナントID・リクエストIDを自動注入する。
  apiIbis: {
    input: IBIS_INPUT,
    output: {
      mode: 'tags-split',
      target: `${OUTPUT_BASE_PATH}/endpoints`,
      schemas: `${OUTPUT_BASE_PATH}/models`,
      client: 'fetch',
      clean: true,
      baseUrl: IBIS_API_SSR_BASE_PATH,
      // NOTE: 生成されるモックだと、データの加工が必要なケースが多いため、手動でハンドラーを登録する。
      mock: false,
      override: {
        // NOTE: 認証やハンドリングを実装するためのfetch関数のwrapper
        mutator: {
          path: './src/api/fetchers/server.ts',
          name: 'customServerFetch',
        },
        fetch: {
          includeHttpResponseReturnType: false,
        },
      },
    },
    hooks: {
      /**
       * HACK: 生成されたfetchクライアントのRequestInit型をCustomServerFetchOptionsに置換
       *
       * Orval v7のclient: 'fetch'モードでは、RequestInit型のカスタマイズが
       * 設定プロパティだけではサポートされていないため、hooks で後処理を行う。
       *
       * 参考: https://github.com/orval-labs/orval/discussions/1610
       */
      afterAllFilesWrite: async (filePaths) => {
        console.log('🔧 生成ファイルの型を後処理中...')
        const paths = filePaths as string[]
        for (const filePath of paths) {
          if (filePath.includes('/endpoints/') && filePath.endsWith('.ts')) {
            await replaceRequestInitType(filePath)
          }
        }
        console.log('✨ 型の後処理が完了しました！')
      },
    },
  },

  // ─────────────────────────────────────────────
  // 2. zodIbis: Zodスキーマ生成
  // ─────────────────────────────────────────────
  // Server Actionsでのリクエストバリデーションに使用する。
  // param（パスパラメータ）と body のみ生成し、query・header・responseは生成しない。
  zodIbis: {
    input: IBIS_INPUT,
    output: {
      mode: 'tags-split',
      target: `${OUTPUT_BASE_PATH}/endpoints`,
      client: 'zod',
      fileExtension: '.zod.ts',
      override: {
        zod: {
          generate: {
            param: true,
            query: false,
            header: false,
            body: true,
            response: false,
          },
        },
      },
    },
  },

  // ─────────────────────────────────────────────
  // 3. reactQueryIbis: React Query hooks
  // ─────────────────────────────────────────────
  // Client Componentでのデータフェッチに使用する。
  // /api/proxy 経由でBE APIにリクエストを送る。
  // 現在はEventCheckInPortalServiceのみで使用している。
  reactQueryIbis: {
    input: {
      target: IBIS_SPEC_PATH,
      // NOTE: React Query hooks は現在 EventCheckInPortalService のみで使用
      filters: {
        mode: 'include',
        tags: ['EventCheckInPortalService'],
      },
    },
    output: {
      mode: 'tags-split',
      target: `${OUTPUT_BASE_PATH}/endpoints`,
      schemas: `${OUTPUT_BASE_PATH}/models`,
      client: 'react-query',
      httpClient: 'fetch',
      fileExtension: '.query.ts',
      clean: false, // fetchクライアントと同じディレクトリなのでfalseにする
      baseUrl: '/api/proxy', // API Routesにproxyするため
      override: {
        // NOTE: クライアントサイド用の認証やハンドリングを実装するfetch関数のwrapper
        mutator: {
          path: './src/api/fetchers/client.ts',
          name: 'customClientFetch',
        },
        fetch: {
          includeHttpResponseReturnType: false,
        },
        query: {
          useQuery: true,
          useMutation: true,
          signal: true, // AbortSignalサポート（リクエストキャンセル用）
        },
      },
    },
  },
})
```

### afterAllFilesWrite フック: RequestInit型パッチ

Orval v7の `client: 'fetch'` モードでは、生成コード内の `options` パラメータの型が `RequestInit` に固定される。`skipAuth` のようなカスタムオプションを渡すためには `CustomServerFetchOptions` に置換する必要がある。このフックで生成後にファイルを走査し、型を書き換える。

```typescript
// orval-hooks/replace-request-init-type.ts
import { readFile, writeFile } from 'node:fs/promises'

export async function replaceRequestInitType(filePath: string): Promise<void> {
  // .query.tsや.zod.tsファイルはスキップ
  if (filePath.endsWith('.query.ts') || filePath.endsWith('.zod.ts')) {
    return
  }

  const content = await readFile(filePath, 'utf-8')

  // RequestInitを含まないファイルはスキップ
  if (!content.includes('RequestInit')) {
    return
  }

  // 既にCustomServerFetchOptionsがimportされている場合はスキップ
  if (content.includes('CustomServerFetchOptions')) {
    return
  }

  let updatedContent = content

  // RequestInitをCustomServerFetchOptionsに置換
  updatedContent = updatedContent.replace(
    /\boptions\?: RequestInit\b/g,
    'options?: CustomServerFetchOptions',
  )

  // customServerFetchのimport文の後にCustomServerFetchOptionsを追加
  updatedContent = updatedContent.replace(
    /import { customServerFetch } from '(.+?\/fetchers\/server)';/,
    'import { customServerFetch, type CustomServerFetchOptions } from \'$1\';',
  )

  await writeFile(filePath, updatedContent, 'utf-8')
}
```

---

## `customServerFetch` (サーバーサイドfetcher)

RSCおよびServer Actionsから直接BE APIと通信するためのfetcher。認証情報、テナントID、リクエストIDを自動的にヘッダーに付与する。

```typescript
// src/api/fetchers/server.ts
import 'server-only'
import { cookies, headers } from 'next/headers'

import {
  AUTH_JS_SESSION_TOKEN_NAME,
  BIRDCAGE_SESSION_COOKIE_NAME,
} from '@/shared/constants/cookies'
import {
  ApiError,
  InternalServerError,
  createApiError,
} from '@/shared/errors/api-error'
import { getTenant } from '@/shared/utils/auth/tenant/get-tenant'
import { createLogger } from '@/shared/utils/logger'

import {
  extractErrorMessage,
  getContentTypeHeader,
  parseResponseBody,
} from './common'

const log = createLogger({ module: 'server-fetcher' })

export interface CustomServerFetchOptions extends RequestInit {
  /**
   * 認証をスキップするかどうか
   * trueの場合、セッショントークンとTenant-IDをヘッダーに含めない
   */
  skipAuth?: boolean
}

/**
 *
 * サーバ用fetch関数のwrapper
 *
 * BE APIとの通信に必要なcookieやtenant-idを取得して、リクエストヘッダーに付与する。
 */
export async function customServerFetch<T>(
  url: string,
  options: CustomServerFetchOptions,
): Promise<T> {
  const tenant = await getTenant()
  const tenantId = tenant?.id ?? 'unknown'
  const headersList = await headers()
  const requestId = headersList.get('x-request-id') ?? 'unknown'
  const method = options.method ?? 'UNKNOWN'

  const requestUrl = buildRequestUrl(url)
  const requestHeaders = await buildRequestHeaders(
    options.headers,
    options.body,
    options.skipAuth,
    requestId,
  )
  const requestInit: RequestInit = {
    ...options,
    headers: requestHeaders,
  }

  log.debug({
    tenantId,
    authSkipped: options.skipAuth,
    httpRequest: {
      requestMethod: method,
      requestUrl: requestUrl,
    },
  }, 'BE API request started')

  try {
    const response = await fetch(requestUrl, requestInit)
    const data = await parseResponseBody<T>(response)

    if (!response.ok) {
      throw createApiError(
        response.status,
        extractErrorMessage(data),
        data,
      )
    }

    return data as T
  } catch (error) {
    if (error instanceof ApiError) {
      log.error({
        requestId,
        tenantId,
        httpRequest: {
          requestMethod: method,
          requestUrl: requestUrl,
          status: error.status,
        },
        err: error,
      }, `BE API error occurred: [status: ${error.status}]`)
      throw error
    }

    // 予期しないエラー:（ネットワークエラー、タイムアウト等）
    const errorMessage = error instanceof Error
      ? error.message
      : 'Unexpected error in server fetch'
    log.error({
      requestId,
      tenantId,
      httpRequest: {
        requestMethod: method,
        requestUrl: requestUrl,
      },
      err: error,
    }, errorMessage)

    throw new InternalServerError(errorMessage, { originalError: error })
  }
}

const buildRequestUrl = (contextUrl: string): string => {
  // 相対パスの場合はbaseUrlと結合
  if (contextUrl.startsWith('/')) {
    return `${process.env.IBIS_API_SSR_BASE_PATH}${contextUrl}`
  }
  return contextUrl
}

const buildRequestHeaders = async (
  headers?: HeadersInit,
  body?: BodyInit | null,
  skipAuth = false,
  requestId?: string,
): Promise<HeadersInit> => {
  const contentTypeHeader = getContentTypeHeader(body)

  const defaultHeaders: HeadersInit = {
    ...contentTypeHeader,
    ...(requestId && { 'x-request-id': requestId }),
  }

  // 認証をスキップする場合は、Tenant-IDとセッショントークンを付与しない
  if (!skipAuth) {
    const [tenant, cookie] = await Promise.all([
      getTenant(),
      cookies(),
    ])

    if (tenant?.id) {
      defaultHeaders['X-Tenant-ID'] = tenant.id
    }

    // NOTE: Auth.jsのセッショントークンをBEとの認証に流用する。サーバ間通信のクッキーのやり取りを行う。
    const sessionToken = cookie.get(AUTH_JS_SESSION_TOKEN_NAME)
    if (sessionToken) {
      defaultHeaders['cookie'] = `${BIRDCAGE_SESSION_COOKIE_NAME}=${sessionToken.value};`
    }
  }

  return {
    ...defaultHeaders,
    ...headers,
  }
}
```

### 設計上のポイント

- **`import 'server-only'`**: このモジュールがクライアントバンドルに含まれるとビルドエラーとなる。サーバー専用コードが誤ってクライアントに混入することを防ぐガードレール。
- **Tenant ID自動注入**: `getTenant()` から取得したテナントIDを `X-Tenant-ID` ヘッダーに付与。マルチテナント環境での認証に必須。
- **Auth.jsセッションの流用**: クライアントのセッショントークンを取得し、BE APIとのサーバー間通信用Cookieとして転送する。
- **リクエストID伝搬**: `x-request-id` ヘッダーを受け渡すことで、フロントエンドからバックエンドまで一貫したトレーシングを実現。
- **`ApiError` ヒエラルキー**: Factory Patternにより、HTTPステータスコードに応じた型安全なエラークラスを自動生成する（詳細は [04-error-handling-strategy.md](./04-error-handling-strategy.md) を参照）。

---

## `customClientFetch` (クライアントサイドfetcher)

ブラウザ上のClient ComponentからAPI Routesを経由してBE APIと通信するためのfetcher。React Query hooksの内部で使用される。

```typescript
// src/api/fetchers/client.ts
'use client'

import { IS_SERVER } from '@/shared/constants/environment'
import {
  ApiError,
  InternalServerError,
  createApiError,
} from '@/shared/errors/api-error'
import { NetworkError } from '@/shared/errors/network-error'
import { reportClientError, ClientErrorType } from '@/shared/utils/logger/client'
import { LogLevel } from '@/shared/utils/logger/type'

import {
  extractErrorMessage,
  getContentTypeHeader,
  parseResponseBody,
} from './common'

export interface CustomClientFetchOptions extends RequestInit {
  /**
   * 認証をスキップするかどうか
   * trueの場合、/api/proxy-public経由でリクエストを行う
   * falseの場合、/api/proxy経由でリクエストを行う（デフォルト）
   */
  skipAuth?: boolean
}

/**
 * ブラウザ用fetch関数のwrapper
 * server-onlyコードに依存せず、クライアントサイドでのAPI呼び出しに対応
 */
export async function customClientFetch<T>(
  url: string,
  options: CustomClientFetchOptions = {},
): Promise<T> {
  if (IS_SERVER) {
    throw new Error('customClientFetch is for client use only')
  }

  const requestUrl = _buildRequestUrl(url, options.skipAuth)
  const requestHeaders = await _buildRequestHeaders(options.headers, options.body)

  const requestInit: RequestInit = {
    ...options,
    headers: requestHeaders,
    credentials: options.credentials ?? 'same-origin', // API Routesにproxyするため
  }

  try {
    const response = await fetch(requestUrl, requestInit)
    const data = await parseResponseBody<T>(response)

    if (!response.ok) {
      throw createApiError(
        response.status,
        extractErrorMessage(data),
        data,
      )
    }

    return data as T
  } catch (error) {
    // NOTE: ネットワークエラー: API Routes に到達しないため明示的にログ記録
    if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
      await reportClientError({
        module: ClientErrorType.NetworkError,
        level: LogLevel.Error,
        error: error,
        context: {
          method: options.method ?? 'UNKNOWN',
          url: requestUrl,
        },
      }).catch(() => { /* ログ送信自体が失敗しても無視（無限ループ回避） */ })
      throw new NetworkError()
    }

    if (error instanceof ApiError) {
      throw error
    }

    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred'

    throw new InternalServerError(
      errorMessage,
      { originalError: error },
    )
  }
}

/**
 * リクエストURLを生成する（ブラウザ用）
 */
const _buildRequestUrl = (contextUrl: string, skipAuth = false): string => {
  // 相対パスの場合
  if (!contextUrl.startsWith('/')) return contextUrl

  if (skipAuth && contextUrl.startsWith('/api/proxy/')) {
    const urlWithPublicProxy = contextUrl.replace('/api/proxy/', '/api/proxy-public/')
    return `${window.location.origin}${urlWithPublicProxy}`
  }

  return `${window.location.origin}${contextUrl}`
}

/**
 * リクエストヘッダーを生成する（ブラウザ用）
 */
const _buildRequestHeaders = async (
  headers?: HeadersInit,
  body?: BodyInit | null,
): Promise<HeadersInit> => {
  const contentTypeHeader = getContentTypeHeader(body)
  return {
    ...contentTypeHeader,
    ...headers,
  }
}
```

### 設計上のポイント

- **`skipAuth` によるプロキシパス切り替え**: `skipAuth: true` の場合、URLのパスを `/api/proxy/` から `/api/proxy-public/` に書き換える。公開APIへのアクセスに使用。
- **`NetworkError` の識別**: `TypeError: Failed to fetch` はAPI Routeに到達する前のネットワーク障害を意味する。これを `NetworkError` として明示的に分離し、UIレベルでオフライン状態を適切にハンドリングできるようにしている。
- **クライアントエラーレポート**: ネットワークエラー時、通常のサーバーログには記録されない（リクエストがサーバーに到達しないため）。`reportClientError` で `/api/logs/client-errors` に直接POST送信し、Pinoロガーで記録する。

---

## 共有ユーティリティ (`common.ts`)

サーバーサイドとクライアントサイドの両方のfetcherで共通して使用するユーティリティ関数群。

```typescript
// src/api/fetchers/common.ts

/**
 * レスポンスボディをパースする (共通)
 */
export async function parseResponseBody<T>(response: Response): Promise<T> {
  const contentType = response.headers.get('content-type')

  if (contentType?.includes('application/json')) {
    return response.json()
  }

  return response.text() as Promise<T>
}

/**
 * APIレスポンスからエラーメッセージを抽出する (共通)
 */
export function extractErrorMessage(data: unknown): string {
  if (data && typeof data === 'object' && 'message' in data) {
    return (data as { message: string }).message
  }
  if (data && typeof data === 'string') {
    return data
  }
  return 'API request failed'
}

/**
 * Content-Typeヘッダーを設定する (共通)
 */
export function getContentTypeHeader(body?: BodyInit | null): Record<string, string> {
  // FormDataの場合はContent-Typeを設定しない（ブラウザが自動的に設定する）
  if (body && !(body instanceof FormData)) {
    return { 'Content-Type': 'application/json' }
  }
  return {}
}
```

---

## プロキシルートハンドラ

Client Componentからのリクエストは、Next.jsのAPI Routesを経由してBE APIに転送される。この中間層が認証情報の付与やエラーハンドリングを担う。

### ルートハンドラ (`route.ts`)

```typescript
// src/app/api/proxy/[...path]/route.ts
import 'server-only'
import type { NextRequest, NextResponse } from 'next/server'

import { handleProxyRequest } from '@/shared/utils/api/proxy-handler'

/**
 * BE APIへのプロキシAPI Route
 *
 * 責務:
 * 1. セッション認証
 * 2. Tenant-ID検証
 * 3. Cookie変換（Auth.js → BE）
 * 4. BE APIへのリクエスト転送
 */

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
): Promise<NextResponse> {
  const { path } = await params
  return handleProxyRequest(request, path, 'GET')
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
): Promise<NextResponse> {
  const { path } = await params
  return handleProxyRequest(request, path, 'POST')
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
): Promise<NextResponse> {
  const { path } = await params
  return handleProxyRequest(request, path, 'PUT')
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
): Promise<NextResponse> {
  const { path } = await params
  return handleProxyRequest(request, path, 'PATCH')
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
): Promise<NextResponse> {
  const { path } = await params
  return handleProxyRequest(request, path, 'DELETE')
}
```

### プロキシハンドラ (`proxy-handler.ts`)

```typescript
// src/shared/utils/api/proxy-handler.ts
import 'server-only'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import type { Logger } from 'pino'

import { customServerFetch } from '@/api/fetchers/server'
import { createLogger } from '@/shared/utils/logger'

interface ProxyRequestOptions {
  /** 認証をスキップするかどうか */
  skipAuth?: boolean
  /** ログモジュール名 */
  moduleName?: string
}

/**
 * プロキシリクエストを処理する共通ハンドラー
 */
export async function handleProxyRequest(
  request: NextRequest,
  path: string[],
  method: string,
  {
    skipAuth = false,
    moduleName = 'api-proxy',
  }: ProxyRequestOptions = {},
): Promise<NextResponse> {
  const log = createLogger({ module: moduleName })
  const fullPath = buildFullPath(path, request.nextUrl.searchParams)

  try {
    const body = await extractRequestBody(request, method)
    const headers = extractCustomHeaders(request)

    const data = await customServerFetch(fullPath, {
      method,
      ...(body !== undefined && { body }),
      ...(skipAuth && { skipAuth: true }),
      headers,
    })

    log.debug({
      authSkipped: skipAuth,
      httpRequest: {
        requestMethod: method,
        requestUrl: fullPath,
      },
    }, `Proxy request completed successfully`)

    return NextResponse.json(data)
  } catch (error) {
    return handleProxyError(error, log, fullPath, method, request.headers)
  }
}

/**
 * パスを再構築する
 */
function buildFullPath(path: string[], searchParams: URLSearchParams): string {
  const apiPath = `/${path.join('/')}`
  const queryString = searchParams.toString()
  return queryString ? `${apiPath}?${queryString}` : apiPath
}

/**
 * リクエストボディを取得する
 */
async function extractRequestBody(
  request: NextRequest,
  method: string,
): Promise<BodyInit | undefined> {
  if (method === 'GET' || method === 'HEAD') {
    return undefined
  }

  const contentType = request.headers.get('content-type')

  if (contentType?.includes('application/json')) {
    return JSON.stringify(await request.json())
  }
  if (contentType?.includes('multipart/form-data')) {
    return await request.formData()
  }
  return await request.text()
}

/**
 * カスタムヘッダーを抽出する
 * バックエンドAPIに転送する必要のあるカスタムヘッダーを抽出
 */
function extractCustomHeaders(request: NextRequest): HeadersInit {
  const customHeaders: Record<string, string> = {}

  // X- プレフィックスのカスタムヘッダーを転送
  request.headers.forEach((value, key) => {
    if (key.toLowerCase().startsWith('x-')) {
      customHeaders[key] = value
    }
  })

  return customHeaders
}
```

### プロキシの役割

プロキシ層が存在する理由は以下の通り。

1. **認証情報の隠蔽**: ブラウザはセッショントークンをCookieとして保持するが、BE API向けのヘッダー形式への変換はサーバー側で行う。クライアントにBE APIの認証方式を露出しない。
2. **テナントID付与**: マルチテナント環境でのリクエストに `X-Tenant-ID` を付与する処理をサーバー側に集約。
3. **CORS回避**: ブラウザから直接BE APIにリクエストするとCORSの問題が発生するが、同一オリジンのAPI Routesを経由することで回避。
4. **カスタムヘッダー転送**: `X-` プレフィックスのカスタムヘッダーを自動的にBE APIに転送する。

---

## リクエストフロー図

```
[ブラウザ]
    |
    |--- RSC / Server Action --------------------------> customServerFetch --> Backend API
    |                                                     (直接通信)
    |                                                     ・Tenant ID 注入
    |                                                     ・Auth Token 注入
    |                                                     ・Request ID 伝搬
    |
    |--- Client Component (React Query) --> /api/proxy/... --> customServerFetch --> Backend API
                                            (API Route経由)
                                            ・X-ヘッダー転送
                                            ・Body抽出・変換
                                            ・エラーレスポンス変換
```

### 具体例: イベント一覧の取得

**Server Component（RSC）の場合:**

```
Page Component (RSC)
  └─> getCommunityEvents()                     // *.ts から import
        └─> customServerFetch('/v1/events')    // 直接BE APIへ
              ├─ Header: X-Tenant-ID: xxx
              ├─ Header: Cookie: session=yyy
              └─ Header: x-request-id: zzz
```

**Client Component（React Query）の場合:**

```
EventList Component (Client)
  └─> useListAdmissions()                              // *.query.ts から import
        └─> customClientFetch('/api/proxy/v1/events')  // API Route経由
              └─> /api/proxy/[...path]/route.ts
                    └─> handleProxyRequest()
                          └─> customServerFetch('/v1/events')  // BE APIへ
```

---

## 使い分けのガイドライン

| シーン | 使うべきクライアント | 理由 |
|--------|---------------------|------|
| ページ初期表示のデータ取得 | Server Fetch (`*.ts`) | RSCで直接取得。ウォーターフォール回避。 |
| フォーム送信・データ更新 | Server Fetch (`*.ts`) via Server Actions | `'use server'` 内で直接BE APIを呼ぶ。 |
| リアルタイム検索・フィルタリング | React Query (`*.query.ts`) | ユーザー操作に応じたインクリメンタルなフェッチ。 |
| リクエストボディのバリデーション | Zod Schema (`*.zod.ts`) | Server Actions内でZodスキーマによる入力検証。 |

### 原則

- **サーバーで完結できるならサーバーで行う**: RSCやServer Actionsを優先し、Client Componentからのフェッチは本当に必要な場合（ユーザー操作トリガー等）のみ使用する。
- **生成コードは直接編集しない**: `src/api/__generated__/` 配下のファイルは `./bin/gen` で再生成されるため、手動編集は禁止。カスタマイズはfetcher層やOrval設定で行う。
- **Zodスキーマはバリデーション専用**: Server Actionsでのリクエストバリデーションに使用し、レスポンスのバリデーションには使用しない（`response: false` で生成していない）。
