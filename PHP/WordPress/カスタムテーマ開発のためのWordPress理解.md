
## 概要

カスタムテーマを作成するにあたって、themefiles(テーマファイル)とpostypes(投稿タイプ)を見ていって、その後、テーマの中でのファイルの整理整頓の仕方について学びます。

あ、あと、loopってことについても学びます。これは、WordPressのテーマで使用されるPHPコードで、WordPressデータベースから投稿を表示するために使用されます。

データベースから投稿、ページ、またはその他のコンテンツタイプを取得し、Webページに表示する責任を持っています。

[The functions.php](%E3%82%AB%E3%82%B9%E3%82%BF%E3%83%A0%E3%83%86%E3%83%BC%E3%83%9E%E9%96%8B%E7%99%BA%E3%81%AE%E3%81%9F%E3%82%81%E3%81%AEWordPress%E7%90%86%E8%A7%A3/The%20functions%20php%2070e6420f3b5e495c819682eb282e5e80.html)

[Template FIles](%E3%82%AB%E3%82%B9%E3%82%BF%E3%83%A0%E3%83%86%E3%83%BC%E3%83%9E%E9%96%8B%E7%99%BA%E3%81%AE%E3%81%9F%E3%82%81%E3%81%AEWordPress%E7%90%86%E8%A7%A3/Template%20FIles%205c9b08b2719e4da5968d48a0d2076822.html)

[Post Types(投稿タイプ)](%E3%82%AB%E3%82%B9%E3%82%BF%E3%83%A0%E3%83%86%E3%83%BC%E3%83%9E%E9%96%8B%E7%99%BA%E3%81%AE%E3%81%9F%E3%82%81%E3%81%AEWordPress%E7%90%86%E8%A7%A3/Post%20Types\(%E6%8A%95%E7%A8%BF%E3%82%BF%E3%82%A4%E3%83%97\)%20e565a612de0f4a30be8569a41f99d80a.html)

---

[Template tagチートシート](%E3%82%AB%E3%82%B9%E3%82%BF%E3%83%A0%E3%83%86%E3%83%BC%E3%83%9E%E9%96%8B%E7%99%BA%E3%81%AE%E3%81%9F%E3%82%81%E3%81%AEWordPress%E7%90%86%E8%A7%A3/Template%20tag%E3%83%81%E3%83%BC%E3%83%88%E3%82%B7%E3%83%BC%E3%83%88%205bca9b5fa3c648f994ef81d555365efa.html)

[Tonik](%E3%82%AB%E3%82%B9%E3%82%BF%E3%83%A0%E3%83%86%E3%83%BC%E3%83%9E%E9%96%8B%E7%99%BA%E3%81%AE%E3%81%9F%E3%82%81%E3%81%AEWordPress%E7%90%86%E8%A7%A3/Tonik%2038243765bf1b43d7b6098ee4d3ff1d5c.html)

cf)

[

Theme Basics | Theme Developer Handbook | WordPress Developer Resources

In this chapter, you'll begin learning how to build a theme. The anatomy of a theme and its parts will be broken down and explained. You'll…





https://developer.wordpress.org/themes/basics/


---
# webページの生成

1. まずは、ブラウザからリクエストをもらいます。リクエストに応じてどのページを選択させるかはまた別の機会に。。

2. 各ページはいくつかの投稿タイプに分けられるが、いずれもテンプレートを用いる。  
    (webページの雛形)

3. **管理画面(GUI)**から投稿されるパラメータをDB(MYSQL)に保存することで状態を持たせる。

4. 実際にページとしてrenderする際には、[PHPがDBからデータを取り出し](%E3%82%AB%E3%82%B9%E3%82%BF%E3%83%A0%E3%83%86%E3%83%BC%E3%83%9E%E9%96%8B%E7%99%BA%E3%81%AE%E3%81%9F%E3%82%81%E3%81%AEWordPress%E7%90%86%E8%A7%A3/Template%20FIles%205c9b08b2719e4da5968d48a0d2076822.html)、動的なページとして生成している。(テンプレートタグと呼ばれる)

### data_fetch

$post(WordPressが用意する変数)を用いて、投稿に関するfield(属性、プロパティ、値)を取得することができます。詳細は[テンプレートタグ](%E3%82%AB%E3%82%B9%E3%82%BF%E3%83%A0%E3%83%86%E3%83%BC%E3%83%9E%E9%96%8B%E7%99%BA%E3%81%AE%E3%81%9F%E3%82%81%E3%81%AEWordPress%E7%90%86%E8%A7%A3/Template%20tag%E3%83%81%E3%83%BC%E3%83%88%E3%82%B7%E3%83%BC%E3%83%88%205bca9b5fa3c648f994ef81d555365efa.html)の項目で会いましょう

```PHP
e.g.)
$post->post_name
```

ACFを使う場合には`get_field()`を使うことでも対応できます。

# memo

---

- `_e()`  
    引数にとった文字列を翻訳して表示する

cf)

[

_e() | Function | WordPress Developer Resources

Displays translated text.

![](PHP/WordPress/Attachments/wmark%202.png)https://developer.wordpress.org/reference/functions/_e/



](https://developer.wordpress.org/reference/functions/_e/)

- single-xxxx

- page-xxxが該当のファイルになる可能性が高い

- page-$slug.php if no page-$id.php

- テンプレートファイルの末尾のtpl.phpはtonik用の識別子

- (templateヒエラルキー)`Custom Post => single-$posttype.php`

$posttypeは投稿タイプのこと?

今回はCustomPostのtype=shopです(ソースは管理画面のクエリパラメータ)

`?type=shop`

独自項目の実装(プロパティ)

- title

- content

- category

- eyecatch

# タクソノミー

WordPressにおけるタクソノミー（Taxonomy）は、コンテンツ（投稿やカスタム投稿タイプ）を分類・整理するためのシステムです。タクソノミーを使って、関連する投稿をまとめたり、ユーザーが特定のカテゴリーやタグに基づいて情報を検索しやすくすることができます。

WordPressには、デフォルトで2つのビルトインタクソノミーがあります。

1. カテゴリー（Category）： 階層的なタクソノミーで、投稿をトピックやセクションに分類するために使用されます。カテゴリーは親子関係を持つことができ、サブカテゴリーを作成することも可能です。

2. タグ（Tag）： 非階層的なタクソノミーで、投稿に関連するキーワードを追加するために使用されます。タグは、投稿間の関連性を強調し、ユーザーが類似した内容の投稿を見つけやすくする役割を果たします。

さらに、WordPressではカスタムタクソノミーを作成することもできます。カスタム投稿タイプに対して独自のタクソノミーを作成し、より詳細な分類や整理が可能になります。例えば、カスタム投稿タイプ「製品」がある場合、カスタムタクソノミー「ブランド」や「製品タイプ」を作成して、製品をさらに細かく分類することができます。

タクソノミーは、WordPressのコンテンツ管理機能を強化し、関連する情報を見つけやすくするための重要な機能です。カスタムタクソノミーを使って、特定のニーズに合わせた分類方法を設定することができます。

# 投稿をオブジェクトとして取得する。

## タクソノミークエリ

分類。ライダース、お知らせを満たす告知投稿を取得するのような、カテゴリーで絞り込んだ投稿をオブジェクトとして取得するためのクエリ。

- fieldで、termsと比較する対象を指定します。

- terms今回は、$termの値を可変に取得し,そのslugを持つものを取得する。

```PHP
'field' => 'slug',
'terms' => $term,
```

cf. )

[

関数リファレンス/WP Query - WordPress Codex 日本語版

![](https://wpdocs.osdn.jp/favicon.ico)https://wpdocs.osdn.jp/%E9%96%A2%E6%95%B0%E3%83%AA%E3%83%95%E3%82%A1%E3%83%AC%E3%83%B3%E3%82%B9/WP_Query#.E3.82.BF.E3.82.AF.E3.82.BD.E3.83.8E.E3.83.9F.E3.83.BC.E3.81.AE.E3.83.91.E3.83.A9.E3.83.A1.E3.83.BC.E3.82.BF



](https://wpdocs.osdn.jp/%E9%96%A2%E6%95%B0%E3%83%AA%E3%83%95%E3%82%A1%E3%83%AC%E3%83%B3%E3%82%B9/WP_Query#.E3.82.BF.E3.82.AF.E3.82.BD.E3.83.8E.E3.83.9F.E3.83.BC.E3.81.AE.E3.83.91.E3.83.A9.E3.83.A1.E3.83.BC.E3.82.BF)

# WP_query

e.g.)

```PHP
$args = [
        'posts_per_page' => -1, // 全ての投稿を取得
        'post_type' => 'tenpo_eigyous',
        'category_name' => $shop_category,
        'post_status' => 'publish',
        'orderby' => 'meta_value', //ソートのキーを指定する。
        'meta_key' => 'tenpo_eigyou_start', // 日付の若い順にsort
        'order' => 'ASC',
        'suppress_filters' => false,
    ];
```

- `**suppress_filters**`

`**suppress_filters**` のデフォルト値は `**false**` です。この値が `**false**` に設定されている場合、`**get_posts()**` 関数は登録されているフィルターフックを実行します。これにより、他のプラグインやテーマが投稿の取得方法や結果に影響を与えることができます。

### WP_queryとget_postsの違いと使い分け

[

WordPressでよく使う！WP_Queryとget_postsの違い｜カルキチのブログ

WordPressをやっている方は、WP_Queryとget_postsの違いをご存知でしょうか？投稿を取得する際に非常に便利なWP_Queryとget_postsですが、似ているようで実は微妙に違います。この記事では、WP_Queryとget_postsの違いについて解説しています。

![](PHP/WordPress/Attachments/favicon.ico)https://karukichi-blog.netlify.app/blogs/wp-query-get-posts-difference

![](PHP/WordPress/Attachments/thumbnail-5.png)](https://karukichi-blog.netlify.app/blogs/wp-query-get-posts-difference)

## デフォルトで $wp_queryを参照する仕様

らしい。

`$wp_query` は、WordPressのグローバル変数で、デフォルトのメインクエリを格納しています。このメインクエリは、現在のページ（アーカイブページ、投稿ページ、固定ページなど）に表示される投稿や固定ページの情報を含んでいます。

あなたが `**$wp_query**` を `**$purchased_bicycle_records**` に変更しようとしている理由が、グローバル変数の使用を避けることであると理解しました。しかし、この変更によって、WordPressのループが正常に動作しなくなることがあります。ループが `**$wp_query**` に依存しているからです。

解決策として、次のように新しいクエリオブジェクトを作成し、そのオブジェクトを使用してループを実行することができます。

まず、`**$wp_query**` を `**$purchased_bicycle_records_query**` に変更します。

```PHP
$purchased_bicycle_records_query = get_purchased_bicycle_records($bicycle_type_slug, $current_page);
```

次に、ループをカスタムクエリとともに使用するには、次のように `**if**` ステートメントと `**while**` ステートメントを変更します。

```PHP
<?php if ($purchased_bicycle_records_query->have_posts()): ?>
	<ul class="case__contents__main__lists">
		<?php while ($purchased_bicycle_records_query->have_posts()): $purchased_bicycle_records_query->the_post(); ?>
			...
		<?php endwhile; ?>
	</ul>
<?php else: ?>

```

最後に、ループの後で `**wp_reset_postdata();**` を呼び出し、メインの `**$wp_query**` オブジェクトにポストデータをリセットします。これにより、他のループやテンプレートタグが正しく機能します。

```Plain
phpCopy code
<?php endif; ?>
<?php wp_reset_postdata(); ?>

```

これで、グローバル変数 `**$wp_query**` を直接使用せずに、カスタムクエリとともにループを実行できるようになります。

```PHP
<?php if ($purchased_bicycle_records->have_posts()): ?>
			<ul class="case__contents__main__lists">
				<?php while ($purchased_bicycle_records->have_posts()): $purchased_bicycle_records->the_post(); ?>
					<?php
					$terms = get_the_terms(0, 'kaitori_category');
					$thumbnail_url = get_the_post_thumbnail_url();
					?>
					<li class="case__contents__main__lists__item">
						<?php if ($thumbnail_url): ?>
							<img class="case__contents__main__lists__item__img" src="<?= $thumbnail_url ?>" alt="image">
						<?php endif; ?>
						<div class="case__contents__main__lists__item__texts">
							<?php foreach ($terms as $key => $value): ?>
								<div class="case__contents__main__lists__item__texts__label"><?= $value->name ?></div>
							<?php endforeach; ?>
							<p class="case__contents__main__lists__item__texts__content">
								<a class="column__contents__main__lists__item__link" href="<?= get_post_permalink($post->ID) ?>">
									<?= get_the_title() ?>
								</a>
							</p>
						</div>
					</li>
				<?php endwhile; ?>
			</ul>
		<?php else: ?>
			<div class="case__contents__main__message">
				該当する買取実績がありません。
			</div>
		<?php endif; ?>
```

[https://wpdocs.osdn.jp/関数リファレンス/WP_Query](https://wpdocs.osdn.jp/%E9%96%A2%E6%95%B0%E3%83%AA%E3%83%95%E3%82%A1%E3%83%AC%E3%83%B3%E3%82%B9/WP_Query)

# A**rchiveページ**

**アーカイブページとは、記事の一覧を表示するページです。**

**今までに書いた記事の全てを表示したり、特定のカテゴリーやタグ、日付の記事のみを一覧で表示したりすることができます。**

# paginationの設定。

`'base' => add_query_arg('paged', '%#%')` は、ページネーションリンクのベースURLを設定します。`add_query_arg()` 関数は、指定したキーと値を現在のURLに追加して返します。

この場合、paged クエリパラメータに対応するページ番号（%#%）を追加しています。%#% は後で現在のページ番号に置換されます。

`'format' => '?paged=%#%'` は、ページネーションリンクのフォーマットを設定します。このフォーマットは、ページ番号が置換される部分を表します。ここでは、?paged=%#% としているので、ページ番号は paged クエリパラメータの値として表示されます。たとえば、2ページ目のリンクは ?paged=2 のようになります。ここでも、%#% は後で現在のページ番号に置換されます。

これらのオプションを使って、ページネーションリンクのベースURLとフォーマットをカスタマイズできます。この例では、クエリパラメータ paged を使用して、ページ番号を指定するリンクが生成されます。paginate_links() 関数は、これらの設定を元に、ページネーションリンクを生成します。

```PHP
'base' => '/case%_%',
'format' => '/page/%#%',
この場合には、baseとなるURLは/case + <format部分>になる。
formatは/page/<ページ番号>が入るため、

/case/page/2などとなる。
```

クエリにパラメータを追加する。　

add_query_arg() 関数は、以下のように使用することができます：

```PHP
$new_url = add_query_arg('key', 'value', $url);
```

この例では、指定された $url に key=value というクエリパラメータを追加し、新しい URL を $new_url に格納します。

この時、`/case/page/2?key=value`がURLとして生成される。