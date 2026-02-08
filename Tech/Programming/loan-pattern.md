---
tags:
  - programming
  - resource-management
  - loan-pattern
created: 2026-02-08
updated_at: 2026-02-08
status: active
---

# Loan パターン

Loanパターンは、リソースの取得と解放を高階関数で囲み、利用側が「使う処理」だけを書けるようにするイディオムです。
例外が発生しても必ず後処理が実行されるため、`close` の呼び忘れを防げます。

## 目的

- リソース管理の責務を1か所にまとめる
- 例外が発生しても解放処理を保証する
- 呼び出し側のコードを簡潔にする

## 典型的な形

```js
using(resource) { r =>
  // リソースを使う処理
}
```

内部では `try` / `finally` で解放処理を保証します。

## Scalaでの例

```scala
import scala.io.Source

def using[A <: { def close(): Unit }, B](resource: A)(f: A => B): B = {
  try {
    f(resource)
  } finally {
    resource.close()
  }
}

val firstLine = using(Source.fromFile("data.txt")) { src =>
  src.getLines().take(1).mkString
}
```

## 関連リンク

- [function](../Scala/function.md) - Scalaの関数と高階関数
