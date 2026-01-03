#!/usr/bin/env python3
"""
重複ファイル・類似ファイルを検出するスクリプト

検出対象:
- 同名ファイル（UUIDの有無で異なるもの）
- (1), (2) などのサフィックス付きファイル
- 類似の内容を持つファイル

Usage:
    python find_duplicates.py
"""

import os
import re
from pathlib import Path
from collections import defaultdict
from difflib import SequenceMatcher

# UUID pattern
UUID_PATTERN = re.compile(r'\s+[0-9a-f]{32}(?=\.md$)', re.IGNORECASE)

# (1), (2) パターン
DUPLICATE_SUFFIX_PATTERN = re.compile(r'\s+\((\d+)\)(?=\.md$)')

def normalize_filename(filename: str) -> str:
    """
    ファイル名を正規化（UUID、重複サフィックスを除去）
    """
    name = filename
    name = UUID_PATTERN.sub('', name)
    name = DUPLICATE_SUFFIX_PATTERN.sub('', name)
    return name.lower().strip()

def get_file_content_hash(file_path: Path) -> str:
    """
    ファイル内容の簡易ハッシュ（最初の500文字）
    """
    try:
        content = file_path.read_text(encoding='utf-8')
        # フロントマターを除去
        if content.startswith('---'):
            parts = content.split('---', 2)
            if len(parts) >= 3:
                content = parts[2]
        # 空白を正規化
        content = re.sub(r'\s+', ' ', content[:1000]).strip()
        return content[:500]
    except Exception:
        return ""

def similarity_ratio(text1: str, text2: str) -> float:
    """
    2つのテキストの類似度を計算
    """
    return SequenceMatcher(None, text1, text2).ratio()

def find_duplicates(vault_path: Path):
    """
    重複ファイルを検出
    """
    vault_path = Path(vault_path)
    
    print(f"\n{'=' * 60}")
    print("重複・類似ファイル検出スクリプト")
    print(f"対象: {vault_path}")
    print(f"{'=' * 60}\n")
    
    # 全mdファイルを収集
    md_files = list(vault_path.rglob('*.md'))
    print(f"スキャン対象: {len(md_files)} ファイル\n")
    
    # 正規化されたファイル名でグループ化
    name_groups = defaultdict(list)
    for md_file in md_files:
        if 'Templates' in str(md_file) or 'scripts' in str(md_file):
            continue
        normalized = normalize_filename(md_file.name)
        name_groups[normalized].append(md_file)
    
    # 重複グループを抽出
    duplicates = {k: v for k, v in name_groups.items() if len(v) > 1}
    
    print(f"--- 同名・類似名ファイル: {len(duplicates)} グループ ---\n")
    
    for i, (name, files) in enumerate(sorted(duplicates.items()), 1):
        print(f"{i}. [{name}]")
        for f in sorted(files, key=lambda x: len(x.name)):
            rel_path = f.relative_to(vault_path)
            size = f.stat().st_size
            print(f"   - {rel_path} ({size} bytes)")
        print()
    
    # (1), (2) サフィックス付きファイルを検出
    print(f"--- 重複サフィックス付きファイル ---\n")
    suffix_files = []
    for md_file in md_files:
        if DUPLICATE_SUFFIX_PATTERN.search(md_file.name):
            suffix_files.append(md_file)
    
    if suffix_files:
        for f in sorted(suffix_files):
            rel_path = f.relative_to(vault_path)
            print(f"   {rel_path}")
    else:
        print("   なし")
    
    print()
    
    # 同一フォルダ内の類似ファイルを検出
    print(f"--- 同一フォルダ内の類似コンテンツ (類似度 > 80%) ---\n")
    
    folder_files = defaultdict(list)
    for md_file in md_files:
        if 'Templates' in str(md_file) or 'scripts' in str(md_file):
            continue
        folder_files[md_file.parent].append(md_file)
    
    similar_pairs = []
    for folder, files in folder_files.items():
        if len(files) < 2:
            continue
        
        # 各ファイルの内容を取得
        contents = {}
        for f in files:
            contents[f] = get_file_content_hash(f)
        
        # ペアワイズ比較
        for i, f1 in enumerate(files):
            for f2 in files[i+1:]:
                if contents[f1] and contents[f2]:
                    sim = similarity_ratio(contents[f1], contents[f2])
                    if sim > 0.8:
                        similar_pairs.append((f1, f2, sim))
    
    if similar_pairs:
        for f1, f2, sim in sorted(similar_pairs, key=lambda x: -x[2]):
            rel1 = f1.relative_to(vault_path)
            rel2 = f2.relative_to(vault_path)
            print(f"   類似度 {sim:.0%}:")
            print(f"     - {rel1}")
            print(f"     - {rel2}")
            print()
    else:
        print("   なし")
    
    # サマリー
    print(f"\n{'=' * 60}")
    print("サマリー:")
    print(f"  同名ファイルグループ: {len(duplicates)}")
    print(f"  重複サフィックス付き: {len(suffix_files)}")
    print(f"  類似コンテンツペア: {len(similar_pairs)}")
    print(f"{'=' * 60}")
    
    return duplicates, suffix_files, similar_pairs

def main():
    import argparse
    
    parser = argparse.ArgumentParser(description='重複・類似ファイルを検出')
    parser.add_argument('--vault', type=str, default='/Users/masanao/Obsidian/nexus',
                        help='Vaultのパス')
    
    args = parser.parse_args()
    
    find_duplicates(Path(args.vault))

if __name__ == '__main__':
    main()


