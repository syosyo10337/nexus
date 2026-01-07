# kubectl
k8sを操作するコマンドツール


## kubectl configについて
`~/.kube/config`に通常設定ファイルは存在します。
クラスタごとに設定が違うことがある。
複数のクラスタが存在する時にその分のcontextがそれぞれのクラスタの設定情報として存在する。

## kubectlコマンド
- クラスタの情報を確認する
```
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

- マニフェストをクラスタに適用する 
```bash
kubectl apply -f/--filename <fileName>
```


### Podの状態を確認する
```bash
kubectl get pod --namespace default
```


- 特定のリソース情報飲み取得する

```bash
kubectl get pod <pod名>
```
###　オプション
`--namespace(-n)`: namespaceを作成できる
`-output(-o)`: IPやNodeの情報が取得できる `-o wide` `-o yaml` yaml形式でリソース情報を取得する
lessコマンドを組み合わせて使ったりする。

tips: 現在のapplyされているマニフェストを出力する。
```
kubectl get pod myapp -o yaml -n default > pod.yaml
```