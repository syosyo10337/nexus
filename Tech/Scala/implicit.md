---
tags:
  - scala
  - implicit
  - type-class
created: 2026-02-12
updated_at: 2026-02-12
status: draft
---

# implicitキーワード

Scalaには他の言語には見られないimplicitというキーワードで表現される機能があります。Scala 2ではimplicitという単一の機能によって複数の用途を賄うようになっていますが、1つの機能で色々な用途を表現できることがユーザーにとってわかりにくかったという反省もあり、Scala 3では用途別に異なるキーワードや構文を使う形になっています。

この章ではScala 2でのimplicitキーワードの4つの使い方を説明します。

## Implicit conversion

implicit conversionは暗黙の型変換をユーザが定義できる機能です。Scalaが普及し始めた時はこの機能が多用されたのですが、implicit conversionを多用するとプログラムが読みづらくなるということがわかったため、現在は積極的に使うことは推奨されていません。

implicit conversionは次のような形で定義します。

```scala
implicit def メソッド名(引数名: 引数の型): 返り値の型 = 本体
```

`implicit` というキーワードがついていることと引数が1つしかないことを除けば通常のメソッド定義同様です。implicit conversionでは引数の型と返り値の型に重要な意味があります。引数の型の式が現れたときに返り値の型を暗黙の型変換候補として登録することになるからです。

### 参考

- [scala-text: implicit conversion](https://scala-text.github.io/scala_text/implicit.html#implicit-conversion)

## Enrich my library

Enrich my libraryパターンと呼ばれるものがあります。C#やKotlinなどにある拡張メソッドと同等のもので、既存のクラスにメソッドを追加したようにみせかけることができます。Scala標準ライブラリの中にも利用例がありますし、サードパーティのライブラリでもよく見かけます。

implicit classはenrich my libraryパターン専用の機能なので、拡張メソッドを定義する意図を適切に表現できます。Scala 3では拡張メソッドを定義するための専用構文も用意されています。

### 参考

- [scala-text: Enrich my library](https://scala-text.github.io/scala_text/implicit.html#enrich-my-library)

## Implicit parameter（文脈引き渡し）

implicit parameterは主に2つの目的で使われます。1つ目の目的は、あちこちのメソッドに共通で渡されるオブジェクト（たとえば、ソケットやデータベースのコネクション）を明示的に引き渡すのを省略することです。

implicit修飾子は最後の引数リストに付けなければならないという制約があります。

```scala
def readRecordsFromTable(columnName: String, tableName: String)(implicit connection: Connection): List[Record]
```

Scalaコンパイラは、このように定義されたメソッドが呼び出されると、現在の呼び出しスコープからたどって直近のimplicitとマークされた値を暗黙にメソッドに引き渡します。

```scala
implicit val aConnection: Connection = connectDatabase(....)
```

このような文脈を引き渡すためのimplicit parameterはPlay FrameworkやO/Rマッパーなどで出てきます。

### 参考

- [scala-text: Implicit parameter（文脈引き渡し）](https://scala-text.github.io/scala_text/implicit.html#implicit-parameter%EF%BC%88%E6%96%87%E8%84%A8%E5%BC%95%E3%81%8D%E6%B8%A1%E3%81%97%EF%BC%89)

## Implicit parameter（型クラス）

implicit parameterのもう1つの使い方は型クラスです。Haskellなどの型クラスがある言語から借りてきた概念です。

型クラスを使うことで、**型に応じた異なるふるまい**を汎用的なメソッドで実現できます。

```scala
trait Additive[A] {
  def zero: A
  def plus(a: A, b: A): A
}

implicit object IntAdditive extends Additive[Int] {
  def zero: Int = 0
  def plus(a: Int, b: Int): Int = a + b
}

implicit object StringAdditive extends Additive[String] {
  def zero: String = ""
  def plus(a: String, b: String): String = a + b
}

def sum[A](lst: List[A])(implicit m: Additive[A]) =
  lst.foldLeft(m.zero)((x, y) => m.plus(x, y))
```

implicit parameterのこのような使い方では、Haskellの用語で `Additive` を**型クラス**、`IntAdditive` と `StringAdditive` を**型クラスのインスタンス**と呼びます。

### implicitの探索範囲

implicit conversionやimplicit parameterの値が探索される範囲には以下のものが含まれます：

- ローカルで定義されたもの
- importで指定されたもの
- スーパークラスで定義されたもの
- **コンパニオンオブジェクトで定義されたもの**

特に注目すべきはコンパニオンオブジェクトでimplicitの値を定義するパターンです。新しくデータ型を定義し、型クラスインスタンスも一緒に定義したい場合によく出てくるパターンです。

```scala
case class Rational(num: Int, den: Int)

object Rational {
  implicit object RationalAdditive extends Additive[Rational] {
    def plus(a: Rational, b: Rational): Rational = {
      // 有理数の足し算
    }
    def zero: Rational = Rational(0, 1)
  }
}
```

importをしていないのに、Additive型クラスのインスタンスを使うことができます。

### 参考

- [scala-text: Implicit parameter（型クラス）](https://scala-text.github.io/scala_text/implicit.html#implicit-parameter%EF%BC%88%E5%9E%8B%E3%82%AF%E3%83%A9%E3%82%B9%EF%BC%89)
