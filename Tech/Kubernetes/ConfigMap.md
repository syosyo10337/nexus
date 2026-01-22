---
tags:
  - kubernetes
  - k8s
  - configMap
  - configuration
  - environment-variables
created: 2026-01-15
status: active
---

# Podの外部から情報を読み込む:ConfigMap

ConfigMapは、環境変数や設定ファイルなど、コンテナ外部から値を設定したい時に利用するKubernetesリソースです。

主な利用方法としては以下があります：

1. コンテナ内のコマンドの引数として読み込む
2. コンテナの環境変数として読み込む
3. Volumeを利用して、アプリケーションのファイルとして読み込む

## コンテナの環境変数として読み込む

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

`data`フィールドには、キーと値のペアを指定します。

```yaml
data:
  KEY: VALUE
```

**注意**: ConfigMap経由で設定した環境変数は、Podを再起動しないと反映されません。

## ボリュームを利用して、アプリケーションのファイルとして読み込む

ConfigMapの定義方法は同じですが、Pod側でVolumeとしてマウントする点が異なります。この方法では、ConfigMapのデータがファイルとしてコンテナ内にマウントされます。

```yaml
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: hello-server
  labels:
    app: hello-server
spec:
  replicas: 3
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
        image: blux2/hello-server:1.5
        volumeMounts:
        - name: hello-server-config
          mountPath: /etc/config
      volumes:
      - name: hello-server-config
        configMap:
          name: hello-server-configmap
---
apiVersion: v1
kind: ConfigMap
metadata:
  name: hello-server-configmap
data:
  myconfig.txt: |-
    I am hungry.
```
