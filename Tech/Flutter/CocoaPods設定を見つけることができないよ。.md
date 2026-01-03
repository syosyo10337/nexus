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

# CocoaPods設定を見つけることができないよ。

プロジェクトでCocoaPodsを使用している場合は、プロジェクトの設定にCocoaPods設定を含める必要があるよ。

```Dart
CocoaPods did not set the base configuration of your project because your project already has a custom config set. In order for CocoaPods integration to work at all, please either set the base configurations of the target `Runner` to `Target Support Files/Pods-Runner/Pods-Runner.profile.xcconfig` or include the `Target Support Files/Pods-Runner/Pods-Runner.profile.xcconfig` in your build configuration (`Flutter/Release.xcconfig`).
```

`ios/Flutter/Release.xconfig`に以下の１行を追加する

`#include "Target Support Files/Pods-Runner/Pods-Runner.profile.xcconfig"`

```Dart
#include? "Pods/Target Support Files/Pods-Runner/Pods-Runner.release.xcconfig"
#include "Generated.xcconfig"
#include "DartDefines.xcconfig"
#include "Target Support Files/Pods-Runner/Pods-Runner.profile.xcconfig"
```