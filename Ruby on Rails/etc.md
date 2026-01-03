---
tags:
  - rails
  - controller
created: 2026-01-03
status: draft
---

# etc

`to:`の引数に`String`を渡す場合は`コントローラ#アクション`  
形式であることが前提です。

`Symbol`を使う場合は、`to:`オプションを`action:`に置き換えるべきです。

`#`なしの`String`を使う場合は、`to:`オプションを`controller:`  
に置き換えるべきです。

```Bash
`get 'profile', to: 'users#show'`

`get 'profile', action: :show, controller: 'users'`
```