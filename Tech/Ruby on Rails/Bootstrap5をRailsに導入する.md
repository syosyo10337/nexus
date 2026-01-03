---
tags:
  - rails
  - view
  - gem
created: 2026-01-03
status: active
---

![](bootstrap-original-wordmark.svg)

# Bootstrap5をRailsに導入する

---

[前提](#b24a508f-acb7-4363-988e-17f2a57864af)

[実行環境](#8fddb71a-2c6f-4543-b3ed-c64fe1a1d824)

[JSの機能をwebpackerで導入する(Rais 6.x)](#7b0e82ab-9fc8-4f1f-bef3-4d34876acc36)

[①モジュールをインストールする](#4d8d4ac6-e46c-4ad3-af42-0a55e3743896)

[yarnを使う場合](#cb96d92f-847c-42ea-bf78-0d7901fb21d7)

[②-A CSSもwebpackerで管理する場合](#c9e9bf7b-93da-4448-b83b-768997af165b)

[②-B Sprocketsによるアセット管理](#2126c16b-6206-4a4c-a398-bec363146a2e)

[③-A viewで、styleタグを生成する](#05101777-874a-49a8-be84-45a01deb469c)

[③-B](#a39e4c05-8e6e-4980-8322-3dc735e12390)

[cf)参考にした記事 ,6.1系だと大抵の場合は、yarnでのモジュールインストール。packsにて、導入しているケースが多い。あとはアセットパイプラインを使い分けるか？の違いらしい。](#e1ae47d2-fbc5-4555-9ae4-02f682615e4e)

# 前提

---

Bootstrapは基本的には、cssフレームワークだが、一部コンポーネントにJavascriptが使われている。そのため,BootstrapだけでUIを実装する場合には、BootstrapのJavascriptライブラリまで導入すること。

ちなみにBootstrap5からは、JQuery依存は無くなり、バニラJSによりによってBootstrap自体が実装するようになったため、JQueryを導入する必要はない。

## 実行環境

---

Rails 6.1.7

Bootstrap 5.2

# JSの機能をwebpackerで導入する(Rais 6.x)

---

## ①モジュールをインストールする

### yarnを使う場合

```Bash
$ yarn add bootstrap
# 依存関係にあるこちらも導入して
$ yarn add @popperjs/core
```

Bundlerを使っても導入できる。(あんまりやりたくない。)

```Ruby
gem 'bootstrap', '~> 5.0.2'
```

[

Webpack と bundlers

npm を使って Node.js モジュールとして bootstrap をインストールします 。 アプリのエントリーポイント(通常は index.js または app.js)に次の行を追加して Bootstrap の JavaScript をインポートしてください: また、必要に応じて 個別にプラグインをインポートする こともできます: Bootstrap は Popperに依存しています。これらは peerDependencies として定義されています。 つまり npm install @popperjs/core で package.json に追加する必要があります。 Bootstrap の可能性を引き出し、必要に応じてカスタマイズして使う場合は、標準プロセスの一部としてソースファイルを使います。 はじめに、独自の _custom.scssを作成し、それを使って 組み込みカスタム変数 を上書きします。その後、Sass ファイルを使ってカスタム変数をインポート、続いて Bootstrap もインポートします: Bootstrap をコンパイルするには、必要な loader をインストールしてください ( sass-loader、 postcss-loader、 Autoprefixer)。これらは最小限の設定で、webpack にこれらを含める必要があります: もしくは、この行をエントリーポイントに追加するだけで、すぐに Bootstrap の CSS を使うことができます: この場合、webpack を変更することなく cssを使用することができます。 sass-loaderは必要ありません。 style-loader、 css-loader だけで良いです。

![](Ruby%20on%20Rails/Attachments/favicon.ico)https://getbootstrap.jp/docs/5.0/getting-started/webpack/

![](bootstrap-social.png)](https://getbootstrap.jp/docs/5.0/getting-started/webpack/)

## ②-A CSSもwebpackerで管理する場合

```JavaScript
// javascript/packs/application.jsにて


// エントリーポイントの設定
import "bootstrap";
import "../stylesheets/application";
```

その後, `../stylesheets/application`(拡張子は省略可能)

に指定した部分にCSSの記述を書いて、webpackerにコンパイルしてもらえるように整える。

```Bash
# bash 


# appのtopレベルにて
$ mkdir app/javascript/stylesheets
$ touch application.js # importの部分に対応できれば、名前は自由
```

ここに　bootstrapのCSSに関するモジュールもインポートする。(import元はnode.moduleになるようにする。)

パスの指定を　`~bootstrap/scss/bootstrap.scss`にした場合でも、`.node_modules/`　以下のソースファイルのホームからのパスという意味で同様の指定になるっぽいです。

```Scss
// app/javascript/stylesheets/application.scss
// (今さっき作成したファイルにて)


// Sass変数のoverrideはimport前のこちらに記述
$pagination-active-bg: #6c757db8;

#Bootstrap Sassモジュールのインストール
@import "~bootstrap/scss/bootstrap.scss";

#以下カスタムスタイル
```

[

Sass

Sass ソースファイルを利用して、変数、マップ、ミックスイン、そして関数を活用しプロジェクトをカスタマイズしましょう。

![](Ruby%20on%20Rails/Attachments/favicon.ico)https://getbootstrap.jp/docs/5.0/customize/sass/

![](bootstrap-social.png)](https://getbootstrap.jp/docs/5.0/customize/sass/)

⚠️

Bootstrapの変数を上書きしたい時は, @importの”前”に書く。なぜならば、!defaultをつけた初期値として設定されているので、値を入れてあげると、オーバーライドできる。

## ②-B Sprocketsによるアセット管理

インストールはもう、yarn `install`で済ませると良いでしょう。もし、カスタマイズしたい場合には、2-Aの時と同様にして良いです。sprcoketsを使う場合（assets/stylesheets）とした時には、~からのパス指定`~bootstrap/scss/bootstrap.scss`だとエラーになります。

```Scss
$primary: red;

@import "../node_modules/bootstrap/scss/bootstrap";

h1 {
  background-color: red;
}

.btn {
  --bs-btn-border-radius: 0.2rem;
}
```

## ③-A viewで、styleタグを生成する

---

```Ruby
<!DOCTYPE html>
<html>
  <head>
    <title>RecordaMe</title>
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <%= csrf_meta_tags %>
    <%= csp_meta_tag %>
  

# stylesheet_pack_tagでビルドされたCSSを読み込めるように
# javascript_pack_tagで　JSの機能を読み込めるように
# どちらもHTMLに表示させるつまり、 <%= になっていることを確認
    <%= stylesheet_pack_tag 'application', media: 'all', 'data-turbolinks-track': 'reload' %>
    <%= javascript_pack_tag 'application', 'data-turbolinks-track': 'reload' %>
  </head>
```

この記述が,本番環境では、public/pack下の指定していることになって、そこをエントリーポイントとする。

## ③-B

Sprocketsによるパス指定をする場合には、従来通り、`stylesheet_link_tag`

を使用して、ください。詳しいコンパイル/asset pipeline等については

cf)

[

Rails 7.0でアセットパイプラインはどう変わるか | Wantedly Engineer Blog

Rails 7.0ではフロントエンドサポートが刷新されます。新たなライブラリが多数導入され、選択肢が増えるため、「Rails公式のものを選べばOK」という戦略が通用しなくなります。 本稿では、Railsでフロントエンドを書くための選択肢について、その歴史と実装を踏まえて比較検討します。 (まだアルファ版なので今後も状況が変わる可能性はありますが、) 新規アプリケーションではSprocketsの役割は無くなりそうです。新しいライブラリとして Propshaft, importmap-rails, jsbundling-rails, cssbundling-rails が登場し、主要な選択肢として以下が提供されます。 (各ライブラリの詳細については後述します) Propshaft + importmap-rails デフォルトの選択肢。Node.jsが不要。 トランスパイルを含め、複雑なことをしたくなったら別の選択肢に移行する。 Propshaft + jsbundling-rails (+ cssbundling-rails) 好きなバンドラーと組み合わせられる。設定も自由 ホットリロードはできない。 Webpacker Webpackとのフルの統合を提供する。 設定に若干癖があるが、基本的にはフロントエンド寄りのやり方でいじれるようになっている。 Propshaftとの共存は可能。 残念ながら「どれが一番いいのか?」については確定的な答えは出せません。それがあるなら、そもそもこんなに沢山の選択肢が一度に提示されることはないでしょう。ベストプラクティスはRails 7.0.0の普及にともなって判明していくのかもしれません。なお、筆者の所感はこの記事の末尾に記してあります。 移行用の選択肢として以下が使えます。 (Sprocketsがある場合はPropshaftは不要) Sprockets + importmap-rails Sprockets + jsbundling-rails (+ cssbundling-rails) Sprockets + Webpacker ディレクトリ構成に注目して各ツールを分類すると以下のようになります。 こういう複雑な処理が起こっているという図ではありません 。Railsが提供する全ての選択肢を重ねて表示することで相互の関係を示したもので、個々のツールはこれよりもシンプルです。 ここからはRails誕生からWebpackerまでのRailsフロントエンドの歴史を順に見ていきます。 (筆者自身がRailsを触りはじめたのは5.x系の頃のため、古い情報は当時の情報のサルベージに基づいています。また、前後関係がおおよそわかるように参考程度に年情報を付与しています) Railsでは ./public に置いたファイルが静的ファイルとして配信されます。これはRailsの初期からありました。また javascript_include_tag と stylesheet_link_tag も Rails 0.10.0で追加されています 。この時点では以下の仕様でした。 絶対パスはそのまま、相対パス (`/` を含まない) ならば `/javascripts/` や `/stylesheets/` からの相対 そのため、JSやCSSは /public/javascripts, /public/stylesheets に配置していました。その後シンボル指定でJavaScript/CSSをまとめてincludeする仕組みが追加されています。 (現在は存在しない) # "defaults" に登録されているJSファイルに加えて、 /javascripts/extra.js もincludeするjavascript_include_tag :defaults, "extra" この時代はrails newでプロジェクトを初期化するときに /public/javascripts 以下に必要なファイル (Prototype.js や今でいうrails-ujsなど) が配置されていたようです。 この時代のRailsはアセットパイプラインがありませんでしたが、今でもアセットパイプラインを外したRailsアプリケーションを作ることは可能です。 6.1までの既存のRailsアプリケーションからSprocketsを外すには、まずGemfileにSprocketsや関連gem (sass-rails, coffee-railsなど) がない状態にします。また、Webpackerを外すには、webpacker gemをGemfileから外します。 # ...

![](android-touch-icon.png)https://www.wantedly.com/companies/wantedly/post_articles/354873

![](7d4848d5-91d4-452c-a86d-5cce018e5b45.png)](https://www.wantedly.com/companies/wantedly/post_articles/354873)

---

### cf)参考にした記事 ,6.1系だと大抵の場合は、yarnでのモジュールインストール。packsにて、導入しているケースが多い。あとはアセットパイプラインを使い分けるか？の違いらしい。

[

【Rails】Bootstrap5の導入 - Qiita

Railsで作成したアプリに Bootstrap5 を導入する。 今回、Railsに Bootstrap5を導入しますが、 Bootstrap5から jQuery が不要になったようですのでインストールは不要です。 では早速始めていきます！ まず、YarnでBootstrapに必要なパッケージをインストールします。 必要なパッケージは bootstrapと popper.js の2点です。 $ yarn add bootstrap@next $ yarn add @popperjs/core これでインストールができました！ 続いてapplication.jsの設定です。 次にapplication.scssの設定ですが、 application.scssというファイルは存在しないので、 app/javascript/stylesheets/というディレクトリを作成し、その中に application.scss ファイルを作成してください！ 最後に 「stylesheet_pack_tag」 を追加します! これで Bootstrapは導入できたかと思います。 ビューファイルに以下のコードを記載し確かめてみてください！ 以上で Bootstrap5の導入は完了です。 あとはビューファイルを各々編集してください。 では。

![](Ruby%20on%20Rails/Attachments/production-c620d3e403342b1022967ba5e3db1aaa%201.ico)https://qiita.com/oak1331/items/3b4ebf9b076246c103f4#bootstrap%E3%81%AE%E3%82%A4%E3%83%B3%E3%82%B9%E3%83%88%E3%83%BC%E3%83%AB

![](article-ogp-background-9f5428127621718a910c8b63951390ad%203.png)](https://qiita.com/oak1331/items/3b4ebf9b076246c103f4#bootstrap%E3%81%AE%E3%82%A4%E3%83%B3%E3%82%B9%E3%83%88%E3%83%BC%E3%83%AB)

[

Rails6のアセットパイプラインを理解する【javascript・css】

Rails6のアセットパイプラインの仕組みを理解するために、調べたことを書き連ねる Rails6のアセットパイプラインを理解したい人 jsやcssファイルを結合して、1ファイルにすることで、ブラウザからのリクエスト数を軽減する 改行やスペースを削除して、ファイルサイズを軽減する sassやcoffee scriptなどで記述されたファイルをcss・jsにコンパイルする jsやcssファイルにフィンガープリントを追加して、キャッシュ対策をする 自身のアプリケーションが保持するアセットに関しては、 app/assets 配下が推奨されている。 上記に配置したファイルがproduction環境ではプリコンパイルされて、 public/packs 配下に配置される $ rails assets:precompile production環境用のファイルをコンパイルするためのコマンド アセットパイプラインで作成されるファイルを削除するコマンド ※assets:precompileの前に実行し、以前の不要なファイルを削除したりする。

![](Ruby%20on%20Rails/Attachments/logo-transparent.png)https://zenn.dev/ring_belle/articles/abd432cb3df64b

![](Ruby%20on%20Rails/Attachments/og-base_z4sxah.png)](https://zenn.dev/ring_belle/articles/abd432cb3df64b)

[

Sass

Sass ソースファイルを利用して、変数、マップ、ミックスイン、そして関数を活用しプロジェクトをカスタマイズしましょう。

![](Ruby%20on%20Rails/Attachments/favicon.ico)https://getbootstrap.jp/docs/5.0/customize/sass/

![](bootstrap-social.png)](https://getbootstrap.jp/docs/5.0/customize/sass/)

[

Rails 6, Bootstrap 5 : a tutorial

Bootstrap 5 is highly customisable and delightful when you need to deliver a consistent design as fast as possible. Let's see how to use it with the last Rails version. There is a new article about Rails 7 and Bootstrap 5 : https://www.bootrails.com/blog/rails-7-bootstrap-5-tutorial/ The article below is about Rails 6, Webpacker, and Bootstrap 5.

![](data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMjNweCIgaGVpZ2h0PSIyMXB4IiB2aWV3Qm94PSIwIDAgMjMgMjEiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8ZGVmcz48L2RlZnM+CiAgICA8ZyBpZD0iUGFnZS0xIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgICAgICA8ZyBpZD0icnVieXNoYXBlZW1wdHkiIGZpbGw9IiMzM0MzRjAiIGZpbGwtcnVsZT0ibm9uemVybyI+CiAgICAgICAgICAgIDxwb2x5Z29uIGlkPSJyYWlsc2xpa2UiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDExLjUwMDAwMCwgMTAuNTAwMDAwKSByb3RhdGUoLTE4MC4wMDAwMDApIHRyYW5zbGF0ZSgtMTEuNTAwMDAwLCAtMTAuNTAwMDAwKSAiIHBvaW50cz0iMTEuNSAtMy41NTI3MTM2OGUtMTUgMjMgMTQuNjU0NzIzIDE4LjYwNzM5MDkgMjEgNC4zOTI2MDkxMyAyMSAzLjU1MjcxMzY4ZS0xNSAxNC42NTQ3MjMiPjwvcG9seWdvbj4KICAgICAgICA8L2c+CiAgICA8L2c+Cjwvc3ZnPgo=)https://www.bootrails.com/blog/rails-bootstrap-tutorial/

![](fbcover_small.png)](https://www.bootrails.com/blog/rails-bootstrap-tutorial/)

Perfect Rails ←静的アセットは　Sprocketsを推奨している例