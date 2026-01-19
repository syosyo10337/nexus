---
tags:
  - kubernetes
  - k8s
  - taint
  - toleration
created: 2026-01-20
status: active
---

# Taint and Tolerationについて

TaintとTolerationはそれぞれ対になる概念。
TaintはNodeに対しての設定で、TolerationはPodに対しての設定です。
taintはNodeが特定のPodしかスケジュールしたくない。という時に使用します。

> tips: Taintは"汚れ"を意味する単語です、toleranceは"寛容"を意味する単語です。

taintをmanifestにつける方法はcloud providerによって異なるので割愛。

```bash
kutectl taint nodes <target_node> <label_key>=<label_value>:<taint_effect>

# e.g.
kutectl taint nodes node01 disktype=ssd:NoSchedule
# Nodeにtaintをつける。
```

## Tolerationをmanifestにつける方法

Tolerationをmanifestにつける方法は以下のようになります。
以下の設定で、disktype=ssd:NoScheduleのTaintがついているNodeにはPodをスケジュールを許可する

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: nginx
spec:
  containers:
  - name: nginx
    image: nginx:1.25.3
    imagePullPolicy: IfNotPresent
  tolerations:
  - key: "disktype"
    value: "ssd"
    operator: "Equal"
    effect: "NoSchedule"
```
