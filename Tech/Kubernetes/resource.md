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

Nodeのメモリが完全に枯渇してしまうとそのNodeに載っているすべてのコンテナが動作しなくな流のを防ぐために、OOM Killerという役割のプログラムが存在します。OOM KillerはQoSに応じて、OOMkilするPodの優先順位を決定して、必要に王座いて優先度の低いPodからkillされます。

QoSクラスには、Guaranteed、Burstable、BestEffortの3つがあります。
BestEffort > Burstable > Guaranteedの順でOOMkillされます。

| QoSクラス | 説明 |
| ---------- | ------ |
| Guaranteed | requests/limitsが全てのPodに指定されていること。メモリrequests=limis, CPUrequests=limitsとなる値が設定されていること |
| Burstable | Podのうち少なくとも一つは、memoryまたはCPUのrequets/limitsが指定されていること |
| BestEffort | GuranteeedでもBurstableでもないPod |

詳しくは公式ドキュメントを参照してください。

## コマンド

QoSクラスを確認するコマンド
pod describeでも確認できます。

```bash
k get pod <pod名> -o jsonpath='{.status.qosClass}'
```

## 備考

- [Pod Quality of Service Classes](https://kubernetes.io/docs/concepts/workloads/pods/pod-qos/) - QoSクラスの分類と基準について
- [Configure Quality of Service for Pods](https://kubernetes.io/docs/tasks/configure-pod-container/quality-service-pod/) - 各QoSクラスを得るためのPod定義例と具体的な設定方法
