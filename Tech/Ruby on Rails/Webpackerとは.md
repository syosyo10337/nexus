---
tags:
  - rails
  - view
  - gem
  - config
created: 2026-01-03
status: active
---

# Webpackerとは

---

Webpackerとは、webpackをRailsについて扱いやすくするためのラッパーです。Rails 6ではデフォルトのJSバンドラー

[Webpackとは(not packer)](#9c72b5cf-1875-440d-89fa-fd5ae8bdbfc7)

[Rails6.x系の推奨環境](#48ffd50e-890d-46b1-a652-adfb0c7fb57a)

[cf)アセットパイプラインの変遷とwebpackerについて](#e5514603-3d10-4355-99d3-7f44a9546bc3)

[Webpacker環境でのJS管理](#ea742fc0-5a77-403d-95c3-a7a89dc7539c)

[View側での読み込みについて](#6b0ef928-d80a-4b29-ba76-0b98e4aef13f)

[エントリーポイントの設定](#d362fe0e-b77b-41ed-b249-a6286e1b2df2)

[cf)Bootstrapの導入の詳細についてはこちらで](#46c9c38a-c2c6-494b-b9a0-e92e24c540e9)

[require とimport](#9ce2a24e-0367-4127-b704-fb18b4c6abf7)

# Webpackとは(not packer)

---

webpackとは、npmモジュールとして配布されているライブラリ。JS,CSSや画像など様々な形式のファイルをまとめるモジュールバンドラーです。また、バンドルするタイミングで、コンパイルや圧縮処理も行う。

cf)ぱrails p)176

- モジュールバンドラー
    
    複数のファイルを１つにまとめて出力してくれるツールのこと。
    
    （複数ファイルをまとめることを「バンドル」と呼ぶ）
    

webpackコマンドとwebpack.config.jsという設定ファイルを使ってJSのコンパイルや圧縮をする。

# Rails6.x系の推奨環境

Rails6.0からデフォルトで使用されるJS管理のアセットパイプラインは**webpacker**です。パッケージマネージャーとしてはYarnが使用される。

推奨環境としては、**画像やCSSなどの静的なファイル**については引き続き**Sprockets**で管理する。

### cf)アセットパイプラインの変遷とwebpackerについて

[

Rails 7.0でアセットパイプラインはどう変わるか | Wantedly Engineer Blog

Rails 7.0ではフロントエンドサポートが刷新されます。新たなライブラリが多数導入され、選択肢が増えるため、「Rails公式のものを選べばOK」という戦略が通用しなくなります。 本稿では、Railsでフロントエンドを書くための選択肢について、その歴史と実装を踏まえて比較検討します。 (まだアルファ版なので今後も状況が変わる可能性はありますが、) 新規アプリケーションではSprocketsの役割は無くなりそうです。新しいライブラリとして Propshaft, importmap-rails, jsbundling-rails, cssbundling-rails が登場し、主要な選択肢として以下が提供されます。 (各ライブラリの詳細については後述します) Propshaft + importmap-rails デフォルトの選択肢。Node.jsが不要。 トランスパイルを含め、複雑なことをしたくなったら別の選択肢に移行する。 Propshaft + jsbundling-rails (+ cssbundling-rails) 好きなバンドラーと組み合わせられる。設定も自由 ホットリロードはできない。 Webpacker Webpackとのフルの統合を提供する。 設定に若干癖があるが、基本的にはフロントエンド寄りのやり方でいじれるようになっている。 Propshaftとの共存は可能。 残念ながら「どれが一番いいのか?」については確定的な答えは出せません。それがあるなら、そもそもこんなに沢山の選択肢が一度に提示されることはないでしょう。ベストプラクティスはRails 7.0.0の普及にともなって判明していくのかもしれません。なお、筆者の所感はこの記事の末尾に記してあります。 移行用の選択肢として以下が使えます。 (Sprocketsがある場合はPropshaftは不要) Sprockets + importmap-rails Sprockets + jsbundling-rails (+ cssbundling-rails) Sprockets + Webpacker ディレクトリ構成に注目して各ツールを分類すると以下のようになります。 こういう複雑な処理が起こっているという図ではありません 。Railsが提供する全ての選択肢を重ねて表示することで相互の関係を示したもので、個々のツールはこれよりもシンプルです。 ここからはRails誕生からWebpackerまでのRailsフロントエンドの歴史を順に見ていきます。 (筆者自身がRailsを触りはじめたのは5.x系の頃のため、古い情報は当時の情報のサルベージに基づいています。また、前後関係がおおよそわかるように参考程度に年情報を付与しています) Railsでは ./public に置いたファイルが静的ファイルとして配信されます。これはRailsの初期からありました。また javascript_include_tag と stylesheet_link_tag も Rails 0.10.0で追加されています 。この時点では以下の仕様でした。 絶対パスはそのまま、相対パス (`/` を含まない) ならば `/javascripts/` や `/stylesheets/` からの相対 そのため、JSやCSSは /public/javascripts, /public/stylesheets に配置していました。その後シンボル指定でJavaScript/CSSをまとめてincludeする仕組みが追加されています。 (現在は存在しない) # "defaults" に登録されているJSファイルに加えて、 /javascripts/extra.js もincludeするjavascript_include_tag :defaults, "extra" この時代はrails newでプロジェクトを初期化するときに /public/javascripts 以下に必要なファイル (Prototype.js や今でいうrails-ujsなど) が配置されていたようです。 この時代のRailsはアセットパイプラインがありませんでしたが、今でもアセットパイプラインを外したRailsアプリケーションを作ることは可能です。 6.1までの既存のRailsアプリケーションからSprocketsを外すには、まずGemfileにSprocketsや関連gem (sass-rails, coffee-railsなど) がない状態にします。また、Webpackerを外すには、webpacker gemをGemfileから外します。 # ...

![](android-touch-icon%201.png)https://www.wantedly.com/companies/wantedly/post_articles/354873

![](7d4848d5-91d4-452c-a86d-5cce018e5b45%201.png)](https://www.wantedly.com/companies/wantedly/post_articles/354873)

[

Webpacker の概要 - Railsガイド

Webpackerは、汎用的な webpack ビルドシステムのRailsラッパーであり、標準的なwebpackの設定と合理的なデフォルト設定を提供します。 ...

![](favicon%2019.ico)https://railsguides.jp/webpacker.html#css%E3%82%92webpacker%E7%B5%8C%E7%94%B1%E3%81%A7%E5%88%A9%E7%94%A8%E3%81%99%E3%82%8B

![](cover_for_facebook%204.png)](https://railsguides.jp/webpacker.html#css%E3%82%92webpacker%E7%B5%8C%E7%94%B1%E3%81%A7%E5%88%A9%E7%94%A8%E3%81%99%E3%82%8B)

## Webpacker環境でのJS管理

---

Webpacker環境でJSを使った開発をする際には, `app/assets/javascripts`(Sprockets)ではなく、`app/javascripts`配下で作業する。

本番環境などで、コンパイル(ビルド？)される際には、`public/packs/js`へ出力される。

また、`app/javascripts/packs`にあるファイルがエントリーポイント(最初に読み込まれるファイルになる)となる。

本番環境において

```Bash
$ bin/rails webpacker:compile

#　こちらはwebpacker:compileを内包している
$ bin/rails assets:precompile
```

上のコマンドを使用すると、`app/javascripts/packs`配下に置いたJSファイルが実際にアプリケーションが読み込むエントリーポイントへとビルド（`public/packs/js`）されている。

## View側での読み込みについて

---

```HTML
<!DOCTYPE html>
<html>
  <head>
    <title>Bootstrap</title>
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <%= csrf_meta_tags %>
    <%= csp_meta_tag %>

    <%= stylesheet_link_tag 'application', media: 'all', 'data-turbolinks-track': 'reload' %>
    <%= javascript_pack_tag 'application', 'data-turbolinks-track': 'reload' %>
  </head>

  <body>
    <%= yield %>
  </body>
</html>
```

`javascript_pack_tag`の部分が、ビルドされたJSファイル(`public/packs/js`配下のファイル)を読み込んでいる。

CSSについてもwebpackerでコンパイルしたい時には、

`<%= stylesheets_pack_tag 'application', 'data-turbolinks-track': 'reload' %>`

を記述して、app/javascripts/packs/配下に適切なエントリーポイントを設定してください。

[

Webpacker の概要 - Railsガイド

Webpackerは、汎用的な webpack ビルドシステムのRailsラッパーであり、標準的なwebpackの設定と合理的なデフォルト設定を提供します。 ...

![](favicon%2019.ico)https://railsguides.jp/webpacker.html#css%E3%82%92webpacker%E7%B5%8C%E7%94%B1%E3%81%A7%E5%88%A9%E7%94%A8%E3%81%99%E3%82%8B

![](cover_for_facebook%204.png)](https://railsguides.jp/webpacker.html#css%E3%82%92webpacker%E7%B5%8C%E7%94%B1%E3%81%A7%E5%88%A9%E7%94%A8%E3%81%99%E3%82%8B)

## エントリーポイントの設定

---

JSファイルのエントリーポイント(app/javascripts/packs/application.js)は、rails newした直後のデフォルトだと、以下のようになる。これは、railsがデフォルトで提供している機能に関するJSライブラリの読み込みが記述されています。

```Ruby
import Rails from "@rails/ujs"
import Turbolinks from "turbolinks"
import * as ActiveStorage from "@rails/activestorage"
import "channels"

Rails.start()
Turbolinks.start()
ActiveStorage.start()
```

例えば、独自にインストールしたモジュールをバンドルする時は、以下のような手順で導入します。

e.g.)BootstrapのJS機能をバンドルする例　

Bootstrap5でフロントを完結させる際に、必要となるのはBootstrapのスタイル部分だけでなく、JSを用いた動的な部分についても導入する必要があります

モジュールをインストール

```Bash
$ yarn add bootstrap
$ yarn add @popper.js/core
の二つになります。
```

エントリーポイントを追加する。

```Ruby
# application.js
import Rails from "@rails/ujs"
import Turbolinks from "turbolinks"
import * as ActiveStorage from "@rails/activestorage"
import "channels"
import "bootstrap"


Rails.start()
Turbolinks.start()
ActiveStorage.start()
```

### cf)Bootstrapの導入の詳細についてはこちらで

[![](bootstrap-original-wordmark%201.svg)Bootstrap5をRailsに導入する](Bootstrap5%E3%82%92Rails%E3%81%AB%E5%B0%8E%E5%85%A5%E3%81%99%E3%82%8B%2009dc92b6e5ba463bbd426c49536907ce.html)

# require とimport

[

jsのimportとrequireの違い - Qiita

jsで外部ファイルを読み込む際に、 importと書いてある場合とrequireと書いてある場合があります。 この２つの違いがよくわからなかったので確認しました。 importとrequireの違いを確認する前に、 前提知識となる「モジュール」について簡単に説明します。 ある程度の規模のjsアプリを作ると、 １つの大きなjsファイルにすべてのコードを書くのではなく 機能ごとにjsファイルを分けて管理したくなります。 そして、その機能ごとに分割したjsファイルを メインとなるjsファイルで必要に応じて読み込んで利用するイメージです。 この分割した機能ごとのjsファイルを「モジュール」と呼びます。 モジュールを読み込むための方法、仕様は 何種類かあり、 それぞれ書き方が違い、動く環境も違います。 そのモジュール読み込みの仕様の主要なものとして、 ESM (ECMAScript Modules)と CJS (CommonJS Modules)があります。 ※ほかにもいくつかあるが、主要なのはこの２つ 今回のテーマである importを使うのがESM方式で、 require を使うのがCJS方式となります。 それでは、 具体的にそれぞれの書き方の違いや動く環境の違いを説明していきます。 import（ESM）は、 ES6で決められたモジュール読み込みの仕様です。 ES6の仕様ですので、 import文は ChromeやFirefoxなどのブラウザでそのまま動かすことができますが、 IEでは動きません。 ESのバージョンとかブラウザによって動いたり動かなかったりという話が分からない場合は こちらの記事でご確認ください。 ES（ECMAScript）とは？jsがブラウザによって動いたり動かなかったりするのはなぜ？ import文の書き方です。 モジュール側と読み込み側それぞれ書き方があります。 モジュール側 モジュール側では、いつものように関数やクラスを定義して、 その頭に exportを付けることで import可能なモジュールとして定義できます。 読み込み側 読み込み側では、 import文を使って先ほどのモジュールを読み込みます。 require文は、CommonJSの仕様で、 Nodejsの環境で動作してくれる書き方です。 Nodejs環境ということはつまり、サーバサイドでの実行ということになります。 多くの場合はブラウザ側でのjs実行になると思いますが、 ブラウザ側ではrequire文は動作しません。 require文のモジュール側、読み込み側それぞれの書き方です。 モジュール側 モジュール側では module.exports と書いて、関数やクラスなどを定義します。 読み込み側 読み込み側では require文を使って先ほどのモジュールを読み込みます。 上記の通り、 import文は ・Chromeなどでは動くがIEなどES6に対応していないブラウザでは動かない require文は ・Nodejs（サーバサイド）では動くがブラウザ側実行のjsでは動かない という動作環境の制限があります。 ですが、環境関係なく import文もrequire文も利用したいということがあると思います。 どの環境でも動作するようにするためには、 webpackなどのモジュールバンドルツールを利用する方法があります。 webpackというツールのイメージとしては、 ・上記の書き方の例でいう main.jsのような「読み込み側」のファイルを変換対象として指定する ・ツールを実行する ・ファイルに書かれている importや requireなどの文を解析してくれる ・必要な外部ファイル（モジュール）を取ってきて全部１つのファイルとしてまとめて出力する ということができるものです。 webpackは、 importやrequireや今回言及していない別のモジュール構文にも対応しており これらを読み取ってすべてモジュールを１つのファイルとしてまとめてくれます。（「バンドルする」という） そして、最終的にその１つにまとめられたjsファイルを htmlで読み込むことで 必要なモジュールの機能がすべて利用できるようになります。 今回webpackの具体的な使い方は説明しませんので 別の記事を参考にしてみてください。 Webpackってどんなもの？ ■import ・ES6の仕様 ・Chromeなどでは動くがIEなどES6に対応していないブラウザでは動かない ■require ・CommonJSの仕様 ・Nodejs（サーバサイド）では動くがブラウザ側実行のjsでは動かない どの環境でも動作させるためには ...

![](Ruby%20on%20Rails/Attachments/production-c620d3e403342b1022967ba5e3db1aaa%202.ico)https://qiita.com/minato-naka/items/39ecc285d1e37226a283

![](article-ogp-background-9f5428127621718a910c8b63951390ad%205.png)](https://qiita.com/minato-naka/items/39ecc285d1e37226a283)