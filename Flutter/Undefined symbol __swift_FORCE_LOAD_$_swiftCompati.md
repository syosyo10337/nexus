---
tags:
  - flutter
  - ios
created: 2026-01-03
status: draft
---

# `Undefined symbol: __swift_FORCE_LOAD_$_swiftCompatibility56` (1)

どうやら、XCode.14.2だとビルドが通らないらしい。

https://github.com/CocoaPods/CocoaPods/issues/11960

## 解決

XCode14.3にcodemagic.yamlを書き換えて解決。