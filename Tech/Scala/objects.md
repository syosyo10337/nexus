---
tags:
  - scala
  - oop
  - object
created: 2026-02-05
updated_at: 2026-02-09
status: active
---

# オブジェクト

Scala では、全ての値がオブジェクトです。また、全てのメソッドは何らかのオブジェクトに所属しています。そのため、Java のようにクラスに属する `static` フィールドや `static` メソッドはありません。

代わりに `object` キーワードでシングルトンを定義し、その中にメソッドやフィールドを置きます。

## object 構文

用途は大きく 2 つです。

- ユーティリティメソッドやグローバル状態の置き場所（Java の `static` 相当）
- 同名クラスのファクトリメソッド

```scala
object <object名> extends <class名> (with <trait名>) {
  def ファクトリメソッド名(引数): クラス名.オブジェクト名 = new クラス名.オブジェクト名(引数)
}
```

[`Predef` という object](https://github.com/scala/scala3/blob/3.8.1/library/src/scala/Predef.scala) が build-in で定義・インポートされており、`println()` などが利用できます。

## apply によるファクトリ

`apply` は Scala 処理系で特別扱いされます。`Point(x)` と書いたとき、`Point` object に `apply` があると `Point.apply(x)` と解釈されます。
つまり、ObjectName()はapplyのsyntax suagerです。

```scala
class Point(val x: Int, val y: Int)

object Point {
  def apply(x: Int, y: Int): Point = new Point(x, y)
}
```

この方法だと、

- 実装詳細を隠してインターフェースだけ公開できる
- サブクラスを返すファクトリに差し替えられる

といったメリットがあります。ケースクラスを使うと `apply` / `unapply` などが自動生成されるため、より簡潔に書けます。詳細は [case-class and pattern-matching](case-class-and-pattern-matching.md) にまとめています。

## コンパニオンオブジェクト

クラスと同じファイル内で同じ名前の `object` を定義するとコンパニオンオブジェクトになります。コンパニオンオブジェクトは対応するクラスに対して特権的なアクセス権を持ちます。

（クラスに付随するシングルトン）Javaなどでいうstaticに大体するものですね。

```scala
class Person(name: String, age: Int, private val weight: Int)

object Hoge {
  def printWeight(): Unit = {
    val taro = new Person("Taro", 20, 70)
    println(taro.weight) // weightはprivateなのでNG
  }
}
```

上記は `Hoge` から `private` にアクセスしているため NG です。一方、同名のコンパニオンオブジェクトならアクセスできます。

```scala
class Person(name: String, age: Int, private val weight: Int)

object Person {
  def printWeight(): Unit = {
    val taro = new Person("Taro", 20, 70)
    println(taro.weight)
  }
}
```

`private` にしたメンバでも、同名のコンパニオンオブジェクトからはアクセス可能です。
