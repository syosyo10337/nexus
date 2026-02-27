---
tags:
  - javascript
  - string-methods
created: 2026-02-28
status: draft
---

## 概要

`padStart()` / `padEnd()` は、文字列を指定した長さになるまで別の文字で埋めるメソッド。ゼロ埋めや固定幅フォーマットに便利。

## 内容

### padStart()

文字列の**先頭**を埋める。

```js
"5".padStart(2, "0");    // "05"
"12".padStart(2, "0");   // "12"（既に2文字なのでそのまま）
"7".padStart(3, "0");    // "007"
```

- 第1引数: 目標の文字列長
- 第2引数: 埋めるための文字（省略すると空白）

### padEnd()

文字列の**末尾**を埋める。

```js
"hi".padEnd(5, ".");     // "hi..."
"hello".padEnd(5, ".");  // "hello"（既に5文字）
```

### よくある使い方

#### 時刻のゼロ埋め

```js
const hour = String(9).padStart(2, "0");     // "09"
const minute = String(5).padStart(2, "0");   // "05"
console.log(`${hour}:${minute}`);            // "09:05"
```

#### 日付のフォーマット

```js
const month = String(3).padStart(2, "0");    // "03"
const day = String(7).padStart(2, "0");      // "07"
console.log(`2026-${month}-${day}`);         // "2026-03-07"
```

#### 連番の固定幅

```js
for (let i = 1; i <= 3; i++) {
  console.log(`ID-${String(i).padStart(4, "0")}`);
}
// ID-0001, ID-0002, ID-0003
```

### 注意点

- 対象が既に目標長以上の場合は何もしない（切り詰めは行わない）
- `Number` ではなく `String` のメソッドなので、数値は先に `String()` で変換する
- ES2017 (ES8) で追加された機能

## 参考

- [MDN - String.prototype.padStart()](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/String/padStart)
- [MDN - String.prototype.padEnd()](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/String/padEnd)
