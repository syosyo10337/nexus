# Kubernetes入門

"宣言的"(declarative)ツール。手続き型ツールとしてAnsibleとかがあるらしい。
"Desired State"を定義するツールです。



# Kubernetesの特徴

1. Reconciliation Loopによって、障害から自動復旧を試みる
Desired Stateになるように自動で動く

> reconciliation: 和解、調和などの意味
> cf. https://ejje.weblio.jp/content/reconciliation


2. IaCとしてインフラ設定をyamlで管理できる
設定用のyamlファイルは、マニフェストと呼ぶらしい。
コンテナの仕様(最小メモリなど)をIacとしてマニフェストに記述することで、個別に管理する必要がなくなります。


3. KubernetesAPIがインフラレイヤを抽象化するため、サーバ固有の設定を知る必要がない。
OSの種類や外部公開の手段などが書かれなくて済む
```yaml
apiVersion: v1
kind: Service
metadata:
    name: my-service
spce:
    type: NodePort
    selector:
        app.kubernetes.io/name: myapp
    ports:
        - port: 80
          targetPort: 80
          nodePort: 30007
```


# kubernetesのアーキテクチャ
大きく分けるとControl Plane Worker Nodeがある。
重要な要素として、"Control PlaneはWorker Nodeを直接指示しない”というものがある。
Worker NodeがControle Planeに問い合わせる方式を取ることで、Controle Planeが壊れても、即座にWorkerNode上に起動するコンテナが破壊されるわけではない。

## Control Plane
(Podのスケジュール先など)の決まった内容がControl Planeによって決められる
## Worker Node
実際にコンテナを起動する。


# 主なKubernetesクラスタ構築方法
- ローカル
- クラウドベンダー

# Podという概念
コンテナーの集合


