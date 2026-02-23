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

---

## 概論

### 指標一覧

| 指標                            | 意味                                   | 良い基準 |
| ------------------------------- | -------------------------------------- | -------- |
| FCP (First Contentful Paint)    | 最初のコンテンツが見えるまで           | < 1.8s   |
| LCP (Largest Contentful Paint)  | メインコンテンツが見えるまで           | < 2.5s   |
| TBT (Total Blocking Time)       | メインスレッドがブロックされた合計時間 | < 200ms  |
| CLS (Cumulative Layout Shift)   | レイアウトのズレ量                     | < 0.1    |
| INP (Interaction to Next Paint) | インタラクションへの応答速度           | < 200ms  |

### 各指標の意味

**FCP** — ブラウザが最初のテキストや画像をレンダリングするまでの時間。ユーザーが「何か表示された」と感じる瞬間。

**LCP** — ビューポート内で最も大きなコンテンツ要素（ヒーロー画像、見出しブロック等）が描画完了するまでの時間。「ページが使える」と感じるタイミング。

**TBT** — FCP〜TTI の間で、メインスレッドを 50ms 以上ブロックした「Long Task」の超過分の合計。例: 70ms のタスクなら 20ms が TBT に加算される。

**CLS** — ページ読み込み中に要素が予期せず動いた量のスコア。ボタンを押そうとしたら広告が挿入されてズレる、あの現象。

**INP** — ユーザー操作（クリック、タップ、キー入力）から、その結果が画面に反映されるまでの遅延。2024年3月に FID を置き換えた新指標。

### ファイルサイズ・転送サイズ・体感速度の関係

「ファイルサイズ」「転送サイズ」「体感速度」は別物。CDN があっても、元のファイルサイズが大きければ遅いことに変わりはない。

```text
オリジンサーバーのファイルサイズ
    ↓ CDN が gzip/Brotli 圧縮
転送サイズ（実際にネットワークを流れる量）
    ↓ ブラウザがデコード・レンダリング
体感速度（LCP 等）
```

CDN はエッジキャッシュで配信すれば物理的な距離の問題は解決するが、**ファイルサイズ自体が大きければ CDN があっても遅い**のは変わらない。

### サイズ判断のフレームワーク

数字を暗記するより、この考え方が重要。

**1. 表示サイズ × DPR で必要解像度を計算する**

```text
必要な解像度 = 表示 CSS 幅 × DPR

例: 346px 表示 × DPR 2 = 692px が実際に必要な解像度
   → 828px の画像は不要（無駄な転送）
```

**2. Slow 4G 基準で転送時間を見積もる**

Lighthouse はデフォルトで Slow 4G（1,638 Kbps ≒ 1.6 Mbps、RTT 150ms）でテストする。これは 4G 接続の下位 25% 相当。

| 回線                            | 実効速度   | 1MB の転送時間 |
| ------------------------------- | ---------- | -------------- |
| Slow 4G（Lighthouse デフォルト）| 約 1.6Mbps | 約 5 秒        |
| 一般的な 4G                     | 約 20Mbps  | 約 0.4 秒      |
| WiFi                            | 約 50Mbps  | 約 0.16 秒     |

**3. Page Weight Budget から逆算する**

| 条件         | パフォーマンス重視 | 一般的な目標 |
| ------------ | ------------------ | ------------ |
| モバイル     | ~650KB             | 1〜1.5MB     |
| デスクトップ | ~1MB               | 2〜3MB       |

HTTP Archive 2025 の中央値はモバイル 2.56MB / デスクトップ 2.86MB（画像 ~1,059KB、JS ~697KB が大半）。スコアを上げるには中央値を大幅に下回る必要がある。

### DPR (Device Pixel Ratio) とは

DPR はデバイスの物理ピクセルと CSS ピクセルの比率。`window.devicePixelRatio` で取得できる。

| デバイス例                        | DPR | CSS 100px に必要な物理ピクセル |
| --------------------------------- | --- | ------------------------------ |
| 一般的なデスクトップ              | 1x  | 100px                          |
| Retina MacBook / iPhone           | 2x  | 200px                          |
| iPhone Pro Max / 高解像度 Android | 3x  | 300px                          |

DPR 2x のデバイスに 1x の画像を表示するとぼやける。全デバイスに 3x 画像を配信すると帯域を無駄に消費する。`srcset` でデバイスに応じた画像を出し分けることで両方を解決する。

### `sizes` 属性とは何か

`srcset` と合わせて使う `sizes` は CSS ではなく、**ブラウザへの事前ヒント**。「このページではこの画像が何 px 幅で表示されるか」を伝える。

なぜ必要か — ブラウザは HTML をパースした**直後**（CSS がまだ読み込まれていない段階）に、どの画像ファイルをフェッチするか決める。このとき CSS レイアウトがわからないため、`sizes` で開発者が教えてあげる必要がある。

ブラウザの計算の仕組み:

```text
ビューポート = 1000px, DPR = 2x の場合:
  1. sizes を上から評価 → (max-width: 1200px) 50vw → 表示幅 = 500px
  2. 必要な解像度 = 500px × DPR 2 = 1000px
  3. srcset から 1000w 以上で最も小さいものを選択 → 1200w
```

よくあるミス:

- `sizes` を省略すると `100vw`（ビューポート全幅）がデフォルト。デスクトップで狭いカラムの画像を巨大サイズでフェッチしてしまう
- CSS のメディアクエリとは別物。CSS が変わっても `sizes` は自動で追従しない

### 実践的な改善フロー

1. Lighthouse でボトルネック特定
2. Performance タブで Long Task / Layout Shift を可視化
3. 指標ごとの対策を実施
4. CrUX (Chrome User Experience Report) で実ユーザーデータを確認
5. 繰り返し改善

特に効果が大きいのは **画像最適化**（LCP）、**JS 分割**（TBT/INP）、**サイズ明示**（CLS）の3つ。

---

## 具体的なチューニング tips

### FCP を改善する（目標: < 1.8s）

- **レンダリングブロックリソースの排除** — CSS/JS に `async` / `defer` を付与し、クリティカルパスを短くする
- **サーバー応答時間 (TTFB) の短縮** — CDN 利用、サーバーサイドキャッシュ、HTTP/2 or HTTP/3
- **クリティカル CSS のインライン化** — ATF (Above The Fold) に必要な CSS だけ `<style>` タグでインライン展開し、残りは非同期読み込み
- **フォントの最適化** — `font-display: swap` で FOIT (Flash of Invisible Text) を回避、`<link rel="preload">` でフォントを先読み

### LCP を改善する（目標: < 2.5s）

- **画像の最適化** — WebP/AVIF フォーマット、適切なサイズ (`srcset`)、`<link rel="preload">` で LCP 画像を先読み
- **遅延読み込みの適用範囲に注意** — ATF の LCP 要素には `loading="lazy"` を付けない（逆効果）
- **SSR / SSG の活用** — クライアントサイドレンダリングだと JS 実行後にしか描画されないため、サーバーサイドで HTML を返す
- **リソースの優先度ヒント** — `fetchpriority="high"` を LCP 画像に設定

### TBT を改善する（目標: < 200ms）

- **JS バンドルの分割** — Code Splitting + Dynamic Import で初期ロードの JS を削減
- **重い処理の分割** — `requestIdleCallback` や `setTimeout(fn, 0)` で Long Task を小さなチャンクに分割（Yield to Main Thread パターン）
- **サードパーティスクリプトの遅延** — Analytics、広告、チャットウィジェット等を `defer` や Intersection Observer で遅延読み込み
- **不要な JS の削除** — Tree Shaking の確認、未使用ポリフィルの除去

### CLS を改善する（目標: < 0.1）

- **画像/動画に明示的なサイズ指定** — `width` / `height` 属性を必ず付与するか、CSS の `aspect-ratio` を使う
- **Web フォントによるシフト防止** — `font-display: optional` または `size-adjust` で代替フォントとのサイズ差を最小化
- **動的コンテンツ用のスペース確保** — 広告枠やスケルトン UI であらかじめ領域を確保（`min-height` 等）
- **`transform` アニメーションの利用** — `top` / `left` ではなく `transform: translate()` を使えばレイアウトシフトにカウントされない

### INP を改善する（目標: < 200ms）

- **イベントハンドラの軽量化** — ハンドラ内で重い計算を避け、`requestAnimationFrame` や Web Worker にオフロード
- **`content-visibility: auto`** — 画面外の DOM のレンダリングコストを削減し、操作時の再描画を高速化
- **仮想スクロール** — 大量リスト (1000行超) は React Virtuoso や TanStack Virtual で DOM ノード数を制限
- **状態更新の最適化** — React なら `useMemo` / `useCallback` / `React.memo` で不要な再レンダリングを防止、`useTransition` で低優先度更新を分離

---

### 画像フォーマット別・サイズ閾値

| フォーマット | 用途             | 目標サイズ | 上限の目安 | 備考                                                                                                            |
| ------------ | ---------------- | ---------- | ---------- | --------------------------------------------------------------------------------------------------------------- |
| **AVIF**     | 写真・一般画像   | ~50KB      | 150KB      | 最高圧縮率。JPEG 比 **約50%削減**、WebP 比 20-30%削減。Safari 16+/Chrome 85+/Firefox 93+ 対応（93.8%カバー）  |
| **WebP**     | 写真・一般画像   | ~80KB      | 200KB      | 現在のデファクト。JPEG 比 25-34%削減。95%以上のブラウザ対応                                                    |
| **JPEG**     | 写真             | ~100KB     | 300KB      | 新規採用は非推奨。レガシーフォールバック用                                                                      |
| **PNG**      | 透過が必要な画像 | ~50KB      | 150KB      | 写真用途は絶対 NG（非圧縮に近い）。イラスト・ロゴ向け                                                          |
| **SVG**      | アイコン・ロゴ   | ~5KB       | 30KB       | ベクターなのでサイズ非依存だが、複雑な SVG は重くなる。SVGO で最適化                                           |
| **GIF**      | アニメーション   | 非推奨     | —          | `<video>` 要素か WebP/AVIF アニメーションに移行すべき                                                          |

### 動画フォーマット別・サイズ閾値

| フォーマット         | 目標サイズ | 上限の目安 | 備考                                                                              |
| -------------------- | ---------- | ---------- | --------------------------------------------------------------------------------- |
| **WebM (VP9)**       | 1MB 以下   | 3MB        | ブラウザ対応◎（Chrome/Firefox/Edge）、圧縮率高。ビットレート目安: 1080p で 2,500-5,000 kbps |
| **WebM (AV1)**       | 800KB 以下 | 2MB        | 最高圧縮率だがエンコードが非常に重い                                              |
| **MP4 (H.264)**      | 2MB 以下   | 5MB        | 全ブラウザで互換性最高。WebM よりサイズ大きめ                                    |
| **MP4 (H.265/HEVC)** | 1MB 以下   | 3MB        | Safari は対応、Chrome/Edge はハードウェア依存で部分対応。Web 用途では非標準      |

ヒーロー動画の推奨: モバイル **10MB 以下**、パフォーマンス重視なら **5MB 以下**。音声不要なら音声トラック削除で大幅削減可能。

---

### srcset の実装パターン

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

#### パターン 2: ビューポート幅ベース (w ディスクリプタ + sizes)

レスポンシブレイアウトで画像の表示幅が変わる場合。`w` ディスクリプタは「このファイルの画像幅は何 px か」という宣言で、DPR とは独立した値。

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

`sizes` の各行の意味:

```html
sizes="
  (max-width: 600px) 100vw,    ← ビューポートが ≤600px → 表示幅 = ビューポート幅 100%
  (max-width: 1200px) 50vw,    ← ビューポートが ≤1200px → 表示幅 = ビューポート幅の 50%
  800px                         ← それ以外（デスクトップ等）→ 表示幅 = 固定 800px
"
```

#### パターン 3: `<picture>` でフォーマット分岐

`srcset` と組み合わせて AVIF/WebP/JPEG の出し分けを行う。ブラウザは上から順に対応フォーマットを探し、AVIF > WebP > JPEG の優先順で選択する。

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

### 画像属性によるパフォーマンスへのインパクト

| 対策                                   | 影響する指標  | 効果                                                           |
| -------------------------------------- | ------------- | -------------------------------------------------------------- |
| `srcset` + `sizes` で適切な画像配信    | LCP, 帯域削減 | DPR 1x デバイスへの過剰配信を防止（転送量 50-75% 削減も可能） |
| AVIF/WebP + `<picture>`                | LCP, 帯域削減 | JPEG 比で約 50% のファイルサイズ削減                           |
| LCP 画像に `fetchpriority="high"`      | LCP           | ブラウザが最優先でフェッチする                                 |
| LCP 画像に `loading="lazy"` を付けない | LCP           | lazy にすると Intersection Observer 待ちで遅延する             |
| `width` / `height` を明示              | CLS           | レイアウトシフトを防止                                         |
| `<link rel="preload">` で先読み        | LCP           | HTML パース前にフェッチを開始                                  |

### フレームワークでの対応

Next.js の `<Image>` コンポーネントは内部で `srcset` を自動生成し、DPR やビューポートに応じた画像を配信する。

```tsx
import Image from "next/image";

<Image
  src="/hero.jpg"
  width={800}
  height={600}
  sizes="(max-width: 600px) 100vw, 50vw"
  alt="Hero"
  priority // LCP 画像は priority を付ける (fetchpriority="high" + preload 相当)
/>
```

`sizes` prop を正しく指定しないと、Next.js はデフォルトの `100vw` を使い、不必要に大きな画像を配信してしまう。

フレームワークを使わない場合は、sharp や imagemin で複数解像度の画像を事前生成し、手動で `srcset` を記述する。

### 圧縮ツール・コマンド

```bash
# AVIF 変換（Squoosh CLI / Google 製）
npx @squoosh/cli --avif '{"cqLevel":33}' input.jpg

# sharp-cli で WebP 変換 + リサイズ
npx sharp-cli -i input.png -o output.webp --width 800

# ffmpeg で動画を圧縮（VP9, 1280px 幅にリサイズ、音声トラック除去）
ffmpeg -i hero_original.webm \
  -vcodec libvpx-vp9 \
  -crf 35 -b:v 0 \
  -vf scale=1280:-1 \
  -an \
  hero.webm

# SVG 最適化
npx svgo input.svg -o output.svg
```
