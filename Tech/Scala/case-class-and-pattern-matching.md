---
tags:
  - scala
  - case-class
  - pattern-matching
  - functional-programming
created: 2026-02-09
updated_at: 2026-02-12
status: active
---

# ケースクラスとパターンマッチング

Scala のケースクラス（case class）とパターンマッチング（pattern matching）は、代数的データ型（ADT）を扱うための中核機能です。

## 代数的データ型（ADT）

ADTの概論は [Tech/Programming/ADT.md](../Programming/ADT.md) を参照。ここではケースクラスとパターンマッチングの使い方に焦点を当てます。

## ケースクラス

### 基本的な定義

case分のcaseから来ている、

- new不要で初期化できて
- パターンマッチできる
- immutableなデータセットであるなどの場合に使うことができます。

```scala
case class Person(name: String, age: Int)
```

### 自動生成される機能

`case` を付けると、通常のクラスに以下が自動生成されます。

- `apply`（`new` なしで生成できる）
- `unapply`（パターンマッチング用の分解）
- `equals` / `hashCode`（構造的同値）
- `toString`（分かりやすい文字列表現）
- `copy`（イミュータブルな更新）

```scala
val alice = Person("Alice", 25)          // apply
val older = alice.copy(age = 26)         // copy
alice == Person("Alice", 25)             // equals
println(alice)                            // toString

alice match {                             // unapply
  case Person(name, age) => println(s"$name is $age")
}
```

### パラメータは `val`

ケースクラスのパラメータは自動的に `val` になります。`var` も書けますが、基本はイミュータブルにします。

```scala
case class User(name: String, var age: Int)
```

### case object

引数のないケースは `case object` にします。`case class` の zero-arg 版で、パターンマッチングに向いています。

```scala
sealed trait DayOfWeek
case object Sunday extends DayOfWeek
case object Monday extends DayOfWeek
```

### sealed trait と ADT

`sealed` は継承を同一ファイル内に制限し、パターンマッチングの網羅性チェックを有効にします。

```scala
sealed trait DayOfWeek
case object Sunday extends DayOfWeek
case object Monday extends DayOfWeek
case object Tuesday extends DayOfWeek
case object Wednesday extends DayOfWeek
case object Thursday extends DayOfWeek
case object Friday extends DayOfWeek
case object Saturday extends DayOfWeek

val x: DayOfWeek = Sunday
```

Scala 3 では `enum` を使うとより簡潔に書けます。

```scala
enum DayOfWeekScala3Enum {
  case Sunday, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday
}
```

### 練習問題: caseを使った表現例

```scala
object BinaryTree {
  sealed abstract class Tree
  case class Branch(value: Int, left: Tree, right: Tree) extends Tree
  case object Empty extends Tree

  def max(tree: Tree): Option[Int] = tree match {
    case Branch(value, left, right) =>
      val leftMax = max(left).getOrElse(Int.MinValue)
      val rightMax = max(right).getOrElse(Int.MinValue)
      Some(List(value, leftMax, rightMax).max)
    case Empty => None
  }

  def min(tree: Tree): Option[Int] = tree match {
    case Branch(value, left, right) =>
      val leftMin = min(left).getOrElse(Int.MaxValue)
      val rightMin = min(right).getOrElse(Int.MaxValue)
      Some(List(value, leftMin, rightMin).min)
    case Empty => None
  }

  def depth(tree: Tree): Int = tree match {
    case Branch(_, left, right) => 1 + List(depth(left), depth(right)).max
    case Empty => 0
  }
}
```

## パターンマッチング

### 基本構文

```scala
value match {
  case pattern1 => expr1
  case pattern2 => expr2
  case _ => defaultExpr
}
```

パターンマッチングは式なので値を返します。

### コンストラクタパターン

```scala
case class Person(name: String, age: Int)

def greeting(person: Person): String = person match {
  case Person("Alice", age) => s"Hello Alice! You are $age"
  case Person(name, age) if age < 18 => s"Hi $name, you are a minor"
  case Person(name, _) => s"Hello $name!"
}
```

### 定数・変数パターン

```scala
def describe(x: Any): String = x match {
  case 0 => "zero"
  case s: String => s"string: $s"
  case other => s"other: $other"
}
```

### タプル・リストパターン

```scala
def describePair(pair: (Int, Int)): String = pair match {
  case (0, 0) => "origin"
  case (x, 0) => s"on x-axis at $x"
  case (0, y) => s"on y-axis at $y"
  case (x, y) => s"point at ($x, $y)"
}

def sumList(list: List[Int]): Int = list match {
  case Nil => 0
  case head :: tail => head + sumList(tail)
}
```

### パターン変数の束縛（`@`）

```scala
case class Address(city: String, country: String)
case class Person(name: String, address: Address)

def describe(person: Person): String = person match {
  case Person(name, addr @ Address("Tokyo", _)) =>
    s"$name lives in Tokyo. Full address: $addr"
  case _ => "someone else"
}
```

### sealed trait による網羅性チェック

```scala
sealed trait Shape
case class Circle(radius: Double) extends Shape
case class Rectangle(width: Double, height: Double) extends Shape

def area(shape: Shape): Double = shape match {
  case Circle(r) => math.Pi * r * r
  case Rectangle(w, h) => w * h
}
```

`sealed` の場合、パターンが不足しているとコンパイル時に警告されます。

## 部分関数（Partial Function）

### 部分関数とは

部分関数は、**一部の入力に対してのみ定義された関数**です。通常の関数はすべての入力に対して値を返す必要がありますが、部分関数は「パターンマッチするものだけ」処理を定義できます。

```scala
val pf: PartialFunction[Any, String] = {
  case s: String => s"String: $s"
  case i: Int => s"Int: $i"
}

pf("hello")  // OK: "String: hello"
pf(42)       // OK: "Int: 42"
pf(3.14)     // MatchError！（Double は定義されていない）
```

### PartialFunction 型とメソッド

Scala では、`{ case ... }` 構文で書いたパターンマッチのブロックは、内部的に `PartialFunction` 型として扱われます。

**主なメソッド：**

#### `isDefinedAt`

その値に対して関数が定義されているかチェックできます。

```scala
val pf: PartialFunction[Any, String] = {
  case s: String => s"String: $s"
  case i: Int => s"Int: $i"
}

pf.isDefinedAt("hello")  // true
pf.isDefinedAt(42)       // true
pf.isDefinedAt(3.14)     // false（Double には未定義）
```

#### `orElse`

複数の部分関数を合成できます。

```scala
val stringHandler: PartialFunction[Any, String] = {
  case s: String => s.toUpperCase
}

val intHandler: PartialFunction[Any, String] = {
  case i: Int => i.toString
}

val combined = stringHandler orElse intHandler

combined("hello")  // "HELLO"
combined(42)       // "42"
```

#### `andThen`

部分関数を適用した後に別の関数を適用します。

```scala
val pf: PartialFunction[Any, String] = {
  case i: Int => i.toString
}

val doubled = pf andThen (s => s + s)

doubled(3)  // "33"
```

### collect との組み合わせ

部分関数の最も実用的な使い方は、コレクションの `collect` メソッドとの組み合わせです。`collect` は**フィルタリングと変換を同時に行う**ことができます。

**従来の書き方：**

```scala
list.filter(x => x.isInstanceOf[String])
    .map(x => x.asInstanceOf[String].toUpperCase)
```

**部分関数 + collect：**

```scala
list.collect { case s: String => s.toUpperCase }

// また、
List(1, 2, 3, 4, 5).collect { case i if i % 2 == 1 => i * 2 }
などのように型ではないでももちろん使えます。
```

**動作の仕組み：**

```scala
val pf: PartialFunction[Any, String] = {
  case s: String => s"String: $s"
  case i: Int => s"Int: $i"
}

List(1, "two", 3.14, "four").collect(pf)
// 内部で isDefinedAt をチェック
// → 1 と "two" と "four" だけ適用
// → 3.14 はスキップ（エラーにならない）
// 結果: List("Int: 1", "String: two", "String: four")
```

### 実用例

**Option の値がある要素だけ取り出す：**

```scala
val list: List[Option[Int]] = List(Some(1), None, Some(3), None, Some(5))

val values = list.collect { case Some(x) => x }
// List(1, 3, 5)
```

### まとめ

- **部分関数**はパターンマッチするものだけ処理を定義する関数
- **`isDefinedAt`** で定義域をチェック可能
- **`collect`** と組み合わせると「フィルタ + 変換」を簡潔に表現できる
- **Akka/Actor** のメッセージハンドラなど、実務でも頻出

## Option とパターンマッチング

```scala
def divide(a: Int, b: Int): Option[Double] =
  if (b == 0) None else Some(a.toDouble / b)

divide(10, 2) match {
  case Some(result) => println(s"Result: $result")
  case None => println("Cannot divide by zero")
}
```

## まとめ

- **ケースクラス**は `apply` / `unapply` / `copy` などを自動生成する
- **パターンマッチング**は構造に基づく分岐を安全に書ける
- **sealed trait** と組み合わせると網羅性チェックで安全性が上がる
