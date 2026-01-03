---
tags:
  - cloud
  - heroku
  - paas
created: 2026-01-04
status: active
---

![](Import%20tech/Attachments/heroku-plain.svg)

# Heroku コマンド

---

### 基本的なコマンド(ver確認/初期設定)

```Shell
#(0)ヘロクのバージョン(インストール状況)確認コマンド
$ heroku --version 
#(1)CLI上でログイン- (オプション: -i/--interractive)
$ heroku login -i 

#(2)Heroku上にアプリケーションを作成します
$ heroku create 
#(3)gitを使ってherokuにデプロイ
$ git push heroku main 

#アプリのログを一覧表示する。
$ heroku logs 

#コマンドリスト
$ heroku help
```

アプリを作って、herokuにデプロイしたい時は、(0 )~(3)の手順でできるはず

---

### その他コマンド

- rename

```Shell

#アプリ名のサブドメイン部を変更
$ heroku apps:rename 新しい名前 --app 古い名前 
```

アプリのサブドメイン(〇〇.herokuapp.com)の部分を変更する。—appオプションをつけると今そのアプリのディレクトリの外にいても変更元を指定できる

- メンテモード

```Shell
$ heroku maintenance:on
```

- heroku上でコマンドを実行

```Shell
$ heroku  run コマンド名

ex)$ heroku run rails db:migrate 
#本番環境でデータベースが違う場合、そちらでもテーブルを作成する必要がある
```

- アプリとリモートリポジトリを削除

```Shell
$ heroku apps:destroy --app アプリ名
#heroku app:infoでアプリ名を確認できる。
```

---

[

Heroku CLI コマンド

この記事の 英語版 に更新があります。ご覧の翻訳には含まれていない変更点があるかもしれません。 これらは、各コア Heroku CLI コマンドのヘルプテキストです。このテキストは、 heroku help​、 heroku --help​、または heroku -h ​ を使用してターミナルでも表示できます。 アプリにアクセスできるユーザーを一覧表示します。 USAGE $ heroku access OPTIONS -a, --app=app (required) app to run command against -r, --remote=remote git remote of app to use --json output in json format アプリに新しいユーザーを追加します。 USAGE $ heroku access:add EMAIL OPTIONS -a,

![](Import%20tech/Attachments/favicon.ico)https://devcenter.heroku.com/ja/articles/heroku-cli-commands

![](Import%20tech/Attachments/og.png)](https://devcenter.heroku.com/ja/articles/heroku-cli-commands)