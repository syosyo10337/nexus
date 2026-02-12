---
tags:
  - scala
  - implicit
  - type-class
created: 2026-02-12
updated_at: 2026-02-13
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

(1 to 5)でRangeオブジェクトを作成するときのtoはEnrich my libraryの一例で、本来はtoメソッドをIntオブジェクトは持っていませんが、持っているように拡張されています。

```scala
// 最もオーソドックスなパターン
class RichString(src: String) {
  def smile: String = src + ":-)"
}

implicit def enrichString(arg: String): RichString = new RichString(arg)

// -> "Hi, ".smile

// クラス構文をenrich my libraryするパターン
implicit class RichString(src: String) {
  def smile: String = src + ":-)"
}

// scala3で追加された専用構文
extension (src: String) {
  def smile: String = src + ":-)"
}
```

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

暗黙的ですねー

### 参考

- [scala-text: Implicit parameter（文脈引き渡し）](https://scala-text.github.io/scala_text/implicit.html#implicit-parameter%EF%BC%88%E6%96%87%E8%84%A8%E5%BC%95%E3%81%8D%E6%B8%A1%E3%81%97%EF%BC%89)

## Implicit parameter（型クラス）

implicit parameterのもう1つの使い方は型クラスです。Haskellなどの型クラスがある言語から借りてきた概念です。

### 型クラスとは

型クラスを使うことで、**型に応じた異なるふるまい**を汎用的なメソッドで実現できます。

#### 問題：List の全要素を合計するメソッドを作りたい

`List` の全ての要素の値を加算した結果を返すメソッドを定義したいとします。問題は「何のリストかわかっていない」という点です。整数や浮動小数点数、文字列など、様々な型が考えられます。単純には以下のように書けません。

```scala
def sum[A](lst: List[A]): A = {
  ???  // 何の + メソッドを使えばいい？
}
```

何のリストかわからないということは、整数や浮動小数点数の `+` メソッドをそのまま使うことはできません。これを解決するのが型クラスです。

#### 解決策：型クラスを定義する

**2つの同じ型を足す（0の場合はそれに相当する値を返す）方法を知っている型** を定義します。ここではその型を `Additive` とします。

```scala
trait Additive[A] {
  def zero: A
  def plus(a: A, b: A): A
}
```

- `zero`：型パラメータ `A` の「0に相当する値」を返す
- `plus()`：型パラメータ `A` を持つ2つの値を加算して返す

#### Step 1: 型に応じた Additive インスタンスを定義

型別に `Additive` の具体的な実装を定義します。

```scala
object IntAdditive extends Additive[Int] {
  def zero: Int = 0
  def plus(a: Int, b: Int): Int = a + b
}

object StringAdditive extends Additive[String] {
  def zero: String = ""
  def plus(a: String, b: String): String = a + b
}

// pointクラスはcaseで定義しておく
case class Point(val x: Int, val y: Int)

implicit object PointAdditive extends Additive[Point] {
  def zero: Point = Point(0, 0)
  def plus(a: Point, b: Point): Point = Point(a.x + b.x, a.y + b.y)
}
```

#### Step 2: Additive を使った sum メソッド

```scala
def sum[A](lst: List[A])(a: Additive[A]) =
  lst.foldLeft(a.zero)((x, y) => a.plus(x, y))
```

呼び出しは以下の通り：

```scala
sum(List(1, 2, 3))(IntAdditive)
// res: Int = 6

sum(List("A", "B", "C"))(StringAdditive)
// res: String = "ABC"
```

これで **型に応じた異なるふるまい** を実現できました。しかし、毎回 `IntAdditive` や `StringAdditive` を明示的に渡すのは冗長です。

### 型クラスの力：implicit を活用する

ここで `implicit` キーワードの登場です。コンパイラに「型に応じた適切なインスタンスを自動選択させる」ことができます。

#### Step 3: Additive インスタンスを implicit に

```scala
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

#### Step 4: 暗黙呼び出し

```scala
sum(List(1, 2, 3))
// コンパイラが IntAdditive を自動選択
// res: Int = 6

sum(List("A", "B", "C"))
// コンパイラが StringAdditive を自動選択
// res: String = "ABC"
```

**コンパイラのふるまい**：

1. `sum(List(1, 2, 3))` が呼び出されると
2. 型チェッカーが `List[Int]` から `Additive[Int]` が必要なことを認識
3. スコープから `implicit object IntAdditive extends Additive[Int]` を探索
4. 見つかったので、自動的に `sum(List(1, 2, 3))(IntAdditive)` に展開

### 型クラスのメリット

1. **呼び出し側がシンプル**：`implicit` マークされていれば、コンパイラが自動選択
2. **型安全**：コンパイル時に型が決定されるため、実行時エラーが少ない
3. **拡張性**：新しい型に対応する `Additive` インスタンスを定義するだけで OK

### 標準ライブラリでの活用

Scala標準ライブラリでも型クラスが活躍しています。

```scala
List[Int]().sum
// res: Int = 0

List(1, 2, 3, 4).sum
// res: Int = 10

List(1.1, 1.2, 1.3, 1.4).sum
// res: Double = 5.0
```

これらは `Numeric` という型クラスが背後で動いており、`implicit` パラメータにより型に応じた演算を実現しています。

### Haskellの用語との対応

implicit parameterのこのような使い方はプログラミング言語Haskellから借りてきたもので、Haskellでは**型クラス**と呼ばれます。Scalaでも同様に以下の用語を使います：

- **型クラス**：`Additive[A]` のような `trait`
- **型クラスのインスタンス**：`IntAdditive`、`StringAdditive` など、具体的な型クラスの実装

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
