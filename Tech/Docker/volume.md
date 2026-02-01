---
tags:
  - docker
  - dockerfile
  - container
  - network
created: 2026-01-03
status: active
---

# Dockerのデータ管理 (Volume / Bind Mount)

Dockerコンテナのファイルシステムは、デフォルトでは「エフェメラル（一時的）」です。コンテナが削除されると、その中で作成・変更されたデータもすべて失われます。
データを永続化したり、ホスト・コンテナ間で共有したりするために、Dockerには主に3つの仕組み（Mount types）が用意されています。

1. **Volumes** (Docker管理領域)
2. **Bind Mounts** (ホストの任意パス)
3. **tmpfs mounts** (メモリ上 - 非永続)

---

## 1. Volumes（推奨）

Dockerが管理する領域（Linuxでは `/var/lib/docker/volumes/`）にデータを保存します。
**最も推奨されるデータ永続化の方法**です。

- **特徴**:
  - Dockerが完全に管理するため、ホストのファイルシステム構成に依存しない。
  - 名前を付けて管理できる（**Named Volumes**）。
  - 複数のコンテナから安全に共有できる。
- **適した用途**: データベースのデータ保存、ログの永続化など。

### ボリュームの使い方

#### Named Volume（名前付きボリューム）

名前を指定して作成するボリュームです。

```bash
# ボリュームの作成
$ docker volume create my-data

# ボリュームをコンテナにマウント (ターゲット: /app/data)
$ docker run -d --name app -v my-data:/app/data nginx
```

#### Docker Compose での書き方 (Volumes)

`volumes` キーを使用して定義します。名前付きボリュームの場合は、トップレベルにも `volumes` セクションが必要です。

```yaml
services:
  web:
    image: nginx
    volumes:
      - my-data:/app/data

volumes:
  my-data: # 名前付きボリュームの定義
```

#### Anonymous Volume（匿名ボリューム）

名前を指定せずに作成されるボリュームです。コンテナ削除時に `--rm` フラグを付けていないとゴミとして残りやすいため、注意が必要です。

```bash
# コンテナパスのみ指定すると匿名ボリュームになる
$ docker run -v /data ubuntu touch /data/testfile
```

---

## 2. Bind Mounts

ホストマシンの特定のディレクトリやファイルを、コンテナ内に直接マウントします。

- **特徴**:
  - ホスト側の絶対パスを指定する。
  - ホスト側でファイルを編集すると、即座にコンテナ内に反映される。
  - ホストのファイルシステム構造に依存する。
- **適した用途**: **開発環境でのソースコード同期**、ホスト上の設定ファイルの共有。

### バインドマウントの使い方

```bash
# ホストの $(pwd)/src をコンテナの /app にマウント
$ docker run -d -v $(pwd)/src:/app nginx

# --mount フラグを使う方法 (より明示的で推奨される書き方)
$ docker run -d \
  --mount type=bind,source="$(pwd)"/src,target=/app \
  nginx
```

#### Docker Compose での書き方 (Bind Mounts)

相対パス（`./`）を使用すると、自動的にバインドマウントとして扱われます。

```yaml
services:
  web:
    image: nginx
    volumes:
      - ./src:/app # ホストの./srcをコンテナの/appにマウント
```

> [!IMPORTANT]
> **Volume vs Bind Mount の使い分け**
>
> - **Volume**: データ（DB等）の永続化、コンテナ間共有。
> - **Bind Mount**: 開発中のソースコード同期（ホットリロード等）。

---

## 3. Data Volume コンテナ (Legacy)

以前のDocker（v1.9以前）でよく使われていた、データを保持するためだけのコンテナを介して共有する手法です。

現在は **Named Volumes を使うことが推奨されている**ため、新規にこのパターンを採用する理由はほとんどありません。

### 仕組み

1. データを保持する専用コンテナ（例: `db-data`）を作る。
2. 他のコンテナから `--volumes-from` を使ってそのコンテナのボリュームを継承する。

```bash
# 1. データの入れ物となるコンテナを作成
$ docker run --name data-container -v /dbdata busybox

# 2. --volumes-from でそのデータを参照
$ docker run --volumes-from data-container ubuntu ls /dbdata
```

---

## データのバックアップとリストア

ボリューム内のデータをバックアップする場合、一時的なコンテナを使用してホスト側にアーカイブを書き出す手法が一般的です。

### バックアップの例

`db-vol` というボリュームの内容を、現在のディレクトリに `backup.tar.gz` として保存する例：

```bash
$ docker run --rm \
  -v db-vol:/source \
  -v $(pwd):/backup \
  busybox \
  tar cvzf /backup/backup.tar.gz -C /source .
```

- `-v db-vol:/source`: バックアップ元のボリュームをマウント
- `-v $(pwd):/backup`: ホストのカレントディレクトリをマウント
- `tar ...`: `/source` を固めて `/backup` (ホスト側) に出力
- `--rm`: 実行終了後にこの一時コンテナを自動削除
