---
tags:
  - nextjs
  - api-client
  - orval
  - proxy
  - api-routes
  - react-query
created: 2026-02-24
updated_at: 2026-02-24
status: active
---

# APIクライアント: プロキシ & 使い分け

## 関連ドキュメント

- [APIクライアント全体像 & Orval設定](./03a-api-client-overview.md)
- [APIクライアント: fetcher実装](./03b-api-client-fetchers.md)

---

## プロキシルートハンドラ

Client Componentからのリクエストは、Next.jsのAPI Routesを経由してBE APIに転送される。この中間層が認証情報の付与やエラーハンドリングを担う。

### ルートハンドラ (`route.ts`)

```typescript
// src/app/api/proxy/[...path]/route.ts
import "server-only";
import type { NextRequest, NextResponse } from "next/server";

import { handleProxyRequest } from "@/shared/utils/api/proxy-handler";

/**
 * BE APIへのプロキシAPI Route
 *
 * 責務:
 * 1. セッション認証
 * 2. Tenant-ID検証
 * 3. Cookie変換（Auth.js → BE）
 * 4. BE APIへのリクエスト転送
 */

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
): Promise<NextResponse> {
  const { path } = await params;
  return handleProxyRequest(request, path, "GET");
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
): Promise<NextResponse> {
  const { path } = await params;
  return handleProxyRequest(request, path, "POST");
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
): Promise<NextResponse> {
  const { path } = await params;
  return handleProxyRequest(request, path, "PUT");
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
): Promise<NextResponse> {
  const { path } = await params;
  return handleProxyRequest(request, path, "PATCH");
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
): Promise<NextResponse> {
  const { path } = await params;
  return handleProxyRequest(request, path, "DELETE");
}
```

### プロキシハンドラ (`proxy-handler.ts`)

```typescript
// src/shared/utils/api/proxy-handler.ts
import "server-only";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import type { Logger } from "pino";

import { customServerFetch } from "@/api/fetchers/server";
import { createLogger } from "@/shared/utils/logger";

interface ProxyRequestOptions {
  /** 認証をスキップするかどうか */
  skipAuth?: boolean;
  /** ログモジュール名 */
  moduleName?: string;
}

/**
 * プロキシリクエストを処理する共通ハンドラー
 */
export async function handleProxyRequest(
  request: NextRequest,
  path: string[],
  method: string,
  { skipAuth = false, moduleName = "api-proxy" }: ProxyRequestOptions = {}
): Promise<NextResponse> {
  const log = createLogger({ module: moduleName });
  const fullPath = buildFullPath(path, request.nextUrl.searchParams);

  try {
    const body = await extractRequestBody(request, method);
    const headers = extractCustomHeaders(request);

    const data = await customServerFetch(fullPath, {
      method,
      ...(body !== undefined && { body }),
      ...(skipAuth && { skipAuth: true }),
      headers,
    });

    log.debug(
      {
        authSkipped: skipAuth,
        httpRequest: {
          requestMethod: method,
          requestUrl: fullPath,
        },
      },
      `Proxy request completed successfully`
    );

    return NextResponse.json(data);
  } catch (error) {
    return handleProxyError(error, log, fullPath, method, request.headers);
  }
}

/**
 * パスを再構築する
 */
function buildFullPath(path: string[], searchParams: URLSearchParams): string {
  const apiPath = `/${path.join("/")}`;
  const queryString = searchParams.toString();
  return queryString ? `${apiPath}?${queryString}` : apiPath;
}

/**
 * リクエストボディを取得する
 */
async function extractRequestBody(
  request: NextRequest,
  method: string
): Promise<BodyInit | undefined> {
  if (method === "GET" || method === "HEAD") {
    return undefined;
  }

  const contentType = request.headers.get("content-type");

  if (contentType?.includes("application/json")) {
    return JSON.stringify(await request.json());
  }
  if (contentType?.includes("multipart/form-data")) {
    return await request.formData();
  }
  return await request.text();
}

/**
 * カスタムヘッダーを抽出する
 * バックエンドAPIに転送する必要のあるカスタムヘッダーを抽出
 */
function extractCustomHeaders(request: NextRequest): HeadersInit {
  const customHeaders: Record<string, string> = {};

  // X- プレフィックスのカスタムヘッダーを転送
  request.headers.forEach((value, key) => {
    if (key.toLowerCase().startsWith("x-")) {
      customHeaders[key] = value;
    }
  });

  return customHeaders;
}
```

### プロキシの役割

プロキシ層が存在する理由は以下の通り。

1. **認証情報の隠蔽**: ブラウザはセッショントークンをCookieとして保持するが、BE API向けのヘッダー形式への変換はサーバー側で行う。クライアントにBE APIの認証方式を露出しない。
2. **テナントID付与**: マルチテナント環境でのリクエストに `X-Tenant-ID` を付与する処理をサーバー側に集約。
3. **CORS回避**: ブラウザから直接BE APIにリクエストするとCORSの問題が発生するが、同一オリジンのAPI Routesを経由することで回避。
4. **カスタムヘッダー転送**: `X-` プレフィックスのカスタムヘッダーを自動的にBE APIに転送する。

---

## リクエストフロー図

```text
[ブラウザ]
    |
    |--- RSC / Server Action --------------------------> customServerFetch --> Backend API
    |                                                     (直接通信)
    |                                                     ・Tenant ID 注入
    |                                                     ・Auth Token 注入
    |                                                     ・Request ID 伝搬
    |
    |--- Client Component (React Query) --> /api/proxy/... --> customServerFetch --> Backend API
                                            (API Route経由)
                                            ・X-ヘッダー転送
                                            ・Body抽出・変換
                                            ・エラーレスポンス変換
```

### 具体例: イベント一覧の取得

**Server Component（RSC）の場合:**

```text
Page Component (RSC)
  └─> getCommunityEvents()                     // *.ts から import
        └─> customServerFetch('/v1/events')    // 直接BE APIへ
              ├─ Header: X-Tenant-ID: xxx
              ├─ Header: Cookie: session=yyy
              └─ Header: x-request-id: zzz
```

**Client Component（React Query）の場合:**

```text
EventList Component (Client)
  └─> useListAdmissions()                              // *.query.ts から import
        └─> customClientFetch('/api/proxy/v1/events')  // API Route経由
              └─> /api/proxy/[...path]/route.ts
                    └─> handleProxyRequest()
                          └─> customServerFetch('/v1/events')  // BE APIへ
```

---

## 使い分けのガイドライン

| シーン                           | 使うべきクライアント                     | 理由                                             |
| -------------------------------- | ---------------------------------------- | ------------------------------------------------ |
| ページ初期表示のデータ取得       | Server Fetch (`*.ts`)                    | RSCで直接取得。ウォーターフォール回避。          |
| フォーム送信・データ更新         | Server Fetch (`*.ts`) via Server Actions | `'use server'` 内で直接BE APIを呼ぶ。            |
| リアルタイム検索・フィルタリング | React Query (`*.query.ts`)               | ユーザー操作に応じたインクリメンタルなフェッチ。 |
| リクエストボディのバリデーション | Zod Schema (`*.zod.ts`)                  | Server Actions内でZodスキーマによる入力検証。    |

### 原則

- **サーバーで完結できるならサーバーで行う**: RSCやServer Actionsを優先し、Client Componentからのフェッチは本当に必要な場合（ユーザー操作トリガー等）のみ使用する。
- **生成コードは直接編集しない**: `src/api/__generated__/` 配下のファイルは `./bin/gen` で再生成されるため、手動編集は禁止。カスタマイズはfetcher層やOrval設定で行う。
- **Zodスキーマはバリデーション専用**: Server Actionsでのリクエストバリデーションに使用し、レスポンスのバリデーションには使用しない（`response: false` で生成していない）。
