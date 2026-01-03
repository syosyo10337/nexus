---
tags:
  - docker
  - dockerfile
  - container
created: 2026-01-03
status: active
---

⛴️

# Docker学習メモ

[Dockerはコンテナと呼ばれる仮想化技術です。](#5437a1c8-6a6c-4029-9e79-c6da9280b1f8)

[コンテナ型仮想化技術(より砕くと)](#551c0a94-5cf1-4ba9-8cf5-dcdebb9bb998)

[DockerfileでDocker Imageを自作する。](#4e40547b-b8e5-4765-80e4-2faf87e26f24)

[**Docker Hub へアップロード**](#8a99ce48-b903-4409-8676-823419ca62b1)

## Dockerはコンテナと呼ばれる仮想化技術です。

---

コンテナはLinuxカーネルの機能を用いた技術で、cgroup・namespace・Capabilityのような機能を組み合わせて実現しています。VMと比べて、ホストOSとリソースを共有することで、オーバーヘッドが小さく、高速かつ軽量。このことから、OSレベル仮想化とも呼ばれている

- cgroup

メモリ・CPUのような計算リソースを隔離するための機能で、コンテナへリソースの割り当てと制限を行います。コンテナはそれぞれ専用の計算リソースを割り当て、他のコンテナにはお互いにアクセスできないようにします。そして割り当てられたリソースを消費しても他のコンテナに影響を及ぼさないように制限を行ってくれます。

- namespace

同じく隔離のための技術です。namespaceはプロセスやネットワーク、ファイルアクセスなど複数の種類があり、それぞれが異なるリソースの隔離を行います。

- Capability

スーパーユーザーとしての機能を制限するための機能です。DockerコンテナへHostOSのrootユーザーの権限を制限し、最小限の権限を付与/管理を行います。

- .e.g)nginxの起動

```Bash
$ docker run -P nginx
#設定されているポートを公開( -P)
```

## コンテナ型仮想化技術(より砕くと)

仮想化ソフトウェアなしにOSのリソースを隔離し、仮想OSにします。(Cgroups?)この仮想OSをコンテナと呼びます。コンテナを作り出すオーバーヘッドは他の仮想化ソフトウェアより少ない

- over head
    
    ITの分野では、コンピュータで何らかの処理を行う際に、その処理を行うために必要となる付加的、間接的な処理や手続きのことや、そのために機器やシステムへかかる負荷、余分に費やされる処理時間などのことをオーバーヘッドということが多い
    

## DockerfileでDocker Imageを自作する。

---

Docker Image は `Dockerfile` というファイルを記述し、そのファイルを元にビルドすることでスナップショットの作成ができます。

`****Dockerfile****` ****の編集****

ex)

```Docker
FROM ubuntu

COPY hello.txt /tmp/hello.txt

CMD ["cat", "/tmp/hello.txt"]
#ubuntu というDocker Imageをもとに、
#ホストの hello.txt をコンテナの /tmp/hello.txt へコピーして、 #cat /tmp/hello.txt コマンドを実行」という意味になります。
```

Docker Imageのビルド&実行

`docker build`コマンドで `Dockerfile`からDocker Image を作成します。

```Docker
ex)
$ dcoker build -t hello .
#-t hello はdocker imageのタイトルを　helloに指定するオプションで
# . はdocker build 実行時のコンテキストの指定です。 . は COPY コマンドを実行する際にどのディレクトリを起点とするかを指定します。
```

- ローカル環境にある Docker Image一覧を表示

```Bash
$ docker images 
```

### **Docker Hub へアップロード**

ローカルで開発したイメージをステージングや本番環境で動かすにはDockerレジストリにアップロードする必要があります。

DockerレジストリはDocker Image を保存するための場所で、Docker版のGitHubのようなものです。

Docker公式が提供しているDockerHubへ先ほど作成したイメージをアップロードしましょう

☝

AWSの場合"Elastic Container Registry"というDocker レジストリサービスがあります。クラウド上で本番環境を構築する場合には、各クラウドで提供されているレジストリサービスを利用しましょう。

1. Docker ImageをDocker Hubの命名規則に従って命名する。

tagコマンド使って

```Bash
$ docker tag hello masanaot/hello
#ユーザーのオリジナルイメージは 
#<USER NAME>/<IMAGE NAME>:<TAG> という命名にします。
# :<TAG> は省略可能で、省略すると:latestになる
```

2. Docker imageのアップロード

```Bash
$ docker push masanaot/hello
```

==現存するローカルのイメージを削除する==

#チュートリアルの進行上削除する。取得しようとしたイメージがローカル上に存在する時、dockerはそちらを参照してしまうので。

```Bash
#実行中のコンテナを表示
$ docker container ls -a

#実行中のコンテナがあれば、それを削除
$ docker container prune


#ローカルのイメージを削除
$ docker container prune
WARNING! This will remove all stopped containers.
Are you sure you want to continue? [y/N]

#なにもローカル上にイメージがないことを確認する
$ docker images
```

3. Docker Hubから作成したいイメージの取得

```Bash
$ docker pull masanot/hello
# docker pull イメージ名で取得する
```