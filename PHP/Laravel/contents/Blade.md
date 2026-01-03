---
tags:
  - php
  - laravel
  - syntax
created: 2026-01-03
status: draft
---

# Blade

### ディレクティブ

構文のようなもの、テンプレートに組み込むことができる。

カスタムで作成することもできる。

# CSRF対策

- Bladeを単に使用している場合には、@csrfがおすすめ。

- csrf_token()によって、発行されるトークンの値をinputに仕込む方法も使えます。

```PHP
<form method="POST" action="/profile">
    @csrf
 
    <!-- Equivalent to... -->
    <input type="hidden" name="_token" value="{{ csrf_token() }}" />
</form>
```