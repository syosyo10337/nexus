---
tags:
  - kubernetes
  - k8s
  - infrastructure
  - container
  - orchestration
  - IaC
created: 2026-01-06
updated_at: 2026-02-24
status: active
source: つくって、壊して、直して学ぶkubernetes入門
---

# Kubernetes 習得インデックス

Kubernetes に関する学習メモのインデックスです。

## 1. コンセプト・アーキテクチャ

- [Kubernetes とは (このページ)](README.md)：基本コンセプトと特徴
- [アーキテクチャ詳細](architecture.md)：コントロールプレーン、ワーカーノード、連携形態
- [学習環境の構築 (kind)](kind.md)：ローカルでのクラスタ構築

## 2. 基本リソース (Workloads & Config)

- [マニフェストの基本](manifest.md)：YAML による Desired State の定義
- [Pod](Pod.md)：最小単位のデプロイメントオブジェクト
- [ReplicaSet-Deployment](ReplicaSet-Deployment.md)：スケーリングとローリングアップデート
- [Service](Service.md)：ポッド間通信と外部公開の抽象化
- [ConfigMap](ConfigMap.md) / [Secret](Secret.md)：設定値と機密情報の管理
- [Job-CronJob](Job-CronJob.md)：バッチ処理と定期実行

## 3. スケジューリングと柔軟な配置

- [リソース制限](resource.md)：Requests / Limits による計算資源管理
- [Pod のスケジューリング](pod-scheduling.md)：Affinity, Anti-Affinity
- [Taint と Toleration](taint%20and%20toleration.md)：ノードへの配置制限
- [Priority と Preemption](pod%20priority%20and%20Preemption.md)：Pod の優先順位制御

## 4. マニフェスト管理とデプロイ戦略

- [管理ツール比較](manifest-management.md)：Helm vs Kustomize
- [Kustomize](Kustomize.md)：ディレクトリベースのマニフェスト管理
- [CIOps と GitOps](ciops-gitops.md)：デプロイ自動化のアプローチ

## 5. 運用・トラブルシューティング

- [kubectl](kubectl.md)：基本的な使い方とエイリアス
- [kubectl-edit](kubectl-edit.md)：リソースの直接編集
- [kubectl-debug](kubectl-debug.md)：コンテナのトラブルシューティング
- [plugin](plugin.md)：kubectl プラグインによる拡張

## 6. 信頼性と運用管理

- [ヘルスチェック](health-check.md)：Liveness, Readiness, Startup Probe
- [Disruption Budget](disruption.md)：計画メンテ時の可用性維持
- [オートスケーリング](scaling.md)：HPA / VPA による自動拡張
- [オブザーバビリティ](observability.md)：ログ、メトリクス、トレース

---

## Kubernetes の特徴 (抜粋)

1. **Reconciliation Loop**: 常に "Desired State" になるよう自動復旧を試みる。
2. **IaC**: インフラ設定をマニフェスト (YAML) で管理可能。
3. **抽象化**: API サーバがインフラレイヤを抽象化し、サーバ固有の設定を意識させない。
