---
tags: [kubernetes, observability, monitoring, logging, tracing]
created: 2026-01-29
status: active
---

# k8sとObservability

一般的なオブザバビリティの話はこちらで

[[Tech/SRE/observability|observability詳細]]

## Logs

クラウドベンダーを使うときほんてきにはそこで、出力してもらえる

ただし、FluentdなどのOSSもあり、マネージドシステムだとコストが嵩むなどがあるので、ログをカスタマイズしたい場合には有用です。

## metrics

k8sは標準でメトリクスを計測するツールを用意していません。
そのため、DataDogなどを使う必要があります。

OSSでは、Prometheusが有名らしい。PromQLというクエリ言語を使ってメトリクスを参照できるらしい。

## Traces

こちらはアプリの状況を知るためにコードに実装を入れる必要があります。なので、導入の障壁は高い。

OpenTelemetryなどがOSSでは有名ですね。

Jaeger Grafana Tempoなどもあります。
