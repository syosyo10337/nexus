---
tags:
  - misc
created: 2026-01-04
status: active
---

# Refine

手軽に管理画面を作れる

neon DBとかと相性が良いらしい。

RefineのresourseにEntityを設定します。

```Ruby
import { Refine } from "@refinedev/core";

export const App = () => {
  return (
    <Refine
      resources={[
        {
          name: "products",
          list: "/my-products",
          show: "/my-products/:id",
          edit: "/my-products/:id/edit",
          create: "/my-products/new",
        },
      ]}
    >
      {/* ... */}
    </Refine>
  );
};
```