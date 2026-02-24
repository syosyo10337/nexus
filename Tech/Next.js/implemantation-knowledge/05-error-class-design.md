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

- [エラーハンドリング三層構造](04-error-handling-strategy.md) - UIレベルのエラー捕捉戦略

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
    public data?: unknown
  ) {
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

## Factoryパターンによるエラー生成

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
 */
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

### 未定義ステータスコードの処理

マッピングに存在しないステータスコード（例: 422, 503等）の場合は、基底クラスの `ApiError` インスタンスが生成される。

```typescript
// 例: 422 Unprocessable Entity
createApiError(422, "Validation failed");
// => ApiError { status: 422, message: "Validation failed" }
```

## NetworkError

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

### エラー分離の設計意図

`ApiError` と `NetworkError` を明確に分離することで、UIレベルで適切なユーザーメッセージを出し分けられる。

```typescript
try {
  await fetchData();
} catch (error) {
  if (error instanceof NetworkError) {
    // ネットワークの問題
    showToast("ネットワーク接続を確認してください");
  } else if (error instanceof ApiError) {
    // サーバー側のエラー
    showToast("エラーが発生しました");
  }
}
```

## 使用例

### Fetcherでの使用

```typescript
// src/shared/utils/fetcher.ts
import { createApiError } from "@/shared/errors/api-error";
import { NetworkError } from "@/shared/errors/network-error";

export async function fetcher<T>(url: string): Promise<T> {
  try {
    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      // HTTPエラーレスポンス → ApiError
      throw createApiError(response.status, extractErrorMessage(data), data);
    }

    return data;
  } catch (error) {
    // ネットワークエラー → NetworkError
    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new NetworkError("ネットワークに接続できません");
    }
    throw error;
  }
}
```

### Server Componentでの使用

```typescript
// src/app/events/[id]/page.tsx
import { notFound, redirect } from 'next/navigation'
import { NotFoundError, UnauthorizedError } from '@/shared/errors/api-error'

export default async function EventPage({ params }: { params: { id: string } }) {
  try {
    const event = await getCommunityEvent(params.id)
    return <EventDetail event={event} />
  } catch (error) {
    if (error instanceof NotFoundError) {
      // 404: イベントが見つからない → Next.jsのnotFound()へ
      notFound()
    }
    if (error instanceof UnauthorizedError) {
      // 401: 認証切れ → サインインページへリダイレクト
      redirect('/auth/signin')
    }
    // その他のエラー → Error Boundaryに委譲
    throw error
  }
}
```

### Server Actionでの使用

```typescript
// src/features/events/actions/update-event.ts
"use server";

import { ConflictError, BadRequestError } from "@/shared/errors/api-error";

export async function updateEventAction(eventId: string, data: EventData) {
  try {
    const result = await updateEvent(eventId, data);
    revalidatePath(`/events/${eventId}`);
    return { success: true, data: result };
  } catch (error) {
    if (error instanceof ConflictError) {
      return { success: false, error: "イベントは既に更新されています" };
    }
    if (error instanceof BadRequestError) {
      return { success: false, error: "入力内容を確認してください" };
    }
    throw error; // その他 → Error Boundary
  }
}
```

### Client Componentでの使用

```typescript
// src/features/events/components/event-list.tsx
'use client'

import { NetworkError } from '@/shared/errors/network-error'
import { ApiError } from '@/shared/errors/api-error'
import { useToast } from '@/shared/hooks/use-toast'

export function EventList() {
  const { toast } = useToast()

  const handleRefresh = async () => {
    try {
      await refetchEvents()
    } catch (error) {
      if (error instanceof NetworkError) {
        toast({
          title: 'ネットワークエラー',
          description: 'ネットワーク接続を確認してください',
          variant: 'destructive',
        })
      } else if (error instanceof ApiError) {
        toast({
          title: 'エラー',
          description: 'データの取得に失敗しました',
          variant: 'destructive',
        })
      }
    }
  }

  return <button onClick={handleRefresh}>更新</button>
}
```

## ベストプラクティス

### 1. instanceof による型ガード

```typescript
// ✅ Good - 型安全なエラーハンドリング
if (error instanceof NotFoundError) {
  notFound();
}

// ❌ Bad - ステータスコードで分岐（型安全でない）
if (error.status === 404) {
  notFound();
}
```

### 2. エラーの再スロー

```typescript
// ✅ Good - 処理できないエラーは再スロー
try {
  await fetchData();
} catch (error) {
  if (error instanceof UnauthorizedError) {
    redirect("/signin");
  }
  throw error; // 他のエラーはError Boundaryに委譲
}

// ❌ Bad - すべてのエラーを握りつぶす
try {
  await fetchData();
} catch (error) {
  console.error(error);
  return null;
}
```

### 3. エラーメッセージのユーザーフレンドリー化

```typescript
// ✅ Good - ユーザー向けのメッセージに変換
catch (error) {
  if (error instanceof ConflictError) {
    return '既に登録されています'
  }
  if (error instanceof BadRequestError) {
    return '入力内容を確認してください'
  }
  return '予期しないエラーが発生しました'
}

// ❌ Bad - サーバーのエラーメッセージをそのまま表示
catch (error) {
  return error.message  // "Unique constraint violation" など
}
```

## 参考リンク

- [エラーハンドリング三層構造](04-error-handling-strategy.md) - Error Boundaryとの連携
- [TypeScript Handbook - Error Handling](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#instanceof-narrowing)
