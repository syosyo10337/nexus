# Vault管理スクリプト

このフォルダには、Obsidian Vaultを整理・管理するためのPythonスクリプトが含まれています。

## 前提条件

- Python 3.8以上
- 標準ライブラリのみ使用（追加インストール不要）

## スクリプト一覧

### 1. `rename_uuid_files.py`

Notion形式のUUID付きファイル名をクリーンな名前にリネームします。

```bash
# 確認のみ（dry-run）
python3 rename_uuid_files.py --dry-run

# 実行
python3 rename_uuid_files.py --execute
```

**変換例:**
- `Amazon SNS 13b38cdd027d801689b8f6d2a9f47b8f.md` → `Amazon SNS.md`
- `(draft)ファイル名 UUID.md` → `ファイル名.md`

### 2. `merge_imported_folders.py`

`imported/` フォルダの内容を親フォルダに統合します。

```bash
# 確認のみ
python3 merge_imported_folders.py --dry-run

# 実行
python3 merge_imported_folders.py --execute
```

**対象:**
- `Git/imported/*.md` → `Git/`
- `Attachments 1/` → `Attachments/`

### 3. `add_frontmatter.py`

全mdファイルにフロントマター（tags, created, status）を追加します。

```bash
# 確認のみ
python3 add_frontmatter.py --dry-run

# 実行
python3 add_frontmatter.py --execute
```

**追加されるフロントマター:**
```yaml
---
tags: []
created: 2025-01-04
status: draft
---
```

### 4. `find_duplicates.py`

重複・類似ファイルを検出します。

```bash
python3 find_duplicates.py
```

**検出対象:**
- 同名ファイル（UUIDの有無で異なるもの）
- `(1)`, `(2)` サフィックス付きファイル
- 類似コンテンツ（80%以上の類似度）

## 使用上の注意

1. **必ずバックアップを取得してから実行してください**
2. まず `--dry-run` で変更内容を確認
3. 問題なければ `--execute` で実行
4. Obsidianを閉じた状態で実行することを推奨

## バックアップの作成

```bash
cd /Users/masanao/Obsidian
cp -r nexus "nexus-backup-$(date +%Y%m%d-%H%M%S)"
```

