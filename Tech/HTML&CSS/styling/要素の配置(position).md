---
tags:
  - html-css
  - css
  - layout
created: 2026-01-04
status: active
---

# 要素の配置(position)

[`position:`](#214708ea-153d-4fd9-b306-31b895e3ce64)

[キーワード](#d4a2b772-efff-4e3d-aea8-0cd23ced0df8)

[static;](#35d2ba17-3b39-4575-9147-42e786ac16c6)

[relative;](#06d8c0db-613a-41da-b431-27a106630e94)

[absolute;](#78d07ea7-bf20-4caf-ba87-75e1d3b601cf)

[fixed;](#f0568e0c-e22c-4b09-abab-a1d9f5be8afa)

[sticky;](#0081782e-e0d7-4f93-8588-843d936779fb)

[`overflow:`](#9e7f6d6d-8067-4c50-9184-d8bacb95b14c)

# `position:`

このプロパティは`static, relative, sticky, absolute, fixed` を受け取ります。

全ての要素はデフォルトで static の値を持っており、通常のフロー内に配置されます。

`position: <値staticなど>`を指定した後に、  
さらにtop、left、right、bottom(プロパティ)で位置を指定する。

```CSS
e.g.)
div {
	position: relative;
	top: 25px;
}
```

## キーワード

### static;

デフォルト。

### relative;

**要素はフローの中で配置されます。**  
自分自身からの相対オフセットで配置。オフセットは他の要素の配置には影響を与えません。  
つまり、ページレイアウト内で要素に与えられる=='空間'==は、位置が static であった時と同じです。  
`top: 30px; left:20px`などと位置を指定します。

### absolute;

**要素はフローの中から完全に排除される**。そのため、他の要素はこの要素が存在しないかのように配置されることになる  
left, top, bottom等を用いることでpositioned elment(static以外のpotision値を持つ祖先となる要素)から相対的に配置することができます。

☝

もしpositioned elmentな親要素がなければ、デフォルトでルート要素そのものに戻り、ページそのものに対して相対的に配置される。

```CSS
e.g.)Aの中のb要素を移動させる。
.A {
	position: relative;
}

.b {
	postion: absolute;
	top: 20px;
}
ただ、中央配置とかはflexboxのほうがいい
```

### fixed;

**フローの中から完全に排除される。**

ビューポートの表示領域からの位置とrelative(相関)する位置に置かれる。  
つまり、常に要素を画面上の指定した位置に固定させておく

(よく見るチャットヘルプみたいなやつ)  
ページの左上を起点に位置を指定。

### sticky;

**要素は文書の通常のフローに従って配置される  
**sticky ではスクロール可能な親要素の位置に対して、キーワード left, top, bottom を用いることで子要素を相対的に配置させ、さらに粘着させることができます。

☝

縦スクロールの場合にはtopからbottom  
横スクロールの場合には、leftかrightの値をしっかり指定する必要があります。

- 要素の重なりについて後述される要素が上にくる。  
    *z-index: --要素の重なりの順序を指定する際に使用。positionがstatic以外の要素で使用可能で、整数値で指定し、値が大きいほど上に表示される

# `overflow:`

要素が何らかの理由でコンテナに収まらないときに使用する。  
キーワード visible, hidden, scroll, auto を持ちます。デフォルト visible。  
`overflow-x`プロパティや `overflow-y`で個別に指定することができる。

- hidden  
    コンテナに収まらなかった部分は切り取られます

- scroll  
    コンテナに収まらなかった部分は切り取られますが、スクロールバーが出現し、切り取られた部分をスクロールによって見ることができるようになります。スクロールバーは水平方向、垂直方向の両方に出現します。

- auto

auto 値は、オーバーフローが発生した場所を検出し、その方向にスクロールバーを追加します。例えば、水平方向にコンテンツのオーバーフローがない場合、スクロールバーは垂直方向のみに追加されます。