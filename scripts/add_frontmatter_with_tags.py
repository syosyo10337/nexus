#!/usr/bin/env python3
"""
TypeScript/GCP/Git ディレクトリに特化したフロントマター追加スクリプト
コンテンツに基づいて適切なタグを自動付与
"""

import os
import re
from pathlib import Path
from datetime import datetime
from typing import Optional, Dict, List, Any

# フロントマターのパターン
FRONTMATTER_PATTERN = re.compile(r'^---\s*\n(.*?)\n---\s*\n', re.DOTALL)

# TypeScriptのサブタグ判定キーワード
TS_TAG_KEYWORDS = {
    'type-system': [
        'type guard', '型ガード', 'assertion', 'アサーション', 'union', 'intersection',
        'generic', 'ジェネリクス', 'utility type', 'mapped type', 'conditional type',
        'never', 'unknown', 'discriminated', 'nominal', '公称型', 'type alias', '型エイリアス',
        'interface', 'インターフェース'
    ],
    'syntax': [
        '演算子', 'operator', '??', '&&', '||', 'optional chain', '?.', 
        'nullish', 'switch', 'loop', 'ループ', '分割代入', 'destructuring',
        '即時実行', 'IIFE', 'spread', 'rest param', '残余引数'
    ],
    'function': [
        'function', '関数', 'callback', 'arrow', 'overload', 'parameter',
        '引数', '戻り値', 'void', 'return'
    ],
    'class': [
        'class', 'クラス', 'static', 'constructor', 'extends', 'implements',
        'access modifier', 'private', 'public', 'protected'
    ],
    'async': [
        'async', 'await', 'promise', '非同期', 'asynchronous'
    ],
    'tooling': [
        'eslint', 'tsconfig', 'webpack', 'config', '設定', '環境構築', 'lint'
    ],
    'data-structure': [
        'array', '配列', 'object', 'オブジェクト', 'map', 'set', 'tuple', 'タプル',
        'enum', 'データ型'
    ]
}

# GCPのサブタグ判定キーワード
GCP_TAG_KEYWORDS = {
    'iam': ['iam', '権限', 'role', 'policy', 'service account', 'workload identity'],
    'cloud-run': ['cloud run', 'cloud function', 'serverless'],
    'gcs': ['gcs', 'cloud storage', 'bucket', 'storage'],
    'firebase': ['firebase', 'firestore', 'fcm', 'crashlytics'],
    'vertex-ai': ['vertex', 'ai', 'ml', 'machine learning'],
    'secrets': ['secret', 'credential', '認証情報'],
    'networking': ['vpc', 'dns', 'load balancer', 'route']
}

# Gitのサブタグ判定キーワード
GIT_TAG_KEYWORDS = {
    'branch': ['branch', 'ブランチ', 'checkout', 'merge', 'rebase'],
    'commit': ['commit', 'コミット', 'revert', 'reset', 'cherry-pick', 'amend'],
    'remote': ['remote', 'push', 'pull', 'fetch', 'clone', 'origin'],
    'github': ['github', 'pull request', 'pr', 'fork', 'issue'],
    'config': ['config', '設定', 'gitignore', 'ssh', 'credential'],
    'history': ['log', 'diff', 'status', 'blame', 'reflog', 'tag']
}

def get_file_created_date(file_path: Path) -> str:
    """ファイルの作成日時を取得"""
    try:
        stat = file_path.stat()
        if hasattr(stat, 'st_birthtime'):
            created = datetime.fromtimestamp(stat.st_birthtime)
        else:
            created = datetime.fromtimestamp(stat.st_mtime)
        return created.strftime('%Y-%m-%d')
    except Exception:
        return datetime.now().strftime('%Y-%m-%d')

def infer_tags(content: str, filename: str, folder: str) -> List[str]:
    """コンテンツとファイル名からタグを推測"""
    tags = []
    search_text = (content + ' ' + filename).lower()
    
    if folder == 'TypeScript':
        tags.append('typescript')
        for tag, keywords in TS_TAG_KEYWORDS.items():
            for kw in keywords:
                if kw.lower() in search_text:
                    if tag not in tags:
                        tags.append(tag)
                    break
    
    elif folder == 'GCP':
        tags.append('gcp')
        for tag, keywords in GCP_TAG_KEYWORDS.items():
            for kw in keywords:
                if kw.lower() in search_text:
                    if tag not in tags:
                        tags.append(tag)
                    break
    
    elif folder == 'Git':
        tags.append('git')
        for tag, keywords in GIT_TAG_KEYWORDS.items():
            for kw in keywords:
                if kw.lower() in search_text:
                    if tag not in tags:
                        tags.append(tag)
                    break
    
    # サブタグが見つからない場合、基本タグのみ
    return tags[:4]  # 最大4タグ

def infer_status(content: str, filename: str) -> str:
    """statusを推測"""
    filename_lower = filename.lower()
    if '(draft)' in filename_lower or '(wip)' in filename_lower or '途中' in filename:
        return 'draft'
    
    clean_content = re.sub(r'\s+', '', content)
    if len(clean_content) < 300:
        return 'draft'
    
    return 'active'

def parse_existing_frontmatter(content: str) -> tuple[Optional[Dict], str]:
    """既存のフロントマターを解析"""
    match = FRONTMATTER_PATTERN.match(content)
    if match:
        try:
            fm_text = match.group(1)
            fm_dict = {}
            current_key = None
            current_list = None
            
            for line in fm_text.split('\n'):
                line = line.rstrip()
                if line.startswith('  - ') and current_key:
                    if current_list is None:
                        current_list = []
                    current_list.append(line.strip()[2:].strip())
                    fm_dict[current_key] = current_list
                    continue
                
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

def create_frontmatter(tags: List[str], created: str, status: str) -> str:
    """フロントマターを作成"""
    lines = ['---']
    
    if tags:
        lines.append('tags:')
        for tag in tags:
            lines.append(f'  - {tag}')
    else:
        lines.append('tags: []')
    
    lines.append(f'created: {created}')
    lines.append(f'status: {status}')
    lines.append('---')
    
    return '\n'.join(lines)

def process_file(file_path: Path, folder: str, dry_run: bool = True) -> Dict[str, Any]:
    """単一ファイルを処理"""
    result = {
        'path': file_path,
        'action': None,
        'tags': [],
        'status': None
    }
    
    try:
        content = file_path.read_text(encoding='utf-8')
    except UnicodeDecodeError:
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
    
    # タグとステータスを推測
    tags = infer_tags(body, file_path.name, folder)
    created = get_file_created_date(file_path)
    status = infer_status(body, file_path.name)
    
    result['tags'] = tags
    result['status'] = status
    
    if existing_fm is not None:
        # 既存のフロントマターがある
        has_all = all(f in existing_fm for f in ['tags', 'created', 'status'])
        if has_all and existing_fm.get('tags'):
            result['action'] = 'skip'
            return result
        result['action'] = 'update'
    else:
        result['action'] = 'add'
    
    # 新しいフロントマターを作成
    new_frontmatter = create_frontmatter(tags, created, status)
    new_content = new_frontmatter + '\n\n' + body.lstrip()
    
    if not dry_run:
        file_path.write_text(new_content, encoding='utf-8')
    
    return result

def process_directories(vault_path: Path, directories: List[str], dry_run: bool = True):
    """指定ディレクトリを処理"""
    vault_path = Path(vault_path)
    
    print(f"\n{'=' * 60}")
    print("フロントマター追加スクリプト（タグ付き）")
    print(f"対象ディレクトリ: {', '.join(directories)}")
    print(f"モード: {'DRY RUN (確認のみ)' if dry_run else '実行'}")
    print(f"{'=' * 60}\n")
    
    results = {
        'add': [],
        'update': [],
        'skip': [],
        'error': []
    }
    
    for directory in directories:
        dir_path = vault_path / directory
        if not dir_path.exists():
            print(f"警告: {directory} が見つかりません")
            continue
        
        print(f"\n--- {directory}/ ---")
        
        md_files = [f for f in dir_path.glob('*.md') if f.is_file()]
        print(f"ファイル数: {len(md_files)}")
        
        for md_file in sorted(md_files):
            result = process_file(md_file, directory, dry_run=dry_run)
            results[result['action']].append(result)
            
            if result['action'] in ('add', 'update'):
                tags_str = ', '.join(result['tags'])
                action_mark = '+' if result['action'] == 'add' else '~'
                print(f"  {action_mark} {md_file.name}")
                print(f"    tags: [{tags_str}], status: {result['status']}")
    
    # サマリー
    print(f"\n{'=' * 60}")
    print("結果サマリー:")
    print(f"  新規追加: {len(results['add'])} ファイル")
    print(f"  更新: {len(results['update'])} ファイル")
    print(f"  スキップ: {len(results['skip'])} ファイル")
    print(f"  エラー: {len(results['error'])} ファイル")
    print(f"{'=' * 60}")
    
    return results

def main():
    import argparse
    
    parser = argparse.ArgumentParser(description='タグ付きフロントマターを追加')
    parser.add_argument('--dry-run', action='store_true', default=True,
                        help='変更を実行せず確認のみ（デフォルト）')
    parser.add_argument('--execute', action='store_true',
                        help='実際に変更を実行')
    parser.add_argument('--vault', type=str, default='/Users/masanao/Obsidian/nexus',
                        help='Vaultのパス')
    parser.add_argument('--dirs', type=str, nargs='+', default=['TypeScript', 'GCP', 'Git'],
                        help='処理するディレクトリ')
    
    args = parser.parse_args()
    
    dry_run = not args.execute
    
    process_directories(Path(args.vault), args.dirs, dry_run=dry_run)
    
    if dry_run:
        print("\nこれは DRY RUN です。実行するには --execute を指定:")
        print(f"  python add_frontmatter_with_tags.py --execute")

if __name__ == '__main__':
    main()

