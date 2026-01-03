---
tags:
  - web
  - jwt
  - auth
created: 2026-01-04
status: active
---

🤹‍♂️

# JWT(JSON Web Token)

自己完結型のトークン

```JSON
// Auth.jsが生成するトークンの中身
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9. // Header
eyJlbWFpbCI6InVzZXJAZXhhbXBsZS5jb20iLCJzdWIiOiIxMjM0NTY3ODkwIiwiaWF0IjoxNTE2MjM5MDIyfQ. // Payload
SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c // Signature (AUTH_SECRETで署名)
```

cf. [https://developer.mamezou-tech.com/blogs/2022/12/08/jwt-auth/](https://developer.mamezou-tech.com/blogs/2022/12/08/jwt-auth/)

# 詳細な構造

```JSON
typescript// 1. Header（ヘッダー）
{
  "alg": "HS256",  // 署名アルゴリズム
  "typ": "JWT"     // トークンタイプ
}
// Base64エンコード → eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9

// 2. Payload（ペイロード）
{
  "sub": "1234567890",           // Subject（ユーザーID）
  "email": "john@example.com",   // カスタムクレーム
  "name": "John Doe",            
  "iat": 1516239022,             // Issued At（発行時刻）
  "exp": 1516242622              // Expiration（有効期限）
}
// Base64エンコード → eyJzdWI...

// 3. Signature（署名）
HMACSHA256(
  base64UrlEncode(header) + "." +
  base64UrlEncode(payload),
  secret
)
// → SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
2. JWTの特徴
```

# 関連:

- [🔐Auth.jsを使って認証機構を作ってみる](Auth%20js%E3%82%92%E4%BD%BF%E3%81%A3%E3%81%A6%E8%AA%8D%E8%A8%BC%E6%A9%9F%E6%A7%8B%E3%82%92%E4%BD%9C%E3%81%A3%E3%81%A6%E3%81%BF%E3%82%8B%2024538cdd027d80b4935eed48cc29ed8f.html)

- [OAuth 2.0](OAuth%202%200%201f338cdd027d808496d4fbc1645b45b7.html)