---
tags:
  - flutter
  - widget
  - ios
created: 2026-01-03
status: active
---

# [!] CocoaPods could not find compatible versions for pod "FirebaseFirestore":

ビルド高速化のために、podファイルで、明示的に取得していた箇所を変更する。

[https://stackoverflow.com/questions/77527511/cocoapods-could-not-find-compatible-versions-for-pod-firebasefirestore-on-late](https://stackoverflow.com/questions/77527511/cocoapods-could-not-find-compatible-versions-for-pod-firebasefirestore-on-late)

### エラー文

```Ruby
[!] CocoaPods could not find compatible versions for pod "FirebaseFirestore":
  In Podfile:
    FirebaseFirestore (from `https://github.com/invertase/firestore-ios-sdk-frameworks.git`, tag `10.18.0`)

    cloud_firestore (from `.symlinks/plugins/cloud_firestore/ios`) was resolved to 4.17.2, which depends on
      Firebase/Firestore (= 10.24.0) was resolved to 10.24.0, which depends on
        FirebaseFirestore (~> 10.24.0)
```

### 該当の変更箇所

```Ruby
target 'Runner' do
  use_frameworks!
  use_modular_headers!
  pod 'AnyManagerSDK', :podspec => './AnyManagerSDK_v3.3.1.podspec'
  pod 'AnyManagerLine',  :podspec => './AnyManagerLine.podspec'
  ## ここを編集する。
  pod 'FirebaseFirestore', :git => 'https://github.com/invertase/firestore-ios-sdk-frameworks.git', :tag => '10.24.0'

  flutter_install_all_ios_pods File.dirname(File.realpath(__FILE__))
end

post_install do |installer|
  installer.pods_project.targets.each do |target|
    flutter_additional_ios_build_settings(target)
    target.build_configurations.each do |config|
      # ビルドターゲットのiOSターゲットから設定削除して、「platform :ios」 で設定してるデフォルトターゲット使うように
      config.build_settings.delete 'IPHONEOS_DEPLOYMENT_TARGET'
    end
  end
end
```