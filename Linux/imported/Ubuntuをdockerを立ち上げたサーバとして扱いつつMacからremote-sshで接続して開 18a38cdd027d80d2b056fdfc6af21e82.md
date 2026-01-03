 

# Ubuntuをdockerを立ち上げたサーバとして扱いつつMacからremote-sshで接続して開発する

[概要](#18a38cdd-027d-803a-a854-db5c1eec29e2)

[やること](#18a38cdd-027d-8089-9b04-ebfaebd37a2c)

[1. (Linux) sshサーバ側での準備](#18a38cdd-027d-8094-8350-d0717c34cd01)

[2. sshkeyをつかって通信するようにする。](#18a38cdd-027d-8011-b94c-cd539eb3a8f7)

[3. 接続](#18a38cdd-027d-8033-9540-c8c30db05fe6)

奮闘記:

[https://chatgpt.com/share/6799a816-04ac-800e-958c-3286e6ff1129](https://chatgpt.com/share/6799a816-04ac-800e-958c-3286e6ff1129)

# 概要

UbuntuマシンをLAN上にsshサーバとして起動する。

そのマシンに対してmacからSSHで接続する。(cursor/vscode等々それぞれのIDEで環境を用意していることもあるので楽ちん）

# やること

1. [SSHサーバの用意](Ubuntu%E3%82%92docker%E3%82%92%E7%AB%8B%E3%81%A1%E4%B8%8A%E3%81%92%E3%81%9F%E3%82%B5%E3%83%BC%E3%83%90%E3%81%A8%E3%81%97%E3%81%A6%E6%89%B1%E3%81%84%E3%81%A4%E3%81%A4Mac%E3%81%8B%E3%82%89remote-ssh%E3%81%A7%E6%8E%A5%E7%B6%9A%E3%81%97%E3%81%A6%E9%96%8B%2018a38cdd027d80d2b056fdfc6af21e82.html)

2. [サーバ・クライアントの設定に必要な情報を確認する](Ubuntu%E3%82%92docker%E3%82%92%E7%AB%8B%E3%81%A1%E4%B8%8A%E3%81%92%E3%81%9F%E3%82%B5%E3%83%BC%E3%83%90%E3%81%A8%E3%81%97%E3%81%A6%E6%89%B1%E3%81%84%E3%81%A4%E3%81%A4Mac%E3%81%8B%E3%82%89remote-ssh%E3%81%A7%E6%8E%A5%E7%B6%9A%E3%81%97%E3%81%A6%E9%96%8B%2018a38cdd027d80d2b056fdfc6af21e82.html)

3. 接続

## 1. (Linux) sshサーバ側での準備

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

## 2. sshkeyをつかって通信するようにする。

今回は、mac(client) → Ubuntu(server)という前提なので、mac/linuxの表示がそれぞれクライアントとサーバに対応すると思ってください。

1. macでsshkeyを作成する。(なければ）

```Shell
# 生成コマンド -t: タイプ選択、-b: 鍵の長さ, -c: コメント
ssh-keygen -t rsa -b 4096 -C "your_email@example.com"
# 確認コマンド id_rsa/id_rsa.pubがそれぞれ、秘密・公開鍵だよ。
ls ~/.ssh/
```

b. linuxに公開鍵をcopyする。

```Shell
ssh-copy-id user@<LinuxマシンのIPアドレス>

# copyされているかを確認するコマンド
cat ~/.ssh/authorized_keys
```

c. (linux)sshサーバの設定を確認する

受け取った公開鍵で認証するためには、以下の設定が必要。

```Shell
PubkeyAuthentication yes
PasswordAuthentication no
```

d.(optional mac)ssh/configを記載する。

以下を参考に必要な情報を入れる。hostに指定した名前でsshコマンドを呼び出せるようになる。

```Shell
Host linux-machine
  User takahashimasanao
  HostName 192.168.128.199
  Port 22
  IdentityFile ~/.ssh/id_rsa
  IdentitiesOnly yes
  TCPKeepAlive yes
  AddKeysToAgent yes
```

(番外編). linuxマシンのipを確認する。

```Shell
ip a/ip address showとか？
```

```Shell
2: wlp0s20f3: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1472 qdisc noqueue state UP group default qlen 1000
    link/ether 8c:b8:7e:da:d7:f7 brd ff:ff:ff:ff:ff:ff
    inet 192.168.128.199/24 brd 192.168.128.255 scope global dynamic noprefixroute wlp0s20f3
       valid_lft 74479sec preferred_lft 74479sec
    inet6 240a:61:50e6:6f4a:f3fa:770d:a8d0:f461/64 scope global temporary dynamic 
       valid_lft 592877sec preferred_lft 74062sec
    inet6 240a:61:50e6:6f4a:b7b4:70fe:5fc8:885d/64 scope global mngtmpaddr noprefixroute 
       valid_lft forever preferred_lft forever
    inet6 fe80::c2df:ebb0:3b07:7269/64 scope link noprefixroute 
       valid_lft forever preferred_lft forever
```

(番外編)ipがあっているか確認するためのコマンド

```Shell
# 疎通確認
ping <IP>

# sshでの疎通確認

ssh <user>@<ip address>
```

# 3. 接続

```Shell
ssh {config name}
e.g. ssh linux-machine
```