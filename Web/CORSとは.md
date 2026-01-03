---
tags:
  - web
  - cors
  - security
created: 2026-01-04
status: active
---

# CORSとは

## Cross-Origin Resource Sharingのこと

### オリジンとは

**スキーム + ホスト + ポート** の組み合わせ

```Plain


https://www.example.com:443
↑      ↑                ↑
スキーム  ホスト            ポート
```

### Same Origin Policy（同一オリジンポリシー）

ブラウザの基本的なセキュリティ機能で、**異なるオリジン間でのリソースアクセスを制限**します。

```Plain


フロントエンド: https://myapp.com
バックエンドAPI: https://api.myapp.com

→ 異なるオリジンなので、デフォルトではアクセス不可
```

### CORSの仕組み

**問題：**

1. ユーザーが `https://myapp.com` にアクセス

2. フロントエンドのJSが `https://api.myapp.com` にリクエスト

3. **オリジンが違うため、ブラウザがブロック**

**解決：**  
API側で以下のヘッダーを設定

```Go


http
Access-Control-Allow-Origin: https://myapp.com
Access-Control-Allow-Methods: GET, POST, PUT, DELETE
Access-Control-Allow-Headers: Content-Type, Authorization

e.g. 
w.Header().Set("Access-Control-Allow-Origin", "https://myapp.com")
```

### Preflightリクエスト

複雑なリクエスト（POST、カスタムヘッダー等）の前に、ブラウザが自動で送る確認リクエスト

```Plain


http
OPTIONS /api/users HTTP/1.1
Origin: https://myapp.com
Access-Control-Request-Method: POST
Access-Control-Request-Headers: Content-Type
```

API側が許可していれば、実際のリクエストが送信されます。

**重要：** サーバサイド（Next.js Server Actions等）からのリクエストは、ブラウザを経由しないため**CORSの制約を受けません**。