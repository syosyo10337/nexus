---
tags:
  - web
  - dns
  - cloud
  - aws
  - gcp
created: 2026-02-25
updated_at: 2026-02-25
status: active
---

## クラウドにおけるマネージドDNSサービス

各クラウドプロバイダーは、マネージドDNSサービスを提供しており、これらは**権威ネームサーバー**として機能します。

### AWS Route 53

**Amazon Route 53** は、AWSが提供するスケーラブルなDNSサービスです。

#### 主な機能

- **パブリックホストゾーン**: インターネット公開用のDNS
- **プライベートホストゾーン**: VPC内部のみで使用するDNS
- ヘルスチェックとフェイルオーバー機能
- トラフィックポリシーによる高度なルーティング

#### 使用例

```text
# パブリックホストゾーン
example.com
  ├─ www.example.com → ELBのパブリックIP (A レコード)
  └─ api.example.com → EC2のElastic IP (A レコード)

# プライベートホストゾーン（VPC内のみ）
internal.local
  ├─ db.internal.local → RDSのプライベートIP (A レコード)
  └─ cache.internal.local → ElastiCacheのエンドポイント (CNAME レコード)
```

### GCP Cloud DNS

**Cloud DNS** は、GCPが提供する高パフォーマンスなDNSサービスです。

#### 主な機能

- **パブリックゾーン**: グローバルに公開するDNS
- **プライベートゾーン**: VPC内部のみで使用するDNS
- Cloud Load Balancingとのネイティブインテグレーション
- DNSSEC対応

#### 使用例

```text
# パブリックゾーン
example.com
  ├─ www.example.com → Cloud Load Balancerの外部IP
  └─ storage.example.com → Cloud Storageバケット (CNAME)

# プライベートゾーン
internal.example.com
  ├─ db.internal.example.com → Cloud SQLのプライベートIP
  └─ app.internal.example.com → GKEサービスの内部IP
```

## DNSサーバの配置とドメイン登録の仕組み

### DNSサーバはネットワークのどこにいるか？

各DNSサーバは、以下のように配置されています：

```text
インターネット全体
├─ ルートサーバ (13系統)
│   └─ 世界中に数百台が分散配置（Anycast技術で最寄りサーバに自動接続）
│
├─ TLDサーバ (.com, .jp, .org など)
│   └─ レジストリ運営組織が管理（例: Verisign, JPRS）
│   └─ 各TLDごとに複数台が世界中に分散
│
├─ 権威ネームサーバ (あなたのドメイン用)
│   └─ ドメイン所有者が管理または委託
│   └─ クラウドプロバイダー（Route 53, Cloud DNS）や
│   └─ DNSホスティング事業者（Cloudflare, お名前.comなど）のデータセンター
│
└─ リカーシブリゾルバ
    └─ ISPや企業ネットワークが運営
    └─ Google Public DNS (8.8.8.8), Cloudflare DNS (1.1.1.1) など
```

### クラウドDNSサービスへの登録は何に該当するか？

クラウドDNS（Route 53やCloud DNS）にドメインを登録する行為は、**権威ネームサーバへの登録**に該当します。

#### 登録プロセスの全体像

```
1. ドメインレジストラでドメインを購入
   ↓
   【TLDサーバへの登録】← ここでNSレコードが登録される
   お名前.com、GoDaddyなどのレジストラが
   .com TLDサーバに「example.comの権威サーバはns-xxx.awsdns-xx.comですよ」
   と登録（NSレコード）
   ↓
2. クラウドDNSでホストゾーンを作成
   ↓
   【権威サーバへの登録】← ここで実際のAレコード等を設定
   Route 53やCloud DNSに
   「www.example.com → 203.0.113.10」などのレコードを登録
   ↓
3. 名前解決の流れ
   TLDサーバ「example.comの権威サーバはこちら！」
   → 権威サーバ（Route 53）「www.example.comのIPは203.0.113.10です！」
```

### VPC内のパブリックIPへのドメイン割り当て

VPC内のEC2インスタンスなどのパブリックIPにドメインを割り当てる場合：

```
【パブリックDNSの場合】
Route 53パブリックホストゾーン
  ├─ web.example.com → EC2のElastic IP (52.xxx.xxx.xxx)
  └─ api.example.com → ALBのパブリックIP

→ インターネット全体からアクセス可能
→ TLDサーバに登録された権威サーバとして機能

【プライベートDNSの場合】
Route 53プライベートホストゾーン
  ├─ app.internal → EC2のプライベートIP (10.0.1.50)
  └─ db.internal → RDSのプライベートIP (10.0.2.100)

→ VPC内からのみアクセス可能
→ TLDサーバへの登録は不要（VPC内で完結）
```

### 重要なポイント

1. **TLDサーバへの登録**: ドメインレジストラ経由で、「どの権威サーバに問い合わせればいいか」（NSレコード）を登録
2. **権威サーバへの登録**: Route 53やCloud DNSで、「具体的にどのIPアドレスに紐付くか」（AレコードやCNAMEなど）を登録
3. **DNSサーバの配置**: 権威サーバ（クラウドDNS）は、クラウドプロバイダーのデータセンター内に配置されており、グローバルに分散している

## 参考リンク

- [AWS Route 53 公式ドキュメント](https://docs.aws.amazon.com/route53/)
- [GCP Cloud DNS 公式ドキュメント](https://cloud.google.com/dns)
