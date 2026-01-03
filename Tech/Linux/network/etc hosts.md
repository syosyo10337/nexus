---
tags:
  - linux
  - command
created: 2026-01-04
status: active
---

# /etc/hosts

DNSの代わりに、とりあえず名前解決をするために使用する。

[https://linuc.org/study/knowledge/506/](https://linuc.org/study/knowledge/506/)

そもそも /etc/hostsとは？

[https://linuc.org/study/knowledge/506/](https://linuc.org/study/knowledge/506/)

やり方の一例: ==ワンライナー==

```Shell
HOST="<追加したいドメイン>" && grep -q "$HOST" /etc/hosts || echo "127.0.0.1 $HOST" | sudo tee -a /etc/hosts
```

☝

ローカル開発に戻る場合には、追加したホストをコメントアウトするのを忘れずに。