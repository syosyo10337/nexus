---
tags:
  - GCP
  - npm
  - artifact-registry
  - private-package
created: 2026-02-06
updated: 2026-02-06
---

# Artifact Registry

## 概要

（後で記述）

## プライベート npm パッケージの公開手順

### 1. Artifact Registry の準備

#### レジストリの作成

```bash
# npm レジストリを作成
gcloud artifacts repositories create <REPOSITORY_NAME> \
  --repository-format=npm \
  --location=<LOCATION> \
  --description=<e.g.Private npm packages> 
```

#### IAM 権限の設定

```bash
# 権限の確認
gcloud artifacts repositories get-iam-policy REPOSITORY_NAME \
  --location=LOCATION

# 権限の付与
gcloud artifacts repositories add-iam-policy-binding REPOSITORY_NAME \
  --location=LOCATION \
  --member=user:EMAIL \
  --role=roles/artifactregistry.writer
```

### 2. 認証設定

#### gcloud 認証の設定

```bash
# Artifact Registry への認証設定
gcloud auth configure-docker LOCATION-npm.pkg.dev

# または npm 用の認証ヘルパーを使用
npx google-artifactregistry-auth
```

#### .npmrc の設定

プロジェクトルートまたはホームディレクトリに `.npmrc` ファイルを作成:

```ini
# スコープ付きパッケージのレジストリを指定
@SCOPE:registry=https://LOCATION-npm.pkg.dev/PROJECT_ID/REPOSITORY_NAME/

# 認証トークン（自動生成される場合が多い）
//LOCATION-npm.pkg.dev/PROJECT_ID/REPOSITORY_NAME/:_authToken=TOKEN
```

### 3. npm パッケージの準備

#### package.json の設定

```json
{
  "name": "@SCOPE/package-name",
  "version": "1.0.0",
  "description": "Private package",
  "main": "index.js",
  "publishConfig": {
    "registry": "https://LOCATION-npm.pkg.dev/PROJECT_ID/REPOSITORY_NAME/"
  }
}
```

### 4. パッケージの公開

```bash
# パッケージをビルド（必要に応じて）
npm run build

# パッケージを公開
npm publish
```

### 5. パッケージのインストール

他のプロジェクトでプライベートパッケージを使用する:

```bash
# .npmrc が設定されていれば通常通りインストール可能
npm install @SCOPE/package-name
```

## トラブルシューティング

### 認証エラー

```bash
# 認証情報の再生成
gcloud auth application-default print-access-token
```

### 権限エラー

必要な権限:

- `roles/artifactregistry.writer` - パッケージの公開
- `roles/artifactregistry.reader` - パッケージのインストール

## 関連リンク

- [rc (run commands)](<../CS/rc%20(run%20commands).md>) - .npmrc の詳細
- [GCP公式ドキュメント](https://cloud.google.com/artifact-registry/docs/nodejs/quickstart)
