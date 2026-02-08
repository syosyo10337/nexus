---
tags:
  - scala
  - function
  - functional-programming
created: 2026-02-08
updated_at: 2026-02-08
status: active
---

# Scalaの関数

Scalaにおける関数の定義、使用方法、および関数型プログラミングの基本概念について解説します。

## 関数の基本

Scalaの関数は、他の言語の関数と扱いが異なります。Scalaの関数は単に Function0 〜 Function22 までのトレイトの無名サブクラスのインスタンスなのです。

Function0からFunction22までの全ての関数は引数の数に応じたapplyメソッドを定義する必要があります。 applyメソッドはScalaコンパイラから特別扱いされ、x.apply(y)は常にx(y)のように書くことができます。後者の方が関数の呼び方としては自然ですね。

## 無名関数

Function0~22のによって毎回定義すると冗長になるので糖衣構文(syntax sugar)では、無名関数を使うことができます。

例えば

```scala
val add = new Function2[Int, Int, Int]{
  def apply(x: Int, y: Int): Int = x + y
}
//これは、syntax sugarを使うと,以下のように書ける、関数オブジェクトを代代入ていますね。
val add = (x: Int, y: Int) => x + y
```

これは、無名関数をaddという変数に代入しており、無名関数自体はFunctionNオブジェクトなので、自由に引数や変数に大遠敷したり、返り値として扱うことができます。これらの性質を指して、関数はScalaにおいては、First Clas Objectであるといいます。

> tips
>
> ```scala
> //一般的な無名関数の構文
> (n1: N1, n2: N2, n3: N3, ...nn: NN) => B
> ```

## 関数の型

関数オブジェクトで定義されているということは`FunctionN[]`のように記述しないといけないはずですが、こちらについてもsyntax sugarが定義されています。

```scala
(N1, N2, N3, ...NN) => Bの型
```

## カリー化（Currying）

複数の引数を取る関数を、1つの引数を取る関数の連鎖に変換する技法です。数学者のHaskell Curryにちなんで名付けられました。

```scala
// 通常の関数
def add(x: Int, y: Int): Int = x + y
add(3, 5)  // 8

// カリー化された関数
def addCurried(x: Int)(y: Int): Int = x + y
addCurried(3)(5)  // 8

// 部分適用が可能
val add5 = addCurried(5)_  // Int => Int
add5(10)  // 15
add5(20)  // 25
```

### カリー化の利点

```scala
// 設定を先に固定して、後でデータを処理
def formatMessage(prefix: String)(suffix: String)(message: String): String = {
  s"$prefix $message $suffix"
}

val infoLogger = formatMessage("[INFO]")("[END]")_
val errorLogger = formatMessage("[ERROR]")("[END]")_

infoLogger("システム起動")     // [INFO] システム起動 [END]
errorLogger("エラー発生")      // [ERROR] エラー発生 [END]

// 畳み込みでの使用例
def foldLeft[A, B](list: List[A])(z: B)(f: (B, A) => B): B = {
  list match {
    case Nil => z
    case head :: tail => foldLeft(tail)(f(z, head))(f)
  }
}

val numbers = List(1, 2, 3, 4, 5)
foldLeft(numbers)(0)(_ + _)  // 15
```

## メソッドと関数の違い

- メソッドとは,defで定義されるもの
  Scalaでは「メソッド」と「関数」は異なる概念です：

```scala
// メソッド（def）
def addMethod(x: Int, y: Int): Int = x + y

// 関数（Function 型のオブジェクト）
val addFunction = (x: Int, y: Int) => x + y
val addFunction2: (Int, Int) => Int = (x, y) => x + y

// 型の違い
// addMethod は (Int, Int) => Int ではなく、メソッド型
// addFunction は Function2[Int, Int, Int] 型
```

### メソッドから関数への変換（η展開）

```scala
def multiply(x: Int, y: Int): Int = x * y

// メソッドを関数に変換（η展開）
val multiplyFunction = multiply _  // (Int, Int) => Int

// 高階関数に渡す際は自動的に変換される
val numbers = List(1, 2, 3, 4, 5)
numbers.map(multiply(2, _))  // メソッドが自動的に関数に変換される

// 明示的に変換
val doubled = numbers.map(x => multiply(2, x))
```

### 戻り値の型推論

戻り値の型は省略可能（ただし再帰関数では必須）：

```scala
def multiply(x: Int, y: Int) = x * y  // Int と推論される

// 再帰関数では戻り値の型が必須
def fibonacci(n: Int): Int = {
  if (n <= 1) n
  else fibonacci(n - 1) + fibonacci(n - 2)
}
```

### Unit型（返り値なし）

副作用のみを持つ関数は `Unit` 型を返します：

```scala
def printSum(x: Int, y: Int): Unit = {
  println(x + y)
}

// = を省略すると Unit 型と推論される
def log(message: String) {
  println(s"[LOG] $message")
}
```

## 匿名関数（ラムダ式）

名前を持たない関数を定義できます：

```scala
// 基本形
val add = (x: Int, y: Int) => x + y

// 型を明示的に指定
val multiply: (Int, Int) => Int = (x, y) => x * y

// 複数行の匿名関数
val isEven = (n: Int) => {
  val remainder = n % 2
  remainder == 0
}

// 使用例
add(3, 5)        // 8
multiply(4, 2)   // 8
isEven(10)       // true
```

### プレースホルダー構文（\_）

引数が一度だけ使われる場合、`_` で省略可能：

```scala
val numbers = List(1, 2, 3, 4, 5)

// 通常の書き方
numbers.map(x => x * 2)        // List(2, 4, 6, 8, 10)

// プレースホルダー構文
numbers.map(_ * 2)             // List(2, 4, 6, 8, 10)
numbers.filter(_ > 3)          // List(4, 5)
numbers.reduce(_ + _)          // 15

// 複数の引数
val sum = (_: Int) + (_: Int)
sum(3, 5)  // 8
```

## 高階関数

関数を引数として受け取ったり、関数を返す関数を高階関数と呼びます。

### 関数を引数に取る

```scala
def applyTwice(f: Int => Int, x: Int): Int = {
  f(f(x))
}

val double = (x: Int) => x * 2
applyTwice(double, 3)  // 12 (3 * 2 * 2)

// map, filter, reduce などは高階関数
val numbers = List(1, 2, 3, 4, 5)
numbers.map(_ * 2)                    // List(2, 4, 6, 8, 10)
numbers.filter(_ % 2 == 0)            // List(2, 4)
numbers.reduce((a, b) => a + b)       // 15
```

### 関数を返す関数

```scala
def multiplyBy(factor: Int): Int => Int = {
  (x: Int) => x * factor
}

val double = multiplyBy(2)
val triple = multiplyBy(3)

double(5)  // 10
triple(5)  // 15

// より複雑な例：加算器ファクトリー
def makeAdder(base: Int): Int => Int = {
  x => x + base
}

val add10 = makeAdder(10)
val add100 = makeAdder(100)

add10(5)   // 15
add100(5)  // 105
```

### Loan パターン

高階関数を使うリソース管理のイディオムとして、Loanパターンがあります。
詳細は [loan-pattern](../Programming/loan-pattern.md) を参照してください。

## 部分適用（Partial Application）

一部の引数だけを適用した関数を作成できます：

```scala
def multiply(x: Int, y: Int, z: Int): Int = x * y * z

// 最初の引数だけを固定
val multiplyBy2 = multiply(2, _: Int, _: Int)
multiplyBy2(3, 4)  // 24

// 複数の引数を固定
val multiplyBy2And3 = multiply(2, 3, _: Int)
multiplyBy2And3(4)  // 24

// カリー化と組み合わせる
def curriedMultiply(x: Int)(y: Int)(z: Int): Int = x * y * z

val step1 = curriedMultiply(2)_    // (Int)(Int) => Int
val step2 = step1(3)_               // Int => Int
step2(4)                            // 24
```

## WIP: ByName パラメータ

引数の評価を遅延させることができます：

## 関連リンク

- [type-parameter](type-parameter.md) - Scalaの型パラメータとジェネリクス
- [loan-pattern](../Programming/loan-pattern.md) - Loanパターン（リソース管理のイディオム）
- Scalaの他の関数型プログラミング概念：モナド、for内包表記、パターンマッチング
