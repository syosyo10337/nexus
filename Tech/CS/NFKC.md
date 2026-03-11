---
tags:
  - unicode
  - text-processing
  - normalization
  - cs
created: 2026-01-27
status: active
---

# NFKC

---

**NFKC**（Normalization Form Compatibility Composition）とは、Unicode 正規化の形式の一つです。

```JavaScript
"＃削除＃".normalize("NFKC")  // → "#削除#"
```

## 基本的な変換例

┌──────────────────┬───────────┐
│ 正規化前 │ 正規化後 │
├──────────────────┼───────────┤
│ ＃（全角） │ #（半角） │
├──────────────────┼───────────┤
│ Ａ（全角） │ A（半角） │
├──────────────────┼───────────┤
│ １２３ │ 123 │
├──────────────────┼───────────┤
│ ｶﾀｶﾅ（半角カナ） │ カタカナ │
└──────────────────┴───────────┘

## NFKC = Normalization Form Compatibility Composition\*\*

- 互換性のある文字を標準形に統一
- 全角英数字 → 半角、半角カナ → 全角カナ など

## Unicode 正規化形式の種類

Unicode 正規化には 4 つの主要な形式があります：

| 正規化形式 | 分解（Decomposition）の種類 | 合成（Composition）の種類 | 説明                                             |
| ---------- | --------------------------- | ------------------------- | ------------------------------------------------ |
| **NFD**    | Canonical Decomposition     | (なし)                    | 正準分解のみ。文字を基本文字と結合文字に分解する |
| **NFC**    | Canonical Decomposition     | Canonical Composition     | 正準分解後、正準合成を行う（デフォルト推奨）     |
| **NFKD**   | Compatibility Decomposition | (なし)                    | 互換性分解のみ。見た目が同じ文字を統一する       |
| **NFKC**   | Compatibility Decomposition | Canonical Composition     | 互換性分解後、正準合成を行う                     |

### 各形式の違い

- **Canonical Decomposition（正準分解）**: 文字を基本文字と結合文字（アクセント記号など）に分解する。意味的に等価な文字を統一する。
- **Compatibility Decomposition（互換性分解）**: 見た目が同じまたは類似した文字を、可能な限り標準形に置き換える。全角・半角、スタイルの違いなどを統一する。
- **Canonical Composition（正準合成）**: 分解された文字列を可能な限り結合して、事前合成された文字（precomposed character）を使う。

## NFKC の処理プロセス

NFKC は以下の 2 段階の処理を行います：

1. **Compatibility Decomposition（互換性分解）**
   - 互換性のある文字（全角・半角、スタイル違いなど）を標準形に分解
   - 例：全角「Ａ」→ 半角「A」、半角カナ「ｶ」→ 全角カナ「カ」

2. **Canonical Composition（正準合成）**
   - 分解された文字列を可能な限り結合
   - 例：「é」は「e」+「´」から合成される

## NFKC の特徴と挙動

### 互換性文字の扱い

NFKC は以下のような変換を行います：

- **全角英数字 → 半角英数字**
  - 「ＡＢＣ１２３」→ 「ABC123」

- **半角カナ → 全角カナ**
  - 「ｶﾀｶﾅ」→ 「カタカナ」

- **スタイル文字の変換**
  - 上付き文字（², ³）→ 通常文字（2, 3）
  - 下付き文字（₁, ₂）→ 通常文字（1, 2）
  - 分数（½, ¼）→ 通常文字列（1/2, 1/4）
  - ローマ数字（Ⅰ, Ⅱ）→ 通常文字（I, II）

- **合字（Ligature）の分解**
  - 「ﬁ」（Latin Small Ligature FI, U+FB01）→ 「fi」
  - 「ﬀ」（Latin Small Ligature FF, U+FB00）→ 「ff」

- **特殊記号の統一**
  - 「Å」（アングストローム記号, U+212B）→ 「Å」（U+00C5）

### 冪等性（Idempotency）

NFKC 正規化は**冪等性**を持ちます。つまり、すでに NFKC 正規化された文字列に再度 NFKC を適用しても、結果は変わりません。

```JavaScript
const str = "＃削除＃";
const normalized1 = str.normalize("NFKC");
const normalized2 = normalized1.normalize("NFKC");

console.log(normalized1 === normalized2); // true
```

### 情報の「損失」について

⚠️ **注意**: NFKC は見た目やスタイルの違いを無視するため、元の文字の形の特徴やプレゼンテーション情報が失われることがあります。

- 合字（ligature）の情報が失われる
- 上付き・下付きのスタイル情報が失われる
- フォント固有の形態が失われる

そのため、**表記揺れの統一や比較・検索には非常に有用**ですが、**元のフォーマットを保持する必要がある文書やレイアウト重視の表現には注意が必要**です。

## 実例

| 入力             | NFKC 適用後    | 説明                          |
| ---------------- | -------------- | ----------------------------- |
| `"＃削除＃"`     | `"#削除#"`     | 全角「＃」→ 半角「#」         |
| `"ＡＢＣ１２３"` | `"ABC123"`     | 全角英数字 → 半角英数字       |
| `"ｶﾀｶﾅ"`         | `"カタカナ"`   | 半角カナ → 全角カナ           |
| `"ﬁ"` (U+FB01)   | `"fi"`         | 合字 → 分割された文字         |
| `"²³"`           | `"23"`         | 上付き文字 → 通常文字         |
| `"Å"` (U+212B)   | `"Å"` (U+00C5) | アングストローム記号 → 標準形 |

## 用途・適用場面

### ✅ 文字列比較・検索

見た目は同じでも異なる Unicode コードポイントを持つ文字列を、一致するものとみなしたい場合に有効です。

```JavaScript
// 全角と半角が混在していても比較できる
const input1 = "＃削除＃";
const input2 = "#削除#";

const normalized1 = input1.normalize("NFKC");
const normalized2 = input2.normalize("NFKC");

console.log(normalized1 === normalized2); // true
```

### ✅ 入力正規化（Input Normalization）

ユーザーが入力する文字列をデータベースに保存する際、表記揺れを減らして一貫性を保つために使用します。

```JavaScript
// ユーザー入力の正規化
function normalizeUserInput(input) {
  return input.trim().normalize("NFKC");
}

const userInput = "　ＡＢＣ１２３　"; // 全角スペースと全角英数字
const normalized = normalizeUserInput(userInput);
console.log(normalized); // "ABC123"
```

### ✅ 識別子（Identifiers）やセキュリティ

見た目の類似文字（全角半角・幅違い・合字など）を区別しないようにすることで、混同・なりすましの防止に役立ちます。

- RFC 8265（SASLprep）などで使用
- ユーザー名やパスワードの正規化
- URL やファイル名の正規化

### ✅ 検索エンジン・全文検索

検索クエリとデータベース内の文字列を正規化することで、表記揺れに強い検索を実現できます。

## 注意点・制限

### ⚠️ 表現情報の損失

- 装飾的な文字（合字、上付き・下付きなど）の情報が失われる
- フォント依存の表現が失われる
- レイアウト情報が失われる

**適用すべきでない場面**:

- 文書の元のフォーマットを保持する必要がある場合
- デザイン目的のテキスト
- 学術的な表記（化学式、数学記号など）で上付き・下付きが重要な場合

### ⚠️ 合成できない文字

一部の特殊文字や併記形（presentation forms）は、必ずしも合成できない場合があります。Unicode の Composition Exclusion Table で扱いが決まっています。

### ⚠️ Unicode バージョンによる差異

Unicode のバージョンによって、一部の文字の扱いが異なる場合があります。例えば、Unicode 3.0/3.1 では、YOD WITH HIRIQ（U+FB1D）の扱いが異なります。

### ⚠️ パフォーマンス

正規化処理は計算コストがかかる場合があります。大量の文字列を処理する際は、パフォーマンスを考慮する必要があります。

## 実装例

### JavaScript

```JavaScript
// 基本的な使用
const str = "＃削除＃";
const normalized = str.normalize("NFKC");
console.log(normalized); // "#削除#"

// 比較の例
function compareStrings(str1, str2) {
  return str1.normalize("NFKC") === str2.normalize("NFKC");
}

console.log(compareStrings("ＡＢＣ", "ABC")); // true
console.log(compareStrings("ｶﾀｶﾅ", "カタカナ")); // true

// 検索の例
function searchText(text, query) {
  const normalizedText = text.normalize("NFKC");
  const normalizedQuery = query.normalize("NFKC");
  return normalizedText.includes(normalizedQuery);
}

const text = "これは＃削除＃です";
const query = "#削除#";
console.log(searchText(text, query)); // true
```

### Ruby

```Ruby
require 'unicode'

# 基本的な使用
text = "＃削除＃"
normalized = Unicode.nfkc(text)
puts normalized  # "#削除#"

# 比較の例
def compare_strings(str1, str2)
  Unicode.nfkc(str1) == Unicode.nfkc(str2)
end

puts compare_strings("ＡＢＣ", "ABC")  # true
puts compare_strings("ｶﾀｶﾅ", "カタカナ")  # true

# 検索の例
def search_text(text, query)
  normalized_text = Unicode.nfkc(text)
  normalized_query = Unicode.nfkc(query)
  normalized_text.include?(normalized_query)
end

text = "これは＃削除＃です"
query = "#削除#"
puts search_text(text, query)  # true
```

## まとめ

NFKC は、Unicode 正規化形式の一つで、互換性のある文字を標準形に統一するために使用されます。

**主な特徴**:

- 全角英数字を半角に変換
- 半角カナを全角カナに変換
- 合字やスタイル文字を通常文字に変換
- 冪等性を持つ

**適用場面**:

- 文字列比較・検索
- 入力正規化
- 識別子やセキュリティ
- 検索エンジン・全文検索

**注意点**:

- 表現情報が失われる可能性がある
- 元のフォーマットを保持する必要がある場合は使用を避ける
- Unicode バージョンによる差異に注意
