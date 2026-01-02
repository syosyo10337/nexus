 

# docker-composeの書き方

---

[composeファイルの書き方](#514d9971-c61d-40ad-9274-f1b92d62afcc)

[テンプレート](#b79c32a3-51b0-4692-b849-513529de0104)

[build属性](#f859f183-9618-42d0-b148-1143641ee4cc)

[links属性](#49c1091f-ff5a-4644-90e1-bf97d3a0dbf8)

[context属性](#a2dab7a7-2a58-4c74-8e33-d6a668b56b30)

[ベストプラクティス](#8d004897-0bac-4602-b4a4-950427c177ce)

Docker Composeと呼ばれるdockerの機能を使って、複数のコンテナを実行できるようにする。docker-compose.ymlはそのための設定ファイルで、これによってコマンドで行っていた実行構成(-p等)を設定ファイルとして管理できるようになる。

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

プロジェクトでDockerを使用する際、まず使用するであろうdocker-composeを紹介します。 docker-composeはローカルでDockerのオーケストレーションを行うためのツールです。 DockerのビルドからNetworkやVolumeの管理をコードベースで定義して行ってくれます。 docker-composeはDockerの構成をyamlを定義し、そのyamlを元に起動します。 例えばnginxを起動し、ホストの8080ポートへコンテナの80ポートをフォワードする設定は以下のyamlになります。 docker run -p 8080:80 nginx とほぼ同じ動きをします(異なる点としては、docker-composeでは専用のNetworkを作成・使用する点です)。 単純なnginxの起動であれば素のdockerコマンドで問題ありませんが、ここにPHP, MySQL...と増えていくとその威力を発揮します。 雰囲気を知るために上記のような3つのコンテナを協調させて動かしてみましょう。 $ git clone https://github.com/y-ohgi/introduction-docker.git $ cd introduction-docker/handson/laravel $ docker-compose up Play with Docker上へポートが公開されるので、ブラウザで確認してみましょう。 起動したLaravelリポジトリのDockerfileをもとに、docker-compose.yamlの書き方を学びましょう。 docker-composeのバージョンを指定します。 特にこだわりがなければ最新のものを記述するようにしましょう。 起動するコンテナの定義を行います。 このdocker-compose.yamlでは nginx , app , mysql の3つが定義されています。 image コンテナを起動するDocker Image を指定します。 build docker buildの実行情報を記述します。 ここで定義された情報を元にDockerをビルドし、そのビルドしたイメージ使用してコンテナを起動します。 image もしくは build どちらかを記述する必要があります。 コマンドの場合、 docker build -f docker/nginx/Dockerfile .

![](favicon%202.png)https://y-ohgi.com/introduction-docker/3_production/docker-compose/



](https://y-ohgi.com/introduction-docker/3_production/docker-compose/)

[

docker-compose

docker-composeでよく使うTips集です。 一般的にDockerのベストプラクティスにのっとった設計をすると環境変数で各種パラメータの定義が重要になってきます。 例えばMySQLのパスワードや各種接続情報や秘匿情報など、環境によって変更されるものは基本的にコンテナ起動時に環境変数で定義します。 docker-composeを使用した場合どのような方法で定義するのか、代表的な4つの方法を紹介します。 $ docker-compose up -e MYSQL_PASSWORD=mypassword version: '3.7' services: app: build: . + environment: + - MYSQL_PASSWORD=mypassword docker-compose.yaml version: '3.7' services: app: build: . environment: - - MYSQL_PASSWORD=mypassword + - MYSQL_PASSWORD=${MYSQL_PASSWORD} $ export MYSQL_PASSWORD=mypassword $ docker-compose up docker-compose.yaml version: '3.7' services: app: build: .

![](favicon%202.png)https://y-ohgi.com/introduction-docker/4_tips/docker-compose/



](https://y-ohgi.com/introduction-docker/4_tips/docker-compose/)

### composeファイルの書き方

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

docker-compose.ymlを作成したディレクトリ上で、`docker-compose up -d`コマンドを実行して、定義をもとにコンテナ群を起動する。

cf)

[🐭Dockerコマンドチートシート](Docker%E3%82%B3%E3%83%9E%E3%83%B3%E3%83%89%E3%83%81%E3%83%BC%E3%83%88%E3%82%B7%E3%83%BC%E3%83%88%20f5e6db7a763e4004b02b45ab27c31fe9.html)

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

## build属性

---

Compose機能では、既存のDockerイメージをimage属性に指定して実行するだけでなく、build属性を使って、イメージのビルドと同時に複数コンテナを起動することができる。

build属性には、Dockerfileが存在するディレクトリの相対パスを指定します。

## links属性

---

この属性を利用すると他のservice群にあるコンテナ名を指定して、通信できるようになる。

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

## context属性

---

まず、dockerにおけるbuild contextとは

カレントなワーキングディレクトリのこと。 デフォルトで Dockerfile は、カレントなワーキングディレクトリにあるものとみなされます。 ただしファイルフラグ（-f）を使って別のディレクトリとすることもできます。 Dockerfile が実際にどこにあったとしても、カレントディレクトリ配下にあるファイルやディレクトリの内容がすべて、ビルドコンテキストとして Docker デーモンに送られることになります。

buildする際にどこのディレクトリから、Dockerfileを読み込むかを設定できる属性に当たる。単体でビルドする際には、cdして自らコンテキストを移動すればよいので問題はないが、

docker-composeを利用する際には、あるサービスのためのDockerfileの中に、../nginx/xxxなどとコンテキストを外れる記述があると、そのディレクトリに移動してcomposeしようとしてもエラーになる。

### ベストプラクティス

docker-composeの際には、contextとdockerfileを適宜設定するとよい。

また、context .（docker-compose.ymlがあるディレクトリ)で指定した、このコンテキストディレクトリはイメージをビルドするたびにパッケージ化されるので小さく保つのがよい。

```YAML
build:
	context: .
	dockerfile: ./docker/nginx/Dockerfile # 読み込みたいDockerfileを直接指定する。
```

cf）

[

docker-compose.ymlのbuild設定はとりあえずcontextもdockerfileも埋めとけって話 - Qiita

docker-composeを使った開発では以下の2つのディレクトリ構成になっていることが多いです。 Dockerの コンテキスト という概念を知っていないと、ディレクトリ構成が違うだけで何度も コンテキスト周りのエラーで悩まされることがあります(1敗)。 なので自分的結論を出してみました。 docker-compose を使った開発では のようにDockerfileがあるディレクトリを指定するだけでなく のようにコンテキストをルートディレクトリに指定して、Dockerfileの場所も直接指定しておけばおk docker build コマンドを実行したときの、カレントなワーキングディレクトリのことを ビルドコンテキスト（build context）と呼びます。 デフォルトで Dockerfile は、カレントなワーキングディレクトリにあるものとみなされます。 ただしファイルフラグ（-f）を使って別のディレクトリとすることもできます。 Dockerfile が実際にどこにあったとしても、カレントディレクトリ配下にあるファイルやディレクトリの内容がすべて、ビルドコンテキストとして Docker デーモンに送られることになります。 Dockerfile 記述のベストプラクティス これをさらに要約すれば 「docker buildコマンドを実行した場所」ってことですね。 docker build コマンドを実行した場所ってことなので、 docker build コマンドはDockerfileがあるディレクトリで実行すれば問題なさそうですね。 しかし、 docker-compose コマンドを使って開発している場合はどうでしょうか？ Dockerfileがあるディレクトリでコマンドを実行することってほとんど無いと思います。その場合はコンテキストについてどう考えればいいのでしょうか？ 例として「Laravel, Nginx」というよくあるプロジェクトの構成で考えてみます。 ディレクトリ構成は以下の様になります。 このディレクトリ構成の場合、 api/Dockerfileと nginx/Dockerfileのコンテキストはそれぞれどこになるか分かりますか？ docker buildコマンドを実行する api/、 nginx/ ディレクトリ？ nginx/ディレクトリがコンテキストだとすると nginx/Dockerfile は以下のようになります。 以下の1文に注目してください。コンテキストが nginx/なのに、 ../api/public で分かる通り、コンテキストのディレクトリから外れたファイルを参照していますね。 このまま実行すると のようなエラーが出ます。 Dockerはコンテキスト(カレントディレクトリ)の外のファイルにはアクセスできない仕様なのです。そこら辺に関しては以下の記事で詳しく説明されています。 ではどうやって nginx/のコンテキストから api/のファイルにアクセスすればいいのでしょうか？ 答えは簡単です。 コンテキストをルートディレクトリにすればいいのです docker-compose.yml で「コンテキスト」と「Dockerfileのある場所」を直接指定してみましょう。 コンテキストはどちらのサービスも で docker-compose.yml があるルートディレクトリに設定。 Dockerfileの場所は でそれぞれ指定。 では次に docker というディレクトリを作って、その中に各サービスのDockerfileをまとめた構成を考えてみます。 先ほどと同様にコンテキストを docker/phpや docker/nginxと考えた場合、どうやってもうまくいきません。 このディレクトリ構成の場合は、そもそもDockerfileからコンテキスト外のサービスのファイル群が入っている api/と nginx/ に一切アクセスできません。 ここでも同様 docker-compose.yml でコンテキストをルートディレクトリに、Dockerfileの位置も直接指定する必要がありそうです。 ルートディレクトリをDockerのコンテキストにすることで、Dockerfileはどんなファイルにもアクセスできるようになりました。 一方で、 build 時はその分Dockerデーモンという奴にそれだけ多くのファイルを送ることになるので遅くなることがあるようです。

![](Docker/Attachments/production-c620d3e403342b1022967ba5e3db1aaa%202.ico)https://qiita.com/sam8helloworld/items/e7fffa9afc82aea68a7a

![](Docker/Attachments/article-ogp-background-9f5428127621718a910c8b63951390ad%202.png)](https://qiita.com/sam8helloworld/items/e7fffa9afc82aea68a7a)

[https://matsuand.github.io/docs.docker.jp.onthefly/develop/develop-images/dockerfile_best](https://matsuand.github.io/docs.docker.jp.onthefly/develop/develop-images/dockerfile_best-practices/#%E3%83%93%E3%83%AB%E3%83%89%E3%82%B3%E3%83%B3%E3%83%86%E3%82%AD%E3%82%B9%E3%83%88%E3%81%AE%E7%90%86%E8%A7%A3)