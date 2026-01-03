---
tags:
  - misc
  - security
  - api
  - tooling
created: 2026-01-04
status: active
---

![](Import%20tech/Attachments/notion_lightgray.svg)

# NotionSDK

[https://developers.notion.com/reference/intro](https://developers.notion.com/reference/intro)

```JavaScript
import { Client, isFullBlock, isFullPage } from "@notionhq/client";
import type {
  BlockObjectResponse,
  PageObjectResponse,
} from "@notionhq/client/build/src/api-endpoints.js";

export interface NotionApiClientConfig {
  apiToken: string;
}

/**
 * Data Source の簡易情報（Database.data_sources 配列の要素）
 */
export interface DataSourceInfo {
  id: string;
  name: string;
}

/**
 * Database オブジェクト（API 2025-09-03）
 * ref: https://developers.notion.com/reference/database#object-fields
 */
export interface DatabaseObject {
  object: "database";
  id: string;
  data_sources: DataSourceInfo[];
}

/**
 * Rate Limit エラー (HTTP 429) の型
 */
interface RateLimitError {
  status: 429;
  headers?: { "retry-after"?: string };
}

/**
 * Rate Limit エラーかどうかを判定する型ガード関数
 */
function isRateLimitError(error: unknown): error is RateLimitError {
  return (
    typeof error === "object" &&
    error !== null &&
    "status" in error &&
    (error as { status: unknown }).status === 429
  );
}

/**
 * Notion IDを正規化する
 * NotionのUnique ID機能により、URLに日付プレフィックス（例: 2025-02- や 2025-02-19-）が
 * 付与される場合があるが、APIではUUID形式のみ受け付けるため除去する
 *
 * @example
 * normalizeNotionId("2025-02-198582e7033e807d93cdf45d287abf89")
 * // => "198582e7033e807d93cdf45d287abf89"
 *
 * normalizeNotionId("2025-02-19-8582e7033e807d93cdf45d287abf89")
 * // => "8582e7033e807d93cdf45d287abf89"
 *
 * normalizeNotionId("be633bf1-dfa0-436d-b259-571129a590e5")
 * // => "be633bf1-dfa0-436d-b259-571129a590e5" (そのまま)
 */
function normalizeNotionId(rawId: string): string {
  // 日付プレフィックスを除去: YYYY-MM-DD- または YYYY-MM-
  // YYYY-MM-DD- を先にチェック（より長いパターンを優先）
  return rawId.replace(/^\d{4}-\d{2}-\d{2}-/, "").replace(/^\d{4}-\d{2}-/, "");
}

/**
 * 純粋な API 呼び出しのみを担当し、ビジネスロジックは持たない
 */
export class NotionApiClient {
  private client: Client;
  private maxRetries: number;

  constructor(config: NotionApiClientConfig, maxRetries = 3) {
    this.client = new Client({
      auth: config.apiToken,
      timeoutMs: 15_000,
    });
    this.maxRetries = maxRetries;
  }

  /**
   * Rate Limit (HTTP 429) 対応のリトライラッパー
   * Retry-After ヘッダーを参照して待機後にリトライ
   */
  private async withRetry<T>(fn: () => Promise<T>): Promise<T> {
    for (let attempt = 0; attempt < this.maxRetries; attempt++) {
      try {
        return await fn();
      } catch (error) {
        if (isRateLimitError(error)) {
          const retryAfter = Number.parseInt(
            error.headers?.["retry-after"] || "1",
            10,
          );
          console.log(
            `Rate limited (attempt ${attempt + 1}/${this.maxRetries}). Retry after ${retryAfter}s...`,
          );
          await new Promise((resolve) =>
            setTimeout(resolve, retryAfter * 1000),
          );
          continue;
        }
        throw error;
      }
    }
    throw new Error(`Max retries (${this.maxRetries}) exceeded`);
  }

  /**
   * 生の Notion Client インスタンスを取得（notion-to-md 用）
   */
  getRawClient(): Client {
    return this.client;
  }

  /**
   * ページ情報を取得
   */
  async getPage(pageId: string): Promise<PageObjectResponse> {
    const normalizedId = normalizeNotionId(pageId);
    return this.withRetry(async () => {
      const response = await this.client.pages.retrieve({
        page_id: normalizedId,
      });
      return response as PageObjectResponse;
    });
  }

  /**
   * ブロックの子要素を全て取得（ページネーション対応）
   */
  async getBlocks(blockId: string): Promise<BlockObjectResponse[]> {
    const normalizedId = normalizeNotionId(blockId);
    const blocks: BlockObjectResponse[] = [];
    let cursor: string | undefined;
    let hasMore = true;

    while (hasMore) {
      const response = await this.withRetry(() =>
        this.client.blocks.children.list({
          block_id: normalizedId,
          start_cursor: cursor,
          page_size: 100,
        }),
      );

      for (const block of response.results) {
        if (isFullBlock(block)) {
          blocks.push(block);
        }
      }

      hasMore = response.has_more;
      cursor = response.next_cursor ?? undefined;
    }

    return blocks;
  }

  /**
   * データベース情報を取得
   */
  async getDatabase(databaseId: string): Promise<DatabaseObject> {
    const normalizedId = normalizeNotionId(databaseId);
    return this.withRetry(async () => {
      const response = await this.client.databases.retrieve({
        database_id: normalizedId,
      });
      return response as unknown as DatabaseObject;
    });
  }

  /**
   * データソース内の全ページを取得（ページネーション対応）
   */
  async queryDataSource(dataSourceId: string): Promise<PageObjectResponse[]> {
    const normalizedId = normalizeNotionId(dataSourceId);
    const pages: PageObjectResponse[] = [];
    let cursor: string | undefined;
    let hasMore = true;

    while (hasMore) {
      const response = await this.withRetry(() =>
        this.client.dataSources.query({
          data_source_id: normalizedId,
          start_cursor: cursor,
          page_size: 100,
        }),
      );

      for (const result of response.results) {
        if (isFullPage(result)) {
          pages.push(result);
        }
      }

      hasMore = response.has_more;
      cursor = response.next_cursor ?? undefined;
    }

    return pages;
  }
}
```

```JavaScript
import type {
  BlockObjectResponse,
  PageObjectResponse,
} from "@notionhq/client/build/src/api-endpoints.js";
import type { NotionApiClient } from "./notion-api-client.js";

/**
 * ページとブロックをセットで保持する型
 */
export interface PageWithBlocks {
  page: PageObjectResponse;
  blocks: BlockObjectResponse[];
}

/**
 * ページ収集ロジック
 * Notion のページ階層を再帰的に探索し、全ページを収集する
 */
export class PageCollector {
  private apiClient: NotionApiClient;

  constructor(apiClient: NotionApiClient) {
    this.apiClient = apiClient;
  }

  /**
   * ルートページ配下の全ページを取得（ルートページを含む）
   * ブロック情報も一緒に返す（Convert フェーズでの API 呼び出し削減のため）
   */
  async collectAllPages(rootPageId: string): Promise<PageWithBlocks[]> {
    const rootPage = await this.apiClient.getPage(rootPageId);
    const title = this.extractTitle(rootPage);
    console.log(`  Collecting: "${title}"`);

    const rootBlocks = await this.apiClient.getBlocks(rootPageId);
    const childPages = await this.collectChildPages(rootPageId, rootBlocks);

    return [{ page: rootPage, blocks: rootBlocks }, ...childPages];
  }

  /**
   * ページタイトルを抽出（ログ用）
   */
  private extractTitle(page: PageObjectResponse): string {
    const properties = page.properties;
    for (const key of Object.keys(properties)) {
      const prop = properties[key];
      if (prop.type === "title" && prop.title.length > 0) {
        return prop.title.map((t) => t.plain_text).join("");
      }
    }
    return page.id;
  }

  /**
   * 子ページを再帰的に取得（データベース内のページも含む）
   * 親から取得済みのブロックを受け取り、再取得を避ける
   */
  private async collectChildPages(
    pageId: string,
    blocks?: BlockObjectResponse[],
  ): Promise<PageWithBlocks[]> {
    const pageBlocks = blocks ?? (await this.apiClient.getBlocks(pageId));

    const allPages: PageWithBlocks[] = [];
    for (const block of pageBlocks) {
      const pages = await this.collectPagesFromBlock(block);
      allPages.push(...pages);
    }

    return allPages;
  }

  /**
   * ブロックからページを収集（子ページ、データベース、またはネストされたブロック）
   */
  private async collectPagesFromBlock(
    block: BlockObjectResponse,
  ): Promise<PageWithBlocks[]> {
    switch (block.type) {
      case "child_page":
        return this.collectAllPages(block.id);
      case "child_database":
        return this.collectDatabasePages(block.id);
      default:
        // has_children: true のブロックは再帰的に子ブロックを探索
        // (column_list, toggle, callout など)
        if (block.has_children) {
          return this.collectChildPages(block.id);
        }
        return [];
    }
  }

  /**
   * データベース内のページとその配下のページを収集
   */
  private async collectDatabasePages(
    databaseId: string,
  ): Promise<PageWithBlocks[]> {
    const dbPages = await this.fetchDatabasePages(databaseId);

    const allPages: PageWithBlocks[] = [];
    for (const page of dbPages) {
      const title = this.extractTitle(page);
      console.log(`  Collecting: "${title}" (from DB)`);
      const blocks = await this.apiClient.getBlocks(page.id);
      allPages.push({ page, blocks });
      const descendants = await this.collectChildPages(page.id, blocks);
      allPages.push(...descendants);
    }

    return allPages;
  }

  /**
   * データベース内の全ページ（レコード）を取得
   * API 2025-09-03 のデータモデル: Database → Data Source → Page
   */
  private async fetchDatabasePages(
    databaseId: string,
  ): Promise<PageObjectResponse[]> {
    const database = await this.apiClient.getDatabase(databaseId);
    const dataSources = database.data_sources;

    if (!dataSources || dataSources.length === 0) {
      return [];
    }

    const allPages: PageObjectResponse[] = [];
    for (const dataSource of dataSources) {
      const pages = await this.apiClient.queryDataSource(dataSource.id);
      allPages.push(...pages);
    }

    return allPages;
  }
}
```