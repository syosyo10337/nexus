---
tags:
  - rails
  - controller
  - auth
  - testing
created: 2026-01-03
status: active
---

# deviseのsign_up/in/outのページ遷移

[

How To: Redirect to a specific page on successful sign in, sign up, or sign out · heartcombo/devise Wiki

You can't perform that action at this time. You signed in with another tab or window. You signed out in another tab or window. Reload to refresh your session. Reload to refresh your session.

![](Ruby%20on%20Rails/Attachments/favicon%204.ico)https://github.com/heartcombo/devise/wiki/How-To:-Redirect-to-a-specific-page-on-successful-sign-in,-sign-up,-or-sign-out

![](devise%201.png)](https://github.com/heartcombo/devise/wiki/How-To:-Redirect-to-a-specific-page-on-successful-sign-in,-sign-up,-or-sign-out)

## ユーザ登録ログイン関連で気をつけること

### ユーザ登録

- ユーザ名などのカラムを追加する際には、StrongParameters等をいじること。

- ログイン後のページ遷移を考える。会員登録後に、自動的にログインするようにはなっているので、authenticate_rootと名付けたルートを設定するとそこのアクションへと流れる。

### ログイン

- authenticate_user! ログインしているユーザがどうかを判別する。