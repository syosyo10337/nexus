---
tags:
  - web-performance
  - fcp
  - core-web-vitals
created: 2026-02-23
status: draft
---

## 概要

FCP (First Contentful Paint) はブラウザが最初のテキストや画像をレンダリングするまでの時間。ユーザーが「何か表示された」と感じる瞬間。目標: **< 1.8s**

## 改善手法

### レンダリングブロックリソースの排除

CSS/JS にはデフォルトでパースをブロックする性質がある。

```html
<!-- JS はデフォルトでブロッキング -->
<script src="app.js"></script>

<!-- async: ダウンロードは並行、実行は即時（順序不定）-->
<script src="analytics.js" async></script>

<!-- defer: ダウンロードは並行、実行は HTML パース完了後 -->
<script src="app.js" defer></script>
```

- `async` — 順序に依存しないスクリプト（Analytics 等）に使う
- `defer` — DOM 依存のスクリプトに使う。ほとんどの場合 defer が適切

### サーバー応答時間 (TTFB) の短縮

TTFB (Time To First Byte) が遅いと FCP も遅くなる。

- CDN でエッジキャッシュから配信し、物理的な距離を短縮
- サーバーサイドキャッシュ（Redis, Varnish 等）で動的レスポンスを高速化
- HTTP/2 or HTTP/3 を有効化してヘッダー圧縮・多重化を利用

### クリティカル CSS のインライン化

ブラウザは CSS ファイルのダウンロード完了まで描画をブロックする。ATF (Above The Fold) に必要な CSS だけを `<style>` タグでインライン展開し、残りを非同期読み込みすることでブロッキングを回避できる。

```html
<head>
  <!-- クリティカル CSS をインライン化 -->
  <style>
    /* ATF に必要なスタイルのみ */
    body { margin: 0; font-family: sans-serif; }
    .hero { height: 100vh; background: #000; }
  </style>

  <!-- 残りの CSS は非同期読み込み -->
  <link rel="preload" href="styles.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
</head>
```

### フォントの最適化

Web フォントのダウンロード中、ブラウザはテキストを非表示にする（FOIT: Flash of Invisible Text）。

```css
@font-face {
  font-family: 'MyFont';
  src: url('myfont.woff2') format('woff2');
  /* swap: フォント読み込み中はシステムフォントを表示し、読み込み後に切り替え */
  font-display: swap;
}
```

```html
<!-- フォントを preload で先読み -->
<link rel="preload" href="myfont.woff2" as="font" type="font/woff2" crossorigin>
```

## 参考

- [Lighthouse Core Web Vitals](../Lighthouse%20Core%20Web%20Vitals.md)
- [LCP 改善](lcp.md)
