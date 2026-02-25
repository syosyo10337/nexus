---
tags:
  - nextjs
  - api-client
  - orval
  - fetch
created: 2026-02-24
updated_at: 2026-02-24
status: active
---

# APIクライアント: fetcher実装

## 関連ドキュメント

- [APIクライアント全体像 & Orval設定](./03a-api-client-overview.md) -- 共有ユーティリティ (`common.ts`) もこちらに記載
- [APIクライアント: プロキシ & 使い分け](./03c-api-client-proxy.md)

## `customServerFetch` (サーバーサイドfetcher)

RSCおよびServer Actionsから直接BE APIと通信するためのfetcher。認証情報、テナントID、リクエストIDを自動的にヘッダーに付与する。

```typescript
// src/api/fetchers/server.ts
import "server-only";
import { cookies, headers } from "next/headers";
import { AUTH_JS_SESSION_TOKEN_NAME, BIRDCAGE_SESSION_COOKIE_NAME } from "@/shared/constants/cookies";
import { ApiError, InternalServerError, createApiError } from "@/shared/errors/api-error";
import { getTenant } from "@/shared/utils/auth/tenant/get-tenant";
import { createLogger } from "@/shared/utils/logger";
import { extractErrorMessage, getContentTypeHeader, parseResponseBody } from "./common";

const log = createLogger({ module: "server-fetcher" });

export interface CustomServerFetchOptions extends RequestInit {
  /** 認証をスキップするかどうか。trueの場合、セッショントークンとTenant-IDをヘッダーに含めない */
  skipAuth?: boolean;
}

/**
 * サーバ用fetch関数のwrapper
 * BE APIとの通信に必要なcookieやtenant-idを取得して、リクエストヘッダーに付与する。
 */
export async function customServerFetch<T>(
  url: string,
  options: CustomServerFetchOptions
): Promise<T> {
  const tenant = await getTenant();
  const tenantId = tenant?.id ?? "unknown";
  const headersList = await headers();
  const requestId = headersList.get("x-request-id") ?? "unknown";
  const method = options.method ?? "UNKNOWN";

  const requestUrl = buildRequestUrl(url);
  const requestHeaders = await buildRequestHeaders(
    options.headers, options.body, options.skipAuth, requestId
  );
  const requestInit: RequestInit = { ...options, headers: requestHeaders };

  log.debug(
    { tenantId, authSkipped: options.skipAuth,
      httpRequest: { requestMethod: method, requestUrl } },
    "BE API request started"
  );

  try {
    const response = await fetch(requestUrl, requestInit);
    const data = await parseResponseBody<T>(response);
    if (!response.ok) {
      throw createApiError(response.status, extractErrorMessage(data), data);
    }
    return data as T;
  } catch (error) {
    if (error instanceof ApiError) {
      log.error(
        { requestId, tenantId,
          httpRequest: { requestMethod: method, requestUrl, status: error.status },
          err: error },
        `BE API error occurred: [status: ${error.status}]`
      );
      throw error;
    }

    const errorMessage =
      error instanceof Error ? error.message : "Unexpected error in server fetch";
    log.error(
      { requestId, tenantId,
        httpRequest: { requestMethod: method, requestUrl },
        err: error },
      errorMessage
    );
    throw new InternalServerError(errorMessage, { originalError: error });
  }
}

const buildRequestUrl = (contextUrl: string): string => {
  if (contextUrl.startsWith("/")) {
    return `${process.env.IBIS_API_SSR_BASE_PATH}${contextUrl}`;
  }
  return contextUrl;
};

const buildRequestHeaders = async (
  headers?: HeadersInit, body?: BodyInit | null,
  skipAuth = false, requestId?: string
): Promise<HeadersInit> => {
  const contentTypeHeader = getContentTypeHeader(body);
  const defaultHeaders: HeadersInit = {
    ...contentTypeHeader,
    ...(requestId && { "x-request-id": requestId }),
  };

  if (!skipAuth) {
    const [tenant, cookie] = await Promise.all([getTenant(), cookies()]);
    if (tenant?.id) {
      defaultHeaders["X-Tenant-ID"] = tenant.id;
    }
    // NOTE: Auth.jsのセッショントークンをBEとの認証に流用する
    const sessionToken = cookie.get(AUTH_JS_SESSION_TOKEN_NAME);
    if (sessionToken) {
      defaultHeaders["cookie"] =
        `${BIRDCAGE_SESSION_COOKIE_NAME}=${sessionToken.value};`;
    }
  }

  return { ...defaultHeaders, ...headers };
};
```

### 設計上のポイント

- **`import 'server-only'`**: クライアントバンドルに含まれるとビルドエラーとなるガードレール。
- **Tenant ID自動注入**: `getTenant()` から取得したテナントIDを `X-Tenant-ID` ヘッダーに付与。マルチテナント環境での認証に必須。
- **Auth.jsセッションの流用**: クライアントのセッショントークンをBE APIとのサーバー間通信用Cookieとして転送。
- **リクエストID伝搬**: `x-request-id` ヘッダーにより、フロントエンドからバックエンドまで一貫したトレーシングを実現。
- **`ApiError` ヒエラルキー**: HTTPステータスコードに応じた型安全なエラークラスを自動生成（詳細は [エラークラス設計](./05-error-class-design.md) を参照）。

---

## `customClientFetch` (クライアントサイドfetcher)

ブラウザ上のClient ComponentからAPI Routesを経由してBE APIと通信するためのfetcher。React Query hooksの内部で使用される。

```typescript
// src/api/fetchers/client.ts
"use client";
import { IS_SERVER } from "@/shared/constants/environment";
import { ApiError, InternalServerError, createApiError } from "@/shared/errors/api-error";
import { NetworkError } from "@/shared/errors/network-error";
import { reportClientError, ClientErrorType } from "@/shared/utils/logger/client";
import { LogLevel } from "@/shared/utils/logger/type";
import { extractErrorMessage, getContentTypeHeader, parseResponseBody } from "./common";

export interface CustomClientFetchOptions extends RequestInit {
  /**
   * 認証をスキップするかどうか
   * trueの場合、/api/proxy-public経由でリクエストを行う
   * falseの場合、/api/proxy経由でリクエストを行う（デフォルト）
   */
  skipAuth?: boolean;
}

/**
 * ブラウザ用fetch関数のwrapper
 * server-onlyコードに依存せず、クライアントサイドでのAPI呼び出しに対応
 */
export async function customClientFetch<T>(
  url: string,
  options: CustomClientFetchOptions = {}
): Promise<T> {
  if (IS_SERVER) {
    throw new Error("customClientFetch is for client use only");
  }

  const requestUrl = _buildRequestUrl(url, options.skipAuth);
  const requestHeaders = await _buildRequestHeaders(options.headers, options.body);
  const requestInit: RequestInit = {
    ...options,
    headers: requestHeaders,
    credentials: options.credentials ?? "same-origin",
  };

  try {
    const response = await fetch(requestUrl, requestInit);
    const data = await parseResponseBody<T>(response);
    if (!response.ok) {
      throw createApiError(response.status, extractErrorMessage(data), data);
    }
    return data as T;
  } catch (error) {
    if (error instanceof TypeError && error.message.includes("Failed to fetch")) {
      await reportClientError({
        module: ClientErrorType.NetworkError, level: LogLevel.Error,
        error, context: { method: options.method ?? "UNKNOWN", url: requestUrl },
      }).catch(() => {});
      throw new NetworkError();
    }
    if (error instanceof ApiError) {
      throw error;
    }
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    throw new InternalServerError(errorMessage, { originalError: error });
  }
}

const _buildRequestUrl = (contextUrl: string, skipAuth = false): string => {
  if (!contextUrl.startsWith("/")) return contextUrl;
  if (skipAuth && contextUrl.startsWith("/api/proxy/")) {
    return `${window.location.origin}${contextUrl.replace("/api/proxy/", "/api/proxy-public/")}`;
  }
  return `${window.location.origin}${contextUrl}`;
};

const _buildRequestHeaders = async (
  headers?: HeadersInit, body?: BodyInit | null
): Promise<HeadersInit> => {
  const contentTypeHeader = getContentTypeHeader(body);
  return { ...contentTypeHeader, ...headers };
};
```

### 設計上のポイント

- **`skipAuth` によるプロキシパス切り替え**: `skipAuth: true` の場合、`/api/proxy/` を `/api/proxy-public/` に書き換える。公開APIへのアクセスに使用。
- **`NetworkError` の識別**: `TypeError: Failed to fetch` をネットワーク障害として明示的に分離し、UIレベルでオフライン状態をハンドリング可能にしている。
- **クライアントエラーレポート**: ネットワークエラーはサーバーログに記録されないため、`reportClientError` で `/api/logs/client-errors` に直接POST送信する。
