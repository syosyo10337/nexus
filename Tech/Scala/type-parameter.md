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

- **共変（covariant）**: `[+T]`
- **反変（contravariant）**: `[-T]`
- **不変/非変（invariant）**: `[T]` — サブタイプ関係を引き継がない（デフォルト）

### convariant(共変)

```scala
class Box[+T](val value: T)  // 共変

trait Animal
class Dog extends Animal

val dogBox: Box[Dog] = new Box(new Dog)
val animalBox: Box[Animal] = dogBox  // OK（共変なので）
```

以下の問題は、共変を理解する際にStackを使ったものです。

```scala
trait Stack[+A] {
  def push[E >: A](e: E): Stack[E]
  def top: A
  def pop: Stack[A]
  def isEmpty: Boolean
}

class NonEmptyStack[+A](private val first: A, private val rest: Stack[A]) extends Stack[A] {
  def push[E >: A](e: E): Stack[E] = new NonEmptyStack[E](e, this)
  def top: A = first
  def pop: Stack[A] = rest
  def isEmpty: Boolean = false
}

case object EmptyStack extends Stack[Nothing] {
  def push[E >: Nothing](e: E): Stack[E] = new NonEmptyStack[E](e, this)
  def top: Nothing = throw new IllegalArgumentException("empty stack")
  def pop: Nothing = throw new IllegalArgumentException("empty stack")
  def isEmpty: Boolean = true
}

object Stack {
  def apply(): Stack[Nothing] = EmptyStack
}
```

### contravariant(反変)

```scala
class G[-A]
```

AがBを継承している時にのみ、以下のような代入が許される。

```scala
val : G[A] = G[B]

// e.g.
trait Printer[-A] { def print(a: A): Unit }

val animalPrinter: Printer[Animal] = ...
val dogPrinter: Printer[Dog] = animalPrinter  // ✅ OK！逆転する
```

「動物を印刷できるプリンター」は「犬を印刷するプリンター」としても使える。消費する側は逆になるのが自然。

#### 関数型での反変の具体例

反変の最もわかりやすい例は**関数の引数型**です。継承関係 `String <: AnyRef` があるとき、関数型は**逆転**します：

```scala
(String => R) <: (AnyRef => R)  // 引数型が逆転！
```

##### ケース1：✅ OK なパターン

```scala
// x1 の型宣言：「String を受け取る関数」
// 実際の値：「AnyRef を受け取る関数」
val x1: String => AnyRef = (a: AnyRef) => a  // ✅ OK

// 後で呼ばれるとき
x1("hello")  // String を渡す
```

**なぜOKか？**

1. `x1` は「Stringを受け取る関数」として宣言
2. 実際の関数は「AnyRefを受け取る」関数
3. 呼び出し時：String型の値を渡す
4. **String を AnyRef の引数に渡すのは安全**（String <: AnyRef）

```text
呼び出し: x1("hello")
         ↓ String型の値
実際の関数: (a: AnyRef) => ...
         ↑ AnyRef型を期待
結果: ✅ String は AnyRef のサブタイプなので安全
```

##### ケース2：❌ NG なパターン

```scala
// x1 の型宣言：「AnyRef を受け取る関数」
// 実際の値：「String を受け取る関数」
val x1: AnyRef => AnyRef = (s: String) => s.toUpperCase  // ❌ コンパイルエラー

// もしこれが許されたら...
x1(new Object())  // ← こんな呼び出しが可能になってしまう！
```

**なぜダメか？**

1. `x1` は「AnyRefを受け取る関数」として宣言
2. 実際の関数は「Stringを受け取る」関数
3. `x1` の型から見ると、`x1(new Object())` のような呼び出しが許される
4. **でも実際の関数は String しか受け取れない！危険！**

```text
呼び出し: x1(new Object())
         ↓ AnyRef型の値（Objectかもしれない）
実際の関数: (s: String) => s.toUpperCase
         ↑ String型を期待
結果: ❌ Object は String ではないのでクラッシュする！
```

##### 実例で理解する

```scala
// ✅ ケース1：広い型を受け取る関数 → 狭い型を受け取る場面で使う
def processAnyObject(obj: AnyRef): Unit = {
  println(s"何でも処理できます: $obj")
}

// これを「String専門」の場面で使う
val stringProcessor: String => Unit = processAnyObject  // ✅ OK
stringProcessor("hello")  // 問題なし
// 「何でも処理できる関数」を「String専門の場面」で使う → 安全


// ❌ ケース2：狭い型を受け取る関数 → 広い型を受け取る場面で使う
def processString(s: String): Unit = {
  println(s.toUpperCase)  // String専用のメソッドを使う
}

// これを「何でもOK」の場面で使おうとする
val anyRefProcessor: AnyRef => Unit = processString  // ❌ コンパイルエラー
// anyRefProcessor(new Object())  // もし許されたら、クラッシュする！
// 「String専門の関数」を「何でもOKの場面」で使う → 危険！
```

##### まとめ：反変の直感

```text
継承関係: String <: AnyRef

関数の引数型は「逆転」する（反変）:

(String => R) <: (AnyRef => R)
     ↑              ↑
 狭い型を受ける   広い型を受ける

理由：
- 「広い型を受ける関数」= 何でも対応できる
  → 「狭い型を受ける場面」で使っても安全

- 「狭い型を受ける関数」= 特定の型専用
  → 「広い型を受ける場面」で使うと危険
```

## 型境界（Type Bounds）

型パラメータに制約を付けて、特定の型やそのサブタイプのみを受け入れるようにできます。

### 上限境界（Upper Bound）

どのようなを型を継承しているかを指定する

```scala
// T は Animal 以下の型（サブタイプ）でなければならない
def printAnimal[T <: Animal](animal: T): Unit =
  println(animal)

printAnimal(new Dog)  // OK
// printAnimal("string")  // コンパイルエラー
```

### 下限境界（Lower Bound）

これは、共共パラメータとともによく出現するらしい。

```scala
// T は Dog 以上の型（スーパータイプ）でなければならない
def addDog[T >: Dog](list: List[T]): List[T] =
  new Dog :: list //先頭に Dog を追加
```

## 型パラメータのポイント

- **型安全性**: コンパイル時に型チェックが行われ、実行時エラーを防ぐ
- **再利用性**: 同じコードを異なる型で使い回せる
- **変性の理解**: 共変・反変を適切に使い分けることで、柔軟で安全なAPIを設計できる
