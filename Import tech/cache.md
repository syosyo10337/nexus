---
tags:
  - misc
  - testing
  - api
  - cache
created: 2026-01-04
status: active
---

# cache

キャッシュとは、サーバから取得したリソースをローカルストレージ(HDDなど)に蓄積し再利用する手法のことで、キャッシュしたデータそのものをキャッシュと呼ぶこともあります。

## キャッシュにまつわるHTTPのヘッダ達

### Pragma

```JavaScript
//Responseメッセージにて

Pragma: no-cache
```

pragmaはキャッシュをしてはいけないことを伝える。

### Expires

キャッシュの有効期限を定める。このヘッダに入っている値以後の日時に、リソースにアクセスする時は、再度サーバーにアクセスすることになる。

### Cache-Control

HTTP1.1の使用で追加されたヘッダ。Pragma/Expiresヘッダの簡素名指定より複雑なキャッシュに関する指定をでき、上の2つの完全な代用になる

```JavaScript
Cache-Control: no-cache
```

## 条件付きGET

cache-controlのヘッダを検証した結果、サーバーへの再度アクセスが必要と判断された場合でも、条件付きGETを送信することでキャッシュを再利用できる場合があります。

具体的には、サーバ側のリソースがクライアントのローカルにあるキャッシュから変更されているかを調べるヘッダを付与することで、キャッシュが有効であるかと判断するという仕組み。

条件付きGETを使うには、リソースがLast-ModifiedもしくはETagヘッダを持つことが必要です。

### If-Modified-Since

リソースの更新日時を条件にする条件付きGETのためのリクエストヘッダ

```JavaScript
GET /test HTTP/1.1
Host: example.jp
If-Modified-Since: <日時>
//このリクエストは、ローカルキャッシュの更新日時（最後に取得された日付）が<日付>部の日時であることを示している。
```

もし、サーバー側のリソースがこれ以降変更されてなければ、次のようなレスポンスを返す。

```JavaScript
HTTP1. 304 Not Modified
Content-Type: application/xhtml+xml; charset=utf-8
Last-Modified: <日付>
```

上のレスポンスを持って、リソースの再取得が不要とクライアント側で判断できる

### If-None-Match

リソースのETagを条件にする。If-Modified-Sinceヘッダをつかった条件つきGETリクエストは、サーバーが時計を持たない場合や、秒単位で変更されるリソースに対しては有効ではありません。その場合に用いられるのがIf-None-MatchリクエストヘッダとETagレスポンスヘッダです。

簡便にいうと、If-None-MatchとETagでは、リソースの更新状態を比較するための文字列を持つことで、その値が一致するかどうかでリソースの更新の有無を判断する。