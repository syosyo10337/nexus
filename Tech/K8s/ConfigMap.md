---
tags:
  - kubernetes
  - k8s
  - configMap
created: 2026-01-15
status: draft
---

# Podの外部から情報を読み込む:ConfigMap
環境変数など、コンテナ外部から値を設定したい時に利用する。
詳しい利用方法としてはいかがあります

1. コンテナ内のコマンドの引数として　読み込む
1. コンテナの環境変数として読み込む
1. volumeを利用して、アプリケーションのファイルとして読み込む 

## コンテナの環境変数としてよみこむ
```yaml
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: hello-server
  labels:
    app: hello-server
spec:
  replicas: 1
  selector:
    matchLabels:
      app: hello-server
  template:
    metadata:
      labels:
        app: hello-server
    spec:
      containers:
      - name: hello-server
        image: blux2/hello-server:1.4
        env:
        - name: PORT
          valueFrom:
            configMapKeyRef:
              name: hello-server-configmap
              key: PORT
---
apiVersion: v1
kind: ConfigMap
metadata:
  name: hello-server-configmap
data:
  PORT: "5050"
```

data:に配列で<key,value>を指定する。
```yaml
data:
 KEY: VALUE
```

ConfigMap経由で設定した環境変数は、アプリケーションを再起動しないと反映されません。
