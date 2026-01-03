---
tags:
  - rails
  - view
  - auth
created: 2026-01-03
status: active
---

# Railsの機能に沿ったセッション管理

- session情報とは、HTTPにアクセスしているユーザの状態を一時的に持たせること

- Rails標準だと、ブラウザのcookieを利用してセッション情報を管理する。sessionメソッドを活用する。このメソッドの任意のキーに値を代入することで、ブラウザ側に対して、代入した値に対応する暗号化されたcookieをセットする(set-cookie)。ただし、==rails側でexpires の期限を決めることができない。==

*session --Rails組み込みメソッド。simpleなログイン機能実装のために用いる。  
(メソッドらしくない振る舞いをする。)  
sessionメソッドで作成された一時cookiesはブラウザが閉じられた時に消滅する。

実際に二度ページを開いたもののsessionとなるものはブラウザを閉じると消滅している。

cf)cookiesメソッド

```Ruby

ex)@「app/helpers/sessions_helper.rb」
module SessionsHelper
#sessionによって判別した状態を、呼び出しやすくするためにヘルパーメソッド定義
	def log_in(user)
		session[:user_id] = user.id
	end
end
```

---

2.Railsにはcookieメソッドもある。こちらはデフォルトでは平文である点に注意する。

こちらのメソッドを使って、ブラウザのクッキーに対して、（有効期限も含めた）情報を保存させて、Remember_meの機能を実装している。

この機能の実装に関して、Rails チュートリアルでは、==token==（ランダムな文字列）を発行し、DBではその==ハッシュ値==を保存。同時に、user_idを暗号化した値も一緒にcookieをセットすることで、

1. user_idの暗号値から、ユーザの判読

2. tokenとそのdigest(DB側で保存する値)を照合すること

この2ステップで認証している。

💡

もし、暗号化されたuser_idだけでRemember_meを実現しようとすると、クッキーのuser_idに当たる情報がバレた時に、暗号化されたIDでログインが行われてしまうので、❌

```Ruby

ex)
cookies[:remember_token] ={ 
	value: remember_token, 
	expires: 20.years.from_now.utc 
}
```

  
+`.permanent`を使うと、20年有効のクッキーを設定してくれる

(RailsがIntegerクラスを拡張したメソッド)

```Ruby

ex)#ひとつ前の例を次のように書くこともできる。
cookies.permanent[:remember_token] = remember_token
```

+`.encrypted` --クッキーの内容は平文らしいので,ブラウザ側に保存するユーザIDはこのメソッドで暗号化する。

さらに

==User.find_by(id: cookies.encrypted[:user_id])としても、Rails側で暗号化してセットしたユーザを平文として扱ってくれるので、ユーザを探せる。==

+`.signed` —によって署名付きcookie****(クライアント側の改ざん防止可能)も設定できる****

❓

Deviseでの実装では、remember_tokenだけが飛んでいるので、おそらくこの中にユーザIDが入っている？もしくは、ブラウザによって長めに保持されるようになったsession用のクッキーを利用？