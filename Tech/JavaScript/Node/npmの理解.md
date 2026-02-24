---
tags:
  - javascript
  - data
created: 2026-01-03
status: active
---

# そもそもnpmとは?

---

npm（Node Package Manager）とは Node.js のパッケージ（Package）を管理する（Manager）ツールです。

Node.js のパッケージ（Package）とは予め用意された便利な機能（各種フレームワークやライブラリ）をまとめたものです。

## package.jsonとpackage-lock.jsonについて

- package.jsonはパッケージの管理をするためのファイル

- package.jsonはインストールしたいパッケージが一覧で記述されるもので、package-lock.jsonはい**`npm install`を始めて実行した際に作成され、dependencyを固定するためのもの。**
  - Aに依存するBをインストールするときに、package-lock.jsonなしだと、Bだけが頻繁にversionアップしているとすると、あるひとの環境はB ver3.3.0 あるひとの環境ではver4.0.0などいったことが発生しえる。

**具体的な挙動としては**

- `**package-lock.json**`**が存在しないとき**
  - `**package.json**`**に基づいて dependency がインストールされ、実際にインストールされたバージョンが**`**package-lock.json**`**に書かれる。**

- `**package-lock.json**`**が存在するとき**
  - `**package-lock.json**`**に基づいてインストールされるが、**`**package.json**`**指定されたバージョンとの矛盾があれば、**`**package.json**`**が優先され、実際にインストールされたバージョンが**`**package-lock.json**`**に書かれる。**

# node_modules: 依存パッケージの置き場

- 実際には依存パッケージのファイルをローカルのどこかにダウンロードする必要がある。

- npm で依存パッケージをインストールすると、それらはルートディレクトリ直下の`node_modules`ディレクトリにあくまで**仮置場**としてダウンロードされる。

- そのため、このディレクトリは`.gitignore`で Git リポジトリから除外するのが普通であり、このディレクトリ内のファイルは**編集してはいけない**。

### Nodeとnpmをインストールする

macOSなどではあまり気にならないが、Dockerなどを使った環境の場合にLinux OSに対してインストールする知見が必要になるため、こちらに記載にする

- Dockerfileの記述一例

```Docker
# node16xインストール
RUN curl -sL https://deb.nodesource.com/setup_16.x | bash -
RUN apt-get install -y nodejs

# npmをインストール
##　workingディレクトリを指定
WORKDIR /opt/tokyo-tire_data
### コンテナサーバ上に移したnode_modulesファイルを移動させてきて、npm install
### もし初回である場合には、npm installで依存パッケージをインストールした際に、始めてnode_modulesがプロジェクトのルートディレクトリに作成される。
RUN cp -ar /opt/node_modules ./  && npm install --omit=optinpmonal
```

# npm コマンド

基本的には、**package.jsonを直接操作することはない。**

もしそのような場合には、npm installを行なって、node_modulesを更新する必要がある。

## dependencyの書き換え

```Bash
tg# 個別にパッケージ(モジュール)を追加する
$ npm install <packeage名>@versioning
#devDepに対してパッケージをインストール
$ npm -D|--save-dev install <packages>
#dependencyを削除
$ npm uninstall <package>
$ npm rm <package名>

#グローバルインストールを行う(PCないのどこからでもアクセスできるようにする)
$ npm install -g <packages名>
```

## npm自体をアップデートするとき

```Bash
npm update -g npm
```

## package.jsonを作成する

```Bash
npm init
```

## Clean install

node_modulesを作り直しているよ

> If a `node_modules` is already present, it will be automatically removed before `npm ci` begins its install.

```Shell
npm ci
```

[https://bufferings.hatenablog.com/entry/2023/03/15/215044](https://bufferings.hatenablog.com/entry/2023/03/15/215044)

[https://docs.npmjs.com/cli/v11/commands/npm-ci](https://docs.npmjs.com/cli/v11/commands/npm-ci)

## バージョン

```Shell
npm ls <package>

# e.g.
npm list express


# 最新バージョンを確認する
npm view <package> version
# e.g.
npm view playwright version
```

# エラーの文の読み方

エラーのレベルの識別

```JavaScript
npm warn  → ⚠️  警告(Warning): 動作はするが推奨されない状態
npm error → ❌ エラー(Error): 実行が失敗した致命的な問題
```

よく見るエラーパターン

|                   |                                                       |
| ----------------- | ----------------------------------------------------- |
| ERESOLVE          | 依存関係の競合 <br>Error RESOLVE                      |
| ENOENT            | ファイルが見つからない <br>　Error NO ENTryみたいな？ |
| EACCES            | 権限がない　E ACCESs                                  |
| `command failed`  | コマンドの実行失敗                                    |
| `peer dependency` | ピア依存関係の問題                                    |

# Nodeの文脈でのプロジェクトの概念

Node.js のプロジェクトは npm のパッケージ 1 個に対応する

また、npmにとってのパッケージというのは`**package.json**`**というファイルの親ディレクトリに含まれるファイル群**である。

(例えばディレクトリ`~/projects/my-project/`に`package.json`があれば、`~/projects/my-project/`がそのプロジェクトのルートディレクトリ(一番根っこのディレクトリ)となる。npm のコマンドは常にルートディレクトリで実行することになる。)

cf. )

[

そろそろ適当に npm install するのを卒業する - Qiita

はじめに ネットに転がっている記事などで npm install のコマンドをよく分からず実行してきましたが、そろそろその状態から卒業したかったので備忘録をかねてこちらの記事を投稿しました。 npm install コマンドに...

![](JavaScript/Node/content/Attachments/apple-touch-icon-ec5ba42a24ae923f16825592efdc356f.png)<https://qiita.com/sugurutakahashi12345/items/3cc49926faeaf25d3051>

![](JavaScript/Node/content/Attachments/article-ogp-background-9f5428127621718a910c8b63951390ad.png)](<https://qiita.com/sugurutakahashi12345/items/3cc49926faeaf25d3051>)
