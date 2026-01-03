---
tags:
  - rails
  - activerecord
  - testing
  - gem
created: 2026-01-03
status: active
---

# 概要

デプロイとは、英語で配置・配備といった意味を持つ単語のこと。  
ITの文脈だと、実際の運用環境に配置・展開して実用に供することを意味する。  
具体的には、

- 本番環境のサーバーにsshでリモートログインして,

- github からあたらしいバージョンをpullして、

- assetをコンパイルしてサーバーの再起動。

といった作業のこと。  
これを自動CDツールであるCapistranoを用いると、

　ローカルのソースコードの中に実行させたいCapistranoの設定ファイルを  
埋め込み、記述することで、自らリモートのサーバーにログインすることなく、前述の手順をこなしてくれるというもの。

　つまり、ローカルの開発環境から、コマンド一つで、githubから本番サーバへのデプロイ作業を自動で行なってくれること。

```bash
# e.g. 本番環境でのデプロイ
$ bundle exec cap production deploy
```

## Capistranoのモデル

どういう枠組みなのかを理解する

- Capistrano

- ライブラリ

- 設定ファイル

- ホスト

### Capistrano

Capistranoはおおまかに以下の3要素から構成されています。

- capコマンド

- Capistranoのライブラリ

- デフォルトのデプロイタスク

わたしたちはCapistranoのライブラリやデフォルトのタスクを利用して設定ファイルを記述して、それをcapコマンドで実行します。すると、Capistranoがもろもろの操作を自動的に行なってくれます。Capistranoがオートメーションのツールであると言われるのはこのためです。

### ライブラリ

Capistranoは単なるフレームワークなので、みなさんが開発・利用しているアプリケーション固有のデプロイ方法や、サーバの情報などは含まれていません。皆さんの作業を自動化するためには、Capistranoを皆さん好みにカスタマイズする必要があります。

カスタマイズするにあたって、一度だけ使うものと再利用するものがあると思います。再利用性が高いものはライブラリと呼びます。具体的には以下の2つです。

Capistrano2の時は,Ruby用のデプロイツールだったらしい。

- Rubyライブラリ

- Capistrano拡張

### 設定ファイル

Capistranoのカスタマイズの際、一度だけ使う設定(例えばあるプロジェクトのサーバ情報、あるプロジェクト固有のタスク)は前述のライブラリではなく設定ファイルに記述します。具体的には以下の2つです。

- `config/deploy.rb`

- `config/deploy/<任意のステージ名.rb>`

「deploy.rb」はデプロイ等の共通的な設定や手順を書きます。「<任意のステージ名>.rb」は本番環境・テスト環境・開発環境などの環境ごとに異なる設定やタスクを書きます。

# Directory Structure

[

Structure

Capistrano uses a strictly defined directory hierarchy on each remote server to organise the source code and other deployment-related data. The root path of this structure can be defined with the configuration variable :deploy_to. Assuming your config/deploy.rb contains this: Then inspecting the directories inside /var/www/my_app_name looks like this: current is a symlink pointing to the latest release.

![](https://capistranorb.com/assets/favicon.ico)https://capistranorb.com/documentation/getting-started/structure/

![](https://cdn.dnsimple.com/assets/resolving-with-us/logo-dark.png)](https://capistranorb.com/documentation/getting-started/structure/)

## Capistranoのワークフロー

Capistranoを使うためには、いつ、何のために、どんな操作をしてどんなコードを書けばよいでしょうか？その全体の流れをおさらいしておき、それから具体的なコードと操作を覚えていきましょう。

- Capistranoのインストール

- 設定ファイルのひな形をつくる

- 設定ファイルのカスタマイズ

- capコマンドを実行する(bundle exec cap production deployみたいな)

以上の流れにそって、具体的な説明をしていきます。さっそくターミナルを開いて、みなさんの環境に置き換えながら、実際にCapistranoを使ってみましょう！

> 元記事

[

入門 Capistrano 3 ~ 全ての手作業を生まれる前に消し去りたい | GREE Engineering

この記事はGREE Advent Calendar 2013年の21日目です。お楽しみください！ こんにちは、 アゴひげがダンディーだと評判 の九岡です。GREEでは、JavaやScalaを布教するための土台を固めるため、デプロイや監視の仕組みづくりなどを横断的にやっています。今回はその過程で得られた知識を「Capistrano 3の入門記事」という形で共有させていただきます。 ...

![](test/Attachments/favicon.png)https://labs.gree.jp/blog/2013/12/10084/

![](test/Attachments/blog_ogp.jpg)](https://labs.gree.jp/blog/2013/12/10084/)

参考資料)

[https://pikawaka.com/rails/capistrano](https://pikawaka.com/rails/capistrano)

[https://qiita.com/YK0214/items/98bbdf7ce25c557c77a3](https://qiita.com/YK0214/items/98bbdf7ce25c557c77a3)

[https://autovice.jp/articles/145](https://autovice.jp/articles/145)

[https://qiita.com/YK0214/items/355ba23f7bf7758e232d](https://qiita.com/YK0214/items/355ba23f7bf7758e232d)

[https://qiita.com/YutoYasunaga/items/a8e56ef3c6a8ade06704](https://qiita.com/YutoYasunaga/items/a8e56ef3c6a8ade06704)

[https://qiita.com/take18k_tech/items/5710ad9d00ea4c13ce36#6-デプロイcapistrano](https://qiita.com/take18k_tech/items/5710ad9d00ea4c13ce36#6-%E3%83%87%E3%83%97%E3%83%AD%E3%82%A4capistrano)

[https://chroju.dev/blog/2014-04-12-post](https://chroju.dev/blog/2014-04-12-post)

[https://chroju.dev/blog/2014-04-06-post](https://chroju.dev/blog/2014-04-06-post)

[

GitHub - capistrano/rails: Official Ruby on Rails specific tasks for Capistrano

Rails specific tasks for Capistrano v3: Add these Capistrano gems to your application's Gemfile using require: false: Run the following command to install the gems: Then run the generator to create a basic set of configuration files: Require everything ( bundler, rails/assets and rails/migrations): Or require just what you need manually: # Capfile require 'capistrano/bundler' # Rails needs Bundler, right?

![](https://github.com/favicon.ico)https://github.com/capistrano/rails

![](test/Attachments/rails.png)](https://github.com/capistrano/rails)

## 1. まずは、開発環境側にgemをインストールする。

```Ruby
# Gemfile 

group :development do
  # 略

  gem "capistrano", require: false
  gem "capistrano-rails", require: false
  gem 'capistrano-rbenv'
  gem 'capistrano-rbenv-vars'
  gem 'capistrano3-puma'
end
```

capistranoとcapistrano-railsは、require: false にするっぽいよ。

その後

```Ruby
$ bundle install

# capistranoの設定ファイルの雛形をインストールできる。
$ bundle exec cap install

# option デフォルトだと、prodcution.rbとstaging.rbが生成されるが、
# productionだけに限定するオプション
$ bundle exec cap install STAGES=production
```

## 2. Capfileの設定

**インストールしたgemの中からCapistranoで読み込むgemを指定するファイル**  

Capistrano3からは汎用デプロイツールになったため、ruby/railsに固有のものは、ライブラリ化されたみたいです。なので必要に応じて取得してきます。

上のgemをインストールした場合には、下のようなものが必要になります。

(rubyとrails、pumaをアプリサーバ,Nginxでのリバースプロキシを想定)

```Ruby
# Load DSL and set up stages
require 'capistrano/setup'

# Include default deployment tasks
require 'capistrano/deploy'

# Load the SCM plugin appropriate to your project:
#
# require "capistrano/scm/hg"
# install_plugin Capistrano::SCM::Hg
# or
# require "capistrano/scm/svn"
# install_plugin Capistrano::SCM::Svn
# or
require 'capistrano/scm/git'
install_plugin Capistrano::SCM::Git

# Include tasks from other gems included in your Gemfile
#
# For documentation on these, see for example:
#
#   https://github.com/capistrano/rvm
#   https://github.com/capistrano/rbenv
#   https://github.com/capistrano/chruby
#   https://github.com/capistrano/bundler
#   https://github.com/capistrano/rails
#   https://github.com/capistrano/passenger
#
# require "capistrano/rvm"
# require "capistrano/chruby"
# require "capistrano/passenger"
require 'capistrano/rbenv'
require 'capistrano/bundler'
require 'capistrano/rails/assets'
require 'capistrano/rails/migrations'
require 'capistrano/puma'
install_plugin Capistrano::Puma
install_plugin Capistrano::Puma::Systemd
install_plugin Capistrano::Puma::Nginx

# Load custom tasks from `lib/capistrano/tasks` if you have any defined
Dir.glob('lib/capistrano/tasks/*.rake').each { |r| import r }
```

# Capistranoの設定(configuration)

## 3. config/deploy/production.rb

本番環境の設定を行う。(staging.rbならステージング環境について)

### 主な設定項目

1. 本番サーバへの接続先情報

2. sshログインに必要になる情報

3. (今回は書いてないが)そのステージでのみ実行したいタスク

```Ruby
# EC2サーバーへの接続について指定。

# webというプライベートドメイン名を指定している。これはIPだったら、sshの接続の仕方によって変動するが、
# 指定しているのはデプロイ先のサーバーの情報

# userはEC2サーバ上でログインしたいユーザ名を指定。
# 今回はルートの権限を持ったdeployユーザを新規に作成し、こちらで全て作業を行うようにしているため、
# 彼の名前と登録しました。

# roleでは、サーバとしての機能を指定するそうです。
server 'web', user: 'deploy', roles: %w{app db web}

# ローカルから、sshでログインする時について設定をしています。
# 鍵の指定はデフォルトだと.pemしか使えない。->適宜gemを入れてください。
set :ssh_options, {
	keys: [~/.ssh/id_rsa]
}
```

実際の環境は踏み台サーバーとか使用しているので、直接webサーバのパブリックIP指定して、鍵情報を記述して終わりとはならないと思います。  
それについて詳しくはこちらで、

[[Capistrano]SSHログインの接続設定(踏み台を含む)v3の罠](Capistrano/%5BCapistrano%5DSSH%E3%83%AD%E3%82%B0%E3%82%A4%E3%83%B3%E3%81%AE%E6%8E%A5%E7%B6%9A%E8%A8%AD%E5%AE%9A\(%E8%B8%8F%E3%81%BF%E5%8F%B0%E3%82%92%E5%90%AB%E3%82%80\)v3%E3%81%AE%E7%BD%A0%206d6bd88fe03c47769cdfebb1f6c80f09.html)

## 4. config/deploy.rb

**ここには共通のデプロイに関する設定を書く。**

### よく記述される内容としては

- アプリケーション名

- レポジトリ名

- 利用するSCM(Software Configuration Management)

- タスク

- それぞれのタスクで実行するコマンド

などが挙げられ、DSLで設定します。

## DSLについて

### 設定値の変更と取得(set/fetch)

もっとも、基本的な操作であり、変数の設定と参照によって、設定ファイルを記述していきます。

```Ruby
# 値の設定
set :名前, 値


# 値の参照
# 第二引数を取る時、第一引数にとった値がなければ、その値をdefault値にする。
# (ソースコードで||=使ってそうな気がするけど、今度調べる。)
fetch :名前 
fetch(:special_thing, 'some_default_value')


e.g.)
set :repo_url, 'git@github.com:mumoshu/finagle_sample_app' 
fetch :repo_url
#=> "git@github.com:mumoshu/finagle_sample_app"**
```

[[Capistrano]append とset](Capistrano/%5BCapistrano%5Dappend%20%E3%81%A8set%2094868bf3cba74949ac01aff587a16616.html)

### 実際にEC２本番環境用に設定したファイル。

```Ruby
# config.deploy.rb

# config valid for current version and patch releases of Capistrano
lock '~> 3.17.1'

set :application, 'recorda-me'
set :repo_url, 'git@github.com:syosyo10337/recorda-me.git'

set :branch, 'main'
set :deploy_to, '/var/www/recorda-me'
set :rbenv_ruby, File.read('.ruby-version').strip
set :keep_releases, 5

append :linked_files, 'config/master.key'
append :linked_dirs, 'log', 'tmp/pids', 'tmp/cache', 'tmp/sockets', 'node_modules'

# Nginxの設定ファイル名と置き場所を修正
# この部分の記述のおかげで、
# リモートのnginx/conf.d/などの編集しにいく必要がなくなる？
set :nginx_config_name, "#{fetch(:application)}.conf"
set :nginx_sites_enabled_path, '/etc/nginx/conf.d'
# Default value for default_env is {}
# set :default_env, { path: '/opt/ruby/bin:$PATH' }

# set :ssh_options, verify_host_key: :secure
```

### 各種設定項目についての説明。

```Ruby
# config/deploy.rbにて

# capistranoのバージョン固定
lock '3.14.1'

# デプロイするアプリケーション名
set :application, 'golfour'
# cloneするgitのレポジトリ
set :repo_url, 'git@github.com:app/app_aws.git'
# deployする先ブランチ。デフォルトはmaster/
set :branch, 'master'
# deploy先のディレクトリ。
set :deploy_to, '/var/www/rails/app'

# 保持するバージョンの個数。過去５つまで履歴を保存。
set :keep_releases, 5

# rubyのバージョン
set :rbenv_ruby, '2.5.1'

# 出力するログのレベル。
set :log_level, :debug
```

参考)

困った時はいつも公式が助けてくれる。

[

Configuration

Configuration variables can be either global or specific to your stage. Each variable can be set to a specific value: A value can be retrieved from the configuration at any time: New in Capistrano 3.5: for a variable that holds an Array, easily add values to it using append.

![](https://capistranorb.com/assets/favicon.ico)https://capistranorb.com/documentation/getting-started/configuration/

![](https://cdn.dnsimple.com/assets/resolving-with-us/logo-dark.png)](https://capistranorb.com/documentation/getting-started/configuration/)

- li[nked_filesって何を設定するの？](Capistrano/%5BCapistrano%5Dappend%20%E3%81%A8set%2094868bf3cba74949ac01aff587a16616.html)

## コマンドを実行。

```Bash
$ bundle exec cap prodcution deploy
```

上のように、railsの指定した環境をデプロイすると、

デフォルトで行われるタスクは以下の通りです。

- releases、sharedなどディレクトリの作成

- レポジトリからgit clone

- linked_files、linked_dirsの存在確認とシンボリックリンク作成

- currentディレクトリへのシンボリックリンク作成

- 最古世代の削除、クリーンナップ

## ****Capistranoのディレクトリ構成****

Capistranoでデフォルトのデプロイを行った時、デプロイ先サーバーに作成されるディレクトリについてdeploy.rbの`deploy_to`で指定したディレクトリ内に、次の3つのディレクトリが作られる。

- releases : デプロイした内容を世代管理する

- shared : バージョンに関係なく参照される内容を保存する。

- current : releasesの最新世代とsharedのシンボリックリンクが置かれる

> • `**shared**` contains the `**linked_files**` and `**linked_dirs**` which are symlinked into each release. This data persists across deployments and releases. It should be used for things like database configuration files and static and persistent user storage handed over from one release to the next.  
>   
> [雑な訳文]  
> `shared`ディレクトリには、`linkded_files`と`linked_dirs`が含まれます。このディレクトリとファイルに設定されたファイル群は、シンボリックリンクとしてそれぞれのリリース(デプロイしてきたバージョン)にて参照されるようになってます。  
> ここには, database.ymlなどの設定ファイルや、静的で持続性のあるユーザストレージ(つまり、デプロイされるバージョンごとに変更されることがないファイル群)を置いておくために使うべきです。

cf)

[

Structure

Capistrano uses a strictly defined directory hierarchy on each remote server to organise the source code and other deployment-related data. The root path of this structure can be defined with the configuration variable :deploy_to. Assuming your config/deploy.rb contains this: Then inspecting the directories inside /var/www/my_app_name looks like this: current is a symlink pointing to the latest release.

![](https://capistranorb.com/assets/favicon.ico)https://capistranorb.com/documentation/getting-started/structure/

![](https://cdn.dnsimple.com/assets/resolving-with-us/logo-dark.png)](https://capistranorb.com/documentation/getting-started/structure/)

[

Capistrano3がわからんので今一度イチから考えなおしてみる - chroju.dev/blog

前回Capistranoが上手くいかないというエントリーを上げてから1か月。いまだにハマってしまっている......。何が悪いの皆目検討もつかない、というほどではないのだが、なんというか、雲を掴んでいるような状態ではある。一旦Capistranoについて整理してみるべきなんだろう。 そもそもCapistranoとは何をしてくれるツールなのか？ ...

![](https://chroju.dev/favicon-16x16.png)https://chroju.dev/blog/2014-04-06-post

![](test/Attachments/Capistrano3がわからんので今一度イチから考えなおしてみる.png)](https://chroju.dev/blog/2014-04-06-post)

### Sharedに入れるファイルのベストプラクティス

とりあえず、

```Ruby
append :linked_files, 'config/master.key'
append :linked_dirs, 'log', 'tmp/pids', 'tmp/cache', 'tmp/sockets', 'node_modules'
```

/master.keyと node_modulesは確実に入れておきたい。

master.keyはそもそもgithubにあげないから。nodeは容量大きいから？

cf)大変参考になった記事

[

Capistrano を導入する(メモ)

Capistranoを導入してみます。前回作成した仮想マシンをターゲットに、デプロイします。 bundle exec rails sで、いつもの「Yay!

https://www.ccbaxy.xyz/blog/2020/03/29/ruby34/#can-kao

