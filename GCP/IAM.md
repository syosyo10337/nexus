---
tags:
  - gcp
  - iam
  - cloud-run
  - vertex-ai
created: 2026-01-03
status: active
---

# IAM

# サービスアカウントの作成

```Bash
cloud iam service-accounts create <name> \
  --display-name="Chimer Wiki Slack Bot Deployment SA" \
  --description="Service account for deploying and managing the Chimer Wiki Slack Bot on Cloud Functions" \
  --project=syoya-internal
```

# ロールの付与

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

```Bash
SA_EMAIL="chimer-wiki-slack-bot@syoya-internal.iam.gserviceaccount.com"
REPO="syoya/chimer-wiki"

# Workload Identity ユーザーロールを付与（GitHub Actions からサービスアカウントを使用できるようにする）
gcloud iam service-accounts add-iam-policy-binding "$SA_EMAIL" \
  --project=syoya-internal \
  --role="roles/iam.workloadIdentityUser" \
  --member="principalSet://iam.googleapis.com/projects/877688327905/locations/global/workloadIdentityPools/github-actions-for-avalon/attribute.repository/$REPO"

echo ""
echo "✅ Workload Identity binding created for repository: $REPO"
```

# 権限の確認

```Bash
gcloud projects get-iam-policy <prj-name>\
  --flatten="bindings[].members" \
  --filter="bindings.members:"<SA-acount>" \
  --format="table(bindings.role)"
```