 

# AWSインフラ本格入門。環境変数の在処

①rails secret(暗号化された秘密鍵を生成)するコマンドで得た情報を遠隔webサーバーの環境変数に格納している。

```Ruby
export SECRET_KEY_BASE=作成したシークレットキー
```

[秘密鍵、秘密情報について](../Ruby%20on%20Rails/Credentials%200dcd0e8a627542b5857cb8a7da0bd7b4.html)

②dastabase.ymlにて各環境におけるDBの設定が書かれているが、その時にその設定ファイルに直接開発環境のDBにログインするパスワードを書いてはいけないので、webサーバーの環境変数にパスワードを保存するため。

ここでは、'AWS_INTRO_SAMPLE_DATABASE_PASSWORD'と命名している。

```Ruby
# database.ymlの例
default: &default
  adapter: mysql2
  encoding: utf8
  pool: <%= ENV.fetch("RAILS_MAX_THREADS") { 5 } %>
  username: root
  password:
  socket: /tmp/mysql.sock

development:
  <<: *default
  database: sample_app_development

# Warning: The database defined as "test" will be erased and
# re-generated from your development database when you run "rake".
# Do not set this db to the same as development or production.
test:
  <<: *default
  database: sample_app_test

# As with config/secrets.yml, you never want to store sensitive information,
# like your database password, in your source code. If your source code is
# ever seen by anyone, they now have access to your database.
#
# Instead, provide the password as a unix environment variable when you boot
# the app. Read http://guides.rubyonrails.org/configuring.html#configuring-a-database
# for a full rundown on how to provide these environment variables in a
# production deployment.
#
# On Heroku and other platform providers, you may have a full connection URL
# available as an environment variable. For example:
#
#   DATABASE_URL="mysql2://myuser:mypass@localhost/somedatabase"
#
# You can use this database configuration with:
#
#   production:
#     url: <%= ENV['DATABASE_URL'] %>
#
production:
  <<: *default
  database: sample_app
  username: sample_app
  password: <%= ENV['AWS_INTRO_SAMPLE_DATABASE_PASSWORD'] %>
  host: db.home
```

```Ruby
export AWS_INTRO_SAMPLE_DATABASE_PASSWORD=設定したパスワード 
```

③config/environments/production.rbでの、メール送信に関する設定のための環境変数たちとキャッシュストア

```Ruby
# 送信するメールのホストになる。
export AWS_INTRO_SAMPLE_HOST=ロードバランサーにつけたCNAME 
# メールのための設定たち
export AWS_INTRO_SAMPLE_SMTP_DOMAIN=Amazon SESのドメイン
export AWS_INTRO_SAMPLE_SMTP_ADDRESS=Amazon SESのアドレス
export AWS_INTRO_SAMPLE_SMTP_USERNAME=SMTPユーザー
export AWS_INTRO_SAMPLE_SMTP_PASSWORD=SMTPパスワード

# config.cache_store = :redis_store, ENV['AWS_INTRO_SAMPLE_REDIS_ADDRESS']の部分の記述で使うため
export AWS_INTRO_SAMPLE_REDIS_ADDRESS=ElastiCacheのアドレス

```

④cofig/initializer/carrier_wave.rbの中でS３についての設定をする時のための変数

```Ruby
export AWS_INTRO_SAMPLE_S3_REGION=画像保存用のS3があるリージョン 

export AWS_INTRO_SAMPLE_S3_BUCKET=画像保存用のS3のバケット
```

[

aws-intro-sample/config at master · nakaken0629/aws-intro-sample

Rails Tutorial for AWS Intro. Contribute to nakaken0629/aws-intro-sample development by creating an account on GitHub.

![](AWS/Attachments/favicon.ico)https://github.com/nakaken0629/aws-intro-sample/tree/master/config

![](AWS/Attachments/aws-intro-sample.png)](https://github.com/nakaken0629/aws-intro-sample/tree/master/config)