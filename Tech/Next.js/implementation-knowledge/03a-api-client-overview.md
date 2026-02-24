---
tags:
  - nextjs
  - api-client
  - orval
  - openapi
  - code-generation
created: 2026-02-24
updated_at: 2026-02-24
status: active
---

# APIクライアント全体像 & Orval設定

## 関連ドキュメント

- [APIクライアント: fetcher実装](./03b-api-client-fetchers.md)
- [APIクライアント: プロキシ & 使い分け](./03c-api-client-proxy.md)

---

## 全体像

Birdcageでは、OpenAPI仕様から[Orval](https://orval.dev/)を使って**3種類のクライアント**を自動生成している。それぞれ用途・実行環境・通信経路が異なるため、正しく使い分けることが重要である。

| 種別                       | ファイル拡張子 | fetcher             | 用途                                           | baseUrl                               |
| -------------------------- | -------------- | ------------------- | ---------------------------------------------- | ------------------------------------- |
| Server Fetch               | `*.ts`         | `customServerFetch` | RSC / Server Actions                           | 直接BE API (`IBIS_API_SSR_BASE_PATH`) |
| Client Fetch (React Query) | `*.query.ts`   | `customClientFetch` | Client Components (`useQuery` / `useMutation`) | `/api/proxy` 経由                     |
| Zod Schema                 | `*.zod.ts`     | -                   | バリデーション（リクエストボディ・パラメータ） | -                                     |

**誤ったファイルからimportするとランタイムエラーになる。** Server Componentで `*.query.ts` を使うとReact Queryのクライアント依存でエラーになり、Client Componentで `*.ts` を使うと `server-only` モジュールにより即座にビルドエラーとなる。

```typescript
// Server Component / Server Action
import { getCommunityEvent } from "@/api/__generated__/endpoints/community-event-service/community-event-service";

// Client Component
import { useGetCommunityEvent } from "@/api/__generated__/endpoints/community-event-service/community-event-service.query";
```

---

## Orval設定 (`orval.config.ts`)

3種類のクライアント生成は、すべて `orval.config.ts` の `defineConfig` で宣言的に定義されている。

```typescript
// orval.config.ts
import { defineConfig } from "orval";

import { replaceRequestInitType } from "./orval-hooks/replace-request-init-type.ts";

const IBIS_SPEC_PATH = "./wagtail/ibis/openapi/openapi3.yaml";
const OUTPUT_BASE_PATH = "./src/api/__generated__";
const IBIS_API_SSR_BASE_PATH = process.env.IBIS_API_SSR_BASE_PATH ?? "";

// NOTE: 他サービス向けの内部スキーマを除外する
const IBIS_INPUT = {
  target: IBIS_SPEC_PATH,
  filters: {
    mode: "exclude" as const,
    schemas: [/^ForDuckSvcGrpc/, /^ForWoodpeckerSvcGrpc/],
  },
};

export default defineConfig({
  // ─────────────────────────────────────────────
  // 1. apiIbis: サーバーサイド用fetchクライアント
  // ─────────────────────────────────────────────
  // RSC・Server Actionsから直接BE APIを呼ぶためのクライアント。
  // customServerFetch をmutatorに指定し、認証・テナントID・リクエストIDを自動注入する。
  apiIbis: {
    input: IBIS_INPUT,
    output: {
      mode: "tags-split",
      target: `${OUTPUT_BASE_PATH}/endpoints`,
      schemas: `${OUTPUT_BASE_PATH}/models`,
      client: "fetch",
      clean: true,
      baseUrl: IBIS_API_SSR_BASE_PATH,
      // NOTE: 生成されるモックだと、データの加工が必要なケースが多いため、手動でハンドラーを登録する。
      mock: false,
      override: {
        // NOTE: 認証やハンドリングを実装するためのfetch関数のwrapper
        mutator: {
          path: "./src/api/fetchers/server.ts",
          name: "customServerFetch",
        },
        fetch: {
          includeHttpResponseReturnType: false,
        },
      },
    },
    hooks: {
      /**
       * HACK: 生成されたfetchクライアントのRequestInit型をCustomServerFetchOptionsに置換
       *
       * Orval v7のclient: 'fetch'モードでは、RequestInit型のカスタマイズが
       * 設定プロパティだけではサポートされていないため、hooks で後処理を行う。
       *
       * 参考: https://github.com/orval-labs/orval/discussions/1610
       */
      afterAllFilesWrite: async (filePaths) => {
        console.log("生成ファイルの型を後処理中...");
        const paths = filePaths as string[];
        for (const filePath of paths) {
          if (filePath.includes("/endpoints/") && filePath.endsWith(".ts")) {
            await replaceRequestInitType(filePath);
          }
        }
        console.log("型の後処理が完了しました");
      },
    },
  },

  // ─────────────────────────────────────────────
  // 2. zodIbis: Zodスキーマ生成
  // ─────────────────────────────────────────────
  // Server Actionsでのリクエストバリデーションに使用する。
  // param（パスパラメータ）と body のみ生成し、query・header・responseは生成しない。
  zodIbis: {
    input: IBIS_INPUT,
    output: {
      mode: "tags-split",
      target: `${OUTPUT_BASE_PATH}/endpoints`,
      client: "zod",
      fileExtension: ".zod.ts",
      override: {
        zod: {
          generate: {
            param: true,
            query: false,
            header: false,
            body: true,
            response: false,
          },
        },
      },
    },
  },

  // ─────────────────────────────────────────────
  // 3. reactQueryIbis: React Query hooks
  // ─────────────────────────────────────────────
  // Client Componentでのデータフェッチに使用する。
  // /api/proxy 経由でBE APIにリクエストを送る。
  // 現在はEventCheckInPortalServiceのみで使用している。
  reactQueryIbis: {
    input: {
      target: IBIS_SPEC_PATH,
      // NOTE: React Query hooks は現在 EventCheckInPortalService のみで使用
      filters: {
        mode: "include",
        tags: ["EventCheckInPortalService"],
      },
    },
    output: {
      mode: "tags-split",
      target: `${OUTPUT_BASE_PATH}/endpoints`,
      schemas: `${OUTPUT_BASE_PATH}/models`,
      client: "react-query",
      httpClient: "fetch",
      fileExtension: ".query.ts",
      clean: false, // fetchクライアントと同じディレクトリなのでfalseにする
      baseUrl: "/api/proxy", // API Routesにproxyするため
      override: {
        // NOTE: クライアントサイド用の認証やハンドリングを実装するfetch関数のwrapper
        mutator: {
          path: "./src/api/fetchers/client.ts",
          name: "customClientFetch",
        },
        fetch: {
          includeHttpResponseReturnType: false,
        },
        query: {
          useQuery: true,
          useMutation: true,
          signal: true, // AbortSignalサポート（リクエストキャンセル用）
        },
      },
    },
  },
});
```

---

## afterAllFilesWrite フック: RequestInit型パッチ

Orval v7の `client: 'fetch'` モードでは、生成コード内の `options` パラメータの型が `RequestInit` に固定される。`skipAuth` のようなカスタムオプションを渡すためには `CustomServerFetchOptions` に置換する必要がある。このフックで生成後にファイルを走査し、型を書き換える。

```typescript
// orval-hooks/replace-request-init-type.ts
import { readFile, writeFile } from "node:fs/promises";

export async function replaceRequestInitType(filePath: string): Promise<void> {
  // .query.tsや.zod.tsファイルはスキップ
  if (filePath.endsWith(".query.ts") || filePath.endsWith(".zod.ts")) {
    return;
  }

  const content = await readFile(filePath, "utf-8");

  // RequestInitを含まないファイルはスキップ
  if (!content.includes("RequestInit")) {
    return;
  }

  // 既にCustomServerFetchOptionsがimportされている場合はスキップ
  if (content.includes("CustomServerFetchOptions")) {
    return;
  }

  let updatedContent = content;

  // RequestInitをCustomServerFetchOptionsに置換
  updatedContent = updatedContent.replace(
    /\boptions\?: RequestInit\b/g,
    "options?: CustomServerFetchOptions"
  );

  // customServerFetchのimport文の後にCustomServerFetchOptionsを追加
  updatedContent = updatedContent.replace(
    /import { customServerFetch } from '(.+?\/fetchers\/server)';/,
    "import { customServerFetch, type CustomServerFetchOptions } from '$1';"
  );

  await writeFile(filePath, updatedContent, "utf-8");
}
```

---

## 共有ユーティリティ (`common.ts`)

サーバーサイドとクライアントサイドの両方のfetcherで共通して使用するユーティリティ関数群。

```typescript
// src/api/fetchers/common.ts

/**
 * レスポンスボディをパースする (共通)
 */
export async function parseResponseBody<T>(response: Response): Promise<T> {
  const contentType = response.headers.get("content-type");

  if (contentType?.includes("application/json")) {
    return response.json();
  }

  return response.text() as Promise<T>;
}

/**
 * APIレスポンスからエラーメッセージを抽出する (共通)
 */
export function extractErrorMessage(data: unknown): string {
  if (data && typeof data === "object" && "message" in data) {
    return (data as { message: string }).message;
  }
  if (data && typeof data === "string") {
    return data;
  }
  return "API request failed";
}

/**
 * Content-Typeヘッダーを設定する (共通)
 */
export function getContentTypeHeader(
  body?: BodyInit | null
): Record<string, string> {
  // FormDataの場合はContent-Typeを設定しない（ブラウザが自動的に設定する）
  if (body && !(body instanceof FormData)) {
    return { "Content-Type": "application/json" };
  }
  return {};
}
```
