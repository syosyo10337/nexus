---
tags:
  - nextjs
  - error-handling
  - typescript
  - api
created: 2026-02-24
updated_at: 2026-02-24
status: active
---

# エラークラス設計

API通信で発生するエラーの型安全な分類とFactory Pattern実装。HTTPステータスコードに基づくエラークラス階層とネットワークエラーの設計。

## 関連ドキュメント

- [エラーハンドリング三層構造](./04a-error-handling-layers.md) - UIレベルのエラー捕捉戦略

## エラークラス階層

API通信で発生するエラーは、HTTPステータスコードに応じた専用クラスとして型安全に分類される。

### 基底クラスとサブクラス

```typescript
// src/shared/errors/api-error/api-error.ts

/** すべてのAPIエラーの基底クラス */
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

/** 400 Bad Request - 不正なリクエスト */
export class BadRequestError extends ApiError {
  constructor(message: string, data?: unknown) {
    super(400, message, data);
    this.name = "BadRequestError";
  }
}

/** 401 Unauthorized - 認証が必要 */
export class UnauthorizedError extends ApiError {
  constructor(message: string, data?: unknown) {
    super(401, message, data);
    this.name = "UnauthorizedError";
  }
}

/** 403 Forbidden - アクセス権限なし */
export class ForbiddenError extends ApiError {
  constructor(message: string, data?: unknown) {
    super(403, message, data);
    this.name = "ForbiddenError";
  }
}

/** 404 Not Found - リソースが存在しない */
export class NotFoundError extends ApiError {
  constructor(message: string, data?: unknown) {
    super(404, message, data);
    this.name = "NotFoundError";
  }
}

/** 409 Conflict - 状態の競合 */
export class ConflictError extends ApiError {
  constructor(message: string, data?: unknown) {
    super(409, message, data);
    this.name = "ConflictError";
  }
}

/** 500 Internal Server Error */
export class InternalServerError extends ApiError {
  constructor(message: string, data?: unknown) {
    super(500, message, data);
    this.name = "InternalServerError";
  }
}
```

## Factoryパターンによるエラー生成

ステータスコードから適切なエラークラスのインスタンスを自動的に生成するFactory関数。fetcherの内部で使用される。

```typescript
// src/shared/errors/api-error/api-error-factory.ts
import {
  ApiError, BadRequestError, UnauthorizedError,
  ForbiddenError, NotFoundError, InternalServerError, ConflictError,
} from "./api-error";

interface ErrorFactory {
  create: (message: string, data?: unknown) => ApiError;
}

const errorFactories: Record<number, ErrorFactory> = {
  400: { create: (message, data) => new BadRequestError(message, data) },
  401: { create: (message, data) => new UnauthorizedError(message, data) },
  403: { create: (message, data) => new ForbiddenError(message, data) },
  404: { create: (message, data) => new NotFoundError(message, data) },
  409: { create: (message, data) => new ConflictError(message, data) },
  500: { create: (message, data) => new InternalServerError(message, data) },
};

export const createApiError = (
  status: number,
  message: string,
  data?: unknown
): ApiError => {
  const factory = errorFactories[status];
  return factory?.create(message, data) ?? new ApiError(status, message, data);
};
```

### Factoryパターンの利点

1. **型安全性**: ステータスコードに基づいて適切なエラークラスが自動選択される
2. **拡張性**: 新しいステータスコードへの対応は `errorFactories` に追加するだけ
3. **一貫性**: エラー生成ロジックが一箇所に集約される

マッピングに存在しないステータスコード（例: 422, 503等）の場合は、基底クラスの `ApiError` インスタンスが生成される。

## NetworkError

HTTPレスポンスが存在しない（リクエストがサーバーに到達しなかった）エラーを表現するクラス。`ApiError` とは別の継承階層に属する。

```typescript
// src/shared/errors/network-error/index.ts
export class NetworkError extends Error {
  constructor(message: string = "ネットワークエラーが発生しました") {
    super(message);
    this.name = "NetworkError";
  }
}
```

### ApiError vs NetworkError

| 項目             | ApiError                     | NetworkError                           |
| ---------------- | ---------------------------- | -------------------------------------- |
| HTTPレスポンス   | あり                         | なし                                   |
| ステータスコード | 存在する (400, 404等)        | 存在しない                             |
| 発生タイミング   | サーバーからレスポンス受信後 | リクエスト送信時/通信中                |
| 原因             | サーバー側のエラー           | ネットワーク接続の問題                 |
| UIメッセージ     | 「エラーが発生しました」     | 「ネットワーク接続を確認してください」 |

## エラー分類の全体像

```text
Error (JavaScript標準)
  ├── ApiError (HTTPレスポンスあり)
  │     ├── BadRequestError     (400) - 不正なリクエスト
  │     ├── UnauthorizedError   (401) - 認証が必要
  │     ├── ForbiddenError      (403) - アクセス権限なし
  │     ├── NotFoundError       (404) - リソースが存在しない
  │     ├── ConflictError       (409) - 状態の競合
  │     └── InternalServerError (500) - サーバー内部エラー
  │
  └── NetworkError (HTTPレスポンスなし)
        ├── オフライン状態
        ├── タイムアウト
        ├── DNS解決失敗
        └── サーバーが応答しない
```

## 使用例

### Fetcherでの使用

```typescript
// src/shared/utils/fetcher.ts
export async function fetcher<T>(url: string): Promise<T> {
  try {
    const response = await fetch(url);
    const data = await response.json();
    if (!response.ok) {
      throw createApiError(response.status, extractErrorMessage(data), data);
    }
    return data;
  } catch (error) {
    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new NetworkError("ネットワークに接続できません");
    }
    throw error;
  }
}
```

### Server Component / Server Action での使用

```typescript
// Server Component: エラー種別に応じてNext.jsのナビゲーション関数を呼び分ける
try {
  const event = await getCommunityEvent(params.id)
  return <EventDetail event={event} />
} catch (error) {
  if (error instanceof NotFoundError) notFound()
  if (error instanceof UnauthorizedError) redirect('/auth/signin')
  throw error // その他 → Error Boundaryに委譲
}

// Server Action: エラー種別に応じてユーザー向けメッセージを返す
try {
  await updateEvent(eventId, data);
  return { success: true };
} catch (error) {
  if (error instanceof ConflictError) {
    return { success: false, error: "イベントは既に更新されています" };
  }
  if (error instanceof BadRequestError) {
    return { success: false, error: "入力内容を確認してください" };
  }
  throw error;
}
```

### Client Componentでの使用

```typescript
// NetworkError と ApiError で異なるトーストメッセージを表示
try {
  await refetchEvents()
} catch (error) {
  if (error instanceof NetworkError) {
    toast({ title: 'ネットワークエラー', description: '接続を確認してください', variant: 'destructive' })
  } else if (error instanceof ApiError) {
    toast({ title: 'エラー', description: 'データの取得に失敗しました', variant: 'destructive' })
  }
}
```

## ベストプラクティス

**1. instanceof による型ガード** — ステータスコード（`error.status === 404`）ではなく `instanceof NotFoundError` で分岐する。型安全かつ、サブクラスの追加に強い。

**2. 処理できないエラーは再スロー** — 特定のエラーのみ catch して処理し、それ以外は `throw error` で Error Boundary に委譲する。すべてのエラーを `console.error` + `return null` で握りつぶさない。

**3. エラーメッセージのユーザーフレンドリー化** — サーバーのエラーメッセージ（`"Unique constraint violation"` 等）をそのまま表示せず、`ConflictError` → `"既に登録されています"` のようにユーザー向けメッセージに変換する。

## 参考リンク

- [エラーハンドリング三層構造](./04a-error-handling-layers.md) - Error Boundaryとの連携
- [React Query リトライ設定](./06-react-query-config.md) - エラー種別に基づくリトライ制御
