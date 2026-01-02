 

# [Capistrano]SSHログインの接続設定(踏み台を含む)v3の罠

以下の記法で、`deploy/<ステージ名>.rb`を記述しても、Capistrano3系ではうまく動作しませんでした。

最初は、書いたことで繋がっていると思いましたが、  
結局は==動作環境上の~/.ssh/configファイルを参照しているようでした。==

```Bash

set :ssh_options, {
  keys: %w(~/.ssh/id_rsa.pem),
  forward_agent: false,
  user: 'deploy',
  proxy: Net::SSH::Proxy::Command::new('ssh bastion_user@bastion_server.com -W %h:%p')
}
```

### 実際に動作を確認した設定。

```Bash
server 'web', user: 'deploy', roles: %w[app db web]
set :ssh_options, {
  keys: ['~/.ssh/takahashi.pem']　# takahashi.pemの部分は秘密鍵の名前
}
```

==実行環境上の~/.ssh/configを参照して,==名前解決やら何やらやってくれる。

## 結論

Capistrano３でも、[the underlying Net::SSH API](https://github.com/capistrano/sshkit/blob/master/EXAMPLES.md#setting-global-ssh-options)を使って,sshの複雑な接続を記述できるらしい。がしかし非推奨。

> however in many cases it is preferred to use the system SSH configuration file at [`~/.ssh/config`](http://man.cx/ssh_config)  
> 訳文）  
> しかしながら、大半のケースにおいてシステム上のSSH設定ファイルである [`~/.ssh/config`](http://man.cx/ssh_config)を用いることが好ましいです。

ref)

[

GitHub - capistrano/sshkit: A toolkit for deploying code and assets to servers in a repeatable, testable, reliable way.

SSHKit is a toolkit for running commands in a structured way on one or more servers. Connect to 2 servers Execute commands as deploy user with RAILS_ENV=production Execute commands in serial (default is :parallel) Many other examples are in EXAMPLES.md. The on() method is used to specify the backends on which you'd like to run the commands.

![](https://github.com/favicon.ico)https://github.com/capistrano/sshkit#tunneling-and-other-related-ssh-themes

![](sshkit.png)](https://github.com/capistrano/sshkit#tunneling-and-other-related-ssh-themes)

[

capistrano3 permission denied (using proxy)

I'm having some troubles with my production script, because I've got a proxy (EC2 instance) before my production servers (EC2 instances too); in my capistrano v2 script all was working, now I'm using cap-ec2 + capistrano v3.4 to deploy my application only to tagged servers, but when I try it I get "Permission Denied", my production servers refuse my key.

![](https://ssl.gstatic.com/images/branding/product/1x/groups_32dp.png)https://groups.google.com/g/capistrano/c/hobUx2KBTM4/m/--qH8PTvudwJ?pli=1

![](https://fonts.gstatic.com/s/i/productlogos/groups/v9/web-48dp/logo_groups_color_1x_web_48dp.png)](https://groups.google.com/g/capistrano/c/hobUx2KBTM4/m/--qH8PTvudwJ?pli=1)

//circlCIの規定のファイルたち

```Bash
circleci@8c266a727970:~/.ssh$ ls
config  id_rsa  id_rsa_a1a6dc87b3121282230033090dbac82b  id_rsa.pub  known_hosts
circleci@8c266a727970:~/.ssh$ cat config 

Host *
  IdentitiesOnly no
  IdentityFile /home/circleci/.ssh/id_rsa_a1a6dc87b3121282230033090dbac82b
circleci@8c266a727970:~/.ssh$
```

add_ssh_keys: を使ってセットすると、　

自動的にcircleCIのコンテナ内の

`$HOME/.ssh/id_rsa_<fingerprint>`

に登録されます。

$HOMEは自分で記述して下さい

`~/.ssh/id_rsa_<fingerprint>`

と書くか、デフォルトだと

`/home/circleci/.ssh/id_rsa_<フィンガーブリンと>`

考えている対応

takahashi.pemをfingreprintを用いてCircleCIコンテナには入れたので、

1. .ssh/configをcircleCIにぶち込んで、シークレットな情報はあとで変数で渡す  
    → このようにすることで、capistranoの設定をいじくる必要がない

2. capistrano(v3.x)設定ファイルのみを使って、proxy等設定を書き殴る。

## 実際の対策

どうやら、capistrano3での設定はそもそも推奨されていないし、使い勝手が悪いので、

circleCIで実行される環境へもssh configファイルを置いてあげる方法で、対応した。

実際の鍵をSSH KEYを追加する機能で足した上で、zz