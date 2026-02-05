---
tags:
  - Scala
  - Type System
  - Generics
create_at: 2026-02-06
status: active
---

# 型パラメータ

型パラメータは、クラスやメソッドを定義する際に、具体的な型を後から指定できるようにする仕組みです。TSのジェネリクスに相当し、型安全性を保ちながらコードの再利用性を高めます。

## 基本形

```scala
class Box[T](value: T) {
  def get: T = value
}

val intBox = new Box[Int](42)
val stringBox = new Box[String]("hello")
```

型パラメータ `T` は、インスタンス化時に具体的な型（`Int`、`String`など）に置き換えられます。
ScalaではA,Bと慣習的に表現していく順序らしい。

## メソッドの型パラメータ

```scala
def identity[A](x: A): A = x

identity[Int](42)        // 42
identity[String]("foo")  // "foo"
identity(true)           // 型推論により Boolean と判断される
```

## 変性（Variance）

型パラメータには、サブタイプ関係をどう扱うかを示す変性アノテーションを付けられます。

- **共変（covariant）**: `[+T]` — `A` が `B` のサブタイプなら `Box[A]` も `Box[B]` のサブタイプ `G[B] = G[A]`
- **反変（contravariant）**: `[-T]` — `A` が `B` のサブタイプなら `Box[B]` が `Box[A]` のサブタイプ
- **不変/非変（invariant）**: `[T]` — サブタイプ関係を引き継がない（デフォルト）

```scala
class Box[+T](val value: T)  // 共変

trait Animal
class Dog extends Animal

val dogBox: Box[Dog] = new Box(new Dog)
val animalBox: Box[Animal] = dogBox  // OK（共変なので）
```

## 型境界（Type Bounds）

型パラメータに制約を付けて、特定の型やそのサブタイプのみを受け入れるようにできます。

### 上限境界（Upper Bound）

```scala
def printAnimal[T <: Animal](animal: T): Unit =
  println(animal)

printAnimal(new Dog)  // OK
// printAnimal("string")  // コンパイルエラー
```

### 下限境界（Lower Bound）

```scala
def addDog[T >: Dog](list: List[T]): List[T] =
  new Dog :: list
```

## 型パラメータのポイント

- **型安全性**: コンパイル時に型チェックが行われ、実行時エラーを防ぐ
- **再利用性**: 同じコードを異なる型で使い回せる
- **変性の理解**: 共変・反変を適切に使い分けることで、柔軟で安全なAPIを設計できる
