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

## 変性（Variance）とは何か？

### 用語の正確化

```text
型パラメータ：T（ジェネリック型定義時のプレースホルダー）
ジェネリック型：Box[T]（型パラメータを含む型定義）
具体的な型：Dog、Animal（実際に存在する型）
型の継承関係：Dog <: Animal（具体的な型同士の関係）
```

### 問題の背景

```scala
class Dog extends Animal        // ← 具体的な型の継承関係
trait Box[T]                    // ← ジェネリック型（T は型パラメータ）

val dogBox: Box[Dog] = new Box[Dog]()

// Dog <: Animal という関係があるのに、
// Box[Dog] と Box[Animal]（型パラメータを具体型で置き換えたジェネリック型）の関係は？
val animalBox: Box[Animal] = dogBox  // ← これはOK？NG？
```

**問題：「具体的な型の継承関係（`Dog <: Animal`）が、ジェネリック型を通したときにどう伝播するのか？」**

### 変性の本質：「ジェネリック型を具体的な型で置き換えたとき、元の型の継承関係がどう扱われるか」

**具体的な型の継承関係（`Dog <: Animal`）が、ジェネリック型のサブタイプ関係に対して：**

1. **【転移】される** → 共変（`[+T]`）：`Box[Dog] <: Box[Animal]`
2. **【逆転】される** → 反変（`[-T]`）：`Handler[Animal] <: Handler[Dog]`
3. **【無視】される** → 不変（`[T]`）：`Box[Dog]` と `Box[Animal]` は無関係

Upper Bound や Lower Bound の話ではなく、**型パラメータを具体的な型で置き換えたときに、元々あった型の継承関係がどう伝播するか**という話です。

```text
具体的な型の継承関係：Dog <: Animal

↓ ジェネリック型 Box[T] に代入すると

┌─────────────────────────────────────────────────────────────┐
│ 共変（Covariant）[+T]：関係が【転移】される               │
├─────────────────────────────────────────────────────────────┤
│ Dog <: Animal  →  Box[Dog] <: Box[Animal]                  │
│                  （関係がそのまま伝播）                      │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ 反変（Contravariant）[-T]：関係が【逆転】される           │
├─────────────────────────────────────────────────────────────┤
│ Dog <: Animal  →  Handler[Animal] <: Handler[Dog]         │
│                  （関係が逆転する）                          │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ 不変（Invariant）[T]：関係が【無視】される                 │
├─────────────────────────────────────────────────────────────┤
│ Dog <: Animal だが  →  Box[Dog] と Box[Animal] は無関係   │
│                       （型パラメータの関係が途絶える）       │
└─────────────────────────────────────────────────────────────┘
```

### 直感的な理解

```scala
【共変の例】図書館の返却ボックス

class ReturnBox[+T] {
  def getItem(): T  // 取り出すだけ
}

「犬用の返却ボックス」を「動物用の返却ボックス」として使える？
 ✅ YES！犬を入れるように作ったボックスから、動物として取り出しても安全
   （犬は動物的に扱えるから）

【反変の例】動物処理施設

class Processor[-T] {
  def process(item: T): Unit  // 処理を加える
}

「動物処理できる施設」を「犬処理専用」の施設として使える？
 ✅ YES！動物全般を処理できる施設なら、犬だけ処理させるのは安全
   （施設は何でも処理できるから）
```

### より詳しい説明

- **型パラメータ `T` の役割**：ジェネリック型 `Box[T]` の定義時のプレースホルダー
- **変性が決めること**：「T に具体的な型（Dog、Animal など）を代入したとき、元々あった型の継承関係がどう伝播するか」
- **共変 `[+T]`** = 「関係がそのまま伝播」：`Box[Dog] <: Box[Animal]`
- **反変 `[-T]`** = 「関係が逆転」：`Handler[Animal] <: Handler[Dog]`
- **不変 `[T]`** = 「関係が無視される」（デフォルト）

### 具体例：共変（Covariant）`[+T]`

**特性**：型パラメータを**返す/読み取る側**でのみ使用

```scala
class Box[+T](val value: T)  // 共変：T を返すだけ

trait Animal
class Dog extends Animal

val dogBox: Box[Dog] = new Box(new Dog)
val animalBox: Box[Animal] = dogBox  // ✅ OK! Dog <: Animal なので Box[Dog] <: Box[Animal]
```

**直感**：「犬のボックス」は「動物のボックス」として扱える（犬は動物だから）

**制約**：共変パラメータは、受け取る側（メソッドの引数）では使えない
実際の問題では以上のように理解しても良い。

```scala
// ❌ これはコンパイルエラー（T が共変だから）
class BadBox[+T] {
  def put(item: T): Unit = ???  // 引数に使っているので不可
}

// ✅ これはOK（T を返すだけ）
class GoodBox[+T](val value: T) {
  def get: T = value
}
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

### 具体例：反変（Contravariant）`[-T]`

**特性**：型パラメータを**受け取る/消費する側**でのみ使用

```scala
// 反変：A を受け取る（消費する）だけ
trait Printer[-A] {
  def print(a: A): Unit
}

class Dog extends Animal
trait Animal

val dogPrinter: Printer[Dog] = new Printer[Dog] {
  def print(a: Dog): Unit = println("犬を印刷しました")
}

// ⚠️ 注目：型が「逆転」する
val animalPrinter: Printer[Animal] = dogPrinter  // ✅ OK! Dog <: Animal なので Printer[Animal] <: Printer[Dog]
```

**直感**：「犬専用プリンター」は「動物用プリンター」として使える
なぜなら、どんな動物でも印刷できる汎用性を想定していた場所で、犬特化型を代入しても、実際には犬が来だけだから安全。

**反変が逆転する理由**：

```text
Dog <: Animal のとき

プリンター側：
- "動物のプリンター" = 何でも印刷できる（Animal全般対応）
- "犬のプリンター" = 犬だけ（Dog特化）

どっちが「応用度が広い」？ → 動物のプリンターの方が広い

だから：Printer[Animal] > Printer[Dog]  （逆転！）
```

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

## 型境界（Type Bounds）と変性の関係

型パラメータに制約を付けて、特定の型やそのサブタイプのみを受け入れるようにできます。

### 上限境界（Upper Bound）`[T <: Animal]`

**意味**：T は`Animal`かそのサブタイプ（子型）に限定

```scala
// T は Animal 以下の型（サブタイプ）でなければならない
def printAnimal[T <: Animal](animal: T): Unit =
  println(animal.sound())  // Animal のメソッドが使える

printAnimal(new Dog)     // ✅ OK (Dog <: Animal)
printAnimal(new Cat)     // ✅ OK (Cat <: Animal)
// printAnimal("string")  // ❌ String は Animal ではない
```

**使い道**：より具体的な型に限定したい

### 下限境界（Lower Bound）`[T >: Dog]`

**意味**：T は`Dog`かそのスーパータイプ（親型）に限定

```scala
// T は Dog 以上（Dog の親型）でなければならない
def addDog[T >: Dog](list: List[T]): List[T] =
  new Dog :: list  // 先頭に Dog を追加

addDog(List[Dog]())          // ✅ OK
addDog(List[Animal]())       // ✅ OK (Animal >: Dog)
addDog(List[AnyRef]())       // ✅ OK (AnyRef >: Dog)
// addDog(List[Corgi]())      // ❌ Corgi <: Dog（Dog の方が親）
```

### Lower Bound が共変と使われる理由

**Stackの例で理解する**：

```scala
trait Stack[+A] {  // 共変
  def push[E >: A](e: E): Stack[E]  // ← Lower Bound!
}
```

```text
状況：Stack[Dog] がある
      Dog を含む Stack に Integer を push したい

E >: A つまり E >: Dog という制約により：
  - E = Dog ？ → OK/（Integer を Dog に？）❌ 不可
  - でも Integer は AnyRef、Dog も AnyRef のサブ
  - なので結果は Stack[AnyRef] になる
```

**なぜ必要か**：
共変 `[+A]` では T を引数に受け取れない。でも push はデータを受け取る必要がある。
そこで Lower Bound `[E >: A]` を使って、A より大きい型ならOKという制約を付ける。

```text
言い換え：
- Stack[Dog]: 犬を含むスタック
- push[E >: Dog]: Dog 以上の型を受け取れる
- push(integer): Integer は Dog より大きい型なので OK
- 結果：Stack[AnyRef] になる（安全）
```

## 型パラメータのポイント

- **型安全性**: コンパイル時に型チェックが行われ、実行時エラーを防ぐ
- **再利用性**: 同じコードを異なる型で使い回せる
- **変性の理解**: 共変・反変を適切に使い分けることで、柔軟で安全なAPIを設計できる
