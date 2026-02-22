---
tags:
  - web-performance
  - lighthouse
  - core-web-vitals
created: 2026-02-22
updated_at: 2026-02-22
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
