---
tags:
  - javascript
  - node
  - npm
  - git
  - conflict
created: 2026-02-24
status: active
---

# package-lock.json のコンフリクト解決

## 問題

他の開発者がライブラリをアップデートしている場合、`package-lock.json` でコンフリクトが発生することがある。

**注意点**:

- 完全に削除すると暗黙的な依存関係（他のパッケージが内部的に依存しているバージョン）が変わる可能性がある
- どちらの変更を取るべきか、lockfile からは判断しづらい

## 推奨される安全な対応方法

### 方法1: `--package-lock-only` で再生成（推奨）

```bash
# 1. package.json を先にマージしてコンフリクトを解決
git add package.json

# 2. package-lock.json だけを再生成
npm install --package-lock-only

# 3. コミット
git add package-lock.json
git commit -m "Resolve package-lock.json conflict"
```

**`--package-lock-only` の利点**:

- `node_modules` を触らない
- `package.json` の内容に基づいて lockfile だけを更新
- 既存の依存関係ツリーを尊重しつつ、コンフリクトを解消

### 方法2: マージベースから再インストール

```bash
# package.json の変更を選択
git checkout --ours package.json   # 自分の変更
# または
git checkout --theirs package.json # 相手の変更

# lockfile を再生成
rm package-lock.json
npm install

# コミット
git add package.json package-lock.json
git commit -m "Resolve package-lock.json conflict"
```

### 方法3: 両方の変更を統合

```bash
# 1. package.json を手動でマージ（両方の依存関係を統合）
# エディタで手動編集

# 2. lockfile を完全に再生成
rm package-lock.json
npm install

# 3. コミット
git add package.json package-lock.json
git commit -m "Merge dependencies and regenerate lockfile"
```

## 推奨フロー

1. **package.json を先に解決**
   - どの依存関係が必要かを判断
   - 手動でマージするか、一方を選択

2. **package-lock.json を再生成**
   - `npm install --package-lock-only` で安全に再生成

3. **動作確認**
   - `npm ci` でクリーンインストール
   - テストを実行して問題ないか確認

## 避けるべき方法

❌ **コンフリクトマーカーを手動で編集**

- JSON の構造が壊れやすい
- 依存関係の整合性が取れない

❌ **一方を無条件に選択** (`--ours` or `--theirs`)

- package.json との不整合が発生する可能性

## 参考

- [npmの理解.md](npmの理解.md) - package.json と package-lock.json の役割
