---
tags:
  - rails
  - activerecord
  - controller
  - view
created: 2026-01-03
status: active
---

⬇️

# Deviseの導入

1. gemを追加

2. bundel install

3. rails g devise:install

(configの中やらに必要なファイルをDLする)

4. rails g devise モデル名 → rails db:migrate

[

GitHub - heartcombo/devise: Flexible authentication solution for Rails with Warden.

Devise is a flexible authentication solution for Rails based on Warden. It: Is Rack based; Is a complete MVC solution based on Rails engines; Allows you to have multiple models signed in at the same time; Is based on a modularity concept: use only what you really need.

![](Ruby%20on%20Rails/Attachments/favicon%205.ico)https://github.com/heartcombo/devise#getting-started

![](devise%202.png)](https://github.com/heartcombo/devise#getting-started)

使えるようになるへルパー

---

authenticate_user! —サインインチェック

user_signed_in? —サインの有無で真偽値を返す

current_user —サインイン中のユーザを返す

user_sesion —セッション？

### もっとも詳しく

---

## 1. defaultのviewを変更したい時

### ==(大抵そう）==

---

元々のviewがgemの中に入っているので、自分でいじりたい時は、viewのファイルたちをコピーして、上書きするよ。

> Since Devise is an engine, all its views are packaged inside the gem.

- 具体的には

`$ rails generate devise:views`

すると、

**app/views/devise/sessions/**

等のいじれるviewファイルをコピーできる

- 自作のusersビューなどと持つ場合は、usersという名前で管理したい時(複数の認証機能持ちモデルを用意する時は)
    
    ex)**app/views/users/**
    
    1. `$ rails generate devise:views users`を使って名前を対応させたviewをコピーし
    
    2. config/initializers/devise.rbにて、`config.scoped_views = true`に変更する
    

---

## 2.[日本語化及びflashメッセージの処理](../Rails%E3%81%AEI18n%20b8728afac93f4bbf96c8f1933e47b91c.html)

==_**** (現状でのベストプラクティス?)一応deviseファイル対応のdevise-i18n(gem)はあるが、わざわざ日本語以外にも対応させる必要もない点と、場合によっては設定されている翻訳語をカスタムしたい(→ローカルにファイルを配置することになる)のであれば、必要最低限の翻訳文だけをgithubからコピペするのが実用的な運用方法だと思う**_==

---

## 3. コントローラレベルでカスタムしたい時

---

### step0.

デフォルトで、認証機能付きモデルを作成した時、下の==紫==の部分を見るように、ルーティングが追加されている

```Shell
[masanao@Masabook 15:54] toy_app % rails g devise User
Running via Spring preloader in process 10770
      invoke  active_record
      create    db/migrate/20220929065424_devise_create_accounts.rb
      create    app/models/user.rb
      invoke    test_unit
      create      test/models/user_test.rb
      create      test/fixtures/users.yml
      insert    app/models/user.rb
       route  devise_for :users
```

```Ruby
#config/routes.rb

Rails.application.routes.draw do
  devise_for :users
  
  root 'users#index'
end
```

この時`$ rails routes`してみると,**devise/sessions#destroy**を経由しているのがわかる。

これは、gemの中部のファイルにあるコントローラ

### step1.

自作のコントローラを作成する

```Shell
$ rails g devise:controllers スコープ名
```

```Shell
#[scope] = accountsの時
rails g devise:controllers accounts
Running via Spring preloader in process 10937
      create  app/controllers/accounts/confirmations_controller.rb
      create  app/controllers/accounts/passwords_controller.rb
      create  app/controllers/accounts/registrations_controller.rb
      create  app/controllers/accounts/sessions_controller.rb
      create  app/controllers/accounts/unlocks_controller.rb
      create  app/controllers/accounts/omniauth_callbacks_controller.rb
===============================================================================

Some setup you must do manually if you haven't yet:

  Ensure you have overridden routes for generated controllers in your routes.rb.
  For example:

    Rails.application.routes.draw do
      devise_for :users, controllers: {
        sessions: 'users/sessions'
      }
    end

===============================================================================
```

インストラクションに従って、routesを変更し、

```Ruby
#config/routes.rb


devise_for :users, controllers: { sessions: 'users/sessions',
																	registrations: 'users/registraitons" }

#経由するこコントローラがsessions: の話は
'users/sessions'#このファイルだよ！という指定
```

生成したコントローラ ( Devise::PasswordsControllerを継承している)を経由して、viewを使えるようにする。

```Ruby
#ref)
#app/controllers/accounts/passwords_controller.rb


class Accounts::PasswordsController < Devise::PasswordsController
```

### step3. 実際にroutingしたコントローラで編集してみる

```Ruby
#app/controller/accounts/sessions_controller.rbにて

def new
#superの前に書きたいカモ
    @hello = "hello"
    super
    
  end
```

とすると、@helloがview (今回だと,==app/views/devise/sessions/new.html.erb==)にて使えるよ。

---

devise全般(メール送信、外部認証)について最も参考した資料

[

deviseの使い方とは？ログイン認証機能を実装しよう

この章では、ログイン認証についてとdeviseのインストール方法について１つ１つ丁寧に解説します。 ログイン認証とは簡単にいうとログイン、ログアウト機能のことです。 ログインするにはまずサインアップ（新規登録）をする必要があるので、ユーザー登録も必要になります。 これを自分で実装しようとすると非常に大変です。 ですが devise というgemを使えば簡単に実装することができます。 それではrailsのアプリにdeviseをインストールしてみましょう。 Gemfile の一番下にこのように記述してください。 その後、ターミナルで bundle installを行いましょう。 次にターミナルで下記のコマンドを実行してください。 以下のようにターミナルに出力されればインストールに成功しています。 ここで出力されるメッセージの内容を確認してみましょう。 1. 新規登録などで認証メールを送った際、メールの文中にある認証リンクのURLを設定します。 設定するファイルは config/environments/development.rbです。 出力された内容にある通り下記のように設定します。 デフォルトだと{ host: 'localhost', port: 3000 }になっています。 2. ルートを設定します。 deviseだと会員登録完了後などにルートに飛ぶ設定になっているため、あらかじめ config/routes.rbでルートを設定する必要があります。 3. フラッシュメッセージ用のタグをビューに埋め込みます。 これは flashメッセージというもので、それぞれ notice, alertという変数に格納されています。 ログインした際やログアウトした際、フォームの送信エラーなど簡単な通知をしたい場合に使用します。 フラッシュメッセージを表示させたい時はこのコードを共通のビューである app/views/layouts/application.html.erbに追記します。 4.

![](favicon%206.ico)https://pikawaka.com/rails/devise

![](rails-1.png)](https://pikawaka.com/rails/devise)

[⚠️Deviseのユーザ認証設計を理解する](Devise%E3%81%AE%E3%83%A6%E3%83%BC%E3%82%B6%E8%AA%8D%E8%A8%BC%E8%A8%AD%E8%A8%88%E3%82%92%E7%90%86%E8%A7%A3%E3%81%99%E3%82%8B%20bb802eaf2cb844909f73bd4291304b34.html)

[deviseのsign_up/in/outのページ遷移](Devise%E3%81%AE%E5%B0%8E%E5%85%A5/devise%E3%81%AEsign_up%20in%20out%E3%81%AE%E3%83%9A%E3%83%BC%E3%82%B8%E9%81%B7%E7%A7%BB%20668deb0343b94f90819f5d3ac7940185.html)