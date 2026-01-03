---
tags:
  - typescript
  - type-system
  - function
  - class
created: 2026-01-03
status: active
---

# Interface

インターフェースはクラスが実装すべきフィールドやメソッドを定義した型です。クラスはインターフェースを実装することで、インターフェースが求めるメソッド名や引数の型に則っているかをチェックすることができます。

こちらもJSにはない機能だが、TSが提供している。TypeScriptで定義されたインターフェースは、コンパイルチェックに活用された後、JavaScriptコードを生成する過程で消されるため

TypeScriptでもインターフェースをクラスに実装させることはできますが、それに加えて、TypeScriptは構造的部分型なので、インターフェースと実装関係がないオブジェクトの型注釈としても利用できます。

```TypeScript
interface Person {
  name: string;
  age: number;
}
 
const taro: Person = {
  name: "太郎",
  age: 12,
};
```

```TypeScript
interface Human {
  think(): void;
}
 
class Developer implements Human {
  think(): void {
    console.log("どういう実装にしようかな〜");
  }
}
```

[https://typescriptbook.jp/reference/object-oriented/interface/interface-inheritance](https://typescriptbook.jp/reference/object-oriented/interface/interface-inheritance)

[珍しいinterfaceの仕様](Interface/%E7%8F%8D%E3%81%97%E3%81%84interface%E3%81%AE%E4%BB%95%E6%A7%98%2016e38cdd027d80c78805f5e7f38f921b.html)

Typeスクリプトでは、instanceofはinterfaceに対しては使用することができません。

なぜかというと、インターフェースがTypeScript固有の機能でコンパイル時にコードから消えるためです。インターフェースは型レベルのものです。TypeScriptはJavaScriptにコンパイルするとき、型レベルのものを消します。変数の型注釈がコンパイル時に消えるのと同じ理屈です。

```TypeScript
interface MyInterface {}
 
class MyClass implements MyInterface {}
 
const a = new MyClass();
console.log(a instanceof MyInterface);
```

💡

**インターフェースの判定には型ガード関数を使う**

[interface とtypeの違い](Interface/interface%20%E3%81%A8type%E3%81%AE%E9%81%95%E3%81%84%2016e38cdd027d807ba5b2c0e912096cee.html)