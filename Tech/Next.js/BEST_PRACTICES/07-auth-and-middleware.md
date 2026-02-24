# 認証 & ミドルウェア

NextAuth.js 5 beta を用いた認証設定、ミドルウェアによるアクセス制御、Request ID の伝播、テナント情報の取得パターンをまとめる。

---

## NextAuth.js 5 beta 設定

```typescript
// src/auth.ts
import { SignInError } from '@auth/core/errors'
import { decode, encode } from '@auth/core/jwt'
import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'

import { AUTH_JS_SESSION_TOKEN_NAME } from './shared/constants/cookies'
import { getAuthJwtSalt } from './shared/utils/auth/secret'

// ClientIDやsecretは環境変数から取得する
// cf. https://authjs.dev/getting-started/authentication/oauth
export const { handlers, signIn, signOut, auth } = NextAuth({
  useSecureCookies: true,
  providers: [Google],
  // NOTE: default値のままだが、JWTを使ったセッション戦略を使っていることを明示する
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
  },
  cookies: {
    sessionToken: {
      // NOTE: Auth.jsのセッショントークン(明示的に定義する)
      name: AUTH_JS_SESSION_TOKEN_NAME,
    },
  },
  jwt: {
    encode: async (params) => {
      return await encode({
        ...params,
        // NOTE: こちらもデフォルトのcookie名に依存しないように明示的に定義する。
        // cf. __Secure-authjs.session-token
        salt: getAuthJwtSalt(),
      })
    },
    decode: async (params) => {
      return await decode({
        ...params,
        salt: getAuthJwtSalt(),
      })
    },
  },
  callbacks: {
    async signIn({ account, profile }) {
      if (!account || !profile) return false
      if (account.provider !== 'google') return false

      // NOTE: 社員にアクセスを制限する。cf. https://authjs.dev/guides/restricting-user-access
      if (!profile.email_verified || !profile.email?.endsWith('@syoya.com')) {
        throw new SignInError('許可されていないドメインです')
      }

      return true
    },
  },
})
```

### 各セクションの解説

| セクション | 設定値 | 解説 |
| --- | --- | --- |
| `useSecureCookies` | `true` | HTTPS 必須の本番設定。Cookie に `Secure` 属性が付与され、HTTPS 経由でのみ送信される |
| `session.strategy` | `'jwt'` | JWT 戦略を明示的に指定。NextAuth.js のデフォルト値だが、セッション管理方式をコード上で明確にするために記述している |
| `session.maxAge` | `30 * 24 * 60 * 60` | セッションの有効期限を 30 日間に設定 |
| `cookies.sessionToken.name` | `AUTH_JS_SESSION_TOKEN_NAME` | Cookie 名を明示定義。デフォルト名 `__Secure-authjs.session-token` に依存しないことで、BE との通信時に Cookie 名を制御可能にする |
| `jwt.encode` / `jwt.decode` | カスタム salt 設定 | Auth.js はデフォルトで Cookie 名を salt として使用するが、Cookie 名をカスタマイズしているため、salt も明示的に設定する必要がある |
| `callbacks.signIn` | ドメイン制限 | 社内ツールのため `@syoya.com` ドメインのみ許可。`email_verified` のチェックも行い、未検証のメールアドレスを拒否する |

### JWT salt のバリデーション

```typescript
// src/shared/utils/auth/secret.ts
import 'server-only'

let cached: string | undefined

export function getAuthJwtSalt(): string {
  const value = cached ?? process.env.AUTH_JWT_SALT
  if (!value) throw new Error('AUTH_JWT_SALT is required')
  if (value.length < 32) throw new Error('AUTH_JWT_SALT must be >= 32 chars')
  cached = value
  return value
}
```

- `server-only` インポートにより、クライアントサイドでの誤使用を防止
- 環境変数が未設定または不十分な長さの場合、起動時にエラーをスローする
- `cached` 変数でメモ化し、毎回の環境変数アクセスを避ける

---

## ミドルウェア

```typescript
// src/middleware.ts
import { NextResponse } from 'next/server'

import { auth as middleware } from '@/auth'

/**
 * 認証チェックをスキップするパス
 *
 * - middleware内での認証チェックを行わないパスを定義
 * - request-idの付与は全パスで行われる
 */
const authExemptPaths = [
  '/login',
  '/external',
  '/api/auth',        // Auth.js認証エンドポイント
  '/api/proxy-public', // 公開APIプロキシ（skipAuth: true）
  '/api/livez',       // Liveness probe
  '/api/readyz',      // Readiness probe
  '/api/logs/client-errors', // クライアントエラーログ
]

const isAuthExempt = (pathname: string): boolean => {
  return authExemptPaths.some(path => pathname.startsWith(path))
}

export default middleware((req) => {
  const requestId = req.headers.get('x-request-id') ?? crypto.randomUUID()

  let response = NextResponse.next()
  if (!req.auth && !isAuthExempt(req.nextUrl.pathname)) {
    response = NextResponse.redirect(new URL('/login', req.nextUrl.origin))
  }

  response.headers.set('x-request-id', requestId)
  return response
})

// assetなどに関しては、ミドルウェアを適用しない
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|images|public).*)',
  ],
}
```

### 各要素の解説

| 要素 | 解説 |
| --- | --- |
| `auth as middleware` | NextAuth.js の `auth` 関数をミドルウェアとして利用する。コールバック引数の `req.auth` でセッション情報にアクセスできる。認証済みであれば `req.auth` にセッションオブジェクトが入り、未認証であれば `null` となる |
| Request ID 生成 | 既存の `x-request-id` ヘッダーがあればそれを使用し、なければ `crypto.randomUUID()` で新規生成する。ロードバランサーやリバースプロキシが付与した ID を引き継ぐ設計 |
| `authExemptPaths` | 認証不要パスのリスト。ログインページ、外部公開ページ、Auth.js エンドポイント、公開 API プロキシ、ヘルスチェック等を含む。`startsWith` でマッチするため、サブパスも自動的に除外される |
| `matcher` | 静的アセット（`_next/static`, `_next/image`, `favicon.ico`, `images`, `public`）をミドルウェアの処理対象から除外する。これにより不要な認証チェックを回避し、パフォーマンスを維持する |

---

## Request ID 伝播フロー

Request ID はリクエストの全ライフサイクルを通じて伝播し、ログの追跡を可能にする。

```
[Browser Request]
    |
    v
[Middleware] --- x-request-id生成（なければ crypto.randomUUID()）
    |
    v
[Page / API Route]
    |
    v
[customServerFetch] --- headers()からx-request-idを取得
    |                    リクエストヘッダーに付与
    v
[Backend API] --- x-request-idでリクエストを追跡
    |
    v
[Logger] --- requestIdをログコンテキストに含めて出力
```

### customServerFetch での Request ID 取得

```typescript
// src/api/fetchers/server.ts
export async function customServerFetch<T>(
  url: string,
  options: CustomServerFetchOptions,
): Promise<T> {
  const tenant = await getTenant()
  const tenantId = tenant?.id ?? 'unknown'
  const headersList = await headers()
  const requestId = headersList.get('x-request-id') ?? 'unknown'
  // ...

  log.debug({
    tenantId,
    authSkipped: options.skipAuth,
    httpRequest: {
      requestMethod: method,
      requestUrl: requestUrl,
    },
  }, 'BE API request started')

  // ...
}
```

```typescript
// buildRequestHeaders 内でリクエストヘッダーに付与
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
  // ...
}
```

ミドルウェアで生成された `x-request-id` は `next/headers` の `headers()` 関数を通じて Server Component や Server Action から取得できる。`customServerFetch` はこの値を BE API へのリクエストヘッダーに自動的に付与する。エラー発生時のログにも `requestId` を含めることで、フロントエンドからバックエンドまでの一連のリクエストを追跡可能にしている。

---

## テナント取得: React `cache()` によるdedup

```typescript
// src/shared/utils/auth/tenant/get-tenant.ts
import { cache } from 'react'

import { IS_SERVER } from '@/shared/constants/environment'
import type { CurrentTenant } from '@/shared/types/tenant'

import { getTenantCookie } from './tenant-cookie'
import { getTenantFromClientCookie } from './tenant-cookie-client'
import { createLogger } from '../../logger'

const log = createLogger({ module: 'get-tenant' })

/**
 * テナント情報取得の統合インターフェース
 * - Server Components: Cookieから直接取得（next/headers）
 * - Client Components: Cookieから直接取得（document.cookie）
 *
 * 注意: クライアント側で取得した値はUI表示のみに使用。
 * API呼び出しにはプロキシが自動的にサーバー側のCookieから取得する。
 */
export const getTenant = async (): Promise<CurrentTenant | undefined> => {
  if (!IS_SERVER) return getTenantFromClientCookie()

  return getServerTenant()
}

/**
 * サーバーサイド用のテナント情報取得関数
 */
const getServerTenant = cache(async (): Promise<CurrentTenant | undefined> => {
  const tenant = await getTenantCookie()

  if (!tenant) {
    log.info('No tenant selected yet')
    return undefined
  }

  return tenant
})
```

### 設計のポイント

| 要素 | 解説 |
| --- | --- |
| `cache()` | React の `cache()` 関数で同一リクエスト内の重複実行を防止する。RSC のレンダリングツリー内で `getTenant()` が複数回呼ばれても、Cookie の読み取りは 1 回だけ実行される |
| Server/Client 分岐 | `IS_SERVER` フラグでサーバーとクライアントの実装を切り替える。サーバーでは `next/headers` の `cookies()` を使用し、クライアントでは `document.cookie` を解析する |
| クライアント側の注意 | クライアントで取得したテナント情報は UI 表示専用。API 呼び出し時のテナント ID は、プロキシがサーバー側の Cookie から自動取得する |

### IS_SERVER の判定

```typescript
// src/shared/constants/environment.ts
export const PROJECT_ID = 'birdcage' as const
export const ENV = process.env.ENV ?? 'local' as const
// HACK:storybook-viteでwindowが存在するが、typeof window === 'undefined'となるため
// cf. https://github.com/storybookjs/storybook/issues/32028
export const IS_SERVER = !('window' in globalThis)
```

通常の `typeof window === 'undefined'` ではなく `!('window' in globalThis)` を使用している。これは Storybook の Vite 環境で `window` が存在するにもかかわらず `typeof window === 'undefined'` が `true` を返す問題への対応である。

---

## Cookie 名の設計

```typescript
// src/shared/constants/cookies.ts
import { ENV, PROJECT_ID } from './environment'

export const CURRENT_TENANT_KEY = 'current-tenant' as const

export const TENANT_COOKIE_OPTIONS = {
  httpOnly: false,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge: 60 * 60 * 24 * 30, // 30日間
  path: '/',
} as const

export const AUTH_JS_SESSION_TOKEN_NAME = 'authjs.session-token' as const

// BEとの通信用Cookie名（環境別）
export const BIRDCAGE_SESSION_COOKIE_NAME = `${PROJECT_ID}-session.${ENV}`
```

### Cookie の役割

| Cookie 名 | 用途 | 解説 |
| --- | --- | --- |
| `authjs.session-token` | Auth.js セッショントークン | Google OAuth で取得した JWT トークンを格納する。Auth.js のデフォルト名に依存せず明示的に定義している |
| `birdcage-session.{ENV}` | BE 通信用セッション | Auth.js のセッショントークンを BE との認証に流用する際の Cookie 名。環境変数 `ENV`（`local`, `staging`, `production` 等）がサフィックスに付き、環境ごとに Cookie を分離する |

### BE 通信時の Cookie 変換

```typescript
// src/api/fetchers/server.ts（buildRequestHeaders 内）
// NOTE: Auth.jsのセッショントークンをBEとの認証に流用する。
// サーバ間通信のクッキーのやり取りを行う。
const sessionToken = cookie.get(AUTH_JS_SESSION_TOKEN_NAME)
if (sessionToken) {
  defaultHeaders['cookie'] = `${BIRDCAGE_SESSION_COOKIE_NAME}=${sessionToken.value};`
}
```

ブラウザから受け取った `authjs.session-token` の値を `birdcage-session.{ENV}` という名前で BE に転送する。これにより、Auth.js の認証基盤と BE 独自の認証基盤を橋渡ししている。
