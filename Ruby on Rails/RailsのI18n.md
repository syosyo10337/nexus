---
tags:
  - rails
  - activerecord
  - controller
  - view
created: 2026-01-03
status: active
---

🌍

# RailsのI18n

## フラッシュメッセージを日本語化

### (及びアプリ全般の日本語化について)

---

==日本語に変えるというのは、====**英語に対する日本語訳がずらーっと書かれているファイル（config/locale/以下のファイル）を参照できるようにするということ。**==

→この時、多言語対応や大掛かりに日本語対応させたい時は、localeファイルをmodelなどで分けたディレクトリ構造を取ると良い。この時Railsデフォルトではlocale/以下でネストしたdirに対応していないので、

```Ruby
# config/application.rb
config.i18n.load_path += Dir[Rails.root.join('config', 'locales', '**', '*.{rb, yml}')]
```

と追記して、辞書ファイル読み込みのパスを指定する必要があります。==(ちなみに、devise.ja.yml等ファイルにactive_recordの訳語当てても反応しなかった.←こちらも読み込みのパスを通す必要ありそう)==

---

### ①まず、アプリケーションデフォルトで使用する言語を変更

```Ruby
#config/application.rb

module I18nApp
  class Application < Rails::Application
    config.i18n.default_locale = :ja # 追記
  end
end
```

その後、現在の言語(:ja)に対応する翻訳の文をyml形式でファイルとし配置

→この辞書ファイルにあたるのが`config/ja.yml` deviseを扱う際には(`config/devise.ja.yml`)という形式で扱ったりもする。

---

### ②rails-i18n(gem)をインストール

month: _names: 等の基本的な日本語の辞書データを手動でDLしなくてもするためのgem.

日本語以外にも`config.i18n.default_locale =` で設定した言語に対応 するようになる。

- gem入れたくない,　もしくは日本語にだけ対応できればそれでいい人は、
    
    以下のコマンドで、以下のファイルを手動で配置する必要がある。
    
    ```Ruby
    curl -s https://raw.githubusercontent.com/svenfuchs/rails-i18n/master/rails/locale/ja.yml -o config/locales/ja.yml
    
    #手動でjaロケールファイルをとってくる。
    ```
    
    [
    
    rails-i18n/ja.yml at master · svenfuchs/rails-i18n
    
    This file contains bidirectional Unicode text that may be interpreted or compiled differently than what appears below. To review, open the file in an editor that reveals hidden Unicode characters. Learn more about bidirectional Unicode characters You can't perform that action at this time. You signed in with another tab or window.
    
    ![](favicon%2011.ico)https://github.com/svenfuchs/rails-i18n/blob/master/rails/locale/ja.yml
    
    ![](rails-i18n.png)](https://github.com/svenfuchs/rails-i18n/blob/master/rails/locale/ja.yml)
    

---

### ③localeファイルを作って、辞書ファイルを記述する。

devise関連のエラーや、rails側のflash/errorについて対応するlocaleファイルはGithub等からコピペしてきて、自分で追加したモデルやモデルの属性に関する記述は手動で追記するのがおすすめ。

例）ファイルの使い分け例

config —locales — devise.ja.yml(エラーやdevise 関連)

|_ ja.yml (単にモデルやカラムに関するもの)

==*====ディレクトリを分けてネストすると、I18nのパスも改めて設定する必要があります。==

==*config以下のファイルを変更した時はサーバーを再起動する必要があります。==

==_**** (現状でのベストプラクティス?)一応deviseファイル対応のdevise-i18n(gem)はあるが、わざわざ日本語以外にも対応させる必要もない点と、場合によっては設定されている翻訳語をカスタムしたい(→ローカルにファイルを配置することになる)のであれば、必要最低限の翻訳文だけをgithubからコピペするのが実用的な運用方法だと思う**_==

日本語化したいが、キーがどうしてもわからないような時は以下を参照してください。

対応するキーの訳語がないなら、その部分だけ自分で打ち込みましょう。独自のカラム名等

> こちらが、gem “rails-i18n”のソースコード

[

GitHub - svenfuchs/rails-i18n: Repository for collecting Locale data for Ruby on Rails I18n as well as other interesting, Rails related I18n stuff

Repository for collecting Locale data for Ruby on Rails I18n as well as other interesting, Rails related I18n stuff - GitHub - svenfuchs/rails-i18n: Repository for collecting Locale data for Ruby on Rails I18n as well as other interesting, Rails related I18n stuff

![](favicon%2011.ico)https://github.com/svenfuchs/rails-i18n

![](rails-i18n%201.png)](https://github.com/svenfuchs/rails-i18n)

以下がgem ”devise-i18n”内部のlocaleファイルなので、devise利用時はコピペ推奨(userモデルに関するデータも含んでいる)

[

devise-i18n/ja.yml at master · tigrish/devise-i18n

This file contains bidirectional Unicode text that may be interpreted or compiled differently than what appears below. To review, open the file in an editor that reveals hidden Unicode characters. Learn more about bidirectional Unicode characters You can't perform that action at this time. You signed in with another tab or window.

![](favicon%2011.ico)https://github.com/tigrish/devise-i18n/blob/master/rails/locales/ja.yml

![](devise-i18n.png)](https://github.com/tigrish/devise-i18n/blob/master/rails/locales/ja.yml)

- devise-i18n(gem)を使う場合には、
    
    ```Ruby
    $ rails g devise:views
    #で,viewを生成するのではなく、
    
    $ rails g devise:i18n:views
    #とすることで、viewファイルを生成し、日本語(厳密にはdefault_locale)に対応した辞書ファイル(gem内部にある)を参照する。
    ->暗示的に日本語化したviewを表示させる。
    ```
    
    ==→ローカルのlocaleファイルに引っ張ってきたい時。==
    
    ==（訳語をカスタムするため等)は==
    
    ```Shell
    $ rails g devise:i18n:locale ja
    #->config/locale/devise.views.ja.ymlが作成される
    #これによってgem内部にある辞書ファイルを参照する形から、アプリ内のlocaleを優先的に探索してくれるのでオーバーライドできる(訳語をカスタムできる)
    ```
    

- フルスクラッチから認証機能をつける時は、
    
    railsのソースコードから、validationエラー時のエラーメッセージがどこから呼び出されているかを調べて、キーを調べると良い。
    
    (validationのエラーについては[`activemodel/lib/active_model/locale/en.yml`](https://github.com/rails/rails/blob/main/activemodel/lib/active_model/locale/en.yml)  
     日付時刻フォーマット一覧は[`activesupport/lib/active_support/locale/en.yml`](https://github.com/rails/rails/blob/main/activesupport/lib/active_support/locale/en.yml)  
     を参照しながら、訳語を当ててください。
    
    [
    
    rails/en.yml at main · rails/rails
    
    You can't perform that action at this time. You signed in with another tab or window. You signed out in another tab or window. Reload to refresh your session. Reload to refresh your session.
    
    ![](favicon%2011.ico)https://github.com/rails/rails/blob/main/activemodel/lib/active_model/locale/en.yml
    
    ![](rails.png)](https://github.com/rails/rails/blob/main/activemodel/lib/active_model/locale/en.yml)
    

---

### ④viewファイルとlocaleファイルの関係を深掘りする。(I18nの理解)

そもそもlocaleファイルに翻訳がある時、この辞書ファイルに記述されたデータにアクセスするには、ja以降の階層構造を(.)で繋いで表し

`I18n.t(もしくはtranslate)`メソッドに渡す必要がある。

ex)

```YAML
#config/locale/ja.yml

ja:
  devise:
    confirmations:
      confirmed: アカウントを登録しました。
```

がある時、”アカウントを登録しました。”というデータにアクセスするには、

```Ruby
#rails consoleにて

irb(main):001:0
>I18n.t("devise.confirmations.confirmed")
#=> "アカウントを登録しました。"
```

というように、ja以下を階層構造をkeyでつなぐ必要があります。

*Railsは`t`(`translate`) ヘルパーメソッドを自動的に==ビュー==に追加するので、I18nは省略できます。

- yamlについて復習はこちら

---

## ==視点を戻して==

## **モデルやカラム(属性)に訳語を与えたい時

---

1. モデルやその属性について日本語する時

```YAML
#訳語の配置は一般に以下のようになるので、
ja:
  activerecord:
    errors:
      models:
        user:
          attributes:
            name:
              blank: "空になっています。"
            age:
              blank: "空になっています。"
    models: 
      user: "ユーザー"
    attributes:
      user:
        name: "名前"
        age: "年齢"
```

以下のような階層になるキーの値に訳語をyamlで記述する。

```Ruby
# モデル名の訳語
activerecord.models.モデル名
# モデルの属性の訳語
activerecord.attributes.モデル名.属性



ex1)#Userモデルについて、'ユーザ'と訳語を当てたいとき
activerecord.models.user
#の部分に値を対応させるので

ja:
  activerecord:
		models:
			user: ユーザ

ex2)#Userモデルのemail属性に、'Eメール'と訳をあてたいとき
activerecord.attributes.user.email
#の部分に値を入れるので

ja:
	activerecord:
		attributes:
			user:
				emmail: Eメール
```

2. フォームのsubmitについても日本語対応させたい時

```Ruby
#railsのソースコードより以下のようになっているので、

# Default translation keys for submit and button FormHelper
en:
	helpers:
    submit:
      create: 'Create %{model}'
      update: 'Update %{model}'
      submit: 'Save %{model}'
```

```Ruby
ja.helpers.submit
#以下に対応する値を記述する。

例)
ja:
	helpers:
	    submit:
	      create: 登録する
	      update: 更新する
	      submit: 保存する
```

**{form_withヘルパーを用いてフォーム作成する際の具体的な対処法}

---

```Ruby
<%= form_with(model @user,……) do |f| %>

	<div class="field">
	    <%= f.label :password %>
	    <% if @minimum_password_length %>
	    (<%= @minimum_password_length %>characters minimum)
	    <% end %>
		<br />
	    <%= f.password_field :password, autocomplete: "new-password" %>
	  </div>
```

というようなフォームが記述されている時、

RailsはUserモデルだということを判断できる。

そのため、もしモデルの属性passwordに対応するような訳語の値が設定されていればそれが表示される。

つまり、

```YAML
ja:
	activerecord:
		  attributes:
		    models:
		      user:
		        password: パスワード
	#これで、フォームのラベルが'パスワード'を表示するようになる。
```

また、日本語でハードコードするのもひとつの方法(可読性○)

```Ruby
<%= f.label :password, "パスワード" %>
```

---

## [訳文の参照 ]

[Railsガイドの参考](https://railsguides.jp/i18n.html#%E8%A8%B3%E6%96%87%E3%81%AE%E5%8F%82%E7%85%A7)

---

### *基本的な訳文の参照

viewやコントローラでは、I18n.t(translate)メソッドを使って、自由にlocaleファイルを参照できる。==I18nは省略可能==

```Ruby
I18n.t :message
I18n.t 'message'
#シンボルでも、文字列でも良い

# ただし"lazy" lookup等でパスを省略している場合には
".xxx"のフォーマットが必須です。
```

---

### *スコープ

translateメソッドのオプション:scopeを取ることで、訳文キーのスコープを含めたり(「名前空間」を指定するための追加キーを1つ以上含めることも、)できる。

```Ruby
#:scopeオプションを使ったスコープ（有効範囲）の指定
I18n.t :record_invalid, scope: [:activerecord, :errors, :messages]

#ドット区切りでのスコープ指定（上の例と同義）
I18n.translate "activerecord.errors.messages.record_invalid"
```

---

### **“Lazy” lookup (訳:遅延探索)

Controllerやviewファイルのディレクトリの階層を翻訳ファイルにも設定して、Controllerやviewファイルの内部で参照する時に、キーを短縮してアクセスする事が出来る仕組みのこと

つまり、

==app/views/以降==の部分階層構造をlocaleファイル側でもなゾルように設定することで、tメソッドでの呼び出しが短くすむってとこ

ex)

```Ruby
#app/views/devise/registrations/new.html.erb

#sign_upを下の形で呼び出したい。
<%= t ".sign_up"　%>
```

上のように表示したいときには、以下のように設定されていることを確認する。

```YAML
#config/locale/ja.yml

#viewファイルのディレクトリ構造を辞書ファイルでもなぞる。
ja:
	devise:
		registrations:
			new:
				sign_up:
```

この機能はコントローラでも使えて、

```YAML
en:
  books:  #コントローラ名
    create:  #アクション名
      success: Book created!
```

上は、たとえば次のようにflashメッセージを設定するのに便利です。

```Ruby
class BooksController < ApplicationController
  def create
# ...
		redirect_to books_url, 
								notice: t('.success')
  end
end
```

---

### *変数の式展開

deviseによって生成されるviewに次のようなコードがあり、

```Ruby
<div class="field">
    <%= f.label :password %>
    <% if @minimum_password_length %>
    <%= t('devise.shared.minimum_password_length', count: @minimum_password_length) %>
    <% end %>
    <%= f.password_field :password, autocomplete: "new-password" %>
  </div>
```

==`<%= t('devise.shared.minimum_password_length', count: @minimum_password_length) %>`==

ここ部分に注目すると、

==`t('devise.shared.minimum_password_length',`==

で辞書ファイルの

```Ruby
ja:
	devise:
		shared:
			minimum_password_length: "この部分#{count}"
```

を参照していることがわかり、

さらに、

==`count: @minimum_password_length)`==

とすることで、訳文側に引数を渡すことができ、

訳文側では==`#{count}`==と式展開することができる

> この時==`@minimum_password_length`==はdeviseで定義される変数で、config/initializers/devise.rbの  
>   
> config.password_length = 8..128  
> この部分の記述に対応している　ex)==`@minimum_password_length`== ==→ 8==

---

### **Active Recordモデルで翻訳する

ref)[Railsガイド](https://railsguides.jp/i18n.html#active-record%E3%83%A2%E3%83%87%E3%83%AB%E3%81%A7%E7%BF%BB%E8%A8%B3%E3%82%92%E8%A1%8C%E3%81%AA%E3%81%86)

`Model.model_name.human`メソッドと`Model.human_attribute_name(attribute)`メソッドを使うことで、モデル名と属性名を透過的に参照できる

---

### *errorメッセージのスコープ

ref)[Railsガイド](https://railsguides.jp/i18n.html#%E3%82%A8%E3%83%A9%E3%83%BC%E3%83%A1%E3%83%83%E3%82%BB%E3%83%BC%E3%82%B8%E3%81%AE%E3%82%B9%E3%82%B3%E3%83%BC%E3%83%97)

errorメッセージのkeyの探索についてはガイドを参照して下さい。(複数の名前空間から順位づけて探索している)

また、翻訳されたモデル名・属性名・値は、

それぞれ

`model`、`attribute`、`value`  
という名前でいつでも式展開に使えます。

```Ruby
 ex)"Please fill in your %{attribute}” 

#該当する属性が展開される
```

また、以下のようにエラーメッセージのkeyをvalidationごとに参照してみてね

関連記事

---

[⬇️Deviseの導入](Devise/Devise%E3%81%AE%E5%B0%8E%E5%85%A5%202aa4d98c81814113849167cb248c3caa.html)

---

参考記事

[

【Rails】i18nでdeviseのビューを日本語にする

こんにちは～、とりあえずコーヒー飲みがちなShinyaです RoRの勉強し始めて結構経った人はdeviseを使い始めたりしてるんじゃないでしょうか ログイン機能が秒で完成するdeviseって超便利 ですよね でもデフォルトだと表示が英語という難点もあります 英語圏に生まれてればこんな悩みもなかったし、検索して出てきた英語の資料もスラスラ読めたし、、、 まあ、そんなこと言ってても仕方ないのでgemでサクッと日本語化しちゃいましょう devise導入するとこからビューを日本語化するとこまで見ていきます 注：サクッと、とか言いましたが ４．と５．は日本語化の仕組みに少し触れる ので長いです（笑） まず必要なgem2つをインストールします # ログイン機能 gem 'devise' #devise日本語化 gem 'devise-i18n' Gemfileに書き込んだら bnudle install (--path [インストール先]) でインストールします インストールが完了したら、deviseの設定をします 僕はdevise使うための呪文と思ってます 次にログイン機能を使う対象のモデルを作成します ここではUserモデルと想定します モデル作成時の通常のコマンドrails g model [モデル名]ではない ことにご注意ください モデルが作成できたら、いつも通りマイグレーションファイルを実行します ここまででdeviseの設定は終わりです この時点で localohost:3000/users/sign_up にアクセスすればログイン画面が表示されます しかしまだ英語表記のままなので日本語化していきます RoRではデフォルトの言語が英語になっているので、それを日本語に変えていきます 日本語に変えるというのは、 英語に対する日本語訳がずらーっと書かれているファイル（後述）を参照できるようにする ということです そのファイルが気になりますが、まずは参照の設定をします プロジェクトディレクトリ直下の config/application.rbにデフォルト言語を指定する文を加えます module MessageApp class

![](cropped-プ独-2-192x192.png)https://ichitasu.com/devise-i18n/

![](61064.jpg)](https://ichitasu.com/devise-i18n/)

[

I18n入門書~日本語化対応の手順と応用的な使い方

以下のようにデフォルトで使用する言語を設定し、 config/locales/ 以下に翻訳ファイルを配置することで、現在の言語に対応する翻訳文を取得して表示します。 I18nを使うと、以下の画像のようなvalidationのエラー表示も日本語に翻訳することが出来ます。 また、翻訳だけではなく、現地の日付のフォーマットに変換することもできます。 この章では、I18nの設定方法や基本的な使い方について解説します。 i18n_appアプリケーションを日本語化する手順を解説します。 以下は作成するアプリケーションの完成図です。 以下の手順で作成していきます。 I18nを使ったことがない方は、一緒にアプリケーションを作成して理解を深めていきましょう。 まずは、 rails newで i18n_app アプリケーションを作成します。 以下のように作成した i18n_appのディレクトリに移動して、簡易的なユーザー登録や一覧機能を一気に作成してくれる scaffold を実行します。 このコマンドでnameカラム、ageカラムを含めたusersテーブルが作成されて、ユーザーを作成するフォームも自動で作成されています。今回はこのフォームを使って解説します。 そして、以下のコマンドを実行してデータベースの作成を行います。 次に、Userモデルに以下の validation を追加します。validationに引っかかった際は、エラーメッセージが表示されます。 このvalidationを追加することによって、フォームからユーザーを作成するときにnameとageの項目が空であればエラーが出ます。 また、以下のコードの New User は、 scaffold で自動で作成された部分なので日本語に変更します。 サーバーを起動させて「 localhost:3000/users/new 」にアクセスし、以下の画像のようにフォームに何も入力しないでユーザーを作成すると、エラーメッセージが表示されます。 英語のエラーメッセージが表示されていれば、アプリケーションの雛形は完成です。 h1の New Userを手動で 新規登録に変更した箇所とは違い、 このエラーメッセージは、Railsアプリケーションによって自動で付与されます。 デフォルトでは英語になってしまうので、デフォルト言語を日本語に変更して、英語のエラーメッセージを日本語に翻訳する翻訳ファイルを作成します。 デフォルト言語を英語から日本語に設定するには、以下のコードを config/application.rb に追加します。 日本語の翻訳を設定するファイルを作成する為に、 config/locales以下にデフォルト言語で設定した名前のyamlファイル( ja.yml)を作成します。 config/locales 以下に翻訳する言語の設定ファイルを配置すると、自動で読み込まれます。 i18n_app ディレクトで以下のコマンドを実行して、ファイルを作成します。 ja.yml ファイルには、以下のコードを記述します。 次の章で、 ja.yml ファイルにエラーメッセージを翻訳する詳しい設定方法について解説します。 翻訳ファイルの設定の解説をする前に、ymlファイルの使い方について触れます。 ymlファイルの基本的な書き方は、以下のようにインデントを使うことで、データの階層構造を表現することが出来ます 階層構造になったデータにアクセスするには、以下のコードのように階層を.で繋いだ文字列を tメソッドに渡します。 tメソッド については、後述します。 そして、この ja.yml ファイルに翻訳を追加する際は、以下の点に気をつけてください。 それでは、 i18n_app アプリケーションの日本語化する手順について確認します。 ここまでの日本語翻訳の設定を反映させる為に、一度サーバーを再起動させて「 localhost:3000/users/new」にアクセスし、フォームに何も入力しないで新規登録を行うと、以下のように translation missing のエラーが発生します。 通常、I18nは設定した言語に応じて config/locales/以下から対応する翻訳ファイルを読み込んで、その言語に翻訳してくれますが、今回の場合は、以下の画像のように 日本語に設定したのに、「エラーメッセージに対応する日本語の翻訳が見つからない」というエラーが発生しています。 現在、翻訳ファイルは以下のコードのように初期設定のみ記述しているので、日本語に翻訳する事が出来ません。 この翻訳ファイル( ja.yml)に、エラーメッセージが対応する日本語訳を設定する事で、 translation ...

![](favicon%2012.ico)https://pikawaka.com/rails/i18n

![](rails-1%201.png)](https://pikawaka.com/rails/i18n)