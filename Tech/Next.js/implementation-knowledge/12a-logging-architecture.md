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

# ロギングアーキテクチャ設計

Next.js App Router における Pino + GCP Cloud Logging を使った構造化ロギングの全体設計。

関連: [ロギング実装例とベストプラクティス](./12b-logging-implementation.md) / [エラーハンドリング層](./04a-error-handling-layers.md)

## システム構成図

```text
+---------------------------------------------------------------------+
|                          GCP Cloud Logging                          |
+--------------------------------+------------------------------------+
                                 | 構造化JSON (stdout)
+--------------------------------+------------------------------------+
|                     Next.js Server (Node.js)                        |
|                                                                     |
|  +-------------------------+   +----------------------------------+ |
|  |   Server Components     |   |   API Routes                     | |
|  |   Server Actions        |   |   /api/proxy                     | |
|  |                         |   |   /api/logs/client-errors        | |
|  |   createLogger()        |   |   createLogger()                 | |
|  |     +-> pino child      |   |     +-> pino child               | |
|  +-------------------------+   +----------------------------------+ |
|                                                                     |
|  +--------------------------------------------------------------+  |
|  |  Middleware (x-request-id 生成・伝搬)                         |  |
|  +--------------------------------------------------------------+  |
+---------------------------------------------------------------------+
                                 ^
                                 | POST /api/logs/client-errors
+--------------------------------+------------------------------------+
|                        Browser (Client)                             |
|                                                                     |
|  +------------------+  +--------------+  +-----------------------+  |
|  | Error Boundary   |  | window error |  | unhandledrejection    |  |
|  | (error.tsx)      |  | event        |  |                       |  |
|  +--------+---------+  +------+-------+  +-----------+-----------+  |
|           +---------------+---+--------------------------+          |
|                           v                                         |
|                  reportClientError()                                |
|                  +-> fetch('/api/logs/client-errors')               |
+---------------------------------------------------------------------+
```

## 主要依存パッケージ

| パッケージ                                 | 用途                              |
| ------------------------------------------ | --------------------------------- |
| `pino` v10                                 | 構造化ロガー本体                  |
| `@google-cloud/pino-logging-gcp-config` v1 | GCP Cloud Logging互換フォーマット |
| `pino-pretty` v13 (dev)                    | ローカル開発用フォーマッタ        |

`next.config.ts` では `serverExternalPackages` に上記3つを追加する（C++ バインディングの問題回避）。

## 設計の3本柱

### 1. サーバーサイド: createLogger() + child logger

`server-only` + `IS_SERVER` ガードでクライアント混入を防止。`source` と `module` でログ出所を一意に特定。環境変数は実行時評価で同一イメージの複数環境デプロイに対応。

```typescript
const log = createLogger({ module: "api-events" });
log.info({ eventId: 123 }, "Event created");
// => { source: '[Server]', module: 'api-events', eventId: 123, msg: 'Event created' }
```

### 2. クライアントサイド: 3層アーキテクチャ

ブラウザでは Pino を含めず軽量キャプチャし、API Route 経由でサーバー側 Pino に記録。

| キャプチャ元                  | 対象                     | ログレベル |
| ----------------------------- | ------------------------ | ---------- |
| Error Boundary (`error.tsx`)  | Reactレンダリングエラー  | error      |
| `addEventListener('error')`   | イベントハンドラ内エラー | warn       |
| `unhandledrejection` イベント | 未処理Promise rejection  | warn       |

### 3. 横断的関心事

Request ID トレーシング、Redaction（機密マスキング）、環境別設定の3つ（後述）。

## 環境別ログレベル

| 環境                 | デフォルトレベル | 備考                         |
| -------------------- | ---------------- | ---------------------------- |
| local / feature      | debug            | 開発・PR環境ではすべて表示   |
| staging / production | info             | 通常運用ログのみ             |
| test                 | silent           | テスト実行時はログ出力を抑制 |

`LOG_LEVEL` 環境変数で上書き可能。

## クライアントエラーレポーティング設計

### 3層分離

```text
Browser  --POST-->  API Route (Zod検証 + Pino記録)  --stdout-->  GCP Cloud Logging
```

1. **ブラウザ側**: エラーキャプチャとシリアライゼーションのみ（バンドルサイズ削減）
2. **API Route**: スキーマ検証、サーバーコンテキスト付与、統一フォーマットで記録
3. **GCP**: 構造化JSONによる検索・集計・アラート

### エラーキャプチャ3種類

| 種類               | 対象                                           | 補足                              |
| ------------------ | ---------------------------------------------- | --------------------------------- |
| Error Boundary     | レンダリング/ライフサイクル/コンストラクタ     | イベントハンドラ・非同期は対象外  |
| window error       | イベントハンドラ内同期エラー、グローバル実行時 | Error Boundary で漏れたものも捕捉 |
| unhandledrejection | `.catch()` なし Promise、try-catch なし async  | -                                 |

### シリアライゼーション

`Error` は `JSON.stringify()` で `{}` になるため、`serializeError()` で `message`, `name`, `stack` を明示抽出。

### 無限ループ防止

`reportClientError()` 自体のエラーは silent fail。開発環境のみ `console.warn`。

## Request ID トレーシング設計

```text
外部リクエスト
  -> Middleware: x-request-id あり=そのまま / なし=crypto.randomUUID()
  -> レスポンスヘッダーに付与
  -> Server Components / API Routes: headers.get('x-request-id')
  -> バックエンドAPI呼び出し時に転送
  -> GCP Cloud Logging: { requestId: '...' }
```

目的: エンドツーエンド追跡、分散トレーシング、デバッグ効率化。

## Redaction（機密情報マスキング）設計

### 3階層の機密レベル

| Tier | 分類                 | 例                                             |
| ---- | -------------------- | ---------------------------------------------- |
| 1    | 認証情報（最高機密） | password, token, apiKey, authorization, cookie |
| 2    | 決済情報（PCI DSS）  | creditCard, cardNumber, cvv, stripe_secret     |
| 3    | セッション管理       | sessionId, csrf, csrfToken                     |

ワイルドカードパターンでネストしたオブジェクトにも対応:

```typescript
const REDACT_PATHS = [
  ...TIER1_AUTH,
  ...TIER2_PAYMENT,
  ...TIER3_SESSION,
  "*.password",
  "*.token",
  "headers.cookie",
  "headers.authorization",
  "users[*].password",
  "users[*].token",
];
```

値は `[REDACTED]` に置換（フィールド自体は保持: `remove: false`）。

## GCP Cloud Logging 統合

### 環境別切り替え

```typescript
function isGcpEnvironment(): boolean {
  const env = process.env.ENV ?? "local";
  return env === "staging" || env === "production";
}
```

GCP 環境では `@google-cloud/pino-logging-gcp-config` による構造化 JSON、それ以外では `pino-pretty`。

### 出力形式比較

**ローカル (pino-pretty)**:

```text
[2026-02-24 10:30:00] INFO: [Server](api-events): Event created
    eventId: 123
```

**staging/production (GCP JSON)**:

```json
{
  "severity": "INFO",
  "timestamp": "2026-02-24T10:30:00.123Z",
  "message": "Event created",
  "source": "[Server]",
  "module": "api-events",
  "eventId": 123,
  "serviceContext": { "service": "birdcage", "version": "1.0.0" }
}
```

GCP が自動付与するフィールド: `severity`, `timestamp`, `message`, `serviceContext`, `httpRequest`(optional)。
