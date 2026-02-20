---
tags:
  - scala
  - type-class
  - functional-programming
created: 2026-02-20
status: draft
---

## 概要

Scala の実用的な型クラスの代表例（Functor, Applicative, Monad, Monoid）をざっくりまとめたメモ。型クラスの基本概念については [Type-Class.md](Type-Class.md) を参照。

## Monoid（モノイド）

一番シンプルなので最初に理解すると良い。「同じ型の値を2つ結合できて、ゼロ値がある」という性質を表す。

```scala
trait Monoid[F] {
  def append(a: F, b: F): F  // 2つの値を結合
  def zero: F                  // ゼロ値（単位元）
}
```

```scala
// Int の Monoid: 足し算
implicit object IntMonoid extends Monoid[Int] {
  def append(a: Int, b: Int): Int = a + b
  def zero: Int = 0
}

// String の Monoid: 文字列結合
implicit object StringMonoid extends Monoid[String] {
  def append(a: String, b: String): String = a + b
  def zero: String = ""
}
```

法則:

- **結合性**: `append(append(a, b), c) == append(a, append(b, c))`
- **単位元**: `append(a, zero) == a` かつ `append(zero, a) == a`

[implicit.md](implicit.md) で出てきた `Additive` は実質 Monoid と同じもの。

## Functor（ファンクター）

`List` や `Option` の `map` を抽象化したもの。「中身を変換できるコンテナ」のイメージ。

```scala
trait Functor[F[_]] {
  def map[A, B](fa: F[A])(f: A => B): F[B]
}
```

`F[_]` は「何かの型を1つ受け取る型コンストラクタ」（例: `List`, `Option`）。

```scala
implicit object ListFunctor extends Functor[List] {
  def map[A, B](fa: List[A])(f: A => B): List[B] = fa.map(f)
}
```

法則:

- **恒等則**: `map(fa)(identity) == fa`（何もしない関数で map しても変わらない）
- **合成則**: `map(fa)(f2 compose f1) == map(map(fa)(f1))(f2)`（まとめて map しても、2回に分けても同じ）

## Applicative Functor（アプリカティブファンクター）

Functor を拡張して、「関数自体もコンテナに入っている」場合に対応。複数の引数を持つ関数に使える。

```scala
trait Applicative[F[_]] {
  def point[A](a: A): F[A]                      // 値をコンテナに入れる
  def ap[A, B](fa: F[A])(f: F[A => B]): F[B]    // コンテナ内の関数を適用
}
```

- `point`: 普通の値を `F` に包む（`List(1)` とか `Some(1)` のイメージ）
- `ap`: `F[A => B]`（コンテナに入った関数）を `F[A]` に適用する

## Monad（モナド）

Functor + 「ネストしたコンテナを平坦化」する能力。`flatMap` の抽象化。

```scala
trait Monad[F[_]] {
  def point[A](a: A): F[A]                       // 値をコンテナに入れる
  def bind[A, B](fa: F[A])(f: A => F[B]): F[B]   // flatMap に相当
}
```

```scala
implicit object OptionMonad extends Monad[Option] {
  def point[A](a: A): Option[A] = Some(a)
  def bind[A, B](fa: Option[A])(f: A => Option[B]): Option[B] = fa.flatMap(f)
}
```

法則:

- **左単位元**: `bind(point(a))(f) == f(a)`
- **右単位元**: `bind(fa)(point) == fa`
- **結合性**: `bind(bind(fa)(f))(g) == bind(fa)(a => bind(f(a))(g))`

## 4つの型クラスの関係

```text
Functor  →  Applicative  →  Monad
（map）     （point + ap）   （point + flatMap）

Monoid は別系統（コンテナではなく「値の結合」）
```

- Monad は Applicative の上位互換（Monad があれば Applicative が作れる）
- Applicative は Functor の上位互換（Applicative があれば map が作れる）
- Monoid は独立した概念だが、Monad と組み合わせて使うことも多い

## まだよくわからないこと

- Applicative と Monad の使い分けの感覚
- `F[_]` の型コンストラクタの仕組み（高カインド型）
- 実際のライブラリ（Cats, Scalaz）での使われ方

## 参考

- [scala-text: 型クラスへの旅](https://scala-text.github.io/scala_text/typeclass.html)
- [Scala関数型デザイン&プログラミング](https://www.amazon.co.jp/dp/4844337769)（書籍）
- [型クラスの基本](Type-Class.md)
- [implicit の使い方](implicit.md)
