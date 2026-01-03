---
tags:
  - rails
  - activerecord
  - controller
  - view
created: 2026-01-03
status: active
---

# formヘルパー

---

[Formヘルパーとは](#d66836f9-5d9e-4d60-9da1-1df987c6562d)

[フォームの要素を生成するヘルパー](#359bf032-181b-4af9-967b-06d4b8e550ed)

[フォームヘルパーメソッドの一例](#c15d861f-0ab2-4946-88c6-b62afe1feabc)

[モデルオブジェクトも扱う](#107361b7-1cb5-40f8-871b-f4d128fbfd3e)　

## Formヘルパーとは

---

Railsアプリのviewにおいて、webページ上に表示するフォームを簡単に作成できるRailsに組み込まれたメソッド群のこと。

基本的な使い方は、

まず、form_withヘルパーメソッドを使い、そのブロック内で生成されるフォームビルダーオブジェクト(よく|form|や|f|と名づけられているやつ)にメソッドを呼び出すことで、ラジオボタン、テキスト入力などが可能なフィールドを生成する。

デフォルトでは、HTTP POSTメソッドをユーザのアクションからアプリに送信するようになっている

### フォームの要素を生成するヘルパー

---

```Ruby
#e.g.)
<%= form_with @app do |form| %>
  <%= form.check_box :pet_dog %>
	<%= form.label :pet_dog, "I own a dog" %>
	<%= form.check_box :pet_cat %>
	<%= form.label :pet_cat, "I own a cat" %>
<% end %>
```

```HTML
#上の例の時,HTMLでは
<input type="checkbox" id="pet_dog" name="pet_dog" value="1" />
<label for="pet_dog">I own a dog</label>
<input type="checkbox" id="pet_cat" name="pet_cat" value="1" />
<label for="pet_cat">I own a cat</label>
```

上の例のform_withのブロック内に書かれている`f.check_box`等が、フォームの要素を作成するヘルパーメソッドの例です。

**これらのメソッドの第一引数には、常に、inputの名前を指定する。**

つまり、inputタグのname属性に入る名前を指定するということ。

また、実際にユーザからフォームが送信されると、Railsアプリ側では、`params[:<name属性の値>]`で参照できる

つまり、

```Ruby
#railsアプリ側では、

params[:pet_dog]で、HTMLのvalue属性の値を参照できる。
#=> "1"
```

### フォームヘルパーメソッドの一例

---

|   |   |
|---|---|
|.label|ラベルテキスト|
|.password_field|パスワード入力フィールド|
|.email_field|emailアドレス入力フィールと|
|.text_field|テキスト入力フィールド|
|submit|送信ボタン|
|.check_box|チェックボックス|
|.text_area|複数行入力テキストエリア|
|.hidden_field|hiddenフィールドを作る|

checkboxやradio_buttonを使う時には、必ずセットでlabelも生成してください。

cf)より詳細に知りたい人は　

[

Action View フォームヘルパー - Railsガイド

このガイドはフォームヘルパーとその引数について網羅的に説明するものではありません。完全なリファレンスについては Rails APIドキュメント を参照してください。 最も基本的なフォームヘルパーはです。 上のように form_withを引数なしで呼び出すと、 タグを生成します。このフォームを現在のページに送信するときにHTTP ...

![](favicon%2024.ico)https://railsguides.jp/form_helpers.html#%E3%81%9D%E3%81%AE%E4%BB%96%E3%81%AE%E3%83%98%E3%83%AB%E3%83%91%E3%83%BC

![](cover_for_facebook%207.png)](https://railsguides.jp/form_helpers.html#%E3%81%9D%E3%81%AE%E4%BB%96%E3%81%AE%E3%83%98%E3%83%AB%E3%83%91%E3%83%BC)

## モデルオブジェクトも扱う　

---

`form_with`の`:model`引数を使うと、フォームビルダーオブジェクトをモデルオブジェクトに紐付けできるようになります。つまり、フォームはそのモデルオブジェクトを対象とし、そのモデルオブジェクトの値がフォームのフィールドに自動入力されるようになります。

```Bash
@article = Article.find(42)
# => #<Article id: 42, title: "My Title", body: "My Body">
```

上のような属性を持つモデルが存在する時

```Ruby
<%= form_with model: @article do |form| %>
  <%= form.text_field :title %>
  <%= form.text_area :body, size: "60x10" %>
  <%= form.submit %>
<% end %>
```

このようなフォームを作成すると、

```HTML
<form action="/articles/42" method="post" accept-charset="UTF-8" >
  <input name="authenticity_token" type="hidden" value="..." />
  <input type="text" name="article[title]" id="article_title" value="My Title" />
  <textarea name="article[body]" id="article_body" cols="60" rows="10">
    My Body
  </textarea>
  <input type="submit" name="commit" value="Update Article" data-disable-with="Update Article">
</form>
```

このようなHTMLが出力されます。画面上では、@articleオブジェクトのtitleとbody属性の値が、デフォルトとして入力されているテキストフィールド(HTMLだと`<input type=”text”>`)とテキストエリア(HTMLだと`<textarea>`)が生成されます。