---
tags:
  - Scala
  - Function
  - Functional Programming
create_at: 2026-02-08
updated_at: 2026-02-08
status: active
---

# Scalaの関数

Scalaにおける関数の定義、使用方法、および関数型プログラミングの基本概念について解説します。

## 関数の基本

### メソッド定義（def）

最も一般的な関数定義方法は `def` キーワードを使用します：

```scala
def add(x: Int, y: Int): Int = x + y

def greet(name: String): String = s"Hello, $name!"

// 複数行の関数
def factorial(n: Int): Int = {
  if (n <= 1) 1
  else n * factorial(n - 1)
}
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

## カリー化（Currying）

複数の引数リストを持つ関数を定義できます：

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

## 関数合成

関数を組み合わせて新しい関数を作成できます。

### compose と andThen

```scala
val addOne = (x: Int) => x + 1
val double = (x: Int) => x * 2

// compose: f compose g = f(g(x))
val addOneThenDouble = double compose addOne
addOneThenDouble(5)  // 12  (5 + 1) * 2

// andThen: f andThen g = g(f(x))
val doubleAndThenAddOne = double andThen addOne
doubleAndThenAddOne(5)  // 11  (5 * 2) + 1

// 複数の関数を合成
val f = ((x: Int) => x + 1) andThen (_ * 2) andThen (_ - 3)
f(5)  // 9  ((5 + 1) * 2) - 3
```

### 複雑な例

```scala
// 文字列処理の合成
val trim = (s: String) => s.trim
val toUpperCase = (s: String) => s.toUpperCase
val addExclamation = (s: String) => s + "!"

val processString = trim andThen toUpperCase andThen addExclamation
processString("  hello world  ")  // "HELLO WORLD!"

// リストを使った関数合成
def composeFunctions[A](functions: List[A => A]): A => A = {
  functions.reduceLeft(_ andThen _)
}

val pipeline = composeFunctions(List(
  (x: Int) => x + 10,
  (x: Int) => x * 2,
  (x: Int) => x - 5
))

pipeline(5)  // 25  ((5 + 10) * 2) - 5
```

## メソッドと関数の違い

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

### メソッドと関数の使い分け

```scala
// メソッド：クラスのメンバーとして定義
class Calculator {
  def add(x: Int, y: Int): Int = x + y  // メソッド

  // デフォルト引数（メソッドのみ）
  def multiply(x: Int, y: Int = 2): Int = x * y

  // 型パラメータ（メソッドで使いやすい）
  def identity[A](x: A): A = x
}

// 関数：値として扱う
val add: (Int, Int) => Int = (x, y) => x + y

// 関数は変数に代入したり、引数として渡せる
def applyOperation(x: Int, y: Int, op: (Int, Int) => Int): Int = {
  op(x, y)
}

applyOperation(3, 5, add)  // 8
applyOperation(3, 5, _ * _)  // 15
```

## ByName パラメータ

引数の評価を遅延させることができます：

```scala
// 通常のパラメータ（call-by-value）
def log(message: String): Unit = {
  println(s"[LOG] $message")
}

// ByNameパラメータ（call-by-name）
def logLazy(message: => String): Unit = {
  println(s"[LOG] $message")
}

// 違いの例
def expensive(): String = {
  println("計算中...")
  Thread.sleep(1000)
  "結果"
}

log(expensive())       // "計算中..." が先に表示される
logLazy(expensive())   // log関数内で評価される

// 条件付き評価での利用
def ifThen[A](condition: Boolean)(thenClause: => A)(elseClause: => A): A = {
  if (condition) thenClause else elseClause
}

ifThen(5 > 3) {
  println("5は3より大きい")
  "true branch"
} {
  println("この行は実行されない")
  "false branch"
}
```

## 再帰関数

### 普通の再帰

```scala
def factorial(n: Int): Int = {
  if (n <= 1) 1
  else n * factorial(n - 1)
}

// 問題：スタックオーバーフローの危険
// factorial(10000)  // StackOverflowError
```

### 末尾再帰最適化

```scala
import scala.annotation.tailrec

@tailrec
def factorialTailRec(n: Int, accumulator: Int = 1): Int = {
  if (n <= 1) accumulator
  else factorialTailRec(n - 1, n * accumulator)
}

// 末尾再帰は最適化されてループに変換される
factorialTailRec(10000)  // OK

// 末尾再帰でないとコンパイルエラー
@tailrec
def fibonacci(n: Int): Int = {
  if (n <= 1) n
  else fibonacci(n - 1) + fibonacci(n - 2)  // コンパイルエラー！
}

// 末尾再帰版のフィボナッチ
@tailrec
def fibonacciTailRec(n: Int, a: Int = 0, b: Int = 1): Int = {
  if (n == 0) a
  else fibonacciTailRec(n - 1, b, a + b)
}
```

## まとめ

### 関数定義の方法

| 方法             | 構文                         | 用途                       |
| ---------------- | ---------------------------- | -------------------------- |
| メソッド         | `def f(x: Int): Int = x + 1` | クラスのメンバー、再帰関数 |
| 匿名関数         | `(x: Int) => x + 1`          | 高階関数の引数、短い処理   |
| プレースホルダー | `_ + 1`                      | さらに短い記法             |

### 関数型プログラミングの要素

- **高階関数**：関数を引数や戻り値にする
- **カリー化**：複数の引数リストで柔軟性を高める
- **部分適用**：一部の引数を固定した新しい関数を作る
- **関数合成**：小さな関数を組み合わせて複雑な処理を構築
- **遅延評価**：ByNameパラメータで必要な時だけ評価
- **末尾再帰最適化**：安全な再帰処理

## 関連リンク

- [type-parameter](type-parameter.md) - Scalaの型パラメータとジェネリクス
- Scalaの他の関数型プログラミング概念：モナド、for内包表記、パターンマッチング
