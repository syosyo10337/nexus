---
tags:
  - scala
  - case-class
  - pattern-matching
  - functional-programming
created: 2026-02-09
updated_at: 2026-02-09
status: active
---

# ケースクラスとパターンマッチング

Scala のケースクラス（case class）とパターンマッチング（pattern matching）は、代数的データ型（ADT）を扱うための中核機能です。

## ケースクラス

### 基本的な定義

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

### 部分関数: TODOここから

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
