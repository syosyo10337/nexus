---
name: format
description: Markdown ファイルを CONVENTIONS.md のルールに従ってフォーマットする。引数にファイルパスまたはglobパターンを指定する。
argument-hint: "<ファイルパスまたはglobパターン>"
---

# format — Markdown フォーマッター

CONVENTIONS.md に基づいて Markdown ファイルを整形するスキル。

## 引数

- ファイルパス（例: `Tech/note.md`）
- glob パターン（例: `Tech/**/*.md`）
- 引数なし → 現在の会話で話題になっているファイル、またはユーザーに確認

## フォーマットルール

以下のルールを **すべて** チェックし、違反があれば修正する。

### 1. フロントマター

- フロントマターが存在しなければ追加する
- 必須フィールド: `tags`, `created_at`, `status`
- フィールド順序: `tags` → `created_at` → `updated_at` → `status`（その後に追加フィールド）
- `tags` はリスト形式、kebab-case
- `created_at` / `updated_at` は `YYYY-MM-DD` 形式
- `status` は `draft` / `active` / `archived` のいずれか
- `updated_at` を本日の日付に更新する

### 2. 旧フィールドのマイグレーション

- `create_at` → `created_at` にリネーム
- `updated` → `updated_at` にリネーム

### 3. リンク記法

- Wikilink `[[ページ名]]` → `[ページ名](ページ名.md)` に変換
- Wikilink `[[ページ名|表示名]]` → `[表示名](ページ名.md)` に変換
- Wikilink `![[画像.png]]` → `![画像.png](Attachments/画像.png)` に変換（画像の場合）
- パス内のスペースは `%20` にエンコードする

### 4. タグ

- フロントマター内の `tags` が kebab-case であることを確認
- camelCase や PascalCase のタグは kebab-case に変換

### 5. 行数チェック

- 300行を超える場合はユーザーに警告する（自動分割はしない）

## 実行手順

1. 対象ファイルを Read で読み込む
2. 上記ルールに基づいて違反箇所を特定する
3. Edit で修正を適用する
4. 修正内容のサマリーをユーザーに報告する

## 出力フォーマット

修正完了後、以下の形式で報告する:

```
✅ <ファイル名>
  - [修正内容1]
  - [修正内容2]
  ...
```

修正不要の場合:

```
✅ <ファイル名> — 修正なし
```
