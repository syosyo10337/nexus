---
tags:
  - Scala
  - OOP
  - Class
create_at: 2026-02-01
status : active
---

# クラス

Scalaのクラス定義

```scala
class <クラス名> ( arg1: argType1, arg2: argType2, .... ) {
  // field定義
  <val/var> variable = arg1
  // e.g. 
  val val = arg1

  // method定義
  <private|protected|> def func(arg1: Arg1): ReturnType = {
    //content
  }
}
```

## コンストラクタとイニシャライザ（短縮構文）

```scala
// e.g. 
class Point(_x: Int, _y: Int) {
  val x = _x
  val y = _y
}

// コンストラクタの引数をクラスのfiledとしてそのまま扱い公開したい時は
//以下の省略構文が使えます。
 class Point(val x: Int, val y: Int)
```

最初の点ですが、Scalaでは1クラスに付き、基本的には1つのコンストラクタしか使いません。このコンストラクタを、Scalaでは**プライマリコンストラクタ**として特別に扱っています。文法上は複数のコンストラクタを定義できるようになっていますが、実際に使うことはほとんどありません。複数のオブジェクトの生成方法を提供したい場合、objectの apply メソッドとして定義することが多いです。

2番目の点ですが、プライマリコンストラクタの引数にval/varをつけるとそのフィールドは公開され、外部からアクセスできるようになります。なお、プライマリコンストラクタの引数のスコープはクラス定義全体におよびます。そのため、以下のようにメソッド定義の中から直接コンストラクタ引数を参照できます。

```scala
class Point(val x: Int, val y: Int) {
  def +(p: Point): Point = {
    new Point(x + p.x, y + p.y)
  }
  override def toString(): String = "(" + x + ", " + y + ")"
}
```

### 中置表記 (Infix Notation)

Scalaでは、引数が1つのメソッドを呼び出す際に、ドット `.` とカッコ `()` を省略して書くことができます。これを**中置表記**と呼びます。

```scala
p1 + p2
// これは内部的には以下と同じ
p1.+(p2)
```

また、Scalaでは `+` や `-` といった**記号も通常のメソッド名として定義できる**ため、自作クラスにおいて演算子のような記述を直感的に行うことが可能です。

## メソッド定義

返り値は特別な場合を除いて型推論が動作するらしい。

```scala
(private([<パッケージ名など>])? | protected([<パッケージ名など>])?)? def <メソッド名> '('
  (<引数名> : 引数型 (, 引数名 : <引数型>)*)?
')': <返り値型> = <本体>
```

### メソッド/フィールドの可視性(visibility)

- **`private`**: そのクラス内からのみアクセス可能。
- **`protected`**: 派生クラスからのみアクセス可能。
- **`private[パッケージ名]`**: 同一パッケージに所属しているものからのみアクセス可能。
- **`protected[パッケージ名]`**: 派生クラスに加えて、同一パッケージに所属しているもの全てからアクセス可能。
- **指定なし**: `public` とみなされ、どこからでもアクセス可能。

## 複数の引数リストを持つメソッド

```scala
class Adder {
  def add(x: Int)(y: Int): Int = x + y
}

val adder = new Adder()
// adder: Adder = repl.MdocSession$MdocApp$Adder$1@fcf00bf

adder.add(2)(3)
// res1: Int = 5
```

## 抽象メンバー(absract member)

フィールドとメソッド定義を中身なしで行うことで成立するらしい。また、抽象メソッドを1つ以上持つクラスは、抽象クラスとして宣言される必要があります。

```scala
abstract class XY {
  def x: Int
  def y: Int
}
```

## 継承(inheritance)

継承などにより型に親子関係を作り、複数の型に共通のインタフェースを持たせることをサブタイピング・ポリモーフィズムと呼びます。Scalaでは、構造的部分型(Structural Subtyping)によりサブタイピングポリモーフィズムの機能があるらしい。

Scalaでは、すでにあるメソッドをoverrideするときには`override`キーワードが必須です。また、抽象メソッドをoverrideするときには`override`キーワードは不要です。

```scala
abstract class Shape {
  def area: Double
}

class Rectangle (val w: Double, val h: Double)  extends Shape {
  def area: Double = w * h
}

class Circle(val r: Double) extends Shape {
  def area: Double = Math.PI * r * r
}

// 呼び出し例
var shape: Shape = new Rectangle(10.0, 20.0)
println(shape.area)
shape = new Circle(2.0)
println(shape.area)

```

複数の継承は名前の衝突など振る舞いが問題になることが知られていて、Javaでは実装継承は一つに限定されているらしい。

```scala
class Sample extends Parent with Cousin {}
```
