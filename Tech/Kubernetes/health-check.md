---
tags:
  - kubernetes
  - k8s
  - health-check
  - liveness
  - readiness
  - startup
created: 2026-01-16
status: active
---

# Health Check
kubernetesでは、ヘルスチェックを行って、ヘルシーではないない時に、自動でServiceやPodを制御する仕組みがあります。

- readiness probe: コンテナが準備できているかどうかをチェックする
- liveness probe: コンテナが生きているかどうかをチェックする
- startup probe: コンテナが起動しているかどうかをチェックする

> tips: Probeとは
> "「探査・調査」を意味し、監視・測定・脆弱性診断などの目的で、ネットワーク機器やサーバー、アプリケーションの状態を外部から探る（調査する）ためのプログラムや手法  メスみたいな医療器具についてもさすらしい。"

## Readiness Probe
コンテナがReadyになるまでの時間やエンドポイントを制御するもの

```yaml
apiVersion: v1
kind: Pod
metadata:
  labels:
    app: httpserver
  name: httpserver-readiness
spec:
  containers:
  - name: httpserver
    image: blux2/delayfailserver:1.1
    readinessProbe:
      httpGet:
        path: /healthz
        port: 8080
      initialDelaySeconds: 5 # コンテナが起動してから初回のチェックまでの時間
      periodSeconds: 5 # チェックの間隔
```

200-400のレスポンスの場合には、Readyとみなされます、
コマンドを実行したり、TCPソケットを使ったり、gPRC(from v1.24)を使うことなどもできるそう

ReadinessProbeのチェックが失敗した場合には、Serviceリソースの接続対象から外され、トラフィックを受けなくなります。Podの数が減っていくってことだね。

## Liveness Probe

Readlinessとの違いとしては、Liveness ProbeはProbeに失敗した時に、Podを再起動します。
Podがhangしてしまって再起動で直るケースを想定されている場合に有効です。ただし、再起動を無限に繰り返してしまうリスクもあるので、安易に導入することはお勧めしません。

```yaml
apiVersion: v1
kind: Pod
metadata:
  labels:
    app: httpserver
  name: httpserver-liveness
spec:
  containers:
  - name: httpserver
    image: blux2/delayfailserver:1.1
    livenessProbe:
      httpGet:
        path: /healthz
        port: 8080
      initialDelaySeconds: 5
      periodSeconds: 5
```