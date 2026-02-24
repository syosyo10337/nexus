---
tags:
  - kubernetes
  - k8s
  - kubectl
created: 2026-01-11
updated_at: 2026-02-24
status: active
---

# kubectl

k8sを操作するコマンドツール
もう少し具体的にいうと、kube-apiserverと通信するためのCLIツール

## kubectl configについて

`~/.kube/config`に通常設定ファイルは存在します。
クラスタごとに設定が違うことがある。
複数のクラスタが存在する時にその分のcontextがそれぞれのクラスタの設定情報として存在する。

## kubectlコマンド

- クラスタの情報を確認する

```bash
kubectl cluster-info --context=<context>
```

- defaultのcontextを設定するコマンド(毎回 --contextフラグをつけない)

```bash
kubectl config use-context <context_name>
```

- クラスタの起動確認

```bash
kubectl get nodes
```

ただ毎回打つのも面倒なのでkubectxをお勧めする。

- nodeのIPを取得する

```bash
k get node -o jsonpath='{.items[*].status.addresses[?(@.type=="InternalIP")].address}'
```

- マニフェストをクラスタに適用する

```bash
kubectl apply -f/(--filename) <fileName>
```

### Podの状態を確認する

```bash
kubectl get pod --namespace default
```

- 特定のリソース情報のみ取得する

```bash
kubectl get pod <pod名>
```

### 　オプション

`--namespace(-n)`: namespaceを作成できる
`-output(-o)`: IPやNodeの情報が取得できる `-o wide` `-o yaml` yaml形式でリソース情報を取得する
lessコマンドを組み合わせて使ったりする。

tips: 現在のapplyされているマニフェストを出力する。

```bash
kubectl get pod myapp -o yaml -n default > pod.yaml
```

tips: jsonpath形式にして特定のフィールドを参照する

```bash
kubectl get pod myapp --output jsonpath='{.spec.containers[].image}'
```

### リソースの詳細を取得する: `kubectl describe`

```bash
kubectl describe pod <pod名>
```

getよりも詳しい内容がほしいときに役立つ。

### コンテナのログを取得する: `kubectl logs`

logsでコンテナのログが取得できます。これはdockerを似たようなものですね。

```bash
kubectl logs pod <pod名>
```

Podの中に複数containerが存在する時は `--container(-c)`を使うことでコンテナを指定することで絞り込めます。

#### 　特定のDeploymentに紐づくPodのログを参照する

```bash
kubectl logs  deploy/<deployment>
```

#### ラベルを指定して参照するPodを絞りこむ

```bash
kubectl get pod --selector(-l) <labelkey>=<labelvalue>
```

同様にlogsもlabel指定で絞り込むことができます。

## トラブルシューティングの調査フロー

エラーの原因を調査する際の基本的な流れ:

### 1. 全体の状態を確認

まずはリソースの一覧で STATUS や READY を確認する。

```bash
kubectl get pods
kubectl get deploy
kubectl get svc
```

### 2. 異常なリソースを特定

- Pod の STATUS が `Running` 以外 (`Pending`, `CrashLoopBackOff`, `Error` など)
- READY が `0/1` (起動していない)
- RESTARTS が多い (頻繁に再起動している)

### 3. describe で詳細情報を確認

イベントログやエラーメッセージから原因を特定する。

```bash
kubectl describe pod <pod名>
kubectl describe deploy <deployment名>
```

**describe で分かること:**

- イメージの取得エラー (`ImagePullBackOff`)
- リソース不足 (`Insufficient cpu/memory`)
- ボリュームのマウントエラー
- K8s レベルのイベント履歴

### 4. logs でアプリケーションログを確認

Pod は起動しているがアプリケーションが正しく動作していない場合。

```bash
kubectl logs <pod名>
kubectl logs <pod名> -c <container名>  # 複数コンテナの場合
kubectl logs <pod名> --previous        # 前回起動時のログ (CrashLoopBackOff 時)
```

**logs で分かること:**

- アプリケーションのエラーメッセージ
- 環境変数や設定の問題
- 接続エラー (DB やAPI)

### describe と logs の使い分け

| ツール     | 用途                                           | 例                                     |
| ---------- | ---------------------------------------------- | -------------------------------------- |
| `describe` | Pod が起動しない、K8s インフラレベルの問題     | イメージが取得できない、リソース不足   |
| `logs`     | Pod は起動しているがアプリケーションの動作異常 | コード内のエラー、接続エラー、設定ミス |

## 参考

より詳細なデバッグ用のコマンドについては[こちら](kubectl-debug.md)

- [kubectl-edit](kubectl-edit.md)
- [kubectl cheetsheet](https://kubernetes.io/ja/docs/reference/kubectl/cheatsheet/)
