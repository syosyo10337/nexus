---
tags:
  - github-actions
  - workflow
  - ci
  - cd
  - index
created: 2026-01-03
updated: 2026-02-06
status: active
---

# GitHub Actions - 目次

このドキュメントは以下のトピックに分割されています。

## 📚 ドキュメント一覧

### 1. [基本概念](Github%20Actions%20基本概念.md)

- Workflows、イベント、ジョブ、アクション、ランナーの基本概念
- アクションの基本構造
- YAMLファイルの書き方
- 公式ドキュメントへのリンク

### 2. [変数と入力](Github%20Actions%20変数と入力.md)

- 環境変数の使い方
- GitHubで用意されている変数
- ワークフローへの入力設定
- Step間での値の共有方法

### 3. [ワークフロー制御](Github%20Actions%20ワークフロー制御.md)

- トリガーの設定（push、pull_request、workflow_dispatch等）
- 重複実行の回避（concurrency）
- 権限の設定（permissions）
- 条件分岐とデプロイ条件

### 4. [キャッシュ戦略](Github%20Actions%20キャッシュ戦略.md)

- Package Manager Cache
- Docker Layer Cache
- Build Output Cache
- キャッシュのベストプラクティス

### 5. [実装例](Github%20Actions%20実装例.md)

- Feature環境へのデプロイワークフロー
- Composite Actionの作成例
- Matrixでの並行実行
- Flutter関連の実装例

## 🔗 主要な参考リンク

- [GitHub Actions 公式ドキュメント](https://docs.github.com/ja/actions)
- [ワークフロー構文リファレンス](https://docs.github.com/ja/actions/using-workflows/workflow-syntax-for-github-actions)
- [ワークフローをトリガーするイベント](https://docs.github.com/ja/actions/using-workflows/events-that-trigger-workflows)
