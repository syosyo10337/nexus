 

# Precompile（本番環境でのパイプライン）

---

関連する記事　

[Webpackerとは](Webpacker%E3%81%A8%E3%81%AF%20e2331ed028e64782a3328fb0b4d28493.html)

[

アセットパイプライン - Railsガイド

アセットパイプラインとは、JavaScriptやCSSのアセットを最小化 (minify: スペースや改行を詰めるなど) または圧縮して連結するためのフレームワークです。アセットパイプラインでは、CoffeeScriptやSass、ERBなど他の言語で記述されたアセットを作成する機能を追加することもできます。 ...

![](favicon%2010.ico)https://railsguides.jp/asset_pipeline.html#%E3%82%A2%E3%82%BB%E3%83%83%E3%83%88%E3%82%92%E3%83%97%E3%83%AA%E3%82%B3%E3%83%B3%E3%83%91%E3%82%A4%E3%83%AB%E3%81%99%E3%82%8B

![](cover_for_facebook%202.png)](https://railsguides.jp/asset_pipeline.html#%E3%82%A2%E3%82%BB%E3%83%83%E3%83%88%E3%82%92%E3%83%97%E3%83%AA%E3%82%B3%E3%83%B3%E3%83%91%E3%82%A4%E3%83%AB%E3%81%99%E3%82%8B)

### 本番環境でのPrecompileとは、

あらかじめビルド済みのCSS/JSファイルなどを配信することでアクセスするユーザの待ち時間を減らすことができる。

実行コマンド。

```Bash
# sprocketsによるasset pipelineコマンド
#（webpacker:compileも内包している。）
$ bin/rails assets:precompile

# でコンパイルされたファイルをクリアできる
$ bin/rails assets:clobber
```

webpackerだけで完結する場合には、

```Bash
$ bin/rails webpacker:compile
```

でも、良い。

## その他本番環境で変更を検討するべき点

---

### {case.1 }  
どうやってもスタイルが一切反映されない時　

```Ruby
# config/environments/production.rb



# 略
# Disable serving static files from the `/public` folder by default since
# Apache or NGINX already handles this.
config.public_file_server.enabled = ENV['RAILS_SERVE_STATIC_FILES'].present?
# 略
```

ここの意味としては、デフォルトではNginxとかのwebのリバースプロキシ側で静的ファイルを用意してくれるから、Railsはやらないですよ？っていう設定なので、

`RAILS_SERVE_STATIC_FILES=true`

になるように変更することで解消されるはず。(ハードにtrueを入れてもいいし、当該の環境変数になにかしらの値を入れてもよい。)

cf)

[

https://qiita.com/at-946/items/b7d467bf25c40fcfca44https://qiita.com/at-946/items/b7d467bf25c40fcfca44



](https://qiita.com/at-946/items/b7d467bf25c40fcfca44https://qiita.com/at-946/items/b7d467bf25c40fcfca44)

### {case.2 }本番環境で、動的にファイルをコンパイルしたい時  

つまり、プリコンパイルされている何かがなければ、開発環境と同様に、その場でコンパイルを挟む。(ロードが長くなって、ユーザ体験としては酷いので、特殊な理由がなければよくないと思う。)

```YAML
# config/webpacker.yml

production:
  <<: *default

  # Production depends on precompilation of packs prior to booting for performance.
  # この部分をtrueにする
	compile: false

  # Extract and emit a css file
  extract_css: true

  # Cache manifest.json for performance
  cache_manifest: true
```