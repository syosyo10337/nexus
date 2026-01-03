---
tags:
  - typescript
  - type-system
  - syntax
  - function
created: 2026-01-03
status: active
---

# Conditional Types

Conditional Typesは日本語では条件付き型、型の条件分岐、条件型などと呼ばれ、ちょうど三項演算子のように`?`と`:`を使って`T extends U ? X : Y`のように書きます。これは`T`が`U`に割り当て可能である場合、`X`になり、そうでない場合は`Y`になります。

```TypeScript
type IsString<T> = T extends string ? true : false;
 
const a: IsString<"a"> = true;
// このとき変数aはtrueのリテラル型になります。
```

  
ネストしたオブジェクトを再帰的にreadonlyにしたい場合には、、as constを使うか。

mapped typesとConditional typesを使うこと良いらしい。

```TypeScript
type Freeze<T> = Readonly<{
  [P in keyof T]: T[P] extends object ? Freeze<T[P]> : T[P];
}>;
```

# ?? infer

inferはConditional Typesの中で使われる型演算子です。`infer`は「推論する」という意味で`extends`の右辺にのみ書くことができます。

### **ユーティリティ型**`**ReturnType<T>**`**の例から**`**infer**`**を知る**

```TypeScript
type ReturnType<T extends (...args: any) => any> = T extends (
  ...args: any
) => infer R
  ? R
  : any;
```

# union distribution