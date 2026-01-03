 

# s`et +e` / -e /-u / -o

[robustでdebugイージーなな記法はこちら](#2bd38cdd-027d-8029-b1c5-e0b77862e28a)

[set -e](#2bd38cdd-027d-80f9-8b08-f62f7bc9e870)

[set -u](#2bd38cdd-027d-8088-9b7f-e7c04cf1ec94)

[set -o pipefail](#2cc38cdd-027d-8037-a5d1-e0729e315809)

[参考](#2bd38cdd-027d-8019-a11c-c96b92e4a838)

シェルスクリプトにおいて、直前の**`set -e`の設定を解除する**ためのコマンドです。

それぞれの意味は以下の通りです。

- `**set -e**`: スクリプト内のコマンドが**非ゼロの終了ステータス（エラー）を返した場合**、その時点でスクリプトの実行を**直ちに終了**させるように設定します。これにより、エラー発生後の予期しない動作を防ぎ、堅牢なスクリプトを書くのに役立ちます。

- `**set +e**`: `set -e`による自動終了の動作を**無効**にします。これ以降、エラーが発生してもスクリプトは停止せず、次の行の実行を続行します。

特定のコマンドでのみエラーを無視したい場合などに、一時的に`set +e`を使用してエラーチェックを無効にし、その後に再び`set -e`で有効にする、といった使い方をします。

# robustでdebugイージーなな記法はこちら

```Bash
set -euo pipefail

# short-hand of
set -e
set -u
set -o pipefail
```

## set -e

はエラーが起こると異常終了するよ。っていう設定らしい

## set -u

未定義の変数に対してもエラーを起こす。

e.g. $firstnameは未定義ですよ？

```Bash
#!/bin/bash
firstName="Aaron"
fullName="$firstname Maxwell"
echo "$fullName"
```

  

## set -o pipefail

pipe ライン中のエラーに気づけない

```Bash
grep some-string /non/existent/file | sort
# grep: /non/existent/file: No such file or directory
echo $?
# 0  ← sortが成功したので0が返る（grepのエラーは無視される）
```

### 参考

[http://redsymbol.net/articles/unofficial-bash-strict-mode/](http://redsymbol.net/articles/unofficial-bash-strict-mode/)