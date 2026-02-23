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

| 指標                            | 意味                                   | 良い基準 |
| ------------------------------- | -------------------------------------- | -------- |
| FCP (First Contentful Paint)    | 最初のコンテンツが見えるまで           | < 1.8s   |
| LCP (Largest Contentful Paint)  | メインコンテンツが見えるまで           | < 2.5s   |
| TBT (Total Blocking Time)       | メインスレッドがブロックされた合計時間 | < 200ms  |
| CLS (Cumulative Layout Shift)   | レイアウトのズレ量                     | < 0.1    |
| INP (Interaction to Next Paint) | インタラクションへの応答速度           | < 200ms  |

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

### 画像・動画の「重すぎる」閾値とフォーマット別ガイド

## なぜCDNが関係するのか（前提）

まず重要な考え方として、「ファイルサイズ」と「転送サイズ」と「体感速度」は別物です。

```text
オリジンサーバーのファイルサイズ
    ↓ CDNがgzip/Brotli圧縮
転送サイズ（実際にネットワークを流れる量）
    ↓ ブラウザがデコード・レンダリング
体感速度（LCP等）
```

CDNがエッジキャッシュで配信すれば物理的な距離の問題は解決しますが、**ファイルサイズ自体が大きければCDNがあっても遅い**のは変わりません。今回のsoypoy.comはまさにそのケースです。

---

## フォーマット別・実践的な閾値の目安

### 🖼️ 静止画像

| フォーマット | 用途             | 目標サイズ | 上限の目安 | 備考                                                  |
| ------------ | ---------------- | ---------- | ---------- | ----------------------------------------------------- |
| **AVIF**     | 写真・一般画像   | ~50KB      | 150KB      | ✅ 最高圧縮率、Chrome/Firefox/Safari対応済            |
| **WebP**     | 写真・一般画像   | ~80KB      | 200KB      | ✅ 現在のデファクトスタンダード、全モダンブラウザ対応 |
| **JPEG**     | 写真             | ~100KB     | 300KB      | ⚠️ 新規採用は非推奨、レガシー対応のみ                 |
| **PNG**      | 透過が必要な画像 | ~50KB      | 150KB      | ⚠️ 写真用途は絶対NG、イラスト・ロゴ向け               |
| **SVG**      | アイコン・ロゴ   | ~5KB       | 30KB       | ✅ ベクターなのでサイズ依存しないが複雑なSVGは重い    |
| **GIF**      | アニメーション   | 非推奨     | —          | ⚠️ Video要素かWebP/AVIFアニメーションに移行           |

**soypoy.comの問題箇所：**

- `fuda_filmroll_left.png` → **1,382 KiB** （目標の約10倍、PNGで写真用途は最悪の組み合わせ）
- `HeroSecRibon.svg` → **157 KiB** （SVGとして異常に重い。中身が複雑すぎる可能性）

---

### 🎬 動画

| フォーマット         | 目標サイズ | 上限の目安 | 備考                                  |
| -------------------- | ---------- | ---------- | ------------------------------------- |
| **WebM (VP9)**       | 1MB以下    | 3MB        | ✅ ブラウザ対応◎、圧縮率高            |
| **WebM (AV1)**       | 800KB以下  | 2MB        | ✅ 最高圧縮率だがエンコードが重い     |
| **MP4 (H.264)**      | 2MB以下    | 5MB        | ✅ 互換性最高、サイズはWebMより大きい |
| **MP4 (H.265/HEVC)** | 1MB以下    | 3MB        | ⚠️ Safariのみ対応、ライセンス問題あり |

**soypoy.comの問題箇所：**

- `hero.webm` → **9,028 KiB（約9MB）** → 上限の3倍。WebMなのに重すぎる＝解像度かビットレートが高すぎる

---

## 「どこで閾値を考えるか」のフレームワーク

数字の暗記より、この考え方が重要です。

### 1. 表示サイズ × デバイスピクセル比で計算する

```text
必要な解像度 = 表示CSS幅 × デバイスピクセル比(DPR)

例: 346px表示 × DPR2 = 692px が実際に必要な解像度
   → 828pxの画像は不要（soypoy.comの実際のケース）
```

### 2. 接続回線別の転送時間で考える

| 回線                            | 実効速度  | 1MBの転送時間 |
| ------------------------------- | --------- | ------------- |
| Slow 4G（Lighthouseデフォルト） | 約1.6Mbps | 約5秒         |
| 一般的な4G                      | 約20Mbps  | 約0.4秒       |
| WiFi                            | 約50Mbps  | 約0.16秒      |

**Lighthouseは常にSlow 4G条件でテストします。** だから9MBの動画は理論上45秒以上かかることになります。LCPが72.5秒という数字はここから来ています。

### 3. Page Weight Budgetの考え方（業界標準）

```text
ページ全体の転送サイズの目安:
  モバイル: 1MB以下（理想）〜 2MB（許容）
  デスクトップ: 2MB以下（理想）〜 5MB（許容）

soypoy.com: 25,228 KiB（約25MB）→ 目標の10〜25倍
```

---

## 具体的な改善コマンド（参考）

```bash
# Squooshコマンドライン（Google製）
npx @squoosh/cli --avif '{"cqLevel":33}' input.jpg

# ffmpegで動画を圧縮
ffmpeg -i hero_original.webm \
  -vcodec libvpx-vp9 \
  -crf 35 -b:v 0 \
  -vf scale=1280:-1 \  # 1280px幅にリサイズ
  hero.webm

# Next.jsはImageコンポーネントが自動変換してくれるが
# PNG→AVIF変換は手動でやるほうが確実
```

---

## soypoy.comへの処方箋（画像・動画限定）

| ファイル                       | 現状        | 推奨対応                                  | 期待削減率                  |
| ------------------------------ | ----------- | ----------------------------------------- | --------------------------- |
| `hero.webm`                    | 9MB WebM    | 解像度下げ＋CRF調整                       | **-70〜80%** → 約1.8〜2.7MB |
| `fuda_filmroll_left/right.png` | 各1.3MB PNG | WebP/AVIF化＋表示サイズに合わせたリサイズ | **-90%以上** → 各100KB程度  |
| `HeroSecRibon.svg`             | 157KB SVG   | SVGの最適化（SVGO使用）                   | **-50〜70%** → 50KB程度     |
| `/_next/image`系               | 各80〜250KB | Next.jsのsizes propを正しく指定           | **-40〜60%**                |

これらだけで転送量は25MBから**5〜8MB程度**まで削減できる見込みです。CDNを入れるのはその後でも十分効果が出ます。 CLS (Cumulative Layout Shift) — 目標: < 0.1

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

| デバイス例                        | DPR | CSS 100px に必要な物理ピクセル |
| --------------------------------- | --- | ------------------------------ |
| 一般的なデスクトップ              | 1x  | 100px                          |
| Retina MacBook / iPhone           | 2x  | 200px                          |
| iPhone Pro Max / 高解像度 Android | 3x  | 300px                          |

DPR 2x のデバイスに 1x の画像を表示するとぼやけるが、全デバイスに 3x 画像を配信すると帯域を無駄に消費する。ここで `srcset` が活きる。

### srcset によるレスポンシブ画像

`srcset` は、ブラウザがデバイスの DPR やビューポート幅に応じて最適な画像を自動選択する仕組み。

#### パターン 1: DPR ベース (x ディスクリプタ)

固定幅の画像に対して DPR ごとに異なる解像度のファイルを提供する。

```html
<img
  src="hero-400w.jpg"
  srcset="hero-400w.jpg 1x, hero-800w.jpg 2x, hero-1200w.jpg 3x"
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

| 対策                                   | 影響する指標  | 効果                                                          |
| -------------------------------------- | ------------- | ------------------------------------------------------------- |
| `srcset` + `sizes` で適切な画像配信    | LCP, 帯域削減 | DPR 1x デバイスへの過剰配信を防止（転送量 50-75% 削減も可能） |
| AVIF/WebP + `<picture>`                | LCP, 帯域削減 | JPEG 比で 30-50% のファイルサイズ削減                         |
| LCP 画像に `fetchpriority="high"`      | LCP           | ブラウザが最優先でフェッチする                                |
| LCP 画像に `loading="lazy"` を付けない | LCP           | lazy にすると Intersection Observer 待ちで遅延する            |
| `width` / `height` を明示              | CLS           | レイアウトシフトを防止                                        |
| `<link rel="preload">` で先読み        | LCP           | HTML パース前にフェッチを開始                                 |

### Next.js / フレームワークでの対応

多くのフレームワークは `srcset` を自動生成してくれる。

```tsx
// Next.js の Image コンポーネント
// 内部で srcset を自動生成し、DPR やビューポートに応じた画像を配信する
import Image from "next/image";

<Image
  src="/hero.jpg"
  width={800}
  height={600}
  alt="Hero"
  priority // LCP 画像は priority を付ける (fetchpriority="high" + preload 相当)
/>;
```

フレームワークを使わない場合は、ビルドツール（sharp, imagemin 等）で複数解像度の画像を事前生成し、手動で `srcset` を記述する。
