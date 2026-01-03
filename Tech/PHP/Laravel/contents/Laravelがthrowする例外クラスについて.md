---
tags:
  - php
  - laravel
  - syntax
created: 2026-01-03
status: active
---

# Laravelがthrowする例外クラスについて.

cf. )

https://github.com/ZERO-TO-ONE-TEAM/upg-service/pull/1093

# ****TL;DR****

Laravel側でthrowされるエラーは基本的には

`**Symfony\Component\HttpKernel\Exception\HttpException**`

なので、もし仮にエラーがスロされたときに、特定のviewにroutingする処理を入れたい場合には、

`app/laravel/app/Exceptions/Handler.php`

のrender methodにて

```Bash
if ($request->is("uppit*")) {
	$error_code = match($exception::class) {
	    NotFoundHttpException::class => 404,
	    HttpException::class => $exception->getStatusCode(),
	    default => 500,
	};

	return response()->view(
		'uppit.views.errors.'.$error_code,
		['error_code' => $error_code],
		$error_code
	);
}
```

以上のような設定をすると良い。