 

⬇️

# Rails 7でのwebpackerインストール

## 環境

rails 7.0.1

ruby 3.1.2

---

### 症状

`rails s`サーバー立ち上げようとしたのに立ち上がらない。

以下のエラーメッセージ

```Ruby
========================================
  Your Yarn packages are out of date!
  Please run `yarn install --check-files` to update.
========================================


To disable this check, please change `check_yarn_integrity`
to `false` in your webpacker config file (config/webpacker.yml).


yarn check v1.22.19
success Folder in sync.
Done in 0.02s.
yarn check v1.22.19
error Couldn't find a package.json file in "/Users/masanao/Desktop/environment/portfolio_app"
info Visit https://yarnpkg.com/en/docs/cli/check for documentation about this command.


Exiting
```

---

### 原因

yarn install

webpackerインストールがうまくいってなかった

—>package.jsonファイルが作成されてなかった

---

### 解決

yarn initで初期化したらいけた。

---

## 今後の対応

yarn -vでyarnがローカルにあることを確認して、

新規開発マシンの場合は,

```Ruby
yarn init
```

Gemfileで

```undefined
gem 'webpacker',  '~>4.0.7'
```

を追加して,bundle install

指示に従って

`**rails webpacker:install**`

で完了のはず、

---

予想外のエラー

```Ruby
/Users/masanao/.rbenv/versions/3.1.2/lib/ruby/3.1.0/psych/visitors/to_ruby.rb:430:in `visit_Psych_Nodes_Alias': Unknown alias: default (Psych::BadAlias)
	from /Users/masanao/.rbenv/versions/3.1.2/lib/ruby/3.1.0/psych/visitors/visitor.rb:30:in `visit
```

```Plain
gem 'psych', '~> 3.1'
```

をbundle installで解決した

原因はつまり不明