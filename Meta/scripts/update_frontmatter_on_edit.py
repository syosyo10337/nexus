#!/usr/bin/env python3
"""
Markdownファイルを編集した際に、frontmatterのupdated_atを自動更新するスクリプト

このスクリプトは、Gitのpre-commitフックやファイル監視ツールと組み合わせて使用します。

Usage:
    # 単一ファイルを更新
    python update_frontmatter_on_edit.py path/to/file.md
    
    # 複数ファイルを更新
    python update_frontmatter_on_edit.py file1.md file2.md
    
    # ディレクトリ内の全mdファイルを更新（dry-run）
    python update_frontmatter_on_edit.py --directory Tech/ --dry-run
"""

import sys
import re
from pathlib import Path
from datetime import datetime
from typing import Optional, Dict, Tuple

# フロントマターのパターン
FRONTMATTER_PATTERN = re.compile(r'^---\s*\n(.*?)\n---\s*\n', re.DOTALL)


def parse_frontmatter(content: str) -> Tuple[Optional[Dict], str]:
    """
    frontmatterを解析（簡易版、YAMLライブラリ不使用）
    
    Returns:
        (frontmatter_dict, body)
    """
    match = FRONTMATTER_PATTERN.match(content)
    if not match:
        return None, content
    
    frontmatter_text = match.group(1)
    body = content[match.end():]
    
    # 簡易的なYAMLパース（完全ではないが、基本的なケースに対応）
    fm_dict = {}
    for line in frontmatter_text.split('\n'):
        line = line.strip()
        if not line or line.startswith('#'):
            continue
        
        if ':' in line:
            key, value = line.split(':', 1)
            key = key.strip()
            value = value.strip()
            
            # リストの処理（簡易版）
            if value.startswith('['):
                # リスト形式
                items = re.findall(r'[\'"]([^\'"]*)[\'"]', value)
                fm_dict[key] = items if items else []
            elif value.startswith('-'):
                # YAMLリスト形式（次の行から続く）
                continue
            else:
                # 文字列値
                value = value.strip('"\'')
                fm_dict[key] = value
    
    return fm_dict, body


def update_frontmatter_date(content: str) -> str:
    """
    frontmatterのupdated_atを現在の日付に更新
    
    Args:
        content: Markdownファイルの内容
        
    Returns:
        更新されたMarkdownファイルの内容
    """
    match = FRONTMATTER_PATTERN.match(content)
    if not match:
        return content  # frontmatterがない場合はそのまま
    
    frontmatter_text = match.group(1)
    body = content[match.end():]
    
    # 現在の日付を取得
    current_date = datetime.now().strftime('%Y-%m-%d')
    
    # updated_atを更新または追加
    if re.search(r'^updated_at:\s*', frontmatter_text, re.MULTILINE):
        # 既存のupdated_atを更新
        frontmatter_text = re.sub(
            r'^updated_at:\s*[\d-]+',
            f'updated_at: {current_date}',
            frontmatter_text,
            flags=re.MULTILINE
        )
    else:
        # updated_atを追加（createdの後、または最後に）
        if re.search(r'^created:\s*', frontmatter_text, re.MULTILINE):
            # createdの後に追加
            frontmatter_text = re.sub(
                r'^(created:\s*[\d-]+)',
                f'\\1\nupdated_at: {current_date}',
                frontmatter_text,
                flags=re.MULTILINE
            )
        else:
            # 最後に追加
            frontmatter_text = frontmatter_text.rstrip() + f'\nupdated_at: {current_date}'
    
    return f'---\n{frontmatter_text}\n---\n{body}'


def process_file(file_path: Path, dry_run: bool = False) -> bool:
    """
    単一ファイルを処理
    
    Returns:
        更新が行われたかどうか
    """
    try:
        content = file_path.read_text(encoding='utf-8')
    except Exception as e:
        print(f"Error reading {file_path}: {e}", file=sys.stderr)
        return False
    
    # frontmatterがない場合はスキップ
    if not FRONTMATTER_PATTERN.match(content):
        if not dry_run:
            print(f"Skipping {file_path}: No frontmatter found")
        return False
    
    updated_content = update_frontmatter_date(content)
    
    if content == updated_content:
        return False  # 変更なし
    
    if dry_run:
        print(f"Would update: {file_path}")
        return True
    
    try:
        file_path.write_text(updated_content, encoding='utf-8')
        print(f"Updated: {file_path}")
        return True
    except Exception as e:
        print(f"Error writing {file_path}: {e}", file=sys.stderr)
        return False


def main():
    """メイン処理"""
    import argparse
    
    parser = argparse.ArgumentParser(
        description='Update updated_at field in Markdown frontmatter'
    )
    parser.add_argument(
        'files',
        nargs='*',
        help='Markdown files to update'
    )
    parser.add_argument(
        '--directory',
        '-d',
        help='Process all .md files in directory'
    )
    parser.add_argument(
        '--dry-run',
        action='store_true',
        help='Show what would be updated without making changes'
    )
    
    args = parser.parse_args()
    
    files_to_process = []
    
    if args.directory:
        # ディレクトリ内の全mdファイルを取得
        dir_path = Path(args.directory)
        if not dir_path.exists():
            print(f"Error: Directory not found: {args.directory}", file=sys.stderr)
            sys.exit(1)
        files_to_process = list(dir_path.rglob('*.md'))
    elif args.files:
        # 指定されたファイル
        files_to_process = [Path(f) for f in args.files]
    else:
        parser.print_help()
        sys.exit(1)
    
    updated_count = 0
    for file_path in files_to_process:
        if process_file(file_path, dry_run=args.dry_run):
            updated_count += 1
    
    if args.dry_run:
        print(f"\nWould update {updated_count} file(s)")
    else:
        print(f"\nUpdated {updated_count} file(s)")


if __name__ == '__main__':
    main()
