---
tags:
  - kubernetes
  - k8s
  - secret
  - configuration
created: 2026-01-15
status: draft
---

# Podの外部から機密情報を読み込む:Secret
Secretは、機密情報（パスワード、トークン、キーなど）を安全に保存するためのKubernetesリソースです。
Secretを利用することで、機密情報をコンテナ内に直接保存することなく、Kubernetesクラスタ内で安全に管理できます。
Base64でエンコードして登録する必要があります。
