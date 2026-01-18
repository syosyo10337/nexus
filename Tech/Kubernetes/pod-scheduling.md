---
tags:
  - kubernetes
  - k8s
  - kubectl
  - resource
  - scheduling
created: 2026-01-18
status: active
---

# Pod Schedulingについて

Podのスケジューリングを制御することは、本番での安定稼働のために重要なポイントです。
同じNodeにPodを載せないことで、障害に備えたり、特定のPod専用のNodeを立ち上げるなどです。

## Nodeを指定する(`nodeSelector`)

`nodeSelector`は、Nodeのラベルを指定することで、Podを特定のNodenのみにスケジュールすることができます。
Nodeに付与されているラベルを指定します。

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: nginx
spec:
  containers:
  - name: nginx
    image: nginx:1.25.3
  nodeSelector:
    disktype: ssd #このラベルを持つNodeにのみスケジュールされます。
```

## Podのスケジュールを柔軟に指定する(`Affinity`)

Affinity/ Anti-Affinity

> tips: Affinityは類似性、密接な関係を意味する単語です。

NodeとPodや、Pod同士が近くなるように、また近くならないようにスケジュールを制御するフィールドです。

### NodeAffinity

NodeSelectorと近いですが、"可能ならばスケジュールする"というような選択が可能になります。
Node障害にも強い設計ができるようになります。

設定項目は2種類あり、、

- `requiredDuringSchedulingIgnoredDuringExecution`: 対応するNodeが見つからない場合はスケジュールできません。
- `preferredDuringSchedulingIgnoredDuringExecution`: 対応するNodeが見つからない場合は適当なNodeを使ってスケジュールします

```yaml
# Nodeにkey: disktype, value: ssdのラベルが付与されているNodeにスケジュールされます。ない場合は、Podをスケジュールします。
apiVersion: v1
kind: Pod
metadata:
  name: node-affinity-pod
spec:
  affinity:
    nodeAffinity:
      preferredDuringSchedulingIgnoredDuringExecution:
      - weight: 1
        preference:
          matchExpressions:
          - key: disktype
            operator: In
            values:
            - ssd
  containers:
  - name: node-affinity-pod
    image: nginx:1.25.3
```

`preferredDuringSchedulingIgnoredDuringExecution`を使用する場合には、weightの指定が必須です。

### Pod Affinity/Pod Anti-Affinity

Pod同士が近くなるように、また近くならないようにスケジュールを制御するフィールドです。
`spec.affiniy`配下に記述しますが、Pod間のAffinityという理解がよりわかりやすいと思います。

Node Affinityでは、Nodeのラベルを指定しましたが、Pod affiniyでは、すでにNodeにスケジュールされているPodのラベルに基づいてスケジュールされます。

よくあるユースケースとしては、同じアプリケーションを動かしているPodを同一Node上に配置しない。 (Node障害への耐性を高めるため)
**POd Topology Spread Constraitns**で代替できることもあります

- requiredDuringSchedulingIgnoredDuringExecution: 対応するPodが見つからない場合はスケジュールできません。
- preferredDuringSchedulingIgnoredDuringExecution: 対応するPodが見つからない場合は適当なPodを使ってスケジュールします

```yaml

# app:nginxのラベルがついているPodが割り当てられているNodeには同一ラベルを持つPod はなるべく配置しないようにします。
apiVersion: v1
kind: Pod
metadata:
  name: pod-anti-affinity
  labels:
    app: nginx
spec:
  affinity:
    podAntiAffinity:
      preferredDuringSchedulingIgnoredDuringExecution:
      - weight: 100
        podAffinityTerm:
          labelSelector:
            matchExpressions:
            - key: app
              operator: In
              values:
              - nginx
          topologyKey: kubernetes.io/hostname #こちらの記述で、同じデータセンター(zone)にPodを配置しないようにします。
  containers:
  - name: nginx
    image: nginx:1.25.3
```

## Pod Topology Spread Constraints
Pod