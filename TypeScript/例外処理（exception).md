---
tags:
  - typescript
  - type-system
  - function
  - async
created: 2026-01-03
status: active
---

# 例外処理（exception)

```TypeScript
try {
  throw new Error("something wrong");
} catch (e) {
  // something wrong
  console.log(e.message);
}

```

  
throwはErrorオブジェクト以外もスローできるが、、これはアンチパターンなのでやめましょう。

## catchの型はdefault ではanyです。

`useUnknownInCatchVariables`

## JSで発生するエラーごとにハンドルしたい時は

```TypeScript
try {
  // ...
} catch (e) {
  if (e instanceof TypeError) {
    // TypeErrorに対する処理
  } else if (e instanceof RangeError) {
    // RangeErrorに対する処理
  } else if (e instanceof EvalError) {
    // EvalErrorに対する処理
  } else {
    // その他のエラー
  }
}
```

### try-catchはブロックスコープ[​](https://typescriptbook.jp/reference/statements/exception#try-catch%E3%81%AF%E3%83%96%E3%83%AD%E3%83%83%E3%82%AF%E3%82%B9%E3%82%B3%E3%83%BC%E3%83%97)

JavaScriptのtry-catch文内の変数はブロックスコープになります。そのため、try-catch内で宣言された変数は、try-catchの外では参照できません。

```TypeScript
async function fetchData() {
  try {
    const res = await fetch("https://jsonplaceholder.typicode.com/todos/1");
    const data = await res.json();
    console.log(data); // dataが参照できる
  } catch (e: unknown) {
    return;
  }
  console.log(data); // dataが参照できない
Cannot find name 'data'.Cannot find name 'data'.}

fetchData();

```

## finally ブロック

JavaScriptにもJavaやPHPと同じようにfinallyが書けます。finallyは例外が発生しようがしまいが必ず実行される処理です。finallyはtry-catchの後に書きます。finally内の処理はtryとcatchの処理が実行された後に実行されます。