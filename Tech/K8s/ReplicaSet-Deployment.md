---
tags:
  - kubernetes
  - k8s
  - replicaSet
  - deployment
  - pod
created: 2026-01-13
status: draft
---

# ReplicaSetとDeploymentについて

ReplicaSetとDeploymentは、Kubernetesのリソースの一種です。

ReplicaSetは、Podの複数のインスタンスを管理するためのリソースです。
Deploymentは、ReplicaSetを管理するためのリソースです。

## ReplicaSet
ReplicaSetは、指定した数のPodへ複製するリソースです。
replicasで複製する数を指定します。


```yaml
# e.g.)
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
      app: httpserver #templateのlabelsと一致している必要があります。
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
```
kubectl get replicaset 
```


## Deployment
Replicasetを複数紐づけるPod冗長化のさらに上位概念。これによってrolloutを管理することができる。
c
Deploymentは、ReplicaSetを管理するためのリソースです。

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
      app: nginx #templateのlabelsと一致している必要があります。
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

-  リソースの確認
```bash
k get deployment
```

### StrategyType
Deploymentを用いてPodを更新する際に、どのように更新するかのタイプのこと。

- RollingUpdate: 一部のPodを更新し、更新が終わったら次のPodを更新する。
- Recreate: 全てのPodを同時に更新する。
の2種類があります。

RollingUpdateの場合は `RollingUpdateStrategy`で更新の速度を指定することができます。

#### ReCreateの場合
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
    type: Recreate #StrategyTypeの指定
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
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
  labels:
    app: nginx
spec:
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxUnavailable: 25%
      maxSurge: 100%
  replicas: 10
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

- maxSurge: 最大で何個のPodを新規作成できるか？(新旧合わせて何個までいけるか？ってこと e.g. 25%の場合は、10個のPodがある場合は、2個まで新規作成できる)
- maxUnavailable: 最大で何個のPodを同時にシャットダウンできるか？ 

cf. https://kubernetes.io/docs/concepts/workloads/controllers/deployment/


### コマンド
```
kubectl rollout status deployment <deployment-name>
```



