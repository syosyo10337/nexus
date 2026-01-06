# kubectl
k8sを操作するコマンドツール


## kubectl configについて
`~/.kube/config`に通常設定ファイルは存在します。
クラスタごとに設定が従うことがある。
複数のクラスタが存在する時にその分のcontextがそれぞれのクラスタの設定情報として存在する。

## tips
- クラスタの情報を確認する
```
kubectl cluster-info --context=<context>
```
- defaultのcontextを設定するコマンド(毎回 --contextフラグをつけない)
```bash
kubectl config use-context <context_name>
```

ただ毎回打つのも面倒なのでkubectxをお勧めする。