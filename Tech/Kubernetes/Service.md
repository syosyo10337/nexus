---
tags:
  - kubernetes
  - k8s
  - service
created: 2026-01-14
updated: 2026-01-15
status: active
---

# Serviceについて

Serviceは、Podグループへ安定したネットワークアクセスを提供するためのリソースです。

DeploymentはIPを持たないため、Deploymentで作成したリソースにアクセスする際には、IPが割り振られているPod個々にアクセスする必要があります。また、Rolling UpdateでPodが増えたり減ったりするため、IPが変わる可能性があります。Serviceを使用することで、これらの問題を解決し、安定したエンドポイントを提供できます。

## 基本的な例

```yaml
apiVersion: v1
kind: Service
metadata:
  name: hello-server-service
spec:
  selector:
    app: hello-server # Serviceを利用したいPodのラベルと一致させる
  ports:
    - protocol: TCP
      port: 8080
      targetPort: 8080 # 利用するコンテナが開放しているPort
```

### Serviceの確認

```bash
# Service一覧を取得
kubectl get service
# または短縮形
kubectl get svc

# 特定のServiceの詳細を確認
kubectl get svc <service_name>
kubectl describe svc <service_name>
```

## Serviceのタイプ

Serviceリソースにはいくつかのタイプがあり、指定されない場合は`ClusterIP`がデフォルトになります。

- **ClusterIP**: クラスタ内からのみアクセス可能なIP（Ingressで外部公開可能）
- **NodePort**: すべてのNodeのIPアドレスで指定したポート番号を公開する
- **LoadBalancer**: 外部LBを使って外部IPアドレスを公開する（クラウドプロバイダーが必要）
- **ExternalName**: Serviceを`externalName`フィールドの内容にマッピングする（例: `api.example.com`）。これによりクラスタのDNSサーバがその外部ホスト名を持つCNAMEレコードを返すように設定される（あまり使われない）

### ClusterIP（デフォルト）

```yaml
apiVersion: v1
kind: Service
metadata:
  name: hello-server-service
spec:
  type: ClusterIP # 省略可能（デフォルト）
  selector:
    app: hello-server
  ports:
    - protocol: TCP
      port: 8080
      targetPort: 8080
```

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
      nodePort: 30599 # 30000-32767の範囲で指定（省略時は自動割り当て）
```

NodePortは全Nodeに対してPortを紐づけるので、`port-forward`を設定しなくて良くなります。本番環境では`ClusterIP`や`LoadBalancer`を使うことが多いです。

> **Tip:** kindを使った場合のkindクラスタの追加設定
> 
> ```yaml
> kind: Cluster
> apiVersion: kind.x-k8s.io/v1alpha4
> nodes:
>   - role: control-plane
>     extraPortMappings:
>       - containerPort: 30080  # NodePort のポート
>         hostPort: 30080       # ホストマシンに公開
>         protocol: TCP
> ```

### LoadBalancer

```yaml
apiVersion: v1
kind: Service
metadata:
  name: hello-server-lb
spec:
  type: LoadBalancer
  selector:
    app: hello-server
  ports:
    - port: 80
      targetPort: 8080
```

クラウドプロバイダー（AWS、GCP、Azureなど）で使用可能。外部ロードバランサーが自動的に作成されます。

## Serviceを利用したDNS

Kubernetesでは、Service用のDNSレコードを自動で作成してくれるため、FQDNを覚えておくと便利です。

通常、Serviceは `<service_name>.<namespace>.svc.cluster.local` というFQDNになります。

> **Tip:** FQDN（Fully Qualified Domain Name）は、ドメイン名 + ホスト名 + ポート番号のこと。
> 
> 例: `hello-server.default.svc.cluster.local:8080`
> 
> 同じNamespace内では、Service名だけでアクセス可能: `hello-server:8080`

### ServiceのIPを調べる

```bash
# ServiceのIPアドレスを確認
kubectl get svc -o custom-columns=NAME:.metadata.name,IP:.spec.clusterIP

# より詳細な情報
kubectl get svc -o wide
```

## Headless Service

`clusterIP: None`を指定することで、Headless Serviceを作成できます。これは、ServiceのIPアドレスを割り当てず、各PodのIPアドレスを直接返すServiceです。StatefulSetと組み合わせて使用されることが多いです。

```yaml
apiVersion: v1
kind: Service
metadata:
  name: headless-service
spec:
  clusterIP: None
  selector:
    app: my-app
  ports:
    - port: 8080
      targetPort: 8080
```

## 参考

- [Kubernetes Documentation - Services](https://kubernetes.io/docs/concepts/services-networking/service/)
- [Kubernetes Documentation - Service Types](https://kubernetes.io/docs/concepts/services-networking/service/#publishing-services-service-types)
