---
tags:
  - nextjs
  - logging
  - pino
  - gcp
  - architecture
created: 2026-02-24
updated_at: 2026-02-24
status: active
---

# Next.jsクライアント・サーバーロギング戦略

Next.js App Routerにおけるクライアントサイドとサーバーサイドのロギングアーキテクチャ。PinoとGCP Cloud Loggingを使った構造化ロギングの全体戦略。

## 関連ドキュメント

- [Next.jsロギングアーキテクチャ設計](Next.js%E3%83%AD%E3%82%AE%E3%83%B3%E3%82%B0%E3%82%A2%E3%83%BC%E3%82%AD%E3%83%86%E3%82%AF%E3%83%81%E3%83%A3%E8%A8%AD%E8%A8%88.md) - 各機構の設計思想と仕組み
- [Next.jsロギング実装例とベストプラクティス](Next.js%E3%83%AD%E3%82%AE%E3%83%B3%E3%82%B0%E5%AE%9F%E8%A3%85%E4%BE%8B%E3%81%A8%E3%83%99%E3%82%B9%E3%83%88%E3%83%97%E3%83%A9%E3%82%AF%E3%83%86%E3%82%A3%E3%82%B9.md) - コピペで使えるパターン集

## アーキテクチャ概要

### システム構成

```text
┌─────────────────────────────────────────────────────────────────────┐
│                          GCP Cloud Logging                          │
└────────────────────────────────┬────────────────────────────────────┘
                                 │ 構造化JSON (stdout)
                                 │
┌────────────────────────────────┴────────────────────────────────────┐
│                     Next.js Server (Node.js)                        │
│                                                                     │
│  ┌─────────────────────────┐   ┌──────────────────────────────────┐ │
│  │   Server Components     │   │   API Routes                     │ │
│  │   Server Actions        │   │   /api/proxy                     │ │
│  │                         │   │   /api/logs/client-errors        │ │
│  │   createLogger()        │   │   createLogger()                 │ │
│  │     └→ pino child       │   │     └→ pino child                │ │
│  └─────────────────────────┘   └──────────────────────────────────┘ │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │  Middleware (x-request-id 生成・伝搬)                         │   │
│  └──────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
                                 ▲
                                 │ POST /api/logs/client-errors
                                 │
┌────────────────────────────────┴────────────────────────────────────┐
│                        Browser (Client)                             │
│                                                                     │
│  ┌──────────────────┐  ┌──────────────┐  ┌───────────────────────┐ │
│  │ Error Boundary   │  │ window error │  │ unhandledrejection   │ │
│  │ (error.tsx)      │  │ event        │  │                       │ │
│  └────────┬─────────┘  └──────┬───────┘  └───────────┬───────────┘ │
│           └──────────────┬────┘──────────────────────┘             │
│                          ▼                                          │
│                  reportClientError()                                │
│                  └→ fetch('/api/logs/client-errors')                │
└─────────────────────────────────────────────────────────────────────┘
```

### 主要依存パッケージ

| パッケージ                                 | 用途                              |
| ------------------------------------------ | --------------------------------- |
| `pino` v10                                 | 構造化ロガー本体                  |
| `@google-cloud/pino-logging-gcp-config` v1 | GCP Cloud Logging互換フォーマット |
| `pino-pretty` v13 (dev)                    | ローカル開発用フォーマッタ        |

## 設計の3本柱

### 1. サーバーサイド: createLogger() + child logger

サーバーサイドではPinoの `child()` メソッドを使い、モジュール単位でログの発生源を識別する。

- `server-only` パッケージ + `IS_SERVER` ガードでクライアントバンドルへの混入を防止
- `source`（Server/Client）と `module`（api-events, middleware等）でログの出所を一意に特定
- 環境変数を**実行時に評価**し、同一ビルドイメージで複数環境（staging/production）に対応

```typescript
import { createLogger } from "@/shared/utils/logger";

const log = createLogger({ module: "api-events" });
log.info({ eventId: 123 }, "Event created");
// => { source: '[Server]', module: 'api-events', eventId: 123, msg: 'Event created' }
```

設計詳細: [アーキテクチャ設計 - サーバーサイドロギング設計](Next.js%E3%83%AD%E3%82%AE%E3%83%B3%E3%82%B0%E3%82%A2%E3%83%BC%E3%82%AD%E3%83%86%E3%82%AF%E3%83%81%E3%83%A3%E8%A8%AD%E8%A8%88.md#サーバーサイドロギング設計)

### 2. クライアントサイド: 3層アーキテクチャ (Browser → API Route → GCP)

ブラウザで発生したエラーはPinoを含めずに軽量にキャプチャし、API Route経由でサーバー側のPinoに記録する。

```text
Browser → API Route → GCP Cloud Logging
```

| キャプチャ元                  | 対象                     | ログレベル |
| ----------------------------- | ------------------------ | ---------- |
| Error Boundary (`error.tsx`)  | Reactレンダリングエラー  | error      |
| `addEventListener('error')`   | イベントハンドラ内エラー | warn       |
| `unhandledrejection` イベント | 未処理Promise rejection  | warn       |

設計詳細: [アーキテクチャ設計 - クライアントエラーレポーティング設計](Next.js%E3%83%AD%E3%82%AE%E3%83%B3%E3%82%B0%E3%82%A2%E3%83%BC%E3%82%AD%E3%83%86%E3%82%AF%E3%83%81%E3%83%A3%E8%A8%AD%E8%A8%88.md#クライアントエラーレポーティング設計)

### 3. 横断的関心事

#### Request ID トレーシング

Middlewareで `x-request-id` を生成し、サーバーサイドログ・バックエンドAPI呼び出しに伝搬させる。1つのユーザーリクエストに関連するすべてのログを横断的に検索可能。

設計詳細: [アーキテクチャ設計 - Request IDトレーシング設計](Next.js%E3%83%AD%E3%82%AE%E3%83%B3%E3%82%B0%E3%82%A2%E3%83%BC%E3%82%AD%E3%83%86%E3%82%AF%E3%83%81%E3%83%A3%E8%A8%AD%E8%A8%88.md#request-idトレーシング設計)

#### Redaction（機密情報マスキング）

Pinoの `redact` 機能で認証情報・決済情報・セッション情報を3階層（Tier1/2/3）に分類してマスキング。ワイルドカードパターンでネストしたオブジェクトも対応。

設計詳細: [アーキテクチャ設計 - Redaction設計](Next.js%E3%83%AD%E3%82%AE%E3%83%B3%E3%82%B0%E3%82%A2%E3%83%BC%E3%82%AD%E3%83%86%E3%82%AF%E3%83%81%E3%83%A3%E8%A8%AD%E8%A8%88.md#redaction機密情報マスキング設計)

#### 環境別設定

GCP環境（staging/production）では構造化JSON出力、ローカル開発では `pino-pretty` による人間が読みやすい出力に自動切り替え。

設計詳細: [アーキテクチャ設計 - GCP Cloud Logging統合設計](Next.js%E3%83%AD%E3%82%AE%E3%83%B3%E3%82%B0%E3%82%A2%E3%83%BC%E3%82%AD%E3%83%86%E3%82%AF%E3%83%81%E3%83%A3%E8%A8%AD%E8%A8%88.md#gcp-cloud-logging統合設計)

## 環境別ログレベル

| 環境                 | デフォルトレベル | 備考                              |
| -------------------- | ---------------- | --------------------------------- |
| local / feature      | debug            | 開発・PR環境ではすべて表示        |
| staging / production | info             | 通常運用ログのみ                  |
| test                 | silent           | テスト実行時はログ出力を抑制      |

`LOG_LEVEL` 環境変数で上書き可能（`LOG_LEVEL` > 環境別デフォルト > `info`）。

## 参考リンク

### Pino

- [Pino公式ドキュメント](https://getpino.io/)
- [Pino Redaction](https://getpino.io/#/docs/redaction)
- [Structured logging for Next.js（Arcjet Blog）](https://blog.arcjet.com/structured-logging-in-json-for-next-js/)
- [Next.js edge logging with Pino/Datadog](https://www.trysmudford.com/blog/nextjs-edge-logging/)
- [NestJsでの採用例: nestjs-pino](https://github.com/iamolegga/nestjs-pino)

### GCP / Cloud Logging

- [GCP Cloud Logging - Node.js設定](https://cloud.google.com/logging/docs/setup/nodejs)
- [GCP Structured Logging](https://cloud.google.com/logging/docs/structured-logging)
- [Next.js + GCPでの構造化ロギング](https://medium.com/@scalablecto/easy-structured-logging-with-next-js-in-google-cloud-8b308904379e)

### Next.js

- [Next.js - serverExternalPackages](https://nextjs.org/docs/app/api-reference/next-config-js/serverExternalPackages)
- [next.config.js: logging](https://nextjs.org/docs/app/api-reference/config/next-config-js/logging)
- [Next.js エラーハンドリング](https://nextjs.org/docs/app/building-your-application/routing/error-haパターンndling)

### ベストプラクティス

- [Logging Best Practices: 12 Dos and Don'ts](https://betterstack.com/community/guides/logging/logging-best-practices/)
- [クライアントサイドアプリでのエラーロギング](https://www.sitepoint.com/logging-errors-client-side-apps/)
