---
tags:
  - kubernetes
  - k8s
  - kubectl
created: 2026-01-11
updated: 2026-01-21
status: active
---

# kubectl

k8sを操作するコマンドツール

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

## 参考

より詳細なデバッグ用のコマンドについては[こちら](kubectl-debug.md)

- [kubectl-edit](kubectl-edit.md)
- [kubectl cheetsheet](https://kubernetes.io/ja/docs/reference/kubectl/cheatsheet/)
