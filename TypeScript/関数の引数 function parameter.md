 

# 関数の引数 function parameter

# **引数の個数**

JSでは引数のチェックを行いません。過剰に渡されても、不足していてもエラーになりません。

```TypeScript
function increment(n) {
  return n + 1;
}
increment(1, 2); //-> 2(つまり第一引数を受け取り、　第二引数は無視。
```

ただ、それでも引数をチェックしたい場合には `arguments.length`でチェックする必要がありそうです。

TSでは、これらのチェックからコンパイルエラーにしてくれます。