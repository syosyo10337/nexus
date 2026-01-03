 

# Static Creation Method

静的生成メソッドはstaticとして宣言される、言い換えるながらオブジェクトの生成を必要とせず、クラスと呼ぶことも可能なもの。

“静的ファクトリーメソッド”のような表現をされることがあるが、誤解を招く表現である。

`Factory Method`は継承を前提とする設計パターンだから。

> **Static creation method** is a creation method declared as `static`. In other words, it can be called on a class and doesn’t require an object to be created.  
>   
> Don’t be confused when someone calls methods like this a “static factory method”. That’s just a bad habit. The **[Factory Method](https://refactoring.guru/design-patterns/factory-method)** is a design pattern that relies on inheritance. If you make it `static`, you can no longer extend it in subclasses, which defeats the purpose of the pattern.

[cf.](https://refactoring.guru/design-patterns/factory-comparison) **[3. Static creation method](https://refactoring.guru/design-patterns/factory-comparison)**