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

### `--package-lock-only` で再生成（推奨）

```bash
# 1. package.json を先にマージしてコンフリクトを解決
# エディタで手動マージ、または git checkout --ours/--theirs で選択
git add package.json

# 2. package-lock.json のコンフリクトを一旦解消
# オプションA: どちらかのlockfileを選ぶ（推奨）
git checkout --ours package-lock.json
# または: git checkout --theirs package-lock.json

# オプションB: 完全に削除（非推奨だが、コンフリクトが複雑な場合は有効）
# rm package-lock.json

# 3. package.json の内容から package-lock.json だけを再生成
npm install --package-lock-only

# 4. コミット
git add package-lock.json
git commit -m "Resolve package-lock.json conflict"
```

**なぜこれでコンフリクトが解消されるのか**:

1. **package.json が真実の源泉**: マージ済みの `package.json` には必要な依存関係がすべて記載されている
2. **lockfile を再計算**: `--package-lock-only` が `package.json` の内容から依存関係ツリーを計算し直す
3. **コンフリクトマーカー不要**: 一旦 checkout/削除した lockfile を、正しい内容で上書きするだけ

**`git checkout` と `rm` の違い**:

- **`git checkout --ours/--theirs`**:
  - 既存の lockfile のバージョン情報を参考にする
  - package.json に合わせて更新しつつ、lockfile 内の既存バージョンを可能な限り維持
  - 依存関係ツリーが安定しやすい
- **`rm package-lock.json`**:
  - lockfile の情報なしでゼロから依存関係を解決
  - package.json のバージョン範囲内で最適なバージョンを選択
  - バージョンが変わる可能性が高い

→ **推奨**: `git checkout` で一方を選ぶ方が、既存のバージョンを維持しやすく安全

**`--package-lock-only` の動作**:

- ✅ `package.json` を読む
- ✅ 既存の `package-lock.json` があればそれも参照（バージョン選択の参考にする）
- ✅ `package-lock.json` だけを更新/生成
- ❌ `node_modules` は見ない・触らない
- ❌ 実際のパッケージインストールはしない

**利点**:

- `node_modules` を触らない（高速）
- **既存の依存関係ツリーを尊重**（暗黙的な依存関係のバージョンが不用意に変わらない）
- package.json との整合性が保証される

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

❌ **lockfile を削除して再生成** (`rm package-lock.json && npm install`)

- 暗黙的な依存関係（他のパッケージが内部的に依存しているバージョン）が変わる可能性
- チーム全体の依存関係バージョンが不用意にアップデートされる
- 動作していたものが突然壊れるリスク

❌ **package-lock.json を一方的に選択** (`git checkout --ours/--theirs package-lock.json`)

- package.json との不整合が発生する可能性
- 必要な依存関係が欠落する

## 参考

- [npmの理解.md](npmの理解.md) - package.json と package-lock.json の役割
