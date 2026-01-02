 

# Enum

JSをリスペクトする実装になっていることにより、いくつか仕様上の問題を抱えている。

```TypeScript
enum Position {
  Top,
  Right,
  Bottom,
  Left,
}

// JSにコンパイルすると　
var Position;
(function (Position) {
    Position[Position["Top"] = 0] = "Top";
    Position[Position["Right"] = 1] = "Right";
    Position[Position["Bottom"] = 2] = "Bottom";
    Position[Position["Left"] = 3] = "Left";
})(Position || (Position = {}));
```

```TypeScript
console.log(Position.Top); // 0
console.log(Position.Right); // 1
console.log(Position.Bottom); // 2
```

# numeric enum

メンバーの値が、数字

```TypeScript
enum Position {
  Top, // 0
  Right, // 1
  Bottom, // 2
  Left, // 3
}

/// 値を代入するとそれに続く連番になる


enum Position {
  Top = 1, // 1
  Right, // 2
  Bottom, // 3
  Left, // 4
}


enum Test {
  one,
  two = 1,
  three
}

console.log(Test.one); //0になるわ。
```

[https://typescriptbook.jp/reference/values-types-variables/enum/enum-problems-and-alternatives-to-enums#%E6%95%B0%E5%80%A4%E5%88%97%E6%8C%99%E5%9E%8B%E3%81%AB%E3%81%AF%E5%9E%8B%E5%AE%89%E5%85%A8%E4%B8%8A%E3%81%AE%E5%95%8F%E9%A1%8C%E3%81%8C%E3%81%82%E3%82%8B](https://typescriptbook.jp/reference/values-types-variables/enum/enum-problems-and-alternatives-to-enums#%E6%95%B0%E5%80%A4%E5%88%97%E6%8C%99%E5%9E%8B%E3%81%AB%E3%81%AF%E5%9E%8B%E5%AE%89%E5%85%A8%E4%B8%8A%E3%81%AE%E5%95%8F%E9%A1%8C%E3%81%8C%E3%81%82%E3%82%8B)

# string enum

メンバーの値が、文字列

[https://typescriptbook.jp/reference/values-types-variables/enum/enum-problems-and-alternatives-to-enums#%E6%96%87%E5%AD%97%E5%88%97%E5%88%97%E6%8C%99%E5%9E%8B%E3%81%A0%E3%81%91%E5%85%AC%E7%A7%B0%E5%9E%8B%E3%81%AB%E3%81%AA%E3%82%8B](https://typescriptbook.jp/reference/values-types-variables/enum/enum-problems-and-alternatives-to-enums#%E6%96%87%E5%AD%97%E5%88%97%E5%88%97%E6%8C%99%E5%9E%8B%E3%81%A0%E3%81%91%E5%85%AC%E7%A7%B0%E5%9E%8B%E3%81%AB%E3%81%AA%E3%82%8B)

# 代替策

オブジェクトリテラルを使用する。

```Bash
as const 
+
 type T = (typeof T)[keyof typeof T] パターンが最も一般的で推奨される手法です。

なんならSatisfies演算子を使う（TypeScript 4.9+）
```

```TypeScript
export const Position = {
  TOP: 'top',
  RIGHT: 'right',
  BOTTOM: 'bottom',
  LEFT: 'left',
} as const satisfies Record<string, string>;

export type Position = (typeof Position)[keyof typeof Position];
```

💡

````TypeScript

type Keys = keyof typeof obj
// Keys = 'errorBoundary' | 'globalErrorBoundary'

type Values = (typeof obj)[Keys]
// (typeof obj)['errorBoundary' | 'globalErrorBoundary']
// これは以下と同じ：
// (typeof obj)['errorBoundary'] | (typeof obj)['globalErrorBoundary']
// = 'error-boundary' | 'global-error-boundary'
```



````

`**typeof**` **— 値から型を取得する**

```Bash
const obj = {
  errorBoundary: 'error-boundary',
  globalErrorBoundary: 'global-error-boundary',
} as const;

// typeof obj は以下の型を表す：
type ObjType = typeof obj;
// = {
//   readonly errorBoundary: "error-boundary";
//   readonly globalErrorBoundary: "global-error-boundary";
// }
```

### `keyof` — 型のキーを取得する

```Bash
type ObjType = typeof obj;
type Keys = keyof ObjType;
// = 'errorBoundary' | 'globalErrorBoundary'

// つまり、オブジェクトのキーを文字列型の union にする
```

keyof objではいけない理由keyofは型演算子なので、値に直接使えない。

cf.

[

keyof型演算子 | TypeScript入門『サバイバルTypeScript』

keyofはオブジェクトの型からプロパティ名を型として返す型演算子です。たとえば、nameプロパティを持つ型に対して、keyofを使うと文字列リテラル型の"name"が得られます。

![](TypeScript/Attachments/logo%201.svg)https://typescriptbook.jp/reference/type-reuse/keyof-type-operator

![](TypeScript/Attachments/keyof型演算子.png)](https://typescriptbook.jp/reference/type-reuse/keyof-type-operator)