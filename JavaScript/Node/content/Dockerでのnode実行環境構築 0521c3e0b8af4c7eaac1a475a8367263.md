 

# Dockerでのnode実行環境構築

---

# ファイル作成

まずは、ファイルを作成する。

```Ruby
app/
	- docker-compose.yml
	- Dockerfile
```

Dockerfileでは、

- 使用するnodeのイメージ

- 作業するディレクトリ

を指定。

```Docker
#Dockerfile

FROM node:19-slim
WORKDIR /usr/src/app
```

docker-compose.ymlでは、

サービスの名前と、volumeの設定

また、サーバー起動をコンテナ起動時に強制している。

```YAML
# docker-compose.yml

version: '3.9'
services:
  react-app:
    build:
      context: .
      dockerfile: Dockerfile
    volumes:
      - ./:/usr/src/app
    command: sh -c "cd <アプリ名> && yarn start"
    ports:
      - "3000:3000"
    stdin_open: true
```

## 手動でアプリを作成する。

```Bash
$ docker-compose run --rm <サービス名> sh -c \
"npm install -g create-react-app \
&& create-react-app <アプリ名>"
```

1行目は、docker-composeのコマンドで、　 `--rm`オプションによって作成したコンテナは実行後削除する(つまり、アプリを作成するコマンドを実行して、volumeとしてappの雛形だけを残している。)

2行目では、npmコマンドによって、create-react-appをインストールして

3行目では、create-react-appコマンドを実行している。

//typescriptを使う時には、`—template typescript`をつけること。

cf)

[

https://zenn.dev/rihito/articles/96dfad8d4990f9



](https://zenn.dev/rihito/articles/96dfad8d4990f9)

[

https://kashiblog.net/environmental-construction-react-docker#toc4



](https://kashiblog.net/environmental-construction-react-docker#toc4)