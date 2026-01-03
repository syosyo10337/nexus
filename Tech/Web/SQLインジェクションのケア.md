---
tags:
  - web
  - security
  - sql-injection
created: 2026-01-04
status: active
---

🕤

# SQLインジェクションのケア

`**Micropost.where("user_id = ?", id)**`

ここでいうidはインスタンスメソッド定義内なので、User#idってこと.

上のように、SQL文を直打ちする時は、エスケープさせましょう。

つまり、find_by(name: “fadfa”)などメソッドで指定できる範囲は、いいが、Rubyの値を#{}で式展開するような場合には、前述の書き方をするべきである。 また、一応変数を代入する時は

```Ruby
Micropost.where(user_id: id)とするか　
Micropost.where('user_id = ?', id)としましょう
```