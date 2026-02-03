---
tags:
  - linux
  - command
created: 2026-01-04
status: draft
---

# grep

[https://www.ibm.com/docs/ja/aix/7.1?topic=g-grep-command](https://www.ibm.com/docs/ja/aix/7.1?topic=g-grep-command)

`-q`: (quiet)ということね。

行の一致に関係なく、標準出力への書き出しをすべて抑止します。入力行を選択した場合は、状況 0 を戻して終了します。 **-q**  フラグを  **-c**、**-l**、**-n**  フラグと 併用すると、**-q**  フラグのみを指定した場合のように動作します。

`-o`: (only-matching)ということね。マッチした部分だけ出力
`-E`: (extended-regexp)ということね。正規表現を使用できるようになる。

```bash
# e.g.
  echo "v1.2.3" | grep -oE '^v[0-9]+'
  # 出力: v1

  echo "v12.0.0" | grep -oE '^v[0-9]+'
  # 出力: v12

  echo "v123.45.67" | grep -oE '^v[0-9]+'
  # 出力: v123
```
