# kind

ローカルでマルチノードでkubernetesをうごかすことが出来るツール
Docker in Dockerのアーキテクチャらしいので最悪dockerコマンドで削除できる

とりあえずクラスタを構築してみる
```
kind create cluster --image=kindest/node:v1.35