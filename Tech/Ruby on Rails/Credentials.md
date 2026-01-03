---
tags:
  - rails
  - view
  - config
created: 2026-01-03
status: active
---

# Credentials

**production環境用の秘密情報のこと**です。秘密情報そのものを指したり管理する仕組みを指したりします。

Railsは機密情報ををcredentialファイル（`config/credentials.yml.enc`）に保存します。

このファイルは暗号化されているため直接編集できません

credentialファイルには、デフォルトでアプリケーションの`secret_key_base`が含まれますが、

外部API向けのアクセスキーなどのcredentialも追加することもできます。

credentialファイルを編集するには、

`bin/rails　credentials:edit`を実行します。

（なんかエディタも直接指定しないといけないっぽいです。

`EDITOR='vi' bundle exec rails credentials:edit`　）

credentialファイルが存在しない場合は作成され、マスターキーが定義されていない場合は`config/master.key`ファイルも作成されます。(Rails 5.2以降の環境だとデフォルトで生成されるはず)

credentialファイル内の秘密情報には`Rails.application.credentials`に対してメッセージを渡すとアクセスできます。

```YAML
e.g.)
# database.ymlなどでこのように参照する

username: <%= Rails.application.credentials.db[:user_name] %>
```

たとえば、`config/credentials.yml.enc`ファイルを復号した内容(`config /credentials.yml`)と以下のようになっている。

編集するには、`bin/rails　credentials:edit`を実行します。

```Ruby
secret_key_base: 3b7cd72...
some_api_key: SOMEKEY
system:
  access_key_id: 1234AB
```

cf)

[

webサーバ、アプリケーションサーバの設定｜【2021年リライト版】 世界一丁寧なAWS解説。EC2を利用して、RailsアプリをAWSにあげるまで

【2021年リライト版】 世界一丁寧なAWS解説。EC2を利用して、RailsアプリをAWSにあげるまで

![](logo-transparent%201.png)https://zenn.dev/naoki_mochizuki/books/1471ce20222227/viewer/a8575a#1.%E3%82%A8%E3%83%B3%E3%83%89%E3%83%9D%E3%82%A4%E3%83%B3%E3%83%88%E3%81%AE%E7%A2%BA%E8%AA%8D

![](Ruby%20on%20Rails/Attachments/og-base-book_yz4z02.jpeg)](https://zenn.dev/naoki_mochizuki/books/1471ce20222227/viewer/a8575a#1.%E3%82%A8%E3%83%B3%E3%83%89%E3%83%9D%E3%82%A4%E3%83%B3%E3%83%88%E3%81%AE%E7%A2%BA%E8%AA%8D)