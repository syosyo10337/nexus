---
tags:
  - docker
  - dockerfile
  - compose
  - container
created: 2026-01-03
updated: 2026-02-05
status: active
---

# docker-compose の書き方

Docker Compose と呼ばれる docker の機能を使って、複数のコンテナを実行できるようにする。docker-compose.yml はそのための設定ファイルで、これによってコマンドで行っていた実行構成(-p 等)を設定ファイルとして管理できるようになる。

e.g.)

```YAML
version: '3.7' #docker-composeのバージョンを指定

services: #起動するコンテナを定義する
  nginx:  #1
    build: #docker buildの実行情報を記述する.そのビルドしたイメージ使用してコンテナを起動します。#imageもしくはbuildを記述する必要がある。
      context: .
      dockerfile: docker/nginx/Dockerfile # コマンドで言うところの
																					# docker build -f docker/nginx/Dockerfile .
    volumes: #volumeのマウントを行う コマンドだと$(pwd)/public:/var/www/html/public:ro <IMAGE ID>
      - ./public:/var/www/html/public:ro
    ports: #ポートの開放 <hostポート>:<コンテナのポート>
      - 8080:80
    environment: #環境変数を定義する
      PHP_HOST: app

  app: #2
    build:
      context: .
      dockerfile: Dockerfile
      env_file:
      - .env.example
    # volumes:
    #   - .:/var/www/html:cached

  mysql: #3
    image: mysql:5.7 #コンテナを起動するイメージを指定する
    volumes:
      - ./mysql:/var/lib/mysql:delegated
    command: mysqld --character-set-server=utf8mb4 --collation-server=utf8mb4_general_ci
    environment:
      MYSQL_ALLOW_EMPTY_PASSWORD: 'yes'
    ports:
      - 13306:3306
```

[

docker-compose

プロジェクトで Docker を使用する際、まず使用するであろう docker-compose を紹介します。 docker-compose はローカルで Docker のオーケストレーションを行うためのツールです。 Docker のビルドから Network や Volume の管理をコードベースで定義して行ってくれます。 docker-compose は Docker の構成を yaml を定義し、その yaml を元に起動します。 例えば nginx を起動し、ホストの 8080 ポートへコンテナの 80 ポートをフォワードする設定は以下の yaml になります。 docker run -p 8080:80 nginx とほぼ同じ動きをします(異なる点としては、docker-compose では専用の Network を作成・使用する点です)。 単純な nginx の起動であれば素の docker コマンドで問題ありませんが、ここに PHP, MySQL...と増えていくとその威力を発揮します。 雰囲気を知るために上記のような 3 つのコンテナを協調させて動かしてみましょう。 $ git clone https://github.com/y-ohgi/introduction-docker.git $ cd introduction-docker/handson/laravel $ docker-compose up Play with Docker 上へポートが公開されるので、ブラウザで確認してみましょう。 起動した Laravel リポジトリの Dockerfile をもとに、docker-compose.yaml の書き方を学びましょう。 docker-compose のバージョンを指定します。 特にこだわりがなければ最新のものを記述するようにしましょう。 起動するコンテナの定義を行います。 この docker-compose.yaml では nginx , app , mysql の 3 つが定義されています。 image コンテナを起動する Docker Image を指定します。 build docker build の実行情報を記述します。 ここで定義された情報を元に Docker をビルドし、そのビルドしたイメージ使用してコンテナを起動します。 image もしくは build どちらかを記述する必要があります。 コマンドの場合、 docker build -f docker/nginx/Dockerfile .

<https://y-ohgi.com/introduction-docker/3_production/docker-compose>

docker-compose

docker-compose でよく使う Tips 集です。 一般的に Docker のベストプラクティスにのっとった設計をすると環境変数で各種パラメータの定義が重要になってきます。 例えば MySQL のパスワードや各種接続情報や秘匿情報など、環境によって変更されるものは基本的にコンテナ起動時に環境変数で定義します。 docker-compose を使用した場合どのような方法で定義するのか、代表的な 4 つの方法を紹介します。 $ docker-compose up -e MYSQL_PASSWORD=mypassword version: '3.7' services: app: build: . + environment: + - MYSQL_PASSWORD=mypassword docker-compose.yaml version: '3.7' services: app: build: . environment: - - MYSQL_PASSWORD=mypassword + - MYSQL_PASSWORD=${MYSQL_PASSWORD} $ export MYSQL_PASSWORD=mypassword $ docker-compose up docker-compose.yaml version: '3.7' services: app: build: .

![](favicon%202.png)https://y-ohgi.com/introduction-docker/4_tips/docker-compose/

](https://y-ohgi.com/introduction-docker/4_tips/docker-compose/)

### compose ファイルの書き方

---

```YAML
# e.g.)

version: "3" # docker-compose.yamlファイルのフォーマットのバージョン指定
services: #　コンテナの定義を書く
  echo: # (serviceの名前)
    image: example/echo:latest # Dockerイメージ
    ports: # -pオプションと同義、portforwadingの指定
      - 9000:8080
```

```Bash
# 上のdocker-compose.ymlは以下と同義です。
$ docker container run -d -p 9000:8080 example/echo:latest
```

docker-compose.yml を作成したディレクトリ上で、`docker-compose up -d`コマンドを実行して、定義をもとにコンテナ群を起動する。

cf)

[🐭Docker コマンドチートシート](Docker%E3%82%B3%E3%83%9E%E3%83%B3%E3%83%89%E3%83%81%E3%83%BC%E3%83%88%E3%82%B7%E3%83%BC%E3%83%88%20f5e6db7a763e4004b02b45ab27c31fe9.html)

## テンプレート

---

```YAML
version: '3.8'

services:
  [service_name]:
    build: [context_path]
    image: [image_name]:[tag_name]
    container_name: [container_name]
    command: [command]
    environment:
      [variable_name]: [value]
    volumes:
      - [volume_name]:[container_directory_path]:[mode]
      - [host_directory_path]:[container_directory_path]:[mode]
      - type: volume
        source: [volume_name]
        target: [container_directory_path]
      - type: bind
        source: [host_directory_path]
        target: [container_directory_path]
    networks:
      - [network_name]
    ports:
      - '[host_port]:[container_port]'
    tty: [boolean]
    restart: [restart_policy]
    depends_on:
      - [other_service_name]
  [other_service_name]:
    ...

volumes:
  [volume_name]:

networks:
  [network_name]:
```

## build 属性

---

Compose 機能では、既存の Docker イメージを image 属性に指定して実行するだけでなく、build 属性を使って、イメージのビルドと同時に複数コンテナを起動することができる。

build 属性には、Dockerfile が存在するディレクトリの相対パスを指定します。

## links 属性

---

この属性を利用すると他の service 群にあるコンテナ名を指定して、通信できるようになる。

```YAML
e.g.)
version: "3"
services:
  master:
    container_name: master
    image: jenkinsci/jenkins:2.142-slim
    ports:
      - 8080:8080
    volumes:
      - ./jenkins_home:/var/jenkins_home
    links:
      - slave01  #この部分で後述のslave01サービスで作成されるslve01コンテナと通信できる。

  slave01:
    container_name: slave01
    image: jenkinsci/ssh-slave
    environment:
        - JENKINS_SLAVE_SSH_PUBKEY=ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQ
```

## context 属性

---

まず、docker における build context とは

カレントなワーキングディレクトリのこと。 デフォルトで Dockerfile は、カレントなワーキングディレクトリにあるものとみなされます。 ただしファイルフラグ（-f）を使って別のディレクトリとすることもできます。 Dockerfile が実際にどこにあったとしても、カレントディレクトリ配下にあるファイルやディレクトリの内容がすべて、ビルドコンテキストとして Docker デーモンに送られることになります。

build する際にどこのディレクトリから、Dockerfile を読み込むかを設定できる属性に当たる。単体でビルドする際には、cd して自らコンテキストを移動すればよいので問題はないが、

docker-compose を利用する際には、あるサービスのための Dockerfile の中に、../nginx/xxx などとコンテキストを外れる記述があると、そのディレクトリに移動して compose しようとしてもエラーになる。

### ベストプラクティス

docker-compose の際には、context と dockerfile を適宜設定するとよい。

また、context .（docker-compose.yml があるディレクトリ)で指定した、このコンテキストディレクトリはイメージをビルドするたびにパッケージ化されるので小さく保つのがよい。

```YAML
build:
	context: .
	dockerfile: ./docker/nginx/Dockerfile # 読み込みたいDockerfileを直接指定する。
```

cf）

[

docker-compose.yml の build 設定はとりあえず context も dockerfile も埋めとけって話 - Qiita

docker-compose を使った開発では以下の 2 つのディレクトリ構成になっていることが多いです。 Docker の コンテキスト という概念を知っていないと、ディレクトリ構成が違うだけで何度も コンテキスト周りのエラーで悩まされることがあります(1 敗)。 なので自分的結論を出してみました。 docker-compose を使った開発では のように Dockerfile があるディレクトリを指定するだけでなく のようにコンテキストをルートディレクトリに指定して、Dockerfile の場所も直接指定しておけばお k docker build コマンドを実行したときの、カレントなワーキングディレクトリのことを ビルドコンテキスト（build context）と呼びます。 デフォルトで Dockerfile は、カレントなワーキングディレクトリにあるものとみなされます。 ただしファイルフラグ（-f）を使って別のディレクトリとすることもできます。 Dockerfile が実際にどこにあったとしても、カレントディレクトリ配下にあるファイルやディレクトリの内容がすべて、ビルドコンテキストとして Docker デーモンに送られることになります。 Dockerfile 記述のベストプラクティス これをさらに要約すれば 「docker build コマンドを実行した場所」ってことですね。 docker build コマンドを実行した場所ってことなので、 docker build コマンドは Dockerfile があるディレクトリで実行すれば問題なさそうですね。 しかし、 docker-compose コマンドを使って開発している場合はどうでしょうか？ Dockerfile があるディレクトリでコマンドを実行することってほとんど無いと思います。その場合はコンテキストについてどう考えればいいのでしょうか？ 例として「Laravel, Nginx」というよくあるプロジェクトの構成で考えてみます。 ディレクトリ構成は以下の様になります。 このディレクトリ構成の場合、 api/Dockerfile と nginx/Dockerfile のコンテキストはそれぞれどこになるか分かりますか？ docker build コマンドを実行する api/、 nginx/ ディレクトリ？ nginx/ディレクトリがコンテキストだとすると nginx/Dockerfile は以下のようになります。 以下の 1 文に注目してください。コンテキストが nginx/なのに、 ../api/public で分かる通り、コンテキストのディレクトリから外れたファイルを参照していますね。 このまま実行すると のようなエラーが出ます。 Docker はコンテキスト(カレントディレクトリ)の外のファイルにはアクセスできない仕様なのです。そこら辺に関しては以下の記事で詳しく説明されています。 ではどうやって nginx/のコンテキストから api/のファイルにアクセスすればいいのでしょうか？ 答えは簡単です。 コンテキストをルートディレクトリにすればいいのです docker-compose.yml で「コンテキスト」と「Dockerfile のある場所」を直接指定してみましょう。 コンテキストはどちらのサービスも で docker-compose.yml があるルートディレクトリに設定。 Dockerfile の場所は でそれぞれ指定。 では次に docker というディレクトリを作って、その中に各サービスの Dockerfile をまとめた構成を考えてみます。 先ほどと同様にコンテキストを docker/php や docker/nginx と考えた場合、どうやってもうまくいきません。 このディレクトリ構成の場合は、そもそも Dockerfile からコンテキスト外のサービスのファイル群が入っている api/と nginx/ に一切アクセスできません。 ここでも同様 docker-compose.yml でコンテキストをルートディレクトリに、Dockerfile の位置も直接指定する必要がありそうです。 ルートディレクトリを Docker のコンテキストにすることで、Dockerfile はどんなファイルにもアクセスできるようになりました。 一方で、 build 時はその分 Docker デーモンという奴にそれだけ多くのファイルを送ることになるので遅くなることがあるようです。

![](Docker/Attachments/production-c620d3e403342b1022967ba5e3db1aaa%202.ico)https://qiita.com/sam8helloworld/items/e7fffa9afc82aea68a7a

![](Docker/Attachments/article-ogp-background-9f5428127621718a910c8b63951390ad%202.png)](https://qiita.com/sam8helloworld/items/e7fffa9afc82aea68a7a)

[https://matsuand.github.io/docs.docker.jp.onthefly/develop/develop-images/dockerfile_best](https://matsuand.github.io/docs.docker.jp.onthefly/develop/develop-images/dockerfile_best-practices/#%E3%83%93%E3%83%AB%E3%83%89%E3%82%B3%E3%83%B3%E3%83%86%E3%82%AD%E3%82%B9%E3%83%88%E3%81%AE%E7%90%86%E8%A7%A3)
