 

# Flutter internals(画面描画の仕組み)

[Widgets, Element & Render Trees](#86c66487-a7f2-480e-b315-1558dbe79816)

[Three Trees](#7d29ea1d-edb0-4355-972a-9c3c733bc3ca)

[cf. Widget treeと Element treeの関係性](#2356625a-d044-43d1-9c74-f73bc7d87e81)

[cf. ) 3つのツリーのまとめ](#3204750b-a617-43d3-8d8f-30c0fba26f29)

[Elementを操作する。](#04ce4d0f-6cbd-465b-82e2-3178725e75cf)

[How Flutter Updates UIs](#8693384c-1494-403c-a8b1-bbd3b243a845)

[Understanding Keys](#dec63aea-d976-4e35-9ead-d609ac5fff35)

[Summary](#371f1693-76b0-4aa6-952b-f12a480704da)

cf. ) ch.7 [https://www.udemy.com/course/learn-flutter-dart-to-build-ios-android-apps/learn/lecture/37143870#search](https://www.udemy.com/course/learn-flutter-dart-to-build-ios-android-apps/learn/lecture/37143870#search)

# Widgets, Element & Render Trees

## Three Trees

- 2つはinvisiable
    
    - Widget Tree
        
        - いわゆるネストされたWidgetの集合
        
        - build()メソッドは頻繁にupdateされる。StatefulWidgetsの時とかそうでしょう?
        
    
    - Element Tree
        
        - widgets treeをFlutter がElement treeに変換する。
            
            - in-memory representation of your widgets
            
            - UIの変更が必要かを決めるために用いられる。
            
        
        - 背後で作成され、再利用される。build()が最初に呼ばれたときにはinitializeされるけど、その後は、必要なものだけElementが更新される。
        
    
    - Render Tree
        
        - 実際に描画されているUIブロックのこと
        
        - Nativeの画面描画処理は、負荷が高い(画面の表示切り替えって大変。)
            
            - なので、Element treeが更新されたときにだけ、こちらのrender treeも更新する。
            
        
        - すべてのrender treeを更新するわけではなく、画面上の必要な1部だけを更新する。
        
    

### cf. Widget treeと Element treeの関係性

[![](Notion/Attachments/90D29E86-496E-43C4-A74F-4CAD8DCB22BA.jpg)](Flutter%20internals\(%E7%94%BB%E9%9D%A2%E6%8F%8F%E7%94%BB%E3%81%AE%E4%BB%95%E7%B5%84%E3%81%BF\)/90D29E86-496E-43C4-A74F-4CAD8DCB22BA.jpg)

### cf. ) 3つのツリーのまとめ

[![](Notion/Attachments/2C41F1A2-7AEA-43C0-AE25-118D2DA4CDD1.jpg)](Flutter%20internals\(%E7%94%BB%E9%9D%A2%E6%8F%8F%E7%94%BB%E3%81%AE%E4%BB%95%E7%B5%84%E3%81%BF\)/2C41F1A2-7AEA-43C0-AE25-118D2DA4CDD1.jpg)

## Elementを操作する。

Flutterによって本来自動的に呼び出されるcreateElementメソッドを明記することで、実際の呼び出しを体感できる。

```Dart
@override
  StatefulElement createElement() {
    print('UIUpdatesDemo CREATEELEMENT called');
    return super.createElement();
  }
```

# How Flutter Updates UIs

1. build()メソッドが呼ばれる。

2. Element treeをチェックする。
    
    1. 既に存在するElementを再利用する。
    
    2. そうでないものは生成される。
    

3. 更新前と後のElement treeを比較して、実際のRender Tree(UI)を更新する。

- setStateが呼ばれると、buildメソッドが再excuteされる。buildメソッドの内のwidgetsの記述を走査する必要がある。
    
    - → ここでは、処理の最適化ができそうだよね！
    

# Understanding Keys

widgetとelement treeの関係性を明らかにしていきます。

`const Widget({super.key})`のことですよ

例えば、todoリストがあったとして、asc/descを入れ替えたら？

Elementを廃棄するわけじゃないよ。

- Elementはwidgetsに対してreference(参照を持っている。)

```Dart
//TodoItem widgetsがこんな感じだとすれば、
children: [
          Icon(icon),
          const SizedBox(width: 12),
          Text(text),
        ],
```

- 変更された部分の**内部参照を切り替えている。**

- 全てのElementはwidgetsに紐づいていているので、配置が変わった際には、widgetsを参照する。

💡

ただし、stateはElement References(widgetsに対する参照)とは別に管理される。  
確かに,statefull widgetsは二つのクラスで管理されているよね。状態管理のstateクラスmutableとそれをもとに生成したwidgetsを返すクラス。(immutable)

つまり、statefulwidgetsで用いられるstateオブジェクトは、下の図のように、

widgetsに紐づいているわけではなくて、widgetをもとに生成されるelmentに紐づいている。

- 変更された部分の**内部参照を切り替えている。ので**

Element 全体が参照全てを切り替えているわけではなく、elementの内部で、必要なelementのみをwidgetsの変更に合わせて切り替えていて(今回の親Elementに紐づくstateへの参照は切り替わらない。)

[![](Notion/Attachments/619F66D7-EE42-4C84-AF90-8796D6EAA02C.jpg)](Flutter%20internals\(%E7%94%BB%E9%9D%A2%E6%8F%8F%E7%94%BB%E3%81%AE%E4%BB%95%E7%B5%84%E3%81%BF\)/619F66D7-EE42-4C84-AF90-8796D6EAA02C.jpg)

- Element とwidgetのType名だけをみて判断しているらしいよ。
    
    - keyを追加すると、同じType名のwigetsを同一視するのではなく、widgetとelementそれぞれに付与された値をもとにして、差分を確認する。
    

[![](Notion/Attachments/137AB6D5-2AC4-4093-8701-4322F5677003.jpg)](Flutter%20internals\(%E7%94%BB%E9%9D%A2%E6%8F%8F%E7%94%BB%E3%81%AE%E4%BB%95%E7%B5%84%E3%81%BF\)/137AB6D5-2AC4-4093-8701-4322F5677003.jpg)

- keyの値を設定仕方
    
    1. ValueKey()を使って値をkeyとする
    

```Dart
Column(
            children: [
              // for (final todo in _orderedTodos) TodoItem(todo.text, todo.priority),
              for (final todo in _orderedTodos)
                CheckableTodoItem(
                  key: ValueKey(todo.text),
                  todo.text,
                  todo.priority,
                ),
            ],
```

2. ObjectKey()もできるよ。　ValueKeyの方が軽いらしいぜ。

### Summary

[![](Notion/Attachments/B717512D-6D5A-4AE8-B170-5285EB079CCF.jpg)](Flutter%20internals\(%E7%94%BB%E9%9D%A2%E6%8F%8F%E7%94%BB%E3%81%AE%E4%BB%95%E7%B5%84%E3%81%BF\)/B717512D-6D5A-4AE8-B170-5285EB079CCF.jpg)