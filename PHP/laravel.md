<?php

# artisanコマンド集

```
//  routingを表示
$ php artisan route:list

// debugコンソールを起動する
$ php artisan tinker

// サーバの起動
$ php artisan serve

// DBの情報を表示する
$ php artisan db:show

// modelの作成
$ php artisan make:model
// migrationつきで
$ php artisan make:model -m

//migrate UP
$ php artisan migarte

// 個別のmigrationファイルの作成(自動推測付き)
$ php artisan make:migration <migration_file_name> 

// migrationの状態を確認する
$ php artisan migrate:status
// migrationを1から再度実行する
$ php artisan migrate:refresh
// (factoryによるseedingがある場合には、そちらも再実行される)
$ php artisan migrate:refresh --seed

// seeding
＄ php artisan db:seed

// Factoryの作成
$ php artisan make:factory ListingFactory










# Laravel Debug & IDE Helper
- debug用のbarを開発環境(dev)に表示させるためのライブラリ
cf.)
https://github.com/barryvdh/laravel-debugbar

- laravelのIDEヘルパー
https://github.com/barryvdh/laravel-ide-helper




## .envファイルとenv()メソッドの使い方
env()の第一引数に取られた値を環境変数もしくは、.envファイルを探して、参照する。




# Model
Eloquentで表現されています。RailsでいうところのActive Record


### テーブル名を設定する方法
```
1. マイグレーションのupメソッドで作成する
// snake_caseでcreateメソッドの第一引数として
public function up(): void
{
	Schema::create('listings', function (Blueprint $table) {
		$table->id();
		$table->timestamps();
	});
}

2. $table変数に対して渡す
protected $table = "new_table_name";

```



- migrationファイルはup/downメソッドの組み合わせで作成されます。
e.g.)





##// 個別のmigrationファイルの作成
$ php artisan make:migration <migration_file_name>
- laravelによって既存のファイルか新ファイルのかと推測し、ある程度ファイルのテンプレートを整形してくれる。
e.g.)//listingテーブルだと断定してくれる
$ php artisan make:migration add_fields_to_listing_table



- テーブルの型


```
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
	/**
	 * Run the migrations.
	 */
	public function up(): void
	{
		Schema::table('listings', function (Blueprint $table) {
			$table->unsignedTinyInteger('beds');
			$table->unsignedTinyInteger('baths');
			$table->unsignedTinyInteger('area');
			
			$table->tinyText('city');
			$table->tinyText('code');
			$table->tinyText('street');
			$table->tinyText('street_nr');
			
			$table->unsignedTinyInteger('price');
		});
	}
	
	/**
	 * Reverse the migrations.
	 */
	public function down(): void
	{
		// Schema::table('listings', function (Blueprint $table) {
		//     $table->dropColumn()
		// });
		Schema::dropColumns('listings', [
		'beds', 'baths', 'area', 'city', 'code', 'street', 'streed_nr', 'price'
		]);
	}
};

```
$table->tinyText('<column_name>')のようなかたちで, 型とカラム名を指定する

ドロップの仕方も
$table->dropColumn('<column_name>')もしくは
Schema::dropColumnsの第二引数に削除したいカラム名を列挙する
Schema::dropColumns('listings', [


# Factoryデータをseedする
```
$ php artisan make:factory ListingFactory
```


definition()メソッドが自動で整備されている。
楽ちんにテスト環境のデータを配備する
```
class ListingFactory extends Factory
{
	/**
	 * Define the model's default state.
	 *
	 * @return array<string, mixed>
	 */
	public function definition(): array
	{
		return [
		'beds' => fake()->numberBetween(1,7),
		'baths' => fake()->numberBetween(1,7),
		'area' => fake()->numberBetween(30,400),
		'city' => fake()->city(),
		'code' => fake()->postcode(),
		'street' => fake()->streetName(),
		'street_nr' => fake()->numberBetween(10, 200),
		'price' => fake()->numberBetween(50_000, 2_000_000),
		];
	}
}
```


//<Model名>Factoryの形でファクトリーファイルを生成すると、Laravelで勝手にmodelと結びつけてくれる。
もしもない場合には、以下のように手動で追加しましょう


```
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Listing extends Model
{
	use HasFactory;
}
```



このようにして指定されたmodelクラスは::factoryメソッドを使用することができる。
e.g.)
```
\App\Models\Listing::factory(20)->create();
// create()の引数に特定のkey => valueを渡して、上書きすることもできる
```








-----------------------------------------

# Eloquent入門
Modelクラスのインスタンスが返ってくる

### Model::all();
->Illuminate\Database\Eloquent\Collection

// id 指定する
### Model::find();
->Modelのインスタンス

# クエリビルダー
//クエリビルダーを使ってクエリを生成->get()でコレクションを取得
この時get()でクエリを発行しなければ、それは、Eloquent\Builderのインスタンス
(Listing::where('beds', ">", 4)->get());

//whereでアンド条件を追加する例
dd(Listing::where('beds', ">", 4)->where('area','>', 200)->get());

//取得順を制御する()
orderBy('beds', 'desc')

//最初の結果だけを取得する(クエリの最後に使うこともできる)
Model::first();

e.g.)
Listing::where('beds', '>=', 4)->orderBy()->first();




## Update操作をする
Eloquent\Modelでは、インタンスが、テーブルのカラム名に相当するメソッドを持つ
e.g.)
```
// idが15のレコードをインスタンス化する
$listing = Listing::find(1);

$listing->city  //-> そのカラムの値(attributeとして扱える。)
//or
$listing->city = 'changing';
$listing->save(); //DBに反映される

```

//DBに永続化する
Model->save();


//update()メソッドで一発で更新する






## Create操作
$listing = new Model //->そのモデルクラスのインスタンス
$listing->save();

//インスタンスの作成と保存を一度に行う
Model->create();
$flight = Flight::create([
'name' => 'London to Paris',
]);




///Mass Assignmentの脆弱性への対処
Railsでは、strong parameterを使用して対処していたが、
Laravelではデフォルトでマスアサイメントが禁止されている。
そのため、create()等を使用する場合には, fillableもしくはguardedプロパティを宣言する必要があります。
もし、複数の属性を一括で更新等したい場合には、fillableプロパティに値を設定する必要があります。(array)

### Mass Assignmentの脆弱性について
単純な話、ユーザからのリクエストで渡されるパラメータ(フィールド)を受け取る仕様であれば、DBテーブル内での管理者かどうかのフラグを変更させるクエリもユーザが作成できることになってしまうから








# リソースコントローラ(ルーティングは追加されてないよー)
Railsとの違いは、
new -> create
create -> store

Verb	URI	Action	Route Name
GET	/photos	index	photos.index
GET	/photos/create	create	photos.create
POST	/photos	store	photos.store
GET	/photos/{photo}	show	photos.show
GET	/photos/{photo}/edit	edit	photos.edit
PUT/PATCH	/photos/{photo}	update	photos.update
DELETE	/photos/{photo}	destroy	photos.destroy

```
$ php artisan make:controller  --resource ListingController
```


## route parameterを使う
e.g.)
// controllerで
public function show(string $id)
{
	return inertia(
		'Listing/show',
		[
			'listing' => Listing::find($id);
		]
	);
}


## route model bindigを使う
ルーティングでもらったパラメータからModelをbindすることができるらしい。
この時アクションとなるメソッドのtype-hintとしてモデルをバインディングすることができる。
e.g.)先ほどの例を書き換えると
public function show(Listing $listing)
{
	return inertia(
	'Listing/show',
	[
		'listing' => $listing
	]
	);
}




# soft delete(論理削除)
実際の値を削除してしまうのではなく、ないものとして扱うようにする。
`modelInstance->delete();`

public function destroy(Listing $listing)
{
	$listing->delete();
	return redirect()->back()
	->with('success', 'Listing was deleted!');
}



## 




ziggyのインストール

1.bashで
```
composer require tightenco/ziggy
```


2. vite.config.jsでjsファイルをvendorから読み込めるようにする。?
```

export default defineConfig({
	plugins: [
	laravel({
		input: ["resources/css/app.css", "resources/js/app.js"],
		refresh: true,
	}),
	vue({
		template: {
			base: null,
			includeAbsolutePaths: false,
		},
	}),
	],
	resolve: {
		alias: {
			ziggy: path.resolve('vendor/tightenco/ziggy/dist/vue.es.js')
		}
	}
});
```

3. app.blade.phpにて

```
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">

<title>Laraveliow</title>
@routes
@vite('resources/js/app.js')
@inertiaHead
</head>
```

4. app.jsにて
```
createInertiaApp({
	resolve: async (name) => {
		const pages = import.meta.glob('./Pages/**/*.vue', { eager: true })
		const page  = await pages[`./Pages/${name}.vue`]
		page.default.layout = page.default.layout || MainLayout
		
		return page
	},
	setup({ el, App, props, plugin }) {
		createApp({ render: () => h(App, props) })
		.use(plugin)
		.use(ZiggyVue)
		.mount(el)
	},
})

```

ziggyこのライブラリを使用すると、route('named_route')がvueのhref=''の中で使用することができます。







# basic Authentication
cf. Notion


内容がまとまりきっていないので、こちらに殴り書いてのちにまとめていく。
- Controllerアクションの引数として受け取った、$requestに対してvalidate()をメソッドチェーンすることで、
validationがかけられる。このときの戻り値は検証した値になりますので、そのまま、authenticationをかけることもできます。

**この時に、attemptメソッドは、ユーザからの入力値であろう、passwordに対しては、自動的にハッシュ化を施し、DBのテーブルの値を照合します。そのため、DBに保存されている値はハッシュ値なので、直接当てにしないでください。
```
Auth::attempt($request->validate([
'email' => 'require|string|email',
'password' => 'require|string',
]));
```

* Defaultは24minのセッションがあります。attemptメソッドにはremeberという第二引数を取ることができ、
その場合に、remember_meの機能をオンにすることができます。
```
Auth::attempt($request->validate([
'email' => 'require|string|email',
'password' => 'require|string',
]), true);
```


## 認証に失敗した時
```
public function store(Request $request)
{
	$is_authenticated = Auth::attempt($request->validate([
	'email' => 'require|string|email',
	'password' => 'require|string',
	]),true);
	
	if(!$is_authenticated) {
		throw ValidationException::withMessages([
		'email' => 'Authentication failed'
		]);
	}
	
	$request->session()->regenerate();
	return redirect()->intended();
}
```
以上のような場合だと、
throw ValidationException::withMessagesを用いて、エラーを出しながら、ユーザに返すエラーメッセージを選ぶこともできます。


## セッション固定攻撃の対策。(Session Fixation)
```
$request->session()->regenerate();
```
の部分で、セッションを再度生成しています。
1. サーバから渡されたセッションIDをそのまま、ユーザが利用する形式だと、attackerが作成したセッションIDを強制された人が、attackerによって作成されたセッションIDで一度ログインした後に、attackerもその人の利用しているセッションIDを知っているのでセッションをハイジャックされてしまいます。
つまり、ログインが実行された時点で、改めてセッションIDを発行する。
cf. )
https://www.ubsecure.jp/blog/session_fixation


## ユーザフレンドリーなリダイレクト
ログインが必要なページにログインしていない状態でアクセスしようとしてユーザに対して、ログイン処理後に元々アクセスしようとしていたページにリダイレクトすること。
Laravelでは以下のように実装する。
```
return redirect()->intended();
```
該当のURLが存在しない場合には、デフォルトのリダイレクト先に遷移します。



## ログイン中のユーザインスタンスを取得する。
デフォルトでは、userモデルを探しにいくので、違う場合には自身で、設定する必要があります
```
use Illuminate\Support\Facades;

Auth::user();



# current_userを取得する。
前述のように、取得することもできるし
もしRequestをうけとっている場合には、
```
$request->user()

```
とすることもできる。
```
e.g.)
/**
	 * Store a newly created resource in storage.
	 */
public function store(Request $request)
{
	$request->user()->listings()->create(
	$request->validate([
	'beds' => 'required|integer|min:0|max:20',
	'baths' => 'required|integer|min:0|max:20',
	'area' => 'required|integer|min:15|max:1500',
	'city' => 'required',
	'code' => 'required',
	'street' => 'required',
	'street_nr' => 'required|integer|min:1|max:1000',
	'price' => 'required|integer|min:1|max:2000000',
	]));
	
	return redirect()->route('listing.index')
	->with('success', 'Listing was created!');
}
```
これを活用することで、listingのsaveを完結に書くことができる。

- usePageってなんぞ？


## ユーザをログアウトさせる。
```

public function destroy(Request $request)
{
	//appでのユーザのセッションを無効にする。次のrequestからログインしていない状態で処理される。
	Auth::logout();
	
	// sessionを無効にして、セッションIDを再生成する。
	$request->session()->invalidate();
	// CRSFトークンを再生成する。
	$request->session()->regenerateToken();
	
	// route('リダイレクト先’)で指定する。 
	return redirect()->route('listing.index');
}
```


#CSRFについて
Cross Site Request Forgery
forgeryは偽造の意味。
```
<form action="https://your-application.com/user/email" method="POST">
<input type="email" value="malicious-email@example.com">
</form>

<script>
document.forms[0].submit();
</script>
```

以上のようにして悪意を持った攻撃者が、あなたのアプリのformに対して不正なemailを埋め込んで、ユーザにフォームを送信させる可能性があります。
この時、ユーザの意図しないemailがリクエストとして送信されるので、そのemailなどをつかって悪意を持った攻撃者があなたのアプリになりすますことができます。

以下具体例。
1. ソーシャルメディアサイトでの攻撃:
Aliceがソーシャルメディアサイトにログインしていて、その間に悪意のあるWebサイトにアクセスします。この悪意のあるWebサイトには、Aliceのソーシャルメディアプロフィールを更新するためのリンクが含まれています。このリンクは、アクセスすると、Aliceのプロフィールの情報を変更するリクエストをソーシャルメディアサイトに送信します。

このソーシャルメディアサイトがCSRFトークンを使用していない場合、Aliceがそのリンクをクリックすると、Aliceのアカウントでプロフィール情報が変更されるリクエストが送信されます。これは、サーバーがリクエスト元を検証していないためです。

2. 
銀行サイトでの攻撃:
Bobはオンラインバンキングにログインし、その間に悪意のあるWebサイトを訪れます。悪意のあるWebサイトには、隠れたフォームがあり、Bobの銀行口座から攻撃者の口座への送金リクエストが自動的に送信されます。

銀行サイトがCSRFトークンを使用していない場合、この悪意のあるフォームから送信されたリクエストが処理され、Bobの口座から攻撃者の口座への送金が行われます。



### 特定のページをCRSFプロテクションから避ける方法
app/Http/Middleware/VerifyCsrfToken.phpにて
$expectの配列に対して、特定のパスを登録する。

Anytime you define a "POST", "PUT", "PATCH", or "DELETE" HTML form in your application, you should include a hidden CSRF _token field in the form so that the CSRF protection middleware can validate the request.
For convenience, you may use the @csrf Blade directive to generate the hidden token input field:
csrfトークンを持たずにリクエストを受けても、容認したいパスについては,

app/Http/Middleware/VerifyCsrfToken.phpの$exceptに書く。
ただし、原則としては、web.phpのauthグループの外におくべきではある。


## inertiaを使う場合にのxsrf対策について
cf .Notion



# 認証済みのみアクセスできるページを作成する。
Railsの場合には、Controllerのbefore_filterを用いて対応した。

Laravelの場合には
```
Route::get('/hello', [IndexController::class, 'show'])
->name('test')
->middleware('auth');

```

以上のように、middleware('auth')をメソッドチェーンすることで、Controllerのactionに渡る前に、middlewareメソッドによって、認証済みかを検証してくれる。

実際に引数にとっている値は、app/Http/Kernel.phpによって、エイリアスが登録されたクラスが実態である。

```
/**
* The application's middleware aliases.
*
* Aliases may be used to conveniently assign middleware to routes and groups.
*
* @var array<string, class-string|string>
*/

protected $middlewareAliases = [
'auth' => \App\Http\Middleware\Authenticate:: class,
'auth.basic' => \Illuminate\Auth\Middleware\AuthenticateWithBasicAuth::class,
'auth.session' => \Illuminate\Session\Middleware\AuthenticateSession::class,
'cache.headers' => \Illuminate\Http\Middleware\SetCacheHeaders::class,
'can' => \Illuminate\Auth\Middleware\Authorize::class,
'guest' => \App\Http\Middleware\RedirectIfAuthenticated::class,
'password.confirm' => \Illuminate\Auth\Middleware\RequirePassword::class,
'signed' => \App\Http\Middleware\ValidateSignature::class,
'throttle' => \Illuminate\Routing\Middleware\ThrottleRequests::class,
'verified' => \Illuminate\Auth\Middleware\EnsureEmailIsVerified::class,
];
}
```

## 特定のresourceルーテイングのみをauthenticationする。
```
Route::resource('listing', ListingController::class)
->only(['create', 'store', 'edit', 'update', 'destroy'])
->middleware('auth');
Route::resource('listing', ListingController::class)
->except(['create', 'store', 'edit', 'update', 'destroy']);
```


## また同様の実装の仕方に、Controllerのコンストラクタでauthenticationする方法も存在する。
```
public function __constuct()
{
	$this->middleware('auth')->except(['index', 'show']);
}


## リダイレクト先を変えるためには、
app/Http/Middleware/Authenticate.phpのredirectToメソッドを編集する。

## Auth::check()
現在ユーザがログインしているかどうかを判断する。




## ユーザの登録。
$requestのvalidateメソッドは、パラメータを検証して、パラメータを返すので、

こんな感じ。 
```
public function store(Request $request)
{
	$user = User::make($request->validate([
	'name' => 'required',
	'email' => 'required|email|unique:users',
	'password' => 'required|min:8|confirmed',
	]));
	$user->password = Hash::make($user->password);
	$user->save();
	Auth::login($user);
	
	return redirect()->route('listing.index')
	->with('success', 'Acctount Created!');
}
```

## createの代わりに、makeを使う。
ただ、オブジェクトを生成するにとどめる。
そして、永続化する前にpasswordをHashかする



## 毎回Hash化したいものがある時。(password);

# AccessorsとMutatorを使う。
これらは、modelに書くことが一般的?で、関数の形を取る。命名はモデルの属性の名前のcameCaseと一致するべき。
このメソッドは、モデルの属性値にアクセスしようとする際に毎度呼び出される。


引数はget, setでそれぞれにコールバックの関数を取ることができる。
属性の値を取得するときには、getのコールバックの値をreturnし、属性の値を永続化するときには、setのコールバックの処理された値をreturnする。


つまり、関数が呼ばれたときに、getの引数の処理を値に対して行い、setの処理を行うと言うもの。
戻り値は必ず`Illuminate\Database\Eloquent\Casts\Attribute`と宣言されている必要があります。
| All attribute accessor / mutator methods must declare a return type-hint of Illuminate\Database\Eloquent\Casts\Attribute:


Railsで言うところの、before_filter的な、、scope的な感じだね。


https://laravel.com/docs/10.x/eloquent-mutators#accessors-and-mutators

```
//カラム名をcamelCaseで呼び出す。
protected function password(): Attribute
{
	return Attribute::make(
		get: fn ($value) => $value,
		set: fn ($value) => Hash::make($value),
	);
}
```
// これはPHP8で名前付き引数と、fn($value) => $valueのアロー関数が用いられている。
また、このようなものを、メソッドとしてではなく、プロパティとして呼び出すことができる。



# Hash化について
1. plain textに対して、ランダムに作成された文字列'salt'を付け加えます。
2. 1.のテキストをBcryptをつかってハッシュ化します。
3. 2.に対して'salt'を付け加えます。

3がhashed password

 


## relationships

外部keyを持つ方 'belongs to' じゃない方の関係が成り立つ。
comment がpost_idをカラムに持つとき、commentは従属している。

基本的な書き方

モデルクラスインスタンスがデフォルトで持つ値を扱う。



```
class Listing
{
	public function owner(): BelongsTo
	{
		return $this->belongsTo(User::class, 'user_id');
	}
}

```
Userモデルのidのうちに、今回のListingモデルのuser_idのカラムの値と一致するものがあるのかを確かめる。
つまり、第二引数には,呼び出しているモデルに対応するDBのカラム名を明示的に指定できる。


```
class User
{
	public function listings(): HasMany
	{
		return $this->hasMany(Listing::class, 'user_id');
	}
}

```
第一引数に多くを持つモデルを指定し、その相手方となるモデルのカラム名を第二引数で明示的に指定することができる。




# マイグレーションファイルとリレーション。
foreignId()メソッドの引数を取ると、そのカラムを作成します。また、constrainedメソッドの引数を使うことで、外部key制約を設定するカラムまで指定することができます。


foreignIdメソッドはUNSIGNED BIGINTカラムを作成し、constrainedメソッドは規約を使用して参照されるテーブルとカラムの名前を決定します。
テーブル名がLaravelの規則と一致しない場合は、引数としてconstrainedメソッドに渡すことでテーブル名を指定できます。
{
	/**
	 * Run the migrations.
	 */
	public function up(): void
	{
		Schema::table('listings', function (Blueprint $table) {
			$table->foreignId('user_id')->constrained('users');
		});
	}



以上のようにすることで、postsテーブルに対して外部key user_Idを追加して、
usersテーブルを親テーブルとする外部key制約を追加することができる。


}


# routeファイルを追加する。
web.phpはデフォルトでルートが格納されるが、別ファイル名をつけて、ルート定義したいときには、
`app/laravel/app/Providers/RouteServiceProvider.php`



## 基本的なリレーションの扱い方
```
$user->posts()->save($post);
// ()忘れないで。プロパティとして呼ぶときには、()入らないが、そうじゃないときには、メソッドとして呼ぶこと。
$postが保存される$userと紐づいた状態で。
```
saveMany()によって複数のhasMany relationのもでるを保存することもできる。





```
$user->posts()->create([...]);
はPost::create()のように動作する。が同時に$userとのリレーション作成される。
```


createMany([[],[]])
こちらもsaveMany同様に複数の関係モデルを永続化することができる。


### 既存のものにリレーションをつける。

$post->user()->associate($user);
リレーションを削除する。

$post->user()->dissociate()

その後、$post->save()が必須です。

```
// postに対して異なるuserを結びつける。
$post->user()->associate($usr2);


$post->user_id = 1も動作するよ。


# Model Policy(認可(authorizationの設定ができる))
ってなに?

以下のコマンドで慣習的にlaravelが紐付けてくれるポリシーを作成することができる。
```
$ php artisan make:policy ModelNamePolicy --model=ModelName
```
Policy/<Model>Policyの形で書くことができる。
もしも、policyの名前が, `<モデル名>Policy`の形でない場合には、自身でAuthServiceProvider.php の＄policyプロパティを自身で設定する必要がある。


cf. )
https://laravel.com/docs/10.x/authorization#authorizing-resource-controllers

次のリソースフルなコントローラはそれに対応するpolicy methodがあります。
リクエストがルーティングされるときに、ポリシーメソッドはその手間で実行されます。
| The following controller methods will be mapped to their corresponding policy method. When requests are routed to the given controller method, the corresponding policy method will automatically be invoked before the controller method is executed:


## Controllerでpolicyメソッドを呼ぶ方法
canメソッドは、そのユーザがlistingのshowつまり詳細ページを見ることができるのかを返す。(cannnotだとできないときにtrueが返る？)
canメソッドを使用して特定のモデルのポリシーアクションを明示的に呼び出す。(e.g. 今回は'view') 
```

public function show(Listing $listing)
{
	Auth::user()->can('view', $listing);
	return inertia(
	'Listing/Show',
	[
	'listing' => $listing
	]
	);

}
```
authorizeメソッドを使うと、1st argのアクションが2nd argのモデルにおいてcanなのかをチェックして、falseの場合には403エラーをとばす。
```        
if(Auth::user()->cannot('view', $listing)) {
	abort(403);
}
$this->authorize('view', $listing);


/**
	 * Show the form for creating a new resource.
	 */
public function create()
{
	$this->authorize('create', Listing::class);
	return inertia('Listing/Create');
}


###もし、authorizeポリシーを適用したいコントローラがresouce準拠である時に
(simplest)
class ListingController extends Controller
{
	public function __construct()
	{
		$this->authorizeResource(Listing::class, 'listing');
	}
	
}

コンストラクタの中で、autrorizeResource(<該当のクラス名>, <今回使用するparameter>)
requestパラメータを第二引数に取る。
| the name of the route / request parameter that will contain the model's ID as its second argument