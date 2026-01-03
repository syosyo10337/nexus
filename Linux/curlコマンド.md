---
tags:
  - linux
  - command
  - network
created: 2026-01-04
status: active
---

# curlコマンド

## httpリクエストを送信する方法について

### GET

```Bash
curl https://www.google.com/
```

### POST

`-X <request_method>` を使って、メソッドを明示する

```Bash
e.g.)

curl -X POST "http://httpbin.org/post"
```

`-d | —data <data>` httpのポストするデータを指定する。

```Bash
curl -X POST "http://httpbin.org/post"
```

`--header` / `-H`

に続いて、header情報を明記することができる。

`-s` / `--silent`

サイレント、ログの出力を粛清する。

`-L` / `--location`

場所について