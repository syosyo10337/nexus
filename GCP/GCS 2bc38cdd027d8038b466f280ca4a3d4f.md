 

# GCS

[バケットの作成](#2bc38cdd-027d-8073-bf02-d10281ab31c8)

[リージョンやクラスを指定する](#2bc38cdd-027d-80a6-af23-e34f7cbab867)

[各フラグの意味](#2bc38cdd-027d-802f-a2a5-cbd41c2cc5ce)

[バケットへ追加](#2bd38cdd-027d-8090-bd74-f460fe7bb2bf)

# バケットの作成

基本のコマンドは以下です。

```Bash
gcloud storage buckets create gs://[バケット名]
```

### リージョンやクラスを指定する

本番環境などで利用する場合、データの置き場所（リージョン）やストレージクラスを指定するのが一般的です。

**例：東京リージョン (**`**asia-northeast1**`**) に、標準クラス (**`**STANDARD**`**) で作成する場合**

```Bash
gcloud storage buckets create gs://<bucket_name> \
--location=asia-northeast1 \
--default-storage-class=STANDARD \
--uniform-bucket-level-access \
--project=<project_id>
```

### 各フラグの意味

|   |   |   |
|---|---|---|
|**フラグ**|**説明**|**設定例**|
|`--location`|データの保存場所（リージョン）。指定しないとUSマルチリージョンになります。|`asia-northeast1` (東京)  <br>`asia-northeast2` (大阪)  <br>`US` (米国マルチ)|
|`--default-storage-class`|データの保存コストと頻度に関わるクラス設定。|`STANDARD` (高頻度・標準)  <br>`NEARLINE` (月1回程度)  <br>`COLDLINE` (四半期に1回程度)|
|`--uniform-bucket-level-access`|**推奨設定**。アクセス権限をバケット単位で統一管理し、セキュリティを強化します（ACLの無効化）。|(値なし・フラグのみ記述)|
|`--project`|gcプロジェクトを指定する||

# バケットへ追加

`gcloud storage rsync`は双方向同期コマンド

[https://docs.cloud.google.com/sdk/gcloud/reference/storage/rsync](https://docs.cloud.google.com/sdk/gcloud/reference/storage/rsync)[sync](https://docs.cloud.google.com/sdk/gcloud/reference/storage/rsync)

```Plain
gcloud storage rsync -r -d ./dist \
  gs://${{ secrets.GCS_BUCKET_NAME }}/docs \
  --add-header="Content-Type:text/html"
```