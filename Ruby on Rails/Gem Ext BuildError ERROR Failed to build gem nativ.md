---
tags:
  - rails
  - testing
  - gem
created: 2026-01-03
status: active
---

# Gem::Ext::BuildError: ERROR: Failed to build gem native extension.

---

# 状況

everyday rspecの復習がてらcloneしてアプリを立ち上げろうとしていたところ、`bundle install`および　`bin/setup`が成功しなかった

# 原因

xcrunがエラーを起こしていたらしい。これはmacOS特有のxcodeをインストールしてねっていうエラーらしい。　

```C
xcrun: error: invalid active developer path (/Library/Developer/CommandLineTools), missing xcrun at: /Library/Developer/CommandLineTools/usr/bin/xcrun
checked program was:
/* begin */
1: #include "ruby.h"
2: 
3: int main(int argc, char **argv)
4: {
5:   return !!argv[argc];
6: }
/* end */
```

## 個人でやるなら解決する方法(非推奨)

Gemfile.lockを削除することで、一応解決することができるが

[Gemfile.lockの理解](Gemfile%20lock%E3%81%AE%E7%90%86%E8%A7%A3%201a783021e0d444c2bac4eb8a4bd2ac9a.html)

を確認するとわかるように、チーム開発においては、開発の環境にズレが生じるため、推奨されない。

# 結論

macOSのアップロードと、xcodeの依存性の問題等は時たまあるそうなので、

しっかりとログを確認して調べること。