 

# capistrano-pumaのタスクの理解

---

[

capistrano-puma/systemd.rake at master · seuros/capistrano-puma

You can't perform that action at this time. You signed in with another tab or window. You signed out in another tab or window. Reload to refresh your session. Reload to refresh your session.

![](https://github.com/favicon.ico)https://github.com/seuros/capistrano-puma/blob/master/lib/capistrano/tasks/systemd.rake

![](capistrano-puma.png)](https://github.com/seuros/capistrano-puma/blob/master/lib/capistrano/tasks/systemd.rake)

## `cap <ステージ名> puma:config`

これによって、　リモートサーバのshared/puma.rbというcapistrano経由のpuma設定ファイルが、自動で中身もある程度書き込まれて設定される。

## `cap <ステージ名> puma:systemd:config`

このコマンドを使用すると、必要なsytemd用のファイルも自動で、置いてかつ、置くべき場所に上書きで置いてくれる？

/etc/systemd/system/<アプリ名> このファイルに置かれています。

自分のアプリの場合には、puma_<applicationで設定した名前>_<production環境?>

という名前のファイルが設定されていました。

puma_recorda-me_production.service

==github見てるの普通にinstallとかな気もする。検証して==　

以下の設定をすることで、

`puma:restart`--systemd経由で、プロセスを起動するコマンド

が正常に働いてくれるはず。

参考)

[

capistrano-puma/systemd.rake at master · seuros/capistrano-puma

You can't perform that action at this time. You signed in with another tab or window. You signed out in another tab or window. Reload to refresh your session. Reload to refresh your session.

![](https://github.com/favicon.ico)https://github.com/seuros/capistrano-puma/blob/master/lib/capistrano/tasks/systemd.rake

![](capistrano-puma.png)](https://github.com/seuros/capistrano-puma/blob/master/lib/capistrano/tasks/systemd.rake)

[

puma/systemd.md at master · puma/puma

systemd is a commonly available init system (PID 1) on many Linux distributions. It offers process monitoring (including automatic restarts) and other useful features for running Puma in production. Below is a sample puma.service configuration file for systemd, which can be copied or symlinked to /etc/systemd/system/puma.service, or if desired, using an application or instance-specific name.

![](https://github.com/favicon.ico)https://github.com/puma/puma/blob/master/docs/systemd.md

![](7510b380-cfe5-11e9-8391-85577ac28ede.png)](https://github.com/puma/puma/blob/master/docs/systemd.md)

[

pumaがdaemonとして動かせなくなったので、systemdで動かすときのpuma.serviceの書き方 | takeshit.info

Railsをコンテナ以外のEC2などで実行しているみなさん、capistranoやpuma使っていますか！？ 今回はdaemonizeオプションが削除されたpumaをタスクマネージャーであるsystemdで動かすためのtipsです。 Railsを6.1に上げたらpumaのバージョンも当然上がっていて、bash上でpumaを直接バックグランド実行できなくなっており、様々なdocumentを読んでたどり着いたのが今回の設定です。 最適な設定になっているわけではないと思いますが、どなたかの役に立てたら幸いです。 2021.06.18 更新 capistrano3-pumaのコマンド実行時の挙動について追記 2021.07.08 更新 環境変数の注意事項について、コマンド備忘について追記 Railsのpumaをbackground実行するdaemonizeオプションが削除されたため、pumaをsystemdで動かす際の備忘録です capistranoでデプロイした時にpumaのプロセスをどう管理するか（restartするか）迷ったので、capistrano前提になっています capistranoの基本的なデプロイができる前提で、pumaのプロセスをsystemdで管理するための設定を記載します コピペして使える設定ファイルの情報ではなく、各プロジェクトにあった設定の書き方がわかるような内容を目指します rails 6.1 puma 5.1.1 capistrano 3.15.0 capistrano-rails 1.6.1 capistrano-rbenv 2.2.0 capistrano3-puma 5.0.2 sd_notify 0.1.0 以下をGemfileに追加 gem 'sd_notify' group :development do gem 'capistrano' gem 'capistrano3-puma' gem 'capistrano-rails' gem 'capistrano-rbenv' end ※ sd_notifyは状態変更をタスクマネージャー（今回はsystemd）に通知するためのツールです。 様々な言語で実装されています。 ※ 2021.06.18 訂正 以下2のコマンドを叩いてもファイルがアップロードされないかもしれません。

![](https://takeshit.info/wp-content/uploads/2020/08/cropped-android-chrome-512x512-1-192x192.png)https://takeshit.info/setting_up_puma-service_to_run_puma_with_systemd/

![](https://takeshit.info/wp-content/uploads/2020/08/IMG_5309.jpg)](https://takeshit.info/setting_up_puma-service_to_run_puma_with_systemd/)

関連記事)

[deployタスク正常終了でも、daemon再起動していない？](deploy%E3%82%BF%E3%82%B9%E3%82%AF%E6%AD%A3%E5%B8%B8%E7%B5%82%E4%BA%86%E3%81%A7%E3%82%82%E3%80%81daemon%E5%86%8D%E8%B5%B7%E5%8B%95%E3%81%97%E3%81%A6%E3%81%84%E3%81%AA%E3%81%84%EF%BC%9F%20628ac294cf2246679a7996113e95f917.html)