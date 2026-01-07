# Podについて
コンテナを起動するためのいくつかあるkubernetesリソースの中でも、最小構成リソースである。

e.g. podリソースを作成するマニフェスト

```yml
apiVersion: v1
kind: Pod
metadata:
  name: nginx
spec:
  containers:
  - name: nginx
    image: nginx:1.25.3
    ports:
    - containerPort: 80
```

コンテナのようだけども、実際にPodは複数のコンテナを起動できます。
メインサービスに付属するlog転送サービスなどは同一 Pod上に起動されることが多いです。

起動・リリースのタイミングを合わせたかったり、ローカルファイルにアクセスしたい時に同梱されがち

## Namespace
単一クラスタ内のリソース群を分離するメカニズムを提供します。
リソース名はNamespace内ではユニークでなければならないが、Namespace間では必ずしもその必要はない。

またNamespaceごとに権限を分けることも可能である。

## 特殊なNamespace: kube-system
Control Plane/Nodeで起動しているKubernetesのシステムコンポーネントのPodが利用しているNamespaceです。

## Podnのステータス
これらの情報はエラー調査の際に役立ちます。


| ステータス | 説明 |
|-----------|------|
| Pending | clusterからPodの作成は許可されたものの、1つ以上のコンテナが準備中である。 |
| Running | Podがノードにスケジュールされ、すべてのコンテナが作成された状態. |
| Completed | Pod内の全てのコンテナが完了した状態 |
| Unknown | Podの状態が取得できない時,実行されるNodeとの通信エラーであることが多い。 |
| ErrImagePull | Image取得に失敗 |
| Error | 異常終了 ログを調査しましょう。 |
| OOMKilled | Out Of Memoryで終了 podリソースを増やしましょう。 |
| Terminaiting | 削除中。 |