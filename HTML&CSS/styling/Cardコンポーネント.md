---
tags:
  - html-css
  - html
  - css
  - layout
created: 2026-01-04
status: active
---

🃏

# Cardコンポーネント

---

[基本的な使い方](#7f2d4b78-c043-47a1-811f-44f5c5e1a887)

[Sizing](#bca1012b-c696-49e1-9eb9-7680370b9761)

[グリッドレイアウトを使う場合](#d9b9db57-d8b0-4c0e-8e18-c0b16b80a214)

### 基本的な使い方

1. まず、コンテナになる構造に`.card`クラスを付与して、flexな状態にする。

2. 1つのコンポーネントには`.card-body`を付与する

- カードタイトルは `<h*>`タグに `.card-title`

- サブタイトルは、`<h*>` タグに `.card-subtitle`を適用します

- `<a>`タグに `.card-link` を適用するとリンクが追加されます  
    

```HTML
<div class="card" style="width: 18rem;">
  <div class="card-body">
    <h5 class="card-title">Card title</h5>
    <h6 class="card-subtitle mb-2 text-muted">Card subtitle</h6>
    <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
    <a href="#" class="card-link">Card link</a>
    <a href="#" class="card-link">Another link</a>
  </div>
</div>
```

## Sizing

---

カードは、特に指定されていない限り、`width`は 100% の幅を想定しています。 必要に応じて、カスタム CSS、グリッドクラス、グリッド Sass ミックスイン、ユーティリティを使って変更することができます。

### グリッドレイアウトを使う場合

columns と rows の中にカードを使ってください。

```HTML
<div class="row">
  <div class="col-sm-6">
    <div class="card">
      <div class="card-body">
        <h5 class="card-title">Special title treatment</h5>
        <p class="card-text">With supporting text below as a natural lead-in to additional content.</p>
        <a href="#" class="btn btn-primary">Go somewhere</a>
      </div>
    </div>
  </div>
  <div class="col-sm-6">
    <div class="card">
      <div class="card-body">
        <h5 class="card-title">Special title treatment</h5>
        <p class="card-text">With supporting text below as a natural lead-in to additional content.</p>
        <a href="#" class="btn btn-primary">Go somewhere</a>
      </div>
    </div>
  </div>
</div>
```

cf.)

[

Cards (カード)

This is some text within a card body. Card title Card subtitle Some quick example text to build on the card title and make up the bulk of the card's content. Some quick example text to build on the card title and make up the bulk of the card's content.

![](https://getbootstrap.jp/docs/5.0/assets/img/favicons/favicon.ico)https://getbootstrap.jp/docs/5.0/components/card/#using-grid-markup

![](HTML&CSS/styling/Attachments/bootstrap-social.png)](https://getbootstrap.jp/docs/5.0/components/card/#using-grid-markup)