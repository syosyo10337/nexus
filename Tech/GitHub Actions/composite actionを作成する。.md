---
tags:
  - github-actions
  - workflow
created: 2026-01-03
status: active
---

# composite actionを作成する

> GitHub公式ドキュメントの例では常にactions/checkoutが先に実行されており、技術的な理由により同じリポジトリ内のComposite Actionを使用するには事前のcheckoutが必要です。ただし、この制約が明示的に「必須」と記述されているわけではありません。

bash

`echo "tags<<EOF" >> $GITHUB_OUTPUT   echo "$TAGS" >> $GITHUB_OUTPUT   echo "EOF" >> $GITHUB_OUTPUT`

1. `**tags<<EOF**`: 「`tags`という名前の出力変数を定義し、`EOF`が出現するまでの全ての行を値として扱う」という宣言

2. **実際の値**: `$TAGS`の内容(複数行でもOK)を出力ファイルに書き込み

3. `**EOF**`: 終端マーカー。ここまでが`tags`の値であることを示す

## なぜこの構文が必要か

2022年10月頃、GitHub Actionsで従来の`set-output`コマンドが非推奨となり、`$GITHUB_OUTPUT`ファイルへの書き込み方式に変更されました [GitHub](https://github.com/github/docs/issues/21529)。単純な1行の値なら`echo "name=value"`で済みますが、**複数行の値を扱う場合、改行が含まれるため特別な構文が必要**になります。

## Heredoc構文のポイント

- **区切り文字(**`**EOF**`**)は任意**: `EOF`は慣例的に使われますが、セキュリティ上の理由から、ランダムな文字列を使用することが強く推奨されます [Julius Gamanyi](https://til.juliusgamanyi.com/posts/gh-actions-save-multiline-string-in-output-var/)

- **Bashの標準機能**: この構文は[Heredoc (Here Document)](https://tldp.org/LDP/abs/html/here-docs.html)と呼ばれるBashの標準的な機能を応用したもの
