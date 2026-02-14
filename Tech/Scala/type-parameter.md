---
tags:
  - Scala
  - Type System
  - Generics
created: 2026-02-06
updated_at: 2026-02-14
status: active
---

# Scalaの型パラメータ

Scalaにおける型パラメータ（ジェネリクス）の記法と実装について解説します。変性やサブタイプ関係の理論的な背景については [variance-and-subtyping](../Programming/variance-and-subtyping.md) を参照してください。

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

## Scalaにおける変性（Variance）

変性の理論的な背景については [variance-and-subtyping](../Programming/variance-and-subtyping.md) を参照してください。ここではScalaでの具体的な記法と実装例を解説します。

### 変性とは何か？—「席に座れるか」の問題

**基本的な問題**：サブタイプ関係が容器（ジェネリクス）に伝播するのか？

- `Dog <: Animal` であることは明らか
- では `Box[Dog] <: Box[Animal]` か？`List[Dog] <: List[Animal]` か？

答え：「容器が何をするか」によって決まる

#### 容器の役割による分類

1. **読む専用**（`get` や戻り値）→ **共変** `[+T]` が安全
   - `Box[Dog]` は `Box[Animal]` の「席に座れる」理由：読む側は Animal を期待しているが、Dog の情報の方がより具体的で安全

2. **書く専用**（`set` や引数）→ **反変** `[-T]` が安全
   - `Handler[Animal]` は `Handler[Dog]` の「席に座れる」理由：書く側は Dog を入れたいが、Handler は Animal を受け付けるので安全

3. **読み書き両方** → **不変** `[T]` のみ
   - 関連性がない

### 変性の記法

Scalaでは型パラメータに記号を付けて変性を指定します：

- **共変（Covariant）**：`[+T]`
- **反変（Contravariant）**：`[-T]`
- **不変（Invariant）**：`[T]`（デフォルト）

```scala
class CovariantBox[+T]        // 共変
class ContravariantBox[-T]    // 反変
class InvariantBox[T]         // 不変（デフォルト）
```

### 共変（Covariant）`[+T]` の実装例

**特性**：型パラメータを**返す/読み取る側**でのみ使用

```scala
trait Animal
class Dog extends Animal
class Cat extends Animal

// 共変：T を返すだけ
class Box[+T](val value: T) {
  def get: T = value
}

val dogBox: Box[Dog] = new Box(new Dog)
val animalBox: Box[Animal] = dogBox  // ✅ OK! Box[Dog] <: Box[Animal]
```

#### 制約：入力ポジションでは使えない

```scala
// ❌ これはコンパイルエラー
class BadBox[+T] {
  def put(item: T): Unit = ???  // 共変パラメータは引数に使えない
}

// ✅ これはOK
class GoodBox[+T](val value: T) {
  def get: T = value  // 戻り値なのでOK
}
```

#### 不変の場合の危険性

読み書き両方できる容器は、サブタイプ関係を伝播させると壊れます：

```scala
class MutableBox[A](var value: A) {
  def get: A = value
  def set(a: A): Unit = { value = a }
}

// もしMutableBoxを共変にできたら...
val dogBox: MutableBox[Dog] = new MutableBox(new Dog)
val animalBox: MutableBox[Animal] = dogBox  // もしこれが許されたら...

animalBox.set(new Cat)  // 💥 Animal型なのでCatも入れられてしまう！
// でも dogBox.get は Dog を期待 → Catが返ってきて壊れる
```

#### Stackの実装例

共変を理解するための実践的な例：

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

### 反変（Contravariant）`[-T]` の実装例

**特性**：型パラメータを**受け取る/消費する側**でのみ使用

#### 獣医の例

```scala
trait Animal { def name: String }
class Dog extends Animal { def name = "犬" }
class Cat extends Animal { def name = "猫" }

// 反変：A を受け取る（診察する）だけ
trait Vet[-A] {
  def treat(animal: A): Unit
}

val animalVet: Vet[Animal] = new Vet[Animal] {
  def treat(animal: Animal): Unit = println(s"${animal.name}を診察しました")
}

// Vet[Animal] <: Vet[Dog] なので、Vet[Dog]の席に座れる
val dogVet: Vet[Dog] = animalVet  // ✅ OK!
```

**なぜ逆転するのか**：`Vet[Animal]`（汎用獣医）は「何でも受け入れる」ので、`Vet[Dog]`（犬専門獣医）の席にも座れる。逆に`Vet[Dog]`を`Vet[Animal]`の席に座らせると、猫が来たときに対応できず危険。

#### Scalaの関数型における反変

Scalaの関数型 `Function1[-T, +R]` は引数型が反変、戻り値型が共変です：

```scala
// 継承関係: String <: AnyRef
// 関数の引数型は反変：
// (String => R) <: (AnyRef => R)  // 引数型が逆転！
```

##### ✅ OK なパターン

```scala
// (AnyRef => AnyRef) <: (String => AnyRef)
// String を受け取る関数の席に、AnyRef を受け取る関数を座らせる
val x1: String => AnyRef = (a: AnyRef) => a  // ✅ OK

// 呼び出し時
x1("hello")  // String を渡す → AnyRef の引数に渡される（安全）
```

**理由**：「AnyRefを受け取る関数」= 何でも対応できる → 「Stringを受け取る場面」で使っても安全

##### ❌ NG なパターン

```scala
// 「AnyRef => AnyRef」の席に「String => String」を座らせようとしている
//　しかし、String => String は AnyRef => AnyRef のサブタイプではないので、、
// AnyRef を受け取る関数の席に、String を受け取る関数を座らせる
val x2: AnyRef => AnyRef = (s: String) => s.toUpperCase  // ❌ コンパイルエラー

// もし許されたら...
// x2(new Object())  // Object を String専用関数に渡してクラッシュ！
```

**理由**：「Stringを受け取る関数」= String専用 → 「AnyRefを受け取る場面」で使うと危険

## 型境界（Type Bounds）

型パラメータに制約を付けて、特定の型やそのサブタイプのみを受け入れるようにできます。

### 上限境界（Upper Bound）`[T <: Animal]`

**意味**：T は`Animal`かそのサブタイプに限定

```scala
// T は Animal 以下の型（サブタイプ）でなければならない
def printAnimal[T <: Animal](animal: T): Unit =
  println(animal.sound())  // Animal のメソッドが使える

printAnimal(new Dog)     // ✅ OK (Dog <: Animal)
printAnimal(new Cat)     // ✅ OK (Cat <: Animal)
// printAnimal("string")  // ❌ String は Animal ではない
```

**使い道**：より具体的な型に限定したい場合

### 下限境界（Lower Bound）`[T >: Dog]`

**意味**：T は`Dog`かそのスーパータイプに限定

```scala
// T は Dog 以上（Dog の親型）でなければならない
def addDog[T >: Dog](list: List[T]): List[T] =
  new Dog :: list  // 先頭に Dog を追加

addDog(List[Dog]())          // ✅ OK
addDog(List[Animal]())       // ✅ OK (Animal >: Dog)
addDog(List[AnyRef]())       // ✅ OK (AnyRef >: Dog)
// addDog(List[Corgi]())      // ❌ Corgi <: Dog（Dog の方が親）
```

### Lower Bound と共変の組み合わせ

共変 `[+A]` では型パラメータを引数に受け取れませんが、Lower Bound `[E >: A]` を使うことで回避できます。これは共変の安全性を保ちながら、柔軟に入力を受け入れるための仕組みです。

#### なぜ `:>` が必要？「席に座る」メタファーで理解

**共変のルール**：`Box[Dog]` は `Box[Animal]` の席に座れる（昇格できる）

```scala
val dogBox: Box[Dog] = new Box(new Dog)
val animalBox: Box[Animal] = dogBox  // ✅ Dog は Animal の子型なので座れる
```

**問題**：共変の容器に値を入れるメソッドがあると危険

```scala
// もし Box が共変で put メソッドを持っていたら...
class BadBox[+T](var value: T) {  // 共変
  def put(item: T): Unit = { value = item }  // ❌ これはNG
}

val dogBox: BadBox[Dog] = new BadBox(new Dog)
val animalBox: BadBox[Animal] = dogBox  // 席に座った
animalBox.put(new Cat)  // Cat を入れてしまう!
val result: Dog = dogBox.get  // 💥 Cat が返ってくる！破壊される
```

**解決策**：Lower Bound を使って「受け入れられる上限」を柔軟に

```scala
trait Stack[+A] {  // 共変だから Stack[Dog] は Stack[Animal] の席に座れる
  def push[E >: A](e: E): Stack[E]  // ← E >: A で「A 以上の型なら受け入れる」
}

val dogStack: Stack[Dog] = new NonEmptyStack(new Dog, ...)
val animalStack: Stack[Animal] = dogStack  // ✅ Stack[Dog] は Stack[Animal] の席に座る

// push のときは何が起きるか
val newStack = dogStack.push(new Cat)
// E >: Dog という制約：Dog と Cat の共通の親は Animal
// → 戻り値は Stack[Animal] に拡張される
```

**`[E >: A]` の仕組み**：

- `E` は Dog「以上」（Dog の親型）でなければならない
- `push` に渡せるのは Dog か Dog の親型（Animal など）
- 結果の `Stack[E]` は、より汎用的な型に「昇格」する

#### 「席に座る」を共変・反変で比較

| 変性 | ルール                                                    | 「席に座る」の例                   | 入力時の対処法            |
| ---- | --------------------------------------------------------- | ---------------------------------- | ------------------------- |
| 共変 | `Dog <: Animal` ならば、`Box[Dog] <: Box[Animal]`         | Dog対応版が Animal対応の席に座れる | `[E >: A]` で上限を広げる |
| 反変 | `Dog <: Animal` ならば、`Handler[Animal] <: Handler[Dog]` | Animal対応版が Dog対応の席に座れる | 反変パラメータ自体が汎用  |

**直感的な理解**：

- **共変**：読むことに最適化 → 「具体的な Dog の情報を読む」ので、`Box[Dog]` は「より汎用的な Animal の席」つまり読む側の期待より詳しい情報を返せる
- **反変**：書くことに最適化 → 「何を受け付けるか」で見ると、`Handler[Animal]`（何でも受け付ける）は「Dog専門版の席」つまり書く側の期待より柔軟に対応できる

## Scalaの型パラメータまとめ

### 変性の記法と使い分け

| 変性 | 記法   | 使用ポジション     | サブタイプ関係                    |
| ---- | ------ | ------------------ | --------------------------------- |
| 共変 | `[+T]` | 出力（戻り値）のみ | `Box[Dog] <: Box[Animal]`         |
| 反変 | `[-T]` | 入力（引数）のみ   | `Handler[Animal] <: Handler[Dog]` |
| 不変 | `[T]`  | 入出力両方         | 無関係                            |

### 型境界の記法

| 境界     | 記法       | 意味                       | 例                         |
| -------- | ---------- | -------------------------- | -------------------------- |
| 上限境界 | `[T <: A]` | Tは`A`かそのサブタイプ     | `def f[T <: Animal](x: T)` |
| 下限境界 | `[T >: A]` | Tは`A`かそのスーパータイプ | `def push[E >: A](e: E)`   |

### ポイント

- **型安全性**: コンパイル時に型チェックが行われ、実行時エラーを防ぐ
- **再利用性**: 同じコードを異なる型で使い回せる
- **変性の理解**: 共変・反変を適切に使い分けることで、柔軟で安全なAPIを設計できる
- **型境界**: 型パラメータに制約を付けて、より厳密な型安全性を実現

## 関連リンク

- [variance-and-subtyping](../Programming/variance-and-subtyping.md) - 変性とサブタイプ関係の理論的背景
- Scalaの型システムの他の概念：型クラス、高カインド型など
