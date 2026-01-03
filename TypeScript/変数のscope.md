 

# 変数のscope

変数が参照可能な有効範囲のことです。

[https://typescriptbook.jp/reference/statements/variable-scope](https://typescriptbook.jp/reference/statements/variable-scope)

## local scope

関数のスコープだね!

### レキシカルスコープ[​](https://typescriptbook.jp/reference/statements/variable-scope#%E3%83%AC%E3%82%AD%E3%82%B7%E3%82%AB%E3%83%AB%E3%82%B9%E3%82%B3%E3%83%BC%E3%83%97)

レキシカルスコープ(lexical scope)変数とは、関数を定義した地点から参照できる、関数の外の変数を言います。

`const x = 100; function a() { console.log(x); // 関数の外の変数が見える} a();`

### ブロックスコープ

```TypeScript
if (navigator.userAgent.includes("Firefox")) {
  const browser = "Firefox";
} else {
  const browser = "Firefox以外";
}
console.log(browser); // 参照できずエラー


let browser;
if (navigator.userAgent.includes("Firefox")) {
  browser = "Firefox";
} else {
  browser = "Firefox以外";
}
console.log(browser); // OK
```