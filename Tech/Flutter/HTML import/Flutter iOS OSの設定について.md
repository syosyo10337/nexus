---
tags:
  - flutter
  - widget
  - ios
created: 2026-01-03
status: active
---

🧘

# Flutter iOS OSの設定について

今回の事象

特定のOSでなぜか起動できなくなっていた。

[https://zero-to-one.slack.com/archives/C01GRR698BB/p1712193935475679](https://zero-to-one.slack.com/archives/C01GRR698BB/p1712193935475679)

関連しそうなOSまわりのせっていをひとつずつ見ていく。

- AppFrameWork.plist

```JSON
 <key>MinimumOSVersion</key>
  <string>13.0</string>
```

*plistはproperty listの略称。

# iOSの設定の話。

## 最小デプロイOS

Flutter プロジェクトでh

これは、XCode(GUI)からの `Minimum Deployment Target`や

`Info.plist`の`MinimumOSVersion`で設定される値。

意味合いとしては、アプリをインストールできる最も古いOSバージョンを指定することや、最新のAPIの可用性を明らかにするなどをけっていするために使われる。

### _(推奨): Xcodeの方法は、GUIから. 変更する形で対応する。_

　Xcodeの Runner > General の "Deployment Info" セクションにある "Minimum Deployment Target" の設定は、アプリケーションがサポートする最小のiOSバージョンを指定します。

→ `project.pbxproj`が対応して変更される。

?? この設定は、`Info.plist` ファイルの `MinimumOSVersion` (現在推奨は `LSMinimumSystemVersion`)へも反映される。

*XCodeはこれに対応するように、自動で、plistの`MinimumOSVersion` (または `LSMinimumSystemVersion`) も更新するらしい。(build時かな。。？)

# platform :ios x.y.z

`platform :ios, '13.0'`:

CocoaPodsに対して、プロジェクトがサポートするiOSプラットフォームのバージョンを指定しています。

言い換えれば、プロジェクトで使用するライブラリやフレームワークのバージョンに影響します。

# `post_install`ブロックの設定

一方、Podfileの`post_install`ブロックでは、以下のように`IPHONEOS_DEPLOYMENT_TARGET`を設定しています：

```Ruby
rubyCopy codepost_install do |installer|
  installer.pods_project.targets.each do |target|
    target.build_configurations.each do |config|
      config.build_settings['IPHONEOS_DEPLOYMENT_TARGET'] = '11.0'
    end
  end
end
```

この設定は、CocoaPodsがインストールするライブラリのプロジェクトファイル（`Pods.xcodeproj`）内の`IPHONEOS_DEPLOYMENT_TARGET`を更新します。つまり、`post_install`ブロックの設定は、アプリケーションプロジェクトの`project.pbxproj`ファイルではなく、CocoaPodsが管理するライブラリのプロジェクトファイルに影響します。

アプリケーション自体の最小サポートバージョンを指定しています

1. Xcodeの"Minimum Deployment Target"

2. info.plistの"MinimumOSVersion"または"LSMinimumSystemVersion"

3. Podfileの`platform :ios, 'X.X'`

4. Podfileの`post_install`ブロックの`IPHONEOS_DEPLOYMENT_TARGET`