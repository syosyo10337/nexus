---
tags:
  - scala
created: 2026-02-14
updated_at: 2026-02-14
status: active
---

# String

## 文字列補間（String Interpolation）

文字列リテラルの前に補間子を付けることで、変数や式を埋め込める。

### s補間子

```scala
val name = "Alice"
s"Hello, $name"          // → "Hello, Alice"
s"1 + 1 = ${1 + 1}"     // → "1 + 1 = 2"
```

- `$変数名` で変数を展開
- `${式}` で任意の式を展開

### f補間子

printf 風のフォーマット指定ができる。

```scala
val price = 3.14159
f"price: $price%1.2f"   // → "price: 3.14"
```

### raw補間子

エスケープシーケンスを処理しない。

```scala
raw"no\nnewline"         // → "no\\nnewline"（改行されない）
s"with\nnewline"         // → "with\nnewline"（改行される）
```

### 補間子の比較

| 補間子 | 用途 | 特徴 |
|---|---|---|
| `s"..."` | 一般的な文字列展開 | 最もよく使う |
| `f"..."` | フォーマット付き展開 | `%d`, `%f` 等が使える |
| `raw"..."` | エスケープなし | 正規表現などに便利 |
