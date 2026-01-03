 

# Riverpodの使い方

[Provider](#734158c3-5cde-4ca3-93f4-2a7471d3166b)

[Notifier](#88147cea-69fd-4b14-8974-a08b576138bb)

[自動生成について](#2ab38164-f527-42f0-b0a0-74b1d6541660)

[(非推奨)_StateNotifierProvider](#eaee51c6-9dbf-4e66-b581-a8d209d1fe04)

[設定](#bc0e6258-764c-4e41-8bce-36427ef88b08)

[`InterstitialAdNotifier`クラスについて](#e2677c69-7a4a-409f-92c1-fff30e9600a4)

[まとめ](#8706b8ae-167d-4e48-9eb3-2712feea8d98)

[notifierの設定](#f900156f-e1ea-4254-9015-4afb237018a3)

[providerに引数を渡す時](#c6db9e6c-a6f9-4cd9-b1a3-c870b23a8566)

[Widgetsに状態を注入する](#e9aee231-9804-4a42-97b2-66aa2907adcb)

[Consumer](#15738a61-c5bd-4165-8019-c2cec66d01ac)

[ConsumerWidgets](#3d14019c-06f7-4553-9cd1-8aa8ffca1bd7)

[使い分け](#3b66e56b-091e-4401-a44c-a7903b0a8f8c)

[ref.watch /ref.read](#d2aca0ae-30af-4986-931c-0a7e408e1f6d)

[ref.watch](#331befe0-449f-45d6-88b2-aec4b27a4674)

[ref.read](#338a990d-a05b-4eb3-aa20-ab616c39a9b1)

[https://zenn.dev/riscait/books/flutter-riverpod-practical-introduction/viewer/how-to-use-a-provider](https://zenn.dev/riscait/books/flutter-riverpod-practical-introduction/viewer/how-to-use-a-provider)

RiverPodには何種類かのProviderがありますか？

## Provider

状態を格納し、グローバルに提供する人。

providerはUIの中で呼ばれた時に初めて実行されます。UIがwidgetが存在するうちは何度も呼び出されない。cacheされた値を返します。

UIがサイドレンダーされた時に初めて再度 実行されます。

  
Providers are "lazy". Defining a provider will not execute the network request. Instead, the network request will be executed when the provider is first read.

[

Make your first provider/network request | Riverpod

Network requests are the core of any application. But there are a lot of things to consider when

![](logo.svg)https://riverpod.dev/docs/essentials/first_request

![](cover.png)](https://riverpod.dev/docs/essentials/first_request)

# Notifier

Notifiers are the "stateful widget" of providers. Notifierとはプロバイダー界のstateful widgetだそうです。

[Provider/Notifierの書き方](Riverpod%E3%81%AE%E4%BD%BF%E3%81%84%E6%96%B9/Provider%20Notifier%E3%81%AE%E6%9B%B8%E3%81%8D%E6%96%B9%20ffb67e8e1f8147198e884982e4edd40d.html)

### 自動生成について

[https://riverpod.dev/docs/concepts/about_code_generation](https://riverpod.dev/docs/concepts/about_code_generation)

## (非推奨)_StateNotifierProvider

[https://riverpod.dev/docs/migration/from_state_notifier](https://riverpod.dev/docs/migration/from_state_notifier)

通常、次のために使用されます。

カスタムイベントに反応した後、時間の経過とともに変化することができる、不変の状態を公開する。  
状態を変更するためのロジック（別名「ビジネスロジック」）を一箇所に集中させ、長期的なメンテナンス性を向上させる。

### 設定

`StateNotifierProvider`は、FlutterのRiverpodライブラリに含まれる機能の一つで、アプリケーションの状態管理を行うために使用されます。`StateNotifierProvider`を使用することで、アプリの状態を効率的に管理し、ウィジェットの再構築を必要な時にのみ行うことができます。ここでは、`StateNotifierProvider`を使用して`InterstitialAd`（インタースティシャル広告）のロードと表示を管理するクラス`InterstitialAdNotifier`を定義しています。

```Dart
final interstitialAdProvider = StateNotifierProvider<InterstitialAdNotifier, InterstitialAd?>((ref) => InterstitialAdNotifier());


// StateNotifierProvider<A, B>
// A: B型の状態をもつオブジェクトを指定する。StateNotifierを継承したクラス
// B: はAクラスが管理する状態の型情報を提供する。
// (ref) => InterstitialAdNotifier()は　Aクラスのインタスタンスを生成するためのファクトリ関数。
```

- `StateNotifierProvider<InterstitialAdNotifier, InterstitialAd?>`：`StateNotifierProvider`は、状態（この場合は`InterstitialAd?`型の状態）を持つオブジェクト（`InterstitialAdNotifier`）を提供するために使用されます。`StateNotifierProvider`のジェネリック型`<A, B>`では、`A`は`StateNotifier`を継承したクラスを指し、`B`はその`StateNotifier`が管理する状態の型を指します。ここでは、`A`に`InterstitialAdNotifier`クラスを、`B`に`InterstitialAd?`（null許容型の`InterstitialAd`）を指定しています。

- `(ref) => InterstitialAdNotifier()`：この部分は、`StateNotifierProvider`によって必要とされる`InterstitialAdNotifier`インスタンスを作成するためのファクトリ関数です。`ref`は、`ProviderReference`オブジェクトであり、他のプロバイダーへのアクセスやリソースのクリーンアップなど、プロバイダーのコンテキストに関する操作を行うために使用されます。この場合、単に新しい`InterstitialAdNotifier`インスタンスを返しています。

### `InterstitialAdNotifier`クラスについて

`InterstitialAdNotifier`クラスは、`StateNotifier<InterstitialAd?>`を継承しており、`InterstitialAd`の状態（ロードされた広告があるかどうか、またはnull）を管理します。このクラス内で、広告のロード、表示、および広告表示後の処理などのロジックを実装します。

- `InterstitialAd`のロード成功時には、状態を更新してロードされた広告を保持します。

- 広告が表示された後や、表示に失敗した場合など、適切なタイミングで状態をnullに戻したり、新しい広告をロードするなどの処理を行います。

### まとめ

この`StateNotifierProvider`の使用例では、アプリ内でインタースティシャル広告を管理するための状態とロジックをカプセル化しています。これにより、アプリの他の部分から広告の状態に簡単にアクセスでき、必要に応じて広告を表示することができます。Riverpodを使うことで、状態管理のコードがより読みやすく、保守しやすくなります。

### notifierの設定

```Dart
class InterstitialAdNotifier extends StateNotifier<InterstitialAd?> {
  InterstitialAdNotifier() : super(null) { // initializer
    _loadInterstitialAd();
  }
```

ref.invalidateSelf();をすることで、POSTのあとの再fetchが実現できる。

## providerに引数を渡す時

[https://riverpod.dev/docs/essentials/passing_args](https://riverpod.dev/docs/essentials/passing_args)

引数の値を `==`で比較しているので、listなどを渡すケースには求める挙動が得られないことがあります。

A common mistake is to directly instantiate a new object as the parameter of a provider, when that object does not override `==`.

For example, you may be tempted to pass a `List` like so:

```Dart
    // We could update activityProvider to accept a list of strings instead.
    // Then be tempted to create that list directly in the watch call.
    ref.watch(activityProvider(['recreational', 'cooking']));
```

The problem with this code is that `['recreational', 'cooking'] == ['recreational', 'cooking']` is `false`. As such, Riverpod will consider that the two parameters are different, and attempt to make a new network request.

This would result in an infinite loop of network requests, permanently showing a progress indicator to the user.

To fix this, you could either use a `const` list (`const ['recreational', 'cooking']`) or use a custom list implementation that overrides `==`.

To help spot this mistake, it is recommended to use the [riverpod_lint](https://pub.dev/packages/riverpod_lint) and enable the [provider_parameters](https://github.com/rrousselGit/riverpod/tree/master/packages/riverpod_lint#provider_parameters) lint rule. Then, the previous snippet would show a warning. See [Getting started](https://riverpod.dev/docs/introduction/getting_started#enabling-riverpod_lintcustom_lint) for installation steps.

💡

CAUTION  
When providers receive parameters, it is recommended to enable automatic disposal. That is because otherwise, one state per parameter combination will be created, which can lead to memory leaks.

---

# Widgetsに状態を注入する

Consumer, ConsumerWidgetとConsumerStatefullWidgetがある。

consumerWidgetたちは、consumerの機能を持った(providerを利用することができる。stateless/statefulなwidgetのこと。)

## Consumer

(雑和訳)これは、プロバイダーの変更を聞いて、その変更に対応する必要がある場合に、Consumerの子となる要素だけを再描画させる。widgetです。再描画を限定的にしたい時にはこちらがよいらしいです。

> `**Consumer**` is a widget that allows you to listen to changes in a provider and rebuild only the widget subtree that needs to react to these changes. It's used within the build method of a widget to efficiently update parts of the widget tree in response to state changes. `**Consumer**` is particularly useful when you're working within the build method of a `**StatelessWidget**` or `**StatefulWidget**` and you want to rebuild a specific part of your widget tree without requiring the entire widget to be rebuilt.

## ConsumerWidgets

(雑和訳)これは、プロバイダーをリッスンするベースのクラスですよ。buildの下全部再描画するので、不要に利用しちゃわないように気をつけようね。

> `**ConsumerWidget**` is a base class for creating a widget that listens to a provider. When extending `**ConsumerWidget**`, the `**build**` method provides you with a `**WidgetRef**` object, which you use to read providers. This approach is useful when the entire widget needs to rebuild in response to changes in the provider's state. It simplifies the widget tree by removing the need for a separate `**Consumer**` within the build method.

### 使い分け

- changes.

- **Use** `**ConsumerWidget**` **when**:
    
    - You're creating a new widget that primarily functions to display data from a provider.
    
    - The entire widget (or a significant portion of it) needs to rebuild in response to changes in the provider's state.
    
    - You prefer a cleaner architecture by extending `**ConsumerWidget**` rather than nesting `**Consumer**` widgets within your build method.
    

# ref.watch /ref.read

## ref.watch

ref.watchメソッドを使用すると、指定されたプロバイダの現在の値を読み取り、さらにそのプロバイダの値が将来変更された場合にウィジェットが再構築されるようにします。  
つまり、watchは監視対象のプロバイダの値に依存するウィジェットを再構築するトリガーとして機能します。プロバイダの値が変更されると、その値をwatchしているウィジェットが自動的に再構築されます。  
watchは主にウィジェットのbuildメソッド内で使用され、UIがプロバイダの値に基づいて動的に変更する必要がある場合に適しています

## ref.read

[

StateNotifierの使い方｜Riverpodについて学ぶ

![](icon%203.png)https://zenn.dev/joo_hashi/books/2c6c47e3d79b63/viewer/8fa3f0

![](Flutter/Attachments%201/og-base-book_yz4z02.jpeg)](https://zenn.dev/joo_hashi/books/2c6c47e3d79b63/viewer/8fa3f0)