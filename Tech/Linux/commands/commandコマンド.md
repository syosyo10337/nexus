---
tags:
  - linux
  - shell
  - builtin
created: 2026-03-04
updated_at: 2026-03-04
status: active
---

# command コマンド

シェルのビルトインコマンド。エイリアスやシェル関数を**バイパス**して、本来のコマンドを直接実行する。

## 基本的な使い方

```bash
# エイリアスを無視して本来の ls を実行
command ls

# シェル関数を無視して本来の cd を実行
command cd /tmp
```

## command -v：コマンドの存在確認

`command -v <コマンド名>` はコマンドのパスを返す。見つからなければ終了ステータス1を返す。

シェルスクリプトでコマンドの存在確認をする**定番イディオム**。

```bash
if command -v git > /dev/null 2>&1; then
  echo "git is installed"
else
  echo "git is not found"
fi
```

### なぜ command -v が推奨されるか

| 方法 | 問題点 |
|---|---|
| `which` | 外部コマンドであり、環境によって挙動が異なる（エイリアスを返す場合もある） |
| `type` | bashビルトインだが出力が人間向け（パース困難） |
| `command -v` | **POSIX準拠**のビルトイン。bash / zsh / sh どれでも動く |

## 主なオプション

| オプション | 説明 |
|---|---|
| `command -v <cmd>` | コマンドのパスを表示（存在確認に使用） |
| `command -V <cmd>` | コマンドの種類（builtin, alias, function等）を詳細表示 |
| `command <cmd>` | エイリアス・関数をバイパスしてコマンドを実行 |

## 実践的なパターン

### 依存コマンドのチェック

```bash
#!/bin/bash
for cmd in git docker node; do
  if ! command -v "$cmd" > /dev/null 2>&1; then
    echo "Error: $cmd is required but not installed." >&2
    exit 1
  fi
done
```

### 関数内でオリジナルコマンドを呼ぶ

```bash
# ls をカスタマイズしつつ、内部では本来の ls を使う
ls() {
  command ls --color=auto -lh "$@"
}
```

## 関連ノート

- [エイリアス](../shell-scripting/エイリアス.md) — エイリアスのバイパスに `command` を使う例
