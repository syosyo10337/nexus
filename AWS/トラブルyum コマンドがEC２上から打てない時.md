 

⚰️

# [トラブル]yum コマンドがEC２上から打てない時

privatewebサーバーに必要なDBクライアントモジュールをインストールしようとした時にできなかった話。

---

## 状況

privateWEBサーバー→NATゲートウェイ→外部で通信と行えるように設定しておいた。

接続できなかったエラーとしては,赤字部分になる。

```Bash
[root@ip-192-168-5-129 ec2-user]# yum -y update
Loaded plugins: extras_suggestions, langpacks, priorities, update-motd
```

### 考察・理解してなかった内容

ここでVPC上のインスタンスについて、defaultで作成されるプライベートDNS名とIP、設定しないと作成されないパブリックDNSとIPについて考えたい。

VPCの設定でDNSホスト名とDNS解決を有効にする項目があり、プライベートなサブネットにインスタンスをおくことを考えると、DNSホスト名については必ずしも有効にする必要はない。

ただし、**DNS解決が無効になっていると、NATから外部と通信する際にDNS解決が行われず、通信ができない。。**

ということが今回の原因のはず。

### 参考

[

https://qiita.com/masato930/items/dcae89e9389093644136



](https://qiita.com/masato930/items/dcae89e9389093644136)