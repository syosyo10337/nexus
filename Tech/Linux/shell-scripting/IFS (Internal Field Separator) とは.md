---
tags:
  - linux
  - command
created: 2026-01-04
status: draft
---

# IFS (Internal Field Separator) とは
シェルの特殊組み込み変数
**IFSは、Bashが文字列を「単語」に分割する際の区切り文字を定義する特殊変数**です。

### デフォルト値

```Bash
# デフォルトのIFS
IFS=$' \t\n'  # スペース、タブ、改行

# 例：デフォルトのIFSの動作
text="apple banana cherry"
read -r a b c <<< "$text"
# a="apple", b="banana", c="cherry"
# ↑ スペースで区切られる

```

```Bash
# IFSを空にした場合
IFS= read -r line <<< "  apple  "
# line="  apple  "
# ↑ 空白がそのまま保持される
```