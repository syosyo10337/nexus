---
tags:
  - nextjs
  - logging
  - pino
  - implementation
  - best-practices
created: 2026-02-24
updated_at: 2026-02-24
status: active
---

# Next.jsロギング実装例とベストプラクティス

Next.js App Routerにおけるロギングの具体的な実装例、パターン、ベストプラクティス集。

## 関連ドキュメント

- [Next.jsクライアント・サーバーロギング戦略](Next.js%E3%82%AF%E3%83%A9%E3%82%A4%E3%82%A2%E3%83%B3%E3%83%88%E3%83%BB%E3%82%B5%E3%83%BC%E3%83%90%E3%83%BC%E3%83%AD%E3%82%AE%E3%83%B3%E3%82%B0%E6%88%A6%E7%95%A5.md) - 全体戦略と概要
- [Next.jsロギングアーキテクチャ設計](Next.js%E3%83%AD%E3%82%AE%E3%83%B3%E3%82%B0%E3%82%A2%E3%83%BC%E3%82%AD%E3%83%86%E3%82%AF%E3%83%81%E3%83%A3%E8%A8%AD%E8%A8%88.md) - アーキテクチャの詳細設計

## createLogger() 実装詳細

### 完全な実装例

````typescript
// src/shared/utils/logger/index.ts
import "server-only";
import pino from "pino";
import type { Logger } from "pino";

import { IS_SERVER } from "@/shared/constants/environment";

import { getLoggerConfig } from "./config";
import { LogLevel, Source } from "./type";

const noOpLogger = pino({ level: LogLevel.Silent });

/**
 * ロガーインスタンスを取得（実行時に評価されるため、実行時の環境変数が反映されます）
 * NOTE: この関数は実行時に評価されるため、ビルド時の環境変数に依存せず、
 *       実行時の環境変数（ENV, LOG_LEVEL）が正しく反映されます。
 */
function getLogger(): Logger {
  return pino(getLoggerConfig());
}

const logger: Logger = getLogger();

interface CreateLoggerOptions {
  /**
   * モジュール識別子（例: 'api-events', 'server-action-checkin'）
   * 省略可能。クライアントエラーログなど、後から動的に指定する場合は省略する
   */
  module?: string;
  /**
   * ログの発生源（デフォルト: Source.Server）
   */
  source?: Source;
  /**
   * テスト時に注入するloggerインスタンス（通常は使用しない）
   * @internal
   */
  _loggerInstance?: Logger;
}

/**
 * モジュール単位でchild loggerを作成
 *
 * @param options - ロガーのオプション
 * @returns Child logger with module context
 *
 * @example
 * ```typescript
 * // 基本的な使用（サーバサイド）
 * const log = createLogger({ module: 'api-events' })
 * log.info({ eventId: 123 }, 'Event created')
 * // 出力: { source: '[Server]', module: 'api-events', eventId: 123, msg: 'Event created' }
 * ```
 *
 * @example
 * ```typescript
 * // クライアントエラー受信エンドポイント（moduleを後から指定）
 * const baseLog = createLogger({ source: Source.Client })
 * const log = baseLog.child({ module: data.module })
 * log.error(logContext, 'Client error occurred')
 * // 出力: { source: '[Client]', module: 'error-boundary', msg: 'Client error occurred' }
 * ```
 */
export function createLogger({
  module,
  source = Source.Server,
  _loggerInstance,
}: CreateLoggerOptions = {}): Logger {
  if (!IS_SERVER) {
    // NOTE: テスト実行時にここのコードが実行されることがある。
    // mockされているためテストに影響はないが、componentテストのrunnerを
    // storybookに移行する際に、対応すること
    console.warn(
      `createLogger called on client side for module: ${module ?? "unknown"}`
    );
    return noOpLogger;
  }

  const baseLogger = _loggerInstance ?? logger;

  return module
    ? baseLogger.child({ source, module })
    : baseLogger.child({ source });
}
````

### 型定義

```typescript
// src/shared/utils/logger/type.ts
export const Source = {
  Server: "[Server]",
  Client: "[Client]",
} as const;

export type Source = (typeof Source)[keyof typeof Source];

export const LogLevel = {
  Trace: "trace",
  Debug: "debug",
  Info: "info",
  Warn: "warn",
  Error: "error",
  Fatal: "fatal",
  Silent: "silent",
} as const;

export type LogLevel = (typeof LogLevel)[keyof typeof LogLevel];
```

## サーバーサイド実装例

### Server Actionでの実装

```typescript
// src/features/events/actions/checkin.ts
"use server";

import { revalidatePath } from "next/cache";
import { createLogger } from "@/shared/utils/logger";

const log = createLogger({ module: "server-action-checkin" });

export async function checkinAction(formData: FormData) {
  const ticketId = formData.get("ticketId") as string;

  log.info({ ticketId }, "Checkin started");

  try {
    const result = await api.checkin({
      ticketId,
      timestamp: new Date(),
    });

    log.info({ ticketId, result }, "Checkin succeeded");

    revalidatePath("/events");
    return { success: true, data: result };
  } catch (error) {
    log.error({ ticketId, err: error }, "Checkin failed");
    return { success: false, error: "Checkin failed" };
  }
}
```

### API Routeでの実装

```typescript
// src/app/api/proxy/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createLogger } from "@/shared/utils/logger";

const log = createLogger({ module: "api-proxy" });

export async function POST(request: NextRequest) {
  const requestId = request.headers.get("x-request-id") ?? "unknown";
  const url = request.nextUrl.pathname;

  log.info({ requestId, url, method: "POST" }, "Proxy request received");

  try {
    const body = await request.json();

    log.debug({ requestId, body }, "Request body parsed");

    const response = await backendApi.post("/endpoint", body, {
      headers: {
        "x-request-id": requestId,
      },
    });

    log.info({ requestId, status: response.status }, "Proxy request succeeded");

    return NextResponse.json(response.data);
  } catch (error) {
    log.error({ requestId, err: error }, "Proxy request failed");

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
```

### Server Componentでの実装

```typescript
// src/app/events/[id]/page.tsx
import { createLogger } from '@/shared/utils/logger'

const log = createLogger({ module: 'page-event-detail' })

export default async function EventDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const eventId = params.id

  log.info({ eventId }, 'Loading event detail page')

  try {
    const event = await fetchEvent(eventId)

    log.debug({ eventId, eventName: event.name }, 'Event loaded')

    return <EventDetail event={event} />
  } catch (error) {
    log.error({ eventId, err: error }, 'Failed to load event')
    throw error  // Error Boundaryで捕捉される
  }
}
```

### ミドルウェアでの実装

```typescript
// src/middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { createLogger } from "@/shared/utils/logger";

const log = createLogger({ module: "middleware" });

export function middleware(request: NextRequest) {
  const requestId = request.headers.get("x-request-id") ?? crypto.randomUUID();

  log.debug(
    { requestId, url: request.nextUrl.pathname },
    "Middleware processing"
  );

  const response = NextResponse.next();
  response.headers.set("x-request-id", requestId);

  return response;
}
```

## クライアントサイド実装例

### Error Boundaryでの実装

```typescript
// src/app/error.tsx
'use client'

import { useEffect } from 'react'
import { reportClientError } from '@/shared/utils/logger/client/error-reporter'

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // エラーをサーバーに送信
    void reportClientError({
      module: 'error-boundary',
      level: 'error',
      error,
      context: {
        digest: error.digest,
        pathname: window.location.pathname,
      },
    })
  }, [error])

  return (
    <div>
      <h2>エラーが発生しました</h2>
      <p>{error.message}</p>
      <button onClick={reset}>再試行</button>
    </div>
  )
}
```

### グローバルエラーハンドラの設定

直接レイアウトに登録しても良いし、client componentsになることを避けるためにwrapperコンポーネントを作成してもよい。

```typescript
// src/app/layout.tsx
'use client'

import { useEffect } from 'react'
import { setupGlobalErrorHandlers } from '@/shared/utils/logger/client/global-error-handler'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  useEffect(() => {
    // グローバルエラーハンドラの登録
    const cleanup = setupGlobalErrorHandlers()

    // クリーンアップ
    return cleanup
  }, [])

  return <html>{children}</html>
}
```

### setupGlobalErrorHandlers() 実装

```typescript
// src/shared/utils/logger/client/global-error-handler.ts
"use client";

import { IS_SERVER } from "@/shared/constants/environment";
import { LogLevel } from "../type";
import { reportClientError } from "./error-reporter";
import { ClientErrorType } from "./types";

export function setupGlobalErrorHandlers(): () => void {
  if (IS_SERVER) {
    console.warn("setupGlobalErrorHandlers called in non-browser environment");
    return () => {
      /* no-op */
    };
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
    });
  };

  // キャッチされていないPromiseをキャッチするハンドラー
  const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
    void reportClientError({
      module: ClientErrorType.UnhandledRejection,
      level: LogLevel.Warn,
      error: event.reason,
    });
  };

  // イベントリスナーを登録
  window.addEventListener("error", handleError);
  window.addEventListener("unhandledrejection", handleUnhandledRejection);

  // クリーンアップ関数を返す
  return () => {
    window.removeEventListener("error", handleError);
    window.removeEventListener("unhandledrejection", handleUnhandledRejection);
  };
}
```

### reportClientError() 実装

```typescript
// src/shared/utils/logger/client/error-reporter.ts
import type { ClientErrorPayload, ErrorInfo } from "./types";

const isDevelopment = process.env.NODE_ENV === "development";

function serializeError(error: unknown): ErrorInfo {
  if (error instanceof Error) {
    return {
      message: error.message,
      name: error.name,
      stack: error.stack,
    };
  }

  return {
    message: String(error),
    name: "UnknownError",
  };
}

export async function reportClientError(
  payload: ClientErrorPayload
): Promise<void> {
  try {
    const response = await fetch("/api/logs/client-errors", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...payload,
        error: serializeError(payload.error),
      }),
    });

    if (!response.ok && isDevelopment) {
      console.warn("Failed to report client error:", response.status);
    }
  } catch (err) {
    // Silent fail（無限ループ防止）
    if (isDevelopment) {
      console.warn("Failed to send error log:", err);
    }
  }
}
```

### API Route（受信側）実装

```typescript
// src/app/api/logs/client-errors/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createLogger } from "@/shared/utils/logger";
import { ClientErrorPayloadSchema } from "@/shared/utils/logger/client/types";
import { Source } from "@/shared/utils/logger/type";
import { z } from "zod";

const baseLog = createLogger({ source: Source.Client });

export async function POST(request: NextRequest) {
  const requestId = request.headers.get("x-request-id") ?? "unknown";

  try {
    const body = await request.json();
    const data = ClientErrorPayloadSchema.parse(body);

    // 動的にmoduleを設定
    const log = baseLog.child({ module: data.module });

    const logContext = {
      requestId,
      error: data.error,
      context: data.context,
      userAgent: request.headers.get("user-agent"),
      url: request.headers.get("referer"),
    };

    // ログレベルに応じて記録
    log[data.level](logContext, "Client error occurred");

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      baseLog.warn({ requestId, err: error }, "Invalid client error payload");
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    baseLog.error({ requestId, err: error }, "Failed to log client error");
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
```

## ベストプラクティス

### サーバーサイド

#### 1. モジュール識別子を明確にする

```typescript
// ✅ Good
const log = createLogger({ module: "api-events-create" });
const log = createLogger({ module: "server-action-checkin" });
const log = createLogger({ module: "page-event-detail" });

// ❌ Bad
const log = createLogger({ module: "api" }); // 抽象的すぎる
const log = createLogger(); // 識別できない
```

#### 2. 構造化データを活用する

```typescript
// ✅ Good - 検索可能な構造化データ
log.info({ userId, eventId, action: "create" }, "Event created");

// ❌ Bad - 文字列に埋め込む
log.info(`User ${userId} created event ${eventId}`);
```

#### 3. エラーは `err` キーで記録

```typescript
// ✅ Good - Pinoの標準エラーシリアライザが適用される
try {
  await operation();
} catch (error) {
  log.error({ err: error }, "Operation failed");
}

// ❌ Bad - エラーが正しくシリアライズされない
try {
  await operation();
} catch (error) {
  log.error({ error }, "Operation failed");
}
```

#### 4. 適切なログレベルを使用

```typescript
// trace: 詳細なデバッグ情報（本番では通常無効）
log.trace({ queryParams }, "Query parameters received");

// debug: 開発時のデバッグ情報
log.debug({ userId, parsedData }, "Data parsed successfully");

// info: 通常の運用ログ
log.info({ eventId }, "Event created");

// warn: 警告（エラーではないが注意が必要）
log.warn({ userId, attemptCount: 3 }, "Multiple failed login attempts");

// error: エラー（処理は継続可能）
log.error({ err: error }, "Failed to send notification");

// fatal: 致命的エラー（アプリケーション停止）
log.fatal({ err: error }, "Database connection lost");
```

#### 5. ログに個人情報を含めない

```typescript
// ✅ Good
log.info({ userId: user.id }, "User logged in");

// ❌ Bad - 個人情報を含む
log.info(
  {
    email: user.email,
    name: user.name,
    address: user.address,
  },
  "User logged in"
);
```

### クライアントサイド

#### 1. Error Boundaryを階層的に配置

```typescript
// ルートレベル（global-error.tsx）
export default function GlobalError({ error }: { error: Error }) {
  useEffect(() => {
    void reportClientError({
      module: 'global-error-boundary',
      level: 'fatal',  // アプリ全体のエラーは fatal
      error,
    })
  }, [error])

  return <div>致命的なエラーが発生しました</div>
}

// 機能レベル（features/events/error.tsx）
export default function EventsError({ error }: { error: Error }) {
  useEffect(() => {
    void reportClientError({
      module: 'events-error-boundary',
      level: 'error',  // 機能固有のエラーは error
      error,
    })
  }, [error])

  return <div>イベント読み込みに失敗しました</div>
}
```

#### 2. コンテキスト情報を付与

```typescript
// ✅ Good - デバッグに有用な情報を含める
void reportClientError({
  module: "error-boundary",
  level: "error",
  error,
  context: {
    pathname: window.location.pathname,
    digest: error.digest,
    componentStack: errorInfo.componentStack,
  },
});

// ❌ Bad - 最小限の情報しか送らない
void reportClientError({
  module: "error-boundary",
  level: "error",
  error,
});
```

### テスト環境での警告

**現状**: コンポーネントテストで `createLogger called on client side` 警告が出る

**対応**:

```typescript
// テスト用のmock
// src/shared/utils/logger/__mocks__/index.ts
import pino from "pino";

export const createLogger = jest.fn(() => pino({ level: "silent" }));
```

## 参考リンク

- [Pino ドキュメント](https://getpino.io/)
- [Next.js エラーハンドリング](https://nextjs.org/docs/app/building-your-application/routing/error-handling)
- [Structured Logging Best Practices](https://betterstack.com/community/guides/logging/logging-best-practices/)
