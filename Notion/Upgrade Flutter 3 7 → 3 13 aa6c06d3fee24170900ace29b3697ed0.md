 

# Upgrade Flutter 3.7 → 3.13

[Intl](#77d27e91-502e-4843-933a-935d4c767bb2)

[Flutter_Form_builder](#99cd4f53-a517-43a9-af1a-869fda384c07)

[[9.0.0]](#9e269e4b-3601-4639-a5fc-5d168cadb3bc)

[BREAKING CHANGES](#7e52aac2-6d94-4fd3-a2b2-6715d5dfeebf)

[form_builder_validators](#4f5694aa-3c1a-47b5-bfee-bf7f36e794d5)

[Flutter本体の話](#76fff635-0898-463c-9821-263b99ac12c9)

[ビルド時のエラー](#ce4b46ca-ce4c-4cc5-bf23-0172f1edf55a)

[asset_manifest重複](#7ce9bd52-1e7c-43fe-a985-4e07cd0a1dc7)

[症状](#71d78d61-e601-4876-ad57-9a489180d550)

[対処](#a89bbc43-2c0c-4848-bcc9-215737d16a11)

[form_builder 9.2は Flutter 3.16が必要](#26c0116e-906c-4e30-b706-dbe212abfc3f)

[症状](#557f8c3f-1b40-4e94-a213-88df3ae512fc)

[対処](#ceba8656-1688-4d70-a1ee-d8f52c246ae1)

[FallThroughError();がない](#1768749a-0274-4c9a-95e5-7823569dd330)

[症状](#e91311c7-7f82-463e-98cd-ba2cf73afb86)

[対処](#22ef99d1-2bb1-4c51-ac6b-a023bab7dfcf)

[Firebase_coreを含めたライブラリがDart3対応のためにmajor update必要](#06e1004c-6e6f-45a7-ba5f-3468bf21c374)

[minSdkVersionの指定](#97d58b15-2f74-44ab-9a18-8374a77443aa)

[Further Things to think about](#08b2e2f2-7428-4203-afce-17bcb1789bee)

# Intl

- Because zas_cityhall_square depends on flutter_localizations from sdk which depends on intl 0.18.1, intl 0.18.1 is required.  
    So, because zas_cityhall_square depends on intl ^0.17.0, version solving failed.

# Flutter_Form_builder

[https://pub.dev/packages/flutter_form_builder/changelog](https://pub.dev/packages/flutter_form_builder/changelog)

- Because flutter_form_builder >=7.0.0-beta.0 <9.0.0-dev.2 depends on intl ^0.17.0 and zas_cityhall_square depends on intl ^0.18.0, flutter_form_builder >=7.0.0-beta.0 <9.0.0-dev.2 is forbidden.  
    So, because zas_cityhall_square depends on flutter_form_builder ^7.7.0, version solving failed.

## [9.0.0]

### BREAKING CHANGES

- 👁️[Improve autovalidateMode](https://github.com/flutter-form-builder-ecosystem/flutter_form_builder/pull/1232)
    
    - On FormBuilderField, `autovalidateMode` change default from `AutovalidateMode.onUserInteraction` to `AutovalidateMode.disabled`
    

_import 'package:flutter_form_builder/flutter_form_builder.dart'; で検索する。_

- (利用なし)[Refactor FormBuilderField](https://github.com/flutter-form-builder-ecosystem/flutter_form_builder/pull/1238)
    
    - Add widget to remove decoration property from core. Now exist two field widgets:
        
        1. `FormBuilderField`: Refactored. Now don't included decoration property or references to this property
        
        2. `FormBuilderFieldDecoration`: New. Like the old `FormBuilderField`
        
    

- (利用なし)[Remove FormBuilderCupertinoSegmentedControl](https://github.com/flutter-form-builder-ecosystem/flutter_form_builder/pull/1240)
    
    - Remove `FormBuilderCupertinoSegmentedControl` field. Included on [form_builder_cupertino_fields](https://pub.dev/packages/form_builder_cupertino_fields)
    
    - Update custom fields example without cupertino widgets
    
    - Remove cupertino icons dependency
    

- Update intl version to 0.18.0

- Update constraints to Flutter 3.10

- Update constraints to Dart 3

# form_builder_validators

[https://pub.dev/packages/form_builder_validators/changelog#900](https://pub.dev/packages/form_builder_validators/changelog#900)

dart/flutterのアップデートへの対応

# Flutter本体の話

[https://docs.flutter.dev/release/release-notes/release-notes-3.10.0](https://docs.flutter.dev/release/release-notes/release-notes-3.10.0)

# ビルド時のエラー

---

## asset_manifest重複

### 症状

```Dart
../../../.pub-cache/hosted/pub.dev/google_fonts-3.0.1/lib/src/google_fonts_base.dart:14:1: Error: 'AssetManifest' is imported from both 'package:flutter/src/services/asset_manifest.dart' and 'package:google_fonts/src/asset_manifest.dart'.
import 'asset_manifest.dart';
^^^^^^^^^^^^
```

### 対処

google_font 4.0.xに変更

## form_builder 9.2は Flutter 3.16が必要

### 症状

```Dart
../../../.pub-cache/hosted/pub.dev/flutter_form_builder-9.2.0/lib/src/form_builder.dart:344:7: Error: No named parameter with the name 'onPopInvoked'.
      onPopInvoked: widget.onPopInvoked,
```

### 対処

https://github.com/flutter-form-builder-ecosystem/flutter_form_builder/issues/1359

pubspec.yamlの記述を変更

## FallThroughError();がない

### 症状

```Dart
../../../.pub-cache/hosted/pub.dev/cloud_firestore_platform_interface-5.7.7/lib/src/platform_interface/utils/load_bundle_task_state.dart:13:13: Error: Method not found: 'FallThroughError'.
      throw FallThroughError();
```

### 対処

Dart3になって、FallThroughError()は無くなってしまったので

該当のlibraryをDart3 compitbaleまであげる。

[

cloud_firestore changelog | Flutter package

Flutter plugin for Cloud Firestore, a cloud-hosted, noSQL database with live synchronization and offline support on Android and iOS.

![](https://pub.dev/static/hash-bjrdsrlb/img/flutter-logo-32x32.png)https://pub.dev/packages/cloud_firestore/changelog#460

![](Notion/Attachments/pub-dev-icon-cover-image%201.png)](https://pub.dev/packages/cloud_firestore/changelog#460)

## Firebase_coreを含めたライブラリがDart3対応のためにmajor update必要

firebase系のpackageをDart ３対応にする。

firebase_core: ^2.11.0  
[https://pub.dev/packages/firebase_dynamic_links/changelog](https://pub.dev/packages/firebase_dynamic_links/changelog)  
Note: This release has breaking changes.

BREAKING FEAT: Firebase iOS SDK version: 10.0.0 (#9708). (9627c56a)  
[https://pub.dev/packages/firebase_dynamic_links/changelog#520](https://pub.dev/packages/firebase_dynamic_links/changelog#520)

firebase_analytics  
[https://pub.dev/packages/firebase_analytics/changelog#1030](https://pub.dev/packages/firebase_analytics/changelog#1030)

messaging  
[https://pub.dev/packages/firebase_messaging/changelog#1450](https://pub.dev/packages/firebase_messaging/changelog#1450)

crashltys  
[https://pub.dev/packages/firebase_crashlytics/changelog](https://pub.dev/packages/firebase_crashlytics/changelog)

flutter build apk

# minSdkVersionの指定

# Further Things to think about

---

- pull down の問題解消されている。

[https://github.com/ZERO-TO-ONE-TEAM/zas-cityhall-square/blob/8c68747fd8eebae4d3e53e0f5753d052ea4e381e/lib/pages/owned_vehicle/edit.dart#L539-L541](https://github.com/ZERO-TO-ONE-TEAM/zas-cityhall-square/blob/8c68747fd8eebae4d3e53e0f5753d052ea4e381e/lib/pages/owned_vehicle/edit.dart#L539-L541)

- FormBuilderTextFieldのautovalidateModeのdeafult値が変わったので対応する。

- `FixedScrollMetrics`アップグレードで一部の引数がrequiredになっている？

[

https://github.com/ZERO-TO-ONE-TEAM/zas-cityhall-square/blob/ad8ec93e044ee808a7352afe0648a817f7d35432/lib/widgets/webview_drag_gesture_pull_to_refresh.dart#L109-L124



](https://github.com/ZERO-TO-ONE-TEAM/zas-cityhall-square/blob/ad8ec93e044ee808a7352afe0648a817f7d35432/lib/widgets/webview_drag_gesture_pull_to_refresh.dart#L109-L124)