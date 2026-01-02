 

![](rubocop.svg)

# Rubocop

---

[

RuboCop

RuboCop is a Ruby static code analyzer (a.k.a. linter) and code formatter. Out of the box it will enforce many of the guidelines outlined in the community Ruby Style Guide.

![](favicon%2016.ico)https://docs.rubocop.org/rubocop/1.23/index.html



](https://docs.rubocop.org/rubocop/1.23/index.html)

[

RuboCopのインストール手順と具体的な使い方 | Enjoy IT Life

RuboCopとはRuby用のLintツールです。 設定ファイルを編集することでコーディングスタイルのチェック項目をカスタマイズできたり、RuboCop用のgemを追加することで機能の拡張ができたりします。 コードに対して行われるさまざまなチェックをRuboCopではCopと呼びます。 RuboCopを利用するうえで重要な.rubocop.ymlと.rubocop_todo.ymlについて紹介します。 設定ファイルの詳細は RuboCop//Docs『Configuration』 を参照してください。 .rubocop.ymlとはRuboCopの設定ファイルです。 RuboCop自身に関する設定だけでなく、Copの有効無効の制御やCopのカスタマイズをする際にも利用します。 .rubocop_todo.yml はRuboCopの暫定対応をする際に利用する設定ファイルです。 たとえば、プロジェクトの途中からRuboCopを導入すると既存のソースコードに大量の指摘事項が見つかる場合があります。 指摘事項が多い場合「いつかは直す必要があるけどいったん無視して、とりあえずRuboCopから指摘されないようにだけしたい」と考えたとします。 .rubocop_todo.yml は上記のようなシチュエーションで利用します。 利用するrubocopのバージョンは1.18.3です。 rubocopをGemfileに追加します。また、Railsアプリケーションで rubocopを利用する際によく導入されている rubocop-performance、 rubocop-rails、 rubocop-rspec もあわせて追加します。 Gemfile group :development do gem 'rubocop', require: false gem "rubocop-performance", require: false gem "rubocop-rails", require: false gem "rubocop-rspec", require: false end Railsアプリケーションのルートディレクトリに.rubocop.yml を作成します。 $ cd /path/to/project $ touch

![](cropped-2018-03-09-22.09.51.png)https://nishinatoshiharu.com/insatall-rubocop/#rubocop_todoyml

![](insatall-rubocop.001.png)](https://nishinatoshiharu.com/insatall-rubocop/#rubocop_todoyml)

# CI環境を意識した導入方法

---

1. gemをインストールする。Railsアプリで使用している場合には、以下をインストールする。(require: falseはアプリ内で自動にrequireしないような設定)

```Ruby
	gem 'rubocop', require: false
  gem 'rubocop-performance', require: false
  gem 'rubocop-rails', require: false
  gem 'rubocop-rspec', require: false
```

2. .rubocop.ymlという名前で設定ファイルを作成する

```Bash
$ touch .rubocop.yml #アプリのルートディレクトリに配置する。
```

作成したファイルの中で設定を記述する。

# 実行

```Bash
$ bundle exec rubocop
```

安全な変更のみを自動で行なってくれる。

```Bash
$ bundle exec rubocop -a 
# autocorrectオプション。-Aだと、unsafeな変更までも、割と無理矢理やっちゃうコマンド。
```

```Bash
$ bundle exec rubocop --auto-gen-config
```

.rubocop_todo.ymlという既存のアプリのコード違反を一時的に無視するためのファイルを作成しつつ、それを.rubocop.ymlに読み込ませるコードも追記してくれる。

cf)

[

RuboCopのインストール手順と具体的な使い方 | Enjoy IT Life

RuboCopとはRuby用のLintツールです。 設定ファイルを編集することでコーディングスタイルのチェック項目をカスタマイズできたり、RuboCop用のgemを追加することで機能の拡張ができたりします。 コードに対して行われるさまざまなチェックをRuboCopではCopと呼びます。 RuboCopを利用するうえで重要な.rubocop.ymlと.rubocop_todo.ymlについて紹介します。 設定ファイルの詳細は RuboCop//Docs『Configuration』 を参照してください。 .rubocop.ymlとはRuboCopの設定ファイルです。 RuboCop自身に関する設定だけでなく、Copの有効無効の制御やCopのカスタマイズをする際にも利用します。 .rubocop_todo.yml はRuboCopの暫定対応をする際に利用する設定ファイルです。 たとえば、プロジェクトの途中からRuboCopを導入すると既存のソースコードに大量の指摘事項が見つかる場合があります。 指摘事項が多い場合「いつかは直す必要があるけどいったん無視して、とりあえずRuboCopから指摘されないようにだけしたい」と考えたとします。 .rubocop_todo.yml は上記のようなシチュエーションで利用します。 利用するrubocopのバージョンは1.18.3です。 rubocopをGemfileに追加します。また、Railsアプリケーションで rubocopを利用する際によく導入されている rubocop-performance、 rubocop-rails、 rubocop-rspec もあわせて追加します。 Gemfile group :development do gem 'rubocop', require: false gem "rubocop-performance", require: false gem "rubocop-rails", require: false gem "rubocop-rspec", require: false end Railsアプリケーションのルートディレクトリに.rubocop.yml を作成します。 $ cd /path/to/project $ touch

![](cropped-2018-03-09-22.09.51.png)https://nishinatoshiharu.com/insatall-rubocop/

![](insatall-rubocop.001.png)](https://nishinatoshiharu.com/insatall-rubocop/)