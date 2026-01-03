---
tags:
  - database
  - mongodb
  - sql
created: 2026-01-04
status: active
---

![](DB/mongoDB/Attachments/mongodb-svgrepo-com.svg)

# MongoDB

## **MongoDBとは？【代表的なNoSQLデータベースの1つ】**

MongoDBは、代表的なNoSQLデータベース・ドキュメント指向型データベースです。MongoDBはMongoDB社が開発し、オープンソースとして提供されています。

Google社やAmazon社が提供するクラウドサービスでMongoDB互換のデータベースが展開されるなど、MongoDBは多くの名だたる企業に採用されている状況です。

またMongoDBは「[MEANスタック](https://www.kagoya.jp/howto/it-glossary/develop/mean/)」など、Webアプリケーションを開発する際に使われるオープンソースの組合せにもよく採用されています。Webアプリケーションの開発現場でも、MongoDBの採用率が高くなっているのです

## **MongoDBの主な特徴・メリット**

---

MongoDBは、NoSQLのなかでも最もよく使われるデータベースの1つです。それでは、どのような理由でMongoDBが注目されるのでしょうか。ここではMongoDBの主な特徴・メリットをみていきましょう。

### **インメモリで動作するため処理速度が速い**

MongoDBは、データをメインメモリ（RAM）で読み込んでから処理するインメモリ型のデータベースです。そのため処理すべきデータ量が増えても、よりスピーディーにI/O処理を行えます。

### **負荷分散や冗長化を実現する仕組みがある**

MongoDBは、データを複数のサーバーに分割して保存・処理できる「シャーディング」という機能を備えています。そのため負荷を複数のサーバーに分散して全体としての処理能力を向上させることが可能です。

さらにMongoDBには、「レプリカセット」といって、3台以上のサーバーで常に同じデータを保存・管理する機能もあります。レプリカセット機能によって、MongoDBはサーバーの冗長化も実現可能です。

### **外部システムとの連携が容易**

MongoDBは様々なシステムが採用する「JSON※」に似た形式でデータを保存します。そのため外部のシステムと比較的容易に連携可能です。

**JSONとは**

JSONとは「JavaScript Object Notation」を略した言葉で、JavaScriptでデータを扱うときのフォーマットです。JavaScriptがいろいろなシステムで採用されていることから、JSON形式でデータを保存するシステムも多くなっています。

### **複雑な形式のデータを扱いやすい**

MongoDBはJSONに似た形式のドキュメントでデータを保存・処理することから、複雑な形式のデータを扱いやすい点もメリットです。ドキュメント形式なので、動的かつ柔軟に扱うデータの形式を変えることもできます。

# 構成要素

テーブルの代わりにcollectionを言う要素もち、

それぞれのcollectionにはdocumentが格納されている。

## クラウドでmongoDBを触ってみる。

mongDB atalsでクラウドホスティングされているmongoDBサーバを触ることができる。

# ReplicaSet

ReplicaSet は、同 [MongoDB](https://www.mongodb.com/docs/manual/replication/)じデータセットを維持する複数の mongod プロセスのグループです。冗長性と高可用性を提供し、すべての本番環境デプロイメントの基盤となります。

**構成要素**

**Primary（プライマリ）**

- すべての書き込み操作を受け取る唯一のメンバー [MongoDB](https://www.mongodb.com/docs/manual/core/replica-set-members/)

- 操作を oplog に記録し、Secondary に複製される

**Secondary（セカンダリ）**

- Primary のデータセットのコピーを保持 [MongoDB](https://www.mongodb.com/docs/manual/core/replica-set-members/)

- Primary の oplog を複製してデータセットに適用

- Primary が利用不可の場合、選挙により新しい Primary に昇格可能

**Arbiter（アービター）**（オプション）

- 選挙に参加するが、データは保持しない

- データ冗長性は提供しない

### ローカル開発では、単一ノードでReplicaSetモードで起動することで、本番環境に近い構成を再現できる

```Shell
# ReplicaSet モードで起動
mongod --replSet rs0 --dbpath /data/db

# 初期化（メンバーが1つだけ）
rs.initiate()
```