 

🗑️

# remoteで、rbenvが見つからない/SSHで接続できない？

参考)

[

Capistrano3系設定で詰まった点まとめ(Ruby/Sinatra) - Qiita

EC2でインスタンスを立てて、Capistrano3系を用いてデプロイの設定をした際に詰まった点とその対応策を書き記す。 そもそもCapistranoとは Rubyで作られた自動デプロイツール。特定のファイルに設定を書き記したの...

![](Notion/Attachments/production-c620d3e403342b1022967ba5e3db1aaa%203.ico)https://qiita.com/masa08/items/c74f9e50ae432ac71126#%E3%82%A8%E3%83%A9%E3%83%BC5-rbenv%E3%82%A4%E3%83%B3%E3%82%B9%E3%83%88%E3%83%BC%E3%83%AB%E3%81%95%E3%82%8C%E3%81%A6%E3%81%AA%E3%81%84%E3%82%88%E3%82%A8%E3%83%A9%E3%83%BC

![](Notion/Attachments/article-ogp-background-9f5428127621718a910c8b63951390ad%207.png)](https://qiita.com/masa08/items/c74f9e50ae432ac71126#%E3%82%A8%E3%83%A9%E3%83%BC5-rbenv%E3%82%A4%E3%83%B3%E3%82%B9%E3%83%88%E3%83%BC%E3%83%AB%E3%81%95%E3%82%8C%E3%81%A6%E3%81%AA%E3%81%84%E3%82%88%E3%82%A8%E3%83%A9%E3%83%BC)

# その1. rbenvが本番環境にない問題

そんなはずはなかった、実際に人力でビルド済みなのだから。

## 1. 症状

```Ruby
# localにて
$ bundle exec cap production deploy

00:00 rbenv:validate
      WARN  rbenv: 3.0.4 is not installed or not found in $HOME/.rbenv/versions/3.0.4 on …
```

## 原因分析　

- 作成していた本番環境ではユーザが二人いた。(deployとroot)

- deployに対して、appに関する全ての権限と所有権を持たせていた(AWSの本に倣った)。

- sshをCapistranoタスクによって実行させた時、rootユーザでのログインになると、rootユーザの権限ではrbenvが入っていなかったことが今回の問題と考える。

```Bash
# 実際にリモートでログイン直後(root)だと、できなかった。
$ rbenv -v
```

## 対応

deployユーザに権限付与をして、`~/.ssh/config`を使って、接続できるようにする。

[ユーザの権限を移譲する。](../Linux/%E3%83%A6%E3%83%BC%E3%82%B6%E3%81%AE%E6%A8%A9%E9%99%90%E3%82%92%E7%A7%BB%E8%AD%B2%E3%81%99%E3%82%8B%E3%80%82%207d244cfcc0d34ccd8d5260239a8d4e3c.html)

[~/.ssh/configの書き方](../AWS/SSH%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6%2056fe24c6ca954a129cad57591f2afa73.html)

# その2. SSHのうまくいかない

# 考えられる原因

1. ~/.ssh/configやsshの認証用秘密鍵が,capコマンドを実行する環境に用意されてない

実際に手動でEC2にデプロイしていた時には、開発環境はローカル。開発環境をDockerを使ったものにシフトしてから、コンテナ内にそれらの設定はしたことがなかった。

- 実行環境に、sshの設定が反映されているかをコマンドを打って確認してください。

2. deploy設定ファイルの不備

```Ruby
# config/deploy/produciton.rb
server 'web', user: 'deploy', roles: %w{app db web}

set :ssh_options, {
  keys: %w(/root/.ssh/takahashi.pem),　# コンテナ上で使う、認証秘密鍵

}
```

[[Capistrano]SSHログインの接続設定(踏み台を含む)v3の罠](%5BCapistrano%5DSSH%E3%83%AD%E3%82%B0%E3%82%A4%E3%83%B3%E3%81%AE%E6%8E%A5%E7%B6%9A%E8%A8%AD%E5%AE%9A\(%E8%B8%8F%E3%81%BF%E5%8F%B0%E3%82%92%E5%90%AB%E3%82%80\)v3%E3%81%AE%E7%BD%A0%206d6bd88fe03c47769cdfebb1f6c80f09.html)

これが設定できない時は、以下のようなエラーが出ていたよ。

```Ruby
Exception while executing as ec2-user@web.home: getaddrinfo: Name or service not known (SSHKit::Runner::ExecuteError)
```

cf）

[

capistrano 踏み台サーバがある場合のconfig/deploy/production.rbの書き方 - Qiita

構成 -------------------- target_server user: deploy key: id_rsa.pemが必要 -------------------- ^ | -------------------- ...

![](Notion/Attachments/production-c620d3e403342b1022967ba5e3db1aaa%203.ico)https://qiita.com/tsuji-daisuke/items/a3a01f24db5a418b780c

![](Notion/Attachments/article-ogp-background-9f5428127621718a910c8b63951390ad%208.png)](https://qiita.com/tsuji-daisuke/items/a3a01f24db5a418b780c)

# エラーリターンズ

```Bash
oot@fdea84bf8db9:/recorda-me# bundle exec cap production deploy
00:00 git:wrapper
      01 mkdir -p /tmp
    ✔ 01 ec2-user@web 0.309s
      Uploading /tmp/git-ssh-f7e2256005f3508b9a28.sh 100.0%
      02 chmod 700 /tmp/git-ssh-f7e2256005f3508b9a28.sh
    ✔ 02 ec2-user@web 0.263s
00:01 git:check
      01 git ls-remote git@github.com:syosyo10337/recorda-me.git HEAD
      01 Warning: Permanently added 'github.com,20.27.177.113' (ECDSA) to the list of k…
      01 Permission denied (publickey).
      01 fatal: Could not read from remote repository.
      01
      01 Please make sure you have the correct access rights
      01 and the repository exists.
#<Thread:0x0000559f40debc48 /usr/local/bundle/gems/sshkit-1.21.3/lib/sshkit/runners/parallel.rb:10 run> terminated with exception (report_on_exception is true):
/usr/local/bundle/gems/sshkit-1.21.3/lib/sshkit/runners/parallel.rb:15:in `rescue in block (2 levels) in execute': Exception while executing as ec2-user@web: git exit status: 128 (SSHKit::Runner::ExecuteError)
git stdout: Nothing written
git stderr: Warning: Permanently added 'github.com,20.27.177.113' (ECDSA) to the list of known hosts.\r
Permission denied (publickey).\r
fatal: Could not read from remote repository.

Please make sure you have the correct access rights
and the repository exists.
	from /usr/local/bundle/gems/sshkit-1.21.3/lib/sshkit/runners/parallel.rb:11:in `block (2 levels) in execute'
/usr/local/bundle/gems/sshkit-1.21.3/lib/sshkit/command.rb:97:in `exit_status=': git exit status: 128 (SSHKit::Command::Failed)
git stdout: Nothing written
git stderr: Warning: Permanently added 'github.com,20.27.177.113' (ECDSA) to the list of known hosts.\r
Permission denied (publickey).\r
fatal: Could not read from remote repository.

Please make sure you have the correct access rights
and the repository exists.
	from /usr/local/bundle/gems/sshkit-1.21.3/lib/sshkit/backends/netssh.rb:170:in `execute_command'
	from /usr/local/bundle/gems/sshkit-1.21.3/lib/sshkit/backends/abstract.rb:148:in `block in create_command_and_execute'
	from <internal:kernel>:90:in `tap'
	from /usr/local/bundle/gems/sshkit-1.21.3/lib/sshkit/backends/abstract.rb:148:in `create_command_and_execute'
	from /usr/local/bundle/gems/sshkit-1.21.3/lib/sshkit/backends/abstract.rb:80:in `execute'
	from /usr/local/bundle/gems/capistrano-3.17.1/lib/capistrano/scm/git.rb:83:in `git'
	from /usr/local/bundle/gems/capistrano-3.17.1/lib/capistrano/scm/git.rb:40:in `check_repo_is_reachable'
	from /usr/local/bundle/gems/capistrano-3.17.1/lib/capistrano/scm/tasks/git.rake:19:in `block (4 levels) in eval_rakefile'
	from /usr/local/bundle/gems/sshkit-1.21.3/lib/sshkit/backends/abstract.rb:100:in `with'
	from /usr/local/bundle/gems/capistrano-3.17.1/lib/capistrano/scm/tasks/git.rake:18:in `block (3 levels) in eval_rakefile'
	from /usr/local/bundle/gems/sshkit-1.21.3/lib/sshkit/backends/abstract.rb:31:in `instance_exec'
	from /usr/local/bundle/gems/sshkit-1.21.3/lib/sshkit/backends/abstract.rb:31:in `run'
	from /usr/local/bundle/gems/sshkit-1.21.3/lib/sshkit/runners/parallel.rb:12:in `block (2 levels) in execute'
(Backtrace restricted to imported tasks)
cap aborted!
SSHKit::Runner::ExecuteError: Exception while executing as ec2-user@web: git exit status: 128
git stdout: Nothing written
git stderr: Warning: Permanently added 'github.com,20.27.177.113' (ECDSA) to the list of known hosts.
Permission denied (publickey).
fatal: Could not read from remote repository.

Please make sure you have the correct access rights
and the repository exists.


Caused by:
SSHKit::Command::Failed: git exit status: 128
git stdout: Nothing written
git stderr: Warning: Permanently added 'github.com,20.27.177.113' (ECDSA) to the list of known hosts.
Permission denied (publickey).
fatal: Could not read from remote repository.

Please make sure you have the correct access rights
and the repository exists.

Tasks: TOP => deploy:check => git:check
(See full trace by running task with --trace)
The deploy has failed with an error: Exception while executing as ec2-user@web: git exit status: 128
git stdout: Nothing written
git stderr: Warning: Permanently added 'github.com,20.27.177.113' (ECDSA) to the list of known hosts.
Permission denied (publickey).
fatal: Could not read from remote repository.

Please make sure you have the correct access rights
and the repository exists.


** DEPLOY FAILED
** Refer to log/capistrano.log for details. Here are the last 20 lines:


  INFO ---------------------------------------------------------------------------

 DEBUG [d926abc8] Running [ -d $HOME/.rbenv/versions/3.0.4 ] as ec2-user@web

 DEBUG [d926abc8] Command: [ -d $HOME/.rbenv/versions/3.0.4 ]

 DEBUG [d926abc8] Finished in 3.780 seconds with exit status 0 (successful).

  INFO [cd20c2fe] Running /usr/bin/env mkdir -p /tmp as ec2-user@web

 DEBUG [cd20c2fe] Command: ( export RBENV_ROOT="$HOME/.rbenv" RBENV_VERSION="3.0.4" ; /usr/bin/env mkdir -p /tmp )

  INFO [cd20c2fe] Finished in 0.309 seconds with exit status 0 (successful).

 DEBUG Uploading /tmp/git-ssh-f7e2256005f3508b9a28.sh 0.0%

  INFO Uploading /tmp/git-ssh-f7e2256005f3508b9a28.sh 100.0%

  INFO [ea2e3bfc] Running /usr/bin/env chmod 700 /tmp/git-ssh-f7e2256005f3508b9a28.sh as ec2-user@web

 DEBUG [ea2e3bfc] Command: ( export RBENV_ROOT="$HOME/.rbenv" RBENV_VERSION="3.0.4" ; /usr/bin/env chmod 700 /tmp/git-ssh-f7e2256005f3508b9a28.sh )

  INFO [ea2e3bfc] Finished in 0.263 seconds with exit status 0 (successful).

  INFO [b18b51c6] Running /usr/bin/env git ls-remote git@github.com:syosyo10337/recorda-me.git HEAD as ec2-user@web

 DEBUG [b18b51c6] Command: ( export RBENV_ROOT="$HOME/.rbenv" RBENV_VERSION="3.0.4" GIT_ASKPASS="/bin/echo" GIT_SSH="/tmp/git-ssh-f7e2256005f3508b9a28.sh" ; /usr/bin/env git ls-remote git@github.com:syosyo10337/recorda-me.git HEAD )

 DEBUG [b18b51c6] 	Warning: Permanently added 'github.com,20.27.177.113' (ECDSA) to the list of known hosts.

 DEBUG [b18b51c6] 	Permission denied (publickey).

 DEBUG [b18b51c6] 	fatal: Could not read from remote repository.



Please make sure you have the correct access rights

and the repository exists.

root@fdea84bf8db9:/recorda-me#
```

## 想定した原因

どうやらこれも、コードでリモートwebサーバーに入ると、ec2-userがgithubへのアクセスがないことに起因しような問題出る。  
そもそも、railsコードから遠隔サーバにまず接続して、遠隔サーバーからgitへの接続を認証する。この、ローカル→遠隔サーバー →まで接続する内容について、コード上で記述するのが,CDの役割です。

今回つまづいたのは、コードでの指定が間違っているのではなく、コードで指定したec2-userがgithubへのアクセス権を持っていなかったことによります。

そのため、遠隔サーバ上でgithubとの認証鍵が正常に配置されているかをまず確認し、その後接続用のファイルもローカルで訂正する必要があります。(今回は開発環境の移行に伴い、コンテナでの開発環境にも遠隔サーバとの接続について設定し直す必要があった。)

## 方針

1. ec2のユーザ自体をセキュリティの観点から、削除する。  
    より正確には、最初にログインしていくユーザを変更する。これによって、ユーザを変える必要もなく、必要なすべての権限を持ったユーザで　git ともコンテナとも繋がることができる。
    
    1. まずは、新規でユーザを作成して
    

```Bash
$ sudo adduser <user名>
$ sudo passwd <user名>
#->passwordを設定
[ec2-user@ip-10-0-1-40 ~]$ sudo visudo


# 1.rootに関する権限の記述箇所
root    ALL=(ALL)       ALL　
# 2.その下に、作成したユーザーに権限を追加する記述
<追加したユーザ名>   ALL=(ALL)       ALL 　#追加する
```

以上で、新規で作成したユーザに十分な権限を与えましたが、

b. 次に、デフォルトの認証鍵 takahashi.pemではない鍵を使うことで、ログインするユーザを新規のものに変えていきます。

```Bash
$ cd ~/.ssh
$ ssh-keygen -t rsa
```

```Bash
-----------------------------
Enter file in which to save the key ():id_rsa # ファイルの名前を記述し、Enter
Enter passphrase (empty for no passphrase): # 何もせずそのままEnter
Enter same passphrase again: # 何もせずそのままエンター
-----------------------------
```

これで、新しいユーザ用の認証キーができました。

c. **リモート**にて、

```Bash
[test@ip-10-0-1-40 ~]$ mkdir .ssh #ssh用のディレクトリを作って
[test@ip-10-0-1-40 ~]$ chmod 700 .ssh　# オーナーだけに全ての権限を付与
[test@ip-10-0-1-40 ~]$ cd .ssh 
[test@ip-10-0-1-40 ~]$ vim authorized_keys # vimが開く　慣習的にもauthorized_keysを作成して
-----------------------------
ssh-rsa sdfjerijgviodsjcI........
#ローカルで作成した公開鍵の中身を貼り付けて、vimを閉じる
-----------------------------
[test@ip-10-0-1-40 ~]$ chmod 600 authorized_keys # 権限を編集
[test@ip-10-0-1-40 ~]$ exit #test ログアウト
[ec2-user@ip-10-0-1-40 ~]$ exit #ec2-user ログアウト
```

```Bash
# どうしても、あの忌まわしいec2-userを消したいなら
$ sudo userdel -r ec2-user
```

d. 動作確認

```Bash
ssh web
また、bundle exec cap production deployで進んでいるかを確認する。
```

# エラーアンドエラー

```Bash
root@f92788328c5a:/recorda-me# bundle exec cap production deploy
00:00 git:wrapper
      01 mkdir -p /tmp
    ✔ 01 deploy@web 0.144s
      Uploading /tmp/git-ssh-b8b736ef2fc13cabafc5.sh 100.0%
      02 chmod 700 /tmp/git-ssh-b8b736ef2fc13cabafc5.sh
    ✔ 02 deploy@web 0.121s
00:00 git:check
      01 git ls-remote git@github.com:syosyo10337/recorda-me.git HEAD
      01 005b3c871dd4c1a06895f09c71ba3a1ac1d10894	HEAD
    ✔ 01 deploy@web 2.312s
00:02 deploy:check:directories
      01 mkdir -p /var/www/recorda-me/shared /var/www/recorda-me/releases
    ✔ 01 deploy@web 0.081s
00:02 deploy:check:linked_dirs
      01 mkdir -p /var/www/recorda-me/shared/log /var/www/recorda-me/shared/tmp/pids /v…
    ✔ 01 deploy@web 0.129s
00:03 deploy:check:make_linked_dirs
      01 mkdir -p /var/www/recorda-me/shared/config
    ✔ 01 deploy@web 0.112s
00:03 deploy:check:linked_files
      ERROR linked file /var/www/recorda-me/shared/config/database.yml does not exist o…
root@f92788328c5a:/recorda-me#
```

- やること、shareファイルの部分の設定を見直しましょう。

- なんかcapistranoによって、なにかしらのディレクトリが作成されるみたいよ？