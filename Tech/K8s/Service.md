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
metadata:
  name: hello-server-service
spec:
  selector:
    app: hello-server #Serviceを利用したいPodのラベルと一致させる
  ports:
    - protocol: TCP
      port: 8080
      targetPort: 8080 # 利用するコンテナが開放しているPort
```

```bash
kubectl get service(svc) <service_name>
```
## SvcのTYPE
serviceリソースはいくつかのタイプがあり、指定されない場合は、ClusterIPがデフォルトになる。
- ClusterIP: クラスタ内からのみアクセス可能なIP(ingressで外部公開可能)
- NodePort: すべてのNodeのIPアドレスで指定したポート番号を公開する
- LoadBalancer: 外部LBを使って外部IPアドレスを公開する。
- ExternalName: ServiceをexternalNameのフィールドの内容にマッピングする(e.g. hostname: api.example.com) これによりクラスタのDNSサーバがその外部ホスト名を持つCNAMEレコードを返すように設定される。


### NodePort

```yaml
apiVersion: v1
kind: Service
metadata:
  name: hello-server-external
spec:
  type: NodePort
  selector:
    app: hello-server
  ports:
    - port: 8080
      targetPort: 8080
      nodePort: 30599 
```


## 参考

- [Kubernetes Documentation - Services](https://kubernetes.io/docs/concepts/services-networking/service/)