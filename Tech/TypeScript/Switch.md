---
tags:
  - typescript
  - syntax
created: 2026-01-03
status: active
---

# Switch

switch構文でその値であると判断されるのは等価演算(`==`)ではなく厳密等価演算(`===`)です。たとえば`null`と`undefined`は等価演算では等しいとされますが厳密等価演算では等しくありません。

JSのswitchは,分岐を抜けることができない。つまりfallthroughしてしまう。

`noFallthroughCasesInSwitch`

このコンパイルオプションを指定すると良いでしょう。

### switchの変数スコープ

何もしないとcase間にスコープは作られない。

そのためもし、caseの中にスコープを作りたいのであれば

{}をつけましょう。

```TypeScript
let x = 1;
switch (x) {
  case 1: {
    const sameName = "A";
    break;
  }
  case 2: {
    const sameName = "B";
    break;
  }
}
```