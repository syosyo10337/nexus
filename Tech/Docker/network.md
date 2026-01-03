---
tags:
  - docker
  - container
  - network
created: 2026-01-03
status: active
---

🕸️

# network

---

１コンテナ、１プロセスを動かす設計です。実際のアプリケーションを動かす環境を想定した時に、nginxと、php-fpm/ruby on rails (puma?)などと複数プロセスを強調させて動かす必要があり、その際はソケットではんく、ネットワークを通じて通信することが推奨です。そのため、Dockerにおいて、ネットワークの扱いは重要になります。

### dockerがdefaultで持つ2つのNetwork Driver

---

1. bridge

Dockerを使用する際に、基本推奨されるNetwork Driver。

Linuxカーネルのbridgeネットワークを使用するための機能

何も指定せずDocker Container を起動すると `docker0`  
 という名前のbridgeネットワークに所属します。  
Bridgeネットワークの場合には、同一ネットワークのコンテナにはコンテナ名で名前解決が可能です。

2. host

ホストマシンのeth0を直接使用する方法です。

3. (none)

指定なし、起動したコンテナをネットワークに所属させない設定

[![](Screen_Shot_2022-10-25_at_22.01.39.png)](network/Screen_Shot_2022-10-25_at_22.01.39.png)

## 新しいネットワークを作成

---

```Bash
#新しいBridgeネットワークの作成
$ docker network create myapp

#newworkの一覧
$ docker network ls
```

```Bash
#作成したネットワークにnginxをバッググランド起動
$ docker run --name nginx --network=myapp -d nginx

#--network=<ネットワーク名>で指定
#--name <名前> コンテナに名前をつける。
```