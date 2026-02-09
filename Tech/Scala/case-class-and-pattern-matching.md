---
created: 2026-02-09
updated_at: 2026-02-09
tags:
  - scala
  - case-class
  - pattern-matching
  - functional-programming
---

# ケースクラスとパターンマッチング

Scala のケースクラス（case class）とパターンマッチング（pattern matching）は、代数的データ型（Algebraic Data Types）を扱うための強力な言語機能です。

## ケースクラス（Case Class）

### 基本的な定義

```scala
sealed abstract class DayOfWeek
case object Sunday extends DayOfWeek
case object Monday extends DayOfWeek
case object Tuesday extends DayOfWeek
case object Wednesday extends DayOfWeek
case object Thursday extends DayOfWeek
case object Friday extends DayOfWeek
case object Saturday extends DayOfWeek

// scala3からはEnumがあるのでほぼ同等のものが以下のように書ける
enum DayOfWeekScala3Enum {
  case Sunday, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday
}
val x: DayOfWeek = Sunday
```

> tips:
> sealed は、クラスやトレイトの継承を同一ファイル内に制限する修飾子です。これによって、caseのパターンが網羅的(exhaustive)ではないときにコンパイルがwarningをだしてくれる

`case` キーワードを付けるだけで、通常のクラスに以下の機能が自動的に追加されます。

### ケースクラスの特徴

- **すべてのパラメータが自動的に `val` になる**（明示的に `var` にすることも可能だが非推奨）
- **デフォルトでシリアライズ可能**
- **コレクションのキーとして使いやすい**（equals/hashCode が実装されているため）

## 変数宣言におけるパターンんマッチング

TODO: ここから
