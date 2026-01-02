 

# never type

```TypeScript
type NumberString = number & string;
//このインターセクション型はneverです。
```

## voidとnever

```TypeScript
const ok: void = undefined;
const ng: never = undefined; // ❌
```

|   |   |   |
|---|---|---|
|`void`|無い|`return`されるか、最後まで実行される|
|`never`|無い|中断されるか、永遠に実行される|

### 網羅性のチェックをしたい時には

`default`分岐で網羅性をチェックしたい値をnever型へ代入してみる。

```TypeScript
function printLang(ext: Extension): void {
  switch (ext) {
    case "js":
      console.log("JavaScript");
      break;
    case "ts":
      console.log("TypeScript");
      break;
    default:
      const exhaustivenessCheck: never = ext;
      break;
  }
}
```

よりちゃんと設計すると

```TypeScript
class ExhaustiveError extends Error {
  constructor(value: never, message = `Unsupported type: ${value}`) {
    super(message);
  }
}

function printLang(ext: Extension): void {
  switch (ext) {
    case "js":
      console.log("JavaScript");
      break;
    case "ts":
      console.log("TypeScript");
      break;
    default:
      throw new ExhaustiveError(ext);
  }
}
```