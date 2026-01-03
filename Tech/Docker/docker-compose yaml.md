---
tags:
  - docker
  - dockerfile
  - compose
  - container
created: 2026-01-03
status: active
---

# docker-compose.yaml

---

docker-compose.ymlのサンプル

```YAML
version: "3"
services:
  db:
    # コンテナ名の指定
    container_name: rails_todo_db
    # イメージの指定
    image: postgres:14.2-alpine
    # データの永続化（ホスト側のtmp/dbディレクトリにマウントする）
    volumes:
      - ./tmp/db:/var/lib/postgresql/data
    # 環境変数の指定（初期設定値）
    environment:
      POSTGRES_PASSWORD: password
  web:
    # コンテナ名の指定
    container_name: rails_todo_web
    # Dockerfile のあるディレクトリのパスを指定（imageかbuildを必ず指定する必要がある）
    build: .
    # デフォルトのコマンド指定（Rails特有の問題解消とRails立ち上げを指定している）
		# bash -c はバッシュ"コマンド"を引数に取り、そのコマンドを実行する
		#rails -bは
    command: bash -c "rm -f tmp/pids/server.pid && bundle exec rails s -p 3000 -b '0.0.0.0'"
    # データの永続化（ホスト側のカレントディレクトリにマウントする）
    volumes:
      - .:/myapp
    # ポートの指定（外部からのアクセス時のポート：Dockerコンテナからアクセス時のポート）
    ports:
      - "3000:3000"
    # 依存関係の指定（dbが起動した後に、webが起動するようになる）
    depends_on:
      - db
```

cf) rails server -b “0.0.0.0” バインディングアドレスの指定について

[https://pikawaka.com/rails/rails-s](https://pikawaka.com/rails/rails-s)

[https://qiita.com/Masato338/items/f162394fbc37fc490dfb](https://qiita.com/Masato338/items/f162394fbc37fc490dfb)

もしくは自身のZennを見ろ

# 上書きする

[

Docker Compose の設定は上書きできる - Qiita

知っておくとちょっと便利な Docker Compose の Tips。Docker Compose の設定は上書きできるdocker compose コマンドの実行時に -f (もしくは --…

![](Docker/Attachments/production-c620d3e403342b1022967ba5e3db1aaa%201.ico)https://qiita.com/hoto17296/items/a8a85d5244f46c119278

![](advent-calendar-ogp-background-f625e957b80c4bd8dd47b724be996090.jpeg)](https://qiita.com/hoto17296/items/a8a85d5244f46c119278)