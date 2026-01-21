---
tags:
  - react
  - importStyle
  - tips
created: 2026-01-21
status: active
---

# importStyle

React17 以降公式が

```typescript
import * as React from "react";
```

のような NameSpace Import は明確に非推奨とし、  
代わりに、

```typescript
import { useState } from "react";
```

のように、Named Import を使用するように推奨している。
NameSpaceImportをしてもTree shakingによってパフォーマンスへの影響はほとんどない
。

## 参考

- [https://github.com/typescript-cheatsheets/react/discussions/518](https://github.com/typescript-cheatsheets/react/discussions/518)
