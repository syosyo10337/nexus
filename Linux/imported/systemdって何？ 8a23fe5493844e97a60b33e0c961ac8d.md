 

# systemdって何？

---

参考にしたい記事

[

【Linux】systemdとsystemctlコマンド：サービスの自動起動、停止、再起動 | OFFICE54

systemdはカーネルによって最初に起動されるプログラムです。一番最初に起動するのでプロセスIDは１です。 サービスやデーモンの起動などを管理するプログラムであり、すべてのデーモンを管理するデーモンとも言えます。いわばデーモンの親であり、その他のデーモンは子です。 ...

https://office54.net/iot/linux/linux-systemd-systemctl#:~:text=systemctl%E3%82%B3%E3%83%9E%E3%83%B3%E3%83%89-,systemctl%E3%82%B3%E3%83%9E%E3%83%B3%E3%83%89%E3%81%A8%E3%81%AF,%E7%A2%BA%E8%AA%8D%E3%81%AA%E3%81%A9%E3%81%8C%E3%81%A7%E3%81%8D%E3%81%BE%E3%81%99%E3%80%82

![](Linux/imported/Attachments/systemd.png)](https://office54.net/iot/linux/linux-systemd-systemctl#:~:text=systemctl%E3%82%B3%E3%83%9E%E3%83%B3%E3%83%89-,systemctl%E3%82%B3%E3%83%9E%E3%83%B3%E3%83%89%E3%81%A8%E3%81%AF,%E7%A2%BA%E8%AA%8D%E3%81%AA%E3%81%A9%E3%81%8C%E3%81%A7%E3%81%8D%E3%81%BE%E3%81%99%E3%80%82)

[

Railsで始めるsystemd入門

puma使っていますか？ pumaから-dオプションが消されて１年以上経ちますが(新参者なので当時のことは知らない)、今まではpuma-daemonを使って起動をしておりました。 ですが、今日からはsystemdを使って起動しようと思います。 どうやらdeamonオプションでの起動がうまく行かないケースがあるらしい。 pumaのコマンド実行後、デーモン化が完了する前にSIGHUPを送信してしまっており、そのおかげでデーモン化しようとしていたプロセスが中断されている。 みたいな感じ。 こんな原因で、削除されたわけですが、当然そこらのコマンドを愛用していた方々はたくさんいたわけでそれに対してpuma-daemonなんていう-dオプションを復活できる（実際にはpuma.rbでdemonaizeメソッドが使えるようになる）gemが作成されたわけでしょう。 でも、daemon化なんて環境に依存するんだからそれぞれでやったほうが良いでしょう。 必要なのは設定ファイルとsd_notifyというGEMだけなので気軽に作ってみよう。 [Unit] Description =Puma HTTP Server After =network.target [Service] Type =notify WatchdogSec = 10 User =app-user WorkingDirectory =/var/www Environment = "PUMA_DEBUG=1" Environment = "PATH=/usr/bin:/usr/local/sbin:/root/.rbenv/shims:/root/.rbenv/bin:/root/.nvm/versions/node/v12.16.2/bin:/root/.local/bin:/root/bin" ExecStart =/home/app-user/.rbenv/shims/bundle exec puma -e production Restart =always [Install] WantedBy =multi-user.target sd_notifyはsystemdへ起動完了通知を行うために必要です。様々な言語で存在するようです。 入れていないといつになってもstartコマンドが終わりません。 # 設定ファイルの再読み込み systemctl daemon-reload #

![](Linux/imported/Attachments/logo-transparent.png)https://zenn.dev/ymasutani/articles/ce42131f0e7b1a

![](Linux/imported/Attachments/og-base_z4sxah.png)](https://zenn.dev/ymasutani/articles/ce42131f0e7b1a)

Capistrano/puma等の文脈で参考にしたい記事)

[

puma/systemd.md at master · puma/puma

systemd is a commonly available init system (PID 1) on many Linux distributions. It offers process monitoring (including automatic restarts) and other useful features for running Puma in production. Below is a sample puma.service configuration file for systemd, which can be copied or symlinked to /etc/systemd/system/puma.service, or if desired, using an application or instance-specific name.

![](https://github.com/favicon.ico)https://github.com/puma/puma/blob/master/docs/systemd.md

![](Linux/imported/Attachments/7510b380-cfe5-11e9-8391-85577ac28ede.png)](https://github.com/puma/puma/blob/master/docs/systemd.md)

# systemdとは

systemdは**カーネルによって最初に起動されるプログラム**です。一番最初に起動するのでプロセスIDは１です。

**サービスやデーモンの起動などを管理するプログラム**であり、すべてのデーモンを管理するデーモンとも言えます。いわばデーモンの親であり、その他のデーモンは子です。

### 処理の単位

---

systemdは_**unit（ユニット）**_という単位でサービス（処理）を管理しています。

.service/.targetのついたファイルがunitの設定ファイルになります。

### 2箇所のファイルの保存先

1. /usr/lib/systemd/system/

2. /etc/systemd/system/

１番は初期の保存先であり、ここのファイルを編集することはありません。

２番には**初期設定を上書きする場合や自作の設定ファイルを作成したい場合**に、それらファイルを置きます。(capistrano-pumaの `puma:systemd:config`タスクを実行する時に、設定ファイルをアップロードし、2のディレクトリに移動してくれます。

### ログを表示する。

以下のコマンドで、起動したサービスやデーモンのログを表示させます。

```Bash
$ sudo journalctl -f -u サービス名
```

# systemctlコマンド

CentOSやRedhat７系から利用可能な、systemdをコントロールするためのコマンドです。

実際には、

systemctlで**サービスの起動・停止や自動起動の設定、サービス状態の確認**  
などができます。

## 基本公式

systemctl [opt] command [service_name]

- [命令] 説明  
    start サービスの開始  
    stop サービスの停止  
    restart サービスの再起動  
    reload サービスの再読み込み  
    status サービスの状態表示  
    enable サービスの自動起動オン  
    is-enable サービスの自動起動確認  
    disable サービスの自動起動オフ  
    daemon-reload 設定ファイルの再読み込み