---
tags: [programming, functional-programming, scala, adt]
updated: 2026-01-29
status: draft
---

# 代数的データ型（Algebraic Data Types, ADT）

## ADT とは

代数的データ型（ADT）は、**型を「組み合わせ」で定義する**関数型プログラミングの基本概念です。
その名称は、型を**積（AND）**と**和（OR）**という代数的な操作で組み合わせることに由来します。

---

## 2つの基本パターン

### 1. 積型(AND)（Product Type）— 「A かつ B」

複数の値を**同時に持つ**型です。Scala では主に `case class` で表現します。

```scala
// 名前（String）「かつ」年齢（Int）を持つ
case class Person(name: String, age: Int)

val p = Person("Alice", 30)
```

**なぜ「積」と呼ぶのか？**
その型が取りうる状態の総数が、各要素の取りうる状態の**積（掛け算）**になるからです。
例：`Person` の状態数 = `String` の状態数 × `Int` の状態数

### 2. 和型(OR)（Sum Type）— 「A または B」

複数の選択肢の**いずれか一つ**を表す型です。Scala では `sealed trait`（または `sealed abstract class`）と `case class` の組み合わせで表現します。

```scala
// 成功（Success）「または」失敗（Failure）
sealed trait Result
case class Success(value: Int) extends Result
case class Failure(message: String) extends Result

val r: Result = Success(42)  // Success か Failure のどちらか一方
```

**なぜ「和」と呼ぶのか？**
その型が取りうる状態の総数が、各選択肢の取りうる状態の**和（足し算）**になるからです。
例：`Result` の状態数 = `Success` の状態数 + `Failure` の状態数

---

## 実用例：標準ライブラリの `Option`

「値があるかないか」を表現する、最も有名な ADT の一つです。

```scala
sealed trait Option[+A]
case class Some[A](value: A) extends Option[A]
case object None extends Option[Nothing]

// 使用例
def findUser(id: Int): Option[User] = 
  if (exists(id)) Some(getUser(id)) else None
```

---

## パターンマッチングとの組み合わせ

ADT の真価は、**パターンマッチング**と組み合わせた時に発揮されます。

```scala
sealed trait Shape
case class Circle(radius: Double) extends Shape
case class Rectangle(width: Double, height: Double) extends Shape

def area(s: Shape): Double = s match {
  case Circle(r)       => math.Pi * r * r
  case Rectangle(w, h) => w * h
}
```

- **網羅性の保証**: `sealed` を使用することで、`match` 式でケースが不足している場合にコンパイラが警告を出してくれます。

---

## なぜ ADT が重要か

| メリット | 説明 |
| :--- | :--- |
| **網羅性チェック** | `sealed` により、パターンマッチの漏れをコンパイル時に検出できる |
| **不正な状態の排除** | 「ありえない状態」を型レベルで表現不能にし、バグを未然に防ぐ |
| **不変性 (Immutable)** | `case class` はデフォルトで不変であり、副作用の少ないコードに寄与する |
| **null の排除** | `Option` や `Either` を使うことで、安全に欠損値やエラーを扱える |

---

## まとめ

代数的データ型 = 「積型 (case class)」 + 「和型 (sealed trait + case class)」

これを用いることで、**データの構造を型で厳密に表現**し、コンパイラの支援を受けて安全なコードを記述できます。
Haskell や ML 系言語では言語の中核機能ですが、Scala ではこれをオブジェクト指向の継承の仕組みを応用してエレガントに実現しています。
