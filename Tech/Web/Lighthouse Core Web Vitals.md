---
tags:
  - web-performance
  - lighthouse
  - core-web-vitals
created: 2026-02-22
updated_at: 2026-02-23
status: active
---

# Lighthouse Core Web Vitals

Lighthouse が測定する主要パフォーマンス指標と、その改善手法をまとめる。

## 指標一覧

| 指標 | 意味 | 良い基準 |
| --- | --- | --- |
| FCP (First Contentful Paint) | 最初のコンテンツが見えるまで | < 1.8s |
| LCP (Largest Contentful Paint) | メインコンテンツが見えるまで | < 2.5s |
| TBT (Total Blocking Time) | メインスレッドがブロックされた合計時間 | < 200ms |
| CLS (Cumulative Layout Shift) | レイアウトのズレ量 | < 0.1 |
| INP (Interaction to Next Paint) | インタラクションへの応答速度 | < 200ms |

---

## FCP (First Contentful Paint) — 目標: < 1.8s

ブラウザが最初のテキストや画像をレンダリングするまでの時間。ユーザーが「何か表示された」と感じる瞬間。

### 改善手法

- **レンダリングブロックリソースの排除** — CSS/JS に `async` / `defer` を付与し、クリティカルパスを短くする
- **サーバー応答時間 (TTFB) の短縮** — CDN 利用、サーバーサイドキャッシュ、HTTP/2 or HTTP/3
- **クリティカル CSS のインライン化** — ATF (Above The Fold) に必要な CSS だけ `<style>` タグでインライン展開し、残りは非同期読み込み
- **フォントの最適化** — `font-display: swap` で FOIT (Flash of Invisible Text) を回避、`<link rel="preload">` でフォントを先読み

---

## LCP (Largest Contentful Paint) — 目標: < 2.5s

ビューポート内で最も大きなコンテンツ要素（ヒーロー画像、見出しブロック等）が描画完了するまでの時間。「ページが使える」と感じるタイミング。

### 改善手法

- **画像の最適化** — WebP/AVIF フォーマット、適切なサイズ (`srcset`)、`<link rel="preload">` で LCP 画像を先読み
- **遅延読み込みの適用範囲に注意** — ATF の LCP 要素には `loading="lazy"` を付けない（逆効果）
- **SSR / SSG の活用** — クライアントサイドレンダリングだと JS 実行後にしか描画されないため、サーバーサイドで HTML を返す
- **リソースの優先度ヒント** — `fetchpriority="high"` を LCP 画像に設定

---

## TBT (Total Blocking Time) — 目標: < 200ms

FCP〜TTI の間で、メインスレッドを 50ms 以上ブロックした「Long Task」の超過分の合計。例: 70ms のタスクなら 20ms が TBT に加算される。

### 改善手法

- **JS バンドルの分割** — Code Splitting + Dynamic Import で初期ロードの JS を削減
- **重い処理の分割** — `requestIdleCallback` や `setTimeout(fn, 0)` で Long Task を小さなチャンクに分割（Yield to Main Thread パターン）
- **サードパーティスクリプトの遅延** — Analytics、広告、チャットウィジェット等を `defer` や Intersection Observer で遅延読み込み
- **不要な JS の削除** — Tree Shaking の確認、未使用ポリフィルの除去

---

## CLS (Cumulative Layout Shift) — 目標: < 0.1

ページ読み込み中に要素が予期せず動いた量のスコア。ボタンを押そうとしたら広告が挿入されてズレる、あの現象。

### 改善手法

- **画像/動画に明示的なサイズ指定** — `width` / `height` 属性を必ず付与するか、CSS の `aspect-ratio` を使う
- **Web フォントによるシフト防止** — `font-display: optional` または `size-adjust` で代替フォントとのサイズ差を最小化
- **動的コンテンツ用のスペース確保** — 広告枠やスケルトン UI であらかじめ領域を確保（`min-height` 等）
- **`transform` アニメーションの利用** — `top` / `left` ではなく `transform: translate()` を使えばレイアウトシフトにカウントされない

---

## INP (Interaction to Next Paint) — 目標: < 200ms

ユーザー操作（クリック、タップ、キー入力）から、その結果が画面に反映されるまでの遅延。2024年3月に FID を置き換えた新指標。

### 改善手法

- **イベントハンドラの軽量化** — ハンドラ内で重い計算を避け、`requestAnimationFrame` や Web Worker にオフロード
- **`content-visibility: auto`** — 画面外の DOM のレンダリングコストを削減し、操作時の再描画を高速化
- **仮想スクロール** — 大量リスト (1000行超) は React Virtuoso や TanStack Virtual で DOM ノード数を制限
- **状態更新の最適化** — React なら `useMemo` / `useCallback` / `React.memo` で不要な再レンダリングを防止、`useTransition` で低優先度更新を分離

---

## 実践的な改善フロー

1. Lighthouse でボトルネック特定
2. Performance タブで Long Task / Layout Shift を可視化
3. 指標ごとの対策を実施
4. CrUX (Chrome User Experience Report) で実ユーザーデータを確認
5. 繰り返し改善

特に効果が大きいのは **画像最適化**（LCP）、**JS 分割**（TBT/INP）、**サイズ明示**（CLS）の3つで、多くのサイトではこれだけでスコアが大幅に改善する。

---

## DPR と srcSet — 画像パフォーマンスの要

### DPR (Device Pixel Ratio) とは

DPR はデバイスの物理ピクセルと CSS ピクセルの比率。`window.devicePixelRatio` で取得できる。

| デバイス例 | DPR | CSS 100px に必要な物理ピクセル |
| --- | --- | --- |
| 一般的なデスクトップ | 1x | 100px |
| Retina MacBook / iPhone | 2x | 200px |
| iPhone Pro Max / 高解像度 Android | 3x | 300px |

DPR 2x のデバイスに 1x の画像を表示するとぼやけるが、全デバイスに 3x 画像を配信すると帯域を無駄に消費する。ここで `srcset` が活きる。

### srcset によるレスポンシブ画像

`srcset` は、ブラウザがデバイスの DPR やビューポート幅に応じて最適な画像を自動選択する仕組み。

#### パターン 1: DPR ベース (x ディスクリプタ)

固定幅の画像に対して DPR ごとに異なる解像度のファイルを提供する。

```html
<img
  src="hero-400w.jpg"
  srcset="
    hero-400w.jpg 1x,
    hero-800w.jpg 2x,
    hero-1200w.jpg 3x
  "
  width="400"
  height="300"
  alt="Hero image"
/>
```

- `1x` — DPR 1 のデバイス用 (400px 幅)
- `2x` — DPR 2 のデバイス用 (800px 幅)
- `3x` — DPR 3 のデバイス用 (1200px 幅)
- ブラウザが DPR を見て自動で最適なものを選択する

#### パターン 2: ビューポート幅ベース (w ディスクリプタ + sizes)

レスポンシブレイアウトで画像の表示幅が変わる場合に使う。こちらのほうが汎用的。

```html
<img
  src="hero-800w.jpg"
  srcset="
    hero-400w.jpg   400w,
    hero-800w.jpg   800w,
    hero-1200w.jpg 1200w,
    hero-1600w.jpg 1600w
  "
  sizes="
    (max-width: 600px) 100vw,
    (max-width: 1200px) 50vw,
    800px
  "
  alt="Hero image"
/>
```

- `400w` は「この画像の実際の幅は 400px」という意味
- `sizes` はブラウザに「この画像が画面上で何 px で表示されるか」のヒントを与える
- ブラウザは `sizes` の値 × DPR で必要な画像幅を算出し、`srcset` から最適なものを選択する
- 例: DPR 2x で `sizes` が `50vw`、ビューポート 1200px → 表示幅 600px × 2 = 1200w の画像を選択

### `<picture>` でフォーマット分岐を追加

`srcset` と組み合わせて、AVIF/WebP の出し分けも行える。

```html
<picture>
  <source
    type="image/avif"
    srcset="hero-400w.avif 400w, hero-800w.avif 800w, hero-1200w.avif 1200w"
    sizes="(max-width: 600px) 100vw, 50vw"
  />
  <source
    type="image/webp"
    srcset="hero-400w.webp 400w, hero-800w.webp 800w, hero-1200w.webp 1200w"
    sizes="(max-width: 600px) 100vw, 50vw"
  />
  <img
    src="hero-800w.jpg"
    srcset="hero-400w.jpg 400w, hero-800w.jpg 800w, hero-1200w.jpg 1200w"
    sizes="(max-width: 600px) 100vw, 50vw"
    alt="Hero image"
  />
</picture>
```

ブラウザは上から順に対応するフォーマットを探し、AVIF > WebP > JPEG の優先順で配信される。

### パフォーマンスへのインパクト

| 対策 | 影響する指標 | 効果 |
| --- | --- | --- |
| `srcset` + `sizes` で適切な画像配信 | LCP, 帯域削減 | DPR 1x デバイスへの過剰配信を防止（転送量 50-75% 削減も可能） |
| AVIF/WebP + `<picture>` | LCP, 帯域削減 | JPEG 比で 30-50% のファイルサイズ削減 |
| LCP 画像に `fetchpriority="high"` | LCP | ブラウザが最優先でフェッチする |
| LCP 画像に `loading="lazy"` を付けない | LCP | lazy にすると Intersection Observer 待ちで遅延する |
| `width` / `height` を明示 | CLS | レイアウトシフトを防止 |
| `<link rel="preload">` で先読み | LCP | HTML パース前にフェッチを開始 |

### Next.js / フレームワークでの対応

多くのフレームワークは `srcset` を自動生成してくれる。

```tsx
// Next.js の Image コンポーネント
// 内部で srcset を自動生成し、DPR やビューポートに応じた画像を配信する
import Image from 'next/image';

<Image
  src="/hero.jpg"
  width={800}
  height={600}
  alt="Hero"
  priority  // LCP 画像は priority を付ける (fetchpriority="high" + preload 相当)
/>
```

フレームワークを使わない場合は、ビルドツール（sharp, imagemin 等）で複数解像度の画像を事前生成し、手動で `srcset` を記述する。
