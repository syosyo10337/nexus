 

# Inertia

[環境構築関連](%E7%92%B0%E5%A2%83%E6%A7%8B%E7%AF%89%E9%96%A2%E9%80%A3%20c46eb40245474ee58dd5ac1b7964f9eb.html)

# コントローラでの使用

Laravelの公式でのフロントエンドとの繋ぎ目となるもの？で

ユーザのリクエスト　→LaravelのRouteへわたり、→コントローラへ

コントローラ内で、inertia()メソッドを呼ぶことによって、vueのコンポーネントの対応ページをレンダーさせる。

コントローラからのvueのページのファイルの指定は、

resources/js/Pagesココガルートになる。

よって`Index/index.php`の場合には `Index/index`

と指定する。

```PHP
class IndexController extends Controller
{
  public function index()
  {
    return inertia('Index/index',
      [
        'message' => 'Hello from Inertia methods',
      ]
    );
  }
}
```

## データの渡し方

inertia()メソッドの第二引数として、連想配列の形でデータを渡す。

第二引数のkeyにはLowerCamelケースを使用すること

すると、フロント側では、**attrs**の中身として、指定したプロパティが確認できる。

### `defineProps`

vueのこちらのメソっドを使うことで、コンポーネントで扱うpropsを定義できる。

```PHP
defineProps({
  listings: Array,
})

//listingsの配列をpropsとして使用する。という宣言
```

## Routingについて

# inertiaを使う

scriptタグの中で、importを行なって

### Linkタグ

link用の(aコンポーネント的に使用できる。)

hrefとかいてもいいし、:hrefともかけるらしい。

hrefには、Laravelのroutingを利用する。

```JavaScript
<template>
  <div>Index</div>
  <Link href="/hello"></Link>
</template>

<script setup>
  import { Link } from "@inertiajs/inertia-vue3"
</script>
```

inertia()をつかって、Laravelコントローラから、vueに対してデータを渡すことができる。

HTTPmethodを変えたい時には、

method=’post’などのように、普通のformエレメントと同様にして扱うことができる。

### as属性を使用する

`as=”button”`とするとリンクを持ったbutton要素としてhtmlにレンダーしてくれる。

```PHP
<Link :href="`/listing/${listing.id}`" method="delete" as="button">delete</Link>
```

## ユーザの入力をlaravel側に送信する。

onSubmitの代わりに@submitを使える。

@submit.prevent →

<form onSubmit={/_ここ_/}>ここで発火するイベントハンドラーに対して、

const theEvent = (e) => {  
e.preventDeafult();  
};

vue3(pure)だと、`reactive()`を使うところを、`useForm(Inertia)`を使用することで、フォーム専用のオブジェクトの送信がしやすくなる。

```JavaScript
<template>
  <form @submit.prevent="create">
    <div>
      <div>
        <label>Beds</label>
        <input v-model.number="form.beds" type="text" />
      </div>

      <div>
        <label>Baths</label>
        <input v-model.number="form.baths" type="text" />
      </div>

      <div>
        <label>Area</label>
        <input v-model.number="form.area" type="text" />
      </div>

      <div>
        <label>City</label>
        <input v-model="form.city" type="text" />
      </div>

      <div>
        <label>Post Code</label>
        <input v-model="form.code" type="text" />
      </div>

      <div>
        <label>Street</label>
        <input v-model="form.street" type="text" />
      </div>

      <div>
        <label>Street Nr</label>
        <input v-model.number="form.street_nr" type="text" />
      </div>

      <div>
        <label>Price</label>
        <input v-model.number="form.price" type="text" />
      </div>

      <div>
        <button type="submit">Create</button>
      </div>
    </div>
  </form>
</template>


<script setup>
import { useForm } from '@inertiajs/vue3'
const form = useForm({
  beds: 0,
  baths: 0,
  area: 0,
  city: null,
  street: null,
  code: null,
  street_nr: null,
  price: 0,
});

const create = () => form.post('/listing')
</script>

<style scoped>
label {
  margin-right: 2em;
}

div {
  padding: 2px
}
</style>
```

# Inertia Middleware

```Bash
$ php artisan inertia:middleware
```

このスクリプトコマンドでinertiaリクエストのまつわるmiddlewareクラスを生成できます。

```Bash
protected $middlewareGroups = [
        'web' => [
            \App\Http\Middleware\EncryptCookies::class,
            \Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse::class,
            \Illuminate\Session\Middleware\StartSession::class,
            \Illuminate\View\Middleware\ShareErrorsFromSession::class,
            \App\Http\Middleware\VerifyCsrfToken::class,
            \Illuminate\Routing\Middleware\SubstituteBindings::class,
            \App\Http\Middleware\HandleInertiaRequests::class,
        ],

        'api' => [
            // \Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful::class,
            \Illuminate\Routing\Middleware\ThrottleRequests::class.':api',
            \Illuminate\Routing\Middleware\SubstituteBindings::class,
        ],
    ];
```

あとは、`app/Http/Middleware/HandleInertiaRequests.php`

で設定をすることで、全てのpagesに対して規定値として、parameterをディストリビュートすることができる。

```Bash
/**
     * Defines the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function share(Request $request): array
    {
        return array_merge(parent::share($request), [
            'flash' => [
                'success' => $request->session()->get('success')
                ]
        ]);
    }
}
```

## inertia(フロント側でキャッチする方法)

`usePage`メソッドを使用する

```JavaScript
<div v-if="flashSuccess" class="success">
    {{ flashSuccess }}
</div>

<script setup>
const flashSuccess = computed(
  () => usePage().props.flash.success, 
)
</script>
```

## `vendor/inertiajs/inertia-laravel/src/Middleware.php`

の中で,shareされるプロパティが設定されていて、

inertia(vue)側では、form.errorsのキーでエラーの値を取得することができる。

```JavaScript
// e.g.)
<form @submit.prevent="create">
    <div>
      <div>
        <label>Beds</label>
        <input v-model.number="form.beds" type="text" />
        <div v-if="form.errors.beds">
          {{ form.errors.beds }}
        </div>
      </div>
```

useFormの実装(編集画面編)

## inertiaを使う場合にのxsrf対策について

axiosがデフォルトで入っています。

Laravelはデフォルトで、`XSRF-TOKEN` Cookieが埋め込まれています。

`X-XSRF-TOKEN`