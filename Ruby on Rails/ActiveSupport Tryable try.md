 

# ActiveSupport::Tryable.try

cf)

[

ActiveSupportのTryとTry!の違い - Qiita

ActiveSupport::Tryableには try()と try!()の2つのメソッドが実装されています。 違いがよく分からなかったので、調べました。 結論から言うとソースコードにそのまんま答えが書いてありました。 Windows 10 Insider Preview Build 17115.rs4_release (Windows Subsystem for Linux) rbenv 0.4.0 Ruby 2.3.6 Active Support 5.1.5 Rails ガイド によると nilでない場合にのみオブジェクトのメソッドを呼び出したい場合、最も単純な方法は条件文を追加することですが、どこか冗長になってしまいます。そこでtryメソッドを使うという手があります。tryはObject#sendと似ていますが、nilに送信された場合にはnilを返す点が異なります。 とありますが、「nilに送信された場合にはnilを返す」挙動は try()も try!() も同じです。 これは非常に簡単な理由で、 try()も try!()も、 nil を返すだけという実装がされているからです。 GitHubのTry!()実装箇所 に、下記のようなコメントがあります。 Same as #try, but raises a +NoMethodError+ exception if the receiver is not +nil+ and does not implement the tried method.

![](Ruby%20on%20Rails/Attachments/production-c620d3e403342b1022967ba5e3db1aaa.ico)https://qiita.com/suzuki_sh/items/e395465eb8e32459ec32

![](Ruby%20on%20Rails/Attachments/article-ogp-background-9f5428127621718a910c8b63951390ad%202.png)](https://qiita.com/suzuki_sh/items/e395465eb8e32459ec32)