---
tags:
  - Programming
  - Type System
  - Variance
  - Subtyping
create_at: 2026-02-08
updated_at: 2026-02-08
status: active
---

# 変性とサブタイプ関係

プログラミング言語の型システムにおける変性（Variance）とサブタイプ関係（Subtyping）の基礎概念について解説します。特定の言語に依存しない、型システム全般に関わる理論的な内容です。

## サブタイプ関係（Subtyping）とは

### サブタイプの定義

`A <: B`（AはBのサブタイプ）の意味は：

> **「Bが期待される場所に、Aを置いても安全である」**

これを**リスコフの置換原則（Liskov Substitution Principle / LSP）**と呼びます。

### 「席に座れるか」という判断基準

サブタイプの判定基準は「継承しているか」ではなく、**「相手の席に座れるか（相手の要求を全部満たせるか）」**です。

```text
class Animal { method sound(): String }
class Dog extends Animal { method sound(): String = "ワン" }

Dog <: Animal なので、Animalの席にDogを座らせてOK
✅ Animalが求めるsound()をDogは持っている

逆はNG
❌ Dogの席にAnimalは座れない（Dogの全要求を満たせない可能性）
```

**重要：`<:` は「inherits from（継承している）」ではなく「is a subtype of（サブタイプである）」を意味します。**

## サブタイプと継承の関係

継承とサブタイプは**別の概念**です。

### 概念の違い

- **継承（Inheritance）**：プログラマが明示的に書く構造的な関係。コード再利用やオーバーライドの仕組み。
- **サブタイプ関係（Subtyping）**：型システムが判断する「置換可能性」の関係。「Bの席にAを座らせて安全か？」という判定。

### 継承とサブタイプの関係性

**継承はサブタイプを生み出す十分条件であるが、必要条件ではない。**

```text
継承 → サブタイプ関係が生まれる（常に成り立つ）
サブタイプ関係がある → 継承とは限らない
```

### サブタイプ関係が生まれる3つの経路

```text
サブタイプ関係（A <: B）の発生源：

┌──────────────────────────────────────────────────────────────┐
│  ① 継承                                                      │
│    class Dog extends Animal                                   │
│    → Dog <: Animal                                            │
│    プログラマが明示的に作る                                      │
├──────────────────────────────────────────────────────────────┤
│  ② 変性による導出                                              │
│    Dog <: Animal + Consumer[-A]                               │
│    → Consumer[Animal] <: Consumer[Dog]                        │
│    型システムが自動的に導き出す                                   │
│    （どこにもextendsは書いていない）                              │
├──────────────────────────────────────────────────────────────┤
│  ③ 言語仕様による組み込み                                       │
│    Nothing <: すべての型 <: Any（Scalaの例）                   │
│    never <: すべての型（TypeScriptの例）                        │
└──────────────────────────────────────────────────────────────┘
```

**この区別が重要な理由：** 変性によるサブタイプ関係（②）は、継承の「親＝汎用、子＝特化」という直感が通用しない場合があります。常に**「席に座れるか？」**というLSPの原則に立ち戻って判断する必要があります。

## 変性（Variance）とは何か？

### 用語の整理

```text
型パラメータ：T（ジェネリック型定義時のプレースホルダー）
ジェネリック型：Box[T]（型パラメータを含む型定義）
具体的な型：Dog、Animal（実際に存在する型）
サブタイプ関係：Dog <: Animal（型システムが判断する置換可能性）
```

### 問題の背景

```text
class Dog extends Animal        // ← Dog <: Animal（継承によるサブタイプ関係）
trait Box[T]                    // ← ジェネリック型（T は型パラメータ）

val dogBox: Box[Dog] = new Box[Dog]()

// Dog <: Animal という関係があるのに、
// Box[Dog] と Box[Animal] の関係は？
val animalBox: Box[Animal] = dogBox  // ← これはOK？NG？
```

**中心的な問題：** 「具体的な型のサブタイプ関係（`Dog <: Animal`）が、ジェネリック型を通したときにどう伝播するのか？」

### 変性の本質

**具体的な型のサブタイプ関係（`Dog <: Animal`）が、ジェネリック型のサブタイプ関係に対して：**

1. **【転移】される** → 共変（Covariant）：`Box[Dog] <: Box[Animal]`
2. **【逆転】される** → 反変（Contravariant）：`Handler[Animal] <: Handler[Dog]`
3. **【無視】される** → 不変（Invariant）：`Box[Dog]` と `Box[Animal]` は無関係

Upper Bound や Lower Bound の話ではなく、**型パラメータを具体的な型で置き換えたときに、元々あったサブタイプ関係がどう伝播するか**という話です。

### 変性の3パターン

```text
具体的な型のサブタイプ関係：Dog <: Animal

↓ ジェネリック型に代入すると

┌─────────────────────────────────────────────────────────────┐
│ 共変（Covariant）：関係が【転移】される                    │
├─────────────────────────────────────────────────────────────┤
│ Dog <: Animal  →  Box[Dog] <: Box[Animal]                  │
│                  （関係がそのまま伝播）                      │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ 反変（Contravariant）：関係が【逆転】される               │
├─────────────────────────────────────────────────────────────┤
│ Dog <: Animal  →  Handler[Animal] <: Handler[Dog]         │
│                  （関係が逆転する）                          │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ 不変（Invariant）：関係が【無視】される                    │
├─────────────────────────────────────────────────────────────┤
│ Dog <: Animal だが  →  Box[Dog] と Box[Animal] は無関係   │
│                       （型パラメータの関係が途絶える）       │
└─────────────────────────────────────────────────────────────┘
```

## 変性の判断基準：型パラメータのポジション

型パラメータがジェネリック型の中で**どう使われるか**が変性を決めます：

- **出力（返す）ポジション** → 共変が安全：`method get(): T`
- **入力（受け取る）ポジション** → 反変が安全：`method accept(a: T): void`
- **両方のポジション** → 不変にするしかない：`var value: T`（getもsetもある）

## 共変（Covariant）：関係の転移

### 特性

型パラメータを**返す/読み取る側**でのみ使用する場合に安全です。

### 直感的な理解

```scala
【図書館の返却ボックス】

class ReturnBox[T] {
  method getItem(): T  // 取り出すだけ
}

「犬用の返却ボックス」を「動物用の返却ボックス」として使える？
 ✅ YES！犬を入れるように作ったボックスから、動物として取り出しても安全
   （犬は動物として扱えるから）

ReturnBox[Dog] <: ReturnBox[Animal]
```

### なぜ共変が安全か

```scala
ReturnBox[Animal]の席（期待）:
  - getItem()を呼ぶと Animal が返ってくる

ReturnBox[Dog]を座らせる:
  - getItem()を呼ぶと Dog が返ってくる
  - Dog <: Animal なので、Animal として扱える
  - ✅ 座れる！
```

### 制約：受け取る側では使えない

共変パラメータは、メソッドの引数（入力ポジション）では使えません。

```scala
// ❌ これはコンパイルエラー（T が共変だから）
class BadBox[+T] {
  method put(item: T): void  // 引数に使っているので不可
}
```

**理由：** もし許されたら、以下のような危険なコードが可能になってしまいます：

```scala
val dogBox: BadBox[Dog] = new BadBox[Dog]()
val animalBox: BadBox[Animal] = dogBox  // 共変なのでOKになってしまう

animalBox.put(new Cat())  // 💥 Cat を Dog用のボックスに入れてしまう！
```

## 反変（Contravariant）：関係の逆転

### 特性

型パラメータを**受け取る/消費する側**でのみ使用する場合に安全です。

### 獣医の例で理解する

```scala
trait Animal { method name(): String }
class Dog extends Animal { method name() = "犬" }
class Cat extends Animal { method name() = "猫" }

// 反変：A を受け取る（診察する）だけ
trait Vet[A] {
  method treat(animal: A): void
}

val animalVet: Vet[Animal]  // どんな動物も診れる獣医
val dogVet: Vet[Dog]        // 犬専門の獣医
```

### 「席に座れるか」で判定

**「`Vet[Dog]`（犬専門獣医）の席」に誰が座れるか？**

```scala
Vet[Dog]の席 = 「犬を診察してくれ」という要求がある場面

animalVet（汎用獣医）を座らせる：
  → 犬が来る → どんな動物もOKなので診察できる ✅ 座れる！

dogVet（犬専門獣医）を座らせる：
  → 犬が来る → 犬専門なので当然OK ✅ 座れる（当然）
```

**「`Vet[Animal]`（汎用獣医）の席」に誰が座れるか？**

```scala
Vet[Animal]の席 = 「どんな動物でも診察してくれ」という要求がある場面

animalVet（汎用獣医）を座らせる：
  → 猫が来ても犬が来てもOK ✅ 座れる（当然）

dogVet（犬専門獣医）を座らせる：
  → 猫が来たら？ → 犬しか診れない 💥 座れない！
```

### 結論：サブタイプ関係の逆転

```scala
animalVet は Vet[Dog] の席に座れる → ✅
dogVet は Vet[Animal] の席に座れる → ❌

LSPの定義「Bの席にAを座らせて安全 → A <: B」より：
  Vet[Animal] <: Vet[Dog]

元の関係：Dog <: Animal
反変を通すと：Vet[Animal] <: Vet[Dog]
→ 逆転している！
```

### なぜ逆転するのか

```scala
                   │ 具体的な型       │ Vet（消費する側）
───────────────────┼──────────────────┼──────────────────────
能力が広い方       │ Animal（汎用）   │ Vet[Animal]（何でも診れる）
能力が広い方の立場 │ スーパータイプ   │ サブタイプ ← ここが逆転！

理由：
- 具体的な型の世界：
    Animalは「抽象的で大雑把」→ 持っている能力は少ない
    → Dogの席には座れない（Dog固有のメソッドが足りない）

- Vet（消費する側）の世界：
    Vet[Animal]は「何でも受け入れる」→ 満たせる要求が多い
    → Vet[Dog]の席にも座れる

「席に座れるか」を決める要因が逆方向に働くから、サブタイプ関係が逆転する。
```

### プリンターの例

```scala
trait Printer[A] {
  method print(a: A): void
}

val animalPrinter: Printer[Animal] = (a: Animal) => print(a.name())

// Printer[Animal] <: Printer[Dog] なので、Printer[Dog]の席に座れる
val dogPrinter: Printer[Dog] = animalPrinter  // ✅ OK!
```

## 不変（Invariant）：関係の無視

### なぜデフォルトで無関係なのか

読み書き両方できる容器は、サブタイプ関係を伝播させると壊れます：

```scala
class MutableBox[A] {
  var value: A
  method get(): A = value                    // 出力ポジション
  method set(a: A): void = { value = a }     // 入力ポジション
}

val dogBox: MutableBox[Dog] = new MutableBox(new Dog)
val animalBox: MutableBox[Animal] = dogBox  // もしこれが許されたら...

animalBox.set(new Cat())  // 💥 Animal型なのでCatも入れられてしまう！
// でも dogBox.get は Dog を期待 → Catが返ってきて壊れる
```

両方のポジションで使う場合、共変にも反変にもできないため、不変（無関係）にするしかありません。

## まとめ

### 変性の本質

- **型パラメータ `T` の役割**：ジェネリック型の定義時のプレースホルダー
- **変性が決めること**：「T に具体的な型を代入したとき、元々あったサブタイプ関係がどう伝播するか」
- **共変** = 「関係がそのまま伝播」
- **反変** = 「関係が逆転」
- **不変** = 「関係が無視される」（デフォルト）

### サブタイプとLSPの重要性

- **`<:` の意味**：「Bの席にAを座らせて安全」（置換可能性）
- **継承 ≠ サブタイプ**：継承はサブタイプを生む一つの手段に過ぎない
- **判断基準**：変性の逆転に迷ったら、常に「席に座れるか？」というLSPの原則に立ち戻る

### 型パラメータのポジションによる判断

- **出力のみ** → 共変が安全
- **入力のみ** → 反変が安全
- **両方** → 不変にするしかない

## 関連リンク

- 各言語での実装：
  - [type-parameter](../Scala/type-parameter.md)（Scala）
  - TypeScript、Java、Kotlinなどでも同様の概念が存在

## 参考文献

- Liskov, Barbara; Wing, Jeannette (1994). "A behavioral notion of subtyping"
- Pierce, Benjamin C. (2002). "Types and Programming Languages"
