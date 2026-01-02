 

# 全てのテストが'package:flutter_test/src/binding.dart': Failed assertion: line 985 pos 14: '_pendingExceptionDetails != null':

今回はshare_intentの内容のデッドコードを削除できていなかったことによるもの。late　keywordだったので解消しなかった。　

このように実装不備がある場合にエラーになることはあるよ。

```Shell
'package:flutter_test/src/binding.dart': Failed assertion: line 985 pos 14: '_pendingExceptionDetails != null': A test overrode FlutterError.onError but either failed to return it to its original state, or had unexpected additional errors that it could not handle. Typically, this is caused by using expect() before restoring FlutterError.onError.
dart:core-patch/errors_patch.dart 51:61       _AssertionError._doThrowNew
```