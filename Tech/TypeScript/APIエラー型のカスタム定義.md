```typescript
/**

* 基本的なAPIエラークラス

* すべてのAPIエラーの基底クラスとして機能

*/

export class ApiError extends Error {
  //NOTE publicキーワードがつくと自動的にdeclareとinitializeが行われる
  constructor(public status: number, message: string, public data?: unknown) {
    super(message);

    this.name = "ApiError";
  }
}

/**

* 400 Bad Requestエラー

* クライアントからの不正なリクエストを示す

*/

export class BadRequestError extends ApiError {
  constructor(message: string, data?: unknown) {
    super(400, message, data);

    this.name = "BadRequestError";
  }
}

/**

* 401 Unauthorizedエラー

* 認証が必要なリソースへのアクセスを示す

*/

export class UnauthorizedError extends ApiError {
  constructor(message: string, data?: unknown) {
    super(401, message, data);

    this.name = "UnauthorizedError";
  }
}

/**

* 403 Forbiddenエラー

* アクセス権限がないリソースへのアクセスを示す

*/

export class ForbiddenError extends ApiError {
  constructor(message: string, data?: unknown) {
    super(403, message, data);

    this.name = "ForbiddenError";
  }
}

/**

* 404 Not Foundエラー

* リソースが存在しないことを示す

*/

export class NotFoundError extends ApiError {
  constructor(message: string, data?: unknown) {
    super(404, message, data);

    this.name = "NotFoundError";
  }
}

/**

* 409 Conflictエラー

* リクエストが現在のサーバーの状態と競合したことを示す

*/

export class ConflictError extends ApiError {
  constructor(message: string, data?: unknown) {
    super(409, message, data);

    this.name = "ConflictError";
  }
}

/**

* 500 Internal Server Error

* サーバー側のエラーを示す

*/

export class InternalServerError extends ApiError {
  constructor(message: string, data?: unknown) {
    super(500, message, data);

    this.name = "InternalServerError";
  }
}
```

## エラーファクトリ

````typescript
import {
  ApiError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  InternalServerError,
  ConflictError,
} from "./api-error";

/**
 * エラーファクトリーのインターフェース
 * Factory Patternの抽象化を提供
 */
interface ErrorFactory {
  create: (message: string, data?: unknown) => ApiError;
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
};

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
  data?: unknown
): ApiError => {
  const factory = errorFactories[status];
  return factory?.create(message, data) ?? new ApiError(status, message, data);
};
``;
````
