---
tags:
  - git
  - clean-code
  - tidy-first
  - workflow
created: 2025-11-29
updated: 2025-11-29
status: draft
related:
  - "Tidy first?"
---

# PRをわけるgit操作

Tidy First? の実践として、振る舞い（Behavior）と構造（Structure）の変更を分けるためのGit操作手順。

## 実践的なGit戦略

### 1. Interactive Rebase で変更を再構成する ✅

現在のブランチから origin/main以降の全コミットを対話的に編集

```bash
git rebase -i origin/main
```

ここで以下の操作が可能：

- `pick` / `reword` で各コミットを確認
- `squash` または `fixup` で関連する小さな変更をまとめる
- 順序を入れ替えて意図を明確にする

### 2. 段階的に差分を分割する ✅

変更済みファイルの中から、構造的変更のみを1つのコミットに、振る舞いの変更をもう1つに分離：

```bash
# 変更を一度stashしてから段階的に add
git add --interactive   # またはGUIツール

# ファイルの一部だけをステージング
git add -p              # パッチモード（行単位で選択可能）

git commit -m "refactor: XXXの構造をYYに変更（振る舞い不変）"
git commit -m "feat: XXXの新機能"
```

### 3. 複数のfeature branchに分割する ✅

現在のブランチ状態から、複数の下流ブランチを作成：

```bash
# 現在のポイント（refactoring完了）
git checkout -b feature/structure-change
git commit ...
git push origin feature/structure-change  # PR 1: refactoring

# refactoring前に戻る
git checkout -b feature/new-behavior origin/main

# 修正を取り込む（cherry-pick または手動で）
git cherry-pick <commits>
git push origin feature/new-behavior      # PR 2: 新機能
```

## より現実的な実践パターン

### パターンA: 「汚いまま進める → 後で整理」（推奨）

```bash
# 1. 汚い状態でコミット（ローカル）
git add .
git commit -m "WIP: refactoring + new feature"

# 2. 後から分割
git reset --soft origin/main  # コミット取り消し、変更は保持
git add -p                     # パッチモードで選別
git commit -m "refactor: 構造の変更"
git add .
git commit -m "feat: 新機能"
git push -u origin my-branch
```

### パターンB: 「最初から分けて作業」（より専門的）

```bash
# 構造的変更の実施
git checkout -b refactor/xxx

# 構造を変更＆テスト
git commit -m "refactor: ..."
git push origin refactor/xxx

# そのブランチから新機能ブランチを分岐
git checkout -b feature/yyy refactor/xxx

# 振る舞いを追加＆テスト
git commit -m "feat: ..."
git push origin feature/yyy
```

## 役立つツール＆コマンド

```bash
# 変更内容を確認しながら add
git diff HEAD~1..HEAD --stat  # どのファイルが変わった？
git show HEAD                  # 最後のコミット詳細

# ブランチの親子関係を可視化
git log --graph --oneline --all

# 前のバージョンと差分を確認
git diff origin/main..HEAD -- <file>
```

## よくある失敗と対策

### 失敗: mergeした後に「あ、これ分割すべきだった」

→ **対策:** PRをmergeする前に `git rebase -i` で整理＆push

### 失敗: 複数PRを同時に出してconflict地獄

→ **対策:** PRの依存関係を明示（PR descriptionに記載）、必要に応じてbase branchを `origin/main` ではなく前のPRに設定

## 次のステップ

具体的なあなたのケースで、実装の詳細を見れば、より具体的な操作を提案できます。今困っている特定の変更があれば、教えてもらえますか？
