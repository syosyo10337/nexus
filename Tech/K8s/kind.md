# kind

ローカルでマルチノードでkubernetesをうごかすことが出来るツール
Docker in Dockerのアーキテクチャらしいので最悪dockerコマンドで削除できる

## とりあえずクラスタを構築してみる
```bash
kind create cluster --image=kindest/node:v1.35
```

## とりあえずクラスタを削除してみる
```bash
kind delete cluster
```

## kindでの存在確認
```bash
kind get clusters
```