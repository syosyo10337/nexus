---
tags:
  - docker
  - dockerfile
  - container
  - network
created: 2026-01-03
status: active
---

🌋

# volume

---

[volumeについて](#5c225248-37a3-407b-a29b-8e86ee7a6f74)

[2種類のVolume](#aed0960b-9fa2-485d-9014-7f1036956a12)

[Data Volume](#635c0c6a-5bcf-4253-8661-ddb2a0ad0459)

[Data Volumeコンテナ(推奨)](#3d8a0707-8cbc-4a17-b614-120142a70f91)

[データのexportとrestore](#420865c0-d288-449b-937c-db6925e756ec)

# volumeについて

---

ボリュームはデータを永続化するための機能です。ホスト.コンテナ間でファイルをコピーするのではなく、**共有する**仕組みです。

Docker Containerは基本的にエフェメラル(ephemeral)なもので、コンテナ上で作成された”ファイル”はコンテナのライフサイクルの終了と共に消えてしまいます。

- ephemeral
    
    一時的な、束の間の
    

Volumeはデータ保持・永続化のために設計されており、コンテナのライフサイクルとは独立してファイルの管理を行います。

例えば、fluentdのようなロガーでloggingをしたい場合や、データストアなど

- fluentd
    
    Fluentd（フルエントディー）とは、オープンソースのデータコレクターやデータログ収集ツールと呼ばれるソフトウェアです。
    
    Fluentdを用いれば、今までのログ収集方式より格段に手軽にログを収集し、活用することができます。
    

# 2種類のVolume

---

### Data Volume

Dockerコンテナ内のファイル/ディレクトリをディスクに永続化するための仕組みであり、ホスト/コンテナ間でのディレクトリの共有や再利用が可能になります。data volumeを用いたコンテナを削除してもディスクには保持されるので、コンテナでステートフルなアプリケーションを実行するのに適しています。

```Bash
#e.g.)
$ docker run -v /tmp/text ubuntu touch /tmp/text/hogefugapiyo
#dockerで、ubuttuをrun(起動)\
#データボリュームに /tmp/textを指定して
#touchコマンドでファイル作成
# `-v <コンテナパス>`データヴォリュームを追加できる/ コンテナでのパスを指定？


#volumeが作成されているかを確認
$ docker volume ls
DRIVER              VOLUME NAME
local               ec960f53dd549aa8d771ae12b8f489b218c39fd8aea98baa2c9dca00731f245c
```

このコマンドはデバッグ時に便利で、ホストのコードをコンテナへ同期させて動作確認することによく使います。また、data volumeは共有の仕組みのため、ホスト側で編集したファイルをdata volumeを通じでイメージを更新する事なく、コンテナに対して共有することも可能です。

### Data Volumeコンテナ(推奨)

コンテナ間でディレクトリを共有します。これは、文字通りデータを保つためだけのコンテナのことです。

コンテナは,廃棄されない限りその内容をディスクに保持するという特性があるため、その特性を活かして、永続したいデータをコンテナから切り出して、data volumeコンテナとして保持する事で、別のコンテナと共有することができる仕組みをdata volume コンテナと言います。data volumeコンテナによって共有されるディレクトリも、ホスト側のストレージ(この場合は、dockerの管理領域である。`/var/lib/docker/volumes/`配下)に存在するという点においては、data volumeと同一です。

また、data volumeコンテナは、volumeへの仲介役的な役割も持ちます。つまり、あるvolumeを必要とするコンテナがあるとき、ホスト側のディレクトリを知る必要がなく、ただ、data volumeコンテナを指定することで、永続したデータを保持するvolumeの機能を使うことができます。

e.g.)data volume コンテナを作成して、別のコンテナからdata volume コンテナを共有する。

```Bash
# e.g.)

$ docker run --name volume-test -v /tmp/test ubuntu touch /tmp/test/{hoge,fuga,piyo}
```

`--volumes-from <コンテナ名>`で参照するdata volumeコンテナを指定する

これを用いて、別のコンテナを実行し、先ほど作成したコンテナのvolumeを参照する

```Bash
$ docker run --volumes-from volume-test ubuntu ls -l /tmp/test
total 0
-rw-r--r-- 1 root root 0 Mar 18 18:49 fuga
-rw-r--r-- 1 root root 0 Mar 18 18:49 hoge
-rw-r--r-- 1 root root 0 Mar 18 18:49 piyo
```

# データのexportとrestore

---

Data volumeコンテナ（データを保持するためだけのコンテナ）を使うと、アプリコンテナとデータを分離できて便利です。しかし、あくまで、同一　Dockerホスト内で有効です。他のDockerホストにレストアするには、Data volumeコンテナからexportしたいデータだけをファイルとして取り出す必要があります。

```Bash
#e.g.)
% docker container run -v ${PWD}:/tmp \
> --volumes-from mysql-data \
> busybox \
> tar cvzf /tmp/mysql-backup.tar.gz /var/lib/mysql

# ホスト側のpwdと、これから走らせるコンテナ上の/tmpディレクトリを繋いで、
# --volume-from でdatavolumeコンテナには事前に用意していたmysql-dataというvolumeコンテナを指定
# busyboxイメージからコンテナを作成して、tarコマンドで、
# /tmp/mysql-backup.tar.gzこのパスとファイル名で、　
# /var/lib/mysqlのファイルをアーカイブする
# この時,コンテナ上の/tmpは、ホストとつながっているので、ホスト側ではdata volumeコンテナのデータを抽出できている。
```