---
tags:
  - typescript
  - type-system
  - data-structure
created: 2026-01-03
status: active
---

# unknown型

TypeScriptのunknown型は、型が何かわからないときに使う型です。

## unknown型は型安全なany型[​](https://typescriptbook.jp/reference/statements/unknown#unknown%E5%9E%8B%E3%81%AF%E5%9E%8B%E5%AE%89%E5%85%A8%E3%81%AAany%E5%9E%8B)

unknown型はよく「型安全なany型」と言われ、any型と対比されます。

any型はどのような型の変数にも代入できます

```TypeScript
// any型はどのような型の変数にも代入できます。

const value: any = 10;
const int: number = value;
const bool: boolean = value;
const str: string = value;
const obj: object = value;

// 一方、unknown型の値は具体的な型へ代入できません。
const value: unknown = 10;
const int: number = value;
Type 'unknown' is not assignable to type 'number'.
const bool: boolean = value;
Type 'unknown' is not assignable to type 'boolean'.
const str: string = value;
Type 'unknown' is not assignable to type 'string'.
const obj: object = value;
Type 'unknown' is not assignable to type 'object'.
```

unknown型だとしても、型ガードをすることによって、型の絞り込みができるよ。

## 用途

[https://typescriptbook.jp/reference/statements/unknown#unknown%E3%81%AE%E7%94%A8%E9%80%94](https://typescriptbook.jp/reference/statements/unknown#unknown%E3%81%AE%E7%94%A8%E9%80%94)

### any とunknown

[https://typescriptbook.jp/reference/statements/any-vs-unknown](https://typescriptbook.jp/reference/statements/any-vs-unknown)