 

# gem ‘kaminari ‘

---

[githubのソースコード](#8ccd7568-0e8a-4157-aea1-cdf964d1ef8b)

[導入](#7b2d6ea2-4987-4791-b9ef-0ffe66a3f448)

[設定](#7543e69f-c498-4962-b7e0-dd1eaf4d074c)

[標準的な設定項目の上書きをする。](#831a735e-5127-49c6-ab04-445d46dab0c1)

[設定ファイルをlocalにとってくるgenerater](#b057b3e9-ae63-42cb-af5a-dcba305798d8)

[Controllerの設定](#70ea690c-32d2-410e-913c-a3b43a731120)

[ページネーションにスタイルを付ける](#c275bb72-7091-45e6-b247-afb159d9f251)

[リクエスト時に思ったリソースに届かない時](#07f454cc-8053-4a40-9bf6-97c8da01b6e0)

# githubのソースコード

---

[

GitHub - kaminari/kaminari: ⚡ A Scope & Engine based, clean, powerful, customizable and sophisticated paginator for Ruby webapps

A Scope & Engine based, clean, powerful, customizable and sophisticated paginator for modern web app frameworks and ORMs Does not globally pollute Array, Hash, Object or AR::Base. Just bundle the gem, then your models are ready to be paginated. No configuration required. Don't have to define anything in your models or helpers.

![](favicon%2026.ico)https://github.com/kaminari/kaminari

![](kaminari.png)](https://github.com/kaminari/kaminari)

# 導入

---

Gemfileに追記

```Ruby
gem 'kaminari’
```

例によって

```Bash
$ bundle install
```

これで導入は完了

# 設定

---

### 標準的な設定項目の上書きをする。

以下のメソッドは代入する形で、デフォルトの設定をオーバーライドできます。

```Ruby
# Kaminari.configure method一覧

default_per_page      # 25 by default
max_per_page          # nil by default
max_pages             # nil by default
window                # 4 by default
outer_window          # 0 by default
left                  # 0 by default
right                 # 0 by default
page_method_name      # :page by default
param_name            # :page by default
params_on_first_page  # false by default
```

### 設定ファイルをlocalにとってくるgenerater

config/initializers/下に設定ファイルを作るよ。

```Bash
$ rails g kaminari:config
```

生成されたファイルで上の項目を編集できる。

また、モデルごとにper_page/max_paginates_perなどの設定もできるよ。

```Ruby
# 50項目で、ページネーションする設定をUserモデルに対して行う例

class User < ActiveRecord::Base
  paginates_per 50
end
```

## Controllerの設定

---

ページに関するパラメタ(Page Parameter)は, params[:page]に格納されています。

```Ruby
#e.g.
class UserControllers < .....

def index
	@users = User.order(:name).page params[:page]
end
```

## ページネーションにスタイルを付ける

---

いくつか方法は考えられるが、kaminariのライブラリからページネーションを実装している部分を引っ張ってくる。

```Bash
$ rails g kaminari:views default
```

もし、bootstrapをつけたいなら、

```Bash
$ rails g kaminari:views bootstrap

# 特定のテーマを引っ張りたい時は
$ rails g kaminari:views <テーマ名>

# もしもすべてのテーマが欲しい時は, 引数を与えない
$ rails g kaminari:views
```

テーマのソースは

[

GitHub - amatsuda/kaminari_themes

The generator can fetch several sample template themes from this repository, in addition to the bundled "default" one, to help you create a nice-looking paginator. rails g kaminari:views default You can also specify between erb, haml or slim (in some themes): rails g kaminari:views semantic_ui -e haml To see the full list of available themes, take a look at the themes repository, or just hit the generator without specifying a THEME argument.

![](favicon%2026.ico)https://github.com/amatsuda/kaminari_themes

![](kaminari_themes.png)](https://github.com/amatsuda/kaminari_themes)

## リクエスト時に思ったリソースに届かない時

---

最もシンプルな例は

```Ruby
<%= paginate @user %>
```

この時は、現在のパス(e.g. /users)に?page＝ とクエリをつけて、GETメソッドでリクエストを送ることになり、それに対応するルーティングを経由しアクションに到達する。

ただ、更新のエラーなどにより現状のパスが変更された時(e.g. /logs)これに対してのクエリ付きリクエストだと、本来希望するアクションへ届かない。

ので

```Ruby
#この構文を使って送信するパラメータを明示する
<%= paginate @users, params: {controller: 'foo', action: 'bar', format: :turbo_stream} %>
```