---
tags:
  - typescript
  - type-system
  - function
  - class
created: 2026-01-03
status: active
---

# ジェネリクス (generics)

**型の安全性とコードの共通化を両立する**ことができます。

`T>`の書き方について説明します。もしジェネリクスとして `<T>`だけを記述する場合、TypeScriptはそれがJSXのタグと混同してしまう可能性があります。これは、TypeScriptのパーサーが `<T>`と読み取ったとき、それがジェネリクス開始を示すものなのかJSX要素の開始を示すものなのかを特定するのが難しいためです。この混同を避けるためには、ジェネリクスの開始を示す `<T>`に `,`を追加し、`<T,>`と記述する必要があります。

## 型引数に制約をつける。

```TypeScript
function changeBackgroundColor<T extends HTMLElement>(element: T) {
  element.style.backgroundColor = "red";
  return element;
}
```

interfaceに対して使うこともできるらしい。

### デフォルト型引数

```TypeScript
type MyErrorEvent<T = Error> = {
  error: T;
  type: string;
};

// 型引数との併用で考えると。

type MyErrorEvent<T extends Error = SyntaxError> = {
  error: T;
  type: string;
};
```

# variance (変性)

型の互換性を判定する際にvariance(変性)という概念が使われます。変性とは型同士の関係性を示すものです。