 

🎊

# conflictが発生したら

pull requestを作成した時に、conflictが発生することがある。その時はローカルでconflictを解決してから、再度pull reqを作成する必要がある。

==これは、リモートをmergeするときは、ffでできるような状態にしなければならないという決まりがあるため。==

```Bash
# 1. localのmainブランチを最新に
$ git switch main
$ git fetch (origin)
$ git merge origin/main

# 2. pull reqしたいブランチにもどって
$ git switch xxxx
$ git merge main # コンフリクトさせる
# 手動でconflictを解消し

# 3. 再度push
$ git add -A
$ git commit -m ""
$ git push origin <branch>
```