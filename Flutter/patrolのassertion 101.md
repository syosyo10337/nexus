 

# patrolのassertion 101

上が純正のFlutter、下がpatrol

```Dart
expect($("Can't touch this"), findsNothing);
expect($(Card), findsNWidgets(3));
```

![](snippet_brown.svg)

findOneWidgets等は、現在のwidget treeに存在するかとを判定していて、ユーザの目に見えているかは判定しない。

実際に見えているかを判定したい場合には

```Dart
expect($('Log in').visible, equals(true));
```

And to wait for at least 1 widget with the "Log in" text to become visible:

```Dart
await $('Log in').waitUntilVisible();
```

# Scrollをする。

And if the "Subscribe" text was in a **[Scrollable](https://api.flutter.dev/flutter/widgets/Scrollable-class.html)** widget, such as **[SingleChildScrollView](https://api.flutter.dev/flutter/widgets/SingleChildScrollView-class.html)** or **[ListView](https://api.flutter.dev/flutter/widgets/ListView-class.html)**, and you want to make sure that it is visible (so you can `tap()` on it), you can scroll to it very easily:

```Dart
await $('Subscribe').scrollTo().tap();
```

# より詳細なwidget探索 using which()

entering a text into a text field with no text entered:  

```Dart

await $(#cityTextField)
    .which<TextField>((widget) => widget.controller.text.isNotEmpty)
    .enterText('Warsaw, Poland');

await $(Icons.error)
    .which<Icon>((widget) => widget.color == Colors.red)
    .waitUntilVisible();
asserting that the button is disabled and has the correct color

await $('Delete account')
  .which<ElevatedButton>((button) => !button.enabled)
  .which<ElevatedButton>(
    (btn) => btn.style?.backgroundColor?.resolve({}) == Colors.red,
  )
  .waitUntilVisible();
```