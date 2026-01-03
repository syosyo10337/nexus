---
tags:
  - typescript
  - type-system
  - tooling
  - data-structure
created: 2026-01-03
status: active
---

# Mapped Types

インデックス型では設定時はどのようなキーも自由に設定できてしまい、アクセス時は毎回`undefined`かどうかの型チェックが必要です。入力の形式が決まっているのであればMapped Typesの使用を検討できます。

```TypeScript
type SystemSupportLanguage = "en" | "fr" | "it" | "es";

type Butterfly = {
	[key in SystemSupportLanguage]: string;
};

const butterflies: Butterfly = {
  en: "Butterfly",
  fr: "Papillon",
  it: "Farfalla",
  es: "Mariposa",
  de: "Schmetterling", // これはエラーになるよ。
};
```

Readonly<T>のユーティリティ型もこの機能を使って実装されているよ。

```TypeScript
type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};
```

もしプロパティを追加したい場合には、インターセクション型を作る必要があります。

```TypeScript
type KeyValues = {
	[K in string]: string;
}
type Name = {
	name: string;
}
type KeyValuesAndName = keyValues & Name;

//もしくは
type KeyValuesAndName = {
  [K in string]: string;
} & {
  name: string; // 追加のプロパティ
};
```

[https://qiita.com/_ken_/items/5f90aa1ea776bc03857b](https://qiita.com/_ken_/items/5f90aa1ea776bc03857b)