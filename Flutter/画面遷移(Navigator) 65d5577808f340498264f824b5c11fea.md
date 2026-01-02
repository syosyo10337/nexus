 

# 画面遷移(Navigator)

[画面遷移の全体像](#063f2dc2-d03b-44f5-87c5-66d2f71314d0)

[push](#dc617ce1-e851-4352-90ee-5bbed75bcebb)

[pop](#dea69261-a6e8-4497-a8f1-6f1dab75ad07)

[pushReplacement](#844b9ddd-07ff-487f-a724-a1c167600844)

[pushAndRemoveUntil](#564452ff-5e4a-4c09-a601-574a722aea16)

[popUntil](#abaf5e4c-77b5-4e63-aa98-3ff877a21125)

# 画面遷移の全体像

Navigatorというクラスに対し、Routeクラスでラップしたページを渡す事でページの遷移を行います。

**Navigatorクラスは全てのページを入れる容器のようなもの**とイメージ。 Stackを用いてページ遷移を表現していて、最上位にあるwidgetが現在表示されているという認識。

  
Navigator には、ページを追加するだけでなく、積み上げたページを削除したり、置き換えたりと様々な操作ができるようになっています。

```Dart
//ボタンをタップすると画面遷移する実装
PageB
    FloatinActionButton(
        onTap: () {
            Navigator.of(context).push(
                MaterialPageRoute(
                    builder: (context) => PageB(),
                ),
            );
        },
    )
```

## push

builderのコールバックにとったページへ遷移する。

```Dart
//statelessだとcontextはglobalには使えないので、
void _selectCategory(BuildContext context) {
    Navigator.push(context, route);
  }

//or 
void _selectCategory(BuildContext context) {
    Navigator.of(context).push(route);
  }



//e.g.
void _selectCategory(BuildContext context) {
    Navigator.of(context).push(
      MaterialPageRoute(
        builder: (ctx) => MealsScreen(
          title: 'Some title',
          meals: [],
        ),
      ),
    );
  }
```

## pop

前の画面に遷移する。

```Dart
// 値を持って、前の画面に戻る
Navigator.of(context).pop('戻る際に渡したい値');
```

## pushReplacement

「現在のページを新しいページと入れ替える」 メソッドです。

## pushAndRemoveUntil

「次のページに遷移しつつ、特定の条件のページまで過去のページを取り除く」

```Plain
// 全ての過去のページを取り除く
Navigator.of(context).pushAndRemoveUntil(
    MaterialPageRoute(
        builder: (context) => PageD(),
    ),
    (route) => false,
);

// パス名が'/home'のページに辿り着くまで過去のページを取り除く
Navigator.of(context).pushAndRemoveUntil(
    MaterialPageRoute(
        builder: (context) => PageD(),
    ),
    (route) => route.settings.name == '/home',
);`
```

## popUntil

「指定のページまで一気に戻る」 メソッドです。

引数にコールバック関数を渡し、そのコールバック関数がtrueを返すまで、スタックされているRouteオブジェクトを取り除きます。

コールバックで受け取るRouteオブジェクトは、pushAndRemoveUntilと同様にパス名判定などに使うことができます。

- pop 時に値を渡す  
    前の画面に戻るpopメソッドでは、戻る際に値を渡すこともできます。

値を返す画面へ遷移する際に、返り値を受け取る前提で処理を記述する必要があります。(PageBに戻る想定ということは、そのページ遷移の実装の部分の戻り値で受け取る。)

返り値を受け取る処理は非同期処理となる為、asyncとawaitを使用します。

画面遷移では値が返されない場合もあるので、返り値の型はnullableな型として定義しましょう(<String?>の部分)

// 値を受け取る前提で遷移する  

```Dart

onTap: () async {
final String? result = await Navigator.of(context).push<String?>(
MaterialPageRoute(
builder: (context) => PageB(),
),
);
print(result);
},
...
```

Go_routerのgoとpush についてそれぞれの挙動の違いを理解する。

  

[

入門go_router - Studyplus Engineering Blog

こんにちは。 モバイルクライアントグループの若宮(id:D_R_1009)です。 最近、スプラトゥーン3のバイトにハマっています。 全ステージでんせつ200を達成できたので、400を目指して日々クマサン商会に入り浸っております。 さて、スタディプラスではFlutter Webを採用しています。 FlutterによるMo…

![](link%202.png)https://tech.studyplus.co.jp/entry/2022/11/28/100000

![](1524735869490675%201.png)](https://tech.studyplus.co.jp/entry/2022/11/28/100000)

[

context.goとcontext.pushの違い？

go_routerを半年使い続けてキャッチアップしてきたが、最近作ったコミュニティに入ってくれたSogaさんと議論するまで、ただ画面遷移することができる便利なパッケージとして使ってるだけで、画面遷移する時の状態については理解してなかったので、記事を書こうと思った。

![](icon%207.png)https://zenn.dev/joo_hashi/articles/72936430147c4c

![](og-base-w1200-v2%2011.png)](https://zenn.dev/joo_hashi/articles/72936430147c4c)