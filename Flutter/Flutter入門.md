---
tags:
  - flutter
  - dart
  - widget
  - state
created: 2023-10-06
status: active
---

## Question？
- 書き心地は、JSとJavaってぽい感じ
- contextって何を意味するんだ、ツリー状の構造の上位のものを探し行く感じなのだろうか?
- インデントがうまく効かない。vsCodeが正常に設定されてないらしい

- flutter devices 
起動できるデバイスを確認

- flutter pub add
パッケージをインストールする。pubspec.yamlに記載される。
- flutter run (-d:デバイス指定)
- flutter build [プラットフォームを指定]


(VsCodeのショートカット)
- `cmd + 4`でfit screenのシュミレーターを起動できるよ
- `cmd + 1`で縮小

- cmd + . でメソッド/ウィジットに切り出すことができます。



---
# Flutterアプリのディレクトリ構成
- pubspec.yaml
プロジェクトの説明や依存性について記述されているファイル

- analysis_options.yaml
Dart_analyzerの設定を記述するファイル

[ios]
- ios/Runner/AppDelegate.swift
ios特有の処理を記述するためのファイル
- ios/Runner/Info.plist
BlueToothや位置情報の取得などのユーザの許可が必要な操作に対してこちらを使う

[andoroid]
- android/app/build.gradle
Android のアプリケーションに関する設定ファイルです。コンパイルに使う SDK のバージョンやアプリケーションの設定などを記述します。

使用するパッケージによってはネイティブ側にも依存関係の設定が必要な場合があり、そのような際にはこのファイルに変更を加えることがあります。

- android/app/src/main/AndroidManifest.xml
位置情報の取得や BlueTooth の使用などユーザーに許可を求める機能を使う場合などにこのファイルに設定を記述します。



## constでwidgetを定義するとは??
constを使うとコンパイル時に定義され変更されないため、コンパイルされて以降変更するものがない場合には、こちらの方がperformanceの高くできるよっ
constで定義すると、Device Memory領域に保存され、再度同様のものが呼ばれるときに同様のメモリを使用してくれるらしいよ。
```e.g.)
class GradientContainer extends StatelessWidget {
  const GradientContainer({super.key});
}
```
widgetを定義する際にconstを使うことで、再利用できやすいよ。(memory optimizationできているってこ話)



---
#Flutterの概要

!! 全ては、runApp()呼び出しから始まる



ー  main.dart
```
import 'package:english_words/english_words.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return ChangeNotifierProvider(
      create: (context) => MyAppState(),
      child: MaterialApp(
        title: 'Namer App',
        theme: ThemeData(
          useMaterial3: true,
          colorScheme: ColorScheme.fromSeed(seedColor: Colors.deepOrange),
        ),
        home: MyHomePage(),
      ),
    );
  }
}

class MyAppState extends ChangeNotifier {
  var current = WordPair.random();
}

class MyHomePage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    var appState = context.watch<MyAppState>();

    return Scaffold(
      body: Column(
        children: [
          Text('A random awesome idea:'),
          Text(appState.current.asLowerCase),

          ElevatedButton(
            onPressed: () {
              print('button pressed!');
            },
            child: Text('Next'),
          ),
        ],
      ),
    );
  }
}
```


# [Widgetメモ]
基本的なwidgetの作成方法
```
Future<void> main() async {
  await dotenv.load(fileName: '.env');
  runApp(const MainApp());
}

class MainApp extends StatelessWidget {
  const MainApp({super.key}); //コンストラクタ (widgetを一意に識別するために必要な記述)

  @override
  Widget build(BuildContext context) { //widgetをretValにもつ、実際のCustom widgetの中身
    return MaterialApp(
      title: 'Qiita',
      theme: ThemeData(
        primarySwatch: Colors.green,
        fontFamily: 'Hiragino Sans',
        appBarTheme: const AppBarTheme(
          backgroundColor: Color(0xFF55C500),
        ),
        textTheme: Theme.of(context).textTheme.apply(
              bodyColor: Colors.white,
            ),
      ),
      home: SearchScreen(),
    );
  }
}
- Key
１つ１つの Widget を一意に特定する為の識別子です。

アプリは非常に多くの Widget で構成されます。時には同じ Widget が複数並ぶような場合もあります。このような場合、Flutter はどの Widget を操作であったり、更新すべきかであったりを判断する必要があり、その際に用いられるのが Keyクラス です。
nullable な引数なので、
**必ず渡す必要はありませんが StatelessWidget、StatefulWidget を定義する際は必ず引数として記述します。**```




- MaterialApp(
	home: //最初に表示する Widget を指定します。
@override
Widget build(BuildContext context) {
	return MaterialApp(
		title: 'Flutter Demo',
		theme: ThemeData(
		primarySwatch: Colors.blue,
		),
		home: const MyHomePage(title: 'Flutter Demo Home Page'), 
	);
	}
)
- ThemeData	
非常に多くの引数を取り、アプリ全体の色やフォント、ボタンの形などを定義することができます。

- 




- ChangeNotifier
 状態（データ）の変更を "イベント" として捉え、それに応じてUIを更新するという流れです。要するに、データの変更を監視してUIをリアクティブに更新する点で、JS の Event Listener と似ている面があります。
notifyListeners();メソッドを使うことで、リスナーに対してnotifyを飛ばすことはできるそうです。
このクラスを継承したクラスが、実際にnotifierとして機能することになります。

- それらの親となるクラスが
```
    return ChangeNotifierProvider(
      create: (context) => MyAppState(),
      child: MaterialApp(
        title: 'Namer App',
        theme: ThemeData(
          useMaterial3: true,
          colorScheme: ColorScheme.fromSeed(seedColor: Colors.deepOrange),
        ),
        home: MyHomePage(),
      ),
    );
  }
```
以上のようにChangeNotifierProviderでラップされることによって、イベントのプロバイダーとして機能します。
https://showme.redstarplugin.com/d/d:F6nnPHuT.svg
ChangeNotifierProviderはMyAppStateを提供します。これは、アプリケーションの状態を管理するクラスです。
MyAppStateはChangeNotifierを継承しており、状態の変更をリスナーに通知する能力を持っています。
MyHomePageはMyAppStateのリスナーとして機能し、状態の変更を受け取るとUIを再構築します。
ボタンが押されると、MyAppStateのgetNextメソッドが呼び出され、新しいWordPairが生成され、リスナーに状態の変更が通知されます。


= 


- Formのパーツ！
TextField(onChanged)
Drop


-  
入力値のstoreをやってくれる
必要無くなれば、消してあげる必要があル。(dispose)
https://zenn.dev/t_fukuyama/articles/76cb07d38d078a
```
//初期化して
  final _titleController = TextEditingController();

          TextField(
	controller: _titleController,
	//指定して
	
	//参照する
	_titleController.text
	
-- void dispose() {
dispose, like initState and build is part of a StatefulWidgets lifeCycle
```	
	@override
  void dispose() {
    _titleController.dispose();
    super.dispose();
	}
	```
))





- Container()


- テキストの下線を消す。
              style: TextStyle(
                  decoration: TextDecoration.none,

- BoxDecoration
ボックスのデコレーションgradientプロパティはグラデーションを決めるもの。
e.g.)
//リストの形で、色を指定するとその中間色を埋めるように、グレデーションがつく
```
decoration: const BoxDecoration(
	gradient: LinearGradient(
		colors: [
		Color.fromARGB(10, 219, 24, 24),
		Color.fromARGB(111, 228, 87, 87),
		],
		begin: Alignment.topLeft, //グラデーションの開始位置
		end: Alignment.bottomRight,
	),
	);
```



- AppBar
画面上部のアプリバーを表示するためのwidget (UIコンポーネント)
e.g.)
```dart
  appBar: AppBar(
    title: Text(widget.title),
  ),
```
- paddingのようにwidget間の隙間を作るためのもの
# 見た目を作る
- Padding(
	padding: const EdgeInsets.symmetric( //水平方向と、垂直方向に同じだけpaddingをつける。
	vertical: 12,
	horizontal: 36, 
	),
	child: TextField()
);

- Card(
	color: (e.g.) theme.colorScheme.primary,
	child [
	],
	)
//カードっぽい見た目を作る
      clipBehavior: Clip.hardEdge,
子widgetがborderRadiusを無視するような時に、その設定を無効にする。


- NetworkImagewidget url を元に画像をダウンロードして表示する.
# 中央揃えにするアプローチ
- Center
レイアウトのみを扱うwid 
```
  body: Center(
    child: Widget(),
),
```
- SizedBoxを使う
```
   return SizedBox(
      width: double.infinity,
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
		```
		
		
		
))
- FadeInImage
画像を読み込んだ際に、pop outさせるのではなく、fadeinで表示させる。


- MemoryImage メモリ上の画像を読み込む際に使用する
- NetworkImage ネット上から画像を取得するために使用する。
- (Widgetとして返したい時は)Image.network(meal.imageUrl),
# Column
子要素と縦並びに配置するための、レイアウトのみを扱うwidget
例えば、Centerはchildしかとれないけど複数のwidgetを羅列したい時に使うことができる。sd
```dart
    Column(
	mainAxisAlignment: MainAxisAlignment.center,
	mainAxisSize: MainAxisSize.min, //縦幅を全て取っているので、これで調整することで中央揃えにできる。
      children: <Widget>[
        Widget(),
        Widget(),
      ],
),
```
- Row
子要素と横並びに配置するための、レイアウトのみを扱うwidget

		
		
))

- Spacer()
ColumnやRowのなかで、子widgetが配置される残りのスペースをいっぱいとる。

- CircleAvatar

- Colors.fromRGBO(0, 255, 0, 1.0)
とかも選べるよ。

- Text(
	'text_content',
	//文字列を表示する Widget です。フォントや文字色、文字サイズなどのスタイルを指定するフィールドも用意されています。第一引数に渡された文字列を表示します。
	style: //TextStyle()とかでfont_sizeとか指定できるよ
	maxLines: //最大行数の指定,
	overflow: //overflow(表示範囲が超えたときにどうするか)
	(プロパティ例)
clip: 行数を超えた文字は表示されない
fade: 行数を超えた文字は表示されるが、フェードアウトする
ellipsis: 行数を超えた文字は...で省略される
visible: 行数を超えても文字は表示され、場合によってはレイアウトエラーを引き起こします。maxLines を指定した場合は、それを超えた文字は表示されません。
);

# Buttonの種類
- TextButton
- OutlineButton
- ElevatedButton
- FloatingActionButton Widget
- IconButton
画面下部の画面の上に浮いたようなボタンを表示する Widget です。
Flutter にはこのFloatingActionButtonという Widget だけでなく、いくつかのボタン Widget が用意されています。これらのボタン Widget は、ユーザーのタップを検知することが出来、タップされた際に実行する処理をonPressedフィールドに渡すことができます。
- XxxButon.icon()コンストラクタをしようすると、iconツキのぼたんを作成することができます。
`child: Text `から`icon: xxx, label: "some strings"`になります。

- TextField(
	style:, //TextStyleとかをわたす
	decoration: , //InputDecorationなどでプレイスホルダーを用意する
	onSubmitted: //Enterを押した時の挙動になる。(スマホは?) (String value) {}の形で入力値を引数にとるコールバックを実装できる。
)

e.g.) 
```
         TextField(
            controller: _amountController,
            keyboardType: TextInputType.number,
            decoration: const InputDecoration(
              prefixText: '\$',
              label: Text('Amount'),
            ),
	```
	
彼も、Expandedで親widgetのサイズまでせいげんしてあげる必要があります。
- ()theme.textTheme, you access the app\'s font theme. This class includes members such as bodyMedium (for standard text of medium size), caption (for captions of images), or headlineLarge (for large headlines).

```
    var style = theme.textTheme.displayMedium!.copyWith(
      color: theme.colorScheme.onPrimary
    );
```
displayMedium.copyWithメソッドで繋ぐことで、displayMediumのスタイルをコピーして、その後colorのプロパティだけを書き換えています。


- Icon
アイコンを表示するためのwidget
```
    Icon(
      Icons.add, //e.g. Icons.favoriteでハートボタンとか
      color: Colors.white,
    ),
```


- safeArea()
mobileとかでノッチやステイタスバーに被らないように設定できるWidgetらしい。(paddingをトップにいい感じにつけてくれるらしい)

- Expanded()
		RowやColumnの中で使う子widgetに使用することで、子widgetを親のサイズまで広げる。
	Column (child: Row))のような場合にRowが無限に広がってしまうので、Column(親)のサイズまでに制限するような使い方もできる。


- PlaceHolder()
文字通りただのからのコンテナ
- sizedBox
隙間を開けるためのやつ。paddingとかの代用として使えるよね
- 高さなどが明確に決められるよ(これの子要素があるとしたら、それは切り落とされるらしいよ。)

- https://api.flutter.dev/flutter/widgets/FractionallySizedBox-class.html
親widgetsのサイズに応じてレイアウトを行う
```
child: FractionallySizedBox(
          heightFactor: fill, // 0 <> 1
          child: DecoratedBox(
            decoration: BoxDecoration(
              shape: BoxShape.rectangle,
              borderRadius:
                  const BorderRadius.vertical(top: Radius.circular(8)),
              color: isDarkMode
                  ? Theme.of(context).colorScheme.secondary
                  : Theme.of(context).colorScheme.primary.withOpacity(0.65),
            ),
          ),
        ),
- widgetを透過させたい時には、 Opacityでwrapするのもの一つの方法。 

----
## Widget設計のベストプラクティス。
ー widgetを切り出すのはすごく重要で、その際にclass MyAppState extends ChangeNotifier などの依存性を丸々取得するのではなく、そのクラスの特定の値だけを変数に代入して、依存させると依存性がすくなくなりとても良い。



-  NavigationRail(
	extended: false, //trueにするとDeskTopっぽくなる
	destinations: [
		NavigationRailDestination(
		icon: Icon(Icons.home),
		label: Text('Home'),
		),
		NavigationRailDestination(
		icon: Icon(Icons.favorite),
		label: Text('Favorites'),
		),
	],
	selectedIndex: 0, //選択されるときのIndexの初期値を設定できるらしい
	onDestinationSelected: (value) {
		print('selected: $value');
	},


- PlaceHolder()



## Statefull and Stateless
状態は持ちたいけど、他のwidgetに提供する必要がないもの！とかの場合にはStateful Widgetを使ってそのWidget内で完結する状態管理することができる？
setState()を使うことで、Statefulウィジットに重要なことがあると伝え、リビルドを促す

StatefulWidgetでは Stateクラスの setState() メソッドを使うことで、Stateクラスに定義された変数を更新することができます。setStateのなかで、widgetないで、再描画したい変数を更新すると、widgetが再レンダリングされる。


## StatefulWidgetの書き方
import 'package:flutter/material.dart';

class DiceRoller extends StatefulWidget { 
  const DiceRoller({super.key}); //StatefulWidget自体はimmutableなのでconst使えます。

  @override
  State<DiceRoller> createState() {
    return _DiceRollerState(); //instantiationしているよ。
  }
}

class _DiceRollerState extends State<DiceRoller> {
  var activeDiceImg = 'lib/assets/images/dice-2.png';

  void rollDice() {
    activeDiceImg = 'lib/assets/images/dice-4.png'; //(WIPだよ)
  }

  @override
  Widget build(context) {
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        Image.asset(activeDiceImg, width: 200),
        const SizedBox(height: 20),
        TextButton(
          onPressed: rollDice,
          style: TextButton.styleFrom(
              foregroundColor: Colors.amber,
              textStyle: const TextStyle(fontSize: 28)),
          child: const Text('tap me'),
        ),
      ],
    );
  }
}
- initState()メソッドを使う
Stateクラスの中(State<Quiz >)コンストラクタが呼び出された後に、一度だけ初期化動作として呼び出されるメソッド。 widget.オブジェクトはstatefulwidgetオブジェクトへの参照を持つが、stateオブジェクトがコンストラクタで初期化される際には、必ずしも、widgetが初期化終わってない可能性があるので。
```
  Widget? activeScreen;

  @override
  void initState() {
    activeScreen = StartScreen(switchScreen);
    super.initState(); //Stateクラスによって実行されるものも消さないで。
  }

  void switchScreen() {
    setState(() {
      activeScreen = const QuestionScreen();
    });
}
```

	## setStateについて
再描画のトリガーになる変数を別途設定してあげて、そいつを書き換えるときに囲んであげる関数。


## どのようにして状態管理を行うかwidgetをre-renderするかみたいなことですね。





# Widgetのサイズの決まり方
"親から子に渡されるConstraints(制約) 」と「 Widget自身の習性 」"
(size constraints)
1. Flutter では描画処理が行われる際に、親 Widget から子 Widget に対して、サイズ制約を課す BoxConstraints クラスが渡されます。
このBoxConstraintsクラスには子 Widget が取ることが出来る x 軸 y 軸方向の最大最小値が設定されています。子 Widget はこの与えられたサイズ領域の中で自身が取るサイズを計算します。
このサイズ制約では具体的なサイズが指定される場合もあれば、無制限(double.infinity)という制約が指定される場合もあります。
	
	
2. 子となるwidgetには、与えられたサイズ制約の中でどのように振る舞うかという設定が含まれています。
この習性には大きく分けて以下の３つがあります。	
a. なるべく大きくなろうとする
b. なるべく小さくなろうとする
c. 制約に関係なく特定のサイズになろうとする
また 上記以外にも与えられた引数に応じて取る振る舞いを変える Widget や x 軸 y 軸方向で振る舞いが違う Widget など、Widget によって非常に様々です。

""warning""
---
- Widgetによって子のwidgetに対して、無制限のサイズ制約を渡す Widget があります。
このwidgetの子widgetがなるべく大きくなろう」とする Widget を配置してしまうと無制限に大きくなろうとすることで画面サイズを超えてしまう為、エラーとなります。
e.g.) Row、ColumnやListViewといったある方向に子 Widget を複数レイアウトしていくような Widget では、その主軸方向に対しサイズ制約が無制限となる制約を子 Widget に渡します。

このような時には、ExpandedやFlexibleなどのRow/Columnの配下で使うことを前提としているWidgetを選択する必要があるらしい。
---

- e.g. Columnは height: as much as possible/ width as much as needed by children 






## wrapしたwidgetsをtappableにする
- Inkwell -> onTapなどのアクションが発火時にfeedbackがあるらしいよ。
- GestureDetector





# API通信について学ぶ
1. HTTP通信をするためのパッケージをインストール
- http
- dio
```
$ flutter pub add http
```
```
//ファイル内で
import 'package:http/http.dart' as http;
```



http.put(
	//Uri.parse('宛先URL'),
	headers: ,
	body,
	);
```
Future<Album> updateAlbum(String title) async {
  final response = await http.put(
    Uri.parse('https://jsonplaceholder.typicode.com/albums/1'),
    headers: <String, String>{
      'Content-Type': 'application/json; charset=UTF-8',
      HttpHeaders.authorizationHeader: 'Bearer $token',
    },
    body: jsonEncode(<String, String>{
      'title': title,
    }),
  );

  if (response.statusCode == 200) {
    // If the server did return a 200 OK response,
    // then parse the JSON.
    return Album.fromJson(jsonDecode(response.body));
  } else {
    // If the server did not return a 200 OK response,
    // then throw an exception.
    throw Exception('Failed to update album.');
  }
}
```

## jsonで受け取るとstringにしかなり得ないので、カスタムクラスを定義するとよい話。
```
response.bodyでは返ってきたデータを文字列としてしか取得することが出来ません。

実際に開発する際には以下のような手順などで自前のカスタムクラスに変換して使うことがほとんどです。

jsonDecodeメソッドを使って json に変換
jsonDecode(response.body)

fromJsonメソッドを含むカスタムクラスを作成
カスタムクラス
class Album {
  final int userId;
  final int id;
  final String title;

  const Album({
    required this.userId,
    required this.id,
    required this.title,
  });

  factory Album.fromJson(Map<String, dynamic> json) {
    return Album(
      userId: json['userId'],
      id: json['id'],
      title: json['title'],
    );
  }
}

response.body をカスタムクラスに変換する
return Album.fromJson(jsonDecode(response.body));
```


## 環境変数の設定
flutter dotenvの場合
パッケージのインストール呼び出し方

```
final String token = dotenv.env['QIITA_ACCESS_TOKEN']); // .env に記述したアクセストークンを取得
```

## API通信
- クエリパラメータを含めるような場合にはUri.parseではなく
Uri.httpsを使用しますよ。
第一引数に baseUrl、第二引数にURL
パス、Map<String,dynamic>型でクエリパラメータを指定します。

# 関数を定義する場所について(外部APIにアクセスするなど)
Widget内で使う関数を定義する際にその記述場所にはいくつか候補があります。

グローバル
Stateless, Stateful widget内
buildメソッド内
(状態管理しているなら)状態管理クラス内
実際どのスコープに関数を配置しても、記述が正しければ処理は正常に動作しますが、メモリ管理の観点で、以下の様な違いがある事を認知しておいてください。

グローバル：メモリの解放が行われない
Stateless, Stateful widget内：widgetが破棄されると一緒に破棄(解放)される
buildメソッド内：再描画が走る度に新しくメモリが確保される
状態管理クラス内：状態管理クラスとライフサイクルを共にする
用途に応じて使い分ける事が重要ですが、よほどの理由がない限りは2か4のスコープに記述する事が望ましいかと思います。

本サンプルでは２の「Stateless, Stateful widget内」に記述する方針を取ります。


## webview_flutter	
webviewを使って記事を表示する。


# 画像の追加
@pubspec.yamlにて
-assets:
    - lib/assets/images/dice-1.png
    - lib/assets/images/dice-2.png
    - lib/assets/images/dice-3.png
    - lib/assets/images/dice-4.png
    - lib/assets/images/dice-5.png
    - lib/assets/images/dice-6.png


## ローカルストレージに保存されている画像を参照するとき
Image.asset //Imageウィジットのassetコンストラクタを使用する。


1 .main()が自動で実行される、Dartによって、コンパイルされたターゲットdeviceのマシンコードで
2. runApp()がmain()のなかで呼び出される。
	a. runApp()がFlutterにスクリーンに表示する内容を伝える。
3. runApp()に対sて、widget treeが渡される。





- 画像を透過されたい時に使う。
Colorでα値をいじるといい, Opacity widgetを使うよりも、描画コストが低い。
Image.asset(
            'assets/images/quiz-logo.png',
            width: 300,
            color: const Color.fromARGB(150, 255, 255, 255) 
          ),
          // Opacity(
          //   opacity: 0.5,
          //   child: Image.asset(
          //     'assets/images/quiz-logo.png',
          //     width: 300,
          //   ),
// ),



## Statefullwidgetにおける、widgetクラスから、stateクラスへのpassing data(functionとかvariables)

widget. //このオブジェクトを使う。


## 
	const SizedBox(height: 20),
            ...currentQuestion.shuffleAnswers().map((answer) {
              return AnswerButton(
                text: answer,
                onTap: () {
                  answserQuestion(answer);
                },
		);
		
		
		
))


# FlutterのFeature

appのパフォーマンス改善には、Profileモードで起動して、devToolsを見る。


contextとは??

meta data collection
- Widgetごとに、異なるmeta情報が入っている
- widgetの位置についてのmeta情報も入っている。(widget tree)


- DatePickerについて

  void _presentDatePicker() {
    final now = DateTime.now();
    final firstDate = DateTime(now.year - 1, now.month, now.day);
    showDatePicker(
        context: context,
        initialDate: now,
        firstDate: firstDate,
        lastDate: now);
}

validationエラーを表示させる。


- swipeで項目をいじるやつを実装する。
1. Dismissibleを使って、ValueKey()を使ってkeyを指定する。
2. データの処理も別で実装する必要がある。

  Widget build(BuildContext context) {
    return ListView.builder(
      itemCount: expenses.length,
      itemBuilder: (ctx, index) => Dismissible(
        key: ValueKey(),
        child: ExpenseItem(expenses[index]),
      ),
    );
  }
}


- SnackBar
スクリーン出す、infoメッセージみたいなやつですわ。
```
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          duration: const Duration(seconds: 2),
          content: const Text('Expense deleted.'),
          action: SnackBarAction(
            label: 'Undo',
            onPressed: () => setState(
              () => _registredExpenses.insert(currentIndex, expense),
            ),
          ),
),
```

FlutterにおけるScaffoldMessengerのremoveCurrentSnackBarとclearSnackBarsメソッドの違いは、それぞれがどのようにSnackBarを扱うかにあります。これらのメソッドはSnackBarを表示しているウィジェットのコンテキストから呼び出され、SnackBarを制御するのに使用されます。

removeCurrentSnackBar:

このメソッドは、現在表示されているSnackBar（もしあれば）を削除します。
ただし、このメソッドはキューにある他のSnackBarには影響しません。つまり、現在表示中のSnackBarを削除した後、キューに次のSnackBarがある場合、その次のSnackBarが表示されます。
これは、特定のSnackBarを即座に取り除きたいが、キューにある他のSnackBarはそのまま表示させたい場合に有用です。
clearSnackBars:

このメソッドは、現在表示されているSnackBarと、キューにあるすべてのSnackBarを削除します。
つまり、これを呼び出すと、現在表示されているSnackBarはもちろんのこと、表示される予定だったすべてのSnackBarがキャンセルされます。
これは、すべてのSnackBar通知を完全にクリアしたい場合、例えばユーザーが画面を離れる時などに適しています。
	簡単に言うと、removeCurrentSnackBarは現在表示中のSnackBarのみを削除し、clearSnackBarsは現在のものを含むすべてのSnackBarを削除します。
	
	
))




# スタイリング(theming)
MaterialApp(
theme: ThemeData(useMaterial3: true), //themeで統一のスタイルを決めることができるよ

themeプロパティに設定したものは Theme.of(context)からアクセスできる。
参照だけでなく、書き換えもできるよ。
```
import 'package:flutter/material.dart';
import 'package:expense_tracking_app/widgets/expenses.dart';

void main() {
  runApp(const MainApp());
}

var kColorScheme = ColorScheme.fromSeed(
  seedColor: const Color.fromARGB(252, 121, 224, 200),
);

class MainApp extends StatelessWidget {
  const MainApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      theme: ThemeData().copyWith(
        useMaterial3: true,
        colorScheme: kColorScheme,
        appBarTheme: const AppBarTheme().copyWith(
          foregroundColor: kColorScheme.onTertiary,
          backgroundColor: kColorScheme.onPrimaryContainer,
        ),
        cardTheme: const CardTheme().copyWith(
          color: kColorScheme.secondaryContainer,
          margin: const EdgeInsets.symmetric(
            horizontal: 16,
            vertical: 6,
          ),
        ),
        elevatedButtonTheme: ElevatedButtonThemeData(
          style: ElevatedButton.styleFrom(
            backgroundColor: kColorScheme.primaryContainer,
          ),
        ),
        textTheme: ThemeData().textTheme.copyWith(
              titleLarge: TextStyle(
                fontWeight: FontWeight.normal,
                color: kColorScheme.onSecondary,
                fontSize: 20,
              ),
            ),
      ),
      home: const Expenses(),
    );
  }
}
	
	```
	
))


- Dark Modeの実装。
```

ar kDarkColorSchme = ColorScheme.fromSeed(
  brightness: Brightness.dark, //カラースキーマがデフォルトだと、明度がおかしいままになってしまうので、Brightness.darkで設定すること。
  seedColor: const Color.fromARGB(250, 1, 27, 21),
);

Widget build(BuildContext context) {
    return MaterialApp(
      darkTheme: ThemeData.dark().copyWith(
        useMaterial3: true,
        colorScheme: kDarkColorSchme,
      ),
      theme: ThemeData().copyWith(
        useMaterial3: true,
        colorScheme: kColorScheme,
        appBarTheme: const AppBarTheme().copyWith(
          foregroundColor: kColorScheme.onTertiary,
          backgroundColor: kColorScheme.onPrimaryContainer,
		),
	),
	themeMode: ThemeMode.system,
	home: Widgets(),
);



childrenのループ
```
	              children: [
                for (final bucket in buckets) // alternative to map()
                  ChartBar(
                    fill: bucket.totalExpenses == 0
                        ? 0	
                        : bucket.totalExpenses / maxTotalExpense,
                  )
	],
	```
	
))

childrenの制御
```
children: [
                if (width >= 600)
                  Row(children: [])
                else
                  TextField(
                    controller: _titleController,
                    maxLength: 50,
                    decoration: const InputDecoration(label: Text('Title')),
),
```



- Mediaクエリについて
//環境の状態を取得できる。
MediaQuery.of(context).platformBrightness
  MediaQuery.of(context).size.width <- デバイスの横幅を検知できるよ。


# Responsiveにしていく。 
## スマホのローテーションに対応する。
1. ローテーションを無視する。
import 'package:flutter/services.dart';

void main() {
	WidgetsFlutterBinding.ensureInitialized();
	SystemChrome.setPreferredOrientations([
		DeviceOrientation.portraitUp,
	]).then((fn) {
			runApp(const MainApp());
	});
}


### keyboardが出るとUIが崩れる。
final MediaQueryData mediaQueryData = MediaQuery.of(context);


以下総じて、システムによって占領され、アプリではいじりづらい領域のことです。
- mediaQuerydata.viewInsets ->このプロパティはkeyboardぱっどに代表されるような、SystemUIによって隠されてしまう部分のことを指します。

- mediaQuerydata.padding -> notchとか、statusbarらしい。
- mediaQuerydata.viewPadding 


(keyboarde隠れる要素の対処法)
```
  return SizedBox(
      height: double.infinity,
      child: SingleChildScrollView(
        child: Padding(
          padding: EdgeInsets.fromLTRB(16, 48, 16, 16 + keyBoardSpace),
child: Column())))

```


2. ローテーションしたときに、カラムレイアウトを変える方法
buildメソッドが再度実行されるので。。。


3. useSafeAreaでノッチを避ける。
showModalBottomSheetとかはプロパティとして持っているので、trueにするだけでいいよ。
普通のwidgetsに対してやるとしたら、safeAreaを使う(このwidgetsの実装の中身はMediaQueryでsafeAreaを計算している。)



# LayOutBuilderを使おう。
MediaQueryで画面に関する情報を取得する他にこいつを使うことでも解決できそう。


LayoutBuilder(builder: (ctx, constraints) {
		print(constraints.minWidth);
		print(constraints.maxWidth);
		print(constraints.minHeight);
		print(constraints.maxHeight);
		
	}
	
	このように利用できるconstraitsをもとにして、レイアウトすれば良くね。って話。
	
	
}}}



# adaptive widgets depend on Platform

e.g. iOSのダイアログを出したいとかね。
showCupertinoDialog

### platformの識別。
Platform.isIOSを追加するだけ。


# page/screenごとにScaffoldを用意するよ。
このscaffold widgetはappbarを設定できるからね。

```
Scaffold(
appbar:<app bar>,
body: <main contents>
bottomNavigationBar: 
)



- Scaffold
Material appを作成するときに使う、'白紙ページ'みたいなwidget. bodyプロパティに渡す値がページの中身になる。
AppBar や FloatingActionButton、Drawer、BottomNavigationBar などの Widget を受け取ることができるフィールドが存在する。
AppBarを使うと、上に出てくるbarをレイアウトすることができる。

- appbarのactionsにお気に入りボタンとか追加できる。