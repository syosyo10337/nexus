---
tags:
  - php
  - laravel
  - syntax
created: 2026-01-03
status: active
---

# phpUnit

[https://docs.phpunit.de/en/10.0/](https://docs.phpunit.de/en/10.0/)

デフォルトでは、アプリケーションの`tests`ディレクトリには、`Feature`と`Unit`の２つのディレクトリを用意しています。単体テストは、コードの非常に小さな孤立した部分に焦点を当てたテストです。実際、ほとんどの単体テストはおそらく単一のメソッドに焦点を合わせています。「ユニット」テストディレクトリ内のテストはLaravelアプリケーションを起動しないため、アプリケーションのデータベースやその他のフレームワークサービスにアクセスできません。

実行コマンド

```JavaScript
$ .vendor/bin/phpunit
```

# テストの作成

1. The tests for a class `Class` go into a class `ClassTest`.

2. `ClassTest` inherits (most of the time) from `PHPUnit\Framework\TestCase`.

3. The tests are public methods that are named `test*`.

`**validator**`関数は、第1引数にバリデーション対象のデータを、第2引数にバリデーションルールを渡して、バリデータークラスのインスタンスを返します。

この関数は、Laravelのグローバルヘルパー関数の1つであり、ビルトインバリデーション機能を使いやすくするためのものです。

> The `**validator()**` function returns an instance of the `**Illuminate\Validation\Validator**` class, allowing you to run validation checks on the given data and retrieve error messages if the validation fails.

Here's how to use the `**validator()**` function:

`**validationProvider**`  
は、PHPUnitのデータプロバイダー機能を使用して、複数のテストケースを定義するためのメソッ

()

`Illuminate\Foundation\Testing\RefreshDatabase`トレイトは、スキーマが最新であれば、データベースをマイグレートしません。その代わりに、データベーストランザクション内でテストを実行するだけです。したがって、このトレイトを使用しないテストケースによってデータベースに追加されたレコードは、まだデータベースに残っている可能性があります。