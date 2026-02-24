---
tags:
  - nextjs
  - error-handling
  - error-boundary
  - typescript
  - client-error
created: 2026-02-24
updated_at: 2026-02-24
status: active
---

# クライアントエラーレポーティング & グローバルハンドラ

Error Boundaryでキャッチしたエラーのレポーティングと、Error Boundaryでキャッチできないエラーを補完的に捕捉するグローバルハンドラの設計。

## 関連ドキュメント

- [エラーハンドリング三層構造](./04a-error-handling-layers.md) - Layer 1-3 の構造と実装
- [エラークラス設計](./05-error-class-design.md) - ApiError/NetworkError の型安全な分類
- [ロギングアーキテクチャ設計](./12a-logging-architecture.md) - クライアントエラーレポーティングの詳細設計
- [ロギング実装例とベストプラクティス](./12b-logging-implementation.md) - エラーログの実装例

### ClientErrorBoundary 使用例

```tsx
// チケット一覧コンポーネントだけエラーにし、ページ全体は維持する
<div>
  <EventHeader />
  <ClientErrorBoundary fallback={TicketListErrorFallback}>
    <TicketList />
  </ClientErrorBoundary>
  <EventFooter />
</div>
```

---

## クライアントエラーレポーティング

Error Boundaryやグローバルハンドラでキャッチしたエラーは、`reportClientError()` を使ってログ送信する。

```typescript
import { reportClientError } from '@/shared/utils/report-client-error'

// Error Boundary内での使用
reportClientError(error, 'ERROR', {
  context: 'ClientErrorBoundary',
  componentStack: errorInfo.componentStack,
  location: window.location.pathname,
})

// window.onerror での使用
reportClientError(error, 'ERROR', {
  context: 'window.onerror',
  filename: /* ... */,
  lineno: /* ... */,
})
```

詳細な設計と実装例は以下を参照：

- [ロギングアーキテクチャ設計](./12a-logging-architecture.md#クライアントエラーレポーティング設計)
- [ロギング実装例とベストプラクティス](./12b-logging-implementation.md#reportclienterror-実装)

---

## 補助: グローバルエラーハンドラ

Error Boundaryでキャッチできない同期エラーや未処理Promiseエラーを補完的にキャッチする。

### 1. window.onerror（同期エラー）

```tsx
// src/features/client-error-handler-registrar/client-error-handler-register.tsx
"use client";

import { reportClientError } from "@/shared/utils/report-client-error";
import { useEffect } from "react";

export function ClientErrorHandlerRegister() {
  useEffect(() => {
    // 旧ハンドラを保存（複数のグローバルエラーハンドラが共存する場合のフォールバック）
    const originalOnError = window.onerror;

    window.onerror = (message, source, lineno, colno, error) => {
      reportClientError(error ?? new Error(String(message)), "ERROR", {
        context: "window.onerror",
        filename: source,
        lineno,
        colno,
        location: window.location.pathname,
      });

      // 旧ハンドラも呼び出す
      if (originalOnError) {
        return originalOnError(message, source, lineno, colno, error);
      }
      return false;
    };

    return () => {
      window.onerror = originalOnError;
    };
  }, []);

  return null;
}
```

#### 補足: Error Boundaryとの違い

| 項目                   | Error Boundary                                | window.onerror                     |
| ---------------------- | --------------------------------------------- | ---------------------------------- |
| キャッチできるエラー   | Reactコンポーネント内の**レンダリングエラー** | グローバルスコープの**同期エラー** |
| キャッチできないエラー | イベントハンドラ内のエラー                    | Reactコンポーネント内のエラー      |

#### 実際の用途

```typescript
// Error Boundaryではキャッチできない例
function handleClick() {
  throw new Error("クリックハンドラ内のエラー");
  // → window.onerror でキャッチ
}

// Error Boundaryでキャッチできる例
function MyComponent() {
  throw new Error("レンダリング中のエラー");
  // → Error Boundary でキャッチ
}
```

### 2. window.onunhandledrejection（未処理Promise）

```tsx
// src/features/client-error-handler-registrar/client-error-handler-register.tsx
"use client";

import { reportClientError } from "@/shared/utils/report-client-error";
import { useEffect } from "react";

export function ClientErrorHandlerRegister() {
  useEffect(() => {
    const originalOnError = window.onerror;
    const originalOnUnhandledRejection = window.onunhandledrejection;

    // window.onerror の設定（同期エラー）
    window.onerror = (message, source, lineno, colno, error) => {
      reportClientError(error ?? new Error(String(message)), "ERROR", {
        context: "window.onerror",
        filename: source,
        lineno,
        colno,
        location: window.location.pathname,
      });

      if (originalOnError) {
        return originalOnError(message, source, lineno, colno, error);
      }
      return false;
    };

    // window.onunhandledrejection の設定（未処理Promise）
    window.onunhandledrejection = (event: PromiseRejectionEvent) => {
      const error =
        event.reason instanceof Error
          ? event.reason
          : new Error(String(event.reason));

      reportClientError(error, "ERROR", {
        context: "unhandledrejection",
        location: window.location.pathname,
      });

      if (originalOnUnhandledRejection) {
        return originalOnUnhandledRejection.call(window, event);
      }
    };

    return () => {
      window.onerror = originalOnError;
      window.onunhandledrejection = originalOnUnhandledRejection;
    };
  }, []);

  return null;
}
```

詳細な設計については以下を参照：

- [ロギングアーキテクチャ設計](./12a-logging-architecture.md#3-unhandledrejection-イベント)

---

## エラーの流れ（まとめ）

```text
クライアントでエラー発生
    |
    |--- Reactコンポーネント内?
    |       |
    |       |--- ルートレイアウト自体のエラー?
    |       |       └── global-error.tsx (Layer 1)
    |       |              └── reportClientError (FATAL)
    |       |
    |       |--- アプリケーションのエラー?
    |       |       └── error.tsx (Layer 2)
    |       |              └── reportClientError (ERROR)
    |       |
    |       └--- 個別コンポーネントのエラー?
    |               └── ClientErrorBoundary (Layer 3)
    |                      └── reportClientError (ERROR)
    |
    |--- イベントハンドラ / グローバルスコープ?
    |       └── window.onerror
    |              └── reportClientError (ERROR)
    |
    |--- 未処理Promise?
    |       └── window.onunhandledrejection
    |              └── reportClientError (ERROR)
    |
    └--- API通信エラー?
            └── エラークラス設計 (ApiError / NetworkError)
                └── 詳細は「エラークラス設計」ドキュメント参照
```

---

## 次のステップ

エラーハンドリング三層構造の次は、エラークラスの型安全な設計を学ぶ：

- **[エラークラス設計](./05-error-class-design.md)** - ApiError/NetworkError の階層とFactory Pattern実装

これにより、HTTPステータスコードに基づくエラー分類と、UIレベルでの適切なエラーメッセージ出し分けが可能になる。
