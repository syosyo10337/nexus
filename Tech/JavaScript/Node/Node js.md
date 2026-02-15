---
tags:
  - javascript
  - data
created: 2026-01-03
updated_at: 2026-02-15
status: active
---

偶数versionがLTSです。 prod等では極力　偶数バージョンを選びましょう。

cf. [https://nodejs.org/ja/about/previous-releases](https://nodejs.org/ja/about/previous-releases)

[versionマネジメントツール(fnm/ nodebrew/ n)](#c9c71a40-9fb3-4d8e-ad81-428d62d8e05c)



# versionマネジメントツール(fnm/ nodebrew/ n)

[https://qiita.com/curacao/items/ad1d91ef76f23c45651f](https://qiita.com/curacao/items/ad1d91ef76f23c45651f)


Node.jsとnpmをアップデートする方法

いつも忘れてしまうので書き留めておきます。macOS Monterey（12.4）で確認をして内容を更新しました。この記事で紹介しているツール「n」もv8.2.0になりました！ n という便利なバージョン管理ツールがあるので、これを使ってバージョンを確認してアップデートします。nの詳しい使い方は こちらの記事 あたりをご参照いただくと良いと思います。 n を使う際の注意点もしっかり説明されています 。 $ npm install -g n 1行目の「-stable」でStable（推奨版）のバージョン、2行目の「-latest」で最新版のバージョンが確認できます。 $ n --stable $ n --latest latestは最新の機能を搭載した最新版へのアップデートになります。環境によっては「sudo n latest」のようにsudoコマンドが必要になります。 以下のコマンドでアップデートされたNodeのバージョンが確認できます。 nコマンドでインストールされているバージョンの切り替えを行えます。nコマンドを実行して上下の矢印でバージョンを選択します。 $ n node/15.11.0 node/15.14.0 ο node/16.0.0 n rm コマンドの後にいらなくなったバージョン番号を入力すると、それらのバージョンを削除できます。 $ n rm 18.2.0 18.3.0 npmのほうはシンプルです。以下のコマンドでアップデートできます。 $ npm update -g npm ちなみに、すべてのglobal packagesのアップデートは以下のコマンドでできます。 $ npm update -g ※npmのバージョンが2.6.1以下の場合は 違う方法 が薦められています。 どのGlobalパッケージが古くなっているかを確認するには、以下のコマンドを使います。 $ npm outdated -g 以上、Node.jsとnpmのアップデートの方法でした。

![](https://parashuto.com/rriver/wp/wp-content/themes/rriver2/favicon.ico)https://parashuto.com/rriver/tools/updating-node-js-and-npm

![](JavaScript/Node/Attachments/updating-node-js.png)](https://parashuto.com/rriver/tools/updating-node-js-and-npm)

[Dockerでのnode実行環境構築](Node%20js/Docker%E3%81%A7%E3%81%AEnode%E5%AE%9F%E8%A1%8C%E7%92%B0%E5%A2%83%E6%A7%8B%E7%AF%89%200521c3e0b8af4c7eaac1a475a8367263.html)

そろそろ適当にnpm installするのをやめる。

[

そろそろ適当に npm install するのを卒業する - Qiita

はじめに ネットに転がっている記事などで npm install のコマンドをよく分からず実行してきましたが、そろそろその状態から卒業したかったので備忘録をかねてこちらの記事を投稿しました。 npm install コマンドに...

![](JavaScript/Node/Attachments/apple-touch-icon-ec5ba42a24ae923f16825592efdc356f.png)https://qiita.com/sugurutakahashi12345/items/3cc49926faeaf25d3051

![](JavaScript/Node/Attachments/article-ogp-background-9f5428127621718a910c8b63951390ad.png)](https://qiita.com/sugurutakahashi12345/items/3cc49926faeaf25d3051)

# Package.manager

## npm

[npmの理解](Node%20js/npm%E3%81%AE%E7%90%86%E8%A7%A3%20dcb0ab38d70646ccbb6ad8dc0cfa63ee.html)

[

npm install --productionみたいなの色々ありすぎ問題

本記事で使用するnpmはv10.2.3です。これは記事投稿時点で最新のnode.jsのLTSにバンドルされているものですが、これを採用しているプロジェクトはまだ少ないはずです。

![](JavaScript/Node/Attachments/icon.png)https://zenn.dev/zawa_kyo/articles/d671e0935ae0c0

![](JavaScript/Node/Attachments/og-base-w1200-v2.png)](https://zenn.dev/zawa_kyo/articles/d671e0935ae0c0)

### node_modulesっていつ生まれるの？

dockerなどを使用している際には、以下のようにしてnode.npmを導入するかと思う

```PHP
# node16xインストール
RUN curl -sL https://deb.nodesource.com/setup_16.x | bash -
RUN apt-get install -y nodejs

# npmをインストール
WORKDIR /opt/tokyo-tire_data
RUN cp -ar /opt/node_modules ./  && npm install --omit=optional
```

この時実際にnode_modulesが作成されるのは、`**npm install**`を実行したタイミング

## pnpm

パッケージマネージャーの一つ。ハードリンクを活用してディスク容量を節約し、高速なインストールを実現する。

詳細は [pnpm.md](./pnpm.md) を参照。

[Dockerの時に、pnpm-storeが悪さする。](Node%20js/Docker%E3%81%AE%E6%99%82%E3%81%AB%E3%80%81pnpm-store%E3%81%8C%E6%82%AA%E3%81%95%E3%81%99%E3%82%8B%E3%80%82%2029f38cdd027d806199a3d93341e68bb8.html)

# esbuild-registerの問題

[ReferenceError: require is not defined in ES module scope, you can use import instead](Node%20js/ReferenceError%20require%20is%20not%20defined%20in%20ES%20module%202af38cdd027d801f8578c17f0600acae.html)

# pref_hooksで雑にperformance測定する

[外部画像をlocalに保存する方法](Node%20js/%E5%A4%96%E9%83%A8%E7%94%BB%E5%83%8F%E3%82%92local%E3%81%AB%E4%BF%9D%E5%AD%98%E3%81%99%E3%82%8B%E6%96%B9%E6%B3%95%202c338cdd027d80f7b16ff54908544450.html)

# npm workspacesを活用する

[npm workspaces](Node%20js/npm%20workspaces%202cb38cdd027d80b9b047ee5fb5d676de.html)