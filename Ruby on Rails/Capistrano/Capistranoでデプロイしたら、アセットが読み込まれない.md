---
tags:
  - rails
  - config
created: 2026-01-03
status: active
---

# Capistranoでデプロイしたら、アセットが読み込まれない

# 症状

画像とCSS周りが読み込めてない。JSは読み込まめている。

capistranoタスクとしては、

```Bash
deploy:assets:precompile
```

が実行されているはず。

## 原因究明

1. nginx自身の設定を確認した。

具体的には、`/etc/nginx/nginx.conf`のことです。

問題なし。

deployコマンド (起動済みのnginx)とsystectl restart puma (再起動)しても、どこにもエラーがない。アセットが反映されていないだけでアクセスもできている。

ということは、

問題になっているのは、どうやらnginx内のバックエンドアプリサーバ設定ファイルで、assetsを取りにいけなかったこと。

ということで、

2. nginx →pumaについての設定ファイルを見てみる。

`/etc/nginx/conf.d/<設定した名前>.conf`ここのことです。

タイポや設定ミスがあるか？？

→なかった

3. railsアプリのソースに設定ミスがあったか？

→**あった。**

- 以下の部分を見ておきたい。

```Ruby
# config/envrionments/production.rb

config.public_file_server.enabled = ENV['RAILS_SERVE_STATIC_FILES'].present?
```

この部分の意味は、Nginxやapacheに静的なファイルを配置させて、`public/`にあるコンパイルされたアセットファイル群をデフォルトでは、

**読み込まない**設定をしている部分。

### 対応済みだったはずの内容。

実際にやったこととして、

環境変数`RAILS_SERVE_STATIC_FILES`に値を入れて、.present?メソッドの返り値がtrueとなるように設定

もしくは`ENV['RAILS_SERVE_STATIC_FILES'].present?`の部分をただ、trueに書き換えても、動作する。

## 実際の原因

systemdを使った起動に問題がありました。

　systemdを使った、systemctlコマンドによるデーモンとしてpumaの起動を行う際には、**動作環境の環境変数は読み込まれない。**

そのため、本番用のEC2の環境変数に指定していた`RAILS_SERVE_STATIC_FILES`がnilで、前述のrailsの設定ファイルが動作しなかった。

# 対応

railsコードを書き換えても良いのですが、せっかくなのでsystemdに慣れるためにも、unit(systemdで設定する処理(サービス)の単位)の設定ファイルにて、環境変数を埋め込んでみよう。

以下のコマンドで、当該ファイルの編集を行う。

```Bash
# remoteの本番環境
$ vim /etc/systemd/system/puma_recorda-me_production.service

$ vim /etc/systemd/system/puma_recorda-me_production.socket
```

```Bash
# /etc/systemd/puma_recorda-me_production.socket
# /etc/systemd/puma_recorda-me_production.socket


# 以下の記述を追加します。
Environment="RAILS_SERVE_STATIC_FILES=true"
```