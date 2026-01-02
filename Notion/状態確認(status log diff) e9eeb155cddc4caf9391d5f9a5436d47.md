 

👀

# 状態確認(`status/log/diff`)

---

開発しながら、現状について確認することは大事です。

主なコマンドとよくつかうオプションについて書いていきます。

[`$ git status`](#9f366906-6d1d-4283-8404-51c1fdba778c)

[`$ git log`](#abbfc6cd-0e75-45fd-b213-9cd36fa12eda)

[(opt)](#a231ecd9-eff6-496b-90b6-127f073ace58)

[`$ git diff`(随時更新中)](#29fa2bc7-a707-477c-bb64-eb9f4d5b058e)

## `$ git status`

the working treeの状態を表示する。

- index　と　current HEAD commitの差分について

- the working tree と　indexの差分について

- 新規に作成されて一度もstagingされていないfiles(untracked file)の有無

## `$ git log`

commitのログを表示する

リポジトリにコミットされた履歴(ログ)を確認することができる。  
(表示される内容: commitのハッシュ値/Author/日付/コミットメッセージ）

### (opt)

- `--oneline`  
    コミットログ１行で表示。

- `-p (<ファイル名>)   `コミットメッセージだけでなくて、実際の変更差分が見られる。ファイル単位で指定することもできる。

- `-n <n>   `表示行指定

- `--graph   `ツリー構造で表示させる。

# `$ git diff`(随時更新中)

commits、commitやworking tree間の差分を表示する。

```Bash
# indexと、working treeの差分を表示する(addする前に確認する)
$ git diff

# 最新のcommit とindexの差分を表示する(addした後の差分表示)
$ git diff --cached
```

cf）何かあったらコチラの記事を確認してください。

[

忘れやすい人のための git diff チートシート - Qiita

git diff は色んな場面で本当によく使うんですが、できることが多いだけに全然覚えられずに毎回調べてしまいます。 なので、場面ごとに使えるコマンドを一覧でまとめてみました。 先にワークツリーとインデックス【Gitの基本】- サル...

![](Notion/Attachments/apple-touch-icon-ec5ba42a24ae923f16825592efdc356f%203.png)https://qiita.com/shibukk/items/8c9362a5bd399b9c56be

![](Notion/Attachments/article-ogp-background-9f5428127621718a910c8b63951390ad%2018.png)](https://qiita.com/shibukk/items/8c9362a5bd399b9c56be)