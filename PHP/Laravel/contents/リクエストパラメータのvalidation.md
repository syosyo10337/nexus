 

# リクエストパラメータのvalidation

一番基本的な実装方法

1. **$requestプロパティに対してvalidateメソッドを使用する。**

```JavaScript
public function store(Request $request)
    {
        Listing::create($request->validate([
                'beds' => 'required|integer|min:0|max:20'
        ]));

        return redirect()->route('listing.index')
            ->with('success', 'Listing was created!');
    }
```

- 伝統的なHTTPリクエスト処理中にバリデーションが失敗した場合、直前のURLへのリダイレクトレスポンスが生成されます。

- 受信リクエストがXHRリクエストの場合、バリデーションエラーメッセージを含むJSONレスポンスが返されます。

2. ….

## validationルールの一覧

ルールの指定は、`|`区切りによる文字列もしくは, 配列の要素として設定することができます。

```JavaScript
$validatedData = $request->validate([
    'title' => ['required', 'unique:posts', 'max:255'],
    'body' => ['required'],
]);
```

[

Laravel - The PHP Framework For Web Artisans

Laravel is a PHP web application framework with expressive, elegant syntax. We’ve already laid the foundation — freeing you to create without sweating the small things.

![](PHP/Laravel/contents/Attachments/apple-touch-icon%202.png)https://laravel.com/docs/9.x/validation#available-validation-rules

![](PHP/Laravel/contents/Attachments/og-image.jpeg)](https://laravel.com/docs/9.x/validation#available-validation-rules)

- unique  
    unique:<table>のかたちを取り、指定したテーブルを参照しながら、うけとったパラメータがユニークであるかと確かめる。

- confirmed  
    パスワードのようなpassword,password_confirmationが一致することをもとめるような場合には、このキーワードを使うことができる。

```PHP
public function store(Request $request)
    {
        $request->validate([
            'name' => 'required',
            'email' => 'required|email|unique:users',
            'password' => 'required|min:8|confirmed',
        ]);
    }
```