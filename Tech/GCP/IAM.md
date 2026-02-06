---
tags:
  - gcp
  - iam
  - cloud-run
  - SA
  - vertex-ai
created: 2026-01-03
status: active
---

# IAM

## サービスアカウントの作成

```Bash
gcloud iam service-accounts create <name> \
  --display-name="Chimer Wiki Slack Bot Deployment SA" \
  --description="Service account for deploying and managing the Chimer Wiki Slack Bot on Cloud Functions" \
  --project=syoya-internal
```

## ロールの付与

```Bash
# Secret Manager Secret Accessor ロールを付与
gcloud projects add-iam-policy-binding syoya-internal \
  --member="serviceAccount:$SA_EMAIL" \
  --role="roles/secretmanager.secretAccessor" \
  --condition=None
```

```Bash
gcloud iam workload-identity-pools list --location=global --project=syoya-internal --format="table(name,displayName,state)"
```

## 権限の確認

```Bash
gcloud projects get-iam-policy <prj-name>\
  --flatten="bindings[].members" \
  --filter="bindings.members:"<SA-acount>" \
  --format="table(bindings.role)"
```

### 特定のサービスアカウントにポリシーに追加する

```bash
# GCPのプロジェクトID
export PROJECT_ID="avalon-project-id"

# 使おうとしている Service Account のメールアドレス (secrets.AVALON_SA_EMAIL_GCR の中身)
export SERVICE_ACCOUNT_EMAIL="my-sa-name@${PROJECT_ID}.iam.gserviceaccount.com"

# GitHubのリポジトリ名 (例: your-org/your-repo)
export REPO="avalon-org/avalon-nest"

# Workload Identity Pool のID (プロバイダーIDではなくPool ID)
# secrets.AVALON_GCP_WORKLOAD_IDENTITY_PROVIDER... の中にある ".../workloadIdentityPools/【ここ】/providers/..." の部分
export WORKLOAD_IDENTITY_POOL="avalon-pool"

# プロジェクト番号を取得

export PROJECT_NUMBER=$(gcloud projects describe $PROJECT_ID --format="value(projectNumber)")

# GitHubリポジトリ全体に対して、このSAの使用許可を与える

gcloud iam service-accounts add-iam-policy-binding "${SERVICE_ACCOUNT_EMAIL}" \
  --project="${PROJECT_ID}" \
 --role="roles/iam.workloadIdentityUser" \
 --member="principalSet://iam.googleapis.com/projects/${PROJECT_NUMBER}/locations/global/workloadIdentityPools/${WORKLOAD_IDENTITY_POOL}/attribute.repository/${REPO}"

```
