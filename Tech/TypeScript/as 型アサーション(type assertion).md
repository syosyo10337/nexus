---
tags:
  - typescript
  - type-system
created: 2026-01-03
status: active
---

# as 型アサーション(type assertion)

型アサーションはコンパイラに「私を信じて！私のほうが型に詳しいから」と伝えるようなものです。

## 書き方

as 構文

```TypeScript
const value: string | number = "this is a string";
const strLength: number = (value as string).length;
```

angle-bracket syntax

```TypeScript
const value: string | number = "this is a string";
const strLength: number = (<string>value).length;
```

どちらも好みで使っていいけど、JSX と見分けがつかないことがあるので、as 構文の方が一般的かもね。

## 無理やりに型を書き換える方法

unknown を経由する。

```TypeScript
const num = 123;
const str: string = num as unknown as string; // OK
```

## キャストとの違い

[https://typescriptbook.jp/reference/values-types-variables/type-assertion-as#%E5%9E%8B%E3%82%A2%E3%82%B5%E3%83%BC%E3%82%B7%E3%83%A7%E3%83%B3%E3%81%A8%E3%82%AD%E3%83%A3%E3%82%B9%E3%83%88%E3%81%AE%E9%81%95%E3%81%84](https://typescriptbook.jp/reference/values-types-variables/type-assertion-as#%E5%9E%8B%E3%82%A2%E3%82%B5%E3%83%BC%E3%82%B7%E3%83%A7%E3%83%B3%E3%81%A8%E3%82%AD%E3%83%A3%E3%82%B9%E3%83%88%E3%81%AE%E9%81%95%E3%81%84)

型アサーションを使う必要が出てきたら、それよりも先に、型ガードやユーザー定義型ガードで解決できないか検討してみるとよいでしょう
