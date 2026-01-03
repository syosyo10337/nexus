---
tags:
  - database
  - redis
  - cache
created: 2026-01-04
status: active
---

![](Import%20tech/Attachments/redis-original-wordmark.svg)

# Redis

セッション管理にも、キャッシュストアにも使える便利なインメモリデータストア。ができるソフトウェア

[

rails のセッション管理に redis を導入する

以前、 rails に redis を導入するという記事を書きました。その際は、rails の提供するキャッシュの仕組み( Rails.cache)に、redis を使用しました。 今回は、セッション管理に redis を適用してみます。 事前準備として、devise gem を使用して、ログインを行うアプリケーションを作ってあるものとします。やり方は、本ブログでたくさん扱っているので、参照ください。 Octo's blog - devise の関連記事 redis サーバーは、 localhost:6379 でアクセスできるものとします。 Gemfile に gem 'redis-rails'を記述して bundle install を実行します。 config/environments/[実行環境(developmentとか)].rbのファイルに以下を記述します。今回は、 config/environments/development.rb への記述を例にとります。 'redis://localhost:6379/0/cache'の記述は、以下のように分解できます、 'redis://[ホスト名]:[ポート]/[db]/[namespase]' 。 また、 redis-store/redis-rails では、以下のようにハッシュで渡す書き方も紹介されています。redis サーバーにパスワード設定があるなら、以下の書き方をしてゆくことになりそうです。 今回は、以下の記述を採用します。 bundle exec rails s で起動し、適当にログインしてみます。 コンソールから、以下のように redis の持っているキーを確認します。 2::

https://www.ccbaxy.xyz/blog/2020/06/21/ruby47/

![](Import%20tech/Attachments/banner.jpg)](https://www.ccbaxy.xyz/blog/2020/06/21/ruby47/)

[

RailsのセッションをRedisに保存する (2)

前回の記事では Rails のセッションを redis-store/redis-rails を使って Redis に保存するところまでを試しました。 Rails のセッションを Redis に保存する (1) | yosuke.saito 今回は Rails の認証ライブラリで有名な plataformatec/devise と組み合わせたときの挙動を確認してみます。 Rails のプロジェクトは前回作成したものを引き続き使用します。 まずは Devise をインストールします。Gemfile に gem 'devise'を書いて bundle installを実行します。 次に Devise の README に従い rails g devise:installを実行し、 config/environments/development.rb を次のように編集します。 最後に Devise で認証するモデルを作成します。今回は User モデルとします。 これで Devise の準備が完了しました。 次に、これまで作成してきた Todo 管理アプリケーションに変更を加え、

![](https://saitoxu.io/favicon-32x32.png?v=cb8d9fc31d3ef29d45867d32ffc7a1c5)https://saitoxu.io/2017/11/redis-rails-2

![](Import%20tech/Attachments/blog_ogp_bg.png)](https://saitoxu.io/2017/11/redis-rails-2)

[

【Rails入門】Redisでセッションを高速化しよう！キャッシュも解説 | 侍エンジニアブログ

こんにちは！システムエンジニアのオオイシです。 Redisを使うとRuby on Railsの セッション管理を高速化 出来ることをご存知ですか？ Redisは メモリ上にデータを保存する超高速のデータベース の一種です。 この記事では、 といった、基本的な解説から などの応用的な使い方関しても解説していきます。 今回はそんなRedisを使った Ruby on Railsの高速化方法 についてわかりやすく解説します！ Redisとは、データをメモリ上に保存するタイプの インメモリ型のKVS(Key Value Store) です。 KVSとは、主として キーとバリューのシンプルなデータを保存するタイプのデータベースのことで、RDB(Relational Database)のような 複雑なデータは扱えない反面、 高速に動作 するという特徴があります。 データの 永続化を目的とする場合は向いていません。 そんな特徴から主な利用用途は、 などの 一時的なデータの保存先 としてとても有効です。 その有用性の証拠として、AWSなどの クラウドサービスのプロダクト としてRedisが使われているのですよ！ そんなRedisをRuby on Railsで使うことのメリットについて次項で解説していきます。 Redisはシンプルでかつ高速なデータベースであるため、 などの 一時的なデータ保存先 としてRedisを利用するとRailsを高速化することができます！ さらに、セッションデータの場合は、Redisへ変更することで セッションハイジャックなどのセキュリティリスク を軽減できます！ 次項ではRailsのセッション管理をRedisに変更する方法について紹介していきたいと思います！ 各種環境に応じた インストール方法

![](https://www.sejuku.net/blog/wp-content/themes/voice_child/images/favicon/favicon.ico)https://www.sejuku.net/blog/58218

![](http://samurai-blog-media.s3.ap-northeast-1.amazonaws.com/blog/wp-content/uploads/2018/06/rails_redis_1.jpg)](https://www.sejuku.net/blog/58218)

aws本のソースコード

[

aws-intro-sample/config at master · nakaken0629/aws-intro-sample

Rails Tutorial for AWS Intro. Contribute to nakaken0629/aws-intro-sample development by creating an account on GitHub.

![](https://github.com/favicon.ico)https://github.com/nakaken0629/aws-intro-sample/tree/master/config

![](Import%20tech/Attachments/aws-intro-sample.png)](https://github.com/nakaken0629/aws-intro-sample/tree/master/config)

railsのキャッシュ機構について

[

Rails のキャッシュ機構 - Railsガイド

config.action_controller.perform_caching値の変更は、Action Controllerコンポーネントで提供されるキャッシュでのみ有効です。つまり、後述する 低レベルキャッシュ の動作には影響しません。 ...

![](Import%20tech/Attachments/favicon%201.ico)https://railsguides.jp/caching_with_rails.html

![](Import%20tech/Attachments/cover_for_facebook.png)](https://railsguides.jp/caching_with_rails.html)