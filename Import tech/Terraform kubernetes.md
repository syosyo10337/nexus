 

# Terraform? kubernetes?

Terraformは動作環境自体を指定する。

- デスクのサイズなどなど。AWSなどでポチポチしている部分をcode化する

Kubernetesはコンテナのオーケストレーションサービスです。

# Kubernetes で MySQL を動かす

apiVersion: apps/v1  
kind: StatefulSet  
metadata:  
name: mysql  
spec:  
replicas: 1  
template:  
spec:  
containers:  
- name: mysql  
image: mysql:8.0  
volumeMounts:  
- name: mysql-data  
mountPath: /var/lib/mysql  
volumeClaimTemplates:

- metadata:  
    name: mysql-data  
    spec:  
    resources:  
    requests:  
    storage: 20Gi

```Plain

**デメリット:**
- バックアップ、復旧、スケーリングを自分で管理
- ステートフルなのでKubernetesと相性が微妙

---

## 対比表（完全版）

| ローカル | クラウド | 役割 |
|---------|---------|------|
| 自分のPC (固定スペック) | **Terraform** (スペック定義) | マシンの構成 |
| docker-compose.yaml | **Kubernetes** (YAML) | コンテナの定義・運用 |
| docker-compose の mysql | **Terraform** (Cloud SQL) | DB |
| docker-compose の redis | **Terraform** (Memorystore) or **K8s** | キャッシュ |
| localhost:3000 | **Kubernetes** Service/Ingress | ネットワーク |
| .env ファイル | **Kubernetes** Secret/ConfigMap | 環境変数・設定 |

---

## 図解
```

ローカル:  
┌──────────────────────────────┐  
│ あなたのPC (変更不可) │ ← 買ったスペックで固定  
│ ┌────────────────────────┐ │  
│ │ Docker Engine │ │  
│ │ ┌─────┐ ┌─────┐ │ │  
│ │ │ api │ │mysql│ ... │ │ ← docker-compose で定義  
│ │ └─────┘ └─────┘ │ │  
│ └────────────────────────┘ │  
└──────────────────────────────┘

クラウド:  
┌──────────────────────────────┐  
│ GCP (Terraform で定義) │ ← スペックをコードで書く  
│ ┌────────────────────────┐ │  
│ │ GKE Cluster │ │ ← Terraform で作成  
│ │ ┌─────┐ ┌─────┐ │ │  
│ │ │ api │ │redis│ ... │ │ ← Kubernetes で定義  
│ │ └─────┘ └─────┘ │ │  
│ └────────────────────────┘ │  
│ │  
│ ┌────────────────────────┐ │  
│ │ Cloud SQL (MySQL) │ │ ← Terraform で作成  
│ └────────────────────────┘ │  
└──────────────────────────────┘