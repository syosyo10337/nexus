---
tags:
  - scala
  - error-handling
  - exception
  - functional-programming
created: 2026-02-11
updated_at: 2026-02-12
status: draft
---

# エラーハンドリング

。Scalaでのエラー処理は例外を使う方法と、OptionやEitherやTryなどのデータ型を使う方法があり、場合によってに使い分けることになります。

Scalaはがなく、メソッドの型からどんな例外が投げられるかを判断する術がないため、ドキュメントとして記載してあげる必要があります。

## 例外処理の問題点

Scalaでも例外処理自体は使われるが、制御の流れがおいづらくなる。

先ほど述べたように例外は、適切に使えば正常系の処理とエラー処理を分離し、コードの可読性を上げ、エラー処理をまとめる効果があります。しかし、往々にして例外のcatch漏れが発生し、障害に繋がることがあります。逆に例外をcatchしているところで、どこで発生した例外をcatchしているのか判別できないために、コードの修正を阻害する場合もあります。

### 非同期処理との相性が悪い

例外というのは送出されたらcatchされるまで、（同一スレッドの）call stack遡っていくというものなので、別スレッドでもものを扱いづらくしてしまいます。

### 型チェックができない

チェック例外を使わない限り、どんな例外が発生するのかメソッドの型としては表現されません。またcatchする側でも間違った例外をキャッチしているかどうかは実行時にしかわかりません。例外に頼りすぎると静的型付き言語の利点が損われます。

チェック例外を使わないとコンパイル時に型チェックできないわけですが、ScalaではJavaとは違いチェック例外の機能はなくなりました。これにはチェック例外の様々な問題点が理由としてあると思います

高階関数でチェック例外を扱うことが難しい
ボイラープレートが増える
例外によるメソッド型の変更を防ぐために例外翻訳を多用せざるをえない
特にScalaでは1番目の問題が大きいと思います。後述しますが、Scalaではチェック例外の代替手段として、エラーを表現するデータ型を使い、エラー処理を型安全にすることもできます。それらを考えるとScalaでチェック例外をなくしたのは妥当な判断と言えるでしょう。

## エラーを表現するデータ型を使った処理

### Option 型

Javaの`null`の代替になるもの、Option型は、値を一つだけ入れることができるコンテナだそうです。

**Option型とは**：

- **Some(値)**：値が存在する場合
- **None**：値が存在しない場合

このパターンにより、`null` を使わずに「値がないかもしれない」状況を型安全に扱えます。

**Optionの扱い方**：

Optionのコンパニオンオブジェクトの`apply`には引数が`null`であるかどうかのチェックが入っており、引数が`null`の場合、値が`None`になります。

```scala
val o: Option[String] = Option(null)
```

Optionはコレクションの性質を持つため、内容に対して`map`で関数を適用できます。`Some`なら関数が適用され、`None`ならそのまま`None`が返ります。

```scala
Some(3).map(_ * 3)
// res6: Option[Int] = Some(9)

val n: Option[Int] = None

n.map(_ * 3)
// res7: Option[Int] = None
```

`map`は`Some`の中身に関数を適用しますが、`None`のときは何も実行せず`None`のままです。Java風の分岐とは、例外を投げる点と返り値の型が異なります。

```scala
if (n.isDefined) {
  n.get * 3
} else {
  throw new RuntimeException
}
```

`None`のときに実行する処理を定義し、最終的な値を返したい場合は`fold`を使います。APIの宣言は以下です。

```scala
fold[B](ifEmpty: => B)(f: (A) => B): B

n.fold(throw new RuntimeException)(_ * 3)

Some(3).fold(throw new RuntimeException)(_ * 3)
// res8: Int = 9
```

#### flatMapメソッド

`flatMap`は`map`と`flatten`を組み合わせたメソッドです。`map`した結果が`Option[Option[T]]`のようにネストしてしまう場合に、自動的にフラット化してくれます。

```scala
// mapだけだとネストする
Some(2).map(i => Some(i * 3))
// res: Option[Option[Int]] = Some(Some(6))

// flatMapを使うと自動的にフラット化
Some(2).flatMap(i => Some(i * 3))
// res: Option[Int] = Some(6)
```

複数のOptionを組み合わせる際に便利です。

```scala
val v1 = Some(2)
val v2 = Some(3)
val v3 = Some(5)

v1.flatMap(i1 =>
  v2.flatMap(i2 =>
    v3.map(i3 => i1 * i2 * i3)))
// res: Option[Int] = Some(30)
```

いずれかが`None`の場合、結果も`None`になります。

```scala
val v1 = Some(2)
val v2: Option[Int] = None
val v3 = Some(5)

v1.flatMap(i1 =>
  v2.flatMap(i2 =>
    v3.map(i3 => i1 * i2 * i3)))
// res: Option[Int] = None
```

## Try 型

### Success と Failure

### Try の基本操作

### Try と for 式

## Either 型

### Left と Right

### Either の基本操作

### Either と for 式

## 例外処理

### try-catch-finally

### カスタム例外

## エラーハンドリングのベストプラクティス

### Option vs Try vs Either

### エラーの伝搬

### エラーメッセージの設計

## まとめ
