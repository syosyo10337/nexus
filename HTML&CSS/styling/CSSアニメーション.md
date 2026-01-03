---
tags:
  - html-css
  - css
  - animation
created: 2026-01-04
status: active
---

# CSSアニメーション

---

==<目次>==

[`transform:`](#1f0fce51-bc1e-4479-9931-d6c4979a05d1)

[`translate(Xpx, Ypx);`](#1a7286a7-e703-403c-9d85-0538b3c5615c)

[`rotate(Xdeg);`](#c136e6e6-9517-4cc3-8776-2b40ab2e91db)

[`scale();`](#476ed29a-c6ab-47d6-99b7-99e260f5a282)

[`transform-origin:`](#389df78a-afe6-4a33-bb77-30caf37c10c7)

[`transition:`](#de60389c-e7c2-4037-9701-a0b10d0d34d2)

[`transition-property:`](#d0fb3a87-206b-4292-9eae-8d864d0d8649)

[`transition-duration:`](#497ba530-1629-4dc3-97ec-9282ada77c92)

[`transition-delay:`](#0ac51168-65f0-477f-bc22-56b2cfa843ba)

[transition-timing-function:](#ece321f8-05f7-44ce-85f2-dbd1176588bb)

# `transform:`

## `translate(Xpx, Ypx);`

指定したx、y座標に移動させる　

```CSS
.box {
   width: 100px;
   height: 100px;
   background-color: yellowgreen;
}

/*  要素にhoverした時のcss */
.box:hover { 
   transform: translate(30px , 30px);
}
```

## `rotate(Xdeg);`

指定した値分、対象を回転させる。

```CSS
.box {
   width: 100px;
   height: 100px;
   background-color: yellowgreen;
}

/*  要素にhoverした時のcss */
.box:hover { 
   transform: rotate(45deg);
}
```

## `scale();`

指定した値分、拡大・縮小する。

(x, y)で指定した場合には、x方向、y方向ごとに拡大縮小することができる。

```CSS
.box {
   width: 100px;
   height: 100px;
   background-color: yellowgreen;
   margin: 30px;
}

/*  要素にhoverした時のcss */
.box:hover { 
   transform: scale(2);
}

/* 2倍に拡大する。*/
```

# `transform-origin:`

要素の座標変換 (transform) における原点(起点)を設定

==遷移前のプロパティとして設定(変更後だけにしたい要素ではないため。)==

```CSS
.box {
   width: 100px;
   height: 100px;
   background-color: yellowgreen;
   margin: 30px;
}

/*  要素にhoverした時のcss */
.box:hover { 
   transform: scale(2);
   transform-origin:left top;
}
```

より本格的なアニメーションのためには、`transition`プロパティによって適用させます。

# `transition:`

{一括指定プロパティ}

要素の2つの状態間の変化を定義するためのもの。遷移前のプロパティとして設定する。順不同かつ省略可能

- delayを入れたい時はdurationの後に入れる。

- 複数のプロパティについて指定したい時はカンマ区切り

```Sass
e.g.) /* トランジション付け方一例*/
.box {
  width: 100px;
  height: 100px;
  background-color: orange;
  
  transition-property: border-radius;
  transition-duration: 1s;
}

.box:hover{
  border-radius: 50%;
}
```

```CSS
h1 {
transition: transform .3s ease-out 1s, background .5s,background .5s liner;
}
```

```Sass
e.g.)

.box {
   width: 100px;
   height: 100px;
   background-color: yellowgreen;

   transition: all 10s ease;
}
/* all 対象になるCSSプロパティを指定する。
	all を指定すると、変化する全てのプロパティへ変化が適用されますが、
	background や width などアニメーションの対象を限定することもできます。
	10s アニメーションにかかる時間
	ease 変化の仕方の指定 */
```

## `transition-property:`

トランジション効果を適用する CSS プロパティを指定

- `all`  
    すべてのプロパティに対して、transitionを適応する。トランジション効果をつけたくないものへまでついてしまう可能性があるので、なるべく明示すると良い。

## `transition-duration:`

トランジションによるアニメーションが完了するまでの所要時間を秒数またはミリ秒数で指定します。

UI的には.3sくらいが良いらしいぞ。

  

## `transition-delay:`

トランジション効果が始まるまでの待ち時間を指定  

## transition-timing-function:

トランジションの速度に緩急をつけるプロパティ

- ease デフォルト

- ease-out-小さなUI部品向け(終わりがゆっくり)

- ease-in-out-大きなUI部品向け

- ease-in(始まりがゆっくり)

- linear-等速、回転部品等向け