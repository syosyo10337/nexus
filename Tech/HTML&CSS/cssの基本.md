---
tags:
  - html-css
  - html
  - css
  - layout
created: 2022-12-20
status: active
---

[[CSSの基礎文法(Cascading Style Sheets)]]


セレクタ（対象）{
   プロパティ（変更項目）: 値;
}
後述するものが優先される。下の文に上書きされる。

/*この中にコメントを入れます*/

## スタイルの継承
htmlの親要素から子要素へと指定したプロパティが継承されます。ただし、プロパティによってinheritの是非があります。
- inheritedがされない子要素であってもプロパティでは、
e.g.)
継承したいプロパティ: inherit;

とすると継承できます。

### スタイルの継承を無視する
- initialという値を指定すると可能です。
e.g.)
h1 {
   color: red;
}
/* デフォルトでbody要素のテキストカラーである黒を取得する
initialでプロパティの初期値を取得します */
strong {
   color: initial;
}


- CSS日本語が含まれる場合、ブラウザによっては文字化けする可能性があるので、ファイルの文頭で @charaset "utf-8";とかく
*一括指定プロパティ--list-styleのように複数のプロパティを一括で指定する。初期値を設定して、任意の値を省略できる。

- url()
組み込み関数url('URL')を使うと、画像を読み込める。相対・絶対パス指定可能
e.g.)
div {
   background-image: url("https://example.com/assets/img/team-dev.png");
}


# [数値の単位]
ref) Notion




# [色の表現方法]

## rgb(red,green,blue,(alpha)):
各要素を%もしくは0~255の値で設定できる。(単位の混在は不可)
alpha == 透明度のことで0~1の値を取る。

e.g.)
rgb(100%, 0%, 0%) // red
rgb(0, 0, 0) // black
rgb(100%, 100%, 100%) // black
rgb(255, 255, 255) // white


## 16進数表現:
＃"XX(r)XX(g)XX(b)XX(a)"として、各要素2桁の16進数を使ってあわらします。 ff0000の場合には省略してf00と書くこともできる。
e.g)
#ff0000 //red
#f00 	//red


## HSLA(
	Hue（色相0-360,
	Saturation（彩度%,
	Lightness（明度%,
	Alpha（0.0-1.0）
)
ex)hsla(180,80%,40%,1.0)=hsl(180,80%,40%)
*opacity(*プロパティ*): 中身全てを透明にする、画像も背景色も文字も一色担に(値0.0(完全に透明) ~ 1.0(完全に不透明))

- colorプロパティは継承される。


---------------------------------



# [プロパティの種類（変更項目の種類）]
*color (色): #ffffff  

### font-size: フォントのサイズを指定
<キーワードの対応表>
xx-small	10px
x-small	12px
small	14px
medium	16px
large	19px
x-large	24px
xx-large	32px
また、相対値のキーワードとしてlarger と smallerがあり、親要素から継承した値を記述にサイズを決める。


### font-family: 使用するフォントを指定する。
第二候補以降もカンマで繋ぐ。
フォント名にスペースが入る場合には’'で囲む
また、フォントの指定の中に少なくとも、総称フォントファミリーを指定するとブラウザ側でいずれかに対応したフォントを適用する。

e.g.)
h1{ 
	font-family: Verdana,'Arial Black', メイリオ,sans-serif;
}

- 総称フォントファミリーの種類:
sans-serif:ゴシック体系,
serif:明朝体系,
cursive:筆記体系,
monospace:等幅フォント


### font-weight: 文字の太さを変更。
100,200,300, …, 800, 900 の 9 つの数値、またはキーワード（normal, bold, lighter, bolder）を値として認識する。 normal == 400/bold == 700です。

<h1>~<h6>の要素は初期状態でfont-weight: bold;となっているので、font-weight: normal;と指定すれば文字が細くなります。


*text-decoration: テキストの装飾の変更 (使える値: line-through--打ち消し線、underline--下線)
*letter-spacing 文字の間隔を指定することができます。ex.)2px



# background
{一括指定プロパティ}
/*positionとsizeの値は、
center(positionの値)/cover(sizeの値)
*/
の書式で一回で記述すること。他は順不同

- background-color:
背景色を指定する。親から子要素へ継承されない。
- background-image: url();
指定の画像を背景として差し込める/background-colorよりもz-indexが高い

*background-position:
背景画像の位置を設定(background-image)
(値) top/left/bottom/rightで二つで設定できる、設定されてない場合には、centerで埋められる
e.g.)
background-position: top left;
background-position: left (center);
/*%での表示の場合にはleft topの値で表現する*/
background-position: 25% 75%;
background-position: 25% (50%);
/* より厳密な指定をすることもできる*/
background-position: right 25% bottom 20px;


### background-size: 
要素の背景画像の寸法を設定(値: cover;や数値xy)
- cover: 縦横比は保持して、背景領域いっぱいに画像を拡大縮小する
- contain: 画像が収まる範囲でコンテナいっぱいに表示する

### background-repeat: <水平> <垂直>
背景画像をどのように繰り返すか指定
e.g.)repeat, space, round, no-repeat, repeat-x, repeat-y





**list-style: --{一括指定プロパティ} typeの値 positionの値 imageの値;--と羅列すると一括で指定できる。
-*list-style-type: リスト項目要素のマーカーを設定 (circle,lower-alpha、独自のカウンタースタイル,noneなど)
-*list-style-position: (inside-項目要素のマーカーをリスト項目内におく)
-*list-style-image: url(画像のURL);--としてマーカーに画像を指定


### text-align:
ブロック内のコンテンツの水平方向の位置を決定する(block要素に適用)
ここでのコンテンツとは->
(テキスト、インライン要素、インラインブロック要素)

{使えるキーワード}:
left;左寄せ
center;中央揃え
right;右寄せ
justify;雑誌や新聞のように各行の幅が均等になるように引き伸ばされ、左右の端揃うように配置される
/* ブロック要素については、margin: o auto;で中央揃え*/


#### line-height: 行の高さを設定
行とフォントの間の余白を管理する.単位なしの数値が好まれる。
{使えるキーワード}:
px;
em;1文字分
単位なし;

- 単位なしは、emと同じく文字サイズの何倍かを表すが、継承される際に、Xemだと親要素のフォントサイズを参照しX倍するが、単位なしだと、子要素のフォントサイズを参照する。

e.g.)
main>sectionの時、sectionのline-heightは、
①だと32*2②だと16*2
main {
	font-size: 32px;
	line-height: 2em; ...①
	line-height: 2;　...②
}
section {
	font-size: 16px;
}
/*??要素の縦方向の中央に文字を配置するのにも使えます。line-heightプロパティの「高さの中心」に文字が配置されるため、要素の高さとline-heightプロパティを同じ値にすると、文字がちょうど中央に配置されるようになります。*/

### vertical-align: 垂直方向の配置を調整(inline)。
デフォルトだとbaseline(英字の配置の土台)上に/*画像等*/も配置されていることを留意
{使えるキーワード}:
baseline;（デフォルト
bottom; ボックスの下辺を基準に
top; ボックスの上辺を基準に
middle; 英小文字の中央に合わせられる
Xpx;（baselineからの距離X(+-)）)



* ボックスモデルについて
ref) 
https://lunar-tumble-6fb.notion.site/f3025870e72743859442237a65dc4acd


---------------------------------------

***display: htmlの(inline,inline-block,block,)要素を指定する.
*block要素-デフォルトで、width:親要素の幅いっぱい。height:コンテンツの高さ
*inline要素-デフォルトで、width:コンテンツの幅。height:コンテンツの高さ
-display: none--要素を無かったことにできる。

# positionプロパティ
ref)_: https://lunar-tumble-6fb.notion.site/f3025870e72743859442237a65dc4acd

-----------------------------------------

**calc(); ---関数で、 CSS のプロパティ値を指定する際に計算を行うことができるもの
ex)３つのコンテンツをそれぞれ20pxの余白をつけて、ページのサイズによらず、親要素いっぱいに並べたいとする。
それぞれのコンテンツのwidth=Xとすると、3X＝100% - (20px * 2),X=(100% - 40px) / 3なので、
width: calc((100% - 40px) / 3);と記述する。*演算子前後は半角空白をいれること

*box-shadow: --要素のフレームの周囲にシャドウ効果を追加(値:offset-x-水平方向 offset-y-垂直方向 blur-radius-ぼかし(px) spread-radius-影の拡大(px) color)
*text-shadow: --テキストにシャドウ効果を追加。プロパティの値はbox-shadowを参照*spread-radiusはつけられないです。

**float： --要素を包含ブロックの左右どちらかの側に沿うように設置し、テキストやインライン要素がその周りを回りこめるように定義します。要素はウェブページの通常のフローから外れますが、 (絶対位置指定 とは対照的に) フローの一部であり続けます。
(値left,right)
*clear: --浮動の解除ができます。
	}
}



# [セレクターの種類]
- 要素型セレクター: h1
e.g)<h1>...</h1>

- classセレクタ-: .info
e.g.)<p class="info">...</p>

- idセレクター: #ok	
e.g.)<button id="ok">...</button>
- 属性セレクター: p[class]
e.g.)<p class="red"></p>

- 全称セレクター :*
すべての要素

*class属性をHTMLで複数指定する時は、class="title info"と半角空白で区切る
*id属性はHTMLの１ページ内でユニークな値でなければならない。空白を含めることができないため、id="title info"のように1つの要素に複数のidを選択することもできない。

## 属性セレクターの扱い (attr=attributive=属性)
-存在の有無	[attr]
-完全一致	[attr="value"]
-前方一致	[attr^="value"]
-後方一致	[attr$="value"]
-部分一致	[attr*="value"]
ex)
} */
[href="#top"] {"#top"を属性の値に持つもの
[href^="https"] { "https"ではじまる。
[href$="dotinstall"] { "dotinstall"で終わる
[href*="com"] { "com"を含む
}}}}


# [セレクターの組み合わせ]
- a, b --(aORb)aまたはbの持つ要素を指定(セレクタのグループ化)
- ab --(aANDb)aであり、かつbの要素を持つものを指定
- a > b --aの直下の子要素を指定
- a b --aの子要素を指定
- a+b --aの直後にあるb指定

## [擬似要素]
要素の特定の部分をスタイリングすることができる
- ::first-letter  要素の1文字目を選択する
- ::before/::after  
要素の前後にスタイルをつけることができる。
content プロパティが必須
e.g.) /* h2タグの前にコンテンツを挿入している。*/
h2::before {
   content: "Title : ";
	color: gray;
}

*カスタムデータ属性(html)　-- data- で始まっていれば、実は独自の属性を付けても良い
h1::before,
h2::before{
  content: '- ';  
}

h1::after,
h2::after{
  content: attr(data-subtitle); (subtitle属性の値をスタイルとしてつける) 　/*--attr関数使ってるってさ*/
}

---------------------------------------------------

## [擬似クラス] 
要素の特定状態に応じてスタイリングする
e.g.) .btn:active{}

- :hover  カーソルが乗ったときのスタイルを指定できる
- :active  要素がクリックされている間のスタイル
- :link/:visited  リンクが踏まれているかどうかによって、クラスを付け分ける


*cursor(プロパティ) --マウスポインターが要素の上にいるときに表示されるマウスカーソルの種類を設定(値例:pointer;
- :first-child
- :last-child
- :only-child  兄弟要素の存在しない要素を選択
- :nth-child()
兄弟要素のグループの中での位置に基づいて選択します
e.g.)
main>:nth-child(3) { (main直下の階層の３番目の要素)
  background-color: aqua; 
}
main>:nth-child(3n) { (３の倍数にあたる要素)
  background-color: aqua;
} 
main>:nth-child(odd) { (奇数の要素)
  background-color: rgb(255, 183, 0);
}
main>:nth-child(even) { (偶数の要素)
  background-color: aqua;
}
main>:first-child { (main直下の階層の一番最初の要素)
  background-color: rgb(255, 183, 0);
}
main>:last-child { (main直下の階層の最後の要素)
  background-color: aqua;
}

- :root  HTML 文書の根ノード、つまり html タグを選択


**:nth-of-type() --兄弟要素のグループの中で指定された型 (タグ名) の要素を、位置に基づいて選択
ex)
main > h2:nth-of-type(3) {(３番目のh2要素)
  background-color: aqua;
}
main > h2:nth-of-type(odd) {(奇数のh2要素))
  background-color: aqua;
}
main > h2:first-of-type {(１番目ののh2要素)
  background-color: aqua;
}
main > h2:last-of-type {(main直下の階層の最後のh2要素)
  background-color: rgb(32, 34, 34);
}
**:empty --子を持たない要素(空の要素)を表す。子とは要素のノードまたは文字列 (ホワイトスペースを含む) 。つまり半角空白や改行は子をもつを認識される
**:not(セレクター) --列挙されたセレクターに一致しない要素を表す。特定の項目が選択されることを防ぐため、否定擬似クラス (negation pseudo-class) と呼ばれます。

----------------------------------------

# [詳細度]
1000: style="プロパティ: 値"(HTMLのstyle属性)
100: id セレクタ
10: クラスセレクタ、属性セレクタ、擬似クラス
1: 要素セレクタと擬似要素
e.g.)
h1 {color: red;} // 1
div h1 {color: red;} // 1 + 1 = 2
.special {color: red;} // 10
h2.special {color: red;} // 10 + 1 = 11
div#special {color: red;} // 100 + 1 = 101

詳しくは#https://developer.mozilla.org/ja/docs/Web/CSS/Specificity

- (Cascade)詳細度が同じであれば、後述されたものが優先される
- !importantを値の後ろにつけたものが例外的に優先される。/*この場合も複数!importantがあれば、後述されたものが優先される */

				

***[Flexbox]--------------
cf)
https://developer.mozilla.org/ja/docs/Learn/CSS/CSS_layout/Flexbox

cf)
https://lunar-tumble-6fb.notion.site/FlexBox-298bada0010046069e56b1907c111234

**flex: --{一括指定プロパティ} grow,shrink,basisの順で値します。 キーワード指定もできて下のようになる。、
(ex:initial(それぞれの初期値　1,1,100),auto(1,1,auto),none(0,0,auto)
*flex:1; --よく使われる値。grow-1,shrink-初期値,basis-0%であり、余白があったら伸ばしておいてということになる。※ページいっぱいにメインコンテナを伸ばそうとするとき親要素の幅が指定されている必要があります！
*flex-basis: --flex-grow 、 flex-shrink での計算に使われる要素のサイズを決める。なお,flex itemは主軸方向に伸び縮みすることを留意。初期値はauto(要素のwidthなければコンテンツの幅)

*flex-shrink: --フレックスアイテムの縮小係数を設定。すべてのフレックスアイテムの寸法がフレックスコンテナーよりも大きい場合、アイテムは flex-shrink の数値に従って縮小して収まります。初期値は1

-----------------------------------------

# CSSアニメーション
cf) Notion
https://lunar-tumble-6fb.notion.site/keyframe-7f4a089fefb74dc3be15ea2c8b1554b8


*pointer-events: --特定のグラフィック要素がポインターイベントの対象になる可能性のある環境 (存在する場合) を設定します。実用的には、opacity:0;で画面から見えなくなった要素をクリックしてしまうことを防ぐ。

---------------------------------------------------------

## [レスポンシブデザイン]
まず、viewportを設定する。
  <meta name="viewport" content="width=device-width,initial-scale=1">
スマホに表示領域を広めに取らないでももらって、文字サイズも大きくしてもらって的な設定



# メディアクエリ
```
<head>
      <link media="print" rel="stylesheet" href="style.css"/>
</head>
```
これによって、異なるレイアウトを実現していました。
```
@media screen {
   h1 {
      color: red;
   }
}

@media print {
   p {
      margin-bottom: 10px;
   }
}
```
上の例では、スマートフォンやコンピュータのスクリーンを持つデバイス上で、全ての h1 タグの color プロパティが red という値を持ちます。下の例では、全ての印刷物上で全ての p タグの margin-bottom プロパティが 10px の値を持ちます。

- メディアクエリはメディアタイプと 1 つの式で構成され、真の場合に対応するルールが適用されます。式には論理演算子 and, , ,not が用いられます。カンマで区切られたリストは、メディアクエリで使われる際、論理演算子またはのように動作します。

e.g.)
@media @media (min-width: 600px) and (max-width: 800px) {
	デバイスの幅が600−800pxの時に反映させるスタイル。
}
ex)
@media (min-width: 0px) and (max-width: 599px) {
}
@media (min-width: 600px) and (max-width: 799px) {
}
@media (min-width: 800px) {
}

e.g.2)

スクリーン、高さ 700px、画面が縦長モードいずれかに当てはまるとき適用

@media (min-height: 700px), screen, (orientation: potrait) {...}

- (tips)
モバイルファーストとし、まずはモバイル用に CSS を記述しましょう。その後、大きなデバイス様にメディアクエリを活用して、レイアウトを調整してください


***[グリッドレイアウト]--------------------------------
グリッドコンテナーを作成するには、要素に対して**display: grid か display: inline-grid を指定します。グリッドコンテナーを作成すると、直接の子要素がすべてグリッドアイテムへと変わります。
*grid-template-columns および *grid-template-rows プロパティを使用してグリッド上に行と列を定義します。これらはグリッドトラックをいいます.
ex)
.container {
  display :grid;
  grid-template-columns: 100px 100px 100px; --3列2行のグリッドコンテナ、　全て100x100pxのトラック
  grid-template-rows: 100px 100px ;
}
.container {
  display :grid;
  grid-template-columns: 100px 1fr 100px; --3列2行のコンテナ、両端4つのトラックは100x100px、真ん中2つは　100余白分　　
  grid-template-rows: 100px 100px ;
}
.container {
  display :grid;
  grid-template-columns: 100px 2fr 1fr 100px; --2fr,1frということは、真ん中２列のトラックは余白2:1の比率に割った幅をそれぞれ持つ。
  grid-template-rows: 100px 100px ;

**repeat()によるトラック記法 --
ex)
  grid-template-columns: repeat(4, 100px); -100px幅のグリッドを4つ。
  grid-template-rows: 100px 100px;
   grid-template-columns: repeat(auto-fill, 100px); -100px幅のグリッドを親要素(つまりグリッドコンテナ)分ならべる。
  grid-template-rows: 100px 100px;
*minmax(a, b) --a以上b以下の寸法になるような値を意味する。
*auto-fill --指定幅のグリッドを親要素幅分並べる。（伸張し要素がなくなればその分空白になる。）
*auto-fit --指定幅のグリッドを親要素幅分並べる。(横幅いっぱいに均等の配置する)
ex)
grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  grid-template-rows: 100px 100px ;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  grid-template-rows: 100px 100px ;

**明示的なグリッドと暗黙的なグリッド --*grid-template-columns および *grid-template-rows プロパティによって作成されるグリッドは明示的グリッドと呼び、それ以降も(コンテンツがあれば？)暗黙的にグリッドも作成されます。デフォルトだと、内容物のサイズによってグリッドの大きさが決まりますが、それらを定義するのがgrid-auto-rows と grid-auto-columnsです。
ex)
	grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
	grid-template-rows: 100px 100px ; --2行までは明示的なグリッドが定義され、それ以降の行の高さは100pxとして作成される。(終始一定の高さでよければgrid-template-rows は省略できる。)
	grid-auto-rows: 100px;
*ex)div要素が暗黙的なグリッドに作成された際、その幅はblock要素なのでページの横いっぱいまで広がってしまう際に
grid-auto-columns: 100px;と指定すると、暗黙的にグリッドが保たれたように見える。
*grid-auto-flow: --配置アルゴリズムを変える。(値:row-初期値左上から右に配置、column-左上から下に配置、dense-発生した空白を埋めるように配置(row,column)と併用可能。)
*div要素が暗黙的なグリッドに作成された際、その幅はblock要素なのでページの横いっぱいまで広がってしまう際に
grid-auto-columns: 100px;と指定すると、暗黙的にグリッドが保たれたように見える。
*gap: --一括指定プロパティグリッド間の余白を作る。(値:row-gap,column-gap)横縦の順で指定する。1つの値を与えることもできる。

***グリッドラインによるグリッドトラックの指定、以下のようにグリッド線に番号でインデックスをつける。
	1(-4)		2(-3)		3(-2)		4(-1) 
1(-4)-------------------------------------
	|			|			|			|
	|			|			|			|
2(-3)-------------------------------------
	|			|			|			|
	|			|			|			|
3(-2)-------------------------------------
	|			|			|			|
	|			|	☆ 		 |			 |
4(-1)-------------------------------------

☆が入ったグリッドに指定の要素を入れたい時は
grid-row: 2;
grid-column: 2;と指定する。
また、☆の右横までの２マスを指定したい時は、
grid-row: 2;
grid-column: 2 / 4 --グリッド線２から4まで、もしくは 2 / span 2 --2から２グリッド分と書く。(spanは単にグリッドの大きさを範囲指定する時に単体でも用いられる。)

**グリッドラインに名前をつける。--明示的なグリッドを作成する際に、命名したいグリッドラインに当たる部分に[]で囲って命名する。
	grid-template-columns: 100px [target-start] 100px [target-end] 100px;
	grid-template-rows: 100px 100px;
}
.box1 {
	background-color: hsl(0,60%,60%);
	grid-row:2;
	/* grid-column: target-start / target-end; */ --グリッドラインの数値ではなく、付けた名前で指定。
	grid-column: target;　--　-start/-end で指定したものについては略記できる。
}

**grid-areas/grid-areaを用いた直感的な記法
ex)
.container {
  display :grid;

  grid-template-columns: repeat(5, 100px);
  grid-template-rows: repeat(4, 100px);
  grid-auto-columns: 100px;
  grid-template-areas: 
    "r r r y y"
    "r r r y y"
    "c c g y y"
    "c c b y y";
}
.box1 {
  background-color: hsl(0,60%,60%);
  /* grid-row: 2;
  grid-column:1; */
  grid-area: r;
 
}
.box2 {
  background-color: hsl(60,60%,60%);
  grid-area: y;
}
.box3 {
  background-color: hsl(120,60%,60%);
  grid-area: g;

}
.box4 {
  background-color: hsl(180,60%,60%);
  grid-area: c;
}
.box5 {
  background-color: hsl(240,60%,60%);
  grid-area: b;
 
}

grid-template-areas内で、グリッドトラックそれぞれに対して、アルファベットを当てはめ、それらと各grid-areaの値を上の例でみたように対応される。※注意点としては、grid-template-areasの領域は要素が四角でなければならない。つまり、３トラックをつかってL字に要素を配置したり、例でいうyyの領域を飛び地にすることはできない。

***{グリッドの揃え、整え方}
**justify-content/align-content: --グリッドコンテナの配置を指定する。親要素内にたいしてどのようにコンテナを置くかを指定する。(値:start,end,center)
**justify-items/align-items: -- それぞれのグリッドトラック内でのコンテンツの配置を一括指定する。
**justify-self/align-self: --それぞれのグリッドトラック内でのコンテンツの配置をグリッドトラック単位で指定する。

------------------------------------------------

# [CSS変数]
複数のプロパティに渡って同一に指定したい値を、一箇所で管理するためのもの
全体に対して、適応する前提なので、一般には:rootに対して使用する。

①CSS変数を宣言: 大文字小文字を区別する。
e.g.) 
--my-color

②呼び出す: var(変数名)で呼び出すことができる。
e.g.)
color: var(--my-color);

- 既定値(デフォルト値)/代替値を設定できる。
e.g.)
border: 3px solid var(--my-color, skyblue);
//--my-colorがない時はskyblueを適応する。






**継承(inheritance) --CSS関数は、通常変数を設定した同セレクタ内でのみ有効。なので、複数の要素に対して、変数を用いる際には、その親要素に対して変数を定義すると良い。文書全体に適応したい際は.html(>body)要素で定義することがあり、:rootという擬似クラスを用いることで、html要素(タグ)に指定したことと同義になる。
ex)
html {
	--css-var: "値";
} ==
:root {
	--css-var: "値";
}

**使用上の注意点 --①css変数は、飽くまでプロパティの値に対して定義できるもので、プロパティ名に対して適応することはできない、背景つけたいならいちいちbackgroud-colorと書いて設定してくださいということです。
②単位を後付けできない。たとえば,
ex) {
--my-width: 64;
width: var(--my-width-)px;
}
としても、width: 64px;ということにはならない。ので、/*opt1-変数を指定する際に単位をつけておく
/*opt2-呼び出す時にcalc()(calc関数)を用いる。
ex) {
--my-width: 64;
width: calc(var(--my-width-) * 1px); 
} --こうすることで、単位を後付けできる。

--------------------------------