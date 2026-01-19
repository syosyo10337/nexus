---
tags:
  - html-css
  - html
  - css
  - layout
created: 2026-01-04
updated: 2026-01-19
status: active
---

# FlexBox

余白の配分やコンテンツの並び方を指定することで、ページ構成要素を配置するためのレイアウト方法。
縦方向や横方向、1 つの軸に沿ってレイアウトすることも、複数の行を介してレイアウトすることもできる

## flex container

flexboxを使うためには、配置したい要素の親要素に`display: flex;`を付与すること。

この時、親要素は、**flex container**となり、子要素は**flex item**となる。
また、この構造はネストすることができる。つまり、flex itemをflex containerとして、その子要素をまたflex itemとして扱うことができるということ。

このコンテナの中では、flex itemは、設定された主軸(main-axis)に沿って配置され、デフォルトでは水平方向のx→の主軸がある。

この主軸に対して、垂直に交わる軸を交差軸(cross-axis)と呼ぶ。

flex container内ではmarginの相殺が起きないようです。

### `flex-direction:`

フレックスアイテムが並ぶ主軸を指定する

{keywords}

- row(as default)

- row-reverse

- column

- column-reverse

![flex-direction](HTML&CSS/styling/Attachments/Screen_Shot_2023-02-03_at_14.33.02.png)

### `flex-wrap:`

フレックスアイテムを一行に押し込めて表示するか、複数行を介して表示するか指定する。

複数行をに介する場合には、行(または、列)を積み重ねる方向の制御も可能

{keywords}

- nowrap(as default)

- wrap

- wrap-reverse

☝

nowrapの際に、flex itemの幅がflex containerの幅を超えるとover flowを起こす。

wrap-reverseを指定した場合には、wrap と同じく要素を複数行表示しますが、交差軸の逆向きに動作します。

### `justify-content:`

フレックスアイテムが主軸上でどのように配置されるべきか決定

{keywords}

- flex-start

- flex-end

- center

- space-between

- space-around

[![](HTML&CSS/styling/Attachments/Screen_Shot_2023-02-03_at_14.45.39.png)](FlexBox/Screen_Shot_2023-02-03_at_14.45.39.png)

☝
flex-itemが元々inline要素の時は、配置する部分のwidthを指定する必要があるね。

### `align-items:`

交差軸に沿ってどう要素を揃えるかの指定。交差軸方向に余裕がある場合にのみ有効

{keywords}

- flex-start

- flex-end

- center

- baseline

- stretch

![align-items](HTML&CSS/styling/Attachments/Screen_Shot_2023-02-03_at_14.47.52.png)

☝
`justify-content: center; align-items: center`で中央揃えをすることができる。

==// alignとついたら、交差軸に対する操作==

### ?`align-content:`

フレックスボックスの交差軸の内部のアイテムの間または周囲の空間の配分方法を設定(ex:flex-start,flex-end,center,space-between;)

### `flex-flow:`

{一括指定プロパティ}

flex-direction flex-wrapの順序で一括指定できる。

## flex Item

### `flex-grow:`

フレックスコンテナ内の残りの空間(余白)のうち、どれだけがそのアイテムに割り当てられるか (フレックス伸長係数) を整数で設定。初期値は0.一つのitemだけにflex-grow: 1;とすると、余白分をそのitemに割り当てる。

e.g.)横幅720xのcontainerがあるところに、3つのflex itemに対して、1:1:3のflex-growをつけて、それぞれのflex itemの横幅が100pxとしてある時は、

720 -300 =420px を　1:1:3で割り当てるので、(420px /5 = 84px)

184px, 184px 352pxにitemが引き伸ばされる。

### `order:`

アイテムを並べる順序を設定。それぞれのアイテムに順序を示す整数を割り振る。A,B,C,D に対して　3, 1, 4,2 とすると B, D, A, Cと並ぶ。

### `align-self:`

グリッドやフレックスのアイテムの align-items の値を上書きする。(グリッドでは、アイテムはグリッド領域内で配置されます。)フレックスボックスでは、アイテムは交差軸上で配置されます。
