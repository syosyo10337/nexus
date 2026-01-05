---
created: 2026-01-06
updated: 2026-01-06
tags:
  - Linux
  - Command
  - ShellScript
---

# trコマンド

## 概要

✅ **tr = TRanslate (変換) または TRansliterate (文字変換)**

⚠️ **注意:** "trim" ではありません！

文字を変換・削除・圧縮するコマンドです。
標準入力からのみ読み込み、標準出力に結果を出力します（ファイルを直接指定できません）。

## 基本構文

```bash
tr [オプション] SET1 [SET2]
```

**重要:** `tr`は標準入力からのみ読み込むため、パイプ (`|`) またはリダイレクト (`<`) と組み合わせて使用します。

## 主なオプション

| オプション | 説明 |
|-----------|------|
| `-d` | 指定した文字を削除 (delete) |
| `-s` | 連続する文字を1つに圧縮 (squeeze) |
| `-c` | SET1の補集合を使用 (complement) |
| `-t` | SET1をSET2の長さに切り詰める (truncate) |

## 基本的な使い方

### 文字の置換

```bash
# 小文字を大文字に変換
echo "hello world" | tr 'a-z' 'A-Z'
# 出力: HELLO WORLD

# 大文字を小文字に変換
echo "HELLO WORLD" | tr 'A-Z' 'a-z'
# 出力: hello world
```

### 文字の削除 (`-d` オプション)

```bash
# スペースを削除
echo "  34  " | tr -d ' '
# 出力: 34

# 改行を削除
echo -e "line1\nline2" | tr -d '\n'
# 出力: line1line2

# 数字を削除
echo "abc123def456" | tr -d '0-9'
# 出力: abcdef
```

### 連続する文字の圧縮 (`-s` オプション)

```bash
# 連続するスペースを1つに圧縮
echo "hello    world" | tr -s ' '
# 出力: hello world

# 連続する改行を1つに圧縮
echo -e "line1\n\n\nline2" | tr -s '\n'
```

## 文字セットの指定方法

### 範囲指定

```bash
'a-z'        # 小文字のa～z
'A-Z'        # 大文字のA～Z
'0-9'        # 数字の0～9
'a-zA-Z'     # すべてのアルファベット
'a-zA-Z0-9'  # 英数字
```

### 特殊文字

```bash
'\n'    # 改行
'\t'    # タブ
' '     # スペース
```

### 文字クラス（推奨）

```bash
[:lower:]   # 小文字
[:upper:]   # 大文字
[:digit:]   # 数字
[:alnum:]   # 英数字
[:space:]   # 空白文字
[:punct:]   # 句読点
```

**使用例:**
```bash
# 文字クラスを使った大文字変換
echo "hello" | tr '[:lower:]' '[:upper:]'

# 数字以外を削除（-c = complement = 補集合）
echo "abc123def456" | tr -cd '[:digit:]'
# 出力: 123456
```

## 頻出パターン

### パターン1: wcとの組み合わせ（スペース削除）⭐最頻出

```bash
# 行数を取得してスペースを削除
wc -l < file.txt | tr -d ' '

# 変数に格納
line_count=$(wc -l < file.txt | tr -d ' ')
echo "行数: ${line_count}"
```

**なぜ必要か:**
- `wc -l < file.txt` は `     34` のように左側にスペースが入る
- `tr -d ' '` でスペースを削除して `34` にする
- シェルスクリプトで数値として扱いやすくなる


## 重要な注意点

### ⚠️ ファイルを直接指定できない

`tr`は標準入力からのみ読み込みます。

❌ **間違い:**
```bash
tr 'a-z' 'A-Z' file.txt  # エラー
```

✅ **正しい:**
```bash
# リダイレクトを使用
tr 'a-z' 'A-Z' < file.txt

# パイプを使用
cat file.txt | tr 'a-z' 'A-Z'
```

### マルチバイト文字（日本語）は非対応

`tr`はバイト単位で処理するため、日本語などの処理には適していません。

```bash
# 日本語の処理は期待通りに動作しない
echo "こんにちは" | tr 'あ-ん' 'ア-ン'  # ❌
```

## よく使うパターン集

```bash
# 大文字変換
tr '[:lower:]' '[:upper:]'

# 小文字変換
tr '[:upper:]' '[:lower:]'

# スペース削除
tr -d ' '

# 改行削除
tr -d '\n'

# 連続スペース圧縮
tr -s ' '

# 数字のみ抽出（補集合 + 削除）
tr -cd '0-9'

# 英数字のみ抽出
tr -cd '[:alnum:]'

# 改行をスペースに
tr '\n' ' '

# カンマを改行に
tr ',' '\n'
```
