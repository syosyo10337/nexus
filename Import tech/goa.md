---
tags:
  - misc
  - api
  - tooling
created: 2026-01-04
status: active
---

![](Import%20tech/Attachments/met_silk_kashan_carpet.jpg)

🐐

# goa

[🔷概要](#28538cdd-027d-8073-a529-fa64360b7dea)

[`gen/{service_name}`](#28538cdd-027d-8027-8dde-f4d61d5f4ccc)

[`service.go`  
ビジネスロジック実装のための**サービスインターフェース**](#28538cdd-027d-80f8-9019-c160291db767)

[`endpoints.go`](#28538cdd-027d-805f-a920-f39d7b6126cc)

[`clients.go`](#28538cdd-027d-80ad-970c-ea862ac20f87)

[`**gen/http/{service_name}/server**`](#28538cdd-027d-80f8-b600-ef5b483d3818)

[`**gen/http/{service_name}/client**`](#28538cdd-027d-807c-a3bc-d792aa8bb0ef)

[**実装の流れ**](#28538cdd-027d-80dd-b1e9-f2ac1aee7534)

[🔷DSL](#25738cdd-027d-80a3-ae2f-efcfc241c76e)

[Field()とAttribute()](#25738cdd-027d-80b1-be8e-dd711ddf22f3)

[Enumの設定](#28538cdd-027d-807e-bcf4-e5a50734f248)

[https://goa.design/](https://goa.design/)

生成コマンド

```TypeScript
goa gen <filepath>
```

# 🔷概要

goa genすると `gen/`配下にファイルが作成される。以下のように定義したときの引数名で、ファイルが生成される

```Go
Service("EventCheckInPortalService",

// -> event_check_in_portal_service/ディレクトリにclient/endpoints/serviceが生成される
```

生成されるファイル群

## `gen/{service_name}`

### `service.go`  
ビジネスロジック実装のための**サービスインターフェース**

- 設計を反映した**ペイロード**と**結果**の型

### `endpoints.go`

- サービス実装注入のための**NewEndpoints**関数

### `clients.go`

- サービスクライアント作成のための**NewClient**関数

## `**gen/http/{service_name}/server**`

サーバーサイドのHTTP固有のロジックを含みます：

- サービスエンドポイントをラップする**HTTPハンドラー**

- リクエストとレスポンスの**エンコード/デコード**ロジック

- サービスメソッドへの**リクエストルーティング**

- **トランスポート固有の型**とバリデーション

- 設計仕様からの**パス生成**

## `**gen/http/{service_name}/client**`

クライアントサイドのHTTP機能を提供します：

- HTTPエンドポイントからの**クライアント作成**

- リクエストとレスポンスの**エンコード/デコード**

- **パス生成**関数

- **トランスポート固有の型**とバリデーション

- クライアントツール用の**CLIヘルパー関数**

### **実装の流れ**

実装には以下が必要です：

1. インターフェースを実装するサービス構造体の作成

2. 必要なすべてのメソッドの実装

3. HTTPサーバーとの連携

å

# 🔷DSL

# Field()とAttribute()

**protobufの兼ね合い含めて、Fieldでよいらしい。**

// Field() - 明示的な番号で順序を制御  
Field(1, "tenant_id", ...) // 1番目  
Field(2, "community_event_id", ...) // 2番目  
Field(3, "page", ...) // 3番目

// Attribute() - 定義順で暗黙的に決まる  
Attribute("tenant_id", ...) // 定義順  
Attribute("community_event_id", ...)

Attribute("page", ...)

の使い方

# Enumの設定