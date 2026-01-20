---
name: update-frontmatter
description: Markdownファイルを編集する際に、frontmatterのupdated_atフィールドを自動的に現在の日付に更新する
---

# Frontmatter自動更新スキル

## 概要

このスキルは、Markdownファイル（`.md`）を編集・更新する際に、frontmatterの`updated_at`フィールドを自動的に現在の日付（`YYYY-MM-DD`形式）に更新します。

## 適用条件

- ファイル拡張子が`.md`のMarkdownファイル
- frontmatter（`---`で囲まれたYAML）が存在するファイル
- ファイルの内容が変更された場合

## 実行手順

Markdownファイルを編集する際は、以下の手順を必ず実行してください：

1. **既存のfrontmatterを確認**
   - ファイルの先頭に`---`で囲まれたYAML frontmatterがあるか確認
   - 既存の`updated_at`フィールドの有無を確認

2. **frontmatterの更新**
   - `updated_at`フィールドが存在する場合：現在の日付（`YYYY-MM-DD`形式）に更新
   - `updated_at`フィールドが存在しない場合：新規に追加
   - 日付形式は必ず`YYYY-MM-DD`（例：`2026-01-18`）

3. **frontmatterの構造を維持**
   - 既存のfrontmatterの構造と順序を可能な限り維持
   - 他のフィールド（`tags`, `created`, `status`など）は変更しない
   - YAMLのインデントとフォーマットを保持

## 日付の取得方法

- 現在の日付を`datetime.now().strftime('%Y-%m-%d')`で取得
- タイムゾーンはシステムのデフォルトを使用

## 例

### 更新前
```yaml
---
tags:
  - kubernetes
  - k8s
created: 2026-01-18
status: active
---
```

### 更新後
```yaml
---
tags:
  - kubernetes
  - k8s
created: 2026-01-18
updated_at: 2026-01-19
status: active
---
```

## 注意事項

- `created`フィールドは変更しない（作成日は不変）
- frontmatterが存在しないファイルには、frontmatter全体を追加する必要がある場合は、このスキルでは対応しない（別のスキルまたは手動で対応）
- ファイルの内容が変更されていない場合でも、ユーザーが明示的に更新を要求した場合は`updated_at`を更新する

## 実装時のコード例

Pythonを使用する場合の参考実装：

```python
from datetime import datetime
import re

def update_frontmatter_date(content: str) -> str:
    """frontmatterのupdated_atを更新"""
    pattern = r'^---\s*\n(.*?)\n---\s*\n'
    match = re.match(pattern, content, re.DOTALL)
    
    if not match:
        return content  # frontmatterがない場合はそのまま
    
    frontmatter = match.group(1)
    body = content[match.end():]
    
    # updated_atを更新または追加
    current_date = datetime.now().strftime('%Y-%m-%d')
    
    if 'updated_at:' in frontmatter:
        # 既存のupdated_atを更新
        frontmatter = re.sub(
            r'updated_at:\s*[\d-]+',
            f'updated_at: {current_date}',
            frontmatter
        )
    else:
        # updated_atを追加（createdの後、または最後に）
        if 'created:' in frontmatter:
            frontmatter = re.sub(
                r'(created:\s*[\d-]+)',
                f'\\1\nupdated_at: {current_date}',
                frontmatter
            )
        else:
            frontmatter += f'\nupdated_at: {current_date}'
    
    return f'---\n{frontmatter}\n---\n{body}'
```
