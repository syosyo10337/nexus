---
tags:
  - kubernetes
  - k8s
  - kubectl
  - debug
created: 2026-01-11
status: draft
---

参照系のkubectlコマンドでも、情報が足りない場合は以下のコマンドなどを使うことでデバッグ作業が捗ります。

# デバッグ用のサイドカー コンテナを立ち上げる
```bash 
kubectl debug --stdin --tty <pod_name> \
  --image=<debug container image> \
  --target=<target container> \
  
