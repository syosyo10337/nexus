 

# const assertion (as const)

readonlyにした上で、　リテラル型にしてくれる。

```TypeScript
const pikachu = {
  name: "pikachu",
  no: 25,
  genre: "mouse pokémon",
  height: 0.4,
  weight: 6.0,
} as const;

let obj: Readonly<{
  a: number;
  b: number;
  c: number;
  d: number;
  e: number;
  f: number;
}>;
// もしくは、ひとつづつにreadonly キーワードをしているする必要がある。
```

## readonlyとの差異。

[https://typescriptbook.jp/reference/values-types-variables/const-assertion#readonly%E3%81%A8const-assertion%E3%81%AE%E9%81%95%E3%81%84](https://typescriptbook.jp/reference/values-types-variables/const-assertion#readonly%E3%81%A8const-assertion%E3%81%AE%E9%81%95%E3%81%84)

`**readonly**`**はプロパティごとにつけられる**

`**const assertion**`**は再帰的に**`**readonly**`**にできる**