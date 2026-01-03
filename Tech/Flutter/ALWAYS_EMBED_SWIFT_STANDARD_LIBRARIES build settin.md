---
tags:
  - flutter
  - dart
  - widget
  - ios
created: 2026-01-03
status: active
---

🔴

# `ALWAYS_EMBED_SWIFT_STANDARD_LIBRARIES` build setting defined in `Pods/Target Support Files/Pods-Runner/Pods-` (1)

```Dart
ALWAYS_EMBED_SWIFT_STANDARD_LIBRARIES build setting defined in Pods/Target Support Files/Pods-Runner/Pods-
```

## 解決方法

Targetのbuild setting > **ALWAYS_EMBED_SWIFT_STANDARD_LIBRARIES**

の値を`**$(inherited)`にする。**