 

# loopをする。

```TypeScript
const numbers = [1, 2, 3];
for (const n of numbers) {
  console.log(n);
}

const words = ["I", "love", "TypeScript"];
for (const [index, word] of words.entries()) {
  console.log(index, word);
}
 
 
```

entriesを使うと、indexも取得できるよ。