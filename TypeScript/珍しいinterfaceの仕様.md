 

# 珍しいinterfaceの仕様

## open-ended and declaration merging

TypeScriptでは、同じ名前のインターフェースを宣言してもエラーにはなりません。

かつ

```TypeScript
interface Foo {
  a: number;
}
interface Foo {
  b: number;
}　//エラーにならない。

// 以下と同義になる。
interface Foo {
  a: number;
  b: number;
}
```