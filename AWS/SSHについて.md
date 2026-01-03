 

# SSHについて

---

### Secure SHellの略

---

暗号/認証技術を用いた遠隔でコンピュータを操作するプロトコルやそのアプリケーションソフトウェアのこと。  
(リモートログインしてサーバーをいじるとか)。公開.秘密鍵方式を利用する。

基本書式

```Bash
$ ssh <ログインユーザ名>@<宛先IPアドレス>
#この後対象ホストへの登録確認プロンプトとパスワード入力に関するプロンプトが出て、ログインができる

#クラウドなどの遠隔地にあるLinuxサーバにログインする場合は、セキュリティの観点から、sshによるログイン方式が取られることが多い。

#opt) -i 秘密鍵ファイルでの認証をとる
ex)
$ ssh -i <秘密鍵ファイル名> <ログインユーザ名>@<宛先IPアドレス>
```

ref)Telnet —暗号化されてないSSH 汎用的な双方向8bit通信を提供する端末,および通信プロトコル。デフォルトだと、Telnetサーバーに繋がれるがHTTPの80番ポートと通信をすることもできる

### SSHで用いるキーペアを用意する

---

キーペアは作業する人に属するものであるので、名前には作業者の名前などが好ましい。(Linux/Unixでのファイル形式は.pem)

.ssh/ディレクトリ下に保存するのが望ましいかな。

# sshの多段接続をする

---

例えば、private-subnetに存在するwebサーバーに接続したい。と考えたときに、自身のコンピュータからリモートで接続するには、

①PC →②bastion server(inVPC) →③web server(inVPC private)という形で接続する必要があるので、　

②→③の際に②の踏み台サーバーにも秘密鍵ファイルを置いておく必要がある。セキュリティの観点から踏み台サーバーにkeyファイルを置きたくない。

==このようなときに使えるのが、sshの多段接続==

手順としては、

1. .ssh/下にconfigファイルを作成する。

2. 設定ファイルを記述する。

3. 設定したsshコマンドをショートハンドで実行する

## ssh config ファイルの設定

---

ex)(.ssh/config)

```Shell
Host bastion
    Hostname 54.249.14.98
    User ec2-user
    IdentityFile ~/.ssh/takahashi.pem

Host web01
    Hostname 10.0.65.242
    User ec2-user
    IdentityFile ~/.ssh/takahashi.pem
    ProxyCommand ssh bastion -W %h:%p

Host web02
    Hostname 10.0.91.13
    User ec2-user
    IdentityFile ~/.ssh/takahashi.pem
    ProxyCommand ssh bastion -W %h:%p
```

---

### Host

---

以下に接続するサーバー毎の設定を書いていく。Hostの後にエイリアスをつけることができる。（`Host bastion`のbastion部分）

==このエイリアスはconfigファイルを設定したユーザのみが使うことができる。==

### Hostname

---

接続先となるサーバーのIPアドレスもしくは、サーバー名を指定する。プラベートDNSを設定したあとはそのドメイン名の指定ができるよ

多段接続の形をとる場合には、接続先となるサーバーの接続元となるサーバーからみた値で指定すること。

ex)web01での**Hostname**は、接続元になるbastionからみたプライベートIPアドレス。

### User

---

接続する時のユーザ名を指定する

awsで特段なにもなければec2-user

### IdentityFile

---

秘密鍵ファイルのパスを指定する。

実際にsshコマンドを打つ、多段接続の大元の接続元のコンピュータのファイルパスを記述する。(exの場合にはあなたの開発マシン上のパスです。)

### ProxyCommand

---

 設定中のホストへ接続するときに、経由するサーバーの情報を指定する。

(exでは、エイリアスを使って指定している。)

他のオプションの部分は定型的に覚えてしまいましょう。

`ProxyCommand ssh bastion -W %h:%p`

### StrictHostKeyChecking

---

```Plain

e.g.)
Host *.foo.com
	StrictHostKeyChecking no
	UserKnownHostsFile /dev/null
```

- 初めてのホスト(publickeyを持つ側)に接続する際に、クライアント側は、known_hosts/に追加するかなど、yes/noの解答を求められることがある。

参考)コマンドラインの設定側で無視したい時

```Bash
$ ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null foo.com
```

[

sshのホスト鍵を無視する方法

設定(設定ファイル、コマンド行引数)によりますが、 ssh は、未知のホストに接続するときに、ホスト鍵を known_hosts に追加するか聞いてきたり、ホスト鍵が変更されたときに接続を拒否したりします。安全ではないということを承知で、それでもホスト鍵を無視したいときには、StrictHostKeyCheckingを設定します。 読み方 StrictHostKeyChecking すとりくと ほすと きー ちぇっきんぐ ssh の設定の１つに StrictHostKeyChecking があり、このオプションは、「厳格なホスト鍵のチェック」を指示します。 取りうる値は、以下の通りです。 yes の場合の動作は、以下の通りです。 sshコマンドは、known_hosts ファイルに自動的にホスト鍵を追加しません。 鍵が変更されている場合には、ホストへの接続を拒否します。 トロイの木馬攻撃に対して、最大の防御となります。 no の場合の動作は、以下の通りです。 ask の場合の動作は、以下の通りです。 sshコマンドは、known_hosts ファイルに追加するかユーザに確認します。 鍵が変更されている場合には、ホストへの接続を拒否します。 トロイの木馬攻撃に対して、最大の防御となります。 StrictHostKeyChecking no とした場合、新しいノードに接続したときに、 known_hosts に追加されます。しかしながら、ホスト鍵が変更された場合、 known_hosts から削除する必要があります。 UserKnownHostsFile を使用することで、ホスト鍵の削除を省くことができます。 ssh_config ($HOME/.ssh/config) で、ホスト鍵を無視するには、以下の設定を行います。 Host *.foo.com StrictHostKeyChecking no UserKnownHostsFile /dev/null

![](https://kaworu.jpn.org/favicon.ico)https://kaworu.jpn.org/security/ssh%E3%81%AE%E3%83%9B%E3%82%B9%E3%83%88%E9%8D%B5%E3%82%92%E7%84%A1%E8%A6%96%E3%81%99%E3%82%8B%E6%96%B9%E6%B3%95#ssh_config.E3.81.A7.E7.84.A1.E8.A6.96.E3.81.99.E3.82.8B.E6.96.B9.E6.B3.95



](https://kaworu.jpn.org/security/ssh%E3%81%AE%E3%83%9B%E3%82%B9%E3%83%88%E9%8D%B5%E3%82%92%E7%84%A1%E8%A6%96%E3%81%99%E3%82%8B%E6%96%B9%E6%B3%95#ssh_config.E3.81.A7.E7.84.A1.E8.A6.96.E3.81.99.E3.82.8B.E6.96.B9.E6.B3.95)

# 自分で秘密鍵を生成する

---

自分で秘密鍵を生成し、公開鍵を接続先に登録してみる。

EC2インスタンスを作成する際には、公開鍵は自動で置かれて、秘密鍵はDL画面が開かれますが,shellコマンドでも再現できます。(むしろこっちのほうが先では)

```Bash
# 秘密鍵を生成したディレクトリにて、、
$ ssh-keygen -t rsa
# opt)-t <方式>	作成する鍵の暗号化形式を「rsa」（デフォルト）、「dsa」「ecdsa」「ed25519」から指定するオプション
```

# ssh-agent

---

秘密鍵を事前に登録することで, ssh接続の際に毎回`-i`での鍵を指定、パスの入力をしなくて良くなる。

秘密鍵の認証処理を代行してくれるプログラム。sshに同梱されている。

## 1. ssh-agentの起動と停止

```Bash
# 起動する
$ ssh-agent bash
または
$ eval `ssh-agent`
もしくは
# eval "$(ssh-agent -s)"

# 停止する
$ ssh-agent -k
```

## 2. ssh-agentに秘密鍵の追加

```Bash
ssh-add [秘密鍵へのパス]	秘密鍵を登録する
ssh-add -l	登録されている鍵のFingerprints一覧を表示する
ssh-add -L	登録されている鍵の公開鍵一覧を表示する
ssh-add -d [秘密鍵へのパス]	登録されている鍵を削除する
ssh-add -D	登録されている全ての鍵を削除する
```

[

【SSH】ssh-agentの使い方を整理する - Qiita

ssh-agentの使い方の備忘録メモ ssh-add コマンド ssh-add [秘密鍵へのパス] 秘密鍵を登録する ssh-add -l 登録されている鍵のFingerprints一覧を表示する ss...

![](AWS/Attachments/production-c620d3e403342b1022967ba5e3db1aaa%201.ico)https://qiita.com/Yarimizu14/items/6a4bab703d67ea766ddc

![](AWS/Attachments/article-ogp-background-9f5428127621718a910c8b63951390ad%203.png)](https://qiita.com/Yarimizu14/items/6a4bab703d67ea766ddc)

[

ssh-agentの使い方や秘密鍵の転送機能もご紹介！ | テックマガジン from FEnetインフラ

今回は、ssh-agentの便利な使い方を紹介します。 通常、ssh接続時にはパスフレーズを入力しますが、毎回入力するのは面倒です。そこで、秘密鍵を登録することでパスフレーズを入力不要にしてくれるのがssh-agentです。 ssh-agentには、秘密鍵の転送機能もあります。これらの使い方について紹介します。 ssh-agentに興味のある方はぜひご覧ください。 ...

https://www.fenet.jp/infla/column/server/ssh-agent%E3%81%AE%E4%BD%BF%E3%81%84%E6%96%B9%E3%82%84%E7%A7%98%E5%AF%86%E9%8D%B5%E3%81%AE%E8%BB%A2%E9%80%81%E6%A9%9F%E8%83%BD%E3%82%82%E3%81%94%E7%B4%B9%E4%BB%8B%EF%BC%81/

![](AWS/Attachments/ssh-agentの使い方.jpg)](https://www.fenet.jp/infla/column/server/ssh-agent%E3%81%AE%E4%BD%BF%E3%81%84%E6%96%B9%E3%82%84%E7%A7%98%E5%AF%86%E9%8D%B5%E3%81%AE%E8%BB%A2%E9%80%81%E6%A9%9F%E8%83%BD%E3%82%82%E3%81%94%E7%B4%B9%E4%BB%8B%EF%BC%81/)

# linux サーバ側での準備

- sshサーバソフトをinstall

```Shell
sudo apt -y install openssh-server
```

- 起動

```Shell
sudo systemctl start ssh
```

- 状態確認

```Shell
sudo systemctl status ssh
```