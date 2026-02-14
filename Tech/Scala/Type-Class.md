---
tags:
  - scala
  - type-class
  - functional-programming
created: 2026-02-13
updated_at: 2026-02-14
status: active
---

# 型クラス（Type Class）

型クラスは関数型プログラミング言語（特にHaskell）から借りてき た概念で、Scalaでは `implicit parameter` を使って実装されます。異なる型に対して共通のインターフェースを提供し、型安全に多形性を実現する仕組みです。

## 型クラスの基本概念

型クラスは関数型プログラミングの強力なパターンで、既存の型を変更することなく**型に応じた異なるふるまい**を実現します。型クラスを理解するための詳細な理論と `Additive` の実装例については [Tech/Scala/implicit.md](implicit.md#implicit-parameterの型クラス) を参照してください。

型クラスの主な利点：

1. **既存の型を変更しない**
2. **型安全**：コンパイル時に型チェックされる
3. **柔軟な拡張**：新しい型への対応が容易
4. **アドホック多形**：同じ関数が異なる型で異なるふるまいをする

## 型クラスの構造と実装パターン

### 1. 型クラスの定義（Trait）

型クラスは、型パラメータを持つ `trait` として定義します。

```scala
trait Show[A] {
  def show(a: A): String
}
```

### 2. 型クラスのインスタンス定義

各型に対して、型クラスがどのように振る舞うかを定義します。

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

詳細な型クラス実装例（`Additive` パターン、型クラスと implicit の相互作用）については [Tech/Scala/implicit.md](implicit.md#implicit-parameterの型クラス) を参照してください。

## 使用例

### 基本的な使用

```scala
printAs(42)        // "42"
printAs("hello")   // "hello"
printAs(true)      // "true"
```

```scala
def showList[A](lst: List[A])(implicit show: Show[A]): String = {
  lst.map(show.show).mkString("[", ", ", "]")
}

showList(List(1, 2, 3))           // "[1, 2, 3]"
showList(List("a", "b", "c"))     // "["a", "b", "c"]"
```

コンパイラが自動的に `ShowInt` または `ShowString` を選択します。

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
つまり、`Show[A]のインスタンスをimplicitly[Show[A]]`として取得することができます。

## 標準ライブラリでの活用

Scalaの型クラスパターンは標準ライブラリの様々な場所で使われています。[Tech/Scala/implicit.md](implicit.md#implicit-parameterの型クラス) を参照してください。

## implicit の探索範囲

implicit parameter と型クラスインスタンスの探索範囲については [Tech/Scala/implicit.md](implicit.md#implicitの探索範囲) を参照してください。

## 型クラス設計のベストプラクティス

型クラスを効果的に設計するためのポイント：

1. **単一責任**：1つの型クラスは1つの関心事のみを表現
2. **一貫性**：同じ型に対する複数の実装は避ける
3. **拡張性**：新しい型対応の追加時に既存コードを変更しない
4. **シグネチャ**：Context Bounds で簡潔に表現

## まとめ

型クラスは：

- **型安全性**と**柔軟性**を両立させる強力なパターン
- 既存の型に影響を与えずに新しい機能を追加できる
- `implicit parameter` により、呼び出し側がシンプルになる
- Scalaの関数型プログラミング的な設計に欠かせない概念

型クラスを理解することで、Scalaの設計レベルが大きく向上します。
