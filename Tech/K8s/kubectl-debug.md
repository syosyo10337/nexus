---
tags:
  - kubernetes
  - k8s
  - kubectl
  - debug
created: 2026-01-11
status: draft
---

参照系のkubectlコマンドでも、情報が足りない場合は以下のコマンドなどを使うことでデバッグ作業が捗ります。

# デバッグ用のサイドカー コンテナを立ち上げる
podで既に構築されている環境とリソースを共有できるデバッグコンテナをデバッグ目的で一時的に追加する。

```bash 
kubectl debug --stdin --tty <pod_name> \
  --image=<debug container image> \
  --target=<target container> \
```

本番環境用のコンテナなどでは、セキュリティリスクなどの関係で、デバッグツールが入っていないことがあります。
このような状況の時は、デバッグ用のコンテナを起動して、そのコンテナ内でデバッグを便利に実行できる。

```bash
# e.g.)
# myappというpodで、hello-serverというコンテナをデバッグする、shシェルを起動する
kubectl debug --stdin --tty myapp \
 --image=curlimages/curl:latest \
 --target=hello-server \
 -n default \
 -- sh
```

**tips**:
`--stdin` : コンテナの標準入力（stdin）をあなたのターミナルに接続
`--tty` : 疑似ターミナル（PTY）を割り当てて、対話型シェルを提供(**stdinを合わせて、`--it`とすることもある**aaaaaaaaaaaaaaaa)


# コンテナを即時事項する
k8s 1.25以前はそもそもdebugコマンドがなかったので、デバッグ用のpodを立てる必要がありました。


```bash
kubectl run <pod_name> --image=<image_name>


# e.g.)
kubectl --n default run busybox \
--image=busybox:latest \
--rm \
--stdin \
--tty \
--restart=Never \
--command -- nslookup google.com
```

# コンテナにログインする