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

- メモリが上限値を超える場合は`Out Of Memory(OOM)`でPodはkillされます。
- CPUが上限値を超える場合は、即座にPodがkillされるということはありませんが、そのかわりにスロットリングが発生して、アプリケーションの動作が遅くなります。

確保したいリソースの最大使用量を指定することができる,この値を超えると、Podは強制的に削除されます。

```yaml
resources:
  limits:
    memory: "128Mi"
    cpu: "200m"
```

## リソースの単位について

### メモリ

単位を指定しない場合、1は1byteと意味します。他にもK、M、G、Tなどをつけられます。
Kiは2^10=1024を意味します。ので一般的なキロとは少し異なる点には注意です。

### CPU

1 CPU = CPU時間の絶対的な単位を意味し、物理コアの性能そのものではなく、CPUを使用できる時間の割り当てを表します。
単位を指定しない場合、1は1CPUと意味します。他にもmをつけられます。1m = 0.001コアなので、通常は整数やミリコアで指定する。

## Quality of Service(QoS) Classes

Nodeのメモリが完全に枯渇してしまうとそのNodeに載っているすべてのコンテナが動作しなくなる。

Resource RequestとResource Limitは、Podのリソース使用量を制御するための機能です。
Resource Requestは、Podが最低でも確保したいリソースの量を指定することができる機能です。
Resource Limitは、Podが最大で使用できるリソースの量を指定することができる機能です。
