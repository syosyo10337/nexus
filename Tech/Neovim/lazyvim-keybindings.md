---
tags:
  - neovim
  - lazyvim
  - keybindings
  - lazygit
created: 2026-02-28
updated_at: 2026-02-28
status: active
---

## 概要

LazyVim の主要キーバインドまとめ。ファイル操作、バッファ管理、検索、LSP、Git 操作、diffview.nvim、lazygit の使い方を含む。

## 基本操作

| キー | 機能 |
| --- | --- |
| `<Leader>e` | ファイルツリー表示 |
| `<Leader>gg` | Git クライアント (lazygit) |
| `<Leader>ff` | ファイル検索 (Telescope) |

## バッファ（オープンファイル）の移動

| キー | 機能 |
| --- | --- |
| `Shift-h` | 前のバッファへ |
| `Shift-l` | 次のバッファへ |
| `Shift-,` | バッファ一覧モーダル表示 |

## バッファ管理

| キー | 機能 |
| --- | --- |
| `<Leader>bd` | 現在のバッファを閉じる（レイアウト維持） |
| `<Leader>bD` | 現在のバッファを閉じる（ウィンドウごと） |
| `<Leader>bo` | 現在以外のバッファを全部閉じる |
| `<Leader>br` | 右側のバッファを全部閉じる |
| `<Leader>bl` | 左側のバッファを全部閉じる |

## 検索

| キー | 機能 |
| --- | --- |
| `/` | ファイル内文字検索 |
| `<Leader>sg` | プロジェクト全体で grep 検索 (Live Grep) |

## LSP ナビゲーション

| キー | 機能 |
| --- | --- |
| `gd` | Go to Definition |
| `gr` | Go to References |
| `K` | ホバー情報表示 |

## Git 操作 (`<Leader>g` 配下)

| キー | 機能 |
| --- | --- |
| `<Leader>gs` | Git Status（変更ファイル一覧 + diff preview） |
| `<Leader>gd` | Git Diff（hunks） |
| `<Leader>gl` | Git Log（コミット履歴） |
| `<Leader>gf` | 現在のファイルの Git 履歴 |
| `<Leader>gB` | ブラウザで GitHub を開く |
| `<Leader>gb` | Git Blame（行ごとの最終変更者） |

## Gitsigns（hunk 操作）

Gitsigns はバッファの左端（sign column）に変更行のマーカーを表示し、hunk 単位での stage/reset をインタラクティブに行える LazyVim プラグイン。

| キー | 機能 |
| --- | --- |
| `]h` / `[h` | 次/前の hunk にジャンプ |
| `<Leader>ghs` | hunk を stage |
| `<Leader>ghr` | hunk を reset |
| `<Leader>ghS` | バッファ全体を stage |
| `<Leader>ghp` | hunk のプレビュー |
| `<Leader>ghb` | blame line |

## diffview.nvim

### 基本コマンド

| キー | コマンド | 機能 |
| --- | --- | --- |
| `<Leader>gd` | `:DiffviewOpen` | 変更ファイル一覧 + diff を開く |
| `<Leader>gh` | `:DiffviewFileHistory %` | 現在のファイルの git 履歴 |
| `<Leader>gH` | `:DiffviewFileHistory` | 全ファイルの git 履歴 |

### Diffview 内の操作

| キー | 機能 |
| --- | --- |
| `Tab` / `Shift-Tab` | 次/前の変更ファイルへ移動 |
| `]x` / `[x` | 次/前の conflict へジャンプ |
| `gf` | ファイルを開く |
| `q` | Diffview を閉じる |

### 特定コミットとの比較

```vim
:DiffviewOpen HEAD~3   " 3コミット前との差分
:DiffviewOpen main     " mainブランチとの差分
```

### Claude Code との典型的なワークフロー

1. Claude Code が変更を加える
2. Nvim で `<Leader>gd` を押す
3. 左パネルに変更ファイル一覧が表示される
4. 各ファイルを選ぶと右側に full-file diff が表示される
5. レビュー後 `q` で閉じる

## lazygit

### diffview と lazygit の役割分担

| ツール | 役割 | VSCode での対応 |
| --- | --- | --- |
| diffview | コードリーディング（差分を読む） | エディタ上の diff タブ |
| lazygit | Git 操作（stage/commit/push） | Source Control パネル |

**典型的なフロー**: Claude Code が変更 → diffview でレビュー → lazygit で commit & push

### 基本操作

`<Leader>gg` で起動。起動後：

| キー | 機能 |
| --- | --- |
| `1` ~ `5` | パネル切替（Status / Files / Branches / Commits / Stash） |
| `2` → `space` | ファイルを stage/unstage |
| `2` → `a` | 全部 stage |
| `c` | commit（メッセージ入力 → Enter） |
| `P` | push |
| `q` | 閉じる |

### 最小ワークフロー

普段のフローはこの 3 ステップで十分：

1. `space` で stage
2. `c` で commit
3. `P` で push

## 参考

- [vim 基本操作](../Linux/basics/vim.md)
