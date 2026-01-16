# Resourceについて

PodやServiceのことリソースなんですが、ここでいうResourceはpodのメモリやCPUの使用量のことを指します。
defaultで指定できるリソースは、CPU/memory/Ephemeral Storageです。

## Resource Request

確保したいリソースの最低使用量を指定することができる,k8sのスケジューラはこの値を見て、スケジュールするNodeを決定します。
Requestsの値が確保できるNodeをしらべて、該当するNodeをスケジュールしますが、どのNodeもRequestの値を満たしていない場合は、Podはスケジュールできないことになります。

```yaml
resourcdes:
  requests:
    memory: "64Mi"
    cpu: "10m"
```

## Resource Limit

コンテナが使用できるリソース使用量の上限を指定します。コンテナはこのLimitを超えてリソースを使用することができません。
メモリが上限値を超える場合は`Out Of 
確保したいリソースの最大使用量を指定することができる,この値を超えると、Podは強制的に削除されます。

## Resource Request and Limit

Resource RequestとResource Limitは、Podのリソース使用量を制御するための機能です。
Resource Requestは、Podが最低でも確保したいリソースの量を指定することができる機能です。
Resource Limitは、Podが最大で使用できるリソースの量を指定することができる機能です。
