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
作成されるクラスタのイメージ
```
kind create cluster --name my-cluster
```

この 1 コマンドで：
```
【Docker 上で動作】
┌─────────────────────────────────────────────────────┐
│                 Docker コンテナ = ノード             │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Control Plane + Worker Node が同時に動作          │
│  (シングルノードクラスタ)                           │
│                                                     │
│  ✅ API Server                                     │
│  ✅ Scheduler                                      │
│  ✅ Controller Manager                             │
│  ✅ kubelet                                        │
│  ✅ kube-proxy                                     │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### 本番クラスタ（複数ノード）の場合
```
┌─────────────────────────────────────────┐
│   Control Plane ノード（マスター）      │
│   - API Server                          │
│   - Scheduler                           │
│   - Controller Manager                  │
│   - etcd                                │
└─────────────────────────────────────────┘
         ↓ 命令・監視 ↑ 状態報告

┌──────────────────┬──────────────────────┐
│ Worker Node 1    │ Worker Node 2        │
│ - kubelet        │ - kubelet            │
│ - kube-proxy     │ - kube-proxy         │
│                  │                      │
│ Pod 1 (app)      │ Pod 3 (app)          │
│ Pod 2 (app)      │ Pod 4 (db)           │
└──────────────────┴──────────────────────┘
```