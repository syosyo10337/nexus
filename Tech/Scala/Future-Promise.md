---
tags:
  - scala
  - async
  - concurrency
created: 2026-02-14
updated_at: 2026-02-14
status: draft
---

# Future と Promise

cf. <https://scala-text.github.io/scala_text/future-and-promise.html>

## Future とは

「いずれ届く値」を表す型。別スレッドで処理を実行し、結果を非同期に受け取る。

```scala
import scala.concurrent.Future
import scala.concurrent.ExecutionContext.Implicits.global

val f: Future[String] = Future {
  Thread.sleep(1000)
  "Hello future!"
}
```

`Future { ... }` の中身は **別スレッド** で実行される（main スレッドではない）。

## Future の map：JS の .then() と同じ

`map` は「配列を回す」操作ではなく、**「箱の中身を変換する」** 操作。

```scala
List(1, 2, 3).map(_ * 2)       // List(2, 4, 6)    ← 各要素に適用
Some(3).map(_ * 2)              // Some(6)          ← 中身に適用
Future(3).map(_ * 2)            // Future(6)        ← 届いたら適用
```

JS との対応:

```
JS:     fetch("/api").then(res => res.json()).then(data => data.name)
Scala:  Future { callApi() }.map(res => parseJson(res)).map(data => data.name)
```

| JS | Scala | やってること |
|---|---|---|
| `.then(f)` | `.map(f)` | 届いたら `f` を適用 |
| `await p` | `Await.result(f, d)` | 値が届くまで待つ |
| `Promise.resolve(42)` | `Future.successful(42)` | 即座に完了した箱を作る |

`future.map(f)` は値を取り出すのではなく、**「届いたら `f` を適用してね」という予約を登録している**。結果もまた `Future` に包まれたまま返ってくる。

## onComplete による結果の受け取り

```scala
import scala.util.{Success, Failure}

val futureMilliSec: Future[Int] = Future {
  val waitMilliSec = random.nextInt(3000)
  if (waitMilliSec < 1000) throw new RuntimeException(s"waitMilliSec is ${waitMilliSec}")
  waitMilliSec
}

futureMilliSec.onComplete {
  case Success(value) => println(s"Success! ${value}")
  case Failure(t)     => println(s"Failure: ${t.getMessage}")
}
```

## 複数の Future の組み合わせ（for 式）

JS の `Promise.all` に近い。

```scala
val f1: Future[Int] = Future { waitRandom("first") }
val f2: Future[Int] = Future { waitRandom("second") }

val combined: Future[(Int, Int)] = for {
  first  <- f1
  second <- f2
} yield (first, second)
```

> **注意**: for の**外**で Future を作ると並列実行、**中**で作ると直列実行になる。

## Promise とは

**Promise = 「いつか値を届けるよ」という約束。**

```
友達: 「来週までにレポート送るよ」 ← Promise（約束する側）
自分: 「OK、届いたら読むね」       ← Future（届くのを待つ側）
```

- `promise.success(42)` = 約束を果たした
- `promise.failure(err)` = 約束を破った

Future が「いつか届く値」なら、Promise は「いつか届けると約束した値」。同じ箱の表と裏。

### Future だけでは困る場面

`Future { ... }` はブロックの中で計算して、その結果が自動的に Future の値になる。しかし **「いつ・どこで値が決まるか自分でコントロールしたい」** 場合には使えない。

```scala
// Future: 値はブロックの中で自動的に決まる
val f = Future { 1 + 1 }  // → 勝手に 2 になる

// Promise: 値を「後から」「任意のタイミングで」自分で入れる
val p = Promise[Int]()
// ... 何か別の処理が終わったら ...
p.success(42)  // ← 自分で値を決めて入れる
```

### Promise の基本

```scala
val promise = Promise[Int]()           // 空の箱を作る
val future: Future[Int] = promise.future  // 読み取り口を取得

// 別の場所・別のタイミングで値を設定
promise.success(42)   // → future が Success(42) で完了する
// または
promise.failure(new Exception("error"))  // → future が Failure で完了する
```

**ルール: 値は一度しか入れられない。** 2回目の `success` / `failure` は例外になる。

### JS との対応

JS の Promise は「読み書きが一体」だが、Scala は「読み取り(Future)」と「書き込み(Promise)」が分離している。

```javascript
// JS: 1つのオブジェクトに resolve(書き込み) と then(読み取り) が同居
const p = new Promise((resolve, reject) => {
  setTimeout(() => resolve(42), 1000)
})
p.then(v => console.log(v))
```

```scala
// Scala: Promise(書き込み) と Future(読み取り) が別々
val promise = Promise[Int]()
val future = promise.future  // 読み取り口だけ外に渡せる

Future {
  Thread.sleep(1000)
  promise.success(42)        // 書き込み
}
future.foreach(v => println(v))  // 読み取り
```

この分離のメリット: **読み取り口（Future）だけを外部に公開し、書き込み口（Promise）は内部に隠せる**。

### 用途1: コールバック API を Future に変換する

古い API がコールバック方式の場合、Promise でラップして Future に変換できる。

```scala
// コールバック方式の古い API（よくあるパターン）
class CallbackSomething {
  val random = new Random()
  def doSomething(onSuccess: Int => Unit, onFailure: Throwable => Unit): Unit = {
    val i = random.nextInt(10)
    if (i < 5) onSuccess(i) else onFailure(new RuntimeException(i.toString))
  }
}

// Promise で Future に変換
class FutureSomething {
  val callbackSomething = new CallbackSomething

  def doSomething(): Future[Int] = {
    val promise = Promise[Int]()
    callbackSomething.doSomething(
      i => promise.success(i),    // コールバック成功 → Promise に書き込み
      t => promise.failure(t)     // コールバック失敗 → Promise に書き込み
    )
    promise.future  // 読み取り口を返す
  }
}
```

JS でいうと、コールバック地獄を Promise でラップするのと全く同じ:

```javascript
// JS でもよくやるパターン
function doSomething() {
  return new Promise((resolve, reject) => {
    oldCallbackApi(
      result => resolve(result),
      error  => reject(error)
    )
  })
}
```

### 用途2: 複数スレッド間の「合図」として使う

Promise は「まだ決まっていない未来の値を、後から埋める」仕組み。これを利用して、あるスレッドの結果を別のスレッドに通知できる。

```scala
val promise = Promise[Int]()

// スレッドA: 結果を待つ側
promise.future.foreach { v => println(s"受け取った: $v") }

// スレッドB: 結果を送る側（いつか完了する処理の後で）
Future {
  val result = heavyComputation()
  promise.success(result)  // ← ここで「合図」を送る
}
```

## ExecutionContext

Future の実行にはスレッドプールが必要。`ExecutionContext` がそれを提供する。

```scala
import scala.concurrent.ExecutionContext.Implicits.global
```

この `implicit` により、`Future { ... }` が暗黙的にスレッドプールを使える。

## 練習問題: カウントダウンラッチ

### 問題

> 0〜1000ミリ秒間のランダムな時間を待つ8個の Future を定義し、
> そのうちの **3つが終わり次第すぐに** その3つの待ち時間を全て出力する。

### 考え方

8個の Future が並列で走っている。どれが先に終わるかわからない。「最初に終わった3つ」の結果を受け取りたい。

ここで Future だけでは困る。なぜなら:

- `Future { ... }` は処理と結果が一体化しており、「別の Future の結果を受け取る入れ物」としては使えない
- 「最初に終わった3つ」という動的な条件を表現できない

**Promise を「結果を受け取る入れ物」として使う:**

```
Promise(1)  Promise(2)  Promise(3)    ← 3つの空の箱を用意
   ↑           ↑           ↑
   │           │           │          早い者勝ちで結果を入れる
Future1 Future2 ... Future8           ← 8つが並列で走る
```

### 解答

```scala
import java.util.concurrent.atomic.AtomicInteger
import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.{Promise, Future}
import scala.util.Random

object CountDownLatchSample {
  def main(args: Array[String]): Unit = {
    val random = new Random()

    // ① 結果を受け取る「入れ物」を3つ用意
    val promises: Seq[Promise[Int]] = for { i <- 1 to 3 } yield Promise[Int]()

    // ② スレッドセーフなカウンター（何番目に終わったかを数える）
    val indexHolder = new AtomicInteger(0)

    // ③ 8つの Future を起動（並列に走る）
    val futures: Seq[Future[Int]] = for { i <- 1 to 8 } yield Future[Int] {
      val waitMilliSec = random.nextInt(1001)
      Thread.sleep(waitMilliSec)
      waitMilliSec
    }

    // ④ 各 Future が完了したら、Promise に結果を入れる f.foreachに届いたら実行する処理を登録しておく
    futures.foreach { f =>
      f.foreach { waitMilliSec =>
        val index = indexHolder.getAndIncrement  // 0, 1, 2, 3, 4, ...
        if (index < promises.length) {           // 最初の3つだけ
          promises(index).success(waitMilliSec)   // Promise に書き込み
        }
      }
    }

    // ⑤ Promise の Future から結果を読み取る p.future.foreachに届いたら実行する処理を登録しておく
    promises.foreach { p =>
      p.future.foreach { waitMilliSec => println(waitMilliSec) }
    }

    Thread.sleep(5000)  // 全体が終わるのを待つ
  }
}
```

### 解答の流れ（図解）

```
時間 →→→→→→→→→→→→→→→→→→→→→→→→→→→→→

Future1: [===200ms===]完了! → index=0 → promises(0).success(200)
Future2: [=======500ms=======]完了! → index=1 → promises(1).success(500)
Future3: [===========700ms===========]完了! → index=2 → promises(2).success(700)
Future4: [=============800ms=============]完了! → index=3 → 3以上なので無視
Future5: [====300ms====]完了! → (実際の順序はランダム)
...

Promise(0) → 200  ← println
Promise(1) → 500  ← println
Promise(2) → 700  ← println
```

### なぜ AtomicInteger が必要か

複数のスレッドが**同時に** `index` を更新しようとする。普通の `var` だと:

```
スレッドA: index を読む → 0      スレッドB: index を読む → 0
スレッドA: index を 1 にする     スレッドB: index を 1 にする  ← 同じ 0 を見てしまう!
```

`AtomicInteger.getAndIncrement` は「読んで+1する」を**一瞬で**やるので、この問題が起きない。

## 練習問題の前提スキル

| 前提スキル | 関連ノート |
|---|---|
| `map` / `flatMap` の理解 | [collection-library](collection-library.md) |
| `for` 式が `flatMap` の糖衣構文であること | - |
| `Option` / `Try` の使い方 | [error-handling](error-handling.md) |
| パターンマッチ | [case-class-and-pattern-matching](case-class-and-pattern-matching.md) |
| スレッドとは何か | [プロセスとスレッド](../CS/プロセスとスレッド.md) |
| `implicit` の基礎 | [implicit](implicit.md) |

## 関連ノート

- [collection-library](collection-library.md) - map の共通パターンについて
- [プロセスとスレッド](../CS/プロセスとスレッド.md) - スレッドの基礎概念
