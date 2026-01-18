---
tags:
  - kubernetes
  - k8s
  - kubectl
  - resource
  - scheduling
created: 2026-01-18
status: active
---

# Pod Schedulingについて

Podのスケジューリングを制御することは、本番での安定稼働のために重要なポイントです。
同じNodeにPodを載せないことで、障害に備えたり、特定のPod専用のNodeを立ち上げるなどです。

## Nodeを指定する(`nodeSelector`)

`nodeSelector`は、Nodeのラベルを指定することで、Podを特定のNodenのみにスケジュールすることができます。
Nodeに付与されているラベルを指定します。

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: nginx
spec:
  containers:
  - name: nginx
    image: nginx:1.25.3
  nodeSelector:
    disktype: ssd #このラベルを持つNodeにのみスケジュールされます。
```

## Nodeを指定する(`nodeAffinity`)
