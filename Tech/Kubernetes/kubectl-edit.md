---
tags:
  - kubernetes
  - k8s
  - kubectl
  - edit
created: 2026-01-12
status: active
---
# 概要

kubectl editコマンドは、Kubernetesのリソースを編集するためのコマンドです。
障害時などにリソースを編集するためのコマンドです。

## マニフェストその場を編集する(`kubectl edit`)

リソースマニフエストが修正できますが、編集差分を認識しづらいので緊急時以外は正規の手順ででkubectl applyを使うことをお勧めします。

```bash
kubectl edit <resource_name>
```

## リソースを削除する(`kubectl delete`)

kubectlには再起動コマンドが存在しないので、deleteで削除するという操作は意外と使われるらしい。

Deploymentで一部問題がある場合は、Pod deleteとして再起動させることもある。
tips: **deployment全体を再起動したい場合は`kubectl rollout restart`を使うことができます。

```bash
kubectl delete <resource_name>
```

## リソースのイメージを更新する

debug用に使用しているイメージを差し替えたい時など

```bash
k set image <resource_name> <container_name>=<new_image>

# e.g

k set image deploy/hello-server hello-server=blux2/hello-server:1.8
```

## 参考

- [kubectl](./kubectl.md)
- [kubectl-debug](./kubectl-debug.md)
