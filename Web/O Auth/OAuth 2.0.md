


図でざっくり解説 OAuth 2.0入門

OAuth 2.0は、現代のウェブアプリケーションやモバイルアプリで広く使用されている仕組みです。しかし、具体的にどのように機能しているのか、登場人物やステップごとの流れが少しわかりにくいと感じる方も多いのではないでしょうか。 私自身も、OAuth 2.0について調べた際に、多くの技術的な用語や図の説明に混乱し、なかなか全体像を掴むのに苦労しました。そこで、初心者でも直感的に理解できるように、できるだけシンプルに、かつ図を使ってわかりやすく説明する記事を作成することを目指しました。

https://zenn.dev/crebo_tech/articles/article-0011-20241006

![](Web/O%20Auth/Attachments/og-base-w1200-v2.png)](https://zenn.dev/crebo_tech/articles/article-0011-20241006)

# そもそも

**OAuth 2.0**は、ユーザーが**パスワードを共有することなく**、第三者のアプリケーションに対して限定的なアクセス権を与えるための認可フレームワークです。

```Mermaid
sequenceDiagram
    participant U as ユーザー
    participant A as あなたのアプリ
    participant G as Google

    U->>A: 1. ログインしたい
    A->>U: 2. Googleログインボタン表示
    U->>A: 3. クリック
    A->>G: 4. 認証画面へリダイレクト
    G->>U: 5. ログイン画面表示
    U->>G: 6. ID/パスワード入力
    G->>U: 7. 権限許可画面
    U->>G: 8. 許可
    G->>A: 9. 認証コード付きでリダイレクト
    A->>G: 10. 認証コード → アクセストークン交換
    G->>A: 11. アクセストークン & IDトークン
    A->>G: 12. ユーザー情報取得（必要時）
    G->>A: 13. ユーザー情報
    A->>U: 14. ログイン完了
```

### ✅ Google認証で起きていること

### 1. **認証フロー（Authorization Code Flow）**

```JavaScript
*// ユーザーがGoogleログインボタンをクリック// 1. Googleの認証画面へリダイレクト*
https://accounts.google.com/o/oauth2/v2/auth?
  client_id=YOUR_CLIENT_ID&
  redirect_uri=https://local-admin.chimer.in/api/auth/callback/google&
  response_type=code&
  scope=openid email profile&
  state=RANDOM_STATE_VALUE

*// 2. ユーザーが許可すると、認証コードと共にアプリへ戻る*
https://local-admin.chimer.in/api/auth/callback/google?
  code=4/0AdQt8qh...&
  state=RANDOM_STATE_VALUE

*// 3. サーバー側で認証コードをアクセストークンに交換*
POST https://oauth2.googleapis.com/token
{
  code: "4/0AdQt8qh...",
  client_id: "YOUR_CLIENT_ID",
  client_secret: "YOUR_CLIENT_SECRET",
  redirect_uri: "https://local-admin.chimer.in/api/auth/callback/google",
  grant_type: "authorization_code"
}

*// 4. Googleからトークンを受け取る*
{
  access_token: "ya29.a0AfH6...",
  id_token: "eyJhbGciOiJSUzI1NiIs...",
  expires_in: 3599,
  scope: "openid email profile",
  token_type: "Bearer"
}`
```

cf. [https://developers.google.com/identity/openid-connect/openid-connect?hl=ja#exchangecode](https://developers.google.com/identity/openid-connect/openid-connect?hl=ja#exchangecode)

図示すると、、

```Mermaid
sequenceDiagram
    participant U as ユーザー
    participant FE as 管理画面(Next.js)
    participant BE as バックエンドAPI
    participant G as Google

    U->>FE: 1. Google認証でログイン
    FE->>G: 2. 認証フロー
    G->>FE: 3. ユーザー情報
    FE->>FE: 4. セッショントークン生成
    FE->>U: 5. ログイン完了
    
    Note over U,BE: API呼び出し時
    U->>FE: 6. 管理操作
    FE->>BE: 7. APIリクエスト + セッショントークン
    BE->>BE: 8. トークン検証
    BE->>FE: 9. レスポンス`
```

# 関連用語

### **1. ID Token (JWT)**

- **何か**: ユーザーの身元情報を含むトークン

- **形式**: JWT（JSON Web Token）

- **内容**:

```JSON
{
  "iss": "https://accounts.google.com",
  "sub": "110169484474386276334", // ユーザーの一意識別子
  "email": "user@example.com",
  "email_verified": true,
  "name": "山田太郎",
  "picture": "https://lh3.googleusercontent.com/...",
  "iat": 1516239022,
  "exp": 1516242622
}
```

### **2. Access Token**

- **何か**: Google APIにアクセスするための鍵

- **用途**: ユーザー情報の取得、Gmail API、Drive APIなどへのアクセス

- **有効期限**: 通常1時間

### **3. Refresh Token** ⚠

- **何か**: 新しいアクセストークンを取得するためのトークン

- **注意**: Google認証では通常発行されません（初回のみ、特別なスコープが必要）

### **4. Session Token** ✅

- **何か**: Auth.jsがアプリ内で使用するセッショントークン

- **保存場所**: Cookie（httpOnly, secure）

- **内容**: ユーザーのセッション情報

---

# 関連

[🤹‍♂️JWT(JSON Web Token)](JWT\(JSON%20Web%20Token\)%2024538cdd027d80c9814ec39ce6581d30.html)

[

Auth.js | OAuth

Authentication for the Web

![](https://authjs.dev/favicon-32x32.png)https://authjs.dev/concepts/oauth

![](Web/O%20Auth/Attachments/og.png)](https://authjs.dev/concepts/oauth)