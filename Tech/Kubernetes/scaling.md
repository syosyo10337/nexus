---
tags:
  - kubernetes
  - k8s
  - scaling
created: 2026-01-20
status: active
---

# Scalingについて

Scalingは、Podの数を増やすことを意味します。

## Podの数をScalingする基本的なコマンド

```bash
k scale deployment <deployment-name> --replicas=<number>
```

## Horizontal Pod Autoscaler(HPA)

Horizontal Pod Autoscaler(HPA)は、Podの数を自動でスケールするためのコントローラーです。
通常は,
CPUやメモリの値に応じてPodを増減しますが、任意のメトリクスを利用して対応することも可能です。

## 参考

- [Tech/CS/Vertical and Horizontal Scaling.md](/Tech/CS/Vertical%20and%20Horizontal%20Scaling.md)
