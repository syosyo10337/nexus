 

# deployタスク正常終了でも、daemon再起動していない？

## 症状

```Ruby
$ cap production deploy
```

をした後に、

すべてのタスクが見た目上うまく成功しているのですが、

実際にサーバーにはアクセスできない。

ただし、サーバーが立ち上がらない。.

## 原因

pumaの5.1から、daemonizeオプションが*なくなった。*  
capistranoを使って、デプロイをする際に、pumaをデーモン化(バックグランドで実行させ続ける)したいならば、LinuxOSなどによって提供される。systemdを利用することが推奨されるようになったようです。

そのため、

仮に、記事などで以下のような記述を見ても、使わない方が良いでしょう。

```Ruby
daemonnize true
```

## 対応  
pumaの設定(systemdを用いたdaemonでの起動)

参考)

[systemdって何？](../Linux/systemd%E3%81%A3%E3%81%A6%E4%BD%95%EF%BC%9F%208a23fe5493844e97a60b33e0c961ac8d.html)

1. capistrano-puma gemを導入する。

```Ruby
# Gemfile

# 当該の記述
gem 'capistrano3-puma'
```

capistrano-pumaを使うと、タスクコマンドでうまいことやってくれそう。

2. Capfileの追記する。

```Ruby
# Capfile

require 'capistrano/puma'
install_plugin Capistrano::Puma
install_plugin Capistrano::Puma::Systemd
install_plugin Capistrano::Puma::Nginx
```

3. systemdの設定ファイルを導入する。

```Ruby
# 多分リモートで
After installing or making changes to puma.service
systemctl daemon-reload

# Enable so it starts on boot
systemctl enable puma.service

# Initial startup.
systemctl start puma.service

# Check status
systemctl status puma.service

# A normal restart. Warning: listener's sockets will be closed
# while a new puma process initializes.
systemctl restart puma.service
```

4. 同様にして、socketバージョンも起動させる。

5. `$ systemctl status`によって、どちらのやつもしっかりいけてることを確認する。

### それでエラー？

Nginxもpumaも起動しているのに、なぜかアクセスできない.

- Nginxのログの確認の仕方。

/etc/nginx/nginx.confで、設定しているエラーログを拾いにいこう。

今回は/var/log/nginx/error.log;でした。