---
tags:
  - typescript
  - syntax
  - function
  - async
created: 2026-01-03
status: active
---

# 即時実行関数式(IIFE)

Immediately invoked function expressionとは定義と同時に実行される関数のこと。

デザインパターンの1種で、Self-Executing Anonymous Function; 自己実行匿名関数とも呼ばれます

```TypeScript
(() => {
  console.log("IIFE");
})();

const result1 = (function (arg: string) {
  console.log(`IIFE with args:${arg}`);
  return "IIFE with args";
})("hoge");

const result2 = await(async () => {
  console.log("async IIFE");
  return "async IIFE";
})();
```

# Type Scriptでの利用シーンについて

[https://typescriptbook.jp/reference/functions/iife#typescript%E3%81%A7%E3%81%AE%E5%88%A9%E7%94%A8%E3%82%B7%E3%83%BC%E3%83%B3](https://typescriptbook.jp/reference/functions/iife#typescript%E3%81%A7%E3%81%AE%E5%88%A9%E7%94%A8%E3%82%B7%E3%83%BC%E3%83%B3)

- useEffectなど、非同期関数を受け取らない引数に非同期処理を渡したい時につかう

- ifやswitchなどを式として扱いたい場合

- スコープ内での変数汚染を防ぐ

```TypeScript
async function callApiAAndB() {
  await (async () => {
    const result = await fetch("api1");
    if (result !== "OK") {
      console.log(result);
    }
  })();
  await (async () => {
    const result = await fetch("api2");
    if (result !== "Success") {
      console.log(result);
    }
  })();
}
```