---
tags:
  - docker
  - dockerfile
  - compose
  - container
created: 2026-01-03
status: active
---

🐭

# Dockerコマンドチートシート

[イメージを操作するためのコマンド](#cfa4ee63-39fd-4c3e-9791-99a6651764b8)

[Dockerfileから、docker imageをビルドする。](#8b6a093b-ef85-419e-abff-a5cd0b00b81b)

[イメージの検索](#17d20b08-eba8-47a5-aff0-41ccbca11225)

[イメージIDにエイリアス（tag）をつける](#62a2110a-321c-4588-a303-1afff27af583)

[イメージをレジストリに公開する](#5249d697-66a9-404c-ba23-10acbed598ab)

[コンテナを操作するコマンド](#207071ae-1f37-42a5-b2f0-0c76b86c002c)

[コンテナの起動](#d804860d-54cb-4270-a380-e60e3760e00e)

[名前付きコンテナ](#cbc613c3-9088-4808-8304-2d3b5513a01f)

[{頻出}container run オプション](#13800cd2-a9bd-4f25-9727-298300c13fb2)

[コンテナ一覧表示](#31f4fee2-ec82-4681-a921-539c68179009)

[コンテナの停止/再起動/廃棄](#551bc8e4-33bd-4e51-9213-7857c6bfa4f1)

[コンテナを操作するコマンド](#236cb1be-6a52-4d94-84ad-4e3095c88c00)

[コンテナとホスト間でファイルを共有する。](#7afda585-28c1-47ec-b9e3-b3be5932373f)

[コンテナ関連のデバッグに用いるコマンド](#0f064295-2e90-4912-b9dc-9e9a40af6497)

[コンテナ/イメージの運用管理に関するコマンド](#d9cf969f-5b87-4675-a11b-6b5b40ae24fb)

[Docker Composeに関するコマンド](#91e52b23-0ae1-4540-b8b4-583a278dc258)

[関連コマンド](#10b299d0-9c78-493e-a67e-b140e8179924)

[Data Volume関連のコマンド](#efa00f79-8dcd-4469-b874-702a6e079fd4)

[Swarm関連](#601208bf-8484-4c50-b3fc-383f7ff97146)

[ログ出力](#c88994cd-5c48-4041-ad29-d0b993875abb)

# イメージを操作するためのコマンド

cf）

[😶‍🌫️イメージ](%E3%82%A4%E3%83%A1%E3%83%BC%E3%82%B8%206ebc02bf76b348d1aca70b744db7064c.html)

```Bash
# dockerhub（レジストリから）イメージを取得
$ docker image pull <イメージ>

#イメージの削除
$ docker rmi <コンテナID>
e.g.)# ローカルにあるイメージを-q(quiet,IDだけ表示する)方式で削除する。
$ docker rmi $(docker images -q)


# ローカル上のイメージ一覧表示(表示されるIMAGE IDはコンテナIDとは別もの）
$ docker image ls
$ docker images



# 中間イメージを見る
$ docker history
```

## Dockerfileから、docker imageをビルドする。

---

```Bash
# 基本書式
$ docker image build -t <イメージ名>[:タグ名] <Dockerfile配置ディレクトリのパス>

# -t <タイトル> でイメージにタイトルをつけられる。必ずつけましょう。
# xxx/で名前空間をイメージ名に含めることができます。
# Dockerfileが配置されたディレクトリ上では　. を使うことができる
# -f オプション。デフォルトのDockerfile以外の命名がされているファイルをもとにビルドしたい時
# --pull オプション。明示的にレジストリからベースイメージを取得する。

e.g.)
$ docker build -t example/echo .
# . はdocker build 実行時のコンテキストの指定です。
# つまり、どこにあるDockerfileをイメージとしてビルドするのか
qq
```

## イメージの検索

---

Docker Hubにある数多のレジストリから、イメージを検索するコマンド

```Bash
$ docker seacrh [option] <検索キーワード>
```

ただし、ここからだとリリースされているイメージのtag についてまでは見れないので、Docker Hubを開いてTagsを参照するか、docker本p52のようにAPIを叩く

## イメージIDにエイリアス（tag）をつける

---

変更があるたびに更新されるイメージIDに対して、タグという形で別名をつけて識別しやすくするためのコマンド。docker imageの名前空間も変更できる。

```Bash
$ docker image tag <元イメージ名>[:タグ] <新イメージ名>[:タグ]

e.g.)
$ docker image tag example/echo:latest example/echo:0.1.0
# 最新:latestだったイメージに対して、:0.1.0というタグを付与している
```

## イメージをレジストリに公開する

---

Docker Hubにpushする。

docker hubは自分が所有している、もしくは所属しているorganizationのレジストリにしかpushすることはできません。

自分の場合にはmasanaotyy

- RegistryとRepository
    
    リポジトリは同じ名前の集まりです。/ gitもレポジトリがあり、格納庫の意
    
    レジストリは docker イメージを保存するサービスです。
    

```Bash
$ docker image push [option] <リポジトリ名>[:タグ]
```

# コンテナを操作するコマンド

---

## コンテナの起動

```Bash
# イメージからコンテナを起動
$ docker container run [option] <イメージ名(リポジトリ)>[:タグ]　[コマンド] [コマンド引数]
$ docker container run [option] <イメージID>　[コマンド] [コマンド引数]
# -d, --detach コンテナをバックグラウンドで実行し、コンテナ ID を表示
# --name コンテナに名前をつける
# docker runと省略も可能
# -p hostport:containerportでポートフォーワードするオプション
# 引数にコマンドを与えてCMDを上書きできる。

e.g.)
$ docker run --name hogehoge ubutntu touch /tmp/hoge.txt
```

cf)ポートファワードについて　

[🪣コンテナ](%E3%82%B3%E3%83%B3%E3%83%86%E3%83%8A%20ed3374b6c64f44dab773142171c200aa.html)

### 名前付きコンテナ

---

```Bash
$ docker container run --name [コンテナ名] [イメージ名][:タグ]
# 同名のコンテナを実行することはできず、既存のコンテナを破棄する必要があるため、
# コンテナのライフサイクルが高速に循環する本番環境ではあまり使われません。
```

docker conta

### {頻出}container run オプション

---

```Bash
# -i 標準入力を受け続けるオプション。シェルに入って入力を受け取る時には必要
# -t 擬似端末（terminal）を有効にする。
# --rm コンテナ終了時にコンテナを破棄します。一度実行したら保持する必要がないものを実行する際に有効
# -v ホストとコンテナ間でディレクトリ、ファイルを共有する際に使う。
```

## コンテナ一覧表示

---

STATUSの項目はUPとEXITEDがあります。

```Bash
#コンテナの一覧表示
# -a オプションで停止中のコンテナも表示
# -q オプションを付与すると、コンテナIDを抽出表示可能です。

# --filiter "フィルター名=値" フィルターには、コンテナ名やイメージ、statusを指定できる
#e.g.)
# --filter "name=値"　コンテナ名を指定して絞り込み検索
# --filter "ancestor=値" 先祖つまり、イメージで指定して絞り込み検索

$ docker container ls --filter "ancestor=example/echo" 
#"ancestor=example/echo"のイメージから作成されたコンテナを検索している。
```

## コンテナの停止/再起動/廃棄

---

```Bash
# コンテナの一時停止
# randomに設定されたコンテナ名の指定も可能
$ docker pause <コンテナID>
$ docker pause <コンテナ名>


# コンテナの停止
$ docker container stop <コンテナID>or<コンテナ名>
e.g.)
# -qオプジョンでIDだけ表示させながら、リストできるコンテナを全て停止
$ docker container stop $(docker container ls -q)


# 一度起動したことのあるのこっているコンテナを再度起動する　
$ docker container restart <コンテナID>or<コンテナ名>


#コンテナの削除
# -f 実行中のコンテナも強制的に削除
$ docker container rm <コンテナID>
# IDだけ表示させながら、リストされるコンテナを全て削除　
$ docker container rm $(docker container ls -aq)






#exitした（stop）のコンテナがあれば、それを削除
$ docker container prune
```

## コンテナを操作するコマンド

---

### コンテナとホスト間でファイルを共有する。

```Bash
# 実行中のコンテナの中に入る \
# コンテナにsshでログインしたかのようにコンテナの内部を操作することができます。
# -itオプション
# -i 標準入力を有効化
# -t 接続端末を表示
$ docker exec [option] <コンテナIDorコンテナ名> <コンテナ内で実行したいコマンド>

#e.g.) Nginxに入り、bashシェルを起動
$ docker exec <コンテナID(Nginxのイメージをもとにしたもの)> bash


#コンテナ間、コンテナ.ホスト間でファイルをコピーできる。COPYはホスト->コンテナへのコピー専用。
$ docker container cp [option] <コンテナIDorコンテナ名>:コンテナ内のコピー元 ホストのコピー先
$ docker container cp [option] ホストのコピー元　<コンテナIDorコンテナ名>:コンテナ内のコピー先

e.g.) #echoコンテナの/echo/main.goディレクトリのファイルをカレントディレクトリにコピー
$ docker container cp echo:/echo/main.go .
```

cf. )

[

Dockerでホストとコンテナ間でのファイルコピー - Qiita

コンテナからホストへのコピー docker cp コマンドが使えます。 # コンテナIDを調べる $ sudo docker ps $ sudo docker cp &lt;コンテナID&gt;:/etc/my.cnf my...

![](Docker/Attachments/apple-touch-icon-ec5ba42a24ae923f16825592efdc356f.png)https://qiita.com/gologo13/items/7e4e404af80377b48fd5

![](Docker/Attachments/article-ogp-background-9f5428127621718a910c8b63951390ad.png)](https://qiita.com/gologo13/items/7e4e404af80377b48fd5)

### コンテナ関連のデバッグに用いるコマンド

---

- コンテナのファイルの中身をホストに移動して確認したい時は、container cp

- コンテナ内の状況確認。ssh接続してremoteの内部を確認するイメージの時は、　container exec

```Bash
# 停止したコンテナからイメージを作成する
$ docker container commit <コンテナ名> <つけたいイメージ名>


# コンテナ起動後、どのファイルが変更されたかを調べる
# Dockerfile記述時のデバッグによく使用します。
$ docker diff <コンテナ名>
e.g.)
$ docker container diff hoge
C /tmp
A /tmp/hoge.txt


# 起動したプロセスの標準出力と標準エラーを見ることができる。
# コンテナ内のアプリがファイルに対して吐き出したログについて見れません。
# -f 標準出力の取得を続けます
# dockerにおけるログとは、コンテナに標準出力されるもの
$ docker logs <コンテナID>
```

# コンテナ/イメージの運用管理に関するコマンド

---

```Bash
# 停止しているすべてのコンテナを破棄する
$ docker container prune [option]

# 使用されてない(実行コンテナのイメージではない)イメージを一括削除(Dockerが自動で判断してくれるそう)
$ docker image prune [option]

#ネットワーク/ボリュームも含めたdockerのリソースを一括で削除してくれる。
$ docker system prune


#コンテナ単位でシステムリソースの利用状況を確認する(unixのtopコマンドのようなもの)
$ docker container stats [options] <表示するコンテナID..>

#cf)コンテナ上での実行中プロセスを確認できるコマンド
$ docker top
```

# Docker Composeに関するコマンド

---

compose はyaml形式の設定ファイルで、複数のコンテナ実行を一括で管理できます。

```Bash
z # up
# カレントディレクトリに存在する docker-compose.yaml を参照してdocker-composeの起動
# --buildオプジョン。明示的にbuild属性に指定されたDockefileをもとにイメージのビルドを行う。(既存であるかに関わらず)
# -d バックグランドで実行する
$ docker-compose up
# Ctrl + cで終了


# down
# カレントディレクトリの docker-compose.yamlで定義されたコンテナを全て停止、削除できる。
# (ContainerとNetworkを削除)
$ docker-compose down
#　Imageも削除
$ docker-compose down --rmi all

#rm
#Volumeを削除
$ docker-compose rm

# 実行中のプロセス(コンテナ)を確認する
# -q |quiet containerIDだけを表示する
# -f |filter 指定された条件のもの表示する。(複数使うことができる)
$ docker-compose ps
```

[

docker-compose

docker-composeでよく使うTips集です。 一般的にDockerのベストプラクティスにのっとった設計をすると環境変数で各種パラメータの定義が重要になってきます。 例えばMySQLのパスワードや各種接続情報や秘匿情報など、環境によって変更されるものは基本的にコンテナ起動時に環境変数で定義します。 docker-composeを使用した場合どのような方法で定義するのか、代表的な4つの方法を紹介します。 $ docker-compose up -e MYSQL_PASSWORD=mypassword version: '3.7' services: app: build: . + environment: + - MYSQL_PASSWORD=mypassword docker-compose.yaml version: '3.7' services: app: build: . environment: - - MYSQL_PASSWORD=mypassword + - MYSQL_PASSWORD=${MYSQL_PASSWORD} $ export MYSQL_PASSWORD=mypassword $ docker-compose up docker-compose.yaml version: '3.7' services: app: build: .

![](Docker/Attachments/favicon%201.png)https://y-ohgi.com/introduction-docker/4_tips/docker-compose/



](https://y-ohgi.com/introduction-docker/4_tips/docker-compose/)

## 関連コマンド

```Bash
# yamlファイルに記述されたbuildするの必要のあるイメージのビルドを行う。
$ docker-compose build 

#特定のサービスを走らせるrun
$ docker-compose run <サービス>

e.g.)
#yamlにbuild属性をつけていたruby3.0.4をもとにしたrails環境を構築する
$ docker-composer run web rails new . --force --no-deps --databbase=mysql
```

[

docker-compose 'up' とか 'build' とか 'start' とかの違いを理解できていなかったのでまとめてみた - Qiita

タイトルのとおりですが、今まで upとか buildの違いをよく理解せず使用していたので、改めてまとめて見たいと思います。 個人的に似ているなと思っている以下のコマンドについて解説していきます。 構築するimageは docker-compose.yml ファイルに定義されているもの、またはDockerfileを参考にして構築します。 build コマンドではimageを構築します。コンテナは作成しません。 キャッシュがあればそちらを優先的に使ってビルドするので、Dockerfileを更新したなどの理由でキャッシュを使いたくない場合は docker-compose build --no-cache とします。 Dockerは一度ビルドするとキャッシュというのが作成されます。ご存知グーグルクロームとかのブラウザにも同じ機能がありますね。キャッシュがあると2回目以降にビルドするときに、速やかに処理をすることができるわけです。 ただ、キャッシュがあると不便なときもあって、それが例えばDockerfileを更新したときなどです。上に紹介したように --no-cache オプションを付けないと、Dockerはキャッシュを使ってimageを構築してしまうので、更新したDockerfileを見てくれず新しいimageが作られません。 up コマンドでは、キャッシュがある場合はそれを使って一発でイメージの構築から、コンテナの構築・起動までします。 キャッシュがない場合は --build オプションをつけることで、イメージの構築から、コンテナの構築・起動までしてくれます。（ただし、 build コマンドと同じでDockerfileを更新してても反映されません。） 新しいサービスを初めて立ち上げる場合はもちろんキャッシュはないので docker-compose up --build コマンドを使いましょう！ -d オプションを付けてバックグランドで実行することが多いです。 反対に、 down コマンドでコンテナの停止、削除を実行します。 start コマンドでは既存のコンテナを起動します。 もちろんコンテナが1つも存在しないと失敗します。 立ち上げたコンテナは stop コマンドで停止することができます。 run コマンドではimageの構築から、コンテナの構築・起動までしてくれますが、引数でサービスを指定しないと失敗します。 ちなみに、 run コマンドを介して指定したサービスのコンテナ内でコマンドを実行できます。 runのついでですが、 サービスのコンテナ内でコマンドを実行するなら execコマンドも便利です。 docker execコマンドと同じで起動中のコンテナのシェルへ接続することができるので、 run よりもこちらで実行したほうが早いです。 こちらの記事を合わせてご確認いただくと、よりDockerについての知識が深まると思います。

![](Docker/Attachments/production-c620d3e403342b1022967ba5e3db1aaa.ico)https://qiita.com/tegnike/items/bcdcee0320e11a928d46

![](Docker/Attachments/article-ogp-background-9f5428127621718a910c8b63951390ad%201.png)](https://qiita.com/tegnike/items/bcdcee0320e11a928d46)

# Data Volume関連のコマンド

```Bash
# データボリュームを一覧表示
$ docker volume ls 

# 詳細を取得
$ docker  volume inspect <ボリュームネーム>
		#Mountpoint --ローカル上でvolumeが保存されている場所がわかる（コンテナの外）

# コンテナ実行時にdata volumeを設定する 
$ docker container run -v <ホスト側のディレクトリパス>:<コンテナ側のデぃレクトリパス> <イメージ（リポジトリ)>[:タグ] [コマンド] [コマンド引数]
```

# Swarm関連

---

```Bash
# serviceの作成
$ docker service create 
```

```Bash
# 指定したStackにデプロイされているserviceを一覧表示
$ docker stack services <Stack名>

# Stackにデプロイされている　コンテナ群を表示
$ docker stack ps <Stack名>
```

# ログ出力

```Docker
docker logs -f <container_name_or_id>
# e.g. 
docker logs -f my-container

# 最新100行だけを表示してからフォロー
docker logs -f --tail 100 my-container

# タイムスタンプ付きで表示
docker logs -f --timestamps my-container

# 特定時刻以降のログ
docker logs -f --since 2024-11-08T10:00:00 my-container



docker compose logs -f
docker compose logs -f service-name
```