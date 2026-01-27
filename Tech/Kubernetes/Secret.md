---
tags:
  - kubernetes
  - k8s
  - secret
  - configuration
created: 2026-01-15
status: active
---

# Podの外部から機密情報を読み込む:Secret

Secretは、機密情報（パスワード、トークン、キーなど）を安全に保存するためのKubernetesリソースです。
Secretを利用することで、機密情報をコンテナ内に直接保存することなく、Kubernetesクラスタ内で安全に管理できます。
Base64でエンコードして登録する必要があります。

> tips: how to encode to Base64

```bash
echo -n "your_secret" | base64
```

Secretを読み込む二つの方法

1. コンテナの環境変数として読み込む
2. Volumeを利用して、アプリケーションのファイルとして読み込む

## コンテナの環境変数として読み込む

```yaml
---
apiVersion: v1
kind: Pod
metadata:
  name: nginx-sample
spec:
  containers:
    - name: nginx-container
      image: nginx:1.25.3
      env:
        - name: USERNAME
          valueFrom:
            secretKeyRef:
              name: nginx-secret
              key: username
        - name: PASSWORD
          valueFrom:
            secretKeyRef:
              name: nginx-secret
              key: password
---
apiVersion: v1
kind: Secret
metadata:
  name: nginx-secret
type: Opaque
data:
  username: YWRtaW4=
  password: YWRtaW4xMjM=

```

## Volumeを利用して、アプリケーションのファイルとして読み込む

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: nginx-sample
spec:
  containers:
  - name: nginx-container
    image: nginx:1.25.3
    volumeMounts:
    - name: nginx-secret
      mountPath: /etc/config
  volumes:
  - name: nginx-secret
    secret:
      secretName: nginx-secret
---
apiVersion: v1
kind: Secret
metadata:
  name: nginx-secret
data:
  server.key: ZU05a3UzZWNDcFVMOXpQb0lJdUcycHRaWkM1Q3U0WkNRWFJ5bWxIYWpZdlp5ZmZwTTYK
```

podの中で`cat /etc/config/server.key`でキーを読み込むことができます。
