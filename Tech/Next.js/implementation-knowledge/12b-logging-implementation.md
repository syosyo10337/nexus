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

# ロギング実装例とベストプラクティス

Next.js App Router におけるロギングの具体的な実装パターン集。

関連: [ロギングアーキテクチャ設計](./12a-logging-architecture.md) / [エラーハンドリング層](./04a-error-handling-layers.md)

## 型定義

```typescript
// src/shared/utils/logger/type.ts
export const Source = {
  Server: "[Server]",
  Client: "[Client]",
} as const;
export type Source = (typeof Source)[keyof typeof Source];

export const LogLevel = {
  Trace: "trace", Debug: "debug", Info: "info",
  Warn: "warn", Error: "error", Fatal: "fatal", Silent: "silent",
} as const;
export type LogLevel = (typeof LogLevel)[keyof typeof LogLevel];
```

## createLogger() 実装

```typescript
// src/shared/utils/logger/index.ts
import "server-only";
import pino from "pino";
import type { Logger } from "pino";
import { IS_SERVER } from "@/shared/constants/environment";
import { getLoggerConfig } from "./config";
import { LogLevel, Source } from "./type";

const noOpLogger = pino({ level: LogLevel.Silent });

function getLogger(): Logger {
  return pino(getLoggerConfig());
}
const logger: Logger = getLogger();

interface CreateLoggerOptions {
  module?: string;
  source?: Source;
  /** @internal テスト用 */
  _loggerInstance?: Logger;
}

export function createLogger({
  module,
  source = Source.Server,
  _loggerInstance,
}: CreateLoggerOptions = {}): Logger {
  if (!IS_SERVER) {
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
```

ガード設計:
1. `import "server-only"` -- ビルド時にクライアントバンドルへの混入を検出
2. `IS_SERVER` チェック -- テスト環境(jsdom)での誤実行時に `noOpLogger` を返す

## サーバーサイド実装例

### Server Action

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
    const result = await api.checkin({ ticketId, timestamp: new Date() });
    log.info({ ticketId, result }, "Checkin succeeded");
    revalidatePath("/events");
    return { success: true, data: result };
  } catch (error) {
    log.error({ ticketId, err: error }, "Checkin failed");
    return { success: false, error: "Checkin failed" };
  }
}
```

### API Route

```typescript
// src/app/api/proxy/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createLogger } from "@/shared/utils/logger";

const log = createLogger({ module: "api-proxy" });

export async function POST(request: NextRequest) {
  const requestId = request.headers.get("x-request-id") ?? "unknown";
  log.info({ requestId, url: request.nextUrl.pathname, method: "POST" }, "Proxy request received");

  try {
    const body = await request.json();
    const response = await backendApi.post("/endpoint", body, {
      headers: { "x-request-id": requestId },
    });
    log.info({ requestId, status: response.status }, "Proxy request succeeded");
    return NextResponse.json(response.data);
  } catch (error) {
    log.error({ requestId, err: error }, "Proxy request failed");
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
```

## クライアントサイド実装例

### reportClientError()

```typescript
// src/shared/utils/logger/client/error-reporter.ts
import type { ClientErrorPayload, ErrorInfo } from "./types";

const isDevelopment = process.env.NODE_ENV === "development";

function serializeError(error: unknown): ErrorInfo {
  if (error instanceof Error) {
    return { message: error.message, name: error.name, stack: error.stack };
  }
  return { message: String(error), name: "UnknownError" };
}

export async function reportClientError(payload: ClientErrorPayload): Promise<void> {
  try {
    const response = await fetch("/api/logs/client-errors", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...payload, error: serializeError(payload.error) }),
    });
    if (!response.ok && isDevelopment) {
      console.warn("Failed to report client error:", response.status);
    }
  } catch (err) {
    // Silent fail（無限ループ防止）
    if (isDevelopment) console.warn("Failed to send error log:", err);
  }
}
```

### API Route（受信側）

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
    const log = baseLog.child({ module: data.module });
    log[data.level]({
      requestId, error: data.error, context: data.context,
      userAgent: request.headers.get("user-agent"),
      url: request.headers.get("referer"),
    }, "Client error occurred");
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      baseLog.warn({ requestId, err: error }, "Invalid client error payload");
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }
    baseLog.error({ requestId, err: error }, "Failed to log client error");
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
```

## ベストプラクティス

### サーバーサイド

**モジュール識別子を明確にする**:

```typescript
// Good
const log = createLogger({ module: "api-events-create" });
const log = createLogger({ module: "server-action-checkin" });

// Bad -- 抽象的すぎる / 識別不能
const log = createLogger({ module: "api" });
const log = createLogger();
```

**構造化データを活用する**:

```typescript
// Good -- 検索可能
log.info({ userId, eventId, action: "create" }, "Event created");

// Bad -- 文字列に埋め込むと検索不可
log.info(`User ${userId} created event ${eventId}`);
```

**エラーは `err` キーで記録**:

```typescript
// Good -- Pino 標準シリアライザが適用される
log.error({ err: error }, "Operation failed");

// Bad -- エラーが正しくシリアライズされない
log.error({ error }, "Operation failed");
```

**ログに個人情報を含めない**:

```typescript
// Good
log.info({ userId: user.id }, "User logged in");

// Bad
log.info({ email: user.email, name: user.name }, "User logged in");
```

### クライアントサイド

**コンテキスト情報を付与する**:

```typescript
// Good
void reportClientError({
  module: "error-boundary", level: "error", error,
  context: { pathname: window.location.pathname, digest: error.digest },
});

// Bad -- 最小限すぎてデバッグ困難
void reportClientError({ module: "error-boundary", level: "error", error });
```

**Error Boundary を階層的に配置**: `global-error.tsx`(fatal) + 機能別 `error.tsx`(error) で粒度を分ける。

### テスト環境

コンポーネントテストで `createLogger called on client side` 警告が出る場合:

```typescript
// src/shared/utils/logger/__mocks__/index.ts
import pino from "pino";
export const createLogger = jest.fn(() => pino({ level: "silent" }));
```

## 参考リンク

- [Pino 公式ドキュメント](https://getpino.io/)
- [Next.js エラーハンドリング](https://nextjs.org/docs/app/building-your-application/routing/error-handling)
- [Logging Best Practices (Better Stack)](https://betterstack.com/community/guides/logging/logging-best-practices/)
