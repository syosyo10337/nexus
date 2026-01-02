 

# static field/static method

JS自体にはstatic fieldを定義することはできません。

```TypeScript
class SomeClass {}
SomeClass.field = 123;
console.log(SomeClass.field);
```

  
TSだと、

```TypeScript
class SomeClass {
  static field: number = 123;
}
 
console.log(SomeClass.field);
```

各種、修飾子との兼ね合い。

順番変えてもいいのかな？

```TypeScript
class SomeClass {
  private static readonly field: number;
}
```