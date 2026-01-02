 

# type guard function（型ガード関数）

TypeScriptのコンパイラは`if`や`switch`といった制御フローの各場所での変数の型を分析しており、この機能を[制御フロー分析](https://typescriptbook.jp/reference/statements/control-flow-analysis-and-type-guard)(control flow analysis)と呼びます。

ビルトインの型ガードとしては、typeof /instanceofがありますが、ユーザ独自に定義スルこともできるようです。

## 型述語(type predicate)

animal is Duck ここの部分らしいです。

```TypeScript
function isDuck(animal: Animal): animal is Duck {
  return animal instanceof Duck;
}
```

難しいと思うんですけど、、

述語(predicate)とは、論理学において対象が持つ属性や関係などを表現するものです。たとえば、「Xは素数である(X is a prime number)」という命題Pがあったとき、Xを変数としてP(x)のように述語を表現できます。この述語P(X)は変数Xが素数の3などであれば真を返し、非素数の4などであれば偽を返します。これはまさに真か偽(真理値)を返す関数です。

つまり、型の制御を行いたい場合は、戻り値の部分にtype predicateを使うことで、制御構文の中で型の絞り込みもできるようにするよ。