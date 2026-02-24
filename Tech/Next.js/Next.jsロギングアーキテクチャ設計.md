---
tags:
  - nextjs
  - logging
  - architecture
  - pino
  - gcp
created: 2026-02-24
updated_at: 2026-02-24
status: active
---

# Next.jsロギングアーキテクチャ設計

Next.js App Routerにおけるロギング基盤の詳細設計。各機構の「なぜこう作ったか」を説明する。

## 関連ドキュメント

- [Next.jsクライアント・サーバーロギング戦略](Next.js%E3%82%AF%E3%83%A9%E3%82%A4%E3%82%A2%E3%83%B3%E3%83%88%E3%83%BB%E3%82%B5%E3%83%BC%E3%83%90%E3%83%BC%E3%83%AD%E3%82%AE%E3%83%B3%E3%82%B0%E6%88%A6%E7%95%A5.md) - 全体戦略と概要
- [Next.jsロギング実装例とベストプラクティス](Next.js%E3%83%AD%E3%82%AE%E3%83%B3%E3%82%B0%E5%AE%9F%E8%A3%85%E4%BE%8B%E3%81%A8%E3%83%99%E3%82%B9%E3%83%88%E3%83%97%E3%83%A9%E3%82%AF%E3%83%86%E3%82%A3%E3%82%B9.md) - 具体的な実装とパターン

## クライアントエラーレポーティング設計

### 3層分離の理由

```text
Browser                    Next.js Server             GCP
┌──────────────┐    POST   ┌──────────────┐   stdout  ┌──────────────┐
│ エラー発生   │ ────────→ │ API Route    │ ────────→ │ Cloud        │
│              │           │ Zod検証      │           │ Logging      │
│ reportClient │           │ Pino記録     │           │              │
│ Error()      │           │              │           │              │
└──────────────┘           └──────────────┘           └──────────────┘
```

1. **ブラウザ側**: エラーキャプチャとシリアライゼーションのみ
   - バンドルサイズ削減（Pinoをクライアントに含めない）
   - エラーオブジェクトの正規化
2. **API Route**: 検証、構造化、記録
   - スキーマ検証によるデータ整合性保証
   - サーバーコンテキスト（テナント、Request ID）の付与
   - 統一されたログフォーマット
3. **GCP Cloud Logging**: 永続化と分析
   - 構造化JSONによる高度な検索・集計
   - アラート設定との統合

### エラーキャプチャ3種類

#### 1. Error Boundary（React Error Boundary）

```text
レンダリングエラー → error.tsx / global-error.tsx → reportClientError() [level: error]
```

**キャプチャする**:

- コンポーネントのレンダリング中のエラー
- ライフサイクルメソッド内のエラー
- コンストラクタ内のエラー

**キャプチャしない**:

- イベントハンドラ内のエラー → `addEventListener('error')` で捕捉
- 非同期コード（`setTimeout`, `Promise`）のエラー → `unhandledrejection` で捕捉
- Server Component / Server Actionのエラー → サーバー側で直接ログ記録

#### 2. window error イベント（グローバルエラーハンドラ）

```text
同期エラー（イベントハンドラ等） → addEventListener('error') → reportClientError() [level: warn]
```

**キャプチャする**:

- イベントハンドラ内の同期エラー
- グローバルスコープでの実行時エラー
- Error Boundaryで捕捉されなかったエラー

#### 3. unhandledrejection イベント

```text
未処理のPromise rejection → addEventListener('unhandledrejection') → reportClientError() [level: warn]
```

**キャプチャする**:

- `.catch()` されていないPromise rejection
- `async/await` で `try-catch` されていないエラー

### シリアライゼーション戦略

`Error` オブジェクトは `JSON.stringify()` で空オブジェクト `{}` になる問題がある。`serializeError()` で `message`, `name`, `stack` を明示的に抽出して送信する。

```typescript
JSON.stringify(new Error("test")); // => '{}'  ← 問題
serializeError(new Error("test")); // => { message: 'test', name: 'Error', stack: '...' }
```

### 無限ループ防止設計

`reportClientError()` 自体がエラーを起こした場合に無限ループにならないよう、`catch` 節では何もしない（silent fail）。開発環境でのみ `console.warn` で通知する。

### API Route スキーマ検証設計

受信側API Routeでは `ClientErrorPayloadSchema`（Zod）でペイロードを検証する。検証失敗時はサーバーログに `warn` で記録し、400を返す。クライアントからの不正データがログを汚染しない。

## サーバーサイドロギング設計

### createLogger() のガード設計

`createLogger()` は2重のガードでクライアント環境での実行を防止する。

1. **`import "server-only"`**: クライアントバンドルにインポートされた時点でビルドエラー
2. **`IS_SERVER` ランタイムチェック**: テスト環境等での誤実行時に `noOpLogger`（silent）を返す

```typescript
import "server-only"; // ビルド時ガード

export function createLogger(options = {}) {
  if (!IS_SERVER) {
    return noOpLogger; // ランタイムガード
  }
  // ...
}
```

**なぜ2重にするか**: `server-only` はビルド時のみ。テスト実行時（jsdom環境）にはビルドを通らないため、ランタイムのフォールバックが必要。

### child logger パターンの設計意図

Pinoのルートロガーは1つだけ生成し、`child()` で `source` と `module` を付与したchild loggerを返す。

```typescript
// ルートロガー（1つだけ）
const logger = pino(getLoggerConfig());

// child logger（モジュールごと）
return baseLogger.child({ source: "[Server]", module: "api-events" });
```

**利点**:

- ルートロガーの設定（level, redact, transport）を一元管理
- child loggerは追加コンテキストのみ持つ（メモリ効率が良い）
- `source` でサーバー/クライアント由来を区別、`module` で発生源を特定

### 実行時評価の設計

環境変数はモジュールスコープではなく**関数内で参照**する。Next.jsビルド時にモジュールスコープの `process.env` は値が埋め込まれるため、同一ビルドイメージを複数環境にデプロイすると環境が固定される問題がある。

```text
┌─────────────────┐
│  next build     │  ENV=staging でビルド
└────────┬────────┘
         │
         ├─────────────────┐
         │                 │
         ▼                 ▼
    ┌─────────┐      ┌──────────┐
    │ Staging │      │Production│
    │ ENV=    │      │ ENV=     │
    │ staging │      │production│
    └─────────┘      └──────────┘
         │                 │
         ▼                 ▼
    LOG_LEVEL=info   LOG_LEVEL=info
    (実行時評価)     (実行時評価)
```

```typescript
// ❌ モジュールスコープ: ビルド時に固定される
const LOG_LEVEL = process.env.LOG_LEVEL ?? "info";

// ✅ 関数内: 実行時に評価される
function getLogLevel(): string {
  return (
    process.env.LOG_LEVEL ??
    DEFAULT_LOG_LEVELS[process.env.ENV ?? "local"] ??
    "info"
  );
}
```

## Request IDトレーシング設計

### 目的

1. **エンドツーエンドの追跡**: クライアントリクエストからバックエンドAPIまで一貫したID
2. **分散トレーシング**: マイクロサービス間のリクエスト関連付け
3. **デバッグ効率化**: 特定のリクエストに関連するすべてのログを検索

### 伝搬フロー

```text
1. 外部からのリクエスト（ロードバランサ）
   ↓
   x-request-id: あり → そのまま使用
   x-request-id: なし → crypto.randomUUID() で生成
   ↓
2. Middleware
   ↓
   レスポンスヘッダーに x-request-id を付与
   ↓
3. Server Components / API Routes
   ↓
   request.headers.get('x-request-id')
   ↓
   ログコンテキストに含める
   ↓
4. バックエンドAPI呼び出し
   ↓
   headers: { 'x-request-id': requestId }
   ↓
5. GCP Cloud Logging
   ↓
   { requestId: '...', ... }
```

## Redaction 機密情報マスキング設計

### 3階層の機密レベル

| Tier | 分類                 | 例                                             |
| ---- | -------------------- | ---------------------------------------------- |
| 1    | 認証情報（最高機密） | password, token, apiKey, authorization, cookie |
| 2    | 決済情報（PCI DSS）  | creditCard, cardNumber, cvv, stripe_secret     |
| 3    | セッション管理       | sessionId, csrf, csrfToken                     |

### ワイルドカードパターン

ネストしたオブジェクト内のフィールドもマスキングできるよう、ワイルドカードパターンを定義。

```typescript
const REDACT_PATHS = [
  ...TIER1_AUTH,
  ...TIER2_PAYMENT,
  ...TIER3_SESSION,
  "*.password", // 任意のオブジェクト内の password
  "*.token", // 任意のオブジェクト内の token
  "headers.cookie", // HTTPヘッダーのcookie
  "headers.authorization", // HTTPヘッダーのauthorization
  "users[*].password", // 配列内の各要素の password
  "users[*].token", // 配列内の各要素の token
];
```

### 動作例

```typescript
// 入力
log.info({
  user: { email: 'user@example.com', password: 'secret123' },
  headers: { authorization: 'Bearer token123' },
})

// 出力（Cloud Loggingに送信される）
{
  user: { email: 'user@example.com', password: '[REDACTED]' },
  headers: { authorization: '[REDACTED]' },
}
```

フィールド自体は削除せず、値のみ `[REDACTED]` に置換する（`remove: false`）。ログの構造を保持しつつ機密情報を除去。

## GCP Cloud Logging統合設計

### 環境別切り替えロジック

`isGcpEnvironment()`（staging/production）で GCP用フォーマット、それ以外では `pino-pretty` による開発向け出力に切り替え。

```typescript
function isGcpEnvironment(): boolean {
  const env = process.env.ENV ?? "local";
  return env === "staging" || env === "production";
}
```

### GCP特有フィールド

`@google-cloud/pino-logging-gcp-config` が自動付与するフィールド:

| フィールド       | 説明                             | 例                                          |
| ---------------- | -------------------------------- | ------------------------------------------- |
| `severity`       | ログレベル（GCP形式）            | `INFO`, `ERROR`, `WARNING`                  |
| `timestamp`      | ISO8601形式のタイムスタンプ      | `2026-02-24T10:30:00.123Z`                  |
| `message`        | ログメッセージ                   | `Event created`                             |
| `serviceContext` | サービス識別情報                 | `{ service: 'birdcage', version: '1.0.0' }` |
| `httpRequest`    | HTTPリクエスト情報（オプション） | `{ method: 'POST', url: '/api/...' }`       |

### 出力形式比較

#### ローカル開発（pino-pretty）

```text
[2026-02-24 10:30:00] INFO: [Server](api-events): Event created
    eventId: 123
    userId: "abc-def"
```

#### staging/production（GCP JSON）

```json
{
  "severity": "INFO",
  "timestamp": "2026-02-24T10:30:00.123Z",
  "message": "Event created",
  "source": "[Server]",
  "module": "api-events",
  "eventId": 123,
  "serviceContext": {
    "service": "birdcage",
    "version": "1.0.0"
  }
}
```

### next.config.ts serverExternalPackages

```typescript
// next.config.ts
const nextConfig: NextConfig = {
  serverExternalPackages: [
    "pino",
    "pino-pretty",
    "@google-cloud/pino-logging-gcp-config",
  ],
};
```

**理由**: Pinoは C++ バインディング（`pino-pretty` の依存）を含むため、Next.jsのバンドラー（Turbopack/Webpack）でバンドルするとエラーになる。`serverExternalPackages` で除外し、Node.js の `require` でロードする。

## 参考リンク

- [Pino Redaction](https://getpino.io/#/docs/redaction)
- [GCP Logging - Structured Logging](https://cloud.google.com/logging/docs/structured-logging)
- [Next.js - serverExternalPackages](https://nextjs.org/docs/app/api-reference/next-config-js/serverExternalPackages)
