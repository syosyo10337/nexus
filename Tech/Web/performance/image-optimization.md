---
tags:
  - web-performance
  - image-optimization
  - srcset
created: 2026-02-23
updated_at: 2026-02-24
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

SVG とラスター画像の選択判断は [SVG vs ラスター画像](svg-vs-raster.md) を参照。

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

## Next.js `<Image>` の仕組みと設定

### `<Image>` が自動でやること

- **フォーマット変換** — ブラウザの Accept ヘッダーを見て AVIF / WebP / 元フォーマットを自動出し分け
- **リサイズ** — `deviceSizes` に基づいて `srcset` を自動生成
- **Lazy Loading** — デフォルトで `loading="lazy"`（viewport に入るまで読み込まない）
- **CLS 防止** — `width` / `height` 必須にすることで画像スペースを事前確保

`sizes` prop を正しく指定しないとデフォルトの `100vw` が使われ、不必要に大きな画像を配信してしまう。

### Next.js 16: `priority` → `preload` への変更

Next.js 16（2025年10月〜）で `priority` は非推奨となり `preload` に置き換えられた。動作は同じ（内部で `ReactDOM.preload()` を呼び `<link rel="preload">` を挿入）だが、名前がより直感的になった。
cf. <https://nextjs.org/docs/app/api-reference/components/image#preload>

### LCP 画像の読み込み優先化

公式ドキュメントでは、大半のケースで `preload` よりも `loading="eager"` か `fetchPriority="high"` の使用を推奨している。

| prop                   | 役割                                                    | 備考                                                |
| ---------------------- | ------------------------------------------------------- | --------------------------------------------------- |
| `preload`              | `<head>` に `<link rel="preload">` を追加して最優先宣言 | `loading` / `fetchPriority` との併用不可（単独使用） |
| `loading="eager"`      | lazy loading を無効化。viewport 外でも即読み込む        | `fetchPriority` との併用可                           |
| `fetchPriority="high"` | ブラウザの fetch queue 内で優先順位を上げるヒント        | `loading` との併用可                                 |

Hero 画像の推奨パターンは `loading="eager"` + `fetchPriority="high"` の併用。`preload` は Suspense 境界外で確実に先読みしたい特殊ケース向け。

```tsx
import Image from "next/image";

// LCP 画像（Hero など above-the-fold の重要画像）— 推奨パターン
<Image
  src="/hero.webp"
  width={1920}
  height={1080}
  sizes="100vw"
  alt="Hero"
  loading="eager"
  fetchPriority="high"
  quality={85}
/>

// ATF 以外の画像（デフォルトのまま = lazy loading）
<Image
  src="/product.webp"
  width={400}
  height={300}
  sizes="(max-width: 600px) 100vw, 400px"
  alt="Product"
/>
```

### Suspense 使用時の注意

Suspense boundary の内側に `<Image>` があると、`<link rel="preload">` が HTML ストリームの末尾に出力されほぼ意味をなさない。Suspense の外側で `ReactDOM.preload()` を手動で呼ぶ必要がある。

```tsx
import { preload } from "react-dom";

export default async function Page() {
  // Suspense 境界の外側で明示的に preload
  preload("/hero.webp", { as: "image", fetchPriority: "high" });

  return (
    <Suspense fallback={<Skeleton />}>
      <HeroSection />
    </Suspense>
  );
}
```

### Hero 動画の場合

`next/image` は動画に使えないため `<video>` タグを直接使う。`fetchPriority` は video タグに効かないので `preload="auto"` で対応。

```tsx
<video autoPlay muted loop playsInline preload="auto">
  <source src="/hero.mp4" type="video/mp4" />
</video>
```

## Lighthouse と next/image の Accept ヘッダー問題

### 問題

`next/image` を使っていても Lighthouse に「next-gen フォーマットを使え」と指摘されることがある。原因は Lighthouse の User Agent が Accept ヘッダーに `image/webp` を明示的に含まない場合があるため。

```text
通常のブラウザ:   Accept: image/avif,image/webp,*/*  → WebP/AVIF が返る ✅
Lighthouse:       Accept: */*                         → PNG がそのまま返る ⚠️
```

### 対策

**素材自体を WebP に変換 + formats 明記**が最も確実。

```js
// next.config.js
module.exports = {
  images: {
    formats: ["image/avif", "image/webp"],
  },
};
```

素材を WebP にしておけば、Lighthouse でも WebP が返り、対応ブラウザにはさらに AVIF で配信される。AVIF を素材にするのは変換ツールが少なく扱いにくいため、WebP で十分。

| ケース                      | 手動 WebP 変換                         |
| --------------------------- | -------------------------------------- |
| `next/image` で普通に使う   | ✅ 推奨（Lighthouse 対策）             |
| `<video>` poster / OGP 画像 | ✅ 有効（next/image を経由しないため） |
| `unoptimized` 使用時        | ✅ 必須（変換が走らないため）          |

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

- [SVG vs ラスター画像](svg-vs-raster.md)
- [Lighthouse Core Web Vitals](../Lighthouse%20Core%20Web%20Vitals.md)
- [LCP 改善](lcp.md)
- [CLS 改善](cls.md)
