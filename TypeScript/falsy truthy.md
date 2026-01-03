 

# falsy/truthy

# falsyについて覚えると、truthyがわかるよ。

[https://typescriptbook.jp/reference/values-types-variables/truthy-falsy-values#falsy%E3%81%AA%E5%80%A4](https://typescriptbook.jp/reference/values-types-variables/truthy-falsy-values#falsy%E3%81%AA%E5%80%A4)

注意する例

filterメソッドでnullをfalsyとして取り除こうとしおますが、0もfalsyなのでこちらも削除されてしまいます。

```TypeScript
const array = [null, 3, 0, null, 1, 2];
 
console.log(array.filter((n) => n));
```