---
tags:
  - scala
  - evaluation
  - parameters
created: 2026-02-12
updated_at: 2026-02-12
status: draft
---

# 名前渡しパラメータ（by-name parameter）

少し寄り道をして、名前渡しパラメータ（by-name parameter）というScalaの機能を紹介します。Try型の実装などで使われる機能だからです。

## 先行評価（eager evaluation / strict evaluation）

Scalaにおいては、メソッド実行前にまず引数が評価され、次いでメソッド本体のコードが実行されます。次の例からも分かります。

```scala
def f(x: Any): Unit = println("f")
def g(): Unit = println("g")

f(g())
// g
// f
```

この評価順序は先行評価（eager evaluation）、または正格評価（strict evaluation）と呼ばれます。多くのプログラミング言語で採用されている通常の挙動です。

## 名前渡しパラメータの動作

名前渡しパラメータを使うと、引数の式の評価を**実際に使用される箇所まで遅延**できます。メソッド本体でその値が使われるタイミングで引数の式が評価されます。

```scala
def g(): Unit = println("g")

def f(g: => Unit): Unit = {
  println("prologue f")
  g
  println("epilogue f")
}

f(g())
// prologue f
// g
// epilogue f
```

`g: => Unit` が名前渡しパラメータです。`g` が使われるたびに引数式が評価されます。

## 名前付き引数との違い

名前渡しパラメータは**評価タイミングを遅らせる**仕組みです。一方、名前付き引数（named arguments）は**引数の順序に依存せずに呼び出し側で名前を指定する**ための機能で、評価タイミングとは無関係です。

```scala
def add(x: Int, y: Int): Int = x + y

add(y = 2, x = 1) // 名前付き引数
```

名前渡しパラメータは `=>` が付く点で、役割も用途も別物です。
