---
tags:
  - flutter
  - dart
  - widget
  - ios
created: 2026-01-03
status: active
---

🧶

# CLIでflutter runできない

```Shell
$ flutter run

Launching lib/main.dart on iPhone 14 in debug mode...
Running Xcode build...
 └─Compiling, linking and signing...                         3.2s
Xcode build done.                                           23.5s
Failed to build iOS app
Error output from Xcode build:
↳
    ** BUILD FAILED **


Xcode's output:
↳
    Writing result bundle at path:
    	/var/folders/rp/f0gmfk6j7gsbpkwc6px5n28h0000gn/T/flutter_tools.0nU63R/flutter_ios_build_temp_dirYaCLg2/temporary_xcresult_bundle

    cp: /Users/takahashimasanao/Dev/ZAS/zas-cityhall-square/ios/GoogleService-Info.plist and
    /Users/takahashimasanao/Dev/ZAS/zas-cityhall-square/ios//GoogleService-Info.plist are identical (not copied).
    Command PhaseScriptExecution failed with a nonzero exit code
    note: Building targets in dependency order
    warning: Run script build phase 'Create Symlinks to Header Folders' will be run during every build because it does not specify any outputs. To address this
    warning, either add output dependencies to the script phase, or configure it to run in every build by unchecking "Based on dependency analysis" in the script
    phase. (in target 'BoringSSL-GRPC' from project 'Pods')
    warning: Run script build phase 'Create Symlinks to Header Folders' will be run during every build because it does not specify any outputs. To address this
    warning, either add output dependencies to the script phase, or configure it to run in every build by unchecking "Based on dependency analysis" in the script
    phase. (in target 'abseil' from project 'Pods')
    warning: Run script build phase 'Create Symlinks to Header Folders' will be run during every build because it does not specify any outputs. To address this
    warning, either add output dependencies to the script phase, or configure it to run in every build by unchecking "Based on dependency analysis" in the script
    phase. (in target 'Libuv-gRPC' from project 'Pods')
    warning: Run script build phase 'Create Symlinks to Header Folders' will be run during every build because it does not specify any outputs. To address this
    warning, either add output dependencies to the script phase, or configure it to run in every build by unchecking "Based on dependency analysis" in the script
    phase. (in target 'gRPC-Core' from project 'Pods')
    warning: Run script build phase 'Create Symlinks to Header Folders' will be run during every build because it does not specify any outputs. To address this
    warning, either add output dependencies to the script phase, or configure it to run in every build by unchecking "Based on dependency analysis" in the script
    phase. (in target 'gRPC-C++' from project 'Pods')
    warning: Run script build phase 'Firebase 設定ファイルの選択' will be run during every build because it does not specify any outputs. To address this warning, either
    add output dependencies to the script phase, or configure it to run in every build by unchecking "Based on dependency analysis" in the script phase. (in target
    'Runner' from project 'Runner')
    note: Run script build phase 'Run Script' will be run during every build because the option to run the script phase "Based on dependency analysis" is
    unchecked. (in target 'Runner' from project 'Runner')
    note: Run script build phase 'Thin Binary' will be run during every build because the option to run the script phase "Based on dependency analysis" is
    unchecked. (in target 'Runner' from project 'Runner')
    warning: Run script build phase '[firebase_crashlytics] Crashlytics Upload Symbols' will be run during every build because it does not specify any outputs. To
    address this warning, either add output dependencies to the script phase, or configure it to run in every build by unchecking "Based on dependency analysis" in
    the script phase. (in target 'Runner' from project 'Runner')

    Result bundle written to path:
    	/var/folders/rp/f0gmfk6j7gsbpkwc6px5n28h0000gn/T/flutter_tools.0nU63R/flutter_ios_build_temp_dirYaCLg2/temporary_xcresult_bundle


Could not build the application for the simulator.
Error launching application on iPhone 14.
```

- FLAVORの環境変数をもとにして、一部ファイルをコピーするスクリプトにて、FLAVORがセットされていないことにより、同一ファイルのCPする処理と認識されて発生しているエラー

- (warningはまた別。)

(該当の箇所)

[https://github.com/ZERO-TO-ONE-TEAM/zas-cityhall-square/blob/master/ios/Runner.xcodeproj/project.pbxproj#L360](https://github.com/ZERO-TO-ONE-TEAM/zas-cityhall-square/blob/master/ios/Runner.xcodeproj/project.pbxproj#L360)

## 暫定解決

vscodeのデバッグモードだと問題ない。

→ でもビルドできないってことは、テスト環境にあげるまで挙動わからないってことかな??