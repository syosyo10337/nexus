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
