---
tags:
  - php
  - laravel
  - syntax
created: 2026-01-03
status: active
---

- `composer.json` ← `Gemfile`のこと。in PHP  
    つまりは、パッケージマネージャ

- `dd()`関数でのデバッグ

- resources/views がララベルのビューの置き場  
    blade拡張子はbladeを示し、　bladeとはlaravelで用いられるテンプレートエンジン

# Routing

## APIのルート設定とか

[APIルート](Laravel/API%E3%83%AB%E3%83%BC%E3%83%88%20fc31276dc64f49aa8d618474637b1e0e.html)

Routeクラスのstaticメソッドとして定義されているメソッドは、HTTPリクエストに対応しているものが存在し、そのメソッドの==第一引数にパス==を、(第二引数に対してコールバック関数を呼び出している。)

実際の用途としては、コントローラのフルパスnamespaceを含んだものと、その呼び出したいメソッドを明記する。

```PHP
Route::get('/', [IndexController::class, 'index']);
　
// IndexController::classでnamespaceを含んだコントローラ名のフルパスを取得することができる。
//　配列の二つ目の要素として '<action_name>を渡す

e.g.)
use App\Http\Controllers\UserController;
 
Route::get('/user', [UserController::class, 'index']);
```

### `→only(array)`いくつかのルーティングだけに絞る

onlyメソッドをチェーンすることで、必要なルーティングだけを使用することができる

```PHP
// e.g.)
Route::resource('listing', ListingController::class)->only('index', 'show');
```

### `→except`

いくつかのルーティングを消す　

## named route(名前付きルート)

name→(’つけたい名前’)の形で記述する

```PHP
Route::get('/hello', [IndexController::class, 'show'])->name('testRoute');


<Link :href="route('testRoute')">
```

パラメータを取りたい時には、パラメータの名前や、arrayやオブジェクトの形をとることができる

```PHP
<Link :href="route('listing.show', listing.id)">
<Link :href="route('listing.show', [listing.id])">
<Link :href="route('listing.show', {listing: listing.id})">
```

# Controller

artisan commandで生成する。

```Bash
php artisan make:controller IndexController
```

- fat controllerにならないようにしてください。

POSTリクエストのbodyからパラメータを受け取る

```PHP
public function store(Request $request)
{
    dd($request->all());
}
//　$requestのプロパティとして、それぞれのフォームの値が格納されてくる。

//->
array:8 [▼ // app/Http/Controllers/ListingController.php:36
  "beds" => 0
  "baths" => 0
  "area" => 0
  "city" => null
  "street" => null
  "code" => null
  "street_nr" => null
  "price" => 0
]
```

実際に$requestで受けとったパラメータを保存するには,以下のようにする。

==fillableのarrayに値がセットされていることを確認する。==

```PHP
//　e.g.1)特定のパラメータを指定してモデルオブジェクト経由でDBにアクセスする方法
public function store(Request $request)
{
    $listing = new Listing();
    $listing->beds = $request->beds;

    $listing->save();
}

// e.g.2) すべてのパラメータを直接永続化する()
// createメソッドによって作成された
public function store(Request $request)
{
    Listing::create($request->all());
}
```

## redirect

redirect()メソッドがオブジェクトを生成し、そのオブジェクトに対して、redirect先のrouteを`route(’controller.action’)`の形で記述する。

```PHP
public function store(Request $request)
{
    Listing::create($request->all());

    return redirect()->route('listing.index');
}
```

### redirect back

```PHP
public function destroy(Listing $listing)
    {
        $listing->delete();
        return redirect()->back()
            ->with('success', 'Listing was deleted!');
    }
```

## flashメッセージの設定方法

```Bash
public function store(Request $request)
{
    Listing::create($request->all());

    return redirect()->route('listing.index')
        ->with('success', 'Listing was created!');
}
```

あとは、

# Middleware

PHPクラスで、すべてのmiddlewareクラスは、handleメソッドを持ち、このメソッドはふたつの引数を取る。

- 第一引数は、Request() input headersなどのcontrollerのアクションで受け取れるものと同様のrequest情報をオブジェクトとして取得することができる。

- 第二引数は, functionで

```PHP
return $next($request)
```

の形で次のミドルウェアにリクエストをパスすることができる。

この前の行に、validationや特定のtokenチェックを行うことができます。

### Kernel.php

laravel Middlewareの設定をするためのファイルです

# Methods Injection

cf)

[https://laravel.com/docs/10.x/controllers#method-injection](https://laravel.com/docs/10.x/controllers#method-injection)

コンストラクタの挿入に加えて、コントローラメソッドにtype-hint(型アノテーションするもの)をコントローラのメソッドに加えることができます。

//before_filter的なものだね(Rails)

> In addition to constructor injection, you may also type-hint dependencies on your controller's methods. A common use-case for method injection is injecting the `**Illuminate\Http\Request**`  
>  instance into your controller methods:

```PHP
e.g.)
<?php
 
namespace App\Http\Controllers;
 
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
 
class UserController extends Controller
{
    /**
     * Update the given user.
     */
    public function update(Request $request, string $id): RedirectResponse
    {
        // Update the user...
 
        return redirect('/users');
    }
}
```

[🤪CustomValidatorの実装](Laravel/CustomValidator%E3%81%AE%E5%AE%9F%E8%A3%85%20ece8ce955f0c40f7bfe16ed2a90145b4.html)

[‘email’ルールの中身](Laravel/%E2%80%98email%E2%80%99%E3%83%AB%E3%83%BC%E3%83%AB%E3%81%AE%E4%B8%AD%E8%BA%AB%20278309fdcd404d28a16c48db346e212b.html)

- GraphQLクライアント

[

gmostafa/php-graphql-client - Packagist

GraphQL client and query builder.
