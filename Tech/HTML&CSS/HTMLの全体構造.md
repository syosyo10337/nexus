---
tags:
  - html-css
  - html
  - css
created: 2022-12-20
status: active
---

html の全体構造

*html:5 かつTABを押すと、雛形が出てくるよ

<!DOCTYPE html>--html5の文書宣言
<html lang="ja">--lang属性は言語の設定
	<head>--プログラムに読み込んでほしいことに関する情報-
		<meta charset="utf-8">--文字コードの情報
		<meta name="description" content="--概要(検索結果でページタイトルを一緒に表示されたりする。)">
		<meta http-equiv="X-UA-Compatible" content="IE=edge">--IEのための設定。サービス終了につき、形骸化。
		<meta name="viewport" content="width=device-width, initial-scale=1.0"--モバイルページ向けの設定
		<link rel="icon" href="ファイル名">--ファビコンを設定できる。
		<link rel="stylesheet" href="読み込む.cssファイル名">--CSSの読み込み
		<title>--ページタイトル</title>
	</head>	

	<body>--実際にユーザに向けて表示したい内容　h1,img..etc.
		レイアウトの一例としてはdivタグでヘッダー、メイン、フッターとおく。		
		
		<header>ヘッダーの構造の一例ロゴとリスト			
			<div class="header-logo"></div> *つくるリストの黒点を消したい時はcssでlist-styleプロパティをnone指定					　												  				
			<div class="header-list"></div>
		</header>
		
		<div class="main">以下一例として
			<div class="copy-container"></div>
			<div class="contents"></div>
			<div class="contact-form"></div>
		</div>
		
		
		<footer>フッターも一例としてはロゴとリスト
			<div class="footer-logo"></div>
			<div class="footer-list"></div>
		</footer>
	</body> 
</html>