 

# MIME

---

MINE(マイム) とは、Multipurpose Internet Mail Extensionsの略です。TCP/IPネットワーク上でやり取りする電子メールで、当初の規格で唯一記載することができた[**ASCII**](https://e-words.jp/w/ASCII.html)英数字以外のデータ（各国語の文字、[**添付ファイル**](https://e-words.jp/w/%E6%B7%BB%E4%BB%98%E3%83%95%E3%82%A1%E3%82%A4%E3%83%AB.html)など）を取り扱うことができるようにする拡張仕様。つまり、送信されるHTTPメッセージのリソースの表現の種類を指定するもの。　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　

## Content-Type

---

このヘッダを持つメッセージが、どのような種類のボディを持つかを示す。

```JavaScript
//e.g.

Content-Type: application/xhtml+xml; charset=utf-8

//基本書式
Content-Type: <タイプ>/<サブタイプ>; charset=<文字エンコーディング>
```

## コンテントネゴシエーション

---

mediaタイプや文字エンコードは一方的にサーバ側が決めるわけではなく、クライアントとのnegotiationによって決めることもできます。

コンテントネゴシエーションが行われる一例

### Accept

クライアントが自身の処理できるメディアタイプをサーバーに伝えるためのヘッダ

### Accept-Charset