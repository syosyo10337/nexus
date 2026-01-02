 

🚸

# branch周りの操作(merge/rebase)

---

[branchの統合](#5aac4d80-537e-4545-8f79-517ab037f0c7)

[merge](#a43ccb60-19d7-4ec3-8558-36970f2afb0e)

[1. fast-forward merge](#59b6db6b-461e-4e59-9399-f4648a632361)

[2. non fast-forward merge](#23a93fd1-94e4-4787-b653-6dd3196f4305)

[rebase](#294a2d4e-40cd-443a-8ad0-5f396da017ba)

[rebaseでコンフリクトした時](#c51a35b9-027a-43e6-95b4-8a47a5c7240d)

[rebase自体をやめる時](#3859d4d9-5e2d-4931-b1ae-74c2c33a254b)

[mergeとrebase](#a2da771c-fe04-44ee-abe0-35cbfc470c38)

[git rebase -i](#0daf3662-efca-4b9c-8983-d1d8c269b8a3)

このあたりの参考にとして

[👇ポインタ周りの理解(HEADとか)](%E3%83%9D%E3%82%A4%E3%83%B3%E3%82%BF%E5%91%A8%E3%82%8A%E3%81%AE%E7%90%86%E8%A7%A3\(HEAD%E3%81%A8%E3%81%8B\)%20099a63f18e914df1828951927879cdad.html)

# branchの統合

---

# merge

## 1. fast-forward merge

分岐する前のブランチが、分岐した後に変更されていない場合に、分岐前から分岐後に履歴を辿るだけでmergeできること。

この時、マージコミットは作成せず、branch pointerをmergeされるブランチのまで一致させる。

よって、ブランチポインタが指定されて位置まで移動されるので、前トピックブランチでの変更履歴を追いづらい

✅

マージコミットを作成するとブランチがそのまま残るため、トピックブランチでの作業内容を特定しやすくなる。

```Bash
# 次のオプションをつけることで、必ずマージコミットを作成する。
$ git merge main --no-ff
```

## 2. non fast-forward merge

例えば、変更がconflictを起こした時に、手動でファイルを修正する必要がありますが、この時に差分を確認し、手動で最後コミットを行うときmergeコミットを作成して、解消する。このようなマージをnon -ffマージという

- merge commit
    
    mergeの元となる親ブランチが二つ存在する時に、双方の差分を取り込んだ上で作成するコミットのこと
    

# rebase

(これ間違ってないか？)

cf)

[

Git - git-rebase Documentation

![](https://git-scm.com/favicon.ico)https://git-scm.com/docs/git-rebase



](https://git-scm.com/docs/git-rebase)

これによると、merge <topic>！って言ったら switch <topic>をまずして、

それまでのcommitはtemporalilyなエリアに保存された後に<topic>の子としてつけられる。

例えば

masterブランチにて、以下のコマンドをしたとき

```Bash
git:(master)

$ git rebase bugfix
```

[![](Notion/Attachments/Screenshot_2023-02-14_at_14.29.45.png)](branch%E5%91%A8%E3%82%8A%E3%81%AE%E6%93%8D%E4%BD%9C\(merge%20rebase\)/Screenshot_2023-02-14_at_14.29.45.png)

[![](Notion/Attachments/Screenshot_2023-02-14_at_14.29.49.png)](branch%E5%91%A8%E3%82%8A%E3%81%AE%E6%93%8D%E4%BD%9C\(merge%20rebase\)/Screenshot_2023-02-14_at_14.29.49.png)

挙動としては

1. 指定されたブランチ(bugfix)の履歴が、現在のブランチ(master)の新しいコミットとして一本化されて付け足される。  
    

[![](Notion/Attachments/Screenshot_2023-02-14_at_14.32.46.png)](branch%E5%91%A8%E3%82%8A%E3%81%AE%E6%93%8D%E4%BD%9C\(merge%20rebase\)/Screenshot_2023-02-14_at_14.32.46.png)

==この時、移動するコミット(X,Y)にconflictが発生する場合には、解消する必要があります。==

2. この後、masterのブランチ(ポインタ)をbugfix(マージされたブランチ)まで移動させる。

## rebaseでコンフリクトした時

mergeコミットの場合とは異なり、

1. `git diff`で差分を確認

2. 手動で当該ファイルを編集

3. **`git add <file> & git rebase —continue`**

の手順で、rebaseすること.

### rebase自体をやめる時

`git rebase --abort`

すると、git rebase前の状態に戻る。

### mergeとrebase

- **merge  
    **変更内容の履歴はそのまま残るが、履歴が複雑になる。

- **rebase  
    **履歴は単純になるが、元のコミットから変更内容が変更される。そのため、元のコミットを動かない状態にしてしまうことがある。

[チームでの運用例]

- トピックブランチに統合ブランチの最新のコードを取り込む場合はrebaseを使う(トピックでの変更よりも、最新の統合ブランチの状態を優先)

- 統合ブランチにトピックブランチを取り込む場合は、まずrebaseしてからmerge(つまり、前述のことをしてから、mergeをすること？)

# git rebase -i

squash/ reword/

`**fixup**` = 前のコミットに吸収させたいけど、メッセージは要らないとき