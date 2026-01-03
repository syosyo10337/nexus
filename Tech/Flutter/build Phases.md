---
tags:
  - flutter
  - dart
  - widget
  - ios
created: 2026-01-03
status: active
---

# build Phases

Firebase含めて、ここの設定はすごく大事らしい。だる。

Xcodeのビルドフェーズにおいて、AdMob IDをinfo.plistに設定するシェルスクリプトは、`Copy Bundle Resources` フェーズの後に配置するのが適切です。この順序にすることで、info.plistファイルがビルド先ディレクトリにコピーされた後に、スクリプトがそのファイルを修正できるようになります。

以下は、ビルドフェーズの推奨される順序です：

1. `[CP] Check Pods Manifest.lock`

2. `[CP] Prepare Artifacts`

3. `[CP] Embed Pods Frameworks`

4. `[CP] Copy Pods Resources`

5. `Copy Bundle Resources`

6. `[CP] Embed Flutter Framework`

7. `Run Script (AdMob ID の設定)`

`Run Script` フェーズを追加するには、以下の手順に従ってください：

1. Xcodeのプロジェクトナビゲータで、プロジェクトを選択します。

1. ターゲットを選択し、`Build Phases` タブをクリックします。

2. 左上の `+` ボタンをクリックし、`New Run Script Phase` を選択します。

3. 新しく作成された `Run Script` フェーズを、`Copy Bundle Resources` フェーズの下にドラッグします。

4. `Run Script` フェーズを展開し、スクリプトを以下のように設定します：

```Shell
# dart-defineで渡されたAdMob IDを取得
ADMOB_APP_ID=$ADMOB_APP_ID

# info.plistのパスを設定
INFO_PLIST_FILE="${TARGET_BUILD_DIR}/${INFOPLIST_PATH}"

# AdMob IDをinfo.plistに設定
/usr/libexec/PlistBuddy -c "Set :GADApplicationIdentifier $ADMOB_APP_ID" "$INFO_PLIST_FILE"
```

この順序で設定することで、info.plistファイルが確実にビルド先ディレクトリにコピーされた後に、AdMob IDが設定されます。これにより、Firebaseの設定やその他のビルドプロセスとの競合を避けることができます。