---
tags:
  - web-performance
  - lcp
  - core-web-vitals
created: 2026-02-23
status: draft
---

## 概要

LCP (Largest Contentful Paint) はビューポート内で最も大きなコンテンツ要素（ヒーロー画像、見出しブロック等）が描画完了するまでの時間。「ページが使える」と感じるタイミング。目標: **< 2.5s**

LCP の対象要素: `<img>`, `<video>` のポスター画像、`background-image` を持つ要素、ブロックレベルのテキスト。

## 改善手法

### LCP 画像を早期フェッチする

LCP 要素が画像の場合、ブラウザが発見するタイミングが遅いと致命的。`<link rel="preload">` と `fetchpriority` を組み合わせる。

```html
<head>
  <!-- LCP 画像を最優先でプリロード -->
  <link
    rel="preload"
    as="image"
    href="hero.avif"
    imagesrcset="hero-400w.avif 400w, hero-800w.avif 800w, hero-1200w.avif 1200w"
    imagesizes="(max-width: 600px) 100vw, 50vw"
  />
</head>

<img
  src="hero.avif"
  srcset="hero-400w.avif 400w, hero-800w.avif 800w, hero-1200w.avif 1200w"
  sizes="(max-width: 600px) 100vw, 50vw"
  fetchpriority="high"
  alt="Hero"
/>
```

### lazy loading を LCP 要素に付けない

`loading="lazy"` は Intersection Observer で要素がビューポートに入ってからフェッチを開始する。ATF の LCP 要素に付けると逆効果。

```html
<!-- NG: LCP 画像に lazy を付けると遅延する -->
<img src="hero.jpg" loading="lazy" alt="Hero" />

<!-- OK: ATF 画像は lazy を付けない（デフォルトで eager） -->
<img src="hero.jpg" alt="Hero" />

<!-- OK: スクロール後に見える画像は lazy -->
<img src="product.jpg" loading="lazy" alt="Product" />
```

### 画像フォーマットの最適化

LCP 要素が画像の場合、フォーマットとサイズを最適化するだけで大幅に改善する。

- AVIF: JPEG 比 **約50%** ファイルサイズ削減
- WebP: JPEG 比 25-34% 削減
- `srcset` で DPR に応じた解像度を配信

詳細は [image-optimization.md](image-optimization.md) を参照。

### SSR / SSG の活用

クライアントサイドレンダリング (CSR) の場合、JS が実行されるまで LCP 要素が DOM に存在しない。サーバーサイドで HTML を返すと LCP が大幅に改善する。

```
CSR:
  HTML 受信 → JS ダウンロード → JS 実行 → LCP 要素が DOM に追加 → 描画

SSR/SSG:
  HTML 受信（LCP 要素が既に含まれる）→ 描画
```

Next.js では `getServerSideProps` (SSR) や静的生成 (SSG/ISR) を使う。

## 参考

- [Lighthouse Core Web Vitals](../Lighthouse%20Core%20Web%20Vitals.md)
- [画像最適化](image-optimization.md)
- [FCP 改善](fcp.md)
