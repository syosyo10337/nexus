---
tags:
  - rails
  - activerecord
  - controller
  - view
created: 2026-01-03
status: active
---

# (draft)form_for(devise)に書かれているをform_withに書き直す

- resource変数には何が入っているのか？ —>作った@モデル名が入っていると考えて良さそう。

---

### step1: `model: @モデル名` に書き換える。

### step2 `url: URL(名前付きルート)`を書き換える

<form>内の

id: 'new_user', class: 'new_user’は任意でつけたり、つけなかったり

設計上の影響はない.スタイルをつけたいとかなら必要になる。

```Ruby
#変更される前
<h2>Log in</h2>

<%= form_for(resource, as: resource_name, url: session_path(resource_name)) do |f| %>
  <div class="field">
    <%= f.label :email %><br />
    <%= f.email_field :email, autofocus: true, autocomplete: "email" %>
  </div>

  <div class="field">
    <%= f.label :password %><br />
    <%= f.password_field :password, autocomplete: "current-password" %>
  </div>

  <% if devise_mapping.rememberable? %>
    <div class="field">
      <%= f.check_box :remember_me %>
      <%= f.label :remember_me %>
    </div>
  <% end %>

  <div class="actions">
    <%= f.submit "Log in" %>
  </div>
<% end %>

<%= render "devise/shared/links" %>
<br>
<br>
```

```Ruby

#変更後
<h2>Log in</h2>

<%= form_with(model: @user, url: user_session_path) do |f| %>
  <div class="field">
    <%= f.label :email %><br />
    <%= f.email_field :email, autofocus: true, autocomplete: "email" %>
  </div>

  <div class="field">
    <%= f.label :password %><br />
    <%= f.password_field :password, autocomplete: "current-password" %>
  </div>

  <% if devise_mapping.rememberable? %>
    <div class="field">
      <%= f.check_box :remember_me %>
      <%= f.label :remember_me %>
    </div>
  <% end %>

  <div class="actions">
    <%= f.submit "Log in" %>
  </div>
<% end %>

<%= render "users/shared/links" %>
<br>
<br>
```

cf)_

[

ユーザー認証機能【devise】｜Web開発で学ぶプログラミング

deviseとはユーザー認証機能（新規登録とかログインとか）を簡単に作成できるgemです。自分で認証機能を作ろうとすると、個人情報が絡んできたりと、セキュリティ面の心配が出てきます。このdeviseを使えば、そのような問題もクリアできます。 まずはdeviseをインストールしましょう。Gemfileの一番下に下記を追加記述します。 そして、アプリに読み込みを行います。 続いて、deviseのセットアップを行います。 このように表示されます。 =============================================================================== Depending on your application's configuration some manual setup may be required: 1. Ensure you have defined default url options in your environments files. Here is an example of default_url_options appropriate for a development environment in config/environments/development.rb: config.action_mailer.default_url_options = { host: 'localhost', port: 3000 } In production, :host should be set to the actual host of your application.

![](logo-transparent%202.png)https://zenn.dev/odentravel/books/e69a157daeecb3/viewer/f54358#form_for%E3%82%92form_with%E3%81%AB%E3%81%99%E3%82%8B

![](Ruby%20on%20Rails/Attachments/og-base-book_yz4z02%201.jpeg)](https://zenn.dev/odentravel/books/e69a157daeecb3/viewer/f54358#form_for%E3%82%92form_with%E3%81%AB%E3%81%99%E3%82%8B)