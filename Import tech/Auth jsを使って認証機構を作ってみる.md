---
tags:
  - misc
  - security
  - api
  - cache
created: 2026-01-04
status: active
---

![](Import%20tech/Attachments/met_horace_pippin.jpg)

🔐

# Auth.jsを使って認証機構を作ってみる

[OAuth 2.0](OAuth%202%200%201f338cdd027d808496d4fbc1645b45b7.html)

[https://authjs.dev/getting-started/providers/google#configuration](https://authjs.dev/getting-started/providers/google#configuration)

```JSON
管理画面（Next.js + Auth.js） ←→ バックエンドAPI（Go）
     ↓
Google OAuth（ドメイン制限: @your-company.com）
```

# FE< —> BE間での認証

```Mermaid
sequenceDiagram
    participant FE as フロントエンド
    participant BE as バックエンドAPI
    participant JWT as JWT検証

    FE->>BE: 1. リクエスト + Bearer Token
    BE->>JWT: 2. トークン抽出
    JWT->>JWT: 3. AUTH_SECRETで署名検証
    alt 検証成功
        JWT->>BE: 4a. ペイロード返却
        BE->>BE: 5a. ユーザー情報取得
        BE->>FE: 6a. 正常レスポンス
    else 検証失敗
        JWT->>BE: 4b. エラー
        BE->>FE: 6b. 401 Unauthorized
    end
```

## 実装例(golang)

```Go
// BE: middleware/auth.go
import (
    "github.com/golang-jwt/jwt/v5"
)

func VerifyAuthToken(next http.HandlerFunc) http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
        tokenString := r.Header.Get("Authorization")
        if tokenString == "" {
            http.Error(w, "Unauthorized", http.StatusUnauthorized)
            return
        }

        // Bearer プレフィックスを削除
        tokenString = strings.Replace(tokenString, "Bearer ", "", 1)

        token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
            // AUTH_SECRETで検証
            return []byte(os.Getenv("AUTH_SECRET")), nil
        })

        if err != nil || !token.Valid {
            http.Error(w, "Invalid token", http.StatusForbidden)
            return
        }

        // トークンからユーザー情報を取得
        if claims, ok := token.Claims.(jwt.MapClaims); ok {
            ctx := context.WithValue(r.Context(), "user", claims)
            next.ServeHTTP(w, r.WithContext(ctx))
        }
    }
}
```

```Mermaid
graph LR
    subgraph "フロントエンド"
        A[Auth.js] --> B[JWT生成]
        B --> C[Cookie保存<br/>httpOnly]
        B --> D[Session内で<br/>トークン管理]
    end
    
    subgraph "API呼び出し"
        E[customFetch] --> F[Authorization: Bearer]
        E --> G[Cookie: session-token]
    end
    
    subgraph "バックエンド"
        H[認証ミドルウェア] --> I[Bearer優先]
        H --> J[Cookie fallback]
        I --> K[JWT検証]
        J --> K
    end
    
    D --> E
    C --> E
    F --> H
    G --> H
```

# 参考

cf. [https://authjs.dev/getting-started/migrating-to-v5#authenticating-server-side](https://authjs.dev/getting-started/migrating-to-v5#authenticating-server-side)

古いバージョンだが、こちらも[https://zenn.dev/joo_hashi/articles/c87e0fb7405a6c](https://zenn.dev/joo_hashi/articles/c87e0fb7405a6c)