---
tags:
  - design-pattern
  - creational
  - di
  - factory
created: 2026-01-04
status: active
---

# Simple Factory pattern(static factory pattern)

シンプルファクトリーパターンとは、大きな制御条件を伴う,1 つの生成メソッドを持つクラスのことです。

この生成メソッドは、引数に基づく条件分岐で、どの製品クラスをインスタンス化・リターンするかを選択する

> The **Simple factory** pattern  describes a class that has one creation method with a large conditional that based on method parameters chooses which product class to instantiate and then return.

人々は通常、シンプルファクトリを一般的なファクトリーパターンやクリエイショナルデザインパターンの 1 つと混同する。ほとんどの場合、シンプルファクトリは Factory Method や Abstract Factory パターンを導入するための中間ステップである。」

> People usually confuse *simple factories* with a general *factories* or with one of the creational design patterns. In most cases, a simple factory is an intermediate step of introducing **[Factory Method](https://refactoring.guru/design-patterns/factory-method)** or **[Abstract Factory](https://refactoring.guru/design-patterns/abstract-factory)** patterns.

A simple factory is usually represented by a single method in a single class. Over time, this method might become too big, so you may decide to extract parts of the method to subclasses. Once you do it several times, you might discover that the whole thing turned into the classic *factory method* pattern.

By the way, if you declare a simple factory `abstract`, it doesn’t magically become the *abstract factory* pattern.

## 実装例: Error Handler

````TypeScript
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
 *
 * @param status - HTTPステータスコード
 * @param message - エラーメッセージ
 * @param data - 追加のエラーデータ
 * @returns 適切なエラークラスのインスタンス
 *
 * @example
 * ```typescript
 * // 400エラーの作成
 * const error = createApiError(400, 'Invalid input')
 *
 * // 500エラーの作成
 * const serverError = createApiError(500, 'Server error', { details: '...' })
 * ```
 */
export const createApiError = (
  status: number,
  message: string,
  data?: unknown,
): ApiError => {
  const factory = errorFactories[status]
  return factory?.create(message, data) ?? new ApiError(status, message, data)
}


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
````

```typescript
// 呼び出し側の実装例
import "server-only";
import { cookies, headers } from "next/headers";

import {
  AUTH_JS_SESSION_TOKEN_NAME,
  BIRDCAGE_SESSION_COOKIE_NAME,
} from "@/shared/constants/cookies";
import {
  ApiError,
  InternalServerError,
  createApiError,
} from "@/shared/errors/api-error";
import { getTenant } from "@/shared/utils/auth/tenant/get-tenant";
import { createLogger } from "@/shared/utils/logger";

import {
  extractErrorMessage,
  getContentTypeHeader,
  parseResponseBody,
} from "./common";

const log = createLogger({ module: "server-fetcher" });

export interface CustomServerFetchOptions extends RequestInit {
  /**
   * 認証をスキップするかどうか
   * trueの場合、セッショントークンとTenant-IDをヘッダーに含めない
   */
  skipAuth?: boolean;
}

/**
 *
 * サーバ用fetch関数のwrapper
 *
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
    options.headers,
    options.body,
    options.skipAuth,
    requestId
  );
  const requestInit: RequestInit = {
    ...options,
    headers: requestHeaders,
  };

  log.debug(
    {
      tenantId,
      authSkipped: options.skipAuth,
      httpRequest: {
        requestMethod: method,
        requestUrl: requestUrl,
      },
    },
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
        {
          requestId,
          tenantId,
          httpRequest: {
            requestMethod: method,
            requestUrl: requestUrl,
            status: error.status,
          },
          err: error,
        },
        `BE API error occurred: [status: ${error.status}]`
      );
      throw error;
    }

    // 予期しないエラー:（ネットワークエラー、タイムアウト等）
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Unexpected error in server fetch";
    log.error(
      {
        requestId,
        tenantId,
        httpRequest: {
          requestMethod: method,
          requestUrl: requestUrl,
        },
        err: error,
      },
      errorMessage
    );

    throw new InternalServerError(errorMessage, { originalError: error });
  }
}

const buildRequestUrl = (contextUrl: string): string => {
  // 相対パスの場合はbaseUrlと結合
  if (contextUrl.startsWith("/")) {
    return `${process.env.IBIS_API_SSR_BASE_PATH}${contextUrl}`;
  }
  return contextUrl;
};

const buildRequestHeaders = async (
  headers?: HeadersInit,
  body?: BodyInit | null,
  skipAuth = false,
  requestId?: string
): Promise<HeadersInit> => {
  const contentTypeHeader = getContentTypeHeader(body);

  const defaultHeaders: HeadersInit = {
    ...contentTypeHeader,
    ...(requestId && { "x-request-id": requestId }),
  };

  // 認証をスキップする場合は、Tenant-IDとセッショントークンを付与しない
  if (!skipAuth) {
    const [tenant, cookie] = await Promise.all([getTenant(), cookies()]);

    if (tenant?.id) {
      defaultHeaders["X-Tenant-ID"] = tenant.id;
    }

    // NOTE: Auth.jsのセッショントークンをBEとの認証に流用する。サーバ間通信のクッキーのやり取りを行う。。
    // cf. https://github.com/nextauthjs/next-auth/blob/39dd3b92de194c1a835f2d87631f4deb9d9fdf65/packages/core/src/lib/init.ts#L107C1-L113C1
    const sessionToken = cookie.get(AUTH_JS_SESSION_TOKEN_NAME);
    if (sessionToken) {
      defaultHeaders[
        "cookie"
      ] = `${BIRDCAGE_SESSION_COOKIE_NAME}=${sessionToken.value};`;
    }
  }

  return {
    ...defaultHeaders,
    ...headers,
  };
};
```
