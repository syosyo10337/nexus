 

# Sproketsを使わない時のassets:compile

---

# 症状

```Bash
Sprockets::ArgumentError: link_directory argument must be a directory
/var/www/recorda-me/app/assets/config/manifest.js:2
```

## 原因分析

つまりは、capistranoのデプロイにタスクを実行した際の一つに、本番環境用にasset(JSや画像, CSSファイルなど)をコンパイルする作業があります。

実行するコマンドは大きく分けて二つあります。

[Precompile（本番環境でのパイプライン）](Precompile%EF%BC%88%E6%9C%AC%E7%95%AA%E7%92%B0%E5%A2%83%E3%81%A7%E3%81%AE%E3%83%91%E3%82%A4%E3%83%97%E3%83%A9%E3%82%A4%E3%83%B3%EF%BC%89%208afd6eef55874f4893c470679e87b20d.html)

これは本番環境でアセットをコンパイルする際に

```Bash
$ rails assets:precompile
```

コマンドを実行する際に起きるエラーです。

このコマンドは、内部的にはwebpacker:precompileも含むため、良さげですが,

仮に、sproketsを一切 使用しない際には、assets/ディレクトリに当該ファイルがないことにより、エラーが発生します。なので、手動デプロイなら単に、webpacker:prcompileのみで実行可能ですが、

CDや、何かの拍子でassetsをぶち込むなどのことがある場合には、対応しきれないことが予想できます。

今回は特に、CDパイプライン構築による自動デプロイを目指すので、それも念頭において解決してみます。

## 考えられる対応策

1. manifest.jsの読み込みが問題を引き起こしているので、assetsを活用しないうちは、無効にしておく。

2. capistrano側のdeployタスクをカスタムして、`rails webpacker:compile`のみ実行させるように変更を掛ける。

3. 大人しく、アセット何かしら置く？

### 確認したいこと

precompileとassets:compileの挙動の違い。本当に包括してるっけ？

また、assets:compileの実行はどの記述をもとに、ファイルを探索していくのか？

## 解決

実際に、manifest.jsを見に行ったところ。

```Bash
//= link_tree ../images
//= link_directory ../stylesheets .css
```

こんな記述になってました。エラーメッセージを確認してもわかるように、

stylesheetsのディレクトリが欲しいかったらしいです。今回はとりあえず使う予定のない、stylesheetsの読み込みの記述を削除しました。