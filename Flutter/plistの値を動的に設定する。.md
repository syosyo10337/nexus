---
tags:
  - flutter
  - dart
  - widget
  - ios
created: 2026-01-03
status: active
---

# plistの値を動的に設定する。　

システムの環境変数に設定されている値は ${value}で参照できる。

```XML
	<key>REPRO_SDK_TOKEN</key>
	<string>$(REPRO_SDK_TOKEN)</string>
```

AppDeleage.swiftなどiOS appコード上で使用したい場合には別途設定が必要。

これはFlutterの設定体と限界がありそうなため、nativeアプリのコードとして設定する方が無難である。

アプリ内でplistの値を利用したいときには、

以下のようなスクリプトをXcodeで作成し、build phaseに追加すること。

PBXShellScriptBuildPhase

```undefined
#!/bin/sh

# dart-defineで渡されたAdMob IDを取得
# ローカルでadmobの挙動を確認する時には、admob管理画面からappIDを確認する
INFO_PLIST_FILE="$BUILT_PRODUCTS_DIR/$INFOPLIST_PATH"

# AdMob IDをinfo.plistに設定
/usr/libexec/PlistBuddy -c "Set :GADApplicationIdentifier $IOS_AD_APP_ID" "$INFO_PLIST_FILE"
```