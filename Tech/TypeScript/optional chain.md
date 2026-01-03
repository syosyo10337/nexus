---
tags:
  - typescript
  - syntax
  - data-structure
created: 2026-01-03
status: active
---

# optional chain

[https://typescriptbook.jp/reference/values-types-variables/object/optional-chaining#%E9%96%A2%E6%95%B0%E5%91%BC%E3%81%B3%E5%87%BA%E3%81%97](https://typescriptbook.jp/reference/values-types-variables/object/optional-chaining#%E9%96%A2%E6%95%B0%E5%91%BC%E3%81%B3%E5%87%BA%E3%81%97)

```TypeScript
const increment = (n) => n + 1;
const result = increment?.(1);
console.log(result);
```