---
tags:
  - Scala
  - OOP
  - Trait
create_at: 2026-02-06
status: active
---

# trait

Scalaのオブジェクト指向プログラミングにおけるモジュール化の中心的な概念になるのがトレイトです。

traitはScalaの振る舞いを定義する抽象的な型で、クラスに複数混入（mixin）できます。Javaのinterfaceに近いですが、抽象メソッドだけでなく、具体的なメソッド実装やフィールド（val/var）も持てる点が大きな違いです。

## 基本形

```scala
trait <trait名> (extends <トレイト名>) {
// トレイトの定義
}

//e.g.
trait Logger {
  def log(message: String): Unit
}

class ConsoleLogger extends Logger {
  def log(message: String): Unit = println(message)
}
```

Scalaのトレイトはクラスに比べて以下のような特徴があります。

- 複数のトレイトを1つのクラスやトレイトにミックスインできる
- 直接インスタンス化できない
- クラスパラメータ（コンストラクタの引数）を取ることができない
  以下、それぞれの特徴の紹介をしていきます。

### 複数のtraitをミックスイン

```scala
trait Logger {
  def log(message: String): Unit
}

trait TimestampLogger extends Logger {
  abstract override def log(message: String): Unit = {
    val ts = System.currentTimeMillis()
    super.log(s"$ts: $message")
  }
}

trait ShortLogger extends Logger {
  val maxLength = 10
  abstract override def log(message: String): Unit = {
    val trimmed = if (message.length <= maxLength) message else message.take(maxLength)
    super.log(trimmed)
  }
}

class ConsoleLogger extends Logger {
  def log(message: String): Unit = println(message)
}

class Service extends ConsoleLogger with TimestampLogger with ShortLogger
```

### 直接初期化できず、よって、コンストラクタ引数を取ることもできない

クラスパラメータ（コンストラクタの引数）を取ることができない
Scala 2のトレイトはクラスと違いパラメータ（コンストラクタの引数）を取ることができないという制限があります1。

```scala
// 正しいプログラム
class ClassA(name: String) {
  def printName() = println(name)
}
// コンパイルエラー！
trait TraitA(name: String)
```

これもあまり問題になることはありません。トレイトに抽象メンバーを持たせることで値を渡すことができます。インスタンス化できない問題のときと同じようにクラスに継承させたり、インスタンス化のときに抽象メンバーを実装をすることでトレイトに値を渡すことができます。

```scala
trait TraitA {
  val name: String
  def printName(): Unit = println(name)
}

// クラスにして name を上書きする
class ClassA(val name: String) extends TraitA

object ObjectA {
  val a = new ClassA("dwango")

  // name を上書きするような実装を与えてもよい
  val a2 = new TraitA { val name = "kadokawa" }
}
```

## traitの初期化順序

ミックスインしたtraitは右から左に初期化されます。上の例だと、`ConsoleLogger` -> `ShortLogger`の順に初期化され、`log`の呼び出しは`ShortLogger` -> `ConsoleLogger`の順にチェインします（linearization）。

## traitと抽象クラスの使い分け

- trait: 複数ミックスインしたい横断的な振る舞いの定義に向く
- 抽象クラス: 共有状態や基底クラスとしての意味が強い場合に向く

基本はtraitで設計し、単一の継承が自然なときだけ抽象クラスを使う、と覚えると分かりやすいです。

### Scalaにおける菱形継承問題への対処

<https://scala-text.github.io/scala_text/trait.html#%E8%8F%B1%E5%BD%A2%E7%B6%99%E6%89%BF%E5%95%8F%E9%A1%8C>

Scalaではtraitの線形化（linearization）によって呼び出し順序が一意に決まり、菱形継承の曖昧さを回避します。さらに、どの実装を使うかを明示したい場合は`override`や`super[Trait]`を使って指定できます。

- **明示的なオーバーライド**: 同名メソッドが衝突する場合、クラス側で`override`して方針をはっきりさせる
- **特定のトレイトを選ぶ**: `super[TraitName].method()` で親トレイトの実装を明示的に呼べる
- **順序の設計**: `with`の並び順で線形化の優先順位が変わるため、意図した順序で合成する（後勝ちになっているよ）

```scala
trait Base {
  def name: String = "Base"
}

trait Left extends Base {
  override def name: String = "Left -> " + super.name
}

trait Right extends Base {
  override def name: String = "Right -> " + super.name
}

class Final extends Left with Right {
  override def name: String = super[Left].name
}
```

### トレイトの初期化順序

Scalaのクラスおよびトレイトはスーパークラスから順番に初期化されるからです
<https://scala-text.github.io/scala_text/trait.html#%E8%90%BD%E3%81%A8%E3%81%97%E7%A9%B4%EF%BC%9A%E3%83%88%E3%83%AC%E3%82%A4%E3%83%88%E3%81%AE%E5%88%9D%E6%9C%9F%E5%8C%96%E9%A0%86%E5%BA%8F>
