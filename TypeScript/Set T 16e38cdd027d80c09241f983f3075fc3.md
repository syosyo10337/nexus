 

# Set<T>

`Set`はJavaScriptの組み込みAPIのひとつで、値のコレクションを扱うためのオブジェクトです。`Set`には重複する値が格納できません。`Set`に格納された値は一意(unique)になります。

```TypeScript
const fruits = new Set(["apple", "orange", "banana"]);
console.log(fruits);
```

空の`Set`オブジェクトのTypeScript上の型は`Set<unknown>`になります。これでは後から`Set`に値を追加できないので、空の`Set`を作るときは、`Set`の型変数を指定する必要があります。

```Plain
const fruits = new Set<string>();
//                    ^^^^^^^^ 型変数を指定
```

## 操作

[https://typescriptbook.jp/reference/builtin-api/set#set%E3%81%AE%E6%93%8D%E4%BD%9C](https://typescriptbook.jp/reference/builtin-api/set#set%E3%81%AE%E6%93%8D%E4%BD%9C)