 

# deviseのsign_up/in/outのページ遷移 (1)

[

How To: Redirect to a specific page on successful sign in, sign up, or sign out · heartcombo/devise Wiki

You can't perform that action at this time. You signed in with another tab or window. You signed out in another tab or window. Reload to refresh your session. Reload to refresh your session.

![](favicon%207.ico)https://github.com/heartcombo/devise/wiki/How-To:-Redirect-to-a-specific-page-on-successful-sign-in,-sign-up,-or-sign-out

![](devise%203.png)](https://github.com/heartcombo/devise/wiki/How-To:-Redirect-to-a-specific-page-on-successful-sign-in,-sign-up,-or-sign-out)

## ユーザ登録ログイン関連で気をつけること

### ユーザ登録

- ユーザ名などのカラムを追加する際には、StrongParameters等をいじること。

- ログイン後のページ遷移を考える。会員登録後に、自動的にログインするようにはなっているので、authenticate_rootと名付けたルートを設定するとそこのアクションへと流れる。

### ログイン

- authenticate_user! ログインしているユーザがどうかを判別する。ログインしてない場合には、ログイン画面へリダイレクト

- current_user ログイン中のユーザを返す。(session状態を理解する)

### Session管理　

ただ、ログインする時に

cookieとして　

recorda_me_sessionと_profilinがレスポンスでセットされる。

<アプリ名>_session

recorda_me_sessionはセッション情報

remember_meを有効にすると

remember_user_tokenも送信される。

profilinは多分関係ない？？

Deviseでは、ログインしているかどうかをauthenticate_user!という形で、チェックする。してなければログインフォームへ飛ばす。

さらに、:idの値をリクエストで受け取って、アクションに通すのではなく、current_userの値を持ちながら、/users/editだったら、current_userのパラメタを使うようにscopeがなっているので、そもそも、users/edit/:idへのアクセスを悪用して、他のユーザを編集、削除できないようになっている。