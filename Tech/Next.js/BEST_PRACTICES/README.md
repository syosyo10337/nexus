# Birdcage ベストプラクティス & ボイラープレートリファレンス

このドキュメント群は、新規プロジェクト時に得た **Next.js 15 App Router のベストプラクティス** を明文化し、次プロジェクトのボイラープレートリファレンスとして活用するためのものです。

## 目次

| #   | ドキュメント                                                            | 概要                                                                                                                                             |
| --- | ----------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| 01  | [ページ組み立てパターン](./01-page-assembly-pattern.md)                 | `ClientErrorBoundary > Suspense > Container` 構成、Suspense key trick、renderless component によるZustand注入、`params`/`searchParams` Promise型 |
| 02  | [Server Actionパターン](./02-server-action-pattern.md)                  | `ServerActionState` 型、変換+Zodバリデーション+API呼び出し+revalidation の統一フロー、`useActionState` でのクライアント消費                      |
| 03  | [APIクライアント3種の使い分け](./03-api-client-trinity.md)              | Orval 3種生成（server fetch / client fetch / React Query）、カスタムfetcher、プロキシルートハンドラ                                              |
| 04  | [エラーハンドリング三層構造](./04-error-handling-strategy.md)           | `global-error.tsx` → `error.tsx` → `ClientErrorBoundary`、エラークラス階層、クライアントエラーレポーター                                         |
| 05  | [React Query設定思想](./05-react-query-config.md)                       | `staleTime` / `gcTime` / `shouldRetry()` の設計判断、QueryProvider実装                                                                           |
| 06  | [Zustandの最小主義 + ウィザードパターン](./06-zustand-minimal-usage.md) | persist + skipHydration、File⇔Base64カスタムストレージ、ウィザードルート構成                                                                     |
| 07  | [認証 & ミドルウェア](./07-auth-and-middleware.md)                      | NextAuth.js 5 beta設定、ドメイン制限、Request ID伝播、`cache()` によるテナント取得dedup                                                          |
| 08  | [汎用Hooksリファレンス](./08-reusable-hooks.md)                         | `useQueryControl` / `useFormModal` / `useDeleteModal`、画像フィールド Discriminated Union                                                        |
| 09  | [テスト & Storybook実装パターン](./09-testing-and-storybook.md)         | Vitest 3プロジェクト構成、MSWセットアップ、Container/Presentationalテスト、Storybook MSW integration                                             |
| 10  | [開発ツール (Docker/Orval/Plop/ESLint)](./10-tooling-and-dx.md)         | マルチステージDockerfile、Docker開発環境、Plop scaffolding、ESLint boundaries                                                                    |
| 11  | [ボイラープレート用コードスニペット集](./11-boilerplate-snippets.md)    | 新プロジェクトにコピペで持っていけるテンプレート集                                                                                               |

---

## 読み順ガイド

### 新プロジェクト立ち上げ時

1. **10 → 03 → 07** — ツールチェーン → APIクライアント生成 → 認証基盤を最初にセットアップ
2. **04 → 05** — エラーハンドリング → React Query設定でデータ取得基盤を構築
3. **01 → 02** — ページ組み立て → Server Action でUIパターンを確立
4. **06 → 08** — 状態管理 → 汎用Hooks で開発効率を上げる
5. **09** — テスト戦略を導入
6. **11** — スニペット集から必要なコードをコピー

### 既存コードベースのキャッチアップ時

1. **01** — ページ構造を理解する（最も頻繁に触る部分）
2. **03 → 02** — API呼び出し → Server Action の流れを把握
3. **04 → 07** — エラーハンドリング → 認証を理解
4. 残りを必要に応じて参照
