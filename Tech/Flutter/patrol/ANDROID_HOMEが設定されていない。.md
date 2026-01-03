---
tags:
  - flutter
  - testing
  - android
created: 2026-01-03
status: active
---

# ANDROID_HOMEが設定されていない。

[

Setting ANDROID_HOME enviromental variable on Mac OS X

Could anybody post a working solution for setting ANDROID_HOME via the terminal? My path to the Android-SDK is /Applications/ADT/sdk.

![](Flutter/patrol/Attachments/apple-touch-icon.png)https://stackoverflow.com/questions/19986214/setting-android-home-enviromental-variable-on-mac-os-x

![](Flutter/patrol/Attachments/apple-touch-icon@2.png)](https://stackoverflow.com/questions/19986214/setting-android-home-enviromental-variable-on-mac-os-x)

今回は　Android Studioを入れたときにつかったので。

1. `/Users/{YOUR_USER_NAME}/Library/Android/sdk`

```Ruby
export ANDROID_HOME={YOUR_PATH}
export PATH=$PATH:$ANDROID_HOME/tools:$ANDROID_HOME/platform-tools
```