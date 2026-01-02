 

![](GCP/Attachments/met_the_unicorn_in_captivity.jpg)

# **Workload Identity**

[**主な特徴**](#2bd38cdd-027d-80e1-b268-c5f45c6c0173)

[認証のフロー](#2bd38cdd-027d-8015-92cf-d8122c4c8a86)

[主要コンポーネント](#2bd38cdd-027d-8093-a232-d6535331d4ac)

[特定ブランチのみ許可](#2bd38cdd-027d-8085-91f0-c89d018c05fe)

[組織全体を許可](#2bd38cdd-027d-80ed-9464-c900f9523c0c)

[

Workload Identity 連携  |  IAM Documentation  |  Google Cloud Documentation

このドキュメントでは、Workload Identity 連携の概要について説明します。Workload Identity 連携を使用すると、サービス アカウント キーの代わりにフェデレーション ID を使用して、オンプレミスまたはマルチクラウドのワークロードに Google Cloud リソースへのアクセス権を付与できます。

![](GCP/Attachments/super_cloud%201.png)https://docs.cloud.google.com/iam/docs/workload-identity-federation?hl=ja

![](GCP/Attachments/social-icon-google-cloud-1200-630%201.png)](https://docs.cloud.google.com/iam/docs/workload-identity-federation?hl=ja)

外部の CI/CD システム(GitHub Actions、GitLab CI/CD など)から GCP リソースに対して、**長期的な認証情報(Service Account Key)を使わずに認証する仕組み**です。

### **主な特徴**

1. **キーレス認証**: Service Account Key JSON ファイルが不要

2. **短命なトークン**: デフォルトで 1 時間で自動的に期限切れになる OAuth 2.0/JWT トークンを使用

3. **きめ細かなアクセス制御**: リポジトリ、ブランチ、ユーザー名などの属性に基づいて認証を制限可能

4. **管理オーバーヘッドの最小化**: キーのローテーションや保管が不要

### 認証のフロー

```Bash
GitHub Actions → GitHub OIDC Provider (JWT発行)
    ↓
GCP Workload Identity Pool (トークン検証・属性マッピング)
    ↓
[Direct WIF] 直接リソースアクセス (推奨)
または
[WIF through SA] Service Account 経由でアクセス
```

```Bash
認証フローの全体像
┌─────────────────────────────────────────────────────────────────────────┐
│                          GitHub Actions Workflow                         │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │ 1. Workflow実行時                                                  │  │
│  │    permissions:                                                    │  │
│  │      id-token: write  ← OIDC トークン取得の権限を付与             │  │
│  └───────────────────────────────────────────────────────────────────┘  │
│                                 │                                         │
│                                 ▼                                         │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │ 2. GitHub OIDC Provider にリクエスト                               │  │
│  │    - リポジトリ名、ワークフロー詳細、トリガーイベントを含む      │  │
│  │    - GitHub が署名した JWT トークンを取得                         │  │
│  └───────────────────────────────────────────────────────────────────┘  │
│                                 │                                         │
└─────────────────────────────────┼─────────────────────────────────────────┘
																	│
							 			┌─────────────▼────────────────┐
										│  GitHub OIDC Token (JWT)     │
										│  Issuer:                     │
										│  token.actions.githubusercontent.com │
										│  Claims:                     │
										│  - repository                │
										│  - workflow                  │
										│  - actor                     │
										│  - ref                       │
										└──────────────┬───────────────┘
																	│
																	▼
┌──────────────────────────────────────────────────────────────────────────┐
│                          Google Cloud Platform                           │
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────┐    │
│  │ 3. Workload Identity Pool & Provider                           │    │
│  │    ┌──────────────────────────────────────────────┐            │    │
│  │    │ Attribute Mapping:                           │            │    │
│  │    │  attribute.actor = assertion.actor           │            │    │
│  │    │  google.subject = assertion.sub              │            │    │
│  │    │  attribute.repository = assertion.repository │            │    │
│  │    └──────────────────────────────────────────────┘            │    │
│  │    ┌──────────────────────────────────────────────┐            │    │
│  │    │ Attribute Condition (Optional):              │            │    │
│  │    │  assertion.repository == 'org/repo-name'     │            │    │
│  │    └──────────────────────────────────────────────┘            │    │
│  │                                                                 │    │
│  │    ✓ GitHub OIDC Token を検証                                  │    │
│  │    ✓ Attribute Mapping で属性を変換                            │    │
│  │    ✓ Attribute Condition で条件をチェック                      │    │
│  └────────────────────────────────────────────────────────────────┘    │
│                                 │                                        │
│                                 ▼                                        │
│  ┌────────────────────────────────────────────────────────────────┐    │
│  │ 4a. Direct WIF (推奨)                                          │    │
│  │     Workload Identity Pool に直接 IAM 権限を付与               │    │
│  │     ↓                                                          │    │
│  │     GCP リソースへの直接アクセス                               │    │
│  └────────────────────────────────────────────────────────────────┘    │
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────┐    │
│  │ 4b. WIF through Service Account                                │    │
│  │     Workload Identity Pool → Service Account を偽装            │    │
│  │     ↓                                                          │    │
│  │     短命な Access Token/ID Token を生成                        │    │
│  │     ↓                                                          │    │
│  │     GCP リソースへのアクセス                                   │    │
│  └────────────────────────────────────────────────────────────────┘    │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

### 主要コンポーネント

1. Workload Identity Pool

外部 ID を管理するコンテナ  
各外部環境(GitHub Actions など)ごとに作成することが推奨される  
プロジェクト番号、pool名を含む識別子: projects/123456789/locations/global/workloadIdentityPools/my-pool

1. Workload Identity Provider

外部 Identity Provider (GitHub OIDC) との連携を定義  
Issuer URI: [https://token.actions.githubusercontent.com](https://token.actions.githubusercontent.com/)  
Attribute Mapping と Attribute Condition を設定  
完全な識別子: projects/123456789/locations/global/workloadIdentityPools/my-pool/providers/my-provider

1. Attribute Mapping  
    GitHub OIDC トークンの Claims を GCP の属性にマッピング:  
    bashattribute.actor = assertion.actor # GitHub ユーザー名  
    google.subject = assertion.sub # サブジェクト  
    attribute.repository = assertion.repository # リポジトリ名  
    attribute.repository_owner = assertion.repository_owner

2. Attribute Condition (オプション)  
    特定の条件でのみ認証を許可:  
    cel# 特定リポジトリのみ許可  
    assertion.repository == 'organization/repository-name'

# 特定ブランチのみ許可

assertion.ref == 'refs/heads/main'

# 組織全体を許可

assertion.repository_owner == 'organization-name'  
セキュリティの利点

漏洩リスクの最小化: 長期的な認証情報が存在しない  
自動期限切れ: トークンは 1 時間でデフォルトで期限切れ  
細かなアクセス制御: リポジトリ、ブランチ、ユーザーレベルで制限可能  
監査性の向上: すべての認証試行が Cloud Audit Logs に記録され