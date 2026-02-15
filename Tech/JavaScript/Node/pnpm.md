---
tags:
  - javascript
  - nodejs
  - package-manager
  - pnpm
created: 2026-02-15
updated_at: 2026-02-15
status: active
---

# pnpm

## pnpm の仕組み

### Content-Addressable Store（コンテンツアドレス可能ストア）

pnpm の最大の特徴は、グローバルストアにパッケージを一元管理する点です。

```bash
~/.local/share/pnpm/store/v10/   ← グローバルストア
```

- すべてのパッケージファイルはハッシュ値で管理される
- 同じファイルは1つだけ保存される（重複なし）
- node_modules 内のファイルはストアへのハードリンク

### npm/yarn との違い

**npm/yarn:**

```bash
project-a/node_modules/lodash/  → 実ファイル (コピー)
project-b/node_modules/lodash/  → 実ファイル (コピー)  ← 重複！
```

**pnpm:**

```bash
project-a/node_modules/lodash/  → ハードリンク → store/v10/files/...
project-b/node_modules/lodash/  → ハードリンク → store/v10/files/... ← 同じファイル！
```

### store/v10 とは

v10 はストアのフォーマットバージョンです。

| バージョン | pnpm       | 特徴               |
| ---------- | ---------- | ------------------ |
| v3         | pnpm 6以前 | 旧フォーマット     |
| v3         | pnpm 7-8   | 改良版（同じv3名） |
| v10        | pnpm 9+    | 最新フォーマット   |

バージョンが変わると互換性がないため、別ディレクトリになります。旧バージョンのストアは手動で削除可能です。

### node_modules の構造

pnpm はフラットではない node_modules を作ります：

```text
node_modules/
├── .pnpm/                          ← 実体（ハードリンク先）
│   ├── lodash@4.17.21/
│   │   └── node_modules/
│   │       └── lodash/             → store/v10 へのハードリンク
│   └── express@4.18.2/
│       └── node_modules/
│           ├── express/            → store/v10 へのハードリンク
│           └── body-parser/        → ../.pnpm/body-parser@.../... へのシンボリックリンク
├── lodash -> .pnpm/lodash@4.17.21/node_modules/lodash    ← シンボリックリンク
└── express -> .pnpm/express@4.18.2/node_modules/express  ← シンボリックリンク
```

**ポイント:**

- `node_modules/` 直下 → `.pnpm/` へのシンボリックリンク（package.jsonに書いたものだけ）
- `.pnpm/` 内 → ストアへのハードリンク（実ファイル）
- 依存の依存 → `.pnpm/` 内でシンボリックリンクで解決

### なぜこの構造？

1. **ディスク節約** - ハードリンクでファイル実体は1つだけ
2. **厳格な依存管理** - package.json に書いてない依存は `require()` できない（幽霊依存の防止）
3. **高速インストール** - ストアにあればダウンロード不要

## 便利なコマンド

```bash
pnpm store path      # ストアの場所を表示
pnpm store status    # ストアの整合性チェック
pnpm store prune     # 使われていないパッケージを削除
```

## npm/yarn との比較

|          | npm      | yarn       | pnpm           |
| -------- | -------- | ---------- | -------------- |
| ディスク | 最大使用 | 大きい     | 最小（効率的） |
| 速度     | 遅い     | 速い       | 最速           |
| 依存管理 | 緩い     | 緩い       | 厳格           |
| ストア   | なし     | キャッシュ | グローバル     |

## pnpm の利点

- **ディスク容量の節約**: 同じパッケージを複数のプロジェクトで使用しても、実体は1つだけ
- **高速インストール**: グローバルストアにあるパッケージは再ダウンロード不要
- **厳格な依存解決**: package.json に記載されていない依存パッケージへのアクセスを防ぐ
- **モノレポサポート**: ワークスペース機能が充実

## 参考リンク

- [pnpm 公式サイト](https://pnpm.io/)
- [ハードリンクとシンボリックリンク](../../Linux/basics/hardlink-symlink.md) - ハードリンクの詳細
- [新しいLinuxの教科書](../../Linux/basics/新しいLinuxの教科書.md) - Linuxコマンド全般
