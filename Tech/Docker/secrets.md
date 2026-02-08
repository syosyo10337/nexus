---
tags:
  - docker
  - dockerfile
  - compose
  - container
  - secret
created: 2026-02-05
status: active
---

# Secrets とは

パスワード、証明書、API キーといった種類のデータを扱うものであり、ネットワークを介して送信することが不適切であったり、Dockerfile 内やアプリケーションソースコード内に暗号化せずにそのまま保存することが不適切であるような、あらゆるデータを指します。

Docker Compose では機密情報を保存する先として環境変数を用いることなく、別の方法を提供しています。 パスワードや API キーを環境変数に設定すると、意図しない情報漏洩のリスクにさらされるからです。 サービスが機密情報にアクセスできるのは、トップレベルの services 内において secrets 属性によって明示的に許可された場合のみです。

環境変数は場合によっては全プロセスからの利用が可能であるため、アクセスをすべて追跡することは困難です。 また感知していないところで、エラーデバッグを行う際に出力されてしまうかもしれません。 Secrets を利用すれば、こういったリスクは軽減されます。

## Secrets の利用

secret はコンテナー内部において /run/secrets/<secret_name> 内のファイルとしてマウントします。

### Single-service secret injection

以下の利用例では、フロントエンドサービスにおいて MY_SECRET という secret へのアクセス権が与えられています。 このコンテナーでは ./my_secret.txt のファイル内容が /run/secrets/MY_SECRET に設定されます。

```yaml
services:
  myapp:
    image: myapp:latest
    secrets:
      - MY_SECRET
secrets:
  MY_SECRET:
    file: ./my_secret.txt
```

### Multi-service secret sharing and password management

```yaml
services:
  db:
    image: mysql:latest
    volumes:
      - db_data:/var/lib/mysql
    environment:
      MYSQL_ROOT_PASSWORD_FILE: /run/secrets/db_root_password
      MYSQL_DATABASE: wordpress
      MYSQL_USER: wordpress
      MYSQL_PASSWORD_FILE: /run/secrets/db_password
    secrets:
      - db_root_password
      - db_password

  wordpress:
    depends_on:
      - db
    image: wordpress:latest
    ports:
      - "8000:80"
    environment:
      WORDPRESS_DB_HOST: db:3306
      WORDPRESS_DB_USER: wordpress
      WORDPRESS_DB_PASSWORD_FILE: /run/secrets/db_password
    secrets:
      - db_password

secrets:
  db_password:
    file: db_password.txt
  db_root_password:
    file: db_root_password.txt

volumes:
  db_data:
```

### secret のビルド

以下の利用例では npm_token という secret がビルド時に利用可能となるようにしています。 その値は環境変数 NPM_TOKEN から取得されます。

````yaml
services:
  myapp:
    build:
      secrets:
        - npm_token
      context: .

secrets:
  npm_token:
    environment: NPM_TOKEN
```

### 参考

https://matsuand.github.io/docker.docs-ja/compose/how-tos/use-secrets/
````
