#!/usr/bin/env python3
"""
UUID付きファイル名をクリーンな名前にリネームするスクリプト

対象:
- `Amazon SNS 13b38cdd027d801689b8f6d2a9f47b8f.md` → `Amazon SNS.md`
- `(draft)ファイル名 UUID.md` → `ファイル名.md` (statusはfrontmatterへ)

Usage:
    python rename_uuid_files.py --dry-run  # 確認のみ
    python rename_uuid_files.py            # 実行
"""

import os
import re
import sys
from pathlib import Path
from typing import Tuple, Optional
from datetime import datetime

# UUID pattern: 32文字の16進数
UUID_PATTERN = re.compile(r'\s+[0-9a-f]{32}(?=\.md$)', re.IGNORECASE)

# プレフィックスパターン: (draft), (Draft), (deprecated), (tips), (WIP) など
PREFIX_PATTERN = re.compile(r'^\((draft|Draft|deprecated|tips|WIP|途中)\)\s*', re.IGNORECASE)

# (1), (2) などの重複インジケータ
DUPLICATE_PATTERN = re.compile(r'\s+\((\d+)\)(?=\.md$)')

def extract_status_from_prefix(filename: str) -> Tuple[str, Optional[str]]:
    """
    ファイル名からプレフィックスを抽出し、対応するstatusを返す
    
    Returns:
        (cleaned_filename, status)
    """
    match = PREFIX_PATTERN.match(filename)
    if match:
        prefix = match.group(1).lower()
        status_map = {
            'draft': 'draft',
            'deprecated': 'archived',
            'tips': 'active',
            'wip': 'draft',
            '途中': 'draft',
        }
        status = status_map.get(prefix, 'draft')
        cleaned = PREFIX_PATTERN.sub('', filename)
        return cleaned, status
    return filename, None

def clean_filename(filename: str) -> Tuple[str, dict]:
    """
    ファイル名をクリーンにし、抽出したメタデータを返す
    
    Returns:
        (new_filename, metadata_dict)
    """
    metadata = {}
    new_name = filename
    
    # 1. プレフィックスを処理
    new_name, status = extract_status_from_prefix(new_name)
    if status:
        metadata['status'] = status
    
    # 2. UUIDを削除
    new_name = UUID_PATTERN.sub('', new_name)
    
    # 3. 重複インジケータを記録（後で手動対応が必要）
    dup_match = DUPLICATE_PATTERN.search(new_name)
    if dup_match:
        metadata['duplicate_number'] = dup_match.group(1)
        # 重複ファイルはリネームしない（手動対応）
        return filename, metadata
    
    return new_name, metadata

def update_obsidian_links(vault_path: Path, old_name: str, new_name: str, dry_run: bool = True):
    """
    Vault内の全mdファイルで、旧ファイル名へのリンクを新ファイル名に更新
    """
    old_link_name = old_name.replace('.md', '')
    new_link_name = new_name.replace('.md', '')
    
    # リンクパターン: [[old_name]] または [[old_name|alias]]
    link_pattern = re.compile(
        r'\[\[' + re.escape(old_link_name) + r'(\|[^\]]+)?\]\]'
    )
    
    updated_files = []
    
    for md_file in vault_path.rglob('*.md'):
        try:
            content = md_file.read_text(encoding='utf-8')
            if link_pattern.search(content):
                new_content = link_pattern.sub(
                    f'[[{new_link_name}\\1]]',
                    content
                )
                if not dry_run:
                    md_file.write_text(new_content, encoding='utf-8')
                updated_files.append(str(md_file.relative_to(vault_path)))
        except Exception as e:
            print(f"  警告: {md_file} の処理中にエラー: {e}")
    
    return updated_files

def rename_files(vault_path: Path, dry_run: bool = True):
    """
    Vault内のUUID付きファイルをリネーム
    """
    vault_path = Path(vault_path)
    changes = []
    skipped = []
    
    print(f"\n{'=' * 60}")
    print(f"Obsidian Vault ファイルリネームスクリプト")
    print(f"対象: {vault_path}")
    print(f"モード: {'DRY RUN (確認のみ)' if dry_run else '実行'}")
    print(f"{'=' * 60}\n")
    
    # 全.mdファイルを取得
    md_files = list(vault_path.rglob('*.md'))
    print(f"発見したmdファイル数: {len(md_files)}")
    
    for md_file in sorted(md_files):
        old_name = md_file.name
        new_name, metadata = clean_filename(old_name)
        
        if old_name != new_name:
            new_path = md_file.parent / new_name
            
            # 同名ファイルが既に存在するかチェック
            if new_path.exists() and new_path != md_file:
                skipped.append({
                    'old': str(md_file.relative_to(vault_path)),
                    'new': str(new_path.relative_to(vault_path)),
                    'reason': '同名ファイルが既に存在'
                })
                continue
            
            changes.append({
                'old_path': md_file,
                'new_path': new_path,
                'old_name': old_name,
                'new_name': new_name,
                'metadata': metadata
            })
    
    # 変更内容を表示
    print(f"\n変更対象: {len(changes)} ファイル")
    print(f"スキップ: {len(skipped)} ファイル\n")
    
    if changes:
        print("--- 変更予定 ---")
        for i, change in enumerate(changes[:50], 1):  # 最初の50件のみ表示
            rel_old = change['old_path'].relative_to(vault_path)
            print(f"{i:3}. {rel_old.parent}/")
            print(f"     - {change['old_name']}")
            print(f"     + {change['new_name']}")
            if change['metadata']:
                print(f"       metadata: {change['metadata']}")
        
        if len(changes) > 50:
            print(f"     ... 他 {len(changes) - 50} ファイル")
    
    if skipped:
        print("\n--- スキップ ---")
        for item in skipped[:10]:
            print(f"  {item['old']} → {item['new']}")
            print(f"    理由: {item['reason']}")
        if len(skipped) > 10:
            print(f"  ... 他 {len(skipped) - 10} ファイル")
    
    if not dry_run and changes:
        print("\n--- 実行中 ---")
        success_count = 0
        for change in changes:
            try:
                # リンクを更新
                updated_links = update_obsidian_links(
                    vault_path,
                    change['old_name'],
                    change['new_name'],
                    dry_run=False
                )
                
                # ファイルをリネーム
                change['old_path'].rename(change['new_path'])
                success_count += 1
                
                if updated_links:
                    print(f"  リネーム: {change['old_name']} → {change['new_name']}")
                    print(f"    リンク更新: {len(updated_links)} ファイル")
            except Exception as e:
                print(f"  エラー: {change['old_name']}: {e}")
        
        print(f"\n完了: {success_count}/{len(changes)} ファイルをリネーム")
    
    return changes, skipped

def main():
    import argparse
    
    parser = argparse.ArgumentParser(description='UUID付きファイル名をクリーンにリネーム')
    parser.add_argument('--dry-run', action='store_true', default=True,
                        help='変更を実行せず確認のみ（デフォルト）')
    parser.add_argument('--execute', action='store_true',
                        help='実際にリネームを実行')
    parser.add_argument('--vault', type=str, default='/Users/masanao/Obsidian/nexus',
                        help='Vaultのパス')
    
    args = parser.parse_args()
    
    dry_run = not args.execute
    
    changes, skipped = rename_files(Path(args.vault), dry_run=dry_run)
    
    if dry_run:
        print("\n" + "=" * 60)
        print("これは DRY RUN です。実際にリネームするには --execute を指定してください:")
        print(f"  python {sys.argv[0]} --execute")
        print("=" * 60)

if __name__ == '__main__':
    main()

