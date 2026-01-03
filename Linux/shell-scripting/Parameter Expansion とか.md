---
tags:
  - linux
  - command
  - file
created: 2026-01-04
status: active
---

# Parameter Expansion ##とか

**${GITHUB_REF##*/}は、bashのパラメータ展開だそう**

### **2. シェルパターン（Glob Pattern）**

- Bashのパラメータ展開やファイル名展開で使用

- （任意の文字列）、?（1文字）、[...]（文字クラス）など

- シンプルだが用途が限定的

## **${GITHUB_REF##*/}の詳細**

`${変数名##パターン}`

- ##は最長一致で先頭から削除

- /はシェルパターンで「任意の文字列 + /」を意味

**動作の比較**

|操作|構文|説明|`FILE="path/to/file.txt"`||
|---|---|---|---|---|
|最短一致削除（先頭）|${変数#パターン}|最初に一致する最短部分を削除|`${FILE#*/}`|`to/file.txt`|
|最長一致削除（先頭）|${変数##パターン}|最初に一致する最長部分を削除|`${FILE##*/}`|`file.txt`|
|最短一致削除（末尾）|${変数%パターン}|最後に一致する最短部分を削除|`${FILE%/*}`|`/path/to`|
|最長一致削除（末尾）|${変数%%パターン}|最後に一致する最長部分を削除|`${FILE%%/*}`||

%は後ろを削る。#は前を削る。

##/ %%はできるだけ長く

用例

# ブランチ名を取得する場合

GITHUB_REF="refs/heads/feature/new-feature"  
${GITHUB_REF#_/} # → heads/feature/new-feature  
${GITHUB_REF##_/} # → new-feature ✅ (ブランチ名のみ)

# ファイル名とディレクトリの分離

FILE_PATH="/path/to/my/file.txt"  
${FILE_PATH##_/} # → file.txt (ファイル名)  
${FILE_PATH%/_} # → /path/to/my (ディレクトリパス)

# 拡張子の処理

FILENAME="archive.tar.gz"  
${FILENAME%._} # → archive.tar (最後の拡張子のみ削除)  
${FILENAME%%._} # → archive (すべての拡張子を削除)  
${FILENAME#_.} # → tar.gz (ファイル名を削除して拡張子のみ)  
${FILENAME##_.} # → gz (最後の拡張子のみ)

# URLからプロトコルを削除

URL="[https://github.com/user/repo](https://github.com/user/repo)"  
${URL#*://} # → [github.com/user/repo](http://github.com/user/repo)