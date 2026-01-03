 

# Template tagチートシート

- get_header()  
    header.php()ファイルをget

- get_footer()  
    footer.php()ファイルをgetさせる

- the_title()  
    ページtitleとして保存されているデータをDBから取得する

- bloginfo( ‘name’ )  
    ブログタイトルとして保存されているデータを取り出す。

- [the_content()](https://developer.wordpress.org/reference/functions/the_content/)

- [the_excerpt()](https://developer.wordpress.org/reference/functions/the_excerpt/)

- [next_post()](https://developer.wordpress.org/reference/functions/next_post/)

- [previous_post()](https://developer.wordpress.org/reference/functions/previous_post/)

- [wp_list_cats()](https://developer.wordpress.org/reference/functions/wp_list_cats/)

- [wp_list_pages()](https://developer.wordpress.org/reference/functions/wp_list_pages/)

- `[get_posts()](https://developer.wordpress.org/reference/functions/get_posts/)`

`**get_posts()**` は WordPress のビルトイン関数で、指定されたクエリパラメータに基づいて投稿を取得するために使用されます。使用方法は以下の通りです。

```PHP
$posts_array = get_posts( $args );
```

- `**$args**`: 投稿を取得するための**クエリパラメータを含む連想配列（省略可能）**

このコードでは、`**get_field()**` は店舗の ID や名前など、店舗に関連するカスタムフィールドの情報を取得するために使用されています。また、`**get_posts()**` は、特定のカテゴリーやタクソノミーに属する投稿を取得するために使用されています。取得した投稿は、お知らせリストや営業に関する情報を表示するために使われています。

- `get_the_ID()`

投稿のIDを取得する関数。

- `have_posts()`

主に、ループ処理のために使われるwp関数で、 表示する投稿(post)があれば、trueを返す。なければfalseを返す。よく`the_post()`とセットで用いられる。　

- `the_post`

`$post`をセットするこれによって、loopを回している際に、`**the_title()**`**などの関数を使用して適切な値な投稿(post)についての値を取得する。**

> This function sets up the global `**$post**` variable with the next post in the loop. It prepares the data of the current post for display and advances the internal query counter to the next post. This is important because various template tags, like `**the_title()**`, `**the_content()**`, and `**the_permalink()**`, rely on the global `**$post**` variable to function correctly.

- `get_the_post_thumbnail_url()`

[

get_the_post_thumbnail_url() | Function | WordPress Developer Resources

Returns the post thumbnail URL.

![](PHP/WordPress/Attachments/wmark%201.png)https://developer.wordpress.org/reference/functions/get_the_post_thumbnail_url/



](https://developer.wordpress.org/reference/functions/get_the_post_thumbnail_url/)

- `clear_post_cache`

cf. )

[

clean_post_cache() | Function | WordPress Developer Resources

Will clean the post in the cache.

![](PHP/WordPress/Attachments/wmark%201.png)https://developer.wordpress.org/reference/functions/clean_post_cache/



](https://developer.wordpress.org/reference/functions/clean_post_cache/)

- `get_the_terms`

[https://developer.wordpress.org/reference/functions/get_the_terms/](https://developer.wordpress.org/reference/functions/get_the_terms/)

# ACF

- `**get_field()**`:

`**get_field()**` は、ACF プラグインによって定義された関数で、カスタムフィールドの値を取得するために使われます。使用方法は以下の通りです。

```PHP
$value = get_field( $field_name, $post_id, $format_value );
```

- `**$field_name**`: 取得したいカスタムフィールドの名前（必須）

- `**$post_id**`: カスタムフィールドが関連付けられている投稿の ID（省略可能）

- `**$format_value**`: 結果をフォーマットするかどうか（省略可能、デフォルトは `**true**`）