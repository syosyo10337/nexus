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

## 📝 関連ドキュメント

- [composite actionを作成する](<Github%20Actions%E3%82%92(%E7%A0%94%E3%81%8E)%E3%81%99%E3%81%BE%E3%81%9B%E3%81%B0/composite%20action%E3%82%92%E4%BD%9C%E6%88%90%E3%81%99%E3%82%8B%E3%80%82%202a238cdd027d805da88cda3a88526093.html>)
- [format](<Github%20Actions%E3%82%92(%E7%A0%94%E3%81%8E)%E3%81%99%E3%81%BE%E3%81%9B%E3%81%B0/format%202cc38cdd027d8078b4ebfa6488ca5926.html>)
- [head_ref on PR/ ref_name on Push](<Github%20Actions%E3%82%92(%E7%A0%94%E3%81%8E)%E3%81%99%E3%81%BE%E3%81%9B%E3%81%B0/head_ref%20on%20PR%20ref_name%20on%20Push%202b038cdd027d8084bf11f82eae0df00c.html>)
- [重複実行をやめる](<Github%20Actions%E3%82%92(%E7%A0%94%E3%81%8E)%E3%81%99%E3%81%BE%E3%81%9B%E3%81%B0/%E9%87%8D%E8%A4%87%E5%AE%9F%E8%A1%8C%E3%82%92%E3%82%84%E3%82%81%E3%82%8B%202b038cdd027d8020a327ff070b7baa93.html>)
