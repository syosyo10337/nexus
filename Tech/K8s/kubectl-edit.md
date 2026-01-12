---
tags:
  - kubernetes
  - k8s
  - kubectl
  - edit
created: 2026-01-12
status: draft
---
# 概要
kubectl editコマンドは、Kubernetesのリソースを編集するためのコマンドです。
障害時などにリソースを編集するためのコマンドです。

## マニフェストその場を編集する(`kubectl edit`)
リソースマニフエストが修正できますが、編集差分を認識しづらいので緊急時以外は正規の手順ででkubectl applyを使うことをお勧めします。
```bash
kubectl edit <resource_name>
```

## リソースを編集する(`kubectl edit`)
```bash
kubectl edit <resource_type> <resource_name>