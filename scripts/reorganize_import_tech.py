#!/usr/bin/env python3
"""
Import tech/ フォルダのファイルを適切なディレクトリに移動し、
フロントマターを更新するスクリプト
"""

import os
import re
import shutil
from pathlib import Path
from datetime import datetime
from typing import Dict, List, Tuple, Optional

FRONTMATTER_PATTERN = re.compile(r'^---\s*\n(.*?)\n---\s*\n', re.DOTALL)

# ファイル移動マッピング: filename -> (target_directory, tags)
FILE_MAPPING: Dict[str, Tuple[str, List[str]]] = {
    # Security → Web/Security (新規作成)
    "CSRF (Cross-Site-Request-Forgeries).md": ("Web", ["web", "security", "csrf"]),
    "XSS(Xross-Site-Scripting).md": ("Web", ["web", "security", "xss"]),
    "SQLインジェクションのケア.md": ("Web", ["web", "security", "sql-injection"]),
    "レインボーテーブル攻撃.md": ("Web", ["web", "security", "password"]),
    "DNS リバインディング.md": ("Web", ["web", "security", "dns"]),
    "reCAPTCHA 101.md": ("Web", ["web", "security", "captcha"]),
    "MFA (1) c8c9266cdc6d42f391d41f0b7d7403e1.md": ("Web", ["web", "security", "auth", "mfa"]),
    
    # Design Pattern
    "DDD.md": ("Design Pattern", ["design-pattern", "ddd", "architecture"]),
    "EDA(Event Driven Architecture).md": ("Design Pattern", ["design-pattern", "eda", "architecture"]),
    "MVVMを本気で理解する。.md": ("Design Pattern", ["design-pattern", "mvvm"]),
    "マルチテナントアーキテクチャ.md": ("Design Pattern", ["design-pattern", "multi-tenant", "architecture"]),
    "インターフェースと依存性(Depandancy Inversion).md": ("Design Pattern", ["design-pattern", "di", "solid"]),
    "ActiveRecordとRepositoryパターン.md": ("Design Pattern", ["design-pattern", "repository", "activerecord"]),
    
    # React
    "tRPC.md": ("React", ["react", "trpc", "api", "typescript"]),
    "React.md": ("React", ["react", "component"]),
    "msw.md": ("React", ["react", "testing", "mock"]),
    "Vitest.md": ("React", ["react", "testing", "vitest"]),
    "Playwright.md": ("React", ["react", "testing", "e2e", "playwright"]),
    "Refine.md": ("React", ["react", "framework"]),
    "FCP(First Contentfuil Paint)とその改善.md": ("React", ["react", "performance", "web-vitals"]),
    "フロントエンドのエラーハンドル.md": ("React", ["react", "error-handling"]),
    
    # Web
    "HTTPプロトコル.md": ("Web", ["web", "http", "protocol"]),
    "CORSとは.md": ("Web", ["web", "cors", "security"]),
    "Content Negotiation.md": ("Web", ["web", "http", "content-negotiation"]),
    "MIME.md": ("Web", ["web", "mime", "http"]),
    "JWT(JSON Web Token).md": ("Web", ["web", "jwt", "auth"]),
    "PWAって何？.md": ("Web", ["web", "pwa"]),
    "Slug.md": ("Web", ["web", "url", "slug"]),
    "プロキシとリバースプロキシ.md": ("Web", ["web", "proxy", "nginx"]),
    "ドメインとホスト名.md": ("Web", ["web", "dns", "domain"]),
    "Hosting.md": ("Web", ["web", "hosting", "deploy"]),
    "リクエストのUser-agentを判定する。.md": ("Web", ["web", "http", "user-agent"]),
    
    # DB
    "Redis.md": ("DB", ["database", "redis", "cache"]),
    "cache.md": ("DB", ["database", "cache"]),
    "N + 1 問題.md": ("DB", ["database", "n-plus-one", "performance"]),
    "foreign key constraint.md": ("DB", ["database", "sql", "foreign-key"]),
    "外部キー制約 (1) 69268f82730c489d9cb880f552574a7d.md": ("DB", ["database", "sql", "foreign-key"]),
    "facet検索って何.md": ("DB", ["database", "search", "facet"]),
    
    # Ruby on Rails
    "PumaとNginxによるwebサーバの構築.md": ("Ruby on Rails", ["rails", "puma", "nginx"]),
    "Pumaの設定について.md": ("Ruby on Rails", ["rails", "puma", "config"]),
    "Rubyを使ったcsv lineの重複削除.md": ("Ruby", ["ruby", "csv"]),
    
    # JavaScript
    "JavaScript.md": ("JavaScript", ["javascript", "syntax"]),
    "yarn.md": ("JavaScript", ["javascript", "yarn", "package-manager"]),
    "jsconfig json.md": ("JavaScript", ["javascript", "config", "vscode"]),
    "JQuery.md": ("JavaScript", ["javascript", "jquery"]),
    "Prettier.md": ("JavaScript", ["javascript", "prettier", "tooling"]),
    "plop.md": ("JavaScript", ["javascript", "plop", "code-generator"]),
    "Linterって何？.md": ("JavaScript", ["javascript", "linter", "tooling"]),
    
    # Linux
    "How to Vim.md": ("Linux", ["linux", "vim", "editor"]),
    "Makefile.md": ("Linux", ["linux", "makefile", "build"]),
    "HomeBrew.md": ("Linux", ["linux", "homebrew", "macos"]),
    "posix cron sytanx.md": ("Linux", ["linux", "cron", "scheduling"]),
    "macのsshの仕方詰まったとき.md": ("Linux", ["linux", "ssh", "macos"]),
    "プロセス.md": ("Linux", ["linux", "process"]),
    "乱数生成がLinuxの日時に依存しているかも.md": ("Linux", ["linux", "random"]),
    "httpdのdってなんのこと？ (1) 8d3315d2f0574712880f3fea709801b4.md": ("Linux", ["linux", "httpd", "daemon"]),
    "Linear on Linux.md": ("Linux", ["linux", "linear", "tools"]),
    "ngrok.md": ("Linux", ["linux", "ngrok", "tunneling"]),
    "マルチカーソルを使う.md": ("Linux", ["linux", "editor", "vscode"]),
    "Pandoc.md": ("Linux", ["linux", "pandoc", "document"]),
    
    # CS
    "正規表現(Regular Expression).md": ("CS", ["cs", "regex"]),
    "parameter と argument.md": ("CS", ["cs", "terminology"]),
    "message と method.md": ("CS", ["cs", "oop", "terminology"]),
    "メンバ変数とは.md": ("CS", ["cs", "oop", "variable"]),
    "type-hinting and type annotation.md": ("CS", ["cs", "type-system"]),
    "stack trace back traceとは (1) 3f8717d8f534489b90229596379f1359.md": ("CS", ["cs", "debugging", "stack-trace"]),
    "Exponential backoff.md": ("CS", ["cs", "algorithm", "retry"]),
    "YAML.md": ("CS", ["cs", "yaml", "data-format"]),
    "キーワード引数(名前つき引数)についての所感.md": ("CS", ["cs", "function", "argument"]),
    
    # Clean Code
    "コード設計.md": ("Clean Code", ["clean-code", "design"]),
    "変数の命名規則.md": ("Clean Code", ["clean-code", "naming"]),
    "マジックナンバー (1) 1aab3bf2b66449e89ab296b9881417af.md": ("Clean Code", ["clean-code", "anti-pattern"]),
    "テスト戦略.md": ("Clean Code", ["clean-code", "testing", "strategy"]),
    "privateな関数の振る舞いをテストするのか？.md": ("Clean Code", ["clean-code", "testing"]),
    "ブランチ運用のルールについて.md": ("Git", ["git", "branch", "workflow"]),
    "http xunitpatterns com Obscure Test html.md": ("Clean Code", ["clean-code", "testing", "pattern"]),
    
    # Storybook
    "StoryBook.md": ("Storybook", ["storybook", "component", "testing"]),
    
    # Docker/Kubernetes
    "Terraform kubernetes.md": ("Docker", ["docker", "kubernetes", "terraform"]),
    "k9s kubectl.md": ("Docker", ["docker", "kubernetes", "kubectl"]),
    "本番 Docker gitでのSSH鍵認証.md": ("Docker", ["docker", "ssh", "deploy"]),
    
    # Golang
    "goa.md": ("Golang", ["golang", "goa", "api"]),
    "zpagesパターン.md": ("Golang", ["golang", "observability"]),
    
    # Flutter/iOS
    "iOS Xcodeについて.md": ("Flutter", ["flutter", "ios", "xcode"]),
    "iOS privacy manifests.md": ("Flutter", ["flutter", "ios", "privacy"]),
    "ディープリンクを支える技術.md": ("Flutter", ["flutter", "deep-link"]),
    
    # GitHub Actions/CI
    "CircleCI.md": ("GitHub Actions", ["ci-cd", "circleci"]),
    
    # NextJS
    "Auth jsを使って認証機構を作ってみる.md": ("NextJS", ["nextjs", "auth", "authjs"]),
    "Drizzle.md": ("NextJS", ["nextjs", "drizzle", "orm"]),
    
    # ML
    "RAGって何？.md": ("ML", ["machine-learning", "rag", "llm"]),
    
    # UML
    "UML（Unified Modeling Language).md": ("UML", ["uml", "diagram"]),
    
    # AWS
    "クラウドとは (1) 9667147775504b45aaac0adf8997d162.md": ("AWS", ["aws", "cloud"]),
    "Heroku コマンド.md": ("AWS", ["cloud", "heroku", "paas"]),
    
    # HTML&CSS
    "HTML.md": ("HTML&CSS", ["html", "markup"]),
    "form要素のname属性.md": ("HTML&CSS", ["html", "form"]),
    "Ethical UI design(CX).md": ("HTML&CSS", ["html-css", "ux", "design"]),
    
    # API/Tools (残りはImport techに残すか適切な場所へ)
    "apiDocの導入.md": ("JavaScript", ["javascript", "api-doc", "documentation"]),
    "Sentryの導入.md": ("React", ["react", "sentry", "monitoring"]),
    "Slack botを作ろう.md": ("JavaScript", ["javascript", "slack", "bot"]),
    "NotionSDK.md": ("JavaScript", ["javascript", "notion", "api"]),
}

# 削除候補（空ファイルや重複）
DELETE_CANDIDATES = [
    "&nbsp;.md",  # 空/ゴミファイル
]

def get_file_created_date(file_path: Path) -> str:
    try:
        stat = file_path.stat()
        if hasattr(stat, 'st_birthtime'):
            created = datetime.fromtimestamp(stat.st_birthtime)
        else:
            created = datetime.fromtimestamp(stat.st_mtime)
        return created.strftime('%Y-%m-%d')
    except:
        return datetime.now().strftime('%Y-%m-%d')

def create_frontmatter(tags: List[str], created: str, status: str = "active") -> str:
    lines = ['---']
    lines.append('tags:')
    for tag in tags:
        lines.append(f'  - {tag}')
    lines.append(f'created: {created}')
    lines.append(f'status: {status}')
    lines.append('---')
    return '\n'.join(lines)

def remove_existing_frontmatter(content: str) -> str:
    match = FRONTMATTER_PATTERN.match(content)
    if match:
        return content[match.end():]
    return content

def process_and_move_file(source: Path, target_dir: Path, tags: List[str], vault_path: Path, dry_run: bool = True) -> dict:
    result = {
        'source': source,
        'target': target_dir / source.name,
        'action': 'move',
        'tags': tags
    }
    
    # ファイル名からUUIDを削除
    clean_name = re.sub(r'\s+[0-9a-f]{32}(?=\.md$)', '', source.name, flags=re.IGNORECASE)
    clean_name = re.sub(r'\s+\(\d+\)(?=\.md$)', '', clean_name)  # (1) などを削除
    result['target'] = target_dir / clean_name
    
    # 同名ファイルが存在する場合
    if result['target'].exists() and result['target'] != source:
        result['action'] = 'skip_exists'
        return result
    
    if not dry_run:
        try:
            # コンテンツを読み込み
            content = source.read_text(encoding='utf-8')
        except UnicodeDecodeError:
            try:
                content = source.read_text(encoding='shift_jis')
            except:
                content = source.read_text(encoding='latin-1')
        
        # フロントマターを更新
        body = remove_existing_frontmatter(content)
        created = get_file_created_date(source)
        new_frontmatter = create_frontmatter(tags, created)
        new_content = new_frontmatter + '\n\n' + body.lstrip()
        
        # ターゲットディレクトリが存在しない場合は作成
        target_dir.mkdir(parents=True, exist_ok=True)
        
        # 新しい場所に書き込み
        result['target'].write_text(new_content, encoding='utf-8')
        
        # 元ファイルを削除
        source.unlink()
    
    return result

def reorganize_import_tech(vault_path: Path, dry_run: bool = True):
    vault_path = Path(vault_path)
    import_tech_path = vault_path / "Import tech"
    
    print(f"\n{'=' * 60}")
    print("Import tech/ 再編成スクリプト")
    print(f"モード: {'DRY RUN' if dry_run else '実行'}")
    print(f"{'=' * 60}\n")
    
    if not import_tech_path.exists():
        print("Error: Import tech/ が見つかりません")
        return
    
    results = {
        'moved': [],
        'skipped': [],
        'deleted': [],
        'remaining': []
    }
    
    # 全ファイルを取得
    all_files = list(import_tech_path.glob('*.md'))
    print(f"対象ファイル数: {len(all_files)}\n")
    
    # マッピングに従ってファイルを処理
    for md_file in sorted(all_files):
        filename = md_file.name
        
        # 削除候補
        if filename in DELETE_CANDIDATES:
            results['deleted'].append(md_file)
            if not dry_run:
                md_file.unlink()
            print(f"🗑️  削除: {filename}")
            continue
        
        # マッピングを確認
        if filename in FILE_MAPPING:
            target_dir_name, tags = FILE_MAPPING[filename]
            target_dir = vault_path / target_dir_name
            
            result = process_and_move_file(md_file, target_dir, tags, vault_path, dry_run)
            
            if result['action'] == 'move':
                results['moved'].append(result)
                print(f"📁 {filename}")
                print(f"   → {target_dir_name}/{result['target'].name}")
                print(f"   tags: {tags}")
            else:
                results['skipped'].append(result)
                print(f"⏭️  スキップ: {filename} (同名ファイル存在)")
        else:
            results['remaining'].append(md_file)
            print(f"❓ 未分類: {filename}")
    
    # サマリー
    print(f"\n{'=' * 60}")
    print("結果サマリー:")
    print(f"  移動: {len(results['moved'])} ファイル")
    print(f"  スキップ: {len(results['skipped'])} ファイル")
    print(f"  削除: {len(results['deleted'])} ファイル")
    print(f"  未分類: {len(results['remaining'])} ファイル")
    print(f"{'=' * 60}")
    
    if results['remaining']:
        print("\n未分類ファイル一覧:")
        for f in results['remaining']:
            print(f"  - {f.name}")
    
    return results

def main():
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument('--execute', action='store_true')
    parser.add_argument('--vault', default='/Users/masanao/Obsidian/nexus')
    args = parser.parse_args()
    
    reorganize_import_tech(Path(args.vault), dry_run=not args.execute)
    
    if not args.execute:
        print("\n実行するには: python reorganize_import_tech.py --execute")

if __name__ == '__main__':
    main()

