---
tags:
  - scala
  - types
created: 2026-02-12
status: active
---

# Unit 型

`Unit` は「意味のある値を返さない」ことを表す型です。唯一の値は `()` で、Java の `void` に近い役割を持ちます。ただし `Unit` は型として値を持つため、式として扱えます。

```scala
def log(msg: String): Unit = {
  println(msg)
}

val result: Unit = log("hello")
// result は ()
```

`Unit` は副作用を起こす処理（出力、状態更新など）の戻り値として使われることが多いです。
