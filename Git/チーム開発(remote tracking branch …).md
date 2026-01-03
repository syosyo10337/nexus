---
tags:
  - git
  - branch
  - commit
  - remote
created: 2026-01-03
status: active
---

👥

# チーム開発(remote/ tracking branch …)

---

[`fetch`](#079770a2-5099-4988-9373-f7642ed456a8)

[Remote Branch](#40f7e63d-c116-4893-8309-83ea0cde71a5)

[Tracking Branch](#b324e216-d3af-4187-a261-7041a5a06b3d)

[`pull`](#e2cfff68-a3f4-40e3-8424-3fc86b7172ac)

[`push`](#3581aacf-0cd8-40f5-854c-d54d63df3208)

Gitのような独立なリポジトリを複数もち、リポジトリ同士で変更履歴を共有できる機能を持つバージョン管理システムを**分散型バージョン管理システム**という。

複数人で作業をする時は作業者毎に1つのリポジトリを作成する。  
各々のリポジトリにコミットして履歴を進め、repository間の変更の履歴のやりとりはpushとpull(fetch&merge)を使って行う

# `fetch`

---

refs(ブランチやタグなどの集合)を取得する。  
fetchコマンドは、リモートリポジトリの最新履歴の取得するだけです。

==(localのブランチへのmergeは別途必要)==  
またこの時、取り込まれた内容はFETCH_HEADという名前でcheckoutできます。

細かい挙動としては、remote repositoryから内容を取得し、tracking branchを更新している。

```Bash
$ git fetch <repo_name>

e.g.)
# originリポジトリ(remote_repo alias)の履歴を取得
$ git fetch origin

```

## Remote Branch

remote repositoryのbranchのことを指す。

以下のコマンドによって、ローカルでも確認できます。しかしより一般的には、remote-tracking-branchを利用すると良いでしょう。

```Bash
$ git ls-remote <remote>

$ git remote show <remote>
```

## Tracking Branch

remote branchとは、remoteのbranchの状態への参照を持ちます。よってremote-tracking-branchと呼ばれます。  
具体的には<remote>/<branch>の形で表現されるブランチのことです。

==e.g.) origin/main==

```Bash
# tracking branch一覧を表示する
# -r | --remote
$ git branch -r
```

fetchしたtracking branchの状態をローカルに取り込む時、merge!

```Bash
e.g.)
# originのmainブランチをtrackingしている追跡ブランチをカレントブランチにマージ
$ git merge origin/master
```

# `pull`

---

このコマンドは内部的には、`fetch` /`merge`が行われている

```Bash
$ git pull <option> [<リポジトリ名> <ブランチ名>]

e.g.)
$ git pull origin main
```

  
指定したリモートリポジトリのブランチの内容を、現在地のリポジトリに取り込む。  
この時、

1. ローカルに変更が一切加わっていなければ、ffマージされる

2. 変更が加わっている場合には、自動的にマージコミットが作成される
    
    1. さらに、コンフリクトが発生した場合には、解消する必要がある。
    

## `push`

リモートリポジトリへ変更を送信する。この時pushしたブランチがffマージされる必要があり、そうでない場合には拒否される。