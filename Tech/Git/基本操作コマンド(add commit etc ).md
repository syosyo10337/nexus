---
tags:
  - git
  - branch
  - commit
  - remote
created: 2026-01-03
status: active
---

👶

# 基本操作コマンド(add /commit etc..)

[`git add <file_name>`](#fcb8898b-8849-4dc8-9994-127c8291712d)

[(opt)](#6b4bbe99-3443-4ba5-8004-22bc3752605a)

[? `git rm <ファイル名>`](#44d6ce61-53c3-4695-b5d9-37d07e5d5491)

[`git commit`](#d4e898a5-6b98-4b01-a067-f1c1b54b0df7)

[(opt)](#7bbb9514-d544-466e-8128-57cadc6f8f92)

[`git push <repo> <送信元branch>:<送信先branch>`](#145a081a-cd8a-45ca-be60-68ada1afc76f)

[(opt)](#67dd8617-b198-41a1-b1cf-348c683cf039)

[`git stash`](#98f19a26-45b9-4683-b775-f0abc435e58c)

[save …](#b697f641-bf83-4395-a862-19ee8d690019)

[push](#cc9260f3-bbd8-48fd-892d-d9bb6e05f5e8)

[pop](#8a531e2b-6819-4add-aeec-8e1e63996916)

# `git add <file_name>`

変更や新規作成した個別ファイルを指定し、indexへ追加する。

## (opt)

- `-A | --all`  
    隠しファイル以外全て追加

- `-u | --update`  
    存在していて変更されたファイルを追加

- `$ git add .`  
    current directory以下での変更(new_filesも)indexに追加する。

- `-p | --partials`

||新規ファイル|
|---|---|
|git add .|追加される|
|git add -A|追加される|
|git add -u|追加されない|

# ? `git rm <ファイル名>`

rmコマンド等で削除したファイルを指定し、ステージングエリアに追加する。

# `git commit`

ローカルリポジトリにコミットする。コミットメッセージをvimで入力する。

## (opt)

- `-m`  
    コミットメッセージをコマンドライン上で記入できる

- `-v`  
    変更内容が見れる。

# `git push <repo> <送信元branch>:<送信先branch>`

変更履歴を送るコマンド。  
送信先と元のブランチ名が同一であれば単に<branch>で良い

```Bash
e.g)
$ git push -u origin main
```

## (opt)

- `-u | --set-upstream`  
    更新され、pushに成功したすべてのブランチに対して、upstream/tracking ブランチを追加する。

🚨

ローカルリポジトリからリモートリポジトリにpushするときは、pushしたブランチがfast-forwardマージされるようにしておく必要があります。もし、競合が発生するような場合は、pushが拒否されます。

# `git stash`

汚い作業ディレクトリを隠す。(作業を一時保存する)

- stashとは、
    
    ファイルの変更内容を一時的に記録しておく領域のこと。
    

### save …

git stash pushがあるので、非推奨ですが、pathspecを引数に取ることができます。

```Bash
# かなり古いオプションなので非推奨です。->pushつかえ
$ git stash save <message>
```

### push

saveの代わりにstash領域に、退避させるためのコマンド

```Bash
$ git stash push

# pushなしでもpushとして受け取られる
$ git stash
```

### pop

pushされた内容を、戻す時に使用する。

```Bash
$ git stash pop
```