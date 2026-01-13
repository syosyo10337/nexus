---
tags:
  - kubernetes
  - k8s
  - replicaSet
  - deployment
  - pod
created: 2026-01-13
status: active
---

# ReplicaSetとDeploymentについて

ReplicaSetとDeploymentは、Kubernetesのリソースの一種です。

ReplicaSetは、Podの複数のインスタンスを管理するためのリソースです。
Deploymentは、ReplicaSetを管理するためのリソースです。

## ReplicaSet

ReplicaSetは、指定した数のPodを複製・維持するためのリソースです。
`replicas`で複製する数を指定します。

### 例

```yaml
apiVersion: apps/v1
kind: ReplicaSet
metadata:
  name: httpserver
  labels:
    app: httpserver
spec:
  replicas: 3
  selector:
    matchLabels:
      app: httpserver # templateのlabelsと一致している必要があります
  template:
    metadata:
      labels:
        app: httpserver
    spec:
      containers:
      - name: nginx
        image: nginx:1.25.3
```

### コマンド

```bash
kubectl get replicaset
```

## Deployment

Deploymentは、ReplicaSetを複数紐づけるPod冗長化のさらに上位概念です。
これによってrollout（更新）を管理することができます。

Deploymentは、ReplicaSetを管理するためのリソースで、アプリケーションの更新戦略や履歴管理を提供します。

### 例

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
  labels:
    app: nginx
spec:
  replicas: 3
  selector:
    matchLabels:
      app: nginx # templateのlabelsと一致している必要があります
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:1.24.0
        ports:
        - containerPort: 80
```

### コマンド

```bash
kubectl get deployment
```

## StrategyType

Deploymentを用いてPodを更新する際に、どのように更新するかのタイプを指定します。

以下の2種類があります：

- **RollingUpdate**: 一部のPodを更新し、更新が終わったら次のPodを更新する（段階的更新）
- **Recreate**: 全てのPodを同時に更新する（一括更新）

RollingUpdateの場合は、`rollingUpdate`で更新の速度を指定することができます。

### Recreateの場合

全てのPodを一度に停止してから新しいPodを作成します。
ダウンタイムが発生する可能性がありますが、シンプルな更新方法です。

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
  labels:
    app: nginx
spec:
  replicas: 10
  strategy:
    type: Recreate # StrategyTypeの指定
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:1.24.0
        ports:
        - containerPort: 80
        lifecycle:
          preStop:
            exec:
              command: ["/bin/sh", "-c", "sleep 10"]
```

### RollingUpdateの場合

段階的にPodを更新するため、ダウンタイムを最小限に抑えられます。
更新の速度を制御するパラメータを指定できます。

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
  labels:
    app: nginx
spec:
  replicas: 10
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxUnavailable: 25%
      maxSurge: 100%
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:1.24.0
        ports:
        - containerPort: 80
        lifecycle:
          preStop:
            exec:
              command: ["/bin/sh", "-c", "sleep 10"]
```

#### RollingUpdateのパラメータ

- **maxSurge**: 最大で何個のPodを新規作成できるか（新旧合わせて何個までいけるか）
  - 例: `maxSurge: 25%`の場合、10個のPodがある場合は、2個まで新規作成できる（切り上げ）
  - 例: `maxSurge: 100%`の場合、10個のPodがある場合は、10個まで新規作成できる

- **maxUnavailable**: 最大で何個のPodを同時にシャットダウンできるか
  - 例: `maxUnavailable: 25%`の場合、10個のPodがある場合は、2個まで同時にシャットダウンできる（切り下げ）

**注意**: `maxUnavailable`は切り下げ、`maxSurge`は切り上げで計算されます。


### コマンド

```bash
# Deploymentの更新状況を確認
kubectl rollout status deployment <deployment-name>

# Deploymentの更新履歴を確認
kubectl rollout history deployment <deployment-name>

# 前のバージョンにロールバック
kubectl rollout undo deployment <deployment-name>
```

## 参考

- [Kubernetes Documentation - Deployments](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/)

