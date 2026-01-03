---
tags:
  - docker
  - dockerfile
  - compose
  - container
created: 2026-01-03
status: active
---

# Evil martians流の環境構築のメモ

---

[Aptfileの小技](#6536d711-0bdc-406f-b645-9843809fb8ad)

[パッケージのローカルリポジトリと、一時ファイルも削除してスリムに保つ](#8cd11039-8b7f-4c7f-9d96-f5d87279b87e)

[bundlerバージョンの指定](#1ca6df7c-9072-4cd3-b5d4-b78bf991cef5)

[compose.yamlの解説](#0def2a01-1304-4e9a-bf22-697ba44f731c)

[`x-app`拡張](#937d77a0-2050-406a-b8de-77eab42e6c57)

[tmpfs](#8563a69d-4756-470e-ab67-b8d3992b9bb6)

[`x-backend`サービス](#1600445d-2714-4df3-95d5-f8fd59e368a9)

# Aptfileの小技

```Docker
COPY Aptfile /tmp/Aptfile
RUN apt-get install\
    $(grep -Ev '^\s*#' /tmp/Aptfile | xargs)
```

ビルドパックを使うと、ローカル環境とproduction環境で同じAptfileを再利用することも可能になります。

Aptfileには画像を整形したいならimagemagickなど適宜、アプリ固有のパッケージをインストールするとよい。

dafaultではvimだけ入っているって。

# パッケージのローカルリポジトリと、一時ファイルも削除してスリムに保つ

---

```Docker
apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/* 
	&& truncate -s 0 /var/log/*log
```

`apt-get clean`

/var/cache/apt以下のファイル(パッケージのローカルリポジトリ?)を削除して、

`rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*`

で、インストール中に作成される一時ファイルを削除

`truncate -s 0 /var/log/*log`

で、ログファイルもファイルサイズを0にしている。

これらの工夫はDockerレイヤにゴミを残さないため。

# bundlerバージョンの指定

---

bundler 2.3.0以降はGemfile.lockの`BUNDLED_WITH`  
で定義されているのと同じバージョンのBundlerをわざわざ手動でインストールする必要がなくなりました

# compose.yamlの解説

---

## `x-app`拡張

主な目的は、上記のDockerfileで定義されているアプリケーションコンテナをビルドするのに必要なすべての情報を提供することです。

### tmpfs

---

linuxで使える一時的にデータを格納するために使えるファイルシステムです。

tmpfsをマウントするだけで、パーティションのようにファイルの読み書きなどに使用することができます。

ただしメモリ上に作成されるので、電源を落としたり再起動をするとファイルは消えてしまいます。

```YAML
tmpfs:
  - /tmp
  - /app/tmp/pids
```

コンテナ内の`/tmp`（およびアプリケーションの`tmp/pids`）に[tmpfs](https://docs.docker.com/v17.09/engine/admin/volumes/tmpfs/#choosing-the-tmpfs-or-mount-flag)  
を利用するようDockerに指示しています。こうすることで、コンテナ終了時に`server.pid`  
が残らなくなり、いまいましい”A server is already running”エラーとおさらばできます。

## `x-backend`サービス

すべてのRubyサービスに共通する振る舞いを定義します。

まずボリュームについて見ていきましょう。