 

# Provider/Notifierの書き方

# Providerの書き方

[https://riverpod.dev/docs/essentials/first_request](https://riverpod.dev/docs/essentials/first_request)

```Dart
@riverpod
Result myFunction(MyFunctionRef ref) {
  <your logic here>
}
```

|   |   |   |
|---|---|---|
|The annotation|All providers must be annotated with `@riverpod` or `@Riverpod()`. This annotation can be placed on global functions or classes.  <br>Through this annotation, it is possible to configure the provider.  <br>For example, we can disable "auto-dispose" (which we will see later) by writing `@Riverpod(keepAlive: true)`.|全てのプロバイダーは、このアノテーションが必要。グローバツな関数やクラスにつけることができて、これによってproviderにすることができる。|
|The annotated function|The name of the annotated function determines how the provider will be interacted with.For a given function myFunction, a generated myFunctionProvider variable will be generated.Annotated functions must specify a "ref" as first parameter.Besides that, the function can have any number of parameters, including generics. The function is also free to return a Future/Stream if it wishes to.This function will be called when the provider is first read.Subsequent reads will not call the function again, but instead return the cached value.|refが必ず必要です。|
|Ref|An object used to interact with other providers.All providers have one; either as parameter of the provider function, or as a property of a Notifier.The type of this object is determined by the name of the function/class.||

---

# Notifierの書き方

```Dart
@riverpod
class MyNotifier extends _$MyNotifier {
  @override
  Result build() {
    <your logic here>
  }
  <your methods here>
}
```

💡

construtorを作るな。buildの中に書きましょう。

```Dart
class MyNotifier extends ... {
MyNotifier() {
// ❌ Don't do this
// This will throw an exception
state = AsyncValue.data(42);
}

@override
Result build() {
// ✅ Do this instead
state = AsyncValue.data(42);
}
}
```

`

|   |   |   |
|---|---|---|
|The annotation|All providers must be annotated with `@riverpod` or `@Riverpod()`. This annotation can be placed on global functions or classes.  <br>Through this annotation, it is possible to configure the provider.  <br>For example, we can disable "auto-dispose" (which we will see later) by writing `@Riverpod(keepAlive: true)`.||
|The Notifier|When a `@riverpod` annotation is placed on a class, that class is called a "Notifier".  <br>The class must extend `_$NotifierName`, where `NotifierName` is class name.  <br>Notifiers are responsible for exposing ways to modify the state of the provider.  <br>Public methods on this class are accessible to consumers using `ref.read(yourProvider.notifier).yourMethod()`.NOTE  <br>Notifiers should not have public properties besides the built-in `state`, as the UI would have no mean to know that state has changed.|NotifierName がクラス名だとしたら、extend _$NotifierName 出なければなりません。  <br>  <br>同時に、notifierというのはproviderの状態を変更する方法を提供する責任があります。実際にそのメソッドへのアクセス方法は `ref.read(yourProvider.notifier).yourMethod()`|
|The build method|All notifiers must override the `build` method.  <br>This method is equivalent to the place where you would normally put your logic in a non-notifier provider.  <br>This method should not be called directly.|すべてのnotifierはbuildメソッドをoverrideする必要があります。このmehodには基本的に単純なproviderのロジックに当たる部分を記載します。  <br>ただし直接呼ばれるべきものではありません。|