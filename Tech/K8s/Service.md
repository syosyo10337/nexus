---
tags:
  - kubernetes
  - k8s
  - service
created: 2026-01-14
status: draft
---

# Serviceについて
例えば、DeploymentはIPを持たないので、Deploymentで作成したリソースにアクセスする際には、IPが割り振られているPod個々にアクセスが必要。

Serviceは、Podのグループを管理するためのリソースです。

## 例

```yaml
apiVersion: v1
kind: Service