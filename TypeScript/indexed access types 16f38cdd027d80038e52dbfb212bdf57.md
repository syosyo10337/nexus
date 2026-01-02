 

# indexed access types

```TypeScript
オブジェクト型["プロパティ名"];
配列型[number]; //配列の場合にはこのフォーマットで要素の型を取得できるそうです。
```

```TypeScript
type A = { foo: number };
type Foo = A["foo"];
```

  
ユニオン型をつかって参照させることができますよ。

```TypeScript
type Person = { name: string; age: number };
type T = Person["name" | "age"];
```

## タブル型

```TypeScript
type Tuple = [string, number];
type T = Tuple[0]; //number型がほしいなら, number型を使う。
```