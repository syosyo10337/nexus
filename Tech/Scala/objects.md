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

## コンパニオンオブジェクト

## applyメソッド

## objectの初期化

## objectとclassの違い
