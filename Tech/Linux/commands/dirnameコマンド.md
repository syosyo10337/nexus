---
tags:
  - linux
  - command
created: 2026-01-04
updated_at: 2026-03-04
status: active
---

## 概要

引数にとったパスのディレクトリ部分を表示するコマンド。

```bash
$ dirname /usr/local/bin/brew
/usr/local/bin

$ dirname ./scripts/deploy.sh
./scripts
```

## 使用例

```bash
find {docs,generated} -name *.md | xargs dirname
```

## 定番パターン: スクリプト自身の絶対パス取得

`dirname` と `cd` + `pwd -P` を組み合わせて、シンボリックリンクを解決した絶対パスを取得する。

```bash
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd -P)"
REPO_ROOT="$(dirname "${SCRIPT_DIR}")"
```

`pwd -P` の `-P` は physical の意味で、シンボリックリンクを辿った実際のパスを返す。`-P` なしだとリンク自体のパスが返る場合がある。

```bash
# 例: /opt/app -> /Users/masanao/projects/app のシンボリックリンクがある場合
cd /opt/app
pwd      # /opt/app（論理パス）
pwd -P   # /Users/masanao/projects/app（物理パス）
```

### 処理の流れ（内側から順に）

1. `${BASH_SOURCE[0]}` — 実行中スクリプトのパス
2. `dirname "..."` — ディレクトリ部分を取得
3. `cd "..." && pwd -P` — そのディレクトリに移動し、シンボリックリンクを解決した絶対パスを取得
4. `dirname "${SCRIPT_DIR}"` — 一つ上の親ディレクトリを取得

具体例（`/Users/masanao/dotfiles/.bin/installer.sh` の場合）:

| 変数       | 値                           |
| ---------- | ---------------------------- |
| SCRIPT_DIR | /Users/masanao/dotfiles/.bin |
| REPO_ROOT  | /Users/masanao/dotfiles      |

スクリプトがどこから実行されても（`cd /tmp && bash ~/dotfiles/.bin/installer.sh` など）、正しくリポジトリのルートを指せる。

## 参考

- [https://wa3.i-3-i.info/word11619.html](https://wa3.i-3-i.info/word11619.html)
- [../shell-scripting/シェル変数.md](../shell-scripting/シェル変数.md) — `BASH_SOURCE` の詳細