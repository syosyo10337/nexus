---
tags:
  - kubernetes
  - k8s
  - disruption
created: 2026-01-21
status: active
---

# アプリケーションの可用性保証する(Pod Disruption Budget: PDB) について

Pod Disruption Budget(PDB)は、Pod破壊予算みたいな日本語です。
サービスがダウンしては困るアプリケーションにはこれを設定します。

- MinAvailable: 最低いくつのPodが利用可能な状態であるか？(最低限必要なPodの数)
- MaxUnavailable: 最大幾つ同時に停止できるPodがあっても良いか？(可溶性の許容値？)

```yaml
apiVersion: policy/v1
kind: PodDisruptionBudget
metadata:
  name: hello-server-pdb
spec:
  minAvailable: 2
  selector:
    matchLabels:
      app: hello-server
```

## Disruptionの方法
