---
tags: 
    - kubernetes
    - k8s
    - architecture
    - infrastructure
created: 2026-01-28
status: active
---

# Kubernetes アーキテクチャとアーティキュレーション

Kubernetes のアーキテクチャは、システムの「あるべき姿 (Desired State)」を維持するために、各コンポーネントが明確な役割を持って連携（アーティキュレーション）する構造になっています。

## 1. 全体構造

クラスタは大きく分けて、全体を管理する**コントロールプレーン**と、実際に Pod を実行する**ワーカーノード**で構成されます。

![Kubernetes Architecture](./assets/k8s-architecture.png)

### コントロールプレーン (Control Plane)

クラスタの「脳」にあたる部分です。

- **kube-apiserver**: すべての操作の窓口となるフロントエンド。
    REST API serverです。
- **etcd**: クラスタの状態を保存するデータベース。
    分散型key-value storeです。
- **kube-scheduler**: Pod をどのノードに配置するか決定する。
    Affinityなどの制御はこいつによって行われる
- **kube-controller-manager**: Kubernetesを最低限動かすために必要な複数のコントローラを動かしています。
    コントローラの例
    e.g.
  - ReplicationController
  - Node Lifecycle Controller

#### 中身を確認する

- control planeを調べる

```bash
 k get pod -n kube-system
```

- etcdに保存されているデータをkube-apiserverから取得する

```bash
k get po --v 7 -n kube-system 
```

### ワーカーノード (Worker Node)

実際にアプリケーションコンテナを起動するNode。

- **kubelet**: クラスタ内の各のNodeで動作し、Pod内に紐づくコンテナを起動・管理する。kubeletがいるNodeにPodがスケジュールされると、コンテナランタイムに指示して、コンテナを起動する。
- **kube-proxy**: ネットワーク通信のルーティングを管理する。OSのネットワーク機能（iptables等）を利用して、Serviceの仮想IPアドレスへの通信を、適切なPodのIPアドレスへ転送・負荷分散する。
- **コンテナランタイム**: コンテナを実行するソフトウェアの実体。
  - **CRI (Container Runtime Interface)**: Kubernetes がコンテナランタイムと通信するための標準インターフェース。
  - **containerd**: Docker のコア部分（実行エンジン）を切り出したもので、現在のデファクトスタンダード。
  - **CRI-O**: Kubernetes 専用に設計された軽量なランタイム。
  - ※以前は Docker を直接使用していたが、現在は CRI 準拠の軽量なバイナリ（containerd 等）を直接利用する構成が標準となっている。

## 2. アーティキュレーション形態（コンポーネント間の連携）

Kubernetes の特徴的な「アーティキュレーション（連携形態）」は、**自律分散型**であることです。

### 疎結合な連携

コンポーネント間は直接通信せず、すべて **API サーバ** を介してやり取りします。これにより、特定のコンポーネントが一時的に停止しても、稼働中のコンテナに直接的な影響が出にくい堅牢な構造（フォルトレラント）を実現しています。

### 宣言的 API と Reconciliation Loop

- **宣言的 (Declarative)**: ユーザーは「何をしたいか（例：Pod を 3 つ動かしたい）」という「あるべき姿」を定義します。
- **Reconciliation Loop**: コンポーネントが常に「現在の状態」と「あるべき姿」を比較し、差分があれば自動で修正します。この繰り返しのサイクルこそが、Kubernetes アーキテクチャの核心です。

## 3. 通信のフロー

1. **定義**: `kubectl` 等でマニフェストを API サーバに送信。
2. **永続化**: API サーバが `etcd` に状態を書き込む。
3. **割り当て**: スケジューラが空いているノードを選び、その情報を API サーバに更新。
4. **実行**: 対象ノードの `kubelet` が変更を検知し、コンテナを起動。
5. **公開**: `kube-proxy` が通信をルーティングし、サービスが利用可能になる。

---
> 関連ファイル: [[README]], [[Pod]], [[Service]]
