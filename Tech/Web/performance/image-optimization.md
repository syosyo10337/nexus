---
tags:
  - web-performance
  - image-optimization
  - srcset
created: 2026-02-23
status: draft
---

## 概要

画像・動画はページ転送量の最大の要因。フォーマット選択・サイズ最適化・srcset による適切な配信の3つが主な改善軸。DPR と sizes の概念は [Lighthouse Core Web Vitals](../Lighthouse%20Core%20Web%20Vitals.md) の概論を参照。

## 静止画像のフォーマット別サイズ閾値

| フォーマット | 用途             | 目標サイズ | 上限の目安 | 備考                                                                                                         |
| ------------ | ---------------- | ---------- | ---------- | ------------------------------------------------------------------------------------------------------------ |
| **AVIF**     | 写真・一般画像   | ~50KB      | 150KB      | 最高圧縮率。JPEG 比 **約50%削減**、WebP 比 20-30%削減。Safari 16+/Chrome 85+/Firefox 93+ 対応（93.8%カバー） |
| **WebP**     | 写真・一般画像   | ~80KB      | 200KB      | 現在のデファクト。JPEG 比 25-34%削減。95%以上のブラウザ対応                                                  |
| **JPEG**     | 写真             | ~100KB     | 300KB      | 新規採用は非推奨。レガシーフォールバック用                                                                   |
| **PNG**      | 透過が必要な画像 | ~50KB      | 150KB      | 写真用途は絶対 NG（非圧縮に近い）。イラスト・ロゴ向け                                                        |
| **SVG**      | アイコン・ロゴ   | ~5KB       | 30KB       | ベクターなのでサイズ非依存だが、複雑な SVG は重くなる。SVGO で最適化                                         |
| **GIF**      | アニメーション   | 非推奨     | —          | `<video>` 要素か WebP/AVIF アニメーションに移行すべき                                                        |

## SVG vs ラスター画像の選択判断

### 判断フロー

```text
コンテンツが写真・グラデーション豊富？
  YES → ラスター（AVIF/WebP）一択

フラットカラー・線画・アイコン・ロゴ・図？
  YES → SVG 候補
        ↓
        Figma/Illustrator から書き出した場合は SVGO を通す
        ↓
        SVGO 後のサイズは？
          < 5KB  → SVG 一択
          5-30KB → SVG で OK
          > 30KB → パス数・ノード数を確認
                   多い（写真トレース・超複雑イラスト）→ ラスター化
                   少ない（属性の冗長性が原因）      → SVGO の追加オプションで削減を試みる
          > 50KB → ほぼ確実にラスター化すべき
```

### 判断軸の一覧

| 観点                 | SVG が有利                               | ラスター（AVIF/WebP）が有利              |
| -------------------- | ---------------------------------------- | ---------------------------------------- |
| コンテンツの性質     | フラットカラー、線画、ロゴ、アイコン     | 写真、グラデーション豊富、複雑な陰影     |
| 表示サイズの変動     | ファビコン〜大バナーで同一素材を使う     | 特定サイズ固定で使う                     |
| SVGO 後サイズ        | < 30KB                                   | > 30KB（ノード数が多い）                 |
| CSS theming          | CSS でカラー変更・テーマ切替を制御したい | なし                                     |
| アニメーション       | CSS/JS でホバーアニメ等を付けたい        | なし                                     |
| ブラウザ描画コスト   | シンプルなパスのみ                       | 複雑な SVG はレンダラーが重くなる        |
| キャッシュ効率       | スプライトで大量アイコンを一括キャッシュ | 個別ファイルのキャッシュ                 |

### SVG を選ぶ場合のさらなる観点

`<img>` vs インライン SVG vs スプライト:

| 方法                               | メリット                                      | デメリット                         |
| ---------------------------------- | --------------------------------------------- | ---------------------------------- |
| `<img src="icon.svg">`             | キャッシュ可能、HTML がシンプル               | CSS から色・スタイルを変更できない |
| インライン `<svg>...</svg>`        | CSS で `currentColor` 等を使って styling 可能 | HTML が増える、キャッシュされない  |
| スプライト `<use href="s.svg#id">` | キャッシュ可能かつ再利用可能                  | IE は非対応（現在は問題なし）      |

- ダークモード対応・ブランドカラー変更 → インライン SVG か スプライト
- 単純な静的アイコン → `<img>` で十分

#### SVGO でできる最適化の例

```bash
# 基本実行（デフォルト設定）
npx svgo input.svg -o output.svg

# 詳細な設定で圧縮率を上げる
npx svgo input.svg --config='{
  "plugins": [
    "removeDoctype",
    "removeComments",
    "removeMetadata",
    "removeEditorsNSData",
    "cleanupIds",
    "mergePaths"
  ]
}' -o output.svg
```

Figma / Illustrator からの書き出し SVG には非表示レイヤー、エディタ固有メタデータ、冗長な `transform` が含まれることが多く、SVGO を通すだけで 30-70% 削減できることがある。それでも 30KB を超えるなら、SVG の構造自体が複雑すぎる（パス数が多い）ため、ラスター化を検討する。

## 動画のフォーマット別サイズ閾値

| フォーマット         | 目標サイズ | 上限の目安 | 備考                                                                             |
| -------------------- | ---------- | ---------- | -------------------------------------------------------------------------------- |
| **WebM (VP9)**       | 1MB 以下   | 3MB        | ブラウザ対応◎（Chrome/Firefox/Edge）、圧縮率高。1080p で 2,500-5,000 kbps が目安 |
| **WebM (AV1)**       | 800KB 以下 | 2MB        | 最高圧縮率だがエンコードが非常に重い                                             |
| **MP4 (H.264)**      | 2MB 以下   | 5MB        | 全ブラウザで互換性最高。WebM よりサイズ大きめ                                    |
| **MP4 (H.265/HEVC)** | 1MB 以下   | 3MB        | Safari は対応、Chrome/Edge はハードウェア依存で部分対応。Web 用途では非標準      |

ヒーロー動画の推奨: モバイル **10MB 以下**、パフォーマンス重視なら **5MB 以下**。音声不要なら `-an` で音声トラックを削除すると大幅削減できる。

## srcset の実装パターン

### パターン 1: DPR ベース (x ディスクリプタ)

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

- `1x` — DPR 1 のデバイス用（一般的なデスクトップ）
- `2x` — DPR 2 のデバイス用（Retina MacBook / iPhone）
- `3x` — DPR 3 のデバイス用（iPhone Pro Max / 高解像度 Android）

### パターン 2: ビューポート幅ベース (w ディスクリプタ + sizes)

レスポンシブレイアウトで画像の表示幅が変わる場合。より汎用的。

`w` ディスクリプタは「このファイルの画像幅は何 px か」という宣言で、DPR とは独立した値。

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

### パターン 3: `<picture>` でフォーマット分岐

ブラウザは上から順に対応フォーマットを探し、AVIF > WebP > JPEG の優先順で選択する。

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

## 画像属性によるパフォーマンスへのインパクト

| 対策                                   | 影響する指標  | 効果                                                          |
| -------------------------------------- | ------------- | ------------------------------------------------------------- |
| `srcset` + `sizes` で適切な画像配信    | LCP, 帯域削減 | DPR 1x デバイスへの過剰配信を防止（転送量 50-75% 削減も可能） |
| AVIF/WebP + `<picture>`                | LCP, 帯域削減 | JPEG 比で約50% のファイルサイズ削減                           |
| LCP 画像に `fetchpriority="high"`      | LCP           | ブラウザが最優先でフェッチする                                |
| LCP 画像に `loading="lazy"` を付けない | LCP           | lazy にすると Intersection Observer 待ちで遅延する            |
| `width` / `height` を明示              | CLS           | レイアウトシフトを防止                                        |
| `<link rel="preload">` で先読み        | LCP           | HTML パース前にフェッチを開始                                 |

## Next.js での対応

`<Image>` コンポーネントは `srcset` を自動生成する。`sizes` prop を正しく指定しないとデフォルトの `100vw` が使われ、不必要に大きな画像を配信してしまう。

```tsx
import Image from "next/image";

// LCP 画像
<Image
  src="/hero.jpg"
  width={800}
  height={600}
  sizes="(max-width: 600px) 100vw, 50vw"
  alt="Hero"
  priority // fetchpriority="high" + preload 相当
/>

// ATF 以外の画像
<Image
  src="/product.jpg"
  width={400}
  height={300}
  sizes="(max-width: 600px) 100vw, 400px"
  alt="Product"
  // loading="lazy" がデフォルト（priority なしの場合）
/>
```

## 圧縮ツール・コマンド

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

## 参考

- [Lighthouse Core Web Vitals](../Lighthouse%20Core%20Web%20Vitals.md)
- [LCP 改善](lcp.md)
- [CLS 改善](cls.md)
