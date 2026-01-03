#!/usr/bin/env python3
"""
全ディレクトリに対応したフロントマター追加スクリプト
コンテンツに基づいて適切なタグを自動付与
"""

import os
import re
from pathlib import Path
from datetime import datetime
from typing import Optional, Dict, List, Any

FRONTMATTER_PATTERN = re.compile(r'^---\s*\n(.*?)\n---\s*\n', re.DOTALL)

# 各ディレクトリのタグ定義
TAG_DEFINITIONS = {
    'AWS': {
        'base': 'aws',
        'keywords': {
            'ec2': ['ec2', 'instance', 'ami'],
            'vpc': ['vpc', 'subnet', 'security group', 'セキュリティグループ'],
            's3': ['s3', 'bucket', 'storage'],
            'lambda': ['lambda', 'serverless', 'function'],
            'rds': ['rds', 'database', 'mysql', 'postgres'],
            'networking': ['route', 'nat', 'gateway', 'load balancer', 'elb', 'alb'],
            'sns-sqs': ['sns', 'sqs', 'queue', 'notification'],
            'iam': ['iam', 'role', 'policy', 'credential'],
        }
    },
    'React': {
        'base': 'react',
        'keywords': {
            'hooks': ['usestate', 'useeffect', 'usememo', 'usecallback', 'useref', 'usecontext', 'usereducer', 'hook'],
            'component': ['component', 'コンポーネント', 'props', 'children', 'render'],
            'state': ['state', '状態', 'context', 'redux', 'zustand'],
            'performance': ['memo', 'performance', 'optimization', 'lazy', 'suspense'],
            'styling': ['css', 'style', 'tailwind', 'styled'],
            'server': ['rsc', 'server component', 'ssr', 'hydration'],
        }
    },
    'Docker': {
        'base': 'docker',
        'keywords': {
            'dockerfile': ['dockerfile', 'build', 'image', 'イメージ'],
            'compose': ['compose', 'docker-compose', 'yaml'],
            'container': ['container', 'コンテナ', 'run', 'exec'],
            'network': ['network', 'volume', 'mount'],
            'optimization': ['multi-stage', 'マルチステージ', 'alpine', 'slim', 'cache'],
        }
    },
    'Flutter': {
        'base': 'flutter',
        'keywords': {
            'dart': ['dart', 'syntax', '構文'],
            'widget': ['widget', 'stateful', 'stateless', 'build'],
            'state': ['state', 'provider', 'riverpod', 'bloc'],
            'navigation': ['navigator', 'route', '画面遷移'],
            'testing': ['test', 'patrol', 'widget test'],
            'ios': ['ios', 'xcode', 'cocoapods', 'swift'],
            'android': ['android', 'gradle', 'manifest'],
            'async': ['async', 'future', 'stream', '非同期'],
        }
    },
    'Ruby on Rails': {
        'base': 'rails',
        'keywords': {
            'activerecord': ['activerecord', 'model', 'migration', 'association', 'callback'],
            'controller': ['controller', 'action', 'params', 'render'],
            'view': ['view', 'erb', 'helper', 'partial'],
            'routing': ['route', 'resource', 'namespace'],
            'auth': ['devise', 'authentication', '認証', 'session'],
            'testing': ['rspec', 'test', 'factory', 'spec'],
            'gem': ['gem', 'bundler', 'gemfile'],
            'config': ['config', 'credential', 'environment'],
        }
    },
    'Ruby': {
        'base': 'ruby',
        'keywords': {
            'syntax': ['syntax', 'method', 'block', 'proc', 'lambda'],
            'string': ['string', '文字列', 'regex'],
            'collection': ['array', 'hash', '配列', 'enumerable'],
            'oop': ['class', 'module', 'mixin', 'inheritance'],
        }
    },
    'JavaScript': {
        'base': 'javascript',
        'keywords': {
            'syntax': ['syntax', 'operator', 'expression', '演算子'],
            'async': ['async', 'await', 'promise', 'callback', '非同期'],
            'dom': ['dom', 'event', 'element', 'document'],
            'es6': ['es6', 'arrow', 'spread', 'destructuring', 'class'],
            'data': ['array', 'object', 'json', 'map', 'set'],
        }
    },
    'Linux': {
        'base': 'linux',
        'keywords': {
            'command': ['command', 'コマンド', 'bash', 'shell', 'terminal'],
            'file': ['file', 'directory', 'permission', 'chmod', 'chown'],
            'process': ['process', 'pid', 'systemd', 'service', 'daemon'],
            'network': ['network', 'ssh', 'curl', 'port', 'firewall'],
            'package': ['apt', 'yum', 'package', 'install'],
        }
    },
    'GitHub Actions': {
        'base': 'github-actions',
        'keywords': {
            'workflow': ['workflow', 'job', 'step', 'action'],
            'ci': ['ci', 'build', 'test', 'lint'],
            'cd': ['deploy', 'release', 'publish'],
            'secrets': ['secret', 'environment', 'variable'],
        }
    },
    'Design Pattern': {
        'base': 'design-pattern',
        'keywords': {
            'creational': ['factory', 'singleton', 'builder', 'prototype'],
            'structural': ['adapter', 'decorator', 'facade', 'proxy'],
            'behavioral': ['observer', 'strategy', 'command', 'state'],
            'di': ['dependency injection', 'di', 'ioc', 'container'],
        }
    },
    'Golang': {
        'base': 'golang',
        'keywords': {
            'syntax': ['syntax', 'struct', 'interface', 'pointer'],
            'concurrency': ['goroutine', 'channel', 'concurrent', 'sync'],
            'error': ['error', 'panic', 'recover'],
            'package': ['package', 'module', 'import'],
        }
    },
    'SQL': {
        'base': 'sql',
        'keywords': {
            'query': ['select', 'query', 'join', 'where'],
            'ddl': ['create', 'alter', 'drop', 'table'],
            'dml': ['insert', 'update', 'delete'],
            'optimization': ['index', 'explain', 'performance'],
        }
    },
    'ML': {
        'base': 'machine-learning',
        'keywords': {
            'statistics': ['統計', 'statistic', '平均', '分散', 'distribution'],
            'regression': ['regression', '回帰', 'linear', 'logistic'],
            'classification': ['classification', '分類', 'decision tree'],
            'data': ['data', 'pandas', 'numpy', 'preprocessing'],
            'visualization': ['graph', 'グラフ', 'plot', 'matplotlib'],
        }
    },
    'NextJS': {
        'base': 'nextjs',
        'keywords': {
            'routing': ['route', 'page', 'layout', 'navigation'],
            'rendering': ['ssr', 'ssg', 'isr', 'server', 'client'],
            'api': ['api', 'endpoint', 'handler'],
            'optimization': ['image', 'font', 'script', 'performance'],
        }
    },
    'GraphQL': {
        'base': 'graphql',
        'keywords': {
            'query': ['query', 'mutation', 'subscription'],
            'schema': ['schema', 'type', 'resolver'],
            'client': ['apollo', 'client', 'cache'],
        }
    },
    'HTML&CSS': {
        'base': 'html-css',
        'keywords': {
            'html': ['html', 'element', 'tag', 'semantic'],
            'css': ['css', 'style', 'selector', 'property'],
            'layout': ['flexbox', 'grid', 'layout', 'responsive'],
            'animation': ['animation', 'transition', 'transform'],
        }
    },
    'Storybook': {
        'base': 'storybook',
        'keywords': {
            'story': ['story', 'component', 'addon'],
            'testing': ['test', 'interaction', 'visual'],
        }
    },
    'CS': {
        'base': 'computer-science',
        'keywords': {
            'algorithm': ['algorithm', 'アルゴリズム', 'big o', 'complexity'],
            'data-structure': ['data structure', 'array', 'tree', 'graph'],
            'oop': ['oop', 'object', 'class', 'オブジェクト指向'],
            'programming': ['programming', 'function', '関数', 'variable'],
        }
    },
    'Clean Code': {
        'base': 'clean-code',
        'keywords': {
            'refactoring': ['refactor', 'リファクタ', 'tidy', '整頓'],
            'principle': ['solid', 'dry', 'principle', '原則'],
            'practice': ['pr', 'review', 'commit'],
        }
    },
    'Import tech': {
        'base': 'misc',
        'keywords': {
            'security': ['security', 'csrf', 'xss', 'auth', '認証', 'jwt'],
            'testing': ['test', 'テスト', 'mock', 'stub'],
            'api': ['api', 'rest', 'http', 'cors'],
            'tooling': ['vim', 'editor', 'cli', 'tool'],
            'architecture': ['architecture', 'ddd', 'microservice', 'pattern'],
            'cache': ['cache', 'redis', 'session'],
            'frontend': ['react', 'css', 'html', 'javascript'],
        }
    },
    'Web': {
        'base': 'web',
        'keywords': {
            'protocol': ['http', 'https', 'protocol', 'dns'],
            'auth': ['oauth', 'auth', '認証', 'session'],
            'api': ['api', 'rest', 'graphql'],
        }
    },
    'PHP': {
        'base': 'php',
        'keywords': {
            'laravel': ['laravel', 'eloquent', 'blade'],
            'wordpress': ['wordpress', 'theme', 'plugin'],
            'syntax': ['php', 'syntax', 'function'],
        }
    },
    'Nginx': {
        'base': 'nginx',
        'keywords': {
            'config': ['config', '設定', 'server', 'location'],
            'proxy': ['proxy', 'reverse', 'upstream'],
        }
    },
    'UML': {
        'base': 'uml',
        'keywords': {
            'diagram': ['diagram', 'class', 'sequence', 'use case'],
        }
    },
    'DB': {
        'base': 'database',
        'keywords': {
            'mongodb': ['mongodb', 'mongo', 'nosql', 'document'],
            'sql': ['sql', 'mysql', 'postgres', 'relational'],
        }
    },
    'Python': {
        'base': 'python',
        'keywords': {
            'syntax': ['syntax', 'function', 'class'],
            'data': ['pandas', 'numpy', 'data'],
        }
    },
}

# Default for unlisted directories
DEFAULT_TAG_DEF = {
    'base': None,
    'keywords': {}
}

def get_file_created_date(file_path: Path) -> str:
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
    tags = []
    search_text = (content + ' ' + filename).lower()
    
    tag_def = TAG_DEFINITIONS.get(folder, DEFAULT_TAG_DEF)
    
    if tag_def['base']:
        tags.append(tag_def['base'])
    
    for tag, keywords in tag_def.get('keywords', {}).items():
        for kw in keywords:
            if kw.lower() in search_text:
                if tag not in tags:
                    tags.append(tag)
                break
    
    return tags[:4]

def infer_status(content: str, filename: str) -> str:
    filename_lower = filename.lower()
    if '(draft)' in filename_lower or '(wip)' in filename_lower or '途中' in filename:
        return 'draft'
    clean_content = re.sub(r'\s+', '', content)
    if len(clean_content) < 300:
        return 'draft'
    return 'active'

def parse_existing_frontmatter(content: str) -> tuple[Optional[Dict], str]:
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
        except:
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
    
    tags = infer_tags(body, file_path.name, folder)
    created = get_file_created_date(file_path)
    status = infer_status(body, file_path.name)
    
    result['tags'] = tags
    result['status'] = status
    
    if existing_fm is not None:
        has_all = all(f in existing_fm for f in ['tags', 'created', 'status'])
        if has_all and existing_fm.get('tags'):
            result['action'] = 'skip'
            return result
        result['action'] = 'update'
    else:
        result['action'] = 'add'
    
    new_frontmatter = create_frontmatter(tags, created, status)
    new_content = new_frontmatter + '\n\n' + body.lstrip()
    
    if not dry_run:
        file_path.write_text(new_content, encoding='utf-8')
    
    return result

def process_all_directories(vault_path: Path, dry_run: bool = True):
    vault_path = Path(vault_path)
    
    print(f"\n{'=' * 60}")
    print("全ディレクトリ フロントマター追加スクリプト")
    print(f"モード: {'DRY RUN' if dry_run else '実行'}")
    print(f"{'=' * 60}")
    
    # Skip directories
    skip_dirs = {'Templates', 'scripts', '.obsidian', '.git', 'Attachments'}
    
    # Get all top-level directories
    directories = [d.name for d in vault_path.iterdir() 
                   if d.is_dir() and d.name not in skip_dirs and not d.name.startswith('.')]
    
    # Already processed
    already_done = {'TypeScript', 'GCP', 'Git'}
    directories = [d for d in directories if d not in already_done]
    
    print(f"\n対象ディレクトリ: {len(directories)}")
    
    total_results = {
        'add': [],
        'update': [],
        'skip': [],
        'error': []
    }
    
    for directory in sorted(directories):
        dir_path = vault_path / directory
        
        # Get all .md files recursively (but skip Attachments subdirs)
        md_files = []
        for f in dir_path.rglob('*.md'):
            if 'Attachments' not in str(f) and f.is_file():
                md_files.append(f)
        
        if not md_files:
            continue
            
        print(f"\n--- {directory}/ ({len(md_files)} files) ---")
        
        for md_file in sorted(md_files):
            result = process_file(md_file, directory, dry_run=dry_run)
            total_results[result['action']].append(result)
            
            if result['action'] in ('add', 'update'):
                tags_str = ', '.join(result['tags']) if result['tags'] else '(none)'
                rel_path = md_file.relative_to(dir_path)
                print(f"  + {rel_path}: [{tags_str}]")
    
    print(f"\n{'=' * 60}")
    print("結果サマリー:")
    print(f"  新規追加: {len(total_results['add'])} ファイル")
    print(f"  更新: {len(total_results['update'])} ファイル")
    print(f"  スキップ: {len(total_results['skip'])} ファイル")
    print(f"  エラー: {len(total_results['error'])} ファイル")
    print(f"{'=' * 60}")
    
    return total_results

def main():
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument('--execute', action='store_true')
    parser.add_argument('--vault', default='/Users/masanao/Obsidian/nexus')
    args = parser.parse_args()
    
    process_all_directories(Path(args.vault), dry_run=not args.execute)
    
    if not args.execute:
        print("\n実行するには: python add_frontmatter_all.py --execute")

if __name__ == '__main__':
    main()


