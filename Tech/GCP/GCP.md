---
tags:
  - gcp
  - iam
  - cloud-run
  - gcs
created: 2026-01-03
status: active
---

![](import/Attachments/icons8-google%E3%81%AE%E3%82%AF%E3%83%A9%E3%82%A6%E3%83%89%E3%83%97%E3%83%A9%E3%83%83%E3%83%88%E3%83%95%E3%82%A9%E3%83%BC%E3%83%A0.svg)

# GCP

# プロジェクトを確認

```Bash
# 現在のプロジェクトを確認する
gcloud config get-value project

# プロジェクトを一覧する
gcloud projects list

# 特定のプロジェクトをセットする
gcloud config set project <prj-name>
```

# ユーザ/権限を確認

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
    
 # 特定のサービスアカウントにポリシーに追加する。
 gcloud iam service-accounts add-iam-policy-binding \
  "workflow-service-account@syoya-internal.iam.gserviceaccount.com" \
  --role="roles/iam.workloadIdentityUser" \
  --member="principalSet://iam.googleapis.com/projects/877688327905/locations/global/workloadIdentityPools/github-actions-for-avalon/attribute.repository/syoya/chimer-wiki"
```

[IAM](GCP/IAM%202cc38cdd027d8061802af2d672ebb2af.html)

[GCS](GCP/GCS%202bc38cdd027d8038b466f280ca4a3d4f.html)

[![](GCP/Attachments%201/SecOps-512-color-rgb.svg)Secrets](GCP/Secrets%202cc38cdd027d809096e0dd22b91d1762.html)

[Workload Identity](GCP/Workload%20Identity%202bd38cdd027d80f7b45cf0563f4376f2.html)

[🏐Cloud Run functions](GCP/Cloud%20Run%20functions%202cc38cdd027d809e8b3ceef92a081ce3.html)

[Vertex AI Applications](GCP/Vertex%20AI%20Applications%202bc38cdd027d8023ac75ccc94edc90fc.html)