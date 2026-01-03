 

# typeof operator

```TypeScript
typeof true; //=> "boolean"
typeof 0; //=> "number"
typeof "Hello World"; //=> "string"
typeof undefined; //=> "undefined"
typeof null; //=> "object"
typeof Symbol(); //=> "symbol"
typeof 1n; //=> "bigint"
typeof [1, 2, 3]; //=> "object"
typeof { a: 1, b: 2 }; //=> "object"
typeof (() => {}); //=> "function"
```

# nullの判定は注意する。

JSはnullをObjectとするので。。

```TypeScript
// まずい実装
function isObject(value) {
  return typeof value === "object"; // valueがnullになる場合を考慮していない
}
 
isObject(null); // 戻り値がtrueになってしまう


//じゃあどうするか
function isObject(value) {
  return value !== null && typeof value === "object";
}
```

## 配列もオブジェクトだけど、、

それでも配列であることを判定するには。Array.isArrayを使うと良い。

```TypeScript
if (Array.isArray(n)) {
  // n is any[]
}
```

[https://typescriptbook.jp/reference/values-types-variables/equality#%E3%81%A7%E7%AD%89%E4%BE%A1%E3%81%A7%E3%81%82%E3%82%8B%E3%81%A8%E3%81%84%E3%81%86%E3%81%93%E3%81%A8-1](https://typescriptbook.jp/reference/values-types-variables/equality#%E3%81%A7%E7%AD%89%E4%BE%A1%E3%81%A7%E3%81%82%E3%82%8B%E3%81%A8%E3%81%84%E3%81%86%E3%81%93%E3%81%A8-1)

等価演算子と、厳密等価演算子。。

等価演算子を使うんは。 x == nullの時

# 扱いを注意するべき値は?  

[https://typescriptbook.jp/reference/values-types-variables/equality#%E7%AD%89%E4%BE%A1%E3%81%A7%E3%81%82%E3%82%8B%E3%81%93%E3%81%A8%E3%82%92%E6%B0%97%E3%82%92%E3%81%A4%E3%81%91%E3%82%8B%E5%80%A4](https://typescriptbook.jp/reference/values-types-variables/equality#%E7%AD%89%E4%BE%A1%E3%81%A7%E3%81%82%E3%82%8B%E3%81%93%E3%81%A8%E3%82%92%E6%B0%97%E3%82%92%E3%81%A4%E3%81%91%E3%82%8B%E5%80%A4)