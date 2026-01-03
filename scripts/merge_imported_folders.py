#!/usr/bin/env python3
"""
imported/ フォルダの内容を親フォルダに統合するスクリプト

対象:
- Git/imported/*.md → Git/
- CS/impoted/*.md → CS/  (typoも対応)
- Linux/imported/*.md → Linux/

Attachmentsフォルダも同様に統合

Usage:
    python merge_imported_folders.py --dry-run  # 確認のみ
    python merge_imported_folders.py --execute  # 実行
"""

import os
import shutil
from pathlib import Path
from typing import List, Tuple
import re

def find_imported_folders(vault_path: Path) -> List[Path]:
    """
    imported/ または impoted/ (typo) フォルダを検索
    """
    imported_folders = []
    
    for folder in vault_path.rglob('*'):
        if folder.is_dir():
            folder_name = folder.name.lower()
            if folder_name in ('imported', 'impoted'):  # typoも対応
                imported_folders.append(folder)
    
    return imported_folders

def find_duplicate_attachments(vault_path: Path) -> List[Tuple[Path, Path]]:
    """
    Attachments と Attachments 1 のようなペアを検索
    """
    duplicates = []
    
    for folder in vault_path.rglob('*'):
        if folder.is_dir() and folder.name == 'Attachments 1':
            primary = folder.parent / 'Attachments'
            if primary.exists():
                duplicates.append((folder, primary))
    
    return duplicates

def update_links_for_move(vault_path: Path, old_path: Path, new_path: Path, dry_run: bool = True):
    """
    ファイル移動に伴うリンクの更新
    
    Obsidianは相対パスでなくファイル名でリンクするので、
    同名ファイルへのリンクは更新不要。
    ただし、Attachments内の画像参照は更新が必要な場合がある。
    """
    if not old_path.suffix == '.md':
        return []
    
    # mdファイルの場合、リンクはファイル名のみで参照されるので通常は更新不要
    return []

def merge_imported_folders(vault_path: Path, dry_run: bool = True):
    """
    imported/ フォルダの内容を親フォルダに統合
    """
    vault_path = Path(vault_path)
    
    print(f"\n{'=' * 60}")
    print("imported/ フォルダ統合スクリプト")
    print(f"対象: {vault_path}")
    print(f"モード: {'DRY RUN (確認のみ)' if dry_run else '実行'}")
    print(f"{'=' * 60}\n")
    
    imported_folders = find_imported_folders(vault_path)
    
    print(f"発見した imported フォルダ: {len(imported_folders)}")
    for folder in imported_folders:
        print(f"  - {folder.relative_to(vault_path)}")
    
    moves = []
    conflicts = []
    
    for imported_folder in imported_folders:
        parent_folder = imported_folder.parent
        
        # フォルダ内の全ファイルを処理
        for item in imported_folder.iterdir():
            if item.name.startswith('.'):
                continue
                
            new_path = parent_folder / item.name
            
            if new_path.exists() and new_path != item:
                conflicts.append({
                    'source': item,
                    'target': new_path,
                    'reason': '同名ファイル/フォルダが既に存在'
                })
            else:
                moves.append({
                    'source': item,
                    'target': new_path,
                    'type': 'directory' if item.is_dir() else 'file'
                })
    
    print(f"\n移動対象: {len(moves)} アイテム")
    print(f"コンフリクト: {len(conflicts)} アイテム")
    
    if moves:
        print("\n--- 移動予定 ---")
        for move in moves:
            rel_src = move['source'].relative_to(vault_path)
            rel_tgt = move['target'].relative_to(vault_path)
            print(f"  {rel_src}")
            print(f"    → {rel_tgt}")
    
    if conflicts:
        print("\n--- コンフリクト (スキップ) ---")
        for conflict in conflicts:
            rel_src = conflict['source'].relative_to(vault_path)
            print(f"  {rel_src}: {conflict['reason']}")
    
    if not dry_run and moves:
        print("\n--- 実行中 ---")
        success_count = 0
        
        for move in moves:
            try:
                if move['type'] == 'directory':
                    # ディレクトリの場合はマージが必要
                    if move['target'].exists():
                        # 既存ディレクトリに中身をマージ
                        for item in move['source'].iterdir():
                            target_item = move['target'] / item.name
                            if not target_item.exists():
                                shutil.move(str(item), str(target_item))
                        # 空になったディレクトリを削除
                        if not any(move['source'].iterdir()):
                            move['source'].rmdir()
                    else:
                        shutil.move(str(move['source']), str(move['target']))
                else:
                    shutil.move(str(move['source']), str(move['target']))
                success_count += 1
                print(f"  移動: {move['source'].name}")
            except Exception as e:
                print(f"  エラー: {move['source'].name}: {e}")
        
        # 空になったimportedフォルダを削除
        for imported_folder in imported_folders:
            try:
                if imported_folder.exists() and not any(imported_folder.iterdir()):
                    imported_folder.rmdir()
                    print(f"  削除: {imported_folder.relative_to(vault_path)}/")
            except Exception as e:
                print(f"  フォルダ削除エラー: {e}")
        
        print(f"\n完了: {success_count}/{len(moves)} アイテムを移動")
    
    return moves, conflicts

def merge_duplicate_attachments(vault_path: Path, dry_run: bool = True):
    """
    Attachments 1 などを Attachments に統合
    """
    vault_path = Path(vault_path)
    
    print(f"\n{'=' * 60}")
    print("重複 Attachments フォルダ統合")
    print(f"{'=' * 60}\n")
    
    duplicates = find_duplicate_attachments(vault_path)
    
    print(f"発見した重複: {len(duplicates)}")
    
    moves = []
    
    for dup_folder, primary_folder in duplicates:
        print(f"\n{dup_folder.relative_to(vault_path)}/")
        print(f"  → {primary_folder.relative_to(vault_path)}/")
        
        for item in dup_folder.iterdir():
            if item.name.startswith('.'):
                continue
            
            target = primary_folder / item.name
            
            if target.exists():
                # 同名ファイルが存在する場合、番号付きでリネーム
                stem = item.stem
                suffix = item.suffix
                counter = 1
                while target.exists():
                    target = primary_folder / f"{stem}_{counter}{suffix}"
                    counter += 1
            
            moves.append({
                'source': item,
                'target': target,
                'dup_folder': dup_folder
            })
    
    if moves:
        print(f"\n移動対象: {len(moves)} ファイル")
        
        if not dry_run:
            print("\n--- 実行中 ---")
            success_count = 0
            
            for move in moves:
                try:
                    shutil.move(str(move['source']), str(move['target']))
                    success_count += 1
                except Exception as e:
                    print(f"  エラー: {move['source'].name}: {e}")
            
            # 空になったフォルダを削除
            for dup_folder, _ in duplicates:
                try:
                    if dup_folder.exists() and not any(dup_folder.iterdir()):
                        dup_folder.rmdir()
                        print(f"  削除: {dup_folder.relative_to(vault_path)}/")
                except Exception as e:
                    print(f"  フォルダ削除エラー: {e}")
            
            print(f"\n完了: {success_count}/{len(moves)} ファイルを移動")
    
    return moves

def main():
    import argparse
    
    parser = argparse.ArgumentParser(description='imported/フォルダを親フォルダに統合')
    parser.add_argument('--dry-run', action='store_true', default=True,
                        help='変更を実行せず確認のみ（デフォルト）')
    parser.add_argument('--execute', action='store_true',
                        help='実際に移動を実行')
    parser.add_argument('--vault', type=str, default='/Users/masanao/Obsidian/nexus',
                        help='Vaultのパス')
    
    args = parser.parse_args()
    
    dry_run = not args.execute
    vault_path = Path(args.vault)
    
    # imported フォルダの統合
    merge_imported_folders(vault_path, dry_run=dry_run)
    
    # 重複Attachmentsの統合
    merge_duplicate_attachments(vault_path, dry_run=dry_run)
    
    if dry_run:
        print("\n" + "=" * 60)
        print("これは DRY RUN です。実際に実行するには --execute を指定:")
        print(f"  python merge_imported_folders.py --execute")
        print("=" * 60)

if __name__ == '__main__':
    main()

