---
tags:
  - kubernetes
  - k8s
  - pod
  - priority
  - preemption
created: 2026-01-20
status: active
---

# Podに優先度をつける(`PriorityClass`)

Podひとつひとつにつけるのではなく、`PriorityClass`というリソースを作成して、それをPodに割り当てることで、Podに優先度をつけることができます。

```yaml
apiVersion: scheduling.k8s.io/v1
kind: PriorityClass
metadata:
  name: high-priority
spec:
  value: 1000000
```

## Podに優先度をつける

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: nginx
spec:
  priorityClassName: high-priority # PriorityClass meta.nameを指定する
```

このような設定をした時には、nignxポッドがどのNodenにもスケジュールされない時、preemption(専売権の意味)が発生します。
priorityがpreemptionが発生しているpodより低いものをEvict(強制退去)させることという挙動をとります。
