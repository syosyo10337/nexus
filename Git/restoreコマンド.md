---
tags:
  - git
  - branch
  - commit
  - history
created: 2026-01-03
status: active
---

# 1.  `git restore <file>`

comitオブジェクトの状態(HEAD)までファイルの状態を戻すことができる。

```Bash
# 指定したファイル、ディレクトリツリーを復元する
# 指定がなければ、最新のコミットに戻す。(HEAD)
$ git restore <file_name or .> 

$ git checkout <file_name or .>
```


 
 以下が同じことをしています。

resetコマンドはHEADを特定の位置に移動させるもの。

`git reset —hard HEAD~`

もしくは

`git reset HEAD~`

`git restore .`

#  2. `git restore --staged <file>`

ステージングしたファイルをunstagedするコマンド。stashさせたくないものをこれで避けた