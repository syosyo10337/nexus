---
tags:
  - linux
  - command
  - file
created: 2022-12-20
status: active
---

# diffコマンド

## 概要

**diff = difference（差分）**

2つのファイル間の差分を表示するコマンドです。ファイルの変更内容を確認したり、バージョン管理で変更点を把握する際に使用されます。

## 基本構文

```bash
diff [オプション] ファイル1 ファイル2
```

## 主なオプション

| オプション | 説明 |
|-----------|------|
| `-c` | context diff形式で差分を出力します |
| `-u` | unified diff形式で差分を出力します（推奨） |

## 基本的な使い方

### デフォルト形式での比較

```bash
$ cat file1
test text

$ cat file2
test text
new line

# diffコマンドで比較
$ diff file1 file2
1a2
> new line
```

**出力の読み方:**
- `1a2` = ファイル1の1行目の後に、ファイル2の2行目を追加
- `>` = 追加された行

### unified diff形式（-uオプション）

```bash
$ diff -u file1 file2
--- file1 2012-07-06 11:00:00.098086703 +0900
+++ file2 2012-07-06 12:00:00.394135769 +0900
@@ -1 +1,2 @@
 test text
+new line
```

**出力の読み方:**
- `---` = 元のファイル（file1）
- `+++` = 変更後のファイル（file2）
- `@@ -1 +1,2 @@` = 変更範囲（file1の1行目から、file2の1-2行目）
- `+` = 追加された行
- `-` = 削除された行

### context diff形式（-cオプション）

```bash
$ diff -c file1 file2
*** file1 2012-07-06 11:00:00.098086703 +0900
--- file2 2012-07-06 12:00:00.394135769 +0900
***************
*** 1 ****
--- 1,2 ----
 test text
+ new line
```

**出力の読み方:**
- `***` = 元のファイル（file1）
- `---` = 変更後のファイル（file2）
- `+` = 追加された行

## 共通点がない場合の例

ファイルの内容が完全に異なる場合：

```bash
$ cat file1
test text

$ cat file2
overwrite text
new line

$ diff -u file1 file2
--- file1 2012-07-06 13:21:21.219249366 +0900
+++ file2 2012-07-06 13:26:51.664814277 +0900
@@ -1 +1,2 @@
-test text
+overwrite text
+new line
```

**出力の読み方:**
- `-test text` = file1から削除された行
- `+overwrite text` = file2に追加された行
- `+new line` = file2に追加された行
