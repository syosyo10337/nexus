---
tags:
  - misc
  - api
created: 2026-01-04
status: active
---

🏘️

# Hosting?

- そもそも、webでアプリ運用をする際には、サーバーが必要で,そのサーバーを提供するサービスをホスティング(ホスティングサービス)という

- 従来型の発想でいうと、これは≒レンタルサーバを示す。

- レンタルサーバ　—オンプレミスの物理サーバを複数人で共有する仕組み。CPUなどをベンダー側から提供されたものを使い、他のユーザと共有することが多いため、サーバー自体の保守運用コストはかからないものの、拡張性/カスタマイズ性は低く、他のユーザの使用状況によってリソースが圧迫される可能性もある。

- Iass — Infrastructure as a Serviceの略で、ベンダーの持つ一つの大きな物理サーバー上に複数の仮想サーバーを作り、それを複数人が利用できる仕組み。

- レンタルサーバがシェアハウスだとすれば、クラウドインフラ(IaaS)は、マンションのようなイメージ

- IasSをもっと詳しく、クラウドインフラサービスでは、仮想サーバーを占有しているため、CPUやメモリ、ストレージなどのスペックを自由に選択でき、スケールも可能

- herokuは？ —PasS(Platform as a Service)インフラだけでなく、DBなどのミドルウェアも含めたアプリの実行環境(=Platform)を提供するサービス。

- OS/ネットワーク/フレームワークや開発環境

- PaaS/IaaSの参考

[https://azure.microsoft.com/en-us/resources/cloud-computing-dictionary/what-is-paas/](https://azure.microsoft.com/en-us/resources/cloud-computing-dictionary/what-is-paas/)