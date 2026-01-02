 

# overload function

TypeScriptの機能の一つで、ひとつの関数に異なる関数シグネチャを複数もつ関数のこと。

関数シグネチャとは、どのような引数を取るか、どのような戻り値を返すかといった関数の型のことです。要するに、異なる引数や戻り値のパターンがいくつかある関数をオーバーロード関数と言います。

```TypeScript
// 関数シグネチャ部分
function hello(person: string): void; // シグネチャ1
function hello(persons: string[]): void; // シグネチャ2
// 関数の実装部分
function hello(person: string | string[]): void {
  if (typeof person === "string") {
    console.log(`Hello ${person}`);
  } else {
    console.log(`Hello ${person.join(",")}`);
  }
}
```

比較: Kotlinのオーバーロード関数

```Kotlin
fun hello(person: String) {
  println("Hello $person")
}

fun hello(persons: Array<String>) {
  println("Hello ${persons.joinToString(",")}")
}
```

JSとの乖離がどうしても発生してしまうため、TSのオーバーロード関数は、関数シグネチャの定義にとどめられています。

### **アロー関数とオーバーロード**

```Kotlin
// 関数呼び出しシグネチャでHello型を定義
type Hello = {
  (person: string): void;
  (persons: string[]): void;
};
// Hello型で型注釈
const hello: Hello = (person: string | string[]): void => {
  if (typeof person === "string") {
    console.log(`Hello ${person}`);
  } else {
    console.log(`Hello ${person.join(",")}`);
  }
};

// 関数型とインターセクション型を用いてHello型を定義
type Hello = ((person: string) => void) & ((persons: string[]) => void);
const hello: Hello = (person: string | string[]): void => {
  if (typeof person === "string") {
    console.log(`Hello ${person}`);
  } else {
    console.log(`Hello ${person.join(",")}`);
  }
};
```

オーバーロードの関数シグネチャは順番が重要になります。TypeScriptは関数シグネチャを上から順に試していき、最初にマッチしたシグネチャを採用します。そのため、より詳しい関数シグネチャが上に、詳しくないものが下に来るように書き並べなければなりません。詳しいとは、引数の型の範囲が狭いという意味です。たとえば、`number`より`1 | 2`のほうが狭い型です。`any`は`number`より広い型です。

# 開発tips

引数の数が違うだけの場合、オーバーロードより[オプション引数](https://typescriptbook.jp/reference/functions/optional-parameters)を使ったほうがよいです。

引数の型だけが異なる場合は、[ユニオン型](https://typescriptbook.jp/reference/values-types-variables/union)を使ったほうがシンプルです。

### 代わりにジェネリクスを使う[​](https://typescriptbook.jp/reference/functions/overload-functions#%E4%BB%A3%E3%82%8F%E3%82%8A%E3%81%AB%E3%82%B8%E3%82%A7%E3%83%8D%E3%83%AA%E3%82%AF%E3%82%B9%E3%82%92%E4%BD%BF%E3%81%86)

```TypeScript
function func(x: boolean): boolean;
function func(x: number): number;
function func(x: string): string;
function func(x: boolean | string | number): boolean | string | number {
  return x;
}

function func<T extends boolean | number | string>(x: T): T {
  return x;
}
```