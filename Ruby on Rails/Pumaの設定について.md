---
tags:
  - rails
  - puma
  - config
created: 2026-01-04
status: active
---

🐅

# Pumaの設定について

基本的にはconfig/puma.rbの内容を書き換えれば良いのですが、、

[

Pumaの使い方 まとめ - 猫Rails

自分用のメモを公開したものです。ドキュメント/ソースコード等をまとめただけで試していないコードも多いので、信頼性は低いです。 新規にRailsアプリ作るならpuma使えば良さそう。でも、unicornやpassengerから乗り換えるほどではないかも(ケースバイケースだがパフォーマンスの顕著な差はないっぽい) Heroku使う場合はメモリ使用量が少なくて良さそう。メモリ500MBプランだとunicornで2worker動かすの辛かった記憶 workerプロセスが2つあったら、2つのリクエストを同時に処理できる メリット シンプル(理解しやすい + コードが綺麗になりやすい) スレッドの知識がなくても安心 スレッドセーフなコードを意識しなくても良い(普通にRailsアプリを書いていれば問題なさそうだけど、スレッドの知識が浅いので不安) スレッドが2つあったら、2つのリクエストを同時に処理できる 実際には本番環境ではマルチプロセス + マルチスレッドで動かす(Clustered mode)。workerプロセスが2つ + スレッドが2つだったら、4つのリクエストを同時に処理できる ただし実際には、MRIではGILがあるため1プロセスで1スレッドしか実行されない メリット (MRIだとしても)IO時に別スレッドに処理させることができる スロークライアントの影響を受けにくい メモリ使用量が少ない(参考: http://puma.io/) 回線の遅いクライアント(3Gのモバイル端末など) Pumaはスレッドベースなので、IOの際に(MRIだとしても)別のスレッドに処理をさせることができる。なのでネットワークIOが長いスロークライアントには都合がよい $ bundle install $ rails s 3つの起動コマンド(rails s、pumactl start、puma)は、以下の設定ファイルを自動で読み込む 環境指定がない場合: config/puma.rb 環境指定がある場合: config/puma/ .rb pumactl -F config/puma.rb startのように、オプションで指定することも可能 URI指定しかないので、シンプル デフォルト: "tcp://0.0.0.0:9292" ワーカー数を指定するとclustered modeになる master processからworkerをforkする workerプロセスはそれぞれスレッドプールを持つ デフォルト: 0 プールで利用できるスレッドの数 スレッド数はtrafficによって自動で増減する maxを大きくしすぎるとマシンリソースを食いつくしてしまう可能性があるので、注意 ここで指定したスレッド以外にも、スロークライアントの処理等のpuma自体の内部的な処理にもスレッドが作られるので注意。なので-t 1:1で指定しても、実際には7スレッドくらいが作成される。 デフォルト: 0:16 デフォルト: false pidfile、stdout_redirectと一緒に使う daemonize true preload_app!

![](https://nekorails.hatenablog.com/icon/favicon)https://nekorails.hatenablog.com/entry/2018/10/12/101011#unicorn%E3%81%AF%E3%83%97%E3%83%AD%E3%82%BB%E3%82%B9%E3%83%99%E3%83%BC%E3%82%B9

![](Import%20tech/Attachments/1539522712.png)](https://nekorails.hatenablog.com/entry/2018/10/12/101011#unicorn%E3%81%AF%E3%83%97%E3%83%AD%E3%82%BB%E3%82%B9%E3%83%99%E3%83%BC%E3%82%B9)