---
tags:
  - scala
  - type-class
  - functional-programming
created: 2026-02-13
updated_at: 2026-02-13
status: draft
---

# 型クラス（Type Class）

型クラスは関数型プログラミング言語（特にHaskell）から借りてき た概念で、Scalaでは `implicit parameter` を使って実装されます。異なる型に対して共通のインターフェースを提供し、型安全に多形性を実現する仕組みです。

## 型クラスの基本概念

### 従来の多形性の問題点

通常のオブジェクト指向では、インターフェースを定義して実装クラスを作ります。

```scala
trait Drawable {
  def draw(): String
}

class Circle extends Drawable {
  def draw(): String = "●"
}

class Square extends Drawable {
  def draw(): String = "■"
}
```

しかし、**既存の型を変更できない場合**や、**後から新しい機能を追加したい場合**に問題が生じます。例えば、`Int` や `String` に新しいメソッドを追加したい場合です。

### 型クラスの利点

型クラスは以下の特徴を持ちます：

1. **既存の型を変更しない**：既に定義されたクラスに影響を与えない
2. **型安全**：コンパイル時に型チェックされる
3. **柔軟な拡張**：新しい型への対応を簡単に追加できる
4. **アドホック多形**：同じ関数が異なる型に対して異なるふるまいをする

## 型クラスの構造

型クラスは以下の3つから構成されます：

### 1. 型クラスの定義（Trait）

型クラスは、型パラメータを持つ `trait` として定義します。

```scala
trait Show[A] {
  def show(a: A): String
}
```

### 2. 型クラスのインスタンス定義

各型に対して、型クラスがどのように振る舞うかを定義します。`implicit object` で定義することで、暗黙的に選択されます。

```scala
implicit object ShowInt extends Show[Int] {
  def show(a: Int): String = a.toString
}

implicit object ShowString extends Show[String] {
  def show(a: String): String = s"\"$a\""
}

implicit object ShowBoolean extends Show[Boolean] {
  def show(a: Boolean): String = if (a) "true" else "false"
}
```

### 3. 型クラスを使う関数

`implicit parameter` を使って、型クラスのインスタンスを受け取ります。

```scala
def printAs[A](a: A)(implicit show: Show[A]): Unit = {
  println(show.show(a))
}
```

## 使用例

### 基本的な使用

```scala
printAs(42)        // "42"
printAs("hello")   // "hello"
printAs(true)      // "true"
```

### List の値を表示する

```scala
def showList[A](lst: List[A])(implicit show: Show[A]): String = {
  lst.map(show.show).mkString("[", ", ", "]")
}

showList(List(1, 2, 3))           // "[1, 2, 3]"
showList(List("a", "b", "c"))     // "["a", "b", "c"]"
```

コンパイラが自動的に `ShowInt` または `ShowString` を選択します。

## 型クラスの実装パターン

### パターン 1：Helper メソッド

型クラスの使用を簡潔にするため、ヘルパーメソッドを定義することがよくあります。

```scala
def show[A](a: A)(implicit s: Show[A]): String = s.show(a)

show(42)
// -> "42"
```

### パターン 2：Enrichment（拡張メソッド）

implicit class を使って、あたかも元の型にメソッドが追加されたように見せかけます。

```scala
implicit class ShowOps[A](a: A)(implicit show: Show[A]) {
  def show: String = show.show(a)
}

42.show            // "42"
"hello".show       // "hello"
true.show          // "true"
```

### パターン 3：Context Bound

型パラメータの制約を簡潔に表現します。

```scala
def show[A: Show](a: A): String = {
  implicitly[Show[A]].show(a)
}

show(42)
// -> "42"
```

`[A: Show]` は `(implicit show: Show[A])` の省略形です。

## 実践例：汎用な合計メソッド

### Additive 型クラス

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

implicit object ListAdditive extends Additive[List[Int]] {
  def zero: List[Int] = List()
  def plus(a: List[Int], b: List[Int]): List[Int] = a ++ b
}
```

### 汎用 sum メソッド

```scala
def sum[A](lst: List[A])(implicit m: Additive[A]): A = {
  lst.foldLeft(m.zero)((x, y) => m.plus(x, y))
}

sum(List(1, 2, 3))                    // 6
sum(List("Hello", " ", "World"))      // "Hello World"
sum(List(List(1, 2), List(3, 4)))     // List(1, 2, 3, 4)
```

## 型クラス vs 継承

| 特性           | 継承   | 型クラス |
| -------------- | ------ | -------- |
| 既存型の変更   | 不可   | 可能     |
| 事前計画       | 必要   | 不要     |
| 複数の振る舞い | 難しい | 簡単     |
| 型安全性       | ◯      | ◯◯       |
| 関数型         | ✗      | ◯        |

## implicit の探索順序

`implicit parameter` が探索される範囲（優先度順）：

1. ローカルスコープで定義されたもの
2. `import` で指定されたもの
3. **型クラスのコンパニオンオブジェクト**で定義されたもの
4. 親クラス（super class）で定義されたもの

### コンパニオンオブジェクトでの定義

型を定義するときに、同時に型クラスインスタンスを定義する場合がよくあります。

```scala
case class User(name: String, age: Int)

object User {
  implicit object UserShow extends Show[User] {
    def show(user: User): String =
      s"User(${user.name}, ${user.age})"
  }
}

show(User("Alice", 30))
// User(Alice, 30)
// -> import不要でコンパニオンオブジェクトから自動探索
```

## 標準ライブラリでの型クラス

### Numeric 型クラス

標準ライブラリには `Numeric` という型クラスがあり、数値演算を汎用的に行えます。

```scala
def sum[A](nums: List[A])(implicit num: Numeric[A]): A = {
  nums.foldLeft(num.zero)((a, b) => num.plus(a, b))
}

sum(List(1, 2, 3))          // 6
sum(List(1.1, 2.2, 3.3))    // 6.6
```

### Ordering 型クラス

ソート時に異なる順序を定義できます。

```scala
implicit val intOrdering: Ordering[Int] = Ordering.Int

List(3, 1, 2).sorted  // List(1, 2, 3)
```

## 型クラスの設計原則

### 1. 単一責任

型クラスは1つの関心事のみを表現するべき。

```scala
// Good: 1つの責任
trait Show[A] {
  def show(a: A): String
}

// Bad: 複数の責任
trait ShowAndSerialize[A] {
  def show(a: A): String
  def serialize(a: A): Array[Byte]
}
```

### 2. 一貫性

同じ型に対する複数の実装は避ける。

```scala
// Bad: 型に対して複数の Show インスタンスを定義
implicit object UserShow1 extends Show[User] { ... }
implicit object UserShow2 extends Show[User] { ... }
// -> コンパイルエラー
```

### 3. 拡張性

新しい型を追加するときに、既存のコードを変更しない。

```scala
// 後から新しい型対応を追加
case class Point(x: Int, y: Int)

object Point {
  implicit object PointShow extends Show[Point] {
    def show(p: Point): String = s"(${{p.x}}, ${{p.y}})"
  }
}
```

## まとめ

型クラスは：

- **型安全性**と**柔軟性**を両立させる強力なパターン
- 既存の型に影響を与えずに新しい機能を追加できる
- `implicit parameter` により、呼び出し側がシンプルになる
- Scalaの関数型プログラミング的な設計に欠かせない概念

型クラスを理解することで、Scalaの設計レベルが大きく向上します。
