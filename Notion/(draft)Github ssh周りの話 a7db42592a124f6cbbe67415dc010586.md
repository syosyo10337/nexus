 

![](Notion/Attachments/github-original.svg)

# (draft)Github/ssh周りの話

[SSHを使って、リポジトリとやり取りをしよう。](#3c9fe288-e1f2-4a38-bbc7-cfe804403278)

[{活用事例} CircleCIコンソール](#6173181a-374d-454a-a8d5-e5dc5882f415)

[cf)Githubに登録するdeploy keyとは](#fc8bbd10-7515-4d46-a86a-1dc74d369dba)

[実際に、githubへのアクセスを鍵認証で行う](#3a04f4af-8e72-4276-9a17-0257a4d4ca93)

## SSHを使って、リポジトリとやり取りをしよう。

鍵認証については、別の記事等を参照してほしいんですが、

cf)

[本番/Docker/gitでのSSH鍵認証](../%E6%9C%AC%E7%95%AA%20Docker%20git%E3%81%A7%E3%81%AESSH%E9%8D%B5%E8%AA%8D%E8%A8%BC%20b5d1e09cf1374414b64c9544c30c9837.html)

リポジトリをクローンしたりという作業をする際に、

自身のアカウントで登録しているリポジトリへアクセスをpasswordなしで、sshでアカウント認証させることができる。

(今まで、やってなかった)

実際に始めたのは、リモートの本番用サーバーにクローンする時に、リモート上で鍵を作成、公開鍵をgithub上に置いて、認証させた時のことでした。

## {活用事例} CircleCIコンソール

CircleCI上のコンテナにSSHで潜ってデバッグする時に、githubへアクセスするための鍵を大元の端末を操作するPC上に持っておく必要があります。

CircleCIはgithubから、ソースコードをcheckcoutしてきて、ビルドしますので、当然sshで、”→CircleCIに潜る”接続の元になる端末で、githubへのアカウントの鍵認証でできている必要があります。

(先ほどの例をもとに言うと、remoteの本番サーバーからならcircleCIコンソールに潜れる状態のこと。)

⚠️

ちなみに、CircleCIからgithubに接続する際のdeploykeyと、リポジトリ(プロジェクト単位にもできる)鍵認証のためのssh keyは別物です。

## cf)Githubに登録するdeploy keyとは

circleCi上で作成される。認証のためのkeyのこと。これは、github上のリポジトリ固有のssh鍵になる。

1. Github側に公開鍵を置いて

2. CircleCI上に作成される秘密鍵を用いることで、

3. アクセスの認証を行う。

という仕組みになっている

# 実際に、githubへのアクセスを鍵認証で行う

1. 今回は、ローカルと開発用のコンテナで共用するプライベートの用の鍵をまず用意する。

```Bash
# コマンドによって/Users/userName/.ssh/に鍵が作成されます。
$ ssh-keygen -t rsa 
```

[SSHについて](../AWS/SSH%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6%2056fe24c6ca954a129cad57591f2afa73.html)

それで、わかりやすいような名前をつけたら、privatekeyは大切にしまうこと。

2. 次に、publickeyをgithubに置きに行きます。

アカウント> settingから　add ssh keyみたいのを選んで、,

コピペする

3. **疎通確認**をおこなう

```Bash
$ ssh -i <鍵ファイルのパス> git@github.com
# -vオプションを付けると、使用したkeyの情報など、詳細なtraceも表示してくれる
```