---
tags:
  - git
  - branch
  - commit
  - remote
created: 2026-01-03
status: active
---

💅

# commitの操作(revert/reset)

[コミットの修正・書き換え](#c8fba1fb-2c99-4c9c-81b7-8a9ace10cfd4)

[1. 直前のコミットを修正 `git commit --amend`](#0a78cddf-317b-4c6f-90f0-b55f87181d9f)

[2. 過去のコミットを安全に打ち消す `git revert`](#bb9654fa-8fe5-46cb-ac81-62b33e5bad9f)

[3. コミットを捨てる `git reset`](#1a844698-5dd5-4248-9026-b1e35e795bbe)

[4. コミットを抜き取る `git cherry-pick`](#6326c11a-9c78-46f6-a762-ce4010158671)

[5. コミットの履歴の書き換え `git rebase -i`](#fafcd8c2-11c8-4a1f-81d8-a0897c54c614)

[[rebase -iの時のコマンド]](#7d9dbd84-53c8-4260-8af9-9f10ee4b88e5)

[⑴ 過去のコミットをまとめる(squash/rebase -i)](#73de945e-552b-428c-b232-695716e11748)

[⑵ 過去のコミットを編集する(edit)](#4af18653-93fb-47c0-884f-a7d94c3269f6)

[6. まとめてmergeする `--squash`](#0e0cbe86-ac14-4c7f-a90d-97d026af6c25)

[7. baseのブランチを取り替える。](#815ee7ec-2cb2-410f-9f6b-cdf403fe0736)

# コミットの修正・書き換え

## 1. 直前のコミットを修正 `git commit --amend`

このオプションをつけてコミットを行うと、同じブランチの直前のコミットに対して==内容の追加やコメントの修正==をすることができます。

```Bash
e.g.) #コミット漏れした内容を追加する

$ git add . # なにかしらの変更をindexに追加した状態で
$ git commit --amend #コミットメッセージも訂正する
```

  
**主な利用シーン**

- 直前のコミット漏れしたファイルを後から追加する

- 直前のコミットコメントを修正する

## 2. 過去のコミットを安全に打ち消す `git revert`

引数にとったコミットの内容を打ち消すコミットを作り出す。

==見かけ上過去のコミットを取り消してる。==  

```Bash
$ git revert <commit-ish>


e.g.)# 直前のコミットを打ち消すコミットを作成

$ git revert HEAD # コミットメッセージをediterで入力する
```

✅

`rebase -i/reset`でもコミットを削除することが可能だが、  
当該コミットが公開済みの場合には勝手に削除できないので、安全に削除する意味でも、打ち消すコミットをrevertで作成します

**主な利用シーン**

- 過去に公開したコミットを安全に打ち消す

## 3. コミットを捨てる `git reset`

元々は、==HEADを特定の状態にresetする==ためのコマンド。

しかし、引数によって、不要になったコミットを捨てることもできる。

(git restoreによって切り分けられたような操作ができる。)

```Bash
$ git reset <mode> <commit>

e.g.)
# HEADの二つ前のコミットの状態に戻って、その間の2つのミットを削除する
# indexもworking treeもなかったことに
$ git reset --hard HEAD~~
```

|モード名|HEAD|index|working tree|
|---|---|---|---|
|`--soft`|==reset==|変更しない|変更しない|
|`--mixed(default)`|==reset==|==reset==|変更しない|
|`--hard`|==reset==|==reset==|==reset==|

**主な利用用途**

- 変更したインデックスの状態まで含めてreset(mixed)

- 最近のコミットを完全に無かったことにする(hard)

- コミットだけを無かったことにする(soft)

✅

`ORIG_HEAD` は、reset前のコミットのポインタ。

つまり、  
`$ git reset --hard ORIG_HEAD`とすると、reset前に戻せる

☝

untracked files,つまり、新規に作成され一度もindexにステージングされていないファイルは`--hard`のオプションを指定した場合でも対象にならない。  
新規作成ファイルも含めて亡きものにしたいときは、一度`add`することがおすすめ。

## 4. コミットを抜き取る `git cherry-pick`

```Bash
# 特定のコミットの内容をcherry-pick
$ git cherry-pick <commit>

# conflictを解消してから
$ git add .
$ git commit
```

**主な利用シーン**

- ブランチを間違えて追加したコミットを正しい場所に移す  
    (元のコミットは消えない)

- 別ブランチのコミットを現在のブランチにも追加する

## 5. コミットの履歴の書き換え `git rebase -i`

コミットの書き換え、入れ替え、削除、統合ができる。

```Bash
# -i: --interactive
$ git rebase -i <取り込みたいコミット(過去)> 
```

ブランチを指定した時は、指定したブランチの変更履歴を一本化して取り込んだが、引数に過去のコミットを指定するとその時点までの履歴を取り込む（rebase）することになる。

そして、このとき==それ以降~ HEADまでの扱いを決める必要がある==

```Bash
e.g.)
# HEADの2個前(HEAD~2)のコミットまでの履歴をrebase(取り込む)
# つまり、それ以降HEAD~ HEADにあたるコミットの扱いを決める必要がある。
$ git rebase -i HEAD~2
```

### [rebase -iの時のコマンド]

ほかにもいくつかあるが、必要になり次第覚えていくこととする

- pick  
    コミットを使用する。

- squash  
    ひとつ前のコミットにまとめる形(meld into)でコミットの内容を利用する。  
    ==一番古いコミットは必ずpickにしないと、squashでまとめる先がないと怒られる==

- edit  
    指定したコミットの内容を編集する

### ⑴ 過去のコミットをまとめる(squash/rebase -i)

`-i |interactive`のこと

1. ベースにしたい履歴を指定する  
    つまり、HEAD~2と指定した場合には、==<HEAD~2> — <rebased commit>とするために、==

2. それ以降~HEADまでの変更履歴についてpick/squash等のコマンドを指定する。  
    ==一番古いコミットをpickにすることを忘れずに==

3. まとめたコミットについてもメッセージを残して完了

```Bash

e.g.)# 2つのコミットをまとめる例

# 起動したeditorでどのような操作をするか決める(s,p等)
$ git rebase -i HEAD~2

#--------vim editor-------------
pick 05191fc commitの説明を追加
- pick +squash 05dc5b2 pullの説明を追加


# rebaseされた内容は
<HEAD~2>  <rebased commit>という履歴になる。
```

☝

remote repoに既にいくつかコミットをしていた時に、ローカルをまとめ直す際には、  
`git push -f origin <branch>   `とforce pushすることを忘れずに

### ⑵ 過去のコミットを編集する(edit)

1. ベースにしたい履歴を指定する

2. それ以降~HEADまでの変更履歴についてpick/edit等のコマンドを指定する。

3. editで指定したコミットにcheckoutするので、その中で、ファイルに変更をかける

4. `git add . && git commit --amend`でコミットする

5. `git rebase --continue`でrebaseプロセスを続行

6. もし、editを行った以外のコミットとのconflictが発生した場合には、都度  
    `git add`で解消しながら、`rebase --cotinue`で再実行すること

```Bash
e.g.)
$ git rebase -i HEAD~2


#--------vim editor-------------
pick 05191fc commitの説明を追加
- pick +edit 05dc5b2 pullの説明を追加

$ git add .
$ git rebase --continue
```

**主な利用シーン**

- pushする前にコミットコメントをきれいに書きなおす

- 意味的に同じ内容のコミットをわかりやすいように一つにまとめる

- コミット漏れしたファイルを後から追加する

☝

`git rebase --abort`によってrebaseする前に戻すことができる。  
rebaseを行った後でも、ORIG_HEADがrebaseする前の状態の参照を持っているので、`git reset —hard ORIG_HEAD`することで戻ることができる。

## 6. まとめてmergeする `--squash`

このオプションを指定してブランチをマージすると、そのブランチのコミット全てをまとめたコミットが追加されます。

コンフリクトが発生した場合には、修正して、ステージ→コミットしてください

```Bash
$ git merge --squash <branch>
```

**主な利用シーン**

• トピックブランチ中のコミットを一つにまとめて統合ブランチに統合する。

## 7. baseのブランチを取り替える。

chery-pickをまとめてやるような感覚。

ただし、場合によっては複雑なコンフリクトを起こすため、気をつけましょう。

```Python
git rebase --onto <new base> <old base>
```