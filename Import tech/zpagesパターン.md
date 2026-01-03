---
tags:
  - misc
  - api
  - architecture
created: 2026-01-04
status: active
---

# zpagesパターン

ヘルスチェックにはこのようなものがあるらしい。

[

Health Checks | Node.JS Reference Architecture

Recommended Components

![](https://nodeshift.dev/nodejs-reference-architecture/img/favicon.ico)https://nodeshift.dev/nodejs-reference-architecture/operations/healthchecks/



](https://nodeshift.dev/nodejs-reference-architecture/operations/healthchecks/)

[

Liveness, Readiness, and Startup Probes

Kubernetes has various types of probes: Liveness probe Readiness probe Startup probe Liveness probe Liveness probes determine when to restart a container. For example, liveness probes could catch a deadlock when an application is running but unable to make progress. If a container fails its liveness probe repeatedly, the kubelet restarts the container. Liveness probes do not wait for readiness probes to succeed. If you want to wait before executing a liveness probe, you can either define initialDelaySeconds or use a startup probe.

![](Import%20tech/Attachments/icon-128x128.png)https://kubernetes.io/docs/concepts/configuration/liveness-readiness-startup-probes/

![](Import%20tech/Attachments/kubernetes-open-graph.png)](https://kubernetes.io/docs/concepts/configuration/liveness-readiness-startup-probes/)

# livenessチェックって？

# Readinessチェックって？