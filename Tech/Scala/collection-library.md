---
tags:
  - scala
  - collections
  - standard-library
created: 2026-02-08
updated_at: 2026-02-14
status: active
---

# Scalaのコレクションライブラリ

Scalaの標準コレクションライブラリの全体像と主要な使い方を整理します。

## 体系の全体像

Scalaのコレクションは大きく次の3系統に分かれます。

- **Seq**: 順序を持つコレクション
- **Set**: 重複を持たないコレクション
- **Map**: キーと値の組

それぞれに **不変 (immutable)** と **可変 (mutable)** があり、基本は不変を使うのが推奨です。

## 不変コレクション

```scala
import scala.collection.immutable

val nums = List(1, 2, 3)
val vec = Vector(1, 2, 3)
val set = Set(1, 2, 2, 3)   // Set(1, 2, 3)
val map = Map("a" -> 1, "b" -> 2)
```

### 代表的な型

- **List**: 先頭への追加が速い、線形走査
- **Vector**: ランダムアクセスが速い
- **Set**: 重複を排除する集合
- **Map**: キーで値を引く辞書

## 可変コレクション

```scala
import scala.collection.mutable

val buf = mutable.ArrayBuffer(1, 2, 3)
buf += 4

val set = mutable.Set(1, 2, 3)
set += 4

val map = mutable.Map("a" -> 1)
map += ("b" -> 2)

arr = Array(1, 2, 3)
arr(1) = 2 // arr[i]ではアクセスできません
```

**注意**: 変更可能なので、並行処理や共有状態では注意が必要です。

## Seqの具体例

```scala
val list = List(1, 2, 3)
val vector = Vector(1, 2, 3)

list.head        // 1
list.tail        // List(2, 3)
vector(1)        // 2
```

## List と Nil、:: （Cons）演算子

### List の構造

Scala の `List` は単語鎖構造で表現されます。
**先頭の要素**と**残りのリスト**に分割でき、その基底は空のリスト **`Nil`** です。

Listの先頭要素へのアクセスは高速にできる反面、要素へのランダムアクセスや末尾へのデータの追加は Listの長さに比例した時間がかかってしまうということが挙げられます。Listは関数型プログラミング言語で最も基本的なデータ構造

配列操作系のメソッドはこちらを参考に cf. <https://scala-text.github.io/scala_text/collection.html#foldleft%EF%BC%9A%E5%B7%A6%E3%81%8B%E3%82%89%E3%81%AE%E7%95%B3%E3%81%BF%E8%BE%BC%E3%81%BF>

```scala
List(1, 2, 3)
// 内部的には：1 :: (2 :: (3 :: Nil))
```

### Nil

`Nil` は空のリストを表す特別なオブジェクトです。

```scala
val empty = Nil       // List()
empty.isEmpty         // true

val list = List(1, 2, 3)
list.tail.tail.tail == Nil  // true
```

### :: （Cons 演算子）

コンスと呼びます。prepend
`::` は左辺の要素を右辺のリストの先頭に追加する演算子です（Cons = Construction）。

```scala
val list1 = 1 :: List(2, 3)     // List(1, 2, 3)
val list2 = 1 :: 2 :: 3 :: Nil  // List(1, 2, 3)
val list3 = 0 :: List(1, 2, 3)  // List(0, 1, 2, 3)
```

`1 :: Nil`という記法は、中置表記と:で終わるメソッドの特殊ルールを組みあわせてものになっているらしい。
// 見た目：1のメソッドを呼んでいるように見える
// 実際：Nil.::(1) ← Nilのメソッドとして呼ばれる！

#### 練習: 自作map

```scala

def map[T, U](list: List[T])(f: T => U): List[U] = {
    list.foldLeft(Nil: List[U])((acc, elem) => f(elem) :: acc
    ).reverse
}
```

### ++ （リスト連結演算子）

`++` は2つのリストを連結します。

```scala
val list1 = List(1, 2)
val list2 = List(3, 4)
val combined = list1 ++ list2  // List(1, 2, 3, 4)

// 複数回の連結
val list3 = List(1) ++ List(2) ++ List(3)  // List(1, 2, 3)

// :: との組み合わせ
val list4 = 0 :: (List(1, 2) ++ List(3, 4))  // List(0, 1, 2, 3, 4)
```

**注意**：`++` は新しいリストを返すため、大きなリストの連結は性能に影響します。

**パターンマッチングでの利用**：

```scala
val list = List(1, 2, 3)

list match {
  case head :: tail => println(s"頭：$head、尾：$tail")
  // 出力：頭：1、尾：List(2, 3)

  case Nil => println("空リスト")
}

// ネストしたマッチ
list match {
  case first :: second :: rest => println(s"最初：$first、次：$second、残り：$rest")
  // 出力：最初：1、次：2、残り：List(3)

  case _ => println("その他")
}
```

### Scalaの0引数メソッドの呼び出し

Scalaでは、0引数メソッドを定義する際に `()` の有無を選択でき、**呼び出し時の記法が異なります**。これは混乱しやすいので注意が必要です。

#### 定義形式と呼び出し

```scala
// 形式1：() なし で定義
def isEmpty: Boolean = ???
isEmpty  // () なし で呼び出す（必須）

// 形式2：() あり で定義
def isEmpty(): Boolean = ???
isEmpty()  // () あり で呼び出す（必須）
```

#### 実例

```scala
val list = List(1, 2, 3)

// mkString() は () ありで定義されているので、() 必須
list.mkString()         // ""
list.mkString(",")      // "1,2,3"

// isEmpty は () なしで定義されているので、() なし
list.isEmpty            // false

// 間違い
// list.isEmpty()        // ❌ コンパイルエラー（定義に () がないので）
// list.mkString          // ❌ コンパイルエラー（定義に () があるので）
```

#### 規則

| 定義形式          | 呼び出し形式   | 例                |
| ----------------- | -------------- | ----------------- |
| `def method: T`   | `obj.method`   | `list.isEmpty`    |
| `def method(): T` | `obj.method()` | `list.mkString()` |

**注意**：設計者は副作用のない読み取り専用のメソッドは `()` なし（例：`isEmpty`）、
副作用を持つメソッドは `()` あり（例：`println()`）で定義する傾向があります。

### foldLeft と foldRight

`foldLeft` と `foldRight` はリストを左から（または右から）走査しながら値を蓄積するメソッドです。

#### foldLeft（左から右へ）

```scala
def foldLeft[B](z: B)(f: (B, A) => B): B   // 左→右

def reverse[T](list: List[T]): List[T] = {
    val reducer = (acc: List[T], elem: T) => elem :: acc

    list.foldLeft(Nil)(reducer)
}
reversre(List(1, 2, 3))  // List(3, 2, 1)
```

#### foldRight（右から左へ）

```scala
// Bが累積値だよ。
def foldRight[B](z: B)(f: (A, B) => B): B  // 右→左

val nums = List(1, 2, 3, 4)

// foldRight[B](初期値)(累積関数)
nums.foldRight(0) { (n, acc) =>
  n + acc  // n: 現在の要素、acc: 累積値（順序が逆）
}
// 計算順序：1 + (2 + (3 + (4 + 0))) = 10

// より簡潔に
nums.foldRight(0)(_ + _)  // 10
```

**計算の流れ**：
最後の要素と初期値から計算 → その結果を使って前を計算
3 + 0 = 3
2 + 3 = 5
1 + 5 = 6 ← 結果

#### foldLeft vs foldRight

- **foldLeft**: 累積値が先の引数。左から右へ処理。大きなリストに向いている（末尾再帰最適化可能）。
- **foldRight**: 現在の要素が先の引数。右から左へ処理。小さなリストや特殊な計算に向いている。

```scala
val list = List(1, 2, 3)

// 足し算（可換）なので結果は同じ
list.foldLeft(0)(_ + _)   // 6
list.foldRight(0)(_ + _)  // 6

// 引き算（非可換）なので結果が異なる
list.foldLeft(0)(_ - _)   // ((0 - 1) - 2) - 3 = -6
list.foldRight(0)(_ - _)  // 1 - (2 - (3 - 0)) = 1 - (2 - 3) = 1 - (-1) = 2

// リスト構築
List(1, 2, 3).foldRight(List[Int]())(_ :: _)  // List(1, 2, 3)
```

#### foldLeftの練習

`def mkString[T](list: List[T])(sep: String): String = ???`
`この宣言のmkStringを自作する

```scala
def mkString[T](list: List[T])(sep: String): String = list match {
  case Nil => ""
  case head :: tail => tail.foldLeft(head.toString)((acc, elem) => acc + sep + elem)
}
```

#### 練習: 自作filter

````scala
def filter[T](list: List[T])(f: T => Boolean): List[T] = {
    list.foldLeft(Nil: List[T])((acc, elem) =>
        if (f(elem)) {
            elem :: acc
        } else {
            acc
        }
    ).reverse
}
```

#### 練習: 自作find
```scala
def find[T](list: List[T])(f: T => Boolean): Option[T] = list match {
  case x::xs if f(x) => Some(x)
  case x::xs => find(xs)(f)
  case _ => None
}
```

## Setの具体例

```scala
val set = Set(1, 2, 2, 3)
set.contains(2)  // true
set + 4          // Set(1, 2, 3, 4)
````

## Mapの具体例

```scala
val map = Map("a" -> 1, "b" -> 2)
map("a")                 // 1
map.get("c")             // None
map.getOrElse("c", 0)    // 0
```

## Range の具体例

Range は連続した数値の列を表す不変の Seq です。
`to` は終端を含み、`until` は終端を含みません。
we

```scala
val r1 = 1 to 5       // Range 1,2,3,4,5
val r2 = 1 until 5    // Range 1,2,3,4
val r3 = 0 to 10 by 2 // Range 0,2,4,6,8,10

r1.sum        // 15
r2.toList     // List(1, 2, 3, 4)
r3.contains(6) // true
```

## map の本質：「箱の中身を変換する」操作

`map` は配列専用の操作ではない。Scala では **「箱（コンテナ）の中身に関数を適用する」** という共通パターンとして、さまざまな型に定義されている。

```scala
List(1, 2, 3).map(_ * 2)       // List(2, 4, 6)    ← 各要素に適用
Some(3).map(_ * 2)              // Some(6)          ← 中身に適用
Future(3).map(_ * 2)            // Future(6)        ← 届いたら適用
```

| 型 | 箱の中身 | `map` の意味 |
|---|---|---|
| `List[A]` | 複数の値 | 各要素を変換 |
| `Option[A]` | 値が1つあるか、ないか | あれば変換、なければ `None` のまま |
| `Future[A]` | いずれ届く値 | 届いたら変換する「予約」 |

この共通パターンがわかると、`flatMap` や `for` 式が `List` 以外でも使える理由が理解できる。詳しくは [Future と Promise](Future-Promise.md) を参照。

## 主要な操作

### 変換系

```scala
val nums = List(1, 2, 3, 4, 5)
nums.map(_ * 2)           // List(2, 4, 6, 8, 10)
nums.filter(_ % 2 == 0)   // List(2, 4)
nums.flatMap(n => List(n, n * 10))  // List(1, 10, 2, 20, 3, 30, 4, 40, 5, 50)
```

### 集約系

```scala
nums.sum                  // 15
nums.product              // 120
nums.reduce(_ + _)        // 15
nums.foldLeft(0)(_ + _)   // 15
```

### 検索系

```scala
val nums = List(1, 2, 3, 4, 5)

nums.find(_ > 3)          // Some(4)
nums.exists(_ > 3)        // true
nums.forall(_ > 0)        // true
```

#### find メソッド（Option型を返す）

`find` メソッドは条件に一致する**最初の要素**を探し、**Option型**で返します。

```scala
val nums = List(1, 2, 3, 4, 5)

// 条件に一致する要素が見つかる場合
val result1 = nums.find(_ > 3)
// result1: Option[Int] = Some(4)

// 条件に一致する要素が見つからない場合
val result2 = nums.find(_ > 10)
// result2: Option[Int] = None
```

**他の検索メソッド**：

```scala
// exists: 条件を満たす要素が存在するか（Boolean）
nums.exists(_ > 3)  // true

// forall: すべての要素が条件を満たすか（Boolean）
nums.forall(_ > 0)  // true

// contains: 指定した値が含まれるか（Boolean）
nums.contains(3)    // true
```

### 分割・グループ化

```scala
nums.partition(_ % 2 == 0)  // (List(2, 4), List(1, 3, 5))
nums.groupBy(_ % 2)         // Map(1 -> List(1, 3, 5), 0 -> List(2, 4))
```

## イミュータブル vs ミュータブル

- **不変(immutable)**: 操作は新しいコレクションを返す。共有しても安全で、参照透過に近い。
- **可変(mutable)**: その場で変更する。更新コストは低いが、副作用と共有に注意。

## ScalaにおけるSeqとは

**Seq** は「順序付きコレクション」の共通インターフェイスです。
`List` や `Vector`、`Array` などが `Seq` の仲間で、
**順序**と**位置アクセス**（`head`/`tail`/`apply` など）を持ちます。

## よく使う型の分類（不変/可変）

- **Array**: mutable // JVMの配列であり、罠があるため、パフォーマンス上必要、とうなければ積極的に採用するべきではなさそう。s
- **List**: immutable
- **Map**: immutable / mutable
- **Set**: immutable / mutable

## コレクション間の変換

```scala
val list = List(1, 2, 3)
val vec = list.toVector
val set = list.toSet
val map = list.zipWithIndex.toMap  // Map(1 -> 0, 2 -> 1, 3 -> 2)
```

## 関連リンク

- [function](function.md) - Scalaの関数と高階関数
- [type-parameter](type-parameter.md) - Scalaの型パラメータ
