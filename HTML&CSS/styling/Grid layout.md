---
tags:
  - html-css
  - css
  - layout
created: 2026-01-04
status: active
---

# Grid layout

# **[グリッドレイアウト]**

**  
グリッドコンテナーを作成するには、要素に対して**display: grid か display: inline-grid を指定します。グリッドコンテナーを作成すると、直接の子要素がすべてグリッドアイテムへと変わります。  
*grid-template-columns および *grid-template-rows プロパティを使用してグリッド上に行と列を定義します。これらはグリッドトラックをいいます.  

```CSS

.container {
display :grid;
grid-template-columns: 100px 100px 100px; --3列2行のグリッドコンテナ、　全て100x100pxのトラック
grid-template-rows: 100px 100px ;
}
.container {
display :grid;
grid-template-columns: 100px 1fr 100px; --3列2行のコンテナ、両端4つのトラックは100x100px、真ん中2つは　100余白分
grid-template-rows: 100px 100px ;
}
.container {
display :grid;
grid-template-columns: 100px 2fr 1fr 100px; --2fr,1frということは、真ん中２列のトラックは余白2:1の比率に割った幅をそれぞれ持つ。
grid-template-rows: 100px 100px ;
```

## *repeat()によるトラック記法

```CSS
/* e.g. */
grid-template-columns: repeat(4, 100px); -100px幅のグリッドを4つ。
grid-template-rows: 100px 100px;
grid-template-columns: repeat(auto-fill, 100px); -100px幅のグリッドを親要素(つまりグリッドコンテナ)分ならべる。
grid-template-rows: 100px 100px;
*minmax(a, b) --a以上b以下の寸法になるような値を意味する。
*auto-fill --指定幅のグリッドを親要素幅分並べる。（伸張し要素がなくなればその分空白になる。）
*auto-fit --指定幅のグリッドを親要素幅分並べる。(横幅いっぱいに均等の配置する)

/* e.g. */
grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
grid-template-rows: 100px 100px ;
grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
grid-template-rows: 100px 100px ;
```

## *明示的なグリッドと暗黙的なグリッド

*grid-template-columns および *grid-template-rows プロパティによって作成されるグリッドは明示的グリッドと呼び、それ以降も(コンテンツがあれば？)暗黙的にグリッドも作成されます。デフォルトだと、内容物のサイズによってグリッドの大きさが決まりますが、それらを定義するのがgrid-auto-rows と grid-auto-columnsです。

```CSS
/* e.g. */
grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
grid-template-rows: 100px 100px ;
/* --2行までは明示的なグリッドが定義され、それ以降の行の高さは100pxとして作成される。(終始一定の高さでよければgrid-template-rows は省略できる。) */
grid-auto-rows: 100px;
/* e.g.  div要素が暗黙的なグリッドに作成された際、その幅はblock要素なのでページの横いっぱいまで広がってしまう際に */
grid-auto-columns: 100px;と指定すると、暗黙的にグリッドが保たれたように見える。
*grid-auto-flow: --配置アルゴリズムを変える。(値:row-初期値左上から右に配置、column-左上から下に配置、dense-発生した空白を埋めるように配置(row,column)と併用可能。)
*div要素が暗黙的なグリッドに作成された際、その幅はblock要素なのでページの横いっぱいまで広がってしまう際に
grid-auto-columns: 100px;と指定すると、暗黙的にグリッドが保たれたように見える。
*gap: --一括指定プロパティグリッド間の余白を作る。(値:row-gap,column-gap)横縦の順で指定する。1つの値を与えることもできる。
```

## グリッドラインによるグリッドトラックの指定、以下のようにグリッド線に番号でインデックスをつける。

1(-4) 2(-3) 3(-2) 4(-1)  

1(-4)-------------------------------------  
| | | |  
| | | |  
2(-3)-------------------------------------  
| | | |  
| | | |  
3(-2)-------------------------------------  
| | | |  
| | ☆ | |  
4(-1)-------------------------------------

☆が入ったグリッドに指定の要素を入れたい時は  
grid-row: 2;  
grid-column: 2;と指定する。  
また、☆の右横までの２マスを指定したい時は、  
grid-row: 2;  
grid-column: 2 / 4 --グリッド線２から4まで、もしくは 2 / span 2 --2から２グリッド分と書く。(spanは単にグリッドの大きさを範囲指定する時に単体でも用いられる。)

### _グリッドラインに名前をつける。--明示的なグリッドを作成する際に、命名したいグリッドラインに当たる部分に[]で囲って命名する。_

```CSS

grid-template-columns: 100px [target-start] 100px [target-end] 100px;
grid-template-rows: 100px 100px;
}
.box1 {
background-color: hsl(0,60%,60%);
grid-row:2;
/ grid-column: target-start / target-end; */ --グリッドラインの数値ではなく、付けた名前で指定。
grid-column: target;　--　-start/-end で指定したものについては略記できる。
}
```

### *grid-areas/grid-areaを用いた直感的な記法

```CSS

/* e.g. */
.container {
display :grid;
grid-template-columns: repeat(5, 100px);
grid-template-rows: repeat(4, 100px);
grid-auto-columns: 100px;
grid-template-areas:
"r r r y y"
"r r r y y"
"c c g y y"
"c c b y y";
}
.box1 {
background-color: hsl(0,60%,60%);
/* grid-row: 2;
grid-column:1; */
grid-area: r;

}
.box2 {
background-color: hsl(60,60%,60%);
grid-area: y;
}
.box3 {
background-color: hsl(120,60%,60%);
grid-area: g;

}
.box4 {
background-color: hsl(180,60%,60%);
grid-area: c;
}
.box5 {
background-color: hsl(240,60%,60%);
grid-area: b;

}
```

grid-template-areas内で、グリッドトラックそれぞれに対して、アルファベットを当てはめ、それらと各grid-areaの値を上の例でみたように対応される。※注意点としては、grid-template-areasの領域は要素が四角でなければならない。つまり、３トラックをつかってL字に要素を配置したり、例でいうyyの領域を飛び地にすることはできない。

## {グリッドの揃え、整え方}

- `justify-content/align-content`: --グリッドコンテナの配置を指定する。親要素内にたいしてどのようにコンテナを置くかを指定する。(値:start,end,center)

- `justify-items/align-items`: -- それぞれのグリッドトラック内でのコンテンツの配置を一括指定する。

- `justify-self/align-self`: --それぞれのグリッドトラック内でのコンテンツの配置をグリッドトラック単位で指定する。

## fr

[https://developer.mozilla.org/ja/docs/Web/CSS/CSS_grid_layout/Basic_concepts_of_grid_layout#%E5%8D%98%E4%BD%8D_fr](https://developer.mozilla.org/ja/docs/Web/CSS/CSS_grid_layout/Basic_concepts_of_grid_layout#%E5%8D%98%E4%BD%8D_fr)