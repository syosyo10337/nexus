---
tags:
  - aws
  - ec2
  - rds
created: 2026-01-03
status: active
---

![](AWS/Attachments/aws-rds.svg)

# RDS

---

RDS(Relational Database Service)は、アマゾンの提供するマネージドサービスの一つで、DBサーバーとして最適化された環境が提供されるため(監視、セキュリティ、スケーリング、OS等)、ユーザはデータ管理するだけで良い。

自作でEC2インスタンスに対して、DBソフトをインストールしてDBサーバーにすることもできるが、その場合の懸念点に以下が挙げられる。

- 自らインストール作業をする必要がある

- EC2のそのものの管理をしなくてはいけない(セキュリティ対策　)

- 障害対策も自分で考える必要がある。

# RDSの仕組み

---

以下の4つで構成される

- データベースエンジン

- パラメータグループ

- オプショングループ

- サブネットグループ

### データベースエンジン

データの保存や、クエリの対応などデータベース本体を指す。エンジンとして、一般的なPostgreSQL/MySQLなどが指定できる。障害対策として、内部に複数インスタンスを配置することもできる。

### パラメータグループ

データベースエンジン固有の設定(データベース製品自体の設定)を行う。使用言語やデータベースのチューニングの設定を行うところ

### オプショングループ

RDS固有の設定をするところ。AWSによるデータベース監視にまつわる設定もここでする。

### サブネットグループ

データベースを複数のavailabilityゾーンに分散配置する時に設定を行うところ。データベースの冗長化のためのサブネットをこちらで設定する。

## 実際の作成手順

---

それぞれのグループを順に作っていく。ref)インフラ本格入門p158

### サブネットグループの設定

RDSを作成する時には、サブネットグループだけを指定し、どのサブネットに作成されるかはAWSに任せることになる。(EC2のサブネットは直接指定)

### マルチAZ

自動で複数のアベイラビリティゾーンにデータベースを作成してくれる機能。当然のように耐障害性能高まる。

1つのデータベースを設定すると、それを複数のavailabityzoneに分けて配置してくれる。実際には実稼働するprimaryDBとスタンバイするDBが用意されることになる。つまりコストは倍ほど掛かる

# RDSを作成し、EC2からアクセスする。

---

## MySQLの場合

AWSインフラ本格入門を参照

## PostgreSQLの場合

EC２インスタンスにログインした後に、

1. posgresQL clientをインストールする。

```Bash
$ sudo yum install postgresql.x86_64 -y
# 心配だったら　yum search posgresでもして、探してみてね。
# これだとpsql -Vが9.6系だったような
```

Amazon Linux2にposgresql クライアントをインストールしてRDSに接続できようにしたい時。

```Bash

#postgreSQL 14.4を使いたいので
# extra一覧を表示させて
$ amazon-linux-extras 

#再度こちらをインストール
$ sudo amazon-linux-extras install -y postgresql14

その後、管理者権限を用いて

$ yum install postgresql-devel.x86_64
# これによって、この'libpq-fe.h'というヘッダーファイルを導入できそう。

=============================================================================================================================================================================
 Package                               Arch                             Version                                      Repository                                         Size
=============================================================================================================================================================================
Installing:
 libpq-devel                           x86_64                           14.3-2.amzn2.0.2                             amzn2extra-postgresql14                            96 k
# ダメならば、　yum install postgresql でほかのパッケージもインストールしてみて、もちろんversionを確認してから



## 原因となった不足していたファイル
fatal error: 'libpq-fe.h' file not found
#include <libpq-fe.h>
```

[

Rails gem postgresqlをインストールできない時の対処法。 - Qiita

Railsを使用して開発した、アプリケーションをherokuにデプロイする際、本番環境用のデータベースとして、PostgreSQLを設定する必要があったのですが、その時に少しハマったので、解決策をここに記録しておきます。 ...

![](AWS/Attachments/production-c620d3e403342b1022967ba5e3db1aaa.ico)https://qiita.com/gobtktk/items/9e7a8462f680a3716680

![](AWS/Attachments/article-ogp-background-9f5428127621718a910c8b63951390ad.png)](https://qiita.com/gobtktk/items/9e7a8462f680a3716680)

[

「libpq-fe.h が見つけられない。」の解決法でも上手く行かない場合 - Qiita

①Amazon LinuxでPostgreSQLインストール後、bundle installしたら、pqエラーが発生 ②下記のQiita記事を参考に、コマンドを入力したが、解決出来ず。 参考URL: libpq-fe.h が見つけられない。 ③発生したエラーは以下の通り 下記のサイトで同様の質問があり、回答通りに解決方法を試したら、無事に動作しました。 https://forums.aws.amazon.com/thread.jspa?threadID=268964 同じような問題に悩んでいる方に役立てられればと思い、今回の記事に纏めました。

![](AWS/Attachments/production-c620d3e403342b1022967ba5e3db1aaa.ico)https://qiita.com/s-yank/items/035938249ba3b158b865

![](AWS/Attachments/article-ogp-background-9f5428127621718a910c8b63951390ad%201.png)](https://qiita.com/s-yank/items/035938249ba3b158b865)

2. 実際にアクセスする

```Bash
$ psql -h (RDSのエンドポイント) -U postgres -d (RDS作成時の`最初のデータベース名`)

# 基本書式
$ psql -h <ホスト> -U <作成したマスタユーザ> -d (RDS作成時の`最初のデータベース名`)


#例
$ psql -h recorda-me-db.chfo7nmjeven.ap-northeast-1.rds.amazonaws.com -U postgres
```

参考になった記事

[

EC2上にPostgreSQL14をインストールしてpgAdmin4と接続するまで

ほたー　おはようございます! こんにちは!

![](AWS/Attachments/logo-transparent.png)https://zenn.dev/uotohotaru/articles/0730f90dbf7a6d#ec2%E4%B8%8A%E3%81%ABpostgresql14%E3%82%92%E3%82%A4%E3%83%B3%E3%82%B9%E3%83%88%E3%83%BC%E3%83%AB%E3%81%97%E3%81%A6%E8%B5%B7%E5%8B%95%E3%81%99%E3%82%8B%E3%81%BE%E3%81%A7

![](AWS/Attachments/og-base_z4sxah.png)](https://zenn.dev/uotohotaru/articles/0730f90dbf7a6d#ec2%E4%B8%8A%E3%81%ABpostgresql14%E3%82%92%E3%82%A4%E3%83%B3%E3%82%B9%E3%83%88%E3%83%BC%E3%83%AB%E3%81%97%E3%81%A6%E8%B5%B7%E5%8B%95%E3%81%99%E3%82%8B%E3%81%BE%E3%81%A7)

[

Amazon LinuxからPostgreSQL(RDS)へ接続する - Qiita

EC2(Amazon Linux)をクライアントとしてRDS(PostgreSQL)に 接続したかったのですが、EC2にPostgreSQLをインストールする 記事にたどり着くことが多かったので書いてみました。 EC2(Amazon Linux AMI release 2018.03) RDS(PostgreSQL 9.6.9) yumでpostgresqlのclientモジュールをインストールすれば接続できます。 （分かれば簡単だけど、調べ始めた時はクライアント用のモジュールが無い感じだったので困惑しました） psql -h ＜RDSのエンドポイント＞ -U ＜DBのユーザ名＞ -d ＜DB名＞ ※バージョン表示のSQLで動作確認 yum search postgresqlを実行するとpostgresql96.x86_64がクライアントプログラムであることがわかります。 yum info postgresql96.x86_64でも同じことがわかります。

![](AWS/Attachments/production-c620d3e403342b1022967ba5e3db1aaa.ico)https://qiita.com/panayan/items/634ad5ad895f0c9e5bd0

![](AWS/Attachments/article-ogp-background-9f5428127621718a910c8b63951390ad%202.png)](https://qiita.com/panayan/items/634ad5ad895f0c9e5bd0)

[

https://qiita.com/shonansurvivors/items/7b0e3f6b78be66027028#7-ec2%E3%81%8B%E3%82%89psql%E3%81%A7rds%E3%81%AB%E6%8E%A5%E7%B6%9A%E3%81%99%E3%82%8B



](https://qiita.com/shonansurvivors/items/7b0e3f6b78be66027028#7-ec2%E3%81%8B%E3%82%89psql%E3%81%A7rds%E3%81%AB%E6%8E%A5%E7%B6%9A%E3%81%99%E3%82%8B)