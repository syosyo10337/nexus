 

# The `functions.php`

`functions.php`ファイルは,

プラグインのように振る舞い、機能性をサイトに追加します。このファイルはワードプレスの関数を呼び出すために使ったり、自身の関数を定義するために使うことができます。つまり、ほぼほぼプラグライン

> The functions.php file behaves like a WordPress plugin, adding features and functionality to a WordPress site. You can use it to call WordPress functions and to define your own functions.

cf)

[https://developer.wordpress.org/themes/basics/theme-functions/](https://developer.wordpress.org/themes/basics/theme-functions/)

themeごとにfunctions.phpを持ち、themeに必要な`functions.php`ファイルだけが実行される。

💡

どうやらtonikでも`tonilk/`配下にそれぞれfuncions.phpは提供されている。

- functions.phpを複数ファイルに分割する。

```PHP
// functions.phpの分割
// Include files from the 'includes' folder.
foreach (glob(__DIR__ . '/includes/*.php') as $file) {
    require_once $file;
}
```

🚨

この時関数のスコープは限定されない。限定していきたい時には、クラスを作成する。