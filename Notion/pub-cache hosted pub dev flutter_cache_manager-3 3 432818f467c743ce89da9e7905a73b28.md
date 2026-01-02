 

# ./../../.pub-cache/hosted/pub.dev/flutter_cache_manager-3.3.1/lib/src/web/web_helper.dart:135:42

```YAML
./../../.pub-cache/hosted/pub.dev/flutter_cache_manager-3.3.1/lib/src/web/web_helper.dart:135:42
: Error: The getter 'oldCacheObject' isn't defined for the class 'WebHelper'.
 - 'WebHelper' is from 'package:flutter_cache_manager

/src/web/web_helper.dart

' ('.

./../../.pub-cache/hosted/pub.dev/flutter_cache_manager-3.3.1/lib/src/web/web_helper.dart

').
Try correcting the name to the name of an existing getter, or defining a getter or field named 'oldCacheObject'.
      if (newCacheObject.relativePath != oldCacheObject.relativePath) {
                                         ^^^^^^^^^^^^^^
.

./../../.pub-cache/hosted/pub.dev/flutter_cache_manager-3.3.1/lib/src/web/web_helper.dart:136:24

: Error: The getter 'oldCacheObject' isn't defined for the class 'WebHelper'.
 - 'WebHelper' is from 'package:flutter_cache_manager

/src/web/web_helper.dart

' ('.

./../../.pub-cache/hosted/pub.dev/flutter_cache_manager-3.3.1/lib/src/web/web_helper.dart

').
Try correcting the name to the name of an existing getter, or defining a getter or field named 'oldCacheObject'.
        _removeOldFile(oldCacheObject.relativePath);

^^^^^^^^^^^^^^
```

.pub-cacheに保存されているパッケージが壊れているっぽい。

[

【コマンド編】flutter pub cache repairについて理解しよう

下記はアプリを実行した時のWarningですが、iOS11.0ではimage-pickerパッケージのUIImagePickerControllerReferenceURLは非推奨ですといっています。

![](Notion/Attachments/icon%209.png)https://zenn.dev/mukkun69n/articles/46fef3b47a5f49

![](Notion/Attachments/og-base-w1200-v2%2011.png)](https://zenn.dev/mukkun69n/articles/46fef3b47a5f49)

[

dart pub cache

Use dart pub cache to manage your system cache.

![](Notion/Attachments/touch-icon-iphone-retina%201.png)https://dart.dev/tools/pub/cmd/pub-cache

![](Notion/Attachments/dart-logo-for-shares%201.png)](https://dart.dev/tools/pub/cmd/pub-cache)

### 解決した方法

```YAML
flutter pub cache clean && flutter pub get
```

こちらでも解決しそう。

```YAML
flutter pub cache repair
```

cf.

[https://qiita.com/IKEMOTO_Masahiro/items/19eae2fad4fd5fcfb740](https://qiita.com/IKEMOTO_Masahiro/items/19eae2fad4fd5fcfb740)

https://zero-to-one.slack.com/archives/C01GRR698BB/p1714526741184869