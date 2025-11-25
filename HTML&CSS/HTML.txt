<!--コメントは,こうして入れます-->
***[HTMLのタグ]----------
*<h1>,<h2>,,,,<h6>--Heading(見出し)
*<p>--Paragraph(段落)
*<img src="画像のソースファイルを指定",alt="代替するテキストや音声読み上げに使われる" width="幅(px単位つけない)" height="高さ(pxなし)">--画像を挿入する。終了タグ不要
**リスト表現
*<ul>--UnOrdered List　箇条書きリスト(黒点付きリスト) 子要素<li>
*<ol>--Ordered List　順序付きリスト。子要素<li
-*<li>--ListItem ul,olの中のそれぞれ項目を表現する。
*<dl>--Description List　説明付きリスト　子要素<dt>、<dd>
-*<dt>--Description Term　項目の名称
--*<dd>--Description Details　項目の詳細

**表表現 ①全体 ②見出し/本体 ③行 ④セルの順番に構成していく
*<table>--囲われた範囲でテーブルを作る。
*<thead>--TableHead　表の見出し
*<tbody>--TableBody　表の本体
--*<tr>--Table Row 表の行部分
--*<th>--Table Header 見出しセル
--*<td>--Table Data	データセル
ex)
<table>
	<thead>
		<tr><th>年</th><th>出来事</th></tr>
	</thead>
	<tbody>
	<tr>
		<td>2011</td>
		<td>サービス開始</td>
	</tr>
	<tr>
		<td>2022</td>
		<td>256timesサービス開始</td>
	</tr>
	</tbody>
</table>

**<a href="" target="">--Anchor リンクを作成するタグ
リンクの出発点を示す場合は、href(HypertextREFerence)属性でリンク先を指定し、到達点を示す場合はname属性やid属性を使用し、その場所の名前（識別子）を指定します。
*target属性にとったリンク先の文書を開くフレームやウィンドウを指定する。
ex)_blank --新規ウィンドウでリンクを開く。
*ページ内リンクの作成--リンク元のaタグhref属性に「＃名前」を記し、リンク先のタグのid属性に設定した名前をつける。
ex)
<a href="#dst">リンク元</a>
<section id="dst">リンク先</section>

**文書の意味を明確にするためのタグ(見た目への影響しない)
*<main>--ページ内の主要なコンテンツを表現する。ページ内で1回のみ使用できる。(必須ではない)
*<aside>--本文と関連が低いコンテンツ(広告や関連リンク)(必須ではない)
*<section>--見出しごとにどの範囲の内容をまとめているかとを明示する
*<article>--記事のようなコンテンツを表現する。(twitterの呟き部はこのタグであるよ)
*<nav>--ページ内の主要なナビゲーションを表現するためのタグ
*<header>--囲んだ範囲をヘッダーの要素とするタグ。何回でも使える
*<footer>--囲んだ範囲をフッターの要素とするタグ。アーティクルのフッター的要素にも使えるし、ページ内に１度という制限もない
*<small>--注釈や細目などの短いテキストに使用する要素(HTML5)。メインコンテンツや長文に対して使用するのは避ける。
*<time>--日時を表すタグ。2020-11-17 13:00のような形であれば良いが、11月11日など日本語表示の時は別途datetime属性を付与して、タグの中に記述する
*<code>--プログラムのコードを表現する。
	ex) <date datetime="2020-11-17 13:00">11月17日１3時</date>
*<br>--BReakタグ、改行につかう。終了タグ不要

*文字参照、言語と干渉しそうな記号を文字列として表現する方法。
	ex)HTML内で<h1>を文字列として表現したい場合、"<"=&lt; ">"=&gt;

**スタイリングのために要素を囲むタグ（）
*<span>--囲った要素をインライン要素として扱う
*<div>--囲った要素をブロック要素として扱う
		？ブロック要素だと改行がされるよね？

[フォーム部品の作成]
***<input　type="",value="初期値">-- １行の入力を受け取る要素。type属性によって、まじで多様な物を表せる。type属性の値としてbutton,text,password、submit...などがある
*<textarea　placeholder="入力例を明示(入力すると消えるので非推奨)">--複数行のテキストの入力を受け取る。inputと対照的に、閉じタグ必要です。
		
*<label>-フォーム部品にラベルをつける時に使う。
ex)
1.シンプルな label の例
<label>Click me <input type="text"></label>
2."for" 属性の使用例
<label for="username">Click me</label>
<input type="text" id="username">

**ドロップダウンリストの作り方
*<select>--選択式のメニューを提供するコントロールを表す。なかの選択肢は<option>タグで追加する
		(使える属性:size=数値-デフォルトでの表示項目数をいじる。multiple-複数項目選択可能になる。)
*<option>--要素内の項目を定義する。select以外にも、<optgroup> 要素、<datalist>要素の項目を定義する際に使う。(使える属性:selected-複数のoption要素の中でデフォルトで表示されるものとなる。)
ex)
<label for="color">好きな色</label>
<select  id="color" size = 4 multiple>
	<option value="">色1</option>
	<option value="">色2</option>
	<option value="" selected>色3</option>
	<option value="">色4</option>
	<option value="">色5</option>
	<option value="">色6</option>
</select>

																											**チェックボックスの作り方--インプットで選択肢を作り、ラベルで囲むことでラベル化。fieldset等で囲む。
*<input type="checkbox">--チェックボックスを作る。(使える属性:checked-デフォルトでチェックをつける)
*<fieldset>--ウェブフォーム内のラベル (<label>) などのようにいくつかのコントロールをグループ化する。
*<legend>--親要素となってる。fieldsetのキャプションに用いる。
ex)
<fieldset>
	<legend>お使いのスマホ</legend>
	<label><input type="checkbox">iPhone</label>
	<label><input type="checkbox" checked>Android</labe>
	<label><input type="checkbox">Windows Phone</label>
</fieldset>

**ラジオボタンの作り方--チェックボックスのように、インプットで選択肢を作成。※ラジオボタン化する(排他的選択ができるように連動させる)ために、inputのname属性に統一された値を選択肢それぞれに入れること！
*<input type="radio" name="値">
ex) 
<fieldset>
	<legend>一番好きなスマホ</legend>
	<label><input type="radio" name="phone">iPhone</label>
	<label><input type="radio" name="phone"checked >Android</labe>
	<label><input type="radio" name="phone">Windows Phone</label>
</fieldset>

**inputを使ったさまざまは部品
*<input type="color">--色を入力するための部品
*<input type="date">--日付を入力することができる
*<input type="number">--数値のみを入力
*<input type="range">--範囲の数値をスライダーの入力で受け取れる。

**ボタンの作り方--2種類あります。buttonタグだと中に画像などを入れられるよ。(使える属性:disabled-要素を無効化する)
*<input type="button" value="ボタンに表示したい文字">
もしくは
*<button>ボタンに表示したい文字</button>

**<form action="送信先プログラムのファイル名" method="送信方式">--入力した値をプログラムに送信する。フォーム内の送信される値には、識別子をネームタグでつけるようにしましょう。
ex) 
<form action="process.php" method="post">
	<label>担当者名 <input type="text" name="username"></label>
	<label>タスク <input type="text" name="task"></label>
	<button>追加</button>
</form>































HTMLのブロック要素とインライン要素　
	HTMLの要素には、改行される要素と改行されない要素があります。
	前後で改行が入り、画面で表示される際に、親要素の幅一杯に広がる要素をブロック要素といいます。<div>要素や<h1>要素、<p>要素はブロック要素です。
	それに対して、<span>要素や<a>要素のように改行されない要素をインライン要素といいます。また。インライン要素にはwidthやheight、上下のmarginが
	指定できないなど不便な点があります。
					
インラインブロック要素
	インラインブロック要素はインライン要素と同様に横に並びますが、ブロック要素のように幅や高さをもちます。
					
twitter等のアイコンを挿入したい時、fontawesomeをつかってhead部にstylesheetをリンクさせる。その後spanを用いて、class="fa fa-xxx"と記述する。
					
					
				複数のクラスを設定する
	<div class="btn red"></div> というように半角スペースをとることでクラスを複数指定できる
	

****[属性] ---------------
title --要素に関する補助的な情報を与えるもので、マウスホバーすると表示される
？data属性　--これをつけると確か、javascriptを動かしてくれるはず。

- data-xxx 
data-に続く形で、好きな属性を定義できる。カスタムデータ属性と呼ばれる。