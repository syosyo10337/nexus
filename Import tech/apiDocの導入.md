 

# apiDocの導入

[プロジェクトに導入する。](#84ab0ead-7853-4364-83a8-57b59cde90b4)

[Dockerfileの一例](#d046dbc2-c724-4a67-b53f-615122328840)

[**docker-entrypoint.sh**の一例](#1b86219b-edc8-4b8b-b0de-bbef9eda83b4)

[参考) 仮想環境を使わずに、直接開発環境に導入する](#ae6b2f2a-4803-4a3e-8a05-e3b83999e6d5)

[インストール](#997816ca-01ad-4fa5-a1ab-ddfd357107cf)

[apiDocのconfiguration](#a4d22e16-8f54-4a2d-a003-6c95040f961b)

[I/Oを設定する](#f01826d1-f013-4291-a0f6-a217c1fb74dc)

[設定ファイルのパスをカスタムする。](#6b2547ba-9b91-4c39-b620-7be16e0186c6)

[—help](#4dbb1be0-654b-4a3b-86b7-3968f6dd44fc)

[documentの記述方法](#adba28d3-b16d-4b71-b916-1e2f41786f92)

[repositoryにdocumentを直置きしない方法](#0343071f-de5b-4aab-833e-10b1cec0e81b)

[cf. 参考にした記事)](#f02e5977-eb73-40b4-8a9b-ed7d882310c1)

# プロジェクトに導入する。

---

dockerを使っているコンテクストで考える。

この時インフラも考慮し、仕様としては

1. ローカル環境でコンテナを起動時に、毎回生成されるようにする。
    
    1. 開発作業効率が上がる。
    
    2. 起動時に毎回パッケージをインストールしない(コンテナのパフォーマンスの問題)
    

2. 開発環境では表示され、プロダクションではパッケージのインストールおよびドキュメントの生成を行わせない。

このような設定をするために今回やったこととしては、Dockerfileに対して、

1. コンテナ内に `npm install -D apidoc`　を実行してpackage.jsonの`devDependencies`に記述させる。

2. シェルスクリプトを `COPY`させる。

3. `ENTRYPOINT`の設定に、shellスクリプトを実行させるように指定する。

以上のようにすることで、imageをビルドする際に、起動時に毎回ENTRYPOINTに指定したシェルスクリプトを実行してもらえる。

# Dockerfileの一例

```Docker
RUN cp -ar /opt/node_modules ./  && npm install --omit=optional  
# npmがインストールされている前提です。

COPY ./docker/app/docker-entrypoint.sh /opt
RUN chmod +x /opt/docker-entrypoint.sh
ENTRYPOINT [ "/opt/docker-entrypoint.sh" ]
```

- `COPY`するディレクトリは、<local> <container>なので、任意に決めることができる。

- `RUN`コンテナの中で明示的に実行権限を付与してあげることで指定のファイルが確実に実行できるようにする。

- 最後に, `ENTRYPOINT`で**コンテナ内のパス**で実行をさせるようにする。

## **docker-entrypoint.sh**の一例

```Bash
echo "Generate API documentation"
if [ ${APP_ENVIRONMENT} != 'production' ]; then
	npx apidoc -i /opt/laravel/app/Http/Controllers/AccountApi -o /opt/contents/docs/api -c /app/apidoc.json
fi
```

🚨

※dockerfileでapidocを実行するコマンドを記述しているのに、コンテナにnpmが入っていないとエラーになります。

### 参考) 仮想環境を使わずに、直接開発環境に導入する

とりあえずapidocをインストールしてください。

```Docker
npm install apidoc -g
```

cf. 詳しいnpmの理解について)

[

そろそろ適当に npm install するのを卒業する

![](Import%20tech/Attachments/icon%203.png)https://zenn.dev/ikuraikura/articles/71b917ab11ae690e3cd7

![](Import%20tech/Attachments/og-base%201.png)](https://zenn.dev/ikuraikura/articles/71b917ab11ae690e3cd7)

## インストール

先ほどのサンプルコードに少し記載したものの、インストール必要があるものは基本的には `apidoc`だけです。現実的にはnpmでインストールしているので、依存性はよしなに解消してもらっているですが。。

# apiDocのconfiguration

---

## I/Oを設定する

```Bash
$ apidoc -i <入力元のディレクトリ> -o <出力先のディレクトリ>
```

もし何もパラメータを指定しない場合には,

いろんな拡張子のファイルをcurrent_dirから読み込みまくって、./doc/に出力する。

> Without any parameter, apiDoc generates a documentation from all `.cs` `.dart` `.erl` `.go` `.java` `.js` `.php` `.py` `.rb` `.ts` files in the current dir (incl. subdirs) and writes the output to `./doc/`.

## 設定ファイルのパスをカスタムする。

```Bash
$ apidoc -c|--config <path>
```

デフォルトでは、inputに指定したディレクトリの `apidoc.json/apidoc.js`ファイルを参照する。

> Specify the path to the config file to use. (default: apidoc.json or apidoc.js in input dir)

こちらの設定ファイルにドキュメントページの名前や説明を記述できます。

### —help

```Bash
$ apidoc -h
```

# documentの記述方法

---

詳細は公式ドキュメントが一番詳しいのですが、

e.g. サンプルの記述)

```PHP
/**
   * @param ShopsRequest $request
   * @return JsonResponse
   *
   * @api {GET} /v1/account/user/favorites/shops お気に入り店舗の取得
   * @apiVersion 1.0.0
   * @apiName shops
   * @apiGroup AccountApi - FavoriteController
   *
   * @apiParam {Number=0,1} [kaitori_yoyaku_flag] 買取予約の際にCrooooberID情報を使用するフラグ
   *
   * @apiSuccess (200) {Object[]} resources
   * @apiSuccess (200) {String}   resources.id 店舗ID
   * @apiSuccess (200) {String}   resources.name 店舗名
   * @apiSuccess (200) {String}   resources.address 店舗住所
   * @apiSuccess (200) {String}   [resources.latitude] 店舗住所緯度(買取予約で取得される場合)
   * @apiSuccess (200) {String}   [resources.longitude] 店舗住所経度(買取予約で取得される場合)
   *
   * @apiSuccessExample {json} 200 買取予約画面での取得例。CrooooberID側での仕様はGraphQLのfavoriteShopsを参照(example):
   *  {
   *      "resources": [
   *          {
   *            "id": "020",
   *            "name": "練馬店",
   *            "address": "東京都練馬区南田中２－２３－１８",
   *            "tel": "03-5923-0505",
   *            "latitude": "35.735484",
   *            "longitude": "139.615125"
   *          },
   *          {
   *            "id": "161",
   *            "name": "塩尻北インター店",
   *            "address": "長野県塩尻市大字広丘吉田９８０－イ",
   *            "tel": "0263-85-3950",
   *            "latitude": "36.156145",
   *            "longitude": "137.949681"
   *          },
   *          {
   *            "id": "166",
   *            "name": "大阪門真店",
   *            "address": "大阪府門真市三ツ島６７２－１",
   *            "tel": "072-887-1182",
   *            "latitude": "34.7164674",
   *            "longitude": "135.5984649"
   *           }
   *      ]
   *  }
   *
   * @apiUse UnauthorizedError
   */
  public function shops(ShopsRequest $request): JsonResponse
  {
			//write proccess you need
  }

  /**
   * @apiDefine UnauthorizedError
   *
   * @apiError (401) Unauthorized  ZAS_USER_ID/ZAS_API_TOKENのどちらかが欠けている場合
   *
   * @apiErrorExample {json} 401 Error-Response (example):
   *  {
   *      "error": "auth failed."
   *  }
   */
```

# repositoryにdocumentを直置きしない方法

`apidoc -c`で指定したディレクトリをgitignoreに追記する。

### cf. 参考にした記事)

[

API Docs in コネヒト〜2017年、冬〜 - Qiita

はじめに 本記事はコネヒト Advent Calendar 2017の21日目のエントリーになります。 こんにちは！本日は @itosho のターンです。2回目の登場でございます。本当はアイドルか野球の話をしたいのですが、今日...

![](Import%20tech/Attachments/apple-touch-icon-ec5ba42a24ae923f16825592efdc356f%202.png)https://qiita.com/itosho/items/61d3ca884a200105b1d1#fn2

![](Import%20tech/Attachments/article-ogp-background-9f5428127621718a910c8b63951390ad%203.png)](https://qiita.com/itosho/items/61d3ca884a200105b1d1#fn2)

[

apiDoc - Inline Documentation for RESTful web APIs

![](https://apidocjs.com/img/favicon.ico)https://apidocjs.com/



](https://apidocjs.com/)