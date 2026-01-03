 

# Simple Factory pattern(static factory pattern)

シンプルファクトリーパターンとは、大きな制御条件を伴う,1つの生成メソッドを持つクラスのことです。

この生成メソッドは、引数に基づく条件分岐で、どの製品クラスをインスタンス化・リターンするかを選択する

> The **Simple factory** pattern  describes a class that has one creation method with a large conditional that based on method parameters chooses which product class to instantiate and then return.

人々は通常、シンプルファクトリを一般的なファクトリーパターンやクリエイショナルデザインパターンの1つと混同する。ほとんどの場合、シンプルファクトリはFactory MethodやAbstract Factoryパターンを導入するための中間ステップである。」

> People usually confuse _simple factories_ with a general _factories_ or with one of the creational design patterns. In most cases, a simple factory is an intermediate step of introducing **[Factory Method](https://refactoring.guru/design-patterns/factory-method)** or **[Abstract Factory](https://refactoring.guru/design-patterns/abstract-factory)** patterns.

  
A simple factory is usually represented by a single method in a single class. Over time, this method might become too big, so you may decide to extract parts of the method to subclasses. Once you do it several times, you might discover that the whole thing turned into the classic _factory method_ pattern.  
  
By the way, if you declare a simple factory `abstract`, it doesn’t magically become the _abstract factory_ pattern.

## 実装例: Error Handler

```TypeScript
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

```