---
tags:
  - GCP
  - npm
  - artifact-registry
  - private-package
created: 2026-02-06
updated: 2026-02-06
---

# 概要

npmのprivateパッケージをGoogle Cloudに配置する方法
基本は公式に則るで良さそう
cf. <https://docs.cloud.google.com/artifact-registry/docs/nodejs/authentication>

## 1. パッケージ作成と設定

### @scope/packageノカタチで、パッケージ名を設定する

publishconfigを書くのもお作法

```json
// package.json
{
  "name": "@avalon/my-utils",
  "version": "1.0.0",
  "publishConfig": {
    "registry": "https://asia-northeast1-npm.pkg.dev/avalon-project-id/my-repo-name/"
  }
}
```

### .npmrcを追加

scopeがあるものはここへむける！という設定情報をかいてあげる。公式だとこの文字列を出力するコマンドがあり、repositoryの作成と、設定が済んだらprintするだけになる。実際の手順はpublish直前かも

`gcloud artifacts print-settings npm ..` 以下略
@<scope>:registry=<https://asia-northeast1-npm.pkg.dev/avalon-project-id/my-repo-name/>

## 2. Artifact Registry の準備

### レジストリの作成

```bash
# npm レジストリを作成
gcloud artifacts repositories create <REPOSITORY_NAME> \
  --repository-format=npm \
  --location=<LOCATION> \
  --description=<e.g.Private npm packages>
```

### (opt)IAM 権限の設定

CIでWordLoad Fedeartionなどを使いながら、SAによって認証したい場合には、追加で権限の付与が必要です。

```bash
# 権限の確認
gcloud artifacts repositories get-iam-policy <REPOSITORY_NAME> \
  --location=<LOCATION>

# 権限の付与
gcloud artifacts repositories add-iam-policy-binding <REPOSITORY_NAME> \
  --location=<LOCATION> \
  --member=user:<EMAIL> \
  --role=roles/artifactregistry.writer
```

## 3. 認証設定

### gcloud 認証の設定

```bash
# 1. ブラウザ認証
gcloud auth login

# 2. プロジェクト切り替え（対象のGCPプロジェクトへ）
gcloud config set project avalon-project-id

# 3. ADC（アプリ用認証）の取得 ※これがAuthツールには必要
gcloud auth application-default login
```

### 認証ヘルパーを利用

認証ヘルパーの実行
.npmrcを読み込んで、

```bash
# プロジェクトルートで実行
npx google-artifactregistry-auth
```

cf. <https://www.npmjs.com/package/google-artifactregistry-auth>

### 3. npm パッケージの準備

#### package.json の設定

```json
{
  "name": "@<SCOPE>/<PACKAGE_NAME>",
  "version": "1.0.0",
  "description": "Private package",
  "main": "index.js",
  "publishConfig": {
    "registry": "https://<LOCATION>-npm.pkg.dev/<PROJECT_ID>/<REPOSITORY_NAME>/"
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
npm install @<SCOPE>/<PACKAGE_NAME>
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

```

```
