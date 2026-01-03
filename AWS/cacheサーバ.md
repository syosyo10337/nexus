---
tags:
  - aws
  - ec2
created: 2026-01-03
status: active
---

![](AWS/Attachments/aws-elastic-cache-logo-C8E8F40B2B-seeklogo.com.png)

# cacheサーバ

サーバー上に取得したデータを一時的に保存することで、クライアントからのリクエストに素早く応答できるようにする仕組み

EC2上にミドルウェアをインストールして、サーバーとして運用することは可能。だが、AWSのマネージドサービスの一つとして、ElastiCache（エラスティキャッシュ）と呼ばれるものがある。

### 注意する点

---

- キャッシュデータが、最新の状態とのズレがないか？　

- サーバ側にメモリが必要。

## 有名なミドルウェア

- Redis

- Memcached

ElastiCacheでは、どちらも導入済みなので、キャッシュの選択をするだけで良い。

## ElastiCacheの仕組み

---

あるkeyに対してデータを返すkey-value型の仕組みでデータを保存している。

### ElastiCacheの階層構造

|要素|別名|説明|
|---|---|---|
|ノード  <br>(node)||最小単位。実際のデータはノードに保存される|
|シャード  <br>(Shard)|ノードグループ|ノードを束ねるグループ。1つのprimary nodeと複数のreplica nodeで構成される|
|クラスター  <br>(Cluster)|レプリケーショングループ|シャードを束ねるGroup。複数のシャードで構成される。|

[![](AWS/Attachments/Screen_Shot_2022-11-03_at_23.34.26.png)](cache%E3%82%B5%E3%83%BC%E3%83%90/Screen_Shot_2022-11-03_at_23.34.26.png)

### node

実際に保存されるキャッシュデータを保持する場所。ノードごとにキャッシュエンジン(Redis/Memcached)やスペック、容量を設定できる。

### Shard

1~6個のノードで構成される。ノードはprimary node1つと、複数のreplica nodeによって構成される。

- プライマリーノード

データの更新と照会を行います。

- レプリカノード

プライマリノードが行った更新がコピーされて同じ状態を維持する。データの照会も行われる。

シャードが多いと、データの更新をコピーするのに時間はかかりますが、その分照会はノードの数だけ早くなります。

### Cluster

複数のシャードで構成される。

## netcat (nc)コマンドによる接続確認

---

Netcatとは[Unix系](https://ja.wikipedia.org/wiki/Unix%E7%B3%BB)OSコマンドラインアプリケーションの一つ。[TCP](https://ja.wikipedia.org/wiki/Transmission_Control_Protocol)や[UDP](https://ja.wikipedia.org/wiki/User_Datagram_Protocol)のパケットを読み書きするバックエンドとして機能するツールで、ネットワークを扱う万能ツールとして知られる。

```Bash
# EC2インスタンスにて ncをインストール
$ sudo yum install nc

#ncでRedisキャッシュサーバに接続
#quit で終了
$ nc <エンドポイント> <ポート番号>

ping --#ピングコマンドを入力
```