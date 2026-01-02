 

# pathベースのrouteでのページ遷移を実装する(go_router)

[基礎編](#74521755-3e3c-436d-9fac-8eeb78b846e3)

[Flutter既存のNavigationとの違い](#782ae6d9-e13c-41fb-8d09-f6a356fc2b2f)

[利点](#f857d2bc-1881-4345-a8cb-454e039200f1)

[課題点](#12a79877-4984-4cd0-9a87-b19656fc1472)

[go_route_builderを使ったNavigation2.0実装](#595bd921-5f00-474b-be00-2cb54806937a)

[go_router_builder ver.](#0785bba7-03d6-452e-bc4e-b31d0a9ecef1)

[go_router ver.](#5d7bff59-df0c-4c99-bde2-a1f0a9a47c51)

[今更聞けないcontext.go とcontext.pushの違い](#33808e9e-61c3-4aa4-8835-cecec3f430bd)

[開発メモ](#90bacda4-9979-4859-a6e1-f31e017333e6)

[

【Flutter】go_routerでBottomNavigationBarの永続化に挑戦する

コード量も短く、比較的簡単に実装出来るのでとても良いと感じているのですが、使ってみた方に感想を聞いてみるとBottomNavigationBarやTabBarなどの永続化が出来ず、そこが難点という話を複数名の方から伺いました

![](icon%202.png)https://zenn.dev/heyhey1028/articles/d64564e6fd1df4

![](og-base-w1200-v2%202.png)](https://zenn.dev/heyhey1028/articles/d64564e6fd1df4)

[

[続] go_routerでBottomNavigationBarの永続化に挑戦する(StatefulShellRoute)

以前書いたgo_routerの記事から月日が流れ、go_routerでも「ボトムナビゲーションバーの永続化」、そして「各タブ内の状態保持」に対応する　StatefulShellRoute が導入されたので、そちらについて整理していきたいと思います。

![](icon%202.png)https://zenn.dev/flutteruniv_dev/articles/stateful_shell_route

![](og-base-w1200-v2%203.png)](https://zenn.dev/flutteruniv_dev/articles/stateful_shell_route)

[

【Flutter】Go Router から Go Router Builder へ

以下の記事では Navigator と Go Router を比較して簡単な画面遷移がどのように書けるかを学んできました。本記事では Go Router をタイプセーフで書くことができる Go Router Builder に関して学んでいきたいと思います。

![](icon%202.png)https://zenn.dev/koichi_51/articles/2cba28b0635d3c

![](og-base-w1200-v2%204.png)](https://zenn.dev/koichi_51/articles/2cba28b0635d3c)

# 基礎編

[

【Flutter】 go_routerの使い方

![](icon%202.png)https://zenn.dev/channel/articles/af4ffd813b1424

![](og-base-w1200-v2%205.png)](https://zenn.dev/channel/articles/af4ffd813b1424)

[https://zenn.dev/k_kawasaki/articles/2cee32fc8a907d](https://zenn.dev/k_kawasaki/articles/2cee32fc8a907d)

# Flutter既存のNavigationとの違い

`go_router`を代表とするNavigator2.0に分類されるルーティング手法は、従来の`Navigator`クラスに対する`push`や`pop`などの命令的(Imperative)なルーティングと異なり、先に全ての遷移構造を定義し、その構造を元に画面遷移する宣言的(Declarative)なルーティングを行います。パス指定で遷移し、その過程に存在する画面を同時に生成してくれます。

つまり、

ここに行け、一個戻れじゃなくて、

渋谷にいけ、新宿に行け。という遷移する先の構造を指定する感じ。

公式の説明を確認する!

[https://docs.flutter.dev/ui/navigation](https://docs.flutter.dev/ui/navigation)

以下chat GPTの回答

```Ruby
	•	Declarative Routing:
		•	Focuses on what the routes are.
		•	Typically defined in a structured and configuration-based manner.
		•	Easier to read, maintain, and predict.
	•	Imperative Routing:
		•	Focuses on how to perform routing operations.
		•	Handled directly in the code through commands and event handlers.
		•	Offers more flexibility but can be harder to manage and predict.
```

we

[

FlutterのNavigator(Navigator 1)とRouter(Navigator 2)のちがい

Flutterに画面遷移は必要不可欠です。ただ、画面遷移の実装方法はFlutterの歴史的な経緯により、複数のパターンが存在します。とりわけ2020年末にRouter(Navigator 2)が登場したことで、アプリケーションを開発にするにあたり、幾つかの意思決定をする必要が生じています。 この意思決定においては、Flutterのちょっとした経緯を把握していれば進めやすいのですが、イマイチピンとこない状態だと進めにくいものになっています。

![](icon%202.png)https://zenn.dev/koji_1009/articles/7b99e332c537cd

![](og-base-w1200-v2%206.png)](https://zenn.dev/koji_1009/articles/7b99e332c537cd)

## 利点

Webサイトのルーティングと類似した手法である事からディープリンクなどとの親和性が高く、ページ構成を崩す事なく、**どのページにも簡単に遷移する**事が大きな利点です。またリダイレクト処理や遷移アニメーションが書き易いというメリットを挙げる方も多いようです。

- deep link?
    
    [
    
    ディープリンクとは？アプリ別（Android、iOS）に設定方法も紹介
    
    ディープリンクとは何か？本記事では仕組みやメリットなどの基本概要から、有名企業の取り組み事例、Android、iOSでの設定方法まで幅広く解説しています。
    
    ![](cropped-favicon-192x192.png)https://www.sungrove.co.jp/deep-linking/
    
    ![](deep-linking02.jpeg)](https://www.sungrove.co.jp/deep-linking/)
    

## 課題点

- タブ内の状態が破棄できない。

[https://github.com/flutter/flutter/issues/132906](https://github.com/flutter/flutter/issues/132906)

# go_route_builderを使ったNavigation2.0実装

[

[続] go_routerでBottomNavigationBarの永続化に挑戦する(StatefulShellRoute)

以前書いたgo_routerの記事から月日が流れ、go_routerでも「ボトムナビゲーションバーの永続化」、そして「各タブ内の状態保持」に対応する　StatefulShellRoute が導入されたので、そちらについて整理していきたいと思います。

![](icon%202.png)https://zenn.dev/flutteruniv_dev/articles/stateful_shell_route#導入の流れ-1

![](og-base-w1200-v2%203.png)](https://zenn.dev/flutteruniv_dev/articles/stateful_shell_route#導入の流れ-1)

サンプルコード

`GlobalKey<NavigatorState>` 型の $navigatorKeyに、NavigatorStateを代入します。

(どのNavigatorに属するのかを識別するもの)  

### go_router_builder ver.

```Dart
class ShellRouteData extends StatefulShellRouteData {
  const ShellRouteData();

  static final GlobalKey<NavigatorState> $navigatorKey = rootNavigatorKey;

  @override
  Widget builder(
    BuildContext context,
    GoRouterState state,
    StatefulNavigationShell navigationShell,
  ) {
    return Home(navigationShell: navigationShell);
  }
}
```

### go_router ver.

e.g.

```Dart
final appRouter = GoRouter(
 navigatorKey: rootNavigatorKey,
 initialLocation: '/home',
 routes: [
   StatefulShellRoute.indexedStack(
     parentNavigatorKey: rootNavigatorKey,
     builder:(context, state, navigationShell){
      return AppNavigationBar(navigationShell: navigationShell);
     },
     branches: [
       // homeブランチ
```

`**go_router_builder**` を使う際は`StatefulShellRoute`, `StatefulShellBranch`, `GoRoute`をそれぞれ以下のクラスを継承するクラスとして定義します。

- `StatefulShellRoute` → `StatefulShellRouteData` (複数のNavigatorとその状態保持を束ねるルート)

- `StatefulShellBranch` → `StatefulShellBranchData`(Shellの構成要素となる1つのNavigator)

- `GoRoute` → `GoRouteData` (それぞれの１画面に対応するRoute)

[https://zenn.dev/k_kawasaki/articles/2cee32fc8a907d](https://zenn.dev/k_kawasaki/articles/2cee32fc8a907d)

### 今更聞けないcontext.go とcontext.pushの違い

[

context.goとcontext.pushの違い？

go_routerを半年使い続けてキャッチアップしてきたが、最近作ったコミュニティに入ってくれたSogaさんと議論するまで、ただ画面遷移することができる便利なパッケージとして使ってるだけで、画面遷移する時の状態については理解してなかったので、記事を書こうと思った。

![](icon%202.png)https://zenn.dev/joo_hashi/articles/72936430147c4c

![](og-base-w1200-v2%207.png)](https://zenn.dev/joo_hashi/articles/72936430147c4c)

[

入門go_router - Studyplus Engineering Blog

こんにちは。 モバイルクライアントグループの若宮(id:D_R_1009)です。 最近、スプラトゥーン3のバイトにハマっています。 全ステージでんせつ200を達成できたので、400を目指して日々クマサン商会に入り浸っております。 さて、スタディプラスではFlutter Webを採用しています。 FlutterによるMo…

![](link%201.png)https://tech.studyplus.co.jp/entry/2022/11/28/100000

![](1524735869490675.png)](https://tech.studyplus.co.jp/entry/2022/11/28/100000)

# 開発メモ

- tab_routesにはbottom nav付きのページを定義し、その階層構造を規定する。

- zas