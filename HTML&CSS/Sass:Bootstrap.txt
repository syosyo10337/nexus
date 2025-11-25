**{Sass(scss)}--------------------------------
--cssの拡張言語。関数やネストを使えるようになる。

**ネスト(入れ子) --stylesheetに共通の要素がある場合は、ネスト化できる。#Sassが、ネスト化されたもの(scssでかかれたもの)をcssに変換する時に＆での参照とかを置き換えてくれている。

ex1)#.center{}と.center h1 {}をまとめて書く
.center {
	text-align: center;
	h1 {
		margin-bottom: 10px;
	}
}

#構造を分解してみると,以下のようになる。/*親要素に適応したスタイルがネストした子要素にも共有されるわけではない。*/
.center { 
	(.centerに適応したいスタイル) 
	h1 { (.center h1に適応したいスタイル) }
}

ex2)#親属性を参照したい時。(#でコメントアウトしちゃうからcssに変えてみると見やすいかも)
$light-gray: #777;
#logo {
	float: left;
	margin-right: 10px;
	font-size: 1.7em;
	color: $light-gray;
	text-transform: uppercase;
	letter-spacing: -1px;
	padding-top: 9px;
	font-weight: bold;
	&:hover {							#--&によって親属性#logoを参照している。
		color: $light-gray;
		text-decoration: none;
	}
}


**変数 --Sassでは$変数名: 値; という形で変数と定義できる。(css変数に近しいね。)
呼びだしは、$変数名で値の呼び出しができる。変数名を定義すると、人間的にコードが見やすい。実際、Bootstrapでは、多くの色に対して変数名をプリセットとして定義されている。。(LESS変数参照)

**ミックスイン --事前に定義したスタイルを他の要素のスタイルにも使いまわせる機能。(引数も使えるらしいよ？)
tpl)@mixin hoge {} -- /*@mixinの後に変数(ここではhoge)を置いて、そこにスタイルを代入する*/
tpl)あるセレクタの中で {
	color: white;
	@include hoge;	/*@include 変数の形でスタイルを呼び出せる*/
}

**エクステンド(継承)  --一度定義したクラスを、他クラスで継承することができる。(bootstrapなどプリセットとして特定のクラス名をつけるとスタイルを適応してくれるフレームワークとの併用で威力を発揮する。)
ex).field_with_errors {
	@extend .has_error;  /*bootstrapにスタイルを定義されている 「.has_error」クラスのスタイルを継承している。*/
	color: white;	
	.
	.
}


- @contentの部分が@includeで呼び出した際に{}の中に記述されたものが入る。
```
@mixin hoge {
	@content;
}

@include hoge {
	/*ここで記述したものが@contentにはいる */
	margin: 0 auto;
}
```


//この時& == 親セレクタで子孫セレクタを指定している。
.casfd & {
}



**{Bootstrap(cssフレームワーク)の導入}---
①Gemfileを更新する。BootstrapデフォルトだとLESS CSSを使っているが、Railsの(Asset pipeline)デフォルトサポートはSassなので(-sass)と追記すること。
ex)#Gemfileにて
gem 'bootstrap-sass', '3.4.1' #-sass忘れないで
②$ bundle install
③カスタムCSSファイルを新規作成(rail g controllerでも作成されるが、、)チュートリアルでは簡素化のために手動でファイルをapp/assets/stylesheets/に作成。拡張子に注意
ex)app/assets/stylesheets/ファイル名(custom.scssとか)
④作成したファイル内でBootstrapを読み込む
tpl) #ファイルの冒頭で
@import "bootstrap-sprockets";
@import "bootstrap";
--------------------------------------
***Bootstrap
HTMLのクラスに特定の値を付与すると、Bootstrapを用いた時に特別な意味を持つ
(ex:jumbotron, container,navbar,btn,btn-lg,btn-primary...etc)

{クラスの一例}
*form-control

*alert-success/-info/-warning/-danger --flashメッセージなどに利用できるクラス。