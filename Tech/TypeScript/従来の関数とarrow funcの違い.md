---
tags:
  - typescript
  - syntax
  - function
  - class
created: 2026-01-03
status: active
---

😇

# 従来の関数とarrow funcの違い

[関数宣言にはhoistingがある。](#16c38cdd-027d-80ee-8bef-db53bc07aecd)

[アロー関数の特色](#16c38cdd-027d-8063-b60a-c97201b05869)

[thisが指すもの。(従来の関数宣言)](#16c38cdd-027d-8009-b69c-efeca3e8b16a)

[<???>arrow関数のthisのスコープ](#16c38cdd-027d-8024-812c-fc8ed6e828cf)

[`**call**`**、**`**apply**`**、**`**bind**`**の振る舞い**](#16c38cdd-027d-800a-b1f9-ce7237e7c917)

[**arguments変数の有無**](#16c38cdd-027d-80e0-a1eb-cfbbd568b00e)

[**ジェネレーター**](#16c38cdd-027d-8070-8a24-f4220d5b9d1d)

[安全性が強化されたアロー関数](#16c38cdd-027d-80fb-b045-cf9f092d87af)

[引数名の重複](#16c38cdd-027d-8003-8e05-c14103685690)

[関数宣言で作った関数はvarに相当する。](#16c38cdd-027d-80dd-a769-c04d74a77e0b)

[hoisting](#16c38cdd-027d-8050-a373-f5965021829e)

[注意](#16c38cdd-027d-8008-947c-f27ec42bfe85)

### 関数宣言にはhoistingがある。

関数宣言には、巻き上げがある。

TypeScriptでは、定義前の関数式を呼び出そうとするとコンパイラーが指摘してくれます。

```TypeScript
hello();
 
function hello() {
  console.log("Hello World");
}
```

## アロー関数の特色

関数の機能の本質は、入力から計算結果を返すことです。JavaScriptの従来の関数にはこの本質以外に、オブジェクトを生成するコンストラクタの役割も担います。関数をコンストラクタとして扱うには`new`演算子を用います。

```TypeScript
function Cat(name) {
  this.name = name;
}
// Catオブジェクトを生成する
const cat = new Cat("ミケ");
console.log(cat);
```

これはproto typeベースの言語としては仕様として存在して然るべきな気がしますが、誤用を招く可能性がある。

```TypeScript
アロー関数はコンストラクタになれません。もしもJavaScriptでnew演算子を使うと実行エラーになります。誤用の心配がありません。
```

```TypeScript

const Cat = (name) => {};
const cat = new Cat("ミケ");
TypeError: Cat is not a constructor
```

  
TypeScriptでは、従来の関数でもコンストラクタとして使えないようになっています。もし、関数を誤ってnewしたとしても、コンパイルエラーで警告されるので安心です。

```TypeScript

function Cat(name: string) {
  /* ... */
}
const cat = new Cat("ミケ");
'new' expression, whose target lacks a construct signature, implicitly has an 'any' type.
```

# thisが指すもの。(従来の関数宣言)

従来の関数では、thisが指すものは、実行時の文脈によって決まるらしい。

```TypeScript
function showThis() {
  console.log(this);
}

showThis(); // -> windowオブジェクト
```

関数はオブジェクトとのメソッドとして呼び出すこともできる

この時thisが指すものは、レシーバーとなるオブジェクト自身です。

```TypeScript
const foo = { name: "Foo" };
// 関数をオブジェクトのメンバーにする
foo.showThis = showThis;
// メソッドとして呼び出す
foo.showThis();
```

従来の関数はコンストラクタとして呼び出せることを説明しましたが、コンストラクタとして呼び出した場合、`this`は生成中のオブジェクトを指します。

```TypeScript
function showThis() {
  this.name = "Foo";
  console.log(this);
}
new showThis(); //-> {name: "Foo"}
```

|   |   |
|---|---|
|文脈|thisの値|
|通常の呼び出し|グローバルオブジェクト|
|通常の呼び出し + strictモード`showThis()`|undefined|
|メソッド呼び出し`obj.showThis()`|レシーバーとなるオブジェクト自身|
|コンストラクタ呼び出し`new showThis()`|生成中のオブジェクト|

# <???>arrow関数のthisのスコープ

arrow関数の場合は、レキシカルスコープであり静的。つまり、定義した時にthisが刺すものが決定します。

```TypeScript
const oneSecond = 1000;
const timer = {
  message: "時間です！",
  start: function () {
    console.log(this); // ❶
 
    // 従来の関数
    setTimeout(function () {
      console.log(this.message); // ❷
    }, oneSecond);
 
    // アロー関数
    setTimeout(() => {
      console.log(this.message); // ❸
    }, oneSecond);
  },
};
timer.start();
```

1. については、オブジェクトのメソッド呼び出しだったので、log表示されるのは、レシーバーである

timerオブジェクトです。

2. については、**従来の関数はどこで呼び出されたか？ではなく、どのようにして呼び出された課によって決まります。**  
    今回の例で言うと、通常の関数としてただ呼び出されるので、グローバルオブジェクトとなります。  
    messageプロパティは存在しないので、undefinedが正解になる。

3. 定義された箇所、つまりどこに書かれているか？によってthisの値を決めるので、オブジェクトのメソッド内でのthisはインスタンス自身を示す。

# `**call**`**、**`**apply**`**、**`**bind**`**の振る舞い**

JavaScriptの関数はオブジェクトで、`call`、`apply`、`bind`の3つのメソッドが生えています。このメソッドは関数を呼び出すものですが、従来の関数では、第一引数に`this`が何を指すかを指定できます。

```TypeScript
function showThis() {
  console.log(this);
}
const obj = { name: "foo" };
showThis.bind(obj)(); // objをthisにバインドして、関数呼び出し
```

アロー関数にも、`call`、`apply`、`bind`が生えていますが、第一引数に値を渡しても`this`は上書きされません。

# **arguments変数の有無**

従来の関数では、`arguments`という特殊な変数が自動的に定義されます。この値は引数の配列です。

アロー関数にはargumentsはありません。

アロー関数でも可変長引数を表現したい場合には、残余引数を使います。

```TypeScript
const foo = (...args) => {
  console.log(args);
};
foo(1, 2, 3);
```

# **ジェネレーター**

JavaScriptにはジェネレーターという複数の値を生成できる特殊な関数があります。ジェネレーターは、`function`キーワードにアスタリスクをつけ、`yield`文で生成する値を記述します。

```TypeScript

function* generateNumbers() {
  yield 1;
  yield 2;
  yield 3;
}

ジェネレーターの値はfor-ofなどの反復処理で取り出せます。

for (const value of generateNumbers()) {
  console.log(value); // 1、2、3の順で出力される
}
```

ジェネレーターを定義できるのは従来の関数だけです。アロー関数はそもそもジェネレーター構文をサポートしていないため、ジェネレーターを定義することはできません。

# 安全性が強化されたアロー関数

アロー関数は既存の関数の危険な仕様を改善されているらしい。

### 引数名の重複

JavaScriptの従来の関数は、引数名の重複が許されます。引数が重複した場合、後が地になってしまいます。(ストリクトモードだったらエラーにできます。）

```TypeScript
function foo(a, a, a) {
  console.log(a);
}
foo(1, 2, 3);
// -> 3
```

## 関数宣言で作った関数はvarに相当する。

## hoisting

[https://typescriptbook.jp/reference/functions/function-expression-vs-arrow-functions#%E5%B7%BB%E3%81%8D%E4%B8%8A%E3%81%92%E3%81%A8%E9%96%A2%E6%95%B0%E5%AE%9A%E7%BE%A9%E3%81%A8%E5%91%BC%E3%81%B3%E5%87%BA%E3%81%97%E3%81%AE%E9%A0%86%E5%BA%8F](https://typescriptbook.jp/reference/functions/function-expression-vs-arrow-functions#%E5%B7%BB%E3%81%8D%E4%B8%8A%E3%81%92%E3%81%A8%E9%96%A2%E6%95%B0%E5%AE%9A%E7%BE%A9%E3%81%A8%E5%91%BC%E3%81%B3%E5%87%BA%E3%81%97%E3%81%AE%E9%A0%86%E5%BA%8F)

## 注意

```TypeScript
const taroYamada = {
  firstName: "Taro",
  lastName: "Yamada",
  // 従来の関数
  fullName1: function () {
    return this.firstName + " " + this.lastName;
  },
  // アロー関数
  fullName2: () => {
    return this.firstName + " " + this.lastName;
  },
};
console.log(taroYamada.fullName1()); //-> "Taro Yamada"

console.log(taroYamada.fullName2()); //-> undefined undefined
```