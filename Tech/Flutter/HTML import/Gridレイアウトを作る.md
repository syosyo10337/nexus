---
tags:
  - flutter
  - dart
  - widget
created: 2026-01-03
status: active
---

# Gridレイアウトを作る

# Grid Viewについて

```Dart
     body: GridView(
        gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
          crossAxisCount: 2,
          childAspectRatio: 3 / 2,
          crossAxisSpacing: 20,
          mainAxisSpacing: 20,
        ),
children: [
```

こんな感じで設定できるよ。gridの継承みたいな、レイアウト設定をする必要があります。

`GridView.builder` は、Flutter で動的にグリッドレイアウトを構築するためのウィジェットです。大量のアイテムをグリッド状に表示する必要がある場合に便利です。

以下は、提供されたコードの各プロパティの説明です。

1. `itemCount`:
    
    - グリッドに表示するアイテムの総数を指定します。
    
    - ここでは、`data.connection!.edges.length` が使用されており、`data` オブジェクトの `connection` プロパティの `edges` の長さがアイテム数として設定されています。
    

2. `shrinkWrap`:
    
    - `true` に設定すると、グリッドのサイズが子ウィジェットのサイズに合わせて縮小されます。
    
    - `false` の場合、グリッドは利用可能なスペースを埋めるように拡張されます。
    

3. `physics`:
    
    - グリッドのスクロール動作を制御するために使用されます。
    
    - ここでは、`NeverScrollableScrollPhysics()` が使用されており、グリッドがスクロール不可能になります。
    

4. `gridDelegate`:
    
    - グリッドのレイアウトを制御するために使用されるデリゲートを指定します。
    
    - ここでは、`SliverGridDelegateWithFixedCrossAxisCount` が使用されています。これは、グリッドの列数を固定し、アイテム間のスペースを指定するためのデリゲートです。
    

5. `SliverGridDelegateWithFixedCrossAxisCount` のプロパティ:
    
    - `crossAxisCount`: グリッドの列数を指定します。ここでは、`2` に設定されており、グリッドは2列で表示されます。
    
    - `crossAxisSpacing`: 列間のスペースを指定します。ここでは、`8` に設定されています。
    
    - `mainAxisSpacing`: 行間のスペースを指定します。ここでは、`8` に設定されています。
    
    - `childAspectRatio`: 子ウィジェットのアスペクト比を指定します。ここでは、`0.4` に設定されており、子ウィジェットの幅に対する高さの比率が0.4になります。
    

`GridView.builder` は、`itemBuilder` プロパティを使用して、グリッドの各アイテムを構築します。`itemBuilder` は、インデックスを受け取り、対応するアイテムのウィジェットを返す関数です。

以下は、`GridView.builder` の使用例です。

```Dart
GridView.builder(
  itemCount: data.length,
  gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
    crossAxisCount: 2,
    crossAxisSpacing: 8,
    mainAxisSpacing: 8,
    childAspectRatio: 0.4,
  ),
  itemBuilder: (BuildContext context, int index) {
    // アイテムのウィジェットを構築して返す
    return Container(
      color: Colors.blue,
      child: Center(
        child: Text('Item $index'),
      ),
    );
  },
)
```

この例では、`data` リストの長さに基づいてアイテム数が設定され、`itemBuilder` 関数でアイテムのウィジェットが構築されます。各アイテムは、青い背景色を持つ `Container` ウィジェットで、中央に `Text` ウィジェットが配置されています。

`GridView.builder` は、大量のアイテムを動的に表示する必要があるシナリオで便利です。スクロール可能なグリッドビューを作成し、メモリ効率の良い方法でアイテムを読み込むことができます。