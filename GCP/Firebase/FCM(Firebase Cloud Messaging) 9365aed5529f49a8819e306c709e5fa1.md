 

# FCM(Firebase Cloud Messaging)

cf.

[

Cloud Messaging | FlutterFire

To start using the Cloud Messaging package within your project, import it at the top of your project files:

![](GCP/Firebase/Attachments/apple-touch-icon.png)https://firebase.flutter.dev/docs/messaging/usage



](https://firebase.flutter.dev/docs/messaging/usage)

そもそもこれは必ずしも。push通知用のサービスといううわけではなさそう。

> Common use-cases for using messages could be:
> 
> - Displaying a notification (see [Notifications](https://firebase.flutter.dev/docs/messaging/notifications)).
> 
> - Syncing message data silently on the device (e.g. via [shared_preferences](https://flutter.dev/docs/cookbook/persistence/key-value)).
> 
> - Updating the application's U

by FlutterFire

また、アプリの状態は 3つに分けられる。

|   |   |
|---|---|
|State|Description|
|**Foreground**|When the application is open, in view & in use.|
|**Background**|When the application is open, however in the background (minimised). This typically occurs when the user has pressed the "home" button on the device, has switched to another app via the app switcher or has the application open on a different tab (web).|
|**Terminated**|When the device is locked or the application is not running. The user can terminate an app by "swiping it away" via the app switcher UI on the device or closing a tab (web).|

## ユーザの通知許可ダイアログ

iOSはFlutter野設定をよしなにやることで、特にダイアログ表示のAPIを呼び出さずとも、起動時に表示された記憶がある。

Androidは13? 14以上のAPIではユーザから許諾をもらう必要があった気がする。

FCMではなく、こちらで通知ダイアログを出す実装を行っている。

```undefined
      await FlutterLocalNotificationsPlugin()
          .resolvePlatformSpecificImplementation<AndroidFlutterLocalNotificationsPlugin>()!
          .requestNotificationsPermission();
```

# Foreground message handling

## Android

[https://firebase.flutter.dev/docs/messaging/notifications/#android-configuration](https://firebase.flutter.dev/docs/messaging/notifications/#android-configuration)

## iOS

これを書くだけっぽい

```Dart

    // NOTE: Update the iOS foreground notification presentation options to allow heads up notifications.
    await FirebaseMessaging.instance.setForegroundNotificationPresentationOptions(
      alert: true,
      badge: true,
      sound: true,
    );
```

BackGroundで処理したい内容は特にない。

通知をクリックさせて、画面に、そしてページ遷移がやりたいことなので、

そのため削除する。

# `アイコンカラーの問題。android`

というかAndroidmanifest res/values/colors.xmlが反映されていなかったのは？

developmentにも独自でdir作成されていたので、buildじにmainが上書きされていた。

terminatedだとflutter_local_notificationが動かないっぽい

# BackGround messageハンドルについて

getToken いらなくね？だけじゃなくてRefreshで事足りる。

[https://firebase.google.com/docs/cloud-messaging/flutter/client?hl=ja](https://firebase.google.com/docs/cloud-messaging/flutter/client?hl=ja)

TODO: テスト

onBackGroundMessage使ってない説。

[https://firebase.google.com/docs/cloud-messaging/flutter/receive?authuser=0&hl=ja&_gl=1*1723ma9*_up*MQ](https://firebase.google.com/docs/cloud-messaging/flutter/receive?authuser=0&hl=ja&_gl=1*1723ma9*_up*MQ)..__ga_MTYyOTE0NTgzMi4xNzE4MzYxNDkz*_ga_CW55HF8NVT*MTczNDUwODkyNi4xOTYuMS4xNzM0NTA5NTYwLjQzLjAuMA..#background_messages

### 実装にあたって参考にしたもの cf.

[https://note.shiftinc.jp/n/n97fc26eafc93](https://note.shiftinc.jp/n/n97fc26eafc93)

[https://note.shiftinc.jp/n/n7543e869b39c#839b932e-642e-4d4f-b97d-2c013c6e9a49](https://note.shiftinc.jp/n/n7543e869b39c#839b932e-642e-4d4f-b97d-2c013c6e9a49)

[https://firebase.flutter.dev/docs/messaging/notifications/#android-configuration](https://firebase.flutter.dev/docs/messaging/notifications/#android-configuration)