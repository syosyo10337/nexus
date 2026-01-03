 

# TImeクラス

---

時間表現

[

class Time

時刻を表すクラスです。 Time.now は現在の時刻を返します。 File.mtime などが返すファイルのタイムスタンプは Time オブジェクトです。 Time オブジェクトは時刻を起算時からの経過秒数で保持しています。起算時は協定世界時(UTC、もしくはその旧称から GMT とも表記されます) の 1970年1月1日午前0時です。なお、うるう秒を勘定するかどうかはシステムによります。 Time オブジェクトが格納可能な時刻の範囲は環境によって異なっていましたが、 Ruby 1.9.2 からは OS の制限の影響を受けません。 また、Time オブジェクトは協定世界時と地方時のどちらのタイムゾーンを使用するかのフラグを内部に保持しています。タイムゾーンのフラグは Marshal データに保持されます。 time ライブラリによって、 Time.parse, Time.rfc2822, Time.httpdate, Time.iso8601 等が拡張されます。 Ruby 1.9.2 以降の Time クラスのデザインの詳細は https://staff.aist.go.jp/tanaka-akira/pub/sapporo-rubykaigi-02-akr-2009.pdf や「APIデザインケーススタディ」( https://gihyo.jp/book/2016/978-4-7741-7802-8) の第4章を参照してください。 localtime(3) も参照してください。 C 言語の tm 構造体とは異なり、month は 1 月に対して 1

![](https://docs.ruby-lang.org/ja/latest/rurema.png)https://docs.ruby-lang.org/ja/latest/class/Time.html#I_CEIL



](https://docs.ruby-lang.org/ja/latest/class/Time.html#I_CEIL)