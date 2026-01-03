---
tags:
  - html-css
  - css
created: 2026-01-04
status: active
---

# `@utility`

### ✅ v4での推奨アプローチ

Tailwind v4では、`@utility`ディレクティブを使ってカスタムユーティリティを追加できます [tailwindcss](https://tailwindcss.com/docs/adding-custom-styles)[Stack Overflow](https://stackoverflow.com/questions/74429397/what-is-the-purpose-of-the-tailwind-layer-directive):

```CSS
@utility content-auto {
  content-visibility: auto;
}

/* 関数的なユーティリティ */
@utility tab-* {
  tab-size: --value(--tab-size-*);
}
```