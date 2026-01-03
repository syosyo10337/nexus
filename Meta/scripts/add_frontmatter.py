#!/usr/bin/env python3
"""
全mdファイルにフロントマターを追加するスクリプト

追加するフロントマター:
---
tags: []
created: YYYY-MM-DD (ファイルの作成日時から取得)
status: draft | active | archived
---

Usage:
    python add_frontmatter.py --dry-run  # 確認のみ
    python add_frontmatter.py --execute  # 実行
"""

import os
import re
from pathlib import Path
from datetime import datetime
from typing import Optional, Dict, Any

# フロントマターのパターン
FRONTMATTER_PATTERN = re.compile(r'^---\s*\n(.*?)\n---\s*\n', re.DOTALL)

# Templateフォルダは除外
EXCLUDE_FOLDERS = {'Templates', 'scripts', '.obsidian', '.git'}

def get_file_created_date(file_path: Path) -> str:
    """
    ファイルの作成日時を取得（macOS: birthtime, その他: mtime）
    """
    try:
        stat = file_path.stat()
        # macOSではst_birthtimeが利用可能
        if hasattr(stat, 'st_birthtime'):
            created = datetime.fromtimestamp(stat.st_birthtime)
        else:
            created = datetime.fromtimestamp(stat.st_mtime)
        return created.strftime('%Y-%m-%d')
    except Exception:
        return datetime.now().strftime('%Y-%m-%d')

def parse_existing_frontmatter(content: str) -> tuple[Optional[Dict], str]:
    """
    既存のフロントマターを解析（YAMLライブラリ不使用）
    
    Returns:
        (frontmatter_dict, content_without_frontmatter)
    """
    match = FRONTMATTER_PATTERN.match(content)
    if match:
        try:
            fm_text = match.group(1)
            fm_dict = {}
            
            current_key = None
            current_list = None
            
            for line in fm_text.split('\n'):
                line = line.rstrip()
                
                # インデントされた行（リストアイテム）
                if line.startswith('  - ') and current_key:
                    if current_list is None:
                        current_list = []
                    current_list.append(line.strip()[2:].strip())
                    fm_dict[current_key] = current_list
                    continue
                
                # キー: 値 のパターン
                if ':' in line:
                    if current_list is not None:
                        current_list = None
                    
                    key, _, value = line.partition(':')
                    key = key.strip()
                    value = value.strip()
                    current_key = key
                    
                    if value == '[]':
                        fm_dict[key] = []
                    elif value == '':
                        fm_dict[key] = None
                    else:
                        fm_dict[key] = value
            
            remaining_content = content[match.end():]
            return fm_dict, remaining_content
        except Exception:
            return None, content
    return None, content

def infer_status_from_content(content: str, filename: str) -> str:
    """
    コンテンツやファイル名からstatusを推測
    """
    filename_lower = filename.lower()
    
    # ファイル名からの推測
    if '(draft)' in filename_lower or '(wip)' in filename_lower or '途中' in filename:
        return 'draft'
    if '(deprecated)' in filename_lower:
        return 'archived'
    
    # コンテンツの充実度から推測
    # 短いファイル（500文字未満）はdraft
    clean_content = re.sub(r'\s+', '', content)
    if len(clean_content) < 500:
        return 'draft'
    
    return 'active'

def infer_tags_from_path(file_path: Path, vault_path: Path) -> list:
    """
    ファイルパスからタグを推測
    """
    try:
        rel_path = file_path.relative_to(vault_path)
        parts = rel_path.parts[:-1]  # ファイル名を除く
        
        # 除外フォルダを除いたパスをタグに
        tags = []
        for part in parts:
            if part not in EXCLUDE_FOLDERS and part != 'Attachments':
                # スペースをハイフンに、特殊文字を除去
                tag = re.sub(r'[^\w\-]', '', part.replace(' ', '-'))
                if tag:
                    tags.append(tag.lower())
        
        return tags[:2]  # 最大2つまで
    except Exception:
        return []

def create_frontmatter(
    existing_fm: Optional[Dict],
    file_path: Path,
    vault_path: Path,
    content: str
) -> str:
    """
    フロントマターを作成
    """
    fm = existing_fm.copy() if existing_fm else {}
    
    # 必須フィールドを追加（存在しない場合のみ）
    if 'tags' not in fm:
        fm['tags'] = infer_tags_from_path(file_path, vault_path)
    
    if 'created' not in fm:
        fm['created'] = get_file_created_date(file_path)
    
    if 'status' not in fm:
        fm['status'] = infer_status_from_content(content, file_path.name)
    
    # YAMLとして出力
    # tagsが空リストの場合の表現を調整
    lines = ['---']
    
    # tagsの処理
    if fm.get('tags'):
        lines.append('tags:')
        for tag in fm['tags']:
            lines.append(f'  - {tag}')
    else:
        lines.append('tags: []')
    
    # createdの処理
    lines.append(f"created: {fm.get('created', datetime.now().strftime('%Y-%m-%d'))}")
    
    # statusの処理
    lines.append(f"status: {fm.get('status', 'draft')}")
    
    # その他の既存フィールドを保持
    for key, value in fm.items():
        if key not in ('tags', 'created', 'status'):
            if isinstance(value, list):
                lines.append(f'{key}:')
                for item in value:
                    lines.append(f'  - {item}')
            elif value is None:
                lines.append(f'{key}:')
            else:
                lines.append(f'{key}: {value}')
    
    lines.append('---')
    
    return '\n'.join(lines)

def process_file(file_path: Path, vault_path: Path, dry_run: bool = True) -> Dict[str, Any]:
    """
    単一ファイルを処理
    
    Returns:
        処理結果の辞書
    """
    result = {
        'path': file_path,
        'action': None,
        'changes': []
    }
    
    try:
        content = file_path.read_text(encoding='utf-8')
    except UnicodeDecodeError:
        # UTF-8で読めない場合、他のエンコーディングを試す
        try:
            content = file_path.read_text(encoding='shift_jis')
        except Exception:
            try:
                content = file_path.read_text(encoding='latin-1')
            except Exception as e:
                result['action'] = 'error'
                result['error'] = str(e)
                return result
    except Exception as e:
        result['action'] = 'error'
        result['error'] = str(e)
        return result
    
    existing_fm, body = parse_existing_frontmatter(content)
    
    if existing_fm is not None:
        # 既存のフロントマターがある場合、不足フィールドを追加
        has_all_fields = all(
            field in existing_fm 
            for field in ['tags', 'created', 'status']
        )
        
        if has_all_fields:
            result['action'] = 'skip'
            return result
        
        result['action'] = 'update'
        result['changes'] = [
            f for f in ['tags', 'created', 'status'] 
            if f not in existing_fm
        ]
    else:
        result['action'] = 'add'
        result['changes'] = ['tags', 'created', 'status']
    
    # 新しいフロントマターを作成
    new_frontmatter = create_frontmatter(existing_fm, file_path, vault_path, body)
    new_content = new_frontmatter + '\n\n' + body.lstrip()
    
    if not dry_run:
        file_path.write_text(new_content, encoding='utf-8')
    
    return result

def add_frontmatter_to_vault(vault_path: Path, dry_run: bool = True):
    """
    Vault内の全mdファイルにフロントマターを追加
    """
    vault_path = Path(vault_path)
    
    print(f"\n{'=' * 60}")
    print("フロントマター一括追加スクリプト")
    print(f"対象: {vault_path}")
    print(f"モード: {'DRY RUN (確認のみ)' if dry_run else '実行'}")
    print(f"{'=' * 60}\n")
    
    # 処理対象のファイルを収集
    md_files = []
    for md_file in vault_path.rglob('*.md'):
        # 除外フォルダをチェック
        rel_path = md_file.relative_to(vault_path)
        if any(part in EXCLUDE_FOLDERS for part in rel_path.parts):
            continue
        md_files.append(md_file)
    
    print(f"処理対象ファイル数: {len(md_files)}")
    
    results = {
        'add': [],
        'update': [],
        'skip': [],
        'error': []
    }
    
    for md_file in sorted(md_files):
        result = process_file(md_file, vault_path, dry_run=dry_run)
        results[result['action']].append(result)
    
    # 結果を表示
    print(f"\n--- 結果サマリー ---")
    print(f"  新規追加: {len(results['add'])} ファイル")
    print(f"  更新: {len(results['update'])} ファイル")
    print(f"  スキップ (変更不要): {len(results['skip'])} ファイル")
    print(f"  エラー: {len(results['error'])} ファイル")
    
    if results['add']:
        print(f"\n--- 新規追加予定 (最初の20件) ---")
        for r in results['add'][:20]:
            rel_path = r['path'].relative_to(vault_path)
            print(f"  {rel_path}")
        if len(results['add']) > 20:
            print(f"  ... 他 {len(results['add']) - 20} ファイル")
    
    if results['update']:
        print(f"\n--- 更新予定 (最初の20件) ---")
        for r in results['update'][:20]:
            rel_path = r['path'].relative_to(vault_path)
            print(f"  {rel_path}: +{', '.join(r['changes'])}")
        if len(results['update']) > 20:
            print(f"  ... 他 {len(results['update']) - 20} ファイル")
    
    if results['error']:
        print(f"\n--- エラー ---")
        for r in results['error']:
            rel_path = r['path'].relative_to(vault_path)
            print(f"  {rel_path}: {r.get('error', 'Unknown error')}")
    
    return results

def main():
    import argparse
    
    parser = argparse.ArgumentParser(description='全mdファイルにフロントマターを追加')
    parser.add_argument('--dry-run', action='store_true', default=True,
                        help='変更を実行せず確認のみ（デフォルト）')
    parser.add_argument('--execute', action='store_true',
                        help='実際に変更を実行')
    parser.add_argument('--vault', type=str, default='/Users/masanao/Obsidian/nexus',
                        help='Vaultのパス')
    
    args = parser.parse_args()
    
    dry_run = not args.execute
    
    add_frontmatter_to_vault(Path(args.vault), dry_run=dry_run)
    
    if dry_run:
        print("\n" + "=" * 60)
        print("これは DRY RUN です。実際に実行するには --execute を指定:")
        print(f"  python add_frontmatter.py --execute")
        print("=" * 60)

if __name__ == '__main__':
    main()

