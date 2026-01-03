---
tags:
  - aws
  - ec2
created: 2026-01-03
status: active
---

![](AWS/Attachments/apache-original-wordmark.svg)

# Apache使ってみた

---

その前に、AWSのインスタンスにログイン接続しておこう

```Shell
% ssh -i keyのパス名 ec2-user@インスタンスパブリックIP/パブリックDNS

#この時、rootじゃなくユーザでログインしている

#接続を切る時は、
#ctrl + Dもしくはlogout/exitコマンドを入力
```

---

** ポート番号とプログラムを確認する

```Shell
$ sudo lsof -i -n
#lsof -LiSt Open File (オープンしているファイルを一覧表示する)
#-i ネットワークソケットを対象に
#-n ホスト名の代わりにIPを表示
#-p　プロセスID 表示対象のプロセスIDを指定
```

LISTEN —他のコンピュータからの待ち受けしているポート

ESTABLISHED —相手と通信中のポート

管理者権限を使っていきましょう

```Shell
#Apacheのインストール
$ sudo yum -y install httpd

#Apacheの起動
$ sudo systemctl start httpd.service

##stop (停止)/restart (再起動)も使える

#自動起動を設定する
$ sudo systemctl enable httpd.service

##そのほかのコマンドにはdisable(設定解除)/list-unit-filesc(設定ファイルの一覧を表示)

ex2)#DBサーバー起動時にMariaDBも自動で起動させる
$ sudo systemctl enable mariadb
```

```Shell
 #備忘録
$ nslookup
##name server lookupのこと

$ dig
#こちらの方が今時らしい
```

nslookupできないってのは 53ポート開いてないからでは?