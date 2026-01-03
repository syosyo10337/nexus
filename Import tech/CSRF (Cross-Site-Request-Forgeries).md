 

# CSRF (**Cross-Site-Request-Forgeries**)

---

サイトをまたいだリクエストの偽造みたいな意味。

[**CSRF（Cross-Site Request Forgery）攻撃とは？**](#2ae38cdd-027d-8046-b714-c3b80e21fa86)

[**CSRF攻撃の具体例**](#2ae38cdd-027d-8054-8c7a-c873c0b2cfec)

[**CSRF攻撃成立の条件**](#2ae38cdd-027d-800e-b961-fb1aa286f763)

[(対策) Cookieの**SameSite=LaxによるCSRF防止**](#2ae38cdd-027d-8093-a79d-f17a2f4ed402)

[**SameSite属性の3つの値**](#2ae38cdd-027d-80d1-bf09-d42f830c221b)

[**デフォルト動作**](#2ae38cdd-027d-804c-841c-d84867cd1581)

[**Strict**であることの不都合な点](#2ae38cdd-027d-80c4-8ff5-f1543156f6f3)

[**Secure属性 - 中間者攻撃からの保護**](#2ae38cdd-027d-80bb-a397-eae4e8618e8c)

[✅ **推奨設定（ベストプラクティス）**](#2ae38cdd-027d-8083-bb64-cb30f8f18673)

[🎯 **重要なポイント**](#2ae38cdd-027d-80c3-954f-d13133e077c7)

[CSRFトークン](#2ae38cdd-027d-808b-8496-ed111a2b16c8)

[CSRFトークンの目的](#2ae38cdd-027d-80dd-ab99-ff482f44963d)

[実装例](#2ae38cdd-027d-80c0-83b6-f7cb54245753)

[実装上の注意点](#2ae38cdd-027d-80bf-a083-ee0bc710cb43)

[⚠XSSがあればCSRF保護は無意味](#2ae38cdd-027d-8062-8454-ce1226c71a58)

# **CSRF（Cross-Site Request Forgery）攻撃とは？**

CSRF（Cross-Site Request Forgery）は、ログイン済みのユーザーが罠サイトを訪問した際に、 [ipa](https://www.ipa.go.jp/security/vuln/websecurity/csrf.html)**ブラウザに保存されている認証情報（主にクッキー）を悪用して、**ユーザーが意図しない処理を正規サイトで実行させる攻撃です。

**攻撃の流れ**

1. **ユーザーが正規サイト（例：銀行）にログイン**
    
    - ブラウザにセッションクッキーが保存される
    

2. **ログイン状態のまま、罠サイトを訪問**
    
    - 罠サイトには、正規サイトへのリクエストを発行するコードが埋め込まれている
    

3. **ブラウザが自動的にクッキーを送信**
    
    - ブラウザは、どのサイトから発行されたリクエストでも、ドメインが一致すればクッキーを自動送信する
    
    - これがCSRFの根本的な原因
    

4. **正規サイトが処理を実行**
    
    - 正規サイトは正規のリクエストと判断して処理してしまう
    

cf.

[

安全なウェブサイトの作り方 - 1.6 CSRF（クロスサイト・リクエスト・フォージェリ） | 情報セキュリティ | IPA 独立行政法人 情報処理推進機構

情報処理推進機構（IPA）の「安全なウェブサイトの作り方 - 1.6 CSRF（クロスサイト・リクエスト・フォージェリ）」に関する情報です。

![](Import%20tech/Attachments/apple-touch-icon-180x180.png)https://www.ipa.go.jp/security/vuln/websecurity/csrf.html

![](Import%20tech/Attachments/k3q2q400000050dg.png)](https://www.ipa.go.jp/security/vuln/websecurity/csrf.html)

### **CSRF攻撃の具体例**

```HTML
<!-- 自動送信されるフォーム -->
<form action="https://bank.example.com/transfer" method="POST" id="csrf-form">
  <input type="hidden" name="to" value="attacker" />
  <input type="hidden" name="amount" value="10000" />
</form>
<script>document.getElementById('csrf-form').submit();</script>

<!-- imgタグを使った攻撃（GETリクエスト） -->
<img src="https://bank.example.com/transfer?to=attacker&amount=10000" />

<!-- iframeを使った攻撃 -->
<iframe src="https://bank.example.com/delete-account" style="display:none"></iframe>

<!-- JavaScriptを使った攻撃 -->
<script>
fetch('https://bank.example.com/api/transfer', {
  method: 'POST',
  credentials: 'include',  // クッキーを含める
  body: JSON.stringify({to: 'attacker', amount: 10000})
});
</script>
```

### **CSRF攻撃成立の条件**

CSRF攻撃が成功するためには、以下の3つの条件が揃う必要があります [PortSwigger](https://portswigger.net/web-security/csrf):

1. **標的となるアクション**: 攻撃者が実行させたい機能（資金移動、パスワード変更など）

2. **Cookieベースの認証**: セッション管理がCookieのみに依存している

3. **予測可能なリクエスト**: リクエストパラメータに予測不可能な値（CSRFトークン）が含まれていない

---

# (対策) Cookieの**SameSite=LaxによるCSRF防止**

SameSite属性は、ブラウザがクロスサイトリクエストでCookieを送信するかどうかを制御します。CSRF攻撃のリスクを軽減する主要な防御手段です [OWASP Foundation](https://owasp.org/www-community/SameSite)[Invicti](https://www.invicti.com/blog/web-security/same-site-cookie-attribute-prevent-cross-site-request-forgery)。

### **SameSite属性の3つの値**

|   |   |   |
|---|---|---|
|`**Strict**`|クロスサイトリクエストでは一切Cookieを送信しない。最も厳格な保護 [OWASP Foundation](https://owasp.org/www-community/SameSite)|銀行サイトなど、外部からのリンク経由でのアクセスを想定しない場合|
|`Lax`|トップレベルナビゲーション（リンククリック）のGETリクエストではCookieを送信するが、POSTリクエストでは送信しない。セキュリティと使いやすさのバランスが良い [Invicti](https://www.invicti.com/blog/web-security/same-site-cookie-attribute-prevent-cross-site-request-forgery)[Simon Willison](https://simonwillison.net/2021/Aug/3/samesite/)|✅ **ほとんどのWebアプリケーションで推奨**|
|`**None**`|すべてのクロスサイトリクエストでCookieを送信。SameSite保護を無効化。`Secure`属性との併用が必須 [PortSwigger](https://portswigger.net/web-security/csrf/bypassing-samesite-restrictions)|`サードパーティ統合が必要な場合（広告、埋め込みコンテンツなど）`|

### **デフォルト動作**

2020年以降、Chrome、Edge、Operaでは、SameSite属性が指定されていない場合、自動的に`Lax`として扱われます。これにより、デフォルトでCSRF保護が提供されます [OWASP Foundation](https://owasp.org/www-community/SameSite)[web.dev](https://web.dev/articles/samesite-cookies-explained)。

```JavaScript
// バックエンド設定例
res.cookie('auth_token', token, {
  httpOnly: true,
  secure: true,
  sameSite: 'lax'  // ✅ 推奨設定
});
```

### **Strict**であることの不都合な点

meSite=Strictを設定すると、外部サイトからリンクをクリックしてあなたのサイトに来たユーザーは、最初のリクエストでCookieが送信されないため、ログイン状態が認識されません。例えば、GitHubでこれを設定すると、メールのリンクからプライベートリポジトリにアクセスしてもログインしていない状態として扱われます [OWASP Foundation](https://owasp.org/www-community/SameSite)。

---

# **Secure属性 - 中間者攻撃からの保護**

Secure属性は、CookieがHTTPS接続でのみ送信されることを保証します。HTTP接続では、Cookieは送信されません。これにより、Man-in-the-Middle（MITM）攻撃によるCookie盗聴を防ぎます [Security Boulevard](https://securityboulevard.com/2020/08/the-httponly-flag-protecting-cookies-against-xss/)[TrustFoundry](https://trustfoundry.net/2024/03/07/securing-session-cookies/)。

````JavaScript
// バックエンド設定
res.cookie('auth_token', token, {
  httpOnly: true,
  secure: true,  // ✅ HTTPSでのみ送信
  sameSite: 'lax'
});
```

#### **なぜSecureが重要か？**

HTTP接続は暗号化されていないため、ネットワーク上を流れるデータ（Cookieを含む）を第三者が傍受できます。特に公共Wi-Fiなどでは危険です。
```
❌ HTTP (暗号化なし)
クライアント → Cookie: session_id=abc123 → サーバー
              ↑
         攻撃者が盗聴可能！

✅ HTTPS (暗号化あり)
クライアント → 🔒暗号化されたCookie🔒 → サーバー
              ↑
         攻撃者は読めない
       
````

### ✅ **推奨設定（ベストプラクティス）**

```JavaScript
app.use(session({
  name: 'session_id',
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,      // ✅ XSS対策
    secure: true,        // ✅ HTTPS必須（本番環境）
    sameSite: 'lax',     // ✅ CSRF対策
    maxAge: 24 * 60 * 60 * 1000  // 24時間
  }
}));
```

---

### 🎯 **重要なポイント**

1. **HttpOnlyはXSS攻撃を防がない**: XSS脆弱性自体を修正することが最優先。HttpOnlyは「影響の軽減」手段 [Clerk](https://clerk.com/blog/how-httponly-cookies-help-mitigate-xss-attacks)

2. **SameSiteだけでは不十分**: CSRFトークンも併用することを推奨。古いブラウザや特殊なケースへの対策として [Simon Willison](https://simonwillison.net/2021/Aug/3/samesite/)

3. **多層防御が重要**: Cookie属性 + CSRFトークン + 入力検証 + CSPヘッダーの組み合わせ

これらの属性を正しく設定することで、Webアプリケーションのセキュリティを大幅に向上させることができます！

# CSRFトークン

**CSRFトークンとは？**  
CSRFトークンは、Webアプリケーションが不正なリクエストから保護するために生成する、一意で予測不可能な秘密の値です。サーバー側で生成され、各ユーザーセッションまたはリクエストごとに異なります。

[Mozilla](https://developer.mozilla.org/en-US/docs/Web/Security/Attacks/CSRF)[Bright Security](https://brightsec.com/blog/csrf-token/)

## CSRFトークンの目的

  
SameSite Cookieだけでは不十分

サブドメインからの攻撃は防げないんです。（[attacker.example.com](http://attacker.example.com/) → [example.com](http://example.com/)）  

CSRFトークンは、攻撃者がバックエンドサーバーへの有効なリクエストを作成できないようにすることで、CSRF攻撃を防ぎます OWASP Cheat Sheet Series。

🔄 CSRFトークンの仕組み  
基本的な流れ

1. ユーザーがページをリクエスト  
    ↓

2. サーバーがCSRFトークンを生成してページに埋め込む  
    ↓

3. ユーザーがフォームを送信  
    ↓

4. サーバーがトークンを検証  
    ↓

5. トークンが一致 → リクエスト処理  
    トークンが不一致 → リクエスト拒否

## 実装例

```JavaScript

// バックエンド
javascriptconst express = require('express');
const csrf = require('csurf');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const app = express();
const csrfProtection = csrf({ cookie: true });

app.use(cookieParser());
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

// ✅ CSRFトークンを取得するエンドポイント
app.get('/api/csrf-token', csrfProtection, (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

// ✅ 保護されたエンドポイント
app.post('/api/transfer', csrfProtection, (req, res) => {
  const { to, amount } = req.body;
  // 送金処理...
  res.json({ success: true });
});

// フロントエンド（React）
typescriptimport { useState, useEffect } from 'react';
import axios from 'axios';

// Axiosのデフォルト設定
axios.defaults.withCredentials = true;

function TransferForm() {
  const [csrfToken, setCsrfToken] = useState('');

  // ✅ 1. コンポーネントマウント時にCSRFトークンを取得
  useEffect(() => {
    const fetchCsrfToken = async () => {
      const response = await axios.get(
        'http://localhost:8000/api/csrf-token'
      );
      setCsrfToken(response.data.csrfToken);
    };
    fetchCsrfToken();
  }, []);

  // ✅ 2. リクエスト時にカスタムヘッダーでトークンを送信
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await axios.post(
        'http://localhost:8000/api/transfer',
        { to: 'Alice', amount: 1000 },
        {
          headers: {
            'X-CSRF-Token': csrfToken  // ✅ カスタムヘッダー
          }
        }
      );
      alert('送金成功！');
    } catch (error) {
      alert('エラーが発生しました');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <button type="submit">送金</button>
    </form>
  );
}
```

### 実装上の注意点

[

Cross-Site Request Forgery Prevention - OWASP Cheat Sheet Series

Website with the collection of all the cheat sheets of the project.

![](Import%20tech/Attachments/WebSite_Favicon.png)https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html



](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html)

|   |   |   |   |
|---|---|---|---|
|パターン|特徴|メリット|デメリット|
|session毎|セッション中は同じトークンを使用する|使いやすさがよい|セキュリティはやや低い|
|リクエスト単位|毎回新しいトークンを作成|セキュリティが非常に高い|ブラウザの戻るボタンで問題が発生する可能性がある。|

# ⚠XSSがあればCSRF保護は無意味

XSS（Cross-Site Scripting）脆弱性は、すべてのCSRF軽減技術を無効化できます！XSS脆弱性が存在しないことを確認することが非常に重要です OWASP Cheat Sheet Series。

````JavaScript

javascript// ❌ XSS攻撃の例
// 攻撃者が注入したスクリプト
<script>
  // ページからCSRFトークンを読み取る
  const token = document.querySelector('[name="_csrf"]').value;
  
  // 盗んだトークンで不正なリクエストを送信
  fetch('/transfer', {
    method: 'POST',
    headers: { 'X-CSRF-Token': token },
    body: JSON.stringify({ to: 'attacker', amount: 10000 })
  });
</script>
```

XSS脆弱性があると、攻撃者はXMLHttpRequestを使用してサイト上の任意のページを読み取ることができるため、CSRFトークンも読み取られてしまいます 。

---

## 🔗 **多層防御戦略**

CSRFトークンは単独で使うのではなく、他の防御策と組み合わせるべきです：
```
┌─────────────────────┐
│  多層防御アプローチ   │
└─────────────────────┘
         ↓
  1. SameSite Cookie (Lax)
         ↓
  2. CSRF Token
         ↓
  3. Origin/Referer検証
         ↓
  4. カスタムヘッダー
         ↓
  5. XSS対策（入力検証・出力エスケープ）
````