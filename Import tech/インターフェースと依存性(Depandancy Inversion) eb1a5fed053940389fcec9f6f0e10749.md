 

# インターフェースと依存性(Depandancy Inversion)

[https://zenn.dev/sumiren/articles/3e1d976e998c64](https://zenn.dev/sumiren/articles/3e1d976e998c64)

```TypeScript
class Freshman {

}
```

犬のクラスが人型のオブジェクトに対して吠える。と言うような実装があった時に、

犬は人がどのような振る舞いをするかを理解していなければならない。(耳で聞くのようなこと。)

この時犬は人に依存している。と言える。

しかし、一度Personインターフェースを取り入れることで、犬はPersonインターフェースへは依存するが、同時にPerson自体も犬が求めるPersonインターフェースに従った実装であるべき。と言うように依存性が逆転？するようなことが起きる。

DI、Dependanrcy Inversion？DI injectionでは？についてあとで解説する。

### 得られる効能: 疎結合性。