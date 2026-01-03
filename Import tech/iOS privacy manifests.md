---
tags:
  - misc
  - api
created: 2026-01-04
status: active
---

# iOS privacy manifests

[https://developer.apple.com/documentation/bundleresources/privacy_manifest_files](https://developer.apple.com/documentation/bundleresources/privacy_manifest_files)

雑な和訳:

`PrivacyInfo.xcprivacy`追加することができます。このファイルには以下の情報を明示します。

アプリやthird-partySDK

- によって収集(collect)されるデータをの種類

- が必要とするAPIの使用理由。

[

アプリのプライバシーに関する詳細情報 - App Store - Apple Developer

App Storeのプロダクトページで表示されるアプリのプライバシー方針の詳細情報を、App Store Connectに提供する方法をご確認ください。

![](https://developer.apple.com/favicon.ico)https://developer.apple.com/jp/app-store/app-privacy-details/#data-type-usage



](https://developer.apple.com/jp/app-store/app-privacy-details/#data-type-usage)

もし、[ここ](https://developer.apple.com/support/third-party-SDK-requirements/)に記載されているthird-party SDKにprivacy manifestファイルがはいってなければ、追加してあげる必要があるらしい。

[https://developer.apple.com/videos/play/wwdc2023/10060/](https://developer.apple.com/videos/play/wwdc2023/10060/)

必要な対応、

- PrivacyInfo.xcprivacyファイルの作成と、項目の設定。

- 外部ライブラリのアップデート(privacyInfoファイルが追加されたversion)に対応すること

参考記事

- [https://zenn.dev/ueshun/articles/bbbfd49cc7e9bf#fn-3a2e-1](https://zenn.dev/ueshun/articles/bbbfd49cc7e9bf#fn-3a2e-1)

- [https://creators-note.chatwork.com/entry/2024/02/26/175346](https://creators-note.chatwork.com/entry/2024/02/26/175346)

- [https://techblog.openwork.co.jp/entry/ios-privacymanifest](https://techblog.openwork.co.jp/entry/ios-privacymanifest)

# Required reason API

バグで、独自にせっていすることを求められているっぽい。

[https://github.com/flutter/flutter/issues/145269](https://github.com/flutter/flutter/issues/145269)