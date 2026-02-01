---
tags:
  - Scala
  - programing language
---

# 制御構文 (Control Structures)

## ブロック構文

ブロック構文は、複数の式(expression)をグループ化するための構文です。

```scala
// 基本構文
{ <式1>(;|<改行>) <式2>(;|<改行>) ... }

// e.g. ;の代わりに改行で区切ることもできる
{ println("A"); println("B"); 1 + 2; }
```

Scalaでは、

```scala
def foo(): String = {
  "foo" + "foo"
}
```

のような形でメソッド定義をすることが一般的ですが（後述します）、ここで{}は単に{}式であって、メソッド定義の構文に{}が含まれているわけではありません。ただし、クラス定義構文などにおける{}は構文の一部です

## if expression

if式はJavaのif文とほとんど同じ使い方をします。if式の構文は次のようになります。
ifに限らず、Scalaの制御構文は全て式です。

> **Note**: この辺りはRubyと一緒だね、この設計は関数型プログラミングの影響を受けているらしい

```scala

if '('<条件式>')' <then式> (else <else式>)?

// Scala 3ではthenキーワードを使用して以下のように書くこともできます。
if <条件式> then <then式> (else <else式>)?

// e.g. 

val age: Int = 18

if(age < 18) {
  "18歳未満です"
} else {
  "18歳以上です"
}
```

## while expression

while式の構文はJavaのものとほぼ同じです。

```scala
while '(' <条件式> ')' <本体式>
```

Scala 3ではdoキーワードを使用して以下のように書くこともできます。

```scala
while <条件式> do <本体式>
```

条件式 は Boolean 型である必要があります。while 式は、 条件式 がtrueの間、本体式 を評価し続けます。なお、while 式も式なので値を返しますが、while式には適切な返すべき値がないのでUnit型の値()を返します。

さて、 while 式を使って1から10までの値を出力してみましょう。

```scala
var i = 1
// i: Int = 1

while(i <= 10) {
  println("i = " + i)
  i = i + 1
}
// i = 1
// i = 2
// i = 3
// i = 4
// i = 5
// i = 6
// i = 7
// i = 8
// i = 9
// i = 10
```

## return expression

Scalaの制御構文は基本的に式なので、明示的なreturnが不要ですね。
これを利用すると多言語でいうcontinueやbreakのような役割があります。

## for expression

for 式の基本的な構文は次のようになります。

```scala
for '(' (<ジェネレータ>;)+ ')' <本体式>
# <ジェネレータ> = x <- <式> (if <条件式>)?
```

Scala3ではdoキーワードを使用して以下のように書くこともできます。

```scala
for (<ジェネレータ>;)+ do <本体式>
# <ジェネレータ> = x <- <式> (if <条件式>)?
```

各 ジェネレータ の変数 x に相当する部分は、好きな名前のループ変数を使うことができます。 式 には色々な式が書けます。ただ、現状では全てを説明しきれないため、何かの数の範囲を表す式を使えると覚えておいてください。
たとえば、1 to 10 は1から10まで（10を含む）の範囲で、
 1 until 10 は1から10まで（10を含まない）の範囲です。

それでは、早速 for 式を使ってみましょう。

```scala
for(x <- 1 to 5; y <- 1 until 5){
  println("x = " + x + " y = " + y)
}
// x = 1 y = 1
// x = 1 y = 2
// x = 1 y = 3
// x = 1 y = 4
// x = 2 y = 1
// x = 2 y = 2
// x = 2 y = 3
// x = 2 y = 4
// x = 3 y = 1
// x = 3 y = 2
// x = 3 y = 3
// x = 3 y = 4
// x = 4 y = 1
// x = 4 y = 2
// x = 4 y = 3
// x = 4 y = 4
// x = 5 y = 1
// x = 5 y = 2
// x = 5 y = 3
// x = 5 y = 4

// 以下のようにジェネレータの条件を最後に追加することもできる。柔軟で強力ですね。
for(x <- 1 to 5; y <- 1 until 5 if x != y){
  println("x = " + x + " y = " + y)
}
// mapやforEachのような操作もfor文でかける。
for(e <- List("A", "B", "C", "D", "E")) println(e)

```

```scala
for(e <- List("A", "B", "C", "D", "E")) yield {
  "Pre" + e
}
// res9: List[String] = List("PreA", "PreB", "PreC", "PreD", "PreE")
```

ここでポイントとなるのは、yieldというキーワードです。実は、for構文はyieldキーワードを使うことで、コレクションの要素を加工して返すという全く異なる用途に使うことができます。特にyieldキーワードを使ったfor式を特別に for-comprehensionと呼ぶことがあります。

# match expression

```scala
<対象式> match {
  (case <パターン> (if <ガード>)? '=>'
    (<式> (;|<改行>))*
  )+
}

val taro = "Taro"
// taro: String = "Taro"

taro match {
  case "Taro" => "Male"
  case "Jiro" => "Male"
  case "Hanako" => "Female"
}
// res10: String = "Male"
```

defaultの代わりにワイルドカードパターンを使います(_)

```scala
val one: Int = 1
one match {
  case 1 => "one"
  case 2 => "two"
  case _ => "other"
```

JavaやCにあるswitchのfallthrough of the functionality is absent, but if you want to match with multiple conditions, use `|`.

```scala
"abc" match {
  case "abc" | "def" =>
    println("first")
    println("second")
}
```

RubyにもあったようにPattern matchを使うと、、

```scala
val lst = List("A", "B", "C")
// lst: List[String] = List("A", "B", "C")

lst match {
  case List("A", b, c) if b != "B" =>
    println("b = " + b)
    println("c = " + c)
  case _ =>
    println("nothing")
}
```

@はasパターンというらしく、前述の変数にマッチする式を束縛する

```scala
val lst = List(List("A"), List("B", "C"))
// lst: List[List[String]] = List(List("A"), List("B", "C"))

// aにList("A")を束縛する"
lst match {
  case List(a@List("A"), x) =>
    println(a)
    println(x)
  case _ => println("nothing")
}
// List(A)
// List(B, C)
```

## 中置パターン

```scala
val lst = List("A", "B", "C")
// lst: List[String] = List("A", "B", "C")

lst match {
  case "A" :: b :: c :: _ =>
    println("b = " + b)
    println("c = " + c)
  case _ =>
    println("nothing")
}
// b = B
// c = C
```

ここで、 "A" :: b :: c :: _のように、リストの要素の間にパターン名（::）が現れるようなものを中置パターンと呼びます。中置パターン（::）によってパターンマッチを行った場合、 :: の前の要素がリストの最初の要素を、後ろの要素がリストの残り全てを指すことになります。リストの末尾を無視する場合、上記のようにパターンの最後に_ を挿入するといったことが必要になります。リストの中置パターンはScalaプログラミングでは頻出するので、このような機能があるのだということは念頭に置いてください。

## 型によるマッチ

値が特定の型に所属する場合にのみマッチするパターンは、名前:マッチする型の形で使います。

```scala
val obj: AnyRef = "hello"      // Stringを代入可能
// obj.length() ❌ エラー

val str = obj.asInstanceOf[String]  // キャスト
str.length  // ✅ OK
```

```scala
import java.util.Locale

val obj: AnyRef = "String Literal"
// obj: Object = "String Literal"

obj match {
  case v:java.lang.Integer =>
    println("Integer!")
  case v:String =>
    println(v.toUpperCase(Locale.ENGLISH))
}
// STRING LITERAL
```
