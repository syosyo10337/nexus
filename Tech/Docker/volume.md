---
tags:
  - docker
  - dockerfile
  - container
  - network
created: 2026-01-03
updated: 2026-02-02
status: active
---

# Dockerのデータ管理 (Volume / Bind Mount)

Dockerコンテナのファイルシステムは、デフォルトでは「エフェメラル（一時的）」です。コンテナが削除されると、その中で作成・変更されたデータもすべて失われます。
データを永続化したり、ホスト・コンテナ間で共有したりするために、Dockerには主に3つの仕組み（Mount types）が提供されています。

## 3つのボリュームタイプの比較

| タイプ | 構文例 | ライフサイクル | 主な用途 |
| :--- | :--- | :--- | :--- |
| **Bind Mount** | `./src:/app` | ホストに依存 | ソースコード共有（開発環境） |
| **Named Volume** | `db_data:/var/lib/mysql` | 明示的に削除するまで永続 | DB データ、共有キャッシュ |
| **Anonymous Volume** | `/app/node_modules` | コンテナ削除時に消える* | 一時的な保護領域、ホスト汚染防止 |

> [!NOTE]
> *匿名ボリュームは、`docker rm -v` や `docker compose down -v` など、明示的にボリューム削除を指定した場合に削除されます。

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

名前を指定せずに作成されるボリュームです。コンテナ内のあるパスをバインドマウント（ホスト共有）から「隠す（マスクする）」ために使われることが多いです。

```bash
# コンテナパスのみ指定すると匿名ボリュームになる
$ docker run -v /data ubuntu touch /data/testfile
```

---

## 2. Bind Mounts

ホストマシンの特定のディレクトリやファイルを、コンテナ内に直接マウントします。

- **特徴**:
  - ホスト側のパスを指定する（相対パス or 絶対パス）。
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

---

## 実際のベストプラクティス（2024-2025年時点）

### ローカル開発での使い分け

| 用途 | 推奨タイプ | 理由 |
| :--- | :--- | :--- |
| ソースコード | Bind Mount | ホットリロードのため |
| `node_modules` | Anonymous Volume | OS 間の互換性問題を回避 (特に Windows/macOS) |
| `.next` (build cache) | Anonymous Volume | ホスト側の汚染を防ぐ |
| DB データ（Postgres等） | Named Volume | コンテナ再作成時もデータを維持するため |

### Anonymous Volume の落とし穴

依存関係を更新（`npm install` など）してイメージを再ビルドした際、既存の匿名ボリュームが残っていると古い内容が参照され続けることがあります。

```bash
# 確実に更新する方法
$ docker compose down
$ docker compose up --build

# またはボリュームも含めて強制再作成
$ docker compose up --build --force-recreate
```

---

## より堅牢な構成パターン

### Pattern A: Anonymous Volume（シンプル派）

`node_modules` などをホスト側のバインドマウントから上書きされないように保護します。

```yaml
services:
  app:
    build: .
    volumes:
      - .:/app              # Bind mount (ソースコード)
      - /app/node_modules   # Anonymous volume (保護)
      - /app/.next          # Anonymous volume (ビルドキャッシュ)
```

### Pattern B: Named Volume（高速・明示的管理）

ボリュームに名前を付けて管理します。キャッシュの再利用が効率的になります。

```yaml
services:
  app:
    volumes:
      - .:/app
      - app_node_modules:/app/node_modules
      - app_next:/app/.next

volumes:
  app_node_modules:
  app_next:
```

### Pattern C: Dev Containers (VS Code)

モダンなチーム開発では、Docker Compose よりも **Dev Containers** でボリューム管理を隠蔽・最適化するのが主流です。

```json
// .devcontainer/devcontainer.json
{
  "name": "Node.js Project",
  "dockerComposeFile": "compose.yaml",
  "service": "app",
  "workspaceFolder": "/app",
  "mounts": [
    "source=node_modules,target=/app/node_modules,type=volume"
  ]
}
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

---

## 参考：Data Volume コンテナ (Legacy)

以前のDocker（v1.9以前）で使われていた手法ですが、現在は **Named Volumes を使うことが推奨されている**ため、新規に採用する必要はありません。
