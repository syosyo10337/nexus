---
tags:
  - web
  - http
  - protocol
created: 2026-01-04
status: active
---

# HTTPプロトコル

- PUT: リソースの作成、リソースの置換

- POST: リソースの作成

- PATCH: リソースの部分置換
- [[#WebSocket (ws) と HTTP の違い|WebSocket (ws)]]: 双方向通信

## ステータスコードの理解

|---|---|---|
|400|Bad Request|リクエスト自体が何らかの形で不正または不適切であり、サーバーがそれを理解できない場合に返されます。これは、例えば、構文が間違っている場合や、リクエストが必要なパラメータを含んでいない場合などに発生する可能性があります**。’形式’**|
|422|Unprocessable Entity|リクエスト自体は適切に形成されていて、サーバーもそれを理解できるのですが、リクエストに含まれるセマンティックな内容（つまり、リクエストの意味内容）が何らかの理由で処理できない場合に返されます。これは、WebDAV拡張の一部として定義されています。例えば、リクエストが適切な形式で送られてきても、その内容が要求された操作に対して無効である場合（例えば、存在しないIDを更新しようとするなど）にこのコードが使われます。**’内容’**|
||||

|---|---|---|
|204|**No Content**|成功ステータスレスポンスコードで、リクエストが成功したものの、クライアントが現在のページから移動する必要がないことを示します。|
||||
||||

### **GETリクエストでrequest bodyを使うべきではない理由**

1. **HTTP仕様的な問題**

    - ~~RFC 7231では、GETリクエストのbodyに意味論的な意味を定義していない~~

    - → [https://www.rfc-editor.org/rfc/rfc9110.html](https://www.rfc-editor.org/rfc/rfc9110.html)へ置換されている。

    - 多くのプロキシ、CDN、ロードバランサーがGETのbodyを削除またはキャッシュしない

2. **実装上の制限**

    - 一部のHTTPクライアント（curl、ブラウザのfetch等）でGETのbodyを送信できない場合がある

    - サーバーフレームワークによってはGETのbodyを解析しない

3. **キャッシュの問題**

    - GETはキャッシュ可能だが、bodyの内容がキャッシュキーに反映されない

    - 同じURLでも異なるbodyで異なる結果になるべきケースでキャッシュが誤動作

**代替オプション：**

✅ **推奨される解決策：**

1. **POSTメソッドに変更**

`POST /ticket-scanner/scan   Content-Type: application/json      {"ticket_code": "ABC-DEFG-HI"}`

1. **Query Parameterを使用**

`GET /ticket-scanner/scan?ticket_code=ABC-DEFG-HI`

- ただし、ログに残る可能性があるため機密情報には注意

1. **Path Parameterを使用**

`GET /ticket-scanner/scan/{ticket_code}`

- RESTfulだが、特殊文字のエンコードが必要

QRコードスキャンのような操作は本来「アクション」なので、**POSTメソッドが最も適切**だと思います。セマンティック的にも「チケットコードを送信してスキャン処理を実行する」という意味になり自然です。

---

## WebSocket (ws) と HTTP の違い

| 特徴 | **HTTP** | **WebSocket (ws)** |
| :--- | :--- | :--- |
| **通信方式** | リクエスト/レスポンス型 | 双方向・全二重通信 |
| **接続** | 毎回新規接続（または Keep-Alive） | 一度接続したら維持 |
| **通信の開始** | クライアントからのみ | どちらからでも可能 |
| **オーバーヘッド** | ヘッダーが毎回必要 | 初回接続後は最小限 |
| **用途** | 通常のWebページ、API | リアルタイム通信、チャット、ゲーム |

---

### 通信の流れ

#### HTTP

1. **クライアント → サーバー** (リクエスト)
2. **クライアント ← サーバー** (レスポンス)
3. **接続終了**

- 1回のやり取りごとに完結
- サーバーからクライアントへの自発的な送信は不可

#### WebSocket

1. **クライアント ↔ サーバー** (常時接続)

- 接続を維持したまま、いつでも双方向でデータ送受信
- サーバーからクライアントへプッシュ通知が可能

---

### WebSocketの接続開始 (Handshake)

WebSocketは、最初は通常のHTTPプロトコルを使用して接続を開始し、その途中でプロトコルを切り替える（アップグレードする）という仕組みになっています。

#### 通常のHTTPリクエスト (例)

一般的なWebページ取得などのリクエストです。

```http
GET /index.html HTTP/1.1
Host: example.com
Connection: keep-alive
User-Agent: Mozilla/5.0 ...
```

#### WebSocketへのアップグレードリクエスト

`Upgrade` ヘッダーを使用して「プロトコルの切り替え」をサーバーに要求します。

```http
GET /chat HTTP/1.1
Host: example.com
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==
Sec-WebSocket-Version: 13
```

> [!TIP]
> リアルタイム性が必要な場合（チャット、株価更新、オンラインゲームなど）はWebSocket、通常のAPI呼び出しやページ取得はHTTPを使うのが一般的です。
