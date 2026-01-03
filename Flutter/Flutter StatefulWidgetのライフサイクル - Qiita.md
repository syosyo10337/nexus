 

# Flutter StatefulWidgetのライフサイクル - Qiita

[https://qiita.com/kurun_pan/items/116288b8ab2c409d2ee5](https://qiita.com/kurun_pan/items/116288b8ab2c409d2ee5)

# はじめに

Flutterで多用する`StatefulWidget`のライフサイクルについてまとめています。

Flutterのライフサイクルというと、

- アプリ (`AppLifecycleState`)

- 画面 (`StatefulWidget`) ← 今回の内容

の2種類がありますが、今回は下の`StatefulWidget`のライフサイクルについての内容です。

アプリのライフサイクルについては、[Flutterアプリのライフサイクル](https://qiita.com/kurun_pan/items/0c6de1313844a8cc1603)を参照してください。

# StatefulWidgetのライフサイクル

最初にライフサイクルの状態遷移図を以下に示します。

グレーの四角が`StatefulWidget`の状態遷移時に呼ばれるメソッド名を示しており、それ以外が`StatefulWidget`の状態名を示しています。

[![](6e09cd1f-6fbf-bba5-a9ae-aee9042baac3.png)](https://qiita-user-contents.imgix.net/https%3A%2F%2Fqiita-image-store.s3.ap-northeast-1.amazonaws.com%2F0%2F259963%2F6e09cd1f-6fbf-bba5-a9ae-aee9042baac3.png?ixlib=rb-4.0.0&auto=format&gif-q=60&q=75&s=f406f7a3bfced7b52c55f5a25180429e)

`StatefulWidget`の[ソースコード](https://github.com/flutter/flutter/blob/master/packages/flutter/lib/src/widgets/framework.dart)を見てみると、以下のように内部では4状態が定義されています。

```Plain
/// Tracks the lifecycle of [State] objects when asserts are enabled.
enum _StateLifecycle {
  /// The [State] object has been created. [State.initState] is called at this
  /// time.
  created,

  /// The [State.initState] method has been called but the [State] object is
  /// not yet ready to build. [State.didChangeDependencies] is called at this time.
  initialized,

  /// The [State] object is ready to build and [State.dispose] has not yet been
  /// called.
  ready,

  /// The [State.dispose] method has been called and the [State] object is
  /// no longer able to build.
  defunct,
}
```

## created状態

`StatefulWidget`.`createState`によりstateクラスの状態が`created`になります。ウィジェットが親ウィジェットに接続される (`mount`される) と、`initState()`がコールされ、状態が`initialized`に遷移します。

`initState()`はWidget初期化時に最初に一度だけ呼ばれるメソッドですが、この時点では`BuildContext`の情報は構築されておらず、利用することは出来ません。

`BuildContext`とは親ウィジェットの状態や情報などの描画制御のための情報を管理しているコンテキストのことです。グラフィックスやUIフレームワークではよく出てくる考え方に近いですが、これについては別途解説したいと思います。

```Plain
@override
void initState() {
  super.initState();
  // todo: ここに処理を書く
}
```

## initialized状態

`initState()`完了後、すぐにこの`initialized`状態に遷移します。ここで親ウィジェットのElement (BuildContext) が生成されたあとで、`didChangeDependencies()`をコールします。この時点で`BuildContext`が利用できるようになる (ただし、引数で) ため、それが必要な初期化処理をここで行います。

```Plain
@override
void didChangeDependencies() {
  super.didChangeDependencies();
  // todo: ここに処理を書く
}
```

## ready状態

`didChangeDependencies()`完了後、`ready`状態に遷移します。

初回構築時には`build()`がすぐにコールされ、初回の描画対象のウィジェットが構築されます。

`setState()`を行うことで、強制的にウィジェットの再構成 (`build`) が行われ、再描画が行われます。

また、親ウィジェットが再構築された時には、`didUpdateWidget()`がコールされます。このコールの後、再構築 (`build`) が行われますので、`setState()`は不要です。それ以外の更新処理が何かあれば、ここで対応します。

```Plain
@override
void didUpdateWidget(MyHomePage oldWidget) {
  super.didUpdateWidget(oldWidget);
  // todo: ここに処理を書く
}
```

## defunct状態

ウィジェットが完全に破棄された状態です。

この状態に来る前に`dispose()`がコールされますので、このタイミングでウィジェット破棄に伴う終了処理を行うと良いです。

```Plain
@override
void dispose() {
  // todo: ここに処理を書く
  super.dispose();
}
```