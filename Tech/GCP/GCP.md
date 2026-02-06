---
tags:
  - gcp
  - iam
  - cloud-run
  - gcs
created: 2026-01-03
status: active
---

# GCP

## プロジェクトを確認

```Bash
# 現在のプロジェクトを確認する
gcloud config get-value project

# プロジェクトを一覧する
gcloud projects list

# 特定のプロジェクトをセットする
gcloud config set project <prj-name>
```

## ユーザ/権限を確認

```Bash
#!/bin/bash

# 変数セット（自動で取得します）
export MY_ACCOUNT=$(gcloud config get-value account)
export PROJECT_ID=$(gcloud config get-value project)

echo "ユーザー: $MY_ACCOUNT"
echo "プロジェクト: $PROJECT_ID"
echo "--- 保有しているロール ---"


# ユーザ権限をget-iam-policyで確認する
gcloud projects get-iam-policy $PROJECT_ID \
    --flatten="bindings[].members" \
    --format="table(bindings.role)" \
    --filter="bindings.members:$MY_ACCOUNT"

```

[IAM](IAM.md)

[GCS](GCS.md)

[Secrets](Secrets.md)

[Workload Identity](Workload%20Identity.md)

[🏐Cloud Run functions](Cloud%20Run%20functions.md)

[Vertex AI Applications](Vertex%20AI%20Applications.md)
