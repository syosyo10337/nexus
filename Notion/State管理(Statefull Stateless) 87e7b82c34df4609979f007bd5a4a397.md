 

# State管理(Statefull/Stateless)

# StateFull

- A widget that can change its state over time.

- Maintains state that might change during the lifetime of the widget.

- Ideal for dynamic content that changes based on user interaction or data changes.

- Examples include sliders, checkboxes, and forms where user input or external events might change the widget's state.

# Stateless

- A widget that does not require mutable state.

- Once built, it does not change its state during its lifetime. It's immutable.

- Ideal for static content that doesn't change over time.

- Examples include icons, text, and buttons that don’t change after being displayed.

mutableなインスタンスバリューを持つことはできますが、推奨されることではない。

Let's break down your queries into three parts for clarity:

### Stateless Widget vs. Stateful Widget in Flutter

**Stateless Widget:**

**Stateful Widget:**

- A widget that can change its state over time.

- Maintains state that might change during the lifetime of the widget.

- Ideal for dynamic content that changes based on user interaction or data changes.

- Examples include sliders, checkboxes, and forms where user input or external events might change the widget's state.

### Riverpod for State Management

Riverpod is a popular state management library in Flutter that aims to provide a more testable and composable approach to managing state compared to other solutions like Provider. It allows you to decouple your application's state from the UI, making your code more modular and easier to maintain.

Riverpod introduces several concepts such as providers, which are objects that can expose a value (e.g., a state) and allow widgets to listen to changes in that value. With Riverpod, you can manage app-wide state (global state) more cleanly and efficiently.

### Implementing Interstitial Ads in Flutter with Google Mobile Ads SDK

Regarding implementing interstitial ads using the Google Mobile Ads SDK, the choice between using a `StatefulWidget` or a `StatelessWidget` (potentially with Riverpod) depends on how you manage the ad's lifecycle and state.

**StatefulWidget:** If the display of the interstitial ad is based on user interactions or other state changes within your widget, you might lean towards a `StatefulWidget`. This is because you'll likely need to manage the state of the ad (e.g., loading, loaded, failed to load) and trigger its display based on certain conditions.

**StatelessWidget with Riverpod:** If you're using Riverpod for state management, you can still effectively manage the state of your interstitial ad outside the UI logic. This allows your widget to remain stateless, with the state being handled by Riverpod providers. You can listen to changes in the ad's state and react accordingly in your UI, without directly mutating the state within the widget itself.

**Just Stateless Is Enough?**

- Technically, you can use a `StatelessWidget` if your ad's display logic does not depend on the widget's state or if you're managing the ad's state externally (e.g., with Riverpod).

- However, most implementations of interstitial ads involve some state management (e.g., loading the ad in advance, monitoring for when it's ready to display), which often makes a `StatefulWidget` a more straightforward choice unless you're integrating with a state management solution like Riverpod that abstracts the state management outside of the widget itself.

In summary, both approaches can work for implementing interstitial ads, but the choice depends on how you prefer to manage state within your Flutter application. If you're comfortable with Riverpod and it fits well with the rest of your application architecture, using a `StatelessWidget` with Riverpod for managing interstitial ad logic can be a clean and efficient solution. Otherwise, a `StatefulWidget` might be more intuitive for directly managing ad state within the widget.

# mountedについて

stateクラスのプロパティなので、当然ながらstatefull widgetの世界の話。

`mounted`プロパティは、ステートオブジェクトがウィジェットツリーにマウントされているかどうかを示すブール値です。ステートオブジェクトがウィジェットツリーに存在し、ウィジェットが構築されている間は`true`になります。一方、ステートオブジェクトが永続的に削除されたときは`false`になります。

以下のような場面で`mounted`プロパティを使用します：

1. ステートオブジェクトがウィジェットツリーに存在しない場合に、setStateやMarkNeedsBuildなどの呼び出しを避けるため。test

2. 非同期操作の完了後にウィジェットがまだ存在するかどうかを確認するため。

コード例では、`if (mounted) { ... }`の部分で、非同期操作である`myPageAuthAfterInitialization`メソッドの実行後に、ステートオブジェクトがまだウィジェットツリーに存在するかどうかをチェックしています。これにより、ステートオブジェクトが削除された後に、`go`メソッドが呼び出されることを防いでいます。

つまり、`mounted`プロパティを使うことで、ステートオブジェクトがウィジェットツリーに存在しない場合に、不要な処理や例外の発生を防ぐことができます。

[Flutter StatefulWidgetのライフサイクル - Qiita](State%E7%AE%A1%E7%90%86\(Statefull%20Stateless\)/Flutter%20StatefulWidget%E3%81%AE%E3%83%A9%E3%82%A4%E3%83%95%E3%82%B5%E3%82%A4%E3%82%AF%E3%83%AB%20-%20Qiita%2032cad29c3ef34b518284d8bfdf879fa5.html)