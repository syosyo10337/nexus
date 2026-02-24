---
tags:
  - next-js
  - font
  - performance
created: 2026-02-24
status: draft
---

## 概要

Next.js の `next/font/google` で Google Fonts を読み込む際、可変フォント（variable font）かどうかで `weight` の指定方法が変わる。可変フォントに配列で weight を指定すると、不要な `@font-face` が生成されパフォーマンスに悪影響を与える可能性がある。

## 可変フォント vs 静的フォント

| 種類 | 特徴 | weight 指定 |
|---|---|---|
| 可変フォント | 1ファイルに全ウェイトを連続的に含む。中間値（例: 450）も使える | 省略すべき |
| 静的フォント | ウェイトごとに別ファイル | 必須（使用する weight を指定） |

## Next.js での正しい指定方法

```typescript
// 可変フォント → weight 省略
import { Noto_Sans_JP } from "next/font/google";
const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  display: "swap",
  // weight は指定しない
});

// 静的フォント → weight 必須
import { Shippori_Mincho } from "next/font/google";
const shipporiMincho = Shippori_Mincho({
  weight: "700",
  subsets: ["latin"],
  display: "swap",
});
```

Next.js 公式ドキュメントより:

> "If loading a variable font, you don't need to specify the font weight"

配列形式 `weight: ['100','400','900']` は非可変フォント向けと明記されている。

## よくある間違い

可変フォントに対して離散的な weight 配列を指定するケース:

```typescript
// NG: 可変フォントに配列指定
const notoSansJP = Noto_Sans_JP({
  weight: ["400", "500", "600", "700"], // 不要
  subsets: ["latin"],
});
```

これにより個別の `@font-face` が生成され、CSS サイズが増大する可能性がある。

## 可変フォントかどうかの確認方法

- [Google Fonts](https://fonts.google.com/) のフォントページで "Variable" バッジがあるか
- [Fontsource](https://fontsource.org/) で "Variable Axes" セクションがあるか
- GitHub のフォントリポジトリで軸情報（wght, wdth, opsz など）を確認

## 代表的なフォントの分類例

| フォント | 可変？ | 軸 |
|---|---|---|
| Noto Sans JP | 可変 | wght 100-900 |
| Bricolage Grotesque | 可変 | wght, wdth, opsz |
| Inter | 可変 | wght, opsz |
| Shippori Mincho | 静的 | 固定 (400, 500, 600, 700, 800) |
| Zen Old Mincho | 静的 | 固定 |

## 参考

- [Next.js Font API Reference](https://nextjs.org/docs/app/api-reference/components/font)
- [Next.js Font Optimization](https://nextjs.org/docs/app/building-your-application/optimizing/fonts)
- [Fontsource - Noto Sans JP](https://fontsource.org/fonts/noto-sans-jp)
