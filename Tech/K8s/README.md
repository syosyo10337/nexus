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
コンテナの仕様(最小メモリ)
3. KubernetesAPIがインフラレイヤを抽象化するため、サーバ固有の設定を知る必要がない。


# Podという概念
コンテナーの集合