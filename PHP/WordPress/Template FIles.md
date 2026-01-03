---
tags:
  - php
  - wordpress
  - syntax
created: 2026-01-03
status: active
---

# 用語整理

テンプレート一口に言っても色々な使い方で用いられる言葉です(ワードプレス内で)

- **テンプレートファイル**はテーマ内に存在し、サイトの表示方法を表します。  
    (テンプレート階層で特定されるファイル自体のこと)

- [**テンプレート階層**](https://developer.wordpress.org/themes/basics/template-hierarchy/)はWordPressが要求されたコンテンツに応じてどのテーマテンプレートファイルを使用するかを決定するために使用されるロジックです。

- [**ページテンプレート**](https://developer.wordpress.org/themes/template-files-section/page-template-files/)は、ページ、投稿、およびカスタム投稿タイプに適用され、外観や感覚を変更するものです。

**クラシックテーマにおいて**、[**テンプレートタグ**](https://developer.wordpress.org/themes/basics/template-tags/)はテンプレートファイル内で使用してデータを取得し表示するために使用される、WordPressに組み込まれた関数です

- `**[the_title()]**`**(https://developer.wordpress.org/reference/hooks/the_title/)**

- `**[the_content()]**`**(https://developer.wordpress.org/reference/hooks/the_content/)**など）

**ブロックテーマでは**、テンプレートタグの代わりにブロックが使用されます。

- ブロック
    
    WordPressブロックエディタを使用してページや投稿に追加できる事前に構築されたコンポーネントです。各ブロックには、外観や動作を変更するためにカスタマイズできるオプションや設定があります。一般的なブロックには、段落ブロック、画像ブロック、ギャラリーブロック、ビデオブロックなどがあります。ブロックテーマを使用すると、カスタムPHPコードを書かずに複雑なレイアウトやデザインを作成できます。(GUI)
    

# Template files

ワードプレスのテーマは、テンプレートファイルを元に作成される。

- In classic themes these are PHP files that contain a mixture of HTML, [Template Tags](https://developer.wordpress.org/themes/basics/template-tags/), and PHP code.  
    

- (In block themes these are HTML files that contain HTML markup representing blocks.)

## リクエストの処理の仕組み(重要)

あなたのウェブサイトのページを訪れると、WordPressはリクエストに基づいてテンプレートを読み込みます。  
表示されるコンテンツの種類は、テンプレートファイルに関連付けられている**投稿タイプ**によって決定されます。  
テンプレート階層というものが、リクエストの種類とテーマ内にテンプレートが存在するかどうかに基づいて、WordPressが読み込むテンプレートファイルを決定する方法を提供しています。

サーバーはその後、テンプレート内のコードを解析して訪問者にHTMLを返します。

> When someone visits a page on your website, WordPress loads a template based on the request. The type of content that is displayed by the template file is determined by the [Post Type](https://developer.wordpress.org/themes/basics/post-types/)  
>  associated with the template file. The [Template Hierarchy](https://developer.wordpress.org/themes/basics/template-hierarchy/)  
>  describes which template file WordPress will load based on the type of request and whether the template exists in the theme. The server then parses the code in the template and returns HTML to the visitor.

`index.php`が最も不可欠なテンプレートで、これはテンプレート階層によって具体的なページが特定されなかったときに、最終的に表示されるセーフティネット的な役割を持つテンプレートです。

## Template partials

テンプレートのパーシャル(かけら)

テンプレートのパーツは、他のテンプレートの一部として使われるものです。

e.g.)

- `header.php` or `header.html` for generating the site’s header

- `footer.php` or `footer.html` for generating the footer

- `sidebar.php` or `sidebar.html` for generating the sidebar

## 共通のテンプレートファイルの一例

cf)

[https://developer.wordpress.org/themes/basics/template-files/#common-wordpress-template-files](https://developer.wordpress.org/themes/basics/template-files/#common-wordpress-template-files)

## テンプレートタグ

これは、テーマの中で、DBからデータを取得するためのwordpressの仕組みです。

具体的には

- A PHP code tag

- A WordPress function

- Optional parameters

３つに分類できる。

つまり、wpが用意する関数群のこと。おそらくだがHTMLタグから来ているね

cf)

[

Template Tags | Theme Developer Handbook | WordPress Developer Resources

Template tags are used within themes to retrieve content from your database. The content could be anything from a blog title to a complete…

![](PHP/WordPress/Attachments/wmark.png)https://developer.wordpress.org/themes/basics/template-tags/



](https://developer.wordpress.org/themes/basics/template-tags/)

### 代表例

- get_header()  
    header.php()ファイルをget

- get_footer()  
    footer.php()ファイルをgetさせる

- the_title()  
    ページtitleとして保存されているデータをDBから取得する

- bloginfo( ‘name’ )  
    ブログタイトルとして保存されているデータを取り出す。