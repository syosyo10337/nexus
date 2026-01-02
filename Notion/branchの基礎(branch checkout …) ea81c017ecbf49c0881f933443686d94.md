 

🍽️

# branchの基礎(branch/checkout …)

---

[branchとは(枝、支店)](#7d409a0f-9086-4fc6-9db5-3bbc5d1ee9f4)

[`git branch`](#98906589-d3b4-434c-90a8-6d3d51994b7e)

[branchの作成](#dc7a868b-a12a-4c5b-8e58-ab32dd9c24b4)

[1. `git branch <new_branch>`](#666afc3b-b883-4294-9d78-a6645bb11e62)

[2. branchの作成と切り替え](#90b6f347-c6c0-4a6a-9f19-499a1c62613d)

[branchの切り替え](#e9c20bbd-4eaa-4ee5-a2a2-1f048fe8fc47)

[{細かい挙動} ?](#55444619-773b-447f-90eb-1cc1bb8452c2)

[branchの削除](#8c683d86-0081-477a-a021-bc9538eb7584)

[branchの改名](#52ac5b92-342a-4e75-8ac1-7723bc5e625d)

[local branchのrename](#6c0d1121-69e3-4b65-bc88-4a035d7b9b90)

[remote branchのrename](#a6cb4326-80c7-4491-8673-6377cbe1b9a7)

# branchとは(枝、支店)

mainブランチ(リビジョン)から枝別れしたそれぞれの履歴の道筋を意味する。  
より正確には、  
==分岐した履歴の先頭にあるコミット(リビジョン)を指し示す“ラベル”/ポインタ==

# `git branch`

---

ブランチの一覧を表示。現在地は(*)で表示される。

```Bash
#
$ git branch -a
#remoteのブランチも見れる？
$ git branch -r
```

# branchの作成

---

### 1. `git branch <new_branch>`

新しいブランチの作成だけ、checkoutはしない

### 2. branchの作成と切り替え

引数にとったブランチを作成し、そのブランチにswitchする

```Bash
$ git switch -c <new_branch>
$ git checkout -b <new_branch>
```

# branchの切り替え

---

```Bash
$ git switch <branch>
$ git checkout <branch>

# (-)を引数に取ると、一つ前にいたブランチに切り替える
e.g.)
$ git switch -
```

### {細かい挙動} ?

- `checkout`/`switch`を行う時、indexやワークツリーの状態を保持したままま、移動先のbranchポインタが指すコミットを展開する。(==切り替え先に持っていける==)

- ただし、untracked_fileやステージングされていないファイルがある場合もしくは、ステージングされているが移動先の最新commitとconflictする場合には、checkout(switch)することで、現在の変更中の内容が失われるためAbortingされる

==上のような場合は、変更をcommitしてしまうかstashする必要がある==　

# branchの削除

---

```Bash
# どこにもマージされてない時は実行できない
# (変更内容を捨てることになるので、安全のために)
$ git branch -d

# マージ前のブランチを削除する。変更をマージしてなくてもブランチを削除できる。
$ git branch -D <ブランチ名>
```

# branchの改名

---

## local branchのrename

`-m`オプションを利用する　

```Bash
# To rename current branch
$ git branch -m <new_name>

# To rename a branch while pointed to any branch:
$ git branch -m <old_name> <new_name>
```

## remote branchのrename

プッシュする時に新しい名前づけをすること。

```Bash
# リモートブランチに新しい名前でプッシュする
$ git push origin -u <new_name>

# リモートのブランチを削除する
$ git push origin --delete <old_name>
```

cf)

[

How do I rename a local Git branch?

How do I rename a local branch which has not yet been pushed to a remote repository? Related: Rename master branch for both local and remote Git repositories How do I rename both a Git local and r...

![](Notion/Attachments/apple-touch-icon%2010.png)https://stackoverflow.com/questions/6591213/how-do-i-rename-a-local-git-branch

![](Notion/Attachments/apple-touch-icon@2%202.png)](https://stackoverflow.com/questions/6591213/how-do-i-rename-a-local-git-branch)