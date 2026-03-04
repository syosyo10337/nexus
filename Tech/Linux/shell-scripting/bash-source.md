---
tags:
  - linux
  - bash
  - shell-scripting
created: 2026-03-04
status: active
---

## 概要

`BASH_SOURCE` は Bash の特殊配列変数で、シェルスクリプトのコールスタック（呼び出し元のファイルパス）を保持する。

## コールスタックとしての BASH_SOURCE

| インデックス | 意味                                    |
| ------------ | --------------------------------------- |
| `[0]`        | 現在のコードが書かれているファイル自身  |
| `[1]`        | それを呼び出した（source した）ファイル |
| `[2]`        | さらにその呼び出し元…                   |

直接実行した場合は `[0]` のみにスクリプトのパスが入り、`[1]` 以降は空になる。
`source` で読み込まれた場合に、呼び出し元のチェーンが記録される。

```bash
# 直接実行
$ bash script.sh
BASH_SOURCE[0] = script.sh
BASH_SOURCE[1] =              # 空

# 別スクリプトから source した場合
$ bash caller.sh   # caller.sh 内で source script.sh
BASH_SOURCE[0] = script.sh    # 自分自身
BASH_SOURCE[1] = caller.sh    # 呼び出し元
```

## 関数内での挙動

関数内では `BASH_SOURCE[0]` はその関数が定義されているファイルを指す。

```bash
# file_a.sh
source file_b.sh
func_from_b

# file_b.sh
func_from_b() {
  echo "${BASH_SOURCE[0]}"  # → file_b.sh（関数の定義元）
  echo "${BASH_SOURCE[1]}"  # → file_a.sh（呼び出し元）
}
```

## $0 との違い

| 変数             | 意味                                                      |
| ---------------- | --------------------------------------------------------- |
| `$0`             | 最初に実行されたスクリプト名（source 時はシェル名になる） |
| `BASH_SOURCE[0]` | 常に現在のファイルを指す                                  |

`source` で読み込まれたスクリプト内では `$0` が呼び出し元になってしまうため、自分自身のパスを確実に取得するには `BASH_SOURCE[0]` を使う。

## 定番パターン: スクリプト自身のディレクトリ取得

```bash
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd -P)"
```

1. `${BASH_SOURCE[0]}` でスクリプト自身のパスを取得
2. `dirname` でディレクトリ部分を抽出
3. `cd` してから `pwd -P` でシンボリックリンクを解決した絶対パスを取得

## 参考

- [特殊変数.md](特殊変数.md)
- [../commands/dirnameコマンド.md](../commands/dirnameコマンド.md)
