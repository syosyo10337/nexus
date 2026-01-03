 

# assertion functions

ユーザ定義の型ガード関数としては、type predicateとは別の手段として用いることができるものの一つ。

Type predicateはboolean型の戻り値に対して使いましたがこちらは関数が例外を投げるかどうかで判定します。型ガード関数のページで作った関数`isDuck()`をAssertion functionsで書きかえると次のようになります。

```TypeScript
function isDuck(animal: Animal): asserts animal is Duck {
  if (walksLikeDuck(animal)) {
    if (quacksLikeDuck(animal)) {
      return;
    }
  }
 
  throw new Error("YOU ARE A FROG!!!");
}
 
// ここではquacks()は存在しない
animal.quacks();
// -> Property 'quacks' does not exist on type 'Animal'.

 
isDuck(animal);
 
animal.quacks();
```