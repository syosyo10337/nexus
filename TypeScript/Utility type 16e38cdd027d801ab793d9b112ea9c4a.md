 

# Utility type

TypeScriptでは型から別の型を導き出す機能があります。既存の型を再度利用して、新たな型を生み出すことを本書では「型の再利用」と呼ぶことにします。

```TypeScript
type Obj = { a: string; b: string; c: string };
type Keys = keyof Obj;
//=> "a" | "b" | "c"
```

### typeof

TypeScriptの`typeof`は変数から型を抽出する型演算子です。次は、変数`point`に`typeof`型演算子を用いて、`Point`型を定義する例です。このPoint型は次のような型になります。

```Plain
const point = { x: 135, y: 35 };
type Point = typeof point;
```

ここで説明したのはTypeScriptのtypeof**型**演算子です。JavaScriptのtypeof演算子と同じ名前ですが、まったく別のものなので注意してください。

### keyof 型演算子

[https://typescriptbook.jp/reference/type-reuse/keyof-type-operator](https://typescriptbook.jp/reference/type-reuse/keyof-type-operator)

- `Required<T>`
    
    - `Required<T>`は、`T`のすべてのプロパティからオプショナルであることを意味する`?`を取り除くユーティリティ型です。
    

- `Readonly<T>`
    
    - `Readonly<T>`は、オブジェクトの型`T`のプロパティをすべて読み取り専用にするユーティリティ型です。
    
    - Readonlyの効果は再帰的じゃないので、もし再帰的実行したい場合にはas const を使う必要がある。
    

- `Partial<T>`
    
    - `Partial<T>`は、オブジェクトの型`T`のすべてのプロパティをオプションプロパティにするユーティリティ型です。
    

- `Record<Keys, Type>`
    
    - `Record<Keys, Type>`はプロパティのキーが`Keys`であり、プロパティの値が`Type`であるオブジェクトの型を作るユーティリティ型です。
    

- `Pick<T, Keys>` (オブジェクト用)
    
    - `Pick<T, Keys>`は、型`T`から`Keys`に指定したキーだけを含むオブジェクトの型を返すユーティリティ型です。
    
    ```TypeScript
    type User = {
      surname: string;
      middleName?: string;
      givenName: string;
      age: number;
      address?: string;
      nationality: string;
      createdAt: string;
      updatedAt: string;
    };
    type Person = Pick<User, "surname" | "middleName" | "givenName">;
    ```
    

- `Omit<T, Keys>` (オブジェクト用)
    
    - `Omit<T, Keys>`は、オブジェクトの型`T`から`Keys`で指定したプロパティを除いたobject型を返すユーティリティ型です。
    
    ```TypeScript
    type User = {
      surname: string;
      middleName?: string;
      givenName: string;
      age: number;
      address?: string;
      nationality: string;
      createdAt: string;
      updatedAt: string;
    };
    type Optional = "age" | "address" | "nationality" | "createdAt" | "updatedAt";
    type Person = Omit<User, Optional>;
    ```
    
    - Keysに存在しないプロパティkeyを指定しても、copilerエラーにならないそうです。
    

- `Exclude<T, U>` (ユニオン用)
    
    - `Exclude<T, U>`は、ユニオン型`T`から`U`で指定した型を取り除いたユニオン型を返すユーティリティ型です。
    

- `**Extract<T, U>**` (ユニオン用)
    
    - `Extract<T, U>`は、ユニオン型`T`から`U`で指定した型だけを抽出した型を返すユーティリティ型です。
    

- `**NoInfer<T>**`
    
    - `NoInfer<T>`は、`T`の型推論を防ぐためのユーティリティ型です。推論interference
    

- `NonNullable<T>`は、ユニオン型`T`から`null`と`undefined`を取り除いたユニオン型を返すユーティリティ型です。
    
    - `NonNullable<null>`と`NonNullable<undefined>`は`never`型になります。
    
    ```TypeScript
    
    type Never1 = NonNullable<null>; // -> never
    type Never2 = NonNullable<undefined>;
    ```
    

- `ReturnType<T>`は、関数型`T`の戻り値を取得するユーティリティ型です。
    
    ```TypeScript
    const isEven = (num: number) => {
      return num / 2 === 0;
    };
     
    type isEvenRetType = ReturnType<typeof isEven>;
    ```
    

- `Awaited<T>`は、Promiseの解決値の型Tを取得するユーティリティ型です。  
    Promiseが解決するまでの非同期処理の結果が必要な場合や、async/awaitパターンで複数の入れ子になったPromiseの中から解決済みの値の型を取り出したい場合に非常に便利です。