 

# Appbarによるpopをフックする

Flutterでは、AppBarの戻るボタンの動作をカスタマイズするためには、`WillPopScope`ウィジェットを使用します。このウィジェットは、ユーザーが画面から離れる前に追加の操作を実行することができます。

以下に、戻るボタンを押したときに広告を表示するサンプルコードを示します。

```Dart
import 'package:flutter/material.dart';

class YourScreen extends StatelessWidget {

**@override**

Widget build(BuildContext context) {

return WillPopScope(

onWillPop: () async {

*// ここに広告表示のコードを書く*

*// 例: AdManager.showAd();*

*// trueを返すと、通常の戻る操作が実行されます。*

*// falseを返すと、戻る操作がキャンセルされます。*

return true;

},

child: Scaffold(

appBar: AppBar(

title: Text('Your Screen'),

),

body: Center(

child: Text('Your Screen'),

),

),

);

}

}
```

このコードでは、`WillPopScope`の`onWillPop`プロパティに関数を設定しています。この関数は、戻るボタンが押されたときに呼び出されます。関数内で広告表示のコードを実行し、その後に`true`を返すことで通常の戻る操作を実行します。

なお、広告表示の具体的なコードは広告プラットフォームによりますので、適宜置き換えてください。

import 'package:flutter/material.dart';

class YourScreen extends StatelessWidget {  
@override  
Widget build(BuildContext context) {  
return WillPopScope(  
onWillPop: () async {  
// ここに広告表示のコードを書く  
// 例: AdManager.showAd();

```Plain
    // trueを返すと、通常の戻る操作が実行されます。
    // falseを返すと、戻る操作がキャンセルされます。
    return true;
  },
  child: Scaffold(
    appBar: AppBar(
      title: Text('Your Screen'),
    ),
    body: Center(
      child: Text('Your Screen'),
    ),
  ),
);
```

}  
}