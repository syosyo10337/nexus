 

# rackとは

[![](Screen_Shot_2022-11-05_at_21.04.43.png)](rack%E3%81%A8%E3%81%AF/Screen_Shot_2022-11-05_at_21.04.43.png)

rackはそもそもrubyで書かれた様々なwebフレームワークとwebサーバーをrack自身の柔軟性によって繋いでくれるもので、webサーバ、webフレームワークのどちらが変わってもサイトとしてうまく機能をするようにしてくれているものです。

RackはRailsのようなRuby製のwebフレームワークとアプリケーションサーバーの両方が話せる共通言語のようなものだと考えてください。両者が共通言語を理解できるので、RailsはUnicornと話せますし、UnicornはRailsと話せます。しかも、RailsもUnicornも相手のことを知っておく必要は全くありません。

rails　sでrailsを立ち上げたときは特にwebサーバが立ち上がっている訳ではありませんが、rackがもつ柔軟性によってrailsがうまくリクエストを返せるようになっているので、ローカルで立ち上がっています。

[

`rails s`読んだ - AnyType

rails sで Railsサーバーが起動するまでに何が起きているのかを紐解くことで Railsとは何なのかを理解していきたい。今回読んでいく ソースコードのコミットは 2d9b9fb5b5f6015e66d3ad5cb96bc1ba117fd626 だ。 bin/rails sがユーザーによって実行される。 Gemfileで管理されるrubygemをrequireする。 Rails::CommandsTasks#serverを実行する。 config/application.rbをrequireする。Railsを構成する各rubygemのrailtieをrequireする。各rubygemのinitializerが登録される。 config.ruが実行される。 登録されたinitializerが実行される。 RailsアプリケーションがRackアプリケーションとして起動する。 まずbin/ railsを見る。bin/ railsは rails newを実行したときに生成されるのだが、このひな形は railties/lib/ rails/generators/ rails/app/templates/bin/ rails にある。 config/boot.rbと rails/commands.rbを見る。 config/boot.rbはGemfileにあるgemをrequireするようだ。 rails sと実行するとaliasesの中から"server"という文字列を取得してrails serverを実行することになる。 rails/commands/commands_tasksを見る。 #parse_commandは--versionや--helpをそれぞれ"version"と"help"というコマンドに変換するもの。それ以外はそのまま返す。 COMMAND_WHITELISTに含まれていれば実行、そうでなければエラーを出力する。 今回は"server"がcommandに入るのでsend("server")が実行され、#serverが実行されることになる。 #set_application_directory!はconfig.ruがないディレクトリからでもrails sを実行できるようにするためのものらしい。 APP_PATHbin/railsの中で代入されたconfig/application.rbなので、require "config/application"をserver.startの前に実行している。 rails/all.rbを見る。 rails.rbを見る。 ここにはRails.application, Rails.configuration, Rails.envなどの重要なメソッドが定義されているため、登場次第また見ていくことにする。 rails/all.rbと rails.rbについて見たので、config/applicationに戻る。 Bundler.require(*Rails.groups) module SampleApp class Application < Rails::Application config.active_record.raise_in_transactional_callbacks = true end end Rails.groupsは上述したrails.rbで定義されているのでさっそく見る。 Rails.groupsはRails.envの値に合わせてBundlerが読みこむべきgroupを返す。 Rails.envは環境変数 "RAILS_ENV"または"RACK_ENV"から実行環境を返す。 config/application.rbに戻る。 module SampleApp class Application < Rails::Application config.active_record.raise_in_transactional_callbacks = true end end SampleApp::ApplicationがRails::Applicationを継承するとき、以下のような実装によってRails::Application.inheritedが呼ばれ、Rails.app_classがSampleApp::Applicationとなる。 サーバー起動前にどういった設定を読み込んでいるか見たので、サーバーの起動について詳細に見ていく。 Rails::Serverは ...

![](Ruby%20on%20Rails/Attachments/favicon.png)https://naoty.hatenablog.com/entry/2015/01/10/215538

![](1420966302.png)](https://naoty.hatenablog.com/entry/2015/01/10/215538)

[

Rails開発におけるwebサーバーとアプリケーションサーバーの違い（翻訳） - Qiita

先日スタック・オーバーフローでこんな質問に回答しました。 webサーバー、アプリケーションサーバー、Rackといった仕様や概念と、WEBrick、Unicorn、Pumaといった実装の関係が頭の中で結びつきません ...

![](Ruby%20on%20Rails/Attachments/production-c620d3e403342b1022967ba5e3db1aaa%204.ico)https://qiita.com/jnchito/items/3884f9a2ccc057f8f3a3

![](article-ogp-background-9f5428127621718a910c8b63951390ad%208.png)](https://qiita.com/jnchito/items/3884f9a2ccc057f8f3a3)

もっと具体的に言えば、NginxはリクエストをUnicornに渡します。UnicornはリクエストをRackに渡します。RackはリクエストをRailsのrouterに渡します。routerはリクエストを適切なcontrollerに渡します。そしてレスポンスが逆の順番で返されます。