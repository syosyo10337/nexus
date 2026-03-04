---
tags:
  - linux
  - command
created: 2026-03-04
status: active
---

## 概要

引数にとったパスからファイル名（末尾の要素）を抽出するコマンド。[dirname](dirnameコマンド.md) と対になる。

```bash
$ basename /usr/local/bin/brew
brew

$ basename ./scripts/deploy.sh
deploy.sh
```

## サフィックス（拡張子）の除去

第2引数またはは `-s` オプションで拡張子を除去できる。

```bash
$ basename /path/to/file.txt .txt
file

$ basename -s .txt /path/to/file.txt
file
```

## 主なオプション

| オプション | 説明                             |
| ---------- | -------------------------------- |
| `-a`       | 複数のパスを同時に処理           |
| `-s`       | サフィックス（拡張子）を除去     |
| `-z`       | 出力の終端にヌル文字を追加       |

## 使用例

```bash
# 複数ファイルの拡張子なしファイル名を取得
basename -a -s .txt file1.txt file2.txt file3.txt
# file1
# file2
# file3

# パイプと組み合わせ
find . -name "*.sh" | xargs -I{} basename {} .sh
```

## 注意点

- 存在しないパスを指定してもエラーにならない（文字列操作のみ）
- 空文字列を渡すと空文字列が返る

## 参考

- [dirnameコマンド](dirnameコマンド.md) — ディレクトリ部分の抽出
