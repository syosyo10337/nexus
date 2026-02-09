---
tags:
  - Scala
  - OOP
  - Object
create_at: 2026-02-05
status: active
---

# オブジェクト

Scalaでは、全ての値がオブジェクトです。また、全てのメソッドは何らかのオブジェクトに所属しています。
そのため、Javaのようにクラスに属するstaticフィールドやstaticメソッドといったものを作成することができません。

その代わりに、objectキーワードによって、同じ名前のシングルトンオブジェクトを現在の名前空間の下に1つ定義することができます。objectキーワードによって定義したシングルトンオブジェクトには、そのオブジェクト固有のメソッドやフィールドを定義することができます。

## object構文

- ユーティリティメソッドやグローバルな状態の置き場所（Javaで言うstaticメソッドやフィールド）
- 同名クラスのオブジェクトのファクトリメソッド

```scala
object <object名> extends <class名> (with <trait名){
  // クラス名のオブジェクトのファクトリメソッド
  def ファクトリメソッド名(引数): クラス名.オブジェクト名 = new クラス名.オブジェクト名(引数)
}

```

[Predefというobject](https://github.com/scala/scala3/blob/3.8.1/library/src/scala/Predef.scala)がbuild-inで定義インポートされており、一つ目の使い方ユーティリティとして機能しているわけですね。e.g. `println()`とか

一方、2番めの使い方について考えてみます。
点を表す `Point` クラスのファクトリを objectで作ろうとすると、次のようになります。**apply という名前のメソッドはScala処理系によって特別に扱われ**

`Point(x)`のような記述があった場合で、Point objectにapplyという名前のメソッドが定義されていた場合、`Point.apply(x)`と解釈されます。これを利用してPoint objectの applyメソッドでオブジェクトを生成するようにすることで、`Point(3, 5)`のような記述でオブジェクトを生成できるようになります。

```scala
 // e.g.
class Point(val x:Int, val y:Int)

object Point {
  def apply(x: Int, y: Int): Point = new Point(x, y)
}
```

クラス（Point）の実装詳細を内部に隠しておける（インタフェースのみを外部に公開する）
Pointではなく、そのサブクラスのインスタンスを返すことができる
といったメリットがあります。なお、上記の記述はケースクラスを用いてもっと簡単に

```scala
case class Point(x: Int, y: Int)
```

### caseクラス

equals()・hashCode()・toString()などのオブジェクトの基本的なメソッドをオーバーライドしたクラスを生成し、また、そのクラスのインスタンスを生成するためのファクトリメソッドを生成するものです。たとえば、 case class Point(x: Int, y: Int)で定義した Point クラスは equals() メソッドを明示的に定義してはいませんが、

```scala
// コンパイラが生成する実際のコード（概念的には）
class Point(val x: Int, val y: Int) {
  // 1. equals メソッド（値ベースの比較）
  override def equals(obj: Any): Boolean = obj match {
    case that: Point => this.x == that.x && this.y == that.y
    case _ => false
  }

  // 2. hashCode メソッド（フィールドの値から生成）
  override def hashCode(): Int = {
    31 * x.hashCode + y.hashCode
  }

  // 3. toString メソッド（わかりやすい文字列表現）
  override def toString: String = s"Point($x,$y)"

  // 4. copy メソッド（一部のフィールドだけ変更した新しいインスタンス）
  def copy(x: Int = this.x, y: Int = this.y): Point =
    new Point(x, y)
}

// さらに、コンパニオンオブジェクトも自動生成
object Point {
  // 5. apply メソッド（new なしでインスタンス生成）
  def apply(x: Int, y: Int): Point = new Point(x, y)

  // 6. unapply メソッド（パターンマッチング用）
  def unapply(p: Point): Option[(Int, Int)] =
    Some((p.x, p.y))
}

// 以下のことが実行できるらしい　
val p1 = Point(1, 2)         // apply メソッド（ファクトリ）
val p2 = Point(1, 2)

p1 == p2                     // true（equals メソッド）
p1.toString                  // "Point(1,2)"（toString メソッド）
p1.hashCode                  // 一貫した値（hashCode メソッド）
val p3 = p1.copy(x = 5)      // Point(5, 2)（copy メソッド）

// パターンマッチング（unapply メソッド）
p1 match {
  case Point(x, y) => println(s"x=$x, y=$y")
}
```

cf. [case-class and pattern-matching](case-class-and-pattern-matching.md)

## コンパニオンオブジェクト

クラスと同じファイル内、同じ名前で定義されたシングルトンオブジェクトは、コンパニオンオブジェクトと呼ばれます。
コンパニオンオブジェクトは対応するクラスに対して特権的なアクセス権を持っています。たとえば、 weightをprivateにした場合、

```scala
class Person(name: String, age: Int, private val weight: Int)

object Hoge {
  def printWeight(): Unit = {
    val taro = new Person("Taro", 20, 70)
    println(taro.weight)
  }
}
```

はNGですが、

```scala
class Person(name: String, age: Int, private val weight: Int)

object Person {
  def printWeight(): Unit = {
    val taro = new Person("Taro", 20, 70)
    println(taro.weight)
  }
}
```

### 自動生成されるメソッド

#### 1. コンパニオンオブジェクトの `apply` メソッド

```scala
// new を使わずにインスタンスを生成できる
val alice = Person("Alice", 25)
// コンパイラが Person.apply("Alice", 25) に変換する
```

#### 2. `unapply` メソッド（パターンマッチング用）

```scala
val person = Person("Bob", 30)

person match {
  case Person(name, age) => println(s"$name is $age years old")
}
```

#### 3. `equals` と `hashCode`

構造的な等価性（structural equality）を自動実装します。

```scala
val p1 = Person("Alice", 25)
val p2 = Person("Alice", 25)
val p3 = Person("Bob", 30)

p1 == p2  // true（内容が同じ）
p1 == p3  // false
```

#### 4. `toString`

デバッグに便利な文字列表現を自動生成します。

```scala
val person = Person("Alice", 25)
println(person)  // Person(Alice,25)
```

#### 5. `copy` メソッド

イミュータブルな変更を簡単に行えます。

```scala
val alice = Person("Alice", 25)
val olderAlice = alice.copy(age = 26)  // name は変更しない

println(alice)       // Person(Alice,25)
println(olderAlice)  // Pe
```

はOKです。**privateとした場合、コンパニオンオブジェクトからはアクセス可能です。**
