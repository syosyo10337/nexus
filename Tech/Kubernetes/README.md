---
tags: [kubernetes, k8s, infrastructure, container, orchestration, IaC]
created: 2026-01-06
status: active
source: つくって、壊して、直して学ぶkubernetes入門
---

# Kubernetes 習得インデックス

Kubernetes に関する学習メモのインデックスです。

## 1. コンセプト・アーキテクチャ

- [[README|Kubernetes とは (このページ)]]：基本コンセプトと特徴
- [[architecture|アーキテクチャ詳細]]：コントロールプレーン、ワーカーノード、連携形態
- [[kind|学習環境の構築 (kind)]]：ローカルでのクラスタ構築

## 2. 基本リソース (Workloads & Config)

- [[manifest|マニフェストの基本]]：YAML による Desired State の定義
- [[Pod]]：最小単位のデプロイメントオブジェクト
- [[ReplicaSet-Deployment]]：スケーリングとローリングアップデート
- [[Service]]：ポッド間通信と外部公開の抽象化
- [[ConfigMap]] / [[Secret]]：設定値と機密情報の管理
- [[Job-CronJob]]：バッチ処理と定期実行

## 3. スケジューリングと柔軟な配置

- [[resource|リソース制限]]：Requests / Limits による計算資源管理
- [[pod-scheduling|Pod のスケジューリング]]：Affinity, Anti-Affinity
- [[taint and toleration|Taint と Toleration]]：ノードへの配置制限
- [[pod priority and Preemption|Priority と Preemption]]：Pod の優先順位制御

## 4. マニフェスト管理とデプロイ戦略

- [[manifest-management|管理ツール比較]]：Helm vs Kustomize
- [[Kustomize]]：ディレクトリベースのマニフェスト管理
- [[ciops-gitops|CIOps と GitOps]]：デプロイ自動化のアプローチ

## 5. 運用・トラブルシューティング

- [[kubectl]]：基本的な使い方とエイリアス
- [[kubectl-edit]]：リソースの直接編集
- [[kubectl-debug]]：コンテナのトラブルシューティング
- [[plugin]]：kubectl プラグインによる拡張

## 6. 信頼性と運用管理

- [[health-check|ヘルスチェック]]：Liveness, Readiness, Startup Probe
- [[disruption|Disruption Budget]]：計画メンテ時の可用性維持
- [[scaling|オートスケーリング]]：HPA / VPA による自動拡張
- [[observability|オブザーバビリティ]]：ログ、メトリクス、トレース

---

## Kubernetes の特徴 (抜粋)

1. **Reconciliation Loop**: 常に "Desired State" になるよう自動復旧を試みる。
2. **IaC**: インフラ設定をマニフェスト (YAML) で管理可能。
3. **抽象化**: API サーバがインフラレイヤを抽象化し、サーバ固有の設定を意識させない。
