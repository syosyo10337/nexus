---
tags:
  - html-css
  - html
  - css
  - layout
created: 2026-01-04
status: active
---

🚰

# colをrowでラップしてflexに

---

Bootstrapは12カラムのグリッドシステムで、5段階のレスポンシブに対応しています。(sm,md,lg等)

## 基本的な使い方

---

```HTML
<div class="container"> 
  <div class="row">
    <div class="col">
      Column
    </div>
    <div class="col">
      Column
    </div>
    <div class="col">
      Column
    </div>
  </div>
</div>
```

containerでレスポンシブにして、

rowが、col (列)のラッパーをとして働き、row以下の構造がflexになっている

## 2カラムレイアウトの作り方

---

rowクラスを持つタグの下の階層にcolを2つつける。

```HTML
<div class="container">
	<div class="row">
		<div class="col bg-primary">
			こんにちはこんにちは
		</div>
		<div class="col bg-secondary">
			こんにちはこんにちは
		</div>
	</div>
</div>
```

```HTML
3カラムレイアウトを組む場合にも、同様にして、
<div class="row">
	<div class="col"></div>
	<div class="col"></div>
	<div class="col"></div>
</div>
```

==本来はcssのフレックスボックス/gridsystemを勉強する必要がある。==

### グリッドシステムinBootstrap -

---

1行を12分配して、幅の比率を指定する方法  
col-8などとして <!--8/12の比率のカラムという意味 -->設定する。  
また、レスポンシブにも対応しているので、  
<div class="col-8 col-md-6 bg-primary"></div>  
と書くと  
<!-- mdの幅までは、8/12の割合を占め、mdの幅に来たら 6/12の比率で表示するという意味 -->

- 狭い幅(モバイルなど)の時は縦並びで、広い幅になった時に横並びにしたい時は、col-md-8などと設定する  
    <!--mdの幅になった時に8/12の割合、それまで(幅が狭い時)はただのdivなので縦並び -->

- 幅によって表示/非表示を切り替えたい時 --  
    d-none(display: noneという意味)  
    d-幅の指定-block(display: block)を使う

ex)<div class="d-none d-lg-block col-lg-2 bg-success">  
</div>  
<!-- dipslay: noneで、幅lgになった時、display: blockかつ、幅の比率は2/12で表示するという意味 -->

参考）

- ***ユーティリティ的に使えるクラス  
    [https://getbootstrap.com/docs/5.2/utilities/colors/](https://getbootstrap.com/docs/5.2/utilities/colors/)

- margin/paddingについてのユーティリティ  
      
    [https://getbootstrap.com/docs/5.2/utilities/spacing/](https://getbootstrap.com/docs/5.2/utilities/spacing/)

e.g.)

```HTML

.mt-0
<!-- m=>margin, t=>top, 0=>0px -->
.px-2 {
padding-left: ($spacer * .5) !important;
padding-right: ($spacer * .5) !important;
}
```

cf.)**.card**

.cardをつけることでもflexになる