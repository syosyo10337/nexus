---
tags:
  - web-performance
  - cls
  - core-web-vitals
created: 2026-02-23
status: draft
---

## 概要

CLS (Cumulative Layout Shift) はページ読み込み中に要素が予期せず動いた量のスコア。ボタンを押そうとしたら広告が挿入されてズレる、あの現象を定量化したもの。

スコアの計算式: `impact fraction（ズレた要素がビューポートに占める割合）× distance fraction（ズレた距離）`

目標: **< 0.1**

## 改善手法

### 画像・動画に明示的なサイズを指定する

ブラウザは `width` / `height` がない画像をダウンロードするまで領域を確保できない。ダウンロード後に突然サイズが確定してリフローが発生する。

```html
<!-- NG: サイズ指定なし → ダウンロード後にレイアウトが崩れる -->
<img src="photo.jpg" alt="Photo" />

<!-- OK: width/height を必ず指定 -->
<img src="photo.jpg" width="800" height="600" alt="Photo" />
```

CSS でレスポンシブにする場合でも `width` / `height` 属性は必要。ブラウザは属性からアスペクト比を計算し、スペースを先に確保する。

```css
/* width/height 属性があれば、これだけで正しくアスペクト比を維持できる */
img {
  width: 100%;
  height: auto;
}
```

`aspect-ratio` を使う方法もある（属性がない場合）:

```css
.hero-image {
  aspect-ratio: 4 / 3;
  width: 100%;
}
```

### Web フォントによるレイアウトシフトを防ぐ

フォント切り替え時に文字の幅・高さが変わり、テキストがズレることがある（FOUT: Flash of Unstyled Text）。

```css
@font-face {
  font-family: 'MyFont';
  src: url('myfont.woff2') format('woff2');
  /* optional: フォントが素早く読み込めない場合はシステムフォントを使い続ける（シフトなし） */
  font-display: optional;
  /* size-adjust でシステムフォントとのサイズ差を補正する方法もある */
  /* size-adjust: 90%; */
}
```

`font-display: swap` は切り替え時にシフトが発生する。CLS を重視するなら `optional` を検討する。

### 動的コンテンツ用のスペースを事前確保する

広告・バナー・非同期で差し込まれるコンテンツは挿入時にシフトを引き起こす。あらかじめ領域を確保しておく。

```css
/* 広告枠: 最小高さを指定してスペースを確保 */
.ad-slot {
  min-height: 250px;
}

/* スケルトン UI でコンテンツが入る前の領域を確保 */
.card-skeleton {
  height: 200px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
}
```

### `transform` アニメーションを使う

要素を動かすアニメーションの実装方法によって CLS にカウントされるかどうかが変わる。

```css
/* NG: top/left を変更するとレイアウトが再計算され CLS にカウントされる */
.bad-animation {
  transition: top 0.3s;
}

/* OK: transform はレイアウトに影響しないため CLS にカウントされない */
.good-animation {
  transition: transform 0.3s;
  transform: translateY(-10px);
}
```

`transform` と `opacity` は GPU で処理されるためパフォーマンスも良い。

## 参考

- [Lighthouse Core Web Vitals](../Lighthouse%20Core%20Web%20Vitals.md)
- [画像最適化](image-optimization.md)
