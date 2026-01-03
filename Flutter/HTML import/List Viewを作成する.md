---
tags:
  - flutter
  - dart
  - widget
created: 2026-01-03
status: active
---

# List Viewを作成する

- performanceが問題にならない場合 → `Column`

## `SingleChildScrollView`

->child属性を１つだけとり、表示域をあふれた分はスクロールできるようにする。

```Dart
@override
  Widget build(BuildContext context) {
    return SizedBox(
      height: 400,
      child: SingleChildScrollView(
        child: Column(
          children: summaryData.map((data) => SummaryItem(data: data)).toList(),
        ),
      ),
    );
```

## ListView

```Dart

    return ListView(
      children: <Widget>[
        Padding(
          padding: const EdgeInsets.all(20),
          child: Text('You have '
              '${favorites.length} favorites:'),
        ),
        for (var pair in favorites)
          ListTile(
            leading: Icon(Icons.favorite),
            title: Text(pair.asLowerCase),
          ),
      ],
	);
	
```

## ListView.Builder

一度に全て読み込んだ場合にPerformanceに影響するならこちらを使う。

```Dart
ListView.builder(
	itemCount, //int 最終的にどれくらいの長さになるのかをFlutterに伝える。
	itemBuilder, 
	//{required Widget? Function(BuildContext, int) itemBuilder}
)
```