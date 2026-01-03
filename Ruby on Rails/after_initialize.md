---
tags:
  - rails
  - activerecord
created: 2026-01-03
status: active
---

# after_initialize

[

Active Record コールバック - Railsガイド

Active Recordのコールバックについて解説します。

![](android-icon-192x192.png)https://railsguides.jp/active_record_callbacks.html

![](cover_for_facebook%205.png)](https://railsguides.jp/active_record_callbacks.html)

[`after_initialize`](https://api.rubyonrails.org/v7.1/classes/ActiveRecord/Callbacks/ClassMethods.html#method-i-after_initialize)コールバックは、Active Recordオブジェクトがインスタンス化されるたびに呼び出されます。インスタンス化は、直接`new`を実行する他に、データベースからレコードが読み込まれるときにも行われます。これを利用すれば、Active Recordの`initialize`メソッドを直接オーバーライドせずに済みます。