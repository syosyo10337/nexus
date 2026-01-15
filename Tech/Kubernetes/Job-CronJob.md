---
tags:
  - kubernetes
  - k8s
  - job
  - cronjob
  - configuration
created: 2026-01-15
status: active
---

# 一度だけ実行されるジョブを実行する:Job

Jobは、一度だけ実行されるPodを立てるためのKubernetesリソースです。

## ジョブの定義

```yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: date-checker
spec:
  template:
    spec:
      containers:
      - name: date
        image: ubuntu:22.04 # ジョブを実行するためのイメージ
        command: ["date"] # コンテナ内で実行するコマンド
      restartPolicy: Never
  backoffLimit: 4
```

### backoffLimitについて

`backoffLimit`は、JobのPodが失敗した際に再試行する最大回数を指定するパラメータです。

- **デフォルト値**: 6回
- **動作**: Podが失敗（非ゼロ終了コード）すると、Kubernetesは新しいPodを作成して再試行します
- **バックオフ戦略**: 再試行間隔は指数バックオフ（exponential backoff）で増加します
  - 1回目: すぐに再試行
  - 2回目: 約10秒後
  - 3回目: 約20秒後
  - 4回目: 約40秒後
  - 以降も指数関数的に増加

上記の例では`backoffLimit: 4`と設定されているため、最大4回まで再試行されます。4回の再試行後も失敗が続く場合、Jobは失敗としてマークされ、それ以上の再試行は行われません。

**注意点**:
- `restartPolicy: Never`の場合のみ、`backoffLimit`が有効です（`restartPolicy: OnFailure`でも有効ですが、通常は`Never`を使用）
- 成功したPodが存在する場合、Jobは成功とみなされ、失敗したPodがあっても再試行は行われません

## CronJobの定義

CronJobは、定期的にジョブを実行するためのKubernetesリソースです。

```yaml
apiVersion: batch/v1
kind: CronJob
metadata:
  name: date
spec:
  schedule: "*/2 * * * *"
  jobTemplate:
    spec:
      template:
        spec:
          containers:
          - name: date
            image: ubuntu:22.04
            command: ["date"]
          restartPolicy: Never
```
tips: cron syntax
```
* * * * *
┌───────────── minute (0 - 59)
│ ┌───────────── hour (0 - 23)
│ │ ┌───────────── day of the month (1 - 31)
│ │ │ ┌───────────── month (1 - 12 or JAN-DEC)
│ │ │ │ ┌───────────── day of the week (0 - 6 or SUN-SAT)
│ │ │ │ │
* * * * *

今回だと、*/2 * * * * は、2分ごとに実行されます。
```
