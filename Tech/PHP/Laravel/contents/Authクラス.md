---
tags:
  - php
  - syntax
created: 2026-01-03
status: draft
---

# Authクラス

Authenticationをおこなうためのクラス。

1番基本的な認証の方法

```JavaScript
Auth::attempt();
```

🚨

defaultのsessionは24 minらしいよ。

```PHP
// ユーザのログイン状況を調べる
Auth::check()

// 現在のログイン中のユーザのセッションを無効にする。
Auth::logout()

// 引数にとったユーザをログイン状態にする。
Auth::login($user);
```

::attemptのの引数にパラメータを渡してログイン状態にすることもできる。