---
tags:
  - nextjs
  - reference
created: 2026-02-24
updated_at: 2026-02-24
status: active
---

# Birdcage 実装知見リファレンス

Next.js 15 App Router プロジェクト（Birdcage）で得た実装知見を明文化したドキュメント群。次プロジェクトのリファレンスとして活用する。

## 目次

| #   | ドキュメント                                                    | 概要                                                          |
| --- | --------------------------------------------------------------- | ------------------------------------------------------------- |
| 01  | [ページ組み立てパターン](./01-page-assembly-pattern.md)         | ErrorBoundary > Suspense > Container、Suspense key trick      |
| 02  | [Server Actionパターン](./02-server-action-pattern.md)          | ServerActionState型、2層バリデーション、useActionState消費    |
| 03a | [APIクライアント概要](./03a-api-client-overview.md)             | Orval設定、3種生成の全体像、afterAllFilesWrite hook           |
| 03b | [APIクライアント: Fetcher](./03b-api-client-fetchers.md)        | customServerFetch / customClientFetch / common.ts             |
| 03c | [APIクライアント: プロキシ](./03c-api-client-proxy.md)          | プロキシルートハンドラ、リクエストフロー、使い分けガイド      |
| 04a | [エラーハンドリング三層構造](./04a-error-handling-layers.md)    | global-error → error.tsx → ClientErrorBoundary                |
| 04b | [エラーレポート & ハンドラ](./04b-error-reporting-handlers.md)  | クライアントエラーレポート、window.onerror                    |
| 05  | [エラークラス設計](./05-error-class-design.md)                  | ApiError階層、Factory Pattern、NetworkError                   |
| 06  | [React Query設定思想](./06-react-query-config.md)               | staleTime/gcTime/shouldRetry設計、QueryProvider実装           |
| 07  | [Zustand最小主義](./07-zustand-minimal-usage.md)                | 設計方針、breadcrumb-store、BreadcrumbRegister                |
| 07b | [Zustandウィザードパターン](./07b-zustand-wizard-pattern.md)    | persist + skipHydration、File⇔Base64ストレージ                |
| 08  | [認証 & ミドルウェア](./08-auth-and-middleware.md)              | NextAuth.js 5 beta、ドメイン制限、Request ID伝播              |
| 09a | [Hooks: クエリ制御](./09a-hooks-query-control.md)               | useQueryControl、ヘルパー関数、使用例                         |
| 09b | [Hooks: モーダルパターン](./09b-hooks-modal-patterns.md)        | useFormModal、DeleteModal、画像フィールド Discriminated Union |
| 10a | [テスト: Vitest設定](./10a-testing-vitest-config.md)            | Vitest 3プロジェクト構成、setup files                         |
| 10b | [テスト: パターン集](./10b-testing-patterns.md)                 | Container/Presentationalテスト、Hooksテスト                   |
| 10c | [Storybook設定](./10c-storybook-setup.md)                       | Storybook設定、Story実装パターン、テストコマンド              |
| 11a | [ツール: Docker & ビルド](./11a-tooling-docker.md)              | Dockerfile、compose.yaml、next.config、tsconfig               |
| 11b | [ツール: Plop](./11b-tooling-plop.md)                           | Plop設定、テンプレート                                        |
| 11c | [ツール: ESLint Boundaries](./11c-tooling-eslint-boundaries.md) | ESLint boundaries設定、依存ルール                             |
| 12a | [ロギング: アーキテクチャ](./12a-logging-architecture.md)       | 設計方針、パイプライン、GCP連携                               |
| 12b | [ロギング: 実装](./12b-logging-implementation.md)               | createLogger、実装例、ベストプラクティス                      |

---

## 読み順ガイド

### 新プロジェクト立ち上げ時

1. **11a → 03a/b/c → 08** — ツールチェーン → APIクライアント生成 → 認証基盤をセットアップ
2. **04a/b → 05 → 06** — エラーハンドリング → エラークラス → React Query でデータ取得基盤を構築
3. **01 → 02** — ページ組み立て → Server Action でUIパターンを確立
4. **07/07b → 09a/b** — 状態管理 → 汎用Hooks で開発効率を上げる
5. **10a/b/c** — テスト戦略を導入
6. **12a/b** — ロギング基盤を整備

### 既存コードベースのキャッチアップ時

1. **01** — ページ構造を理解する（最も頻繁に触る部分）
2. **03a → 02** — API呼び出し → Server Action の流れを把握
3. **04a → 05 → 08** — エラーハンドリング → エラークラス → 認証を理解
4. 残りを必要に応じて参照
