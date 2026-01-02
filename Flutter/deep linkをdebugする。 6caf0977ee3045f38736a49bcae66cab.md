 

# deep linkをdebugする。

# android

```XML
# command
$ adb shell am start -W -a android.intent.action.VIEW -d <URI> <PACKAGE>

# e.g.
$ adb shell am start -W -a android.intent.action.VIEW -d "example://gizmos" com.example.android
```

```XML
adb shell am start -a android.intent.action.VIEW -d "https://www.google.co.jp"

adb shell am start -W -a android.intent.action.VIEW -d "https://upgaragedev.page.link/ec"
```

[https://upgaragedev.onelink.me/2tSv?af_xp=custom&pid=app_setting&af_dp=crooooberid%3A%2F%2F&deep_link_value=%2Fapp_setting](https://upgaragedev.onelink.me/2tSv?af_xp=custom&pid=app_setting&af_dp=crooooberid%3A%2F%2F&deep_link_value=%2Fapp_setting)

adb shell am start -W -a android.intent.action.VIEW -d ‘[https://upgaragedev.onelink.me/2tSv/wjrgtjcc](https://upgaragedev.onelink.me/2tSv/wjrgtjcc)’