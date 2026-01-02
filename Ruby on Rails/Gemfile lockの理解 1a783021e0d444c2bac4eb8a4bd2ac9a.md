 

# Gemfile.lockの理解

Gemfile.lockには、最初にGemfileに従ってinstallされたものを記録したファイルであるので、clone等をした時には、最初にgemfileを作った内容が反映されている。すなわち、自分のローカルにrspec 4.0だけ入っていて( Gemfileには >= 3.9 )などと会った時に、はローカルのものを使いそうだが、

Gemfile.lockに3.9.2などとあった場合には、ダウングレードしてでも、そちらに従うことになる。

cf)

[

【初心者向け】bundler、Gemfile、Gemfile.lockの関係性について図でまとめてみた - Qiita

Ruby on RailsでWebアプリケーション（以降ではRailsアプリと略します）を開発をするにあたり、gemの活用は開発効率をあげるために重要です。 Railsアプリ開発でgemを利用する機会は多くありますが、どのようにge...

![](apple-touch-icon-ec5ba42a24ae923f16825592efdc356f%201.png)https://qiita.com/nishina555/items/1b343d368c5ecec6aecf

![](article-ogp-background-9f5428127621718a910c8b63951390ad%204.png)](https://qiita.com/nishina555/items/1b343d368c5ecec6aecf)

(コメント欄に詳しい指摘もあるので、確認すること。

- Gemfileの記法

require: false

RubyのGemfileにおける `**require: false**` は、その特定のgemがBundlerによって自動的にrequireされないようにするためのオプションです。これは、通常はアプリケーションの起動時に全てのgemが読み込まれるのとは異なり、特定の状