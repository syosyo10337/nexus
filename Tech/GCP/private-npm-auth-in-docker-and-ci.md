---
title: "Artifact Registry の private npm パッケージに Docker・CI からアクセスする"
emoji: "📦"
type: "tech"
topics: ["gcp", "npm", "docker", "githubactions", "artifactregistry"]
published: false
---

## はじめに

Google Cloud の Artifact Registry に private npm パッケージを配置して運用していると、ローカル開発環境では `gcloud auth` で認証が通るものの、**Docker コンテナや CI 環境ではどう認証を通すか**で詰まりがちです。

この記事では、Artifact Registry 上の private npm パッケージに対して、以下の環境からアクセスする方法を解説します。

- **Docker コンテナ**（docker compose を使ったローカル開発）
- **GitHub Actions**（CI/CD パイプライン）

## 前提知識

### Artifact Registry の npm 認証の仕組み

Artifact Registry の npm リポジトリにアクセスするには、`.npmrc` に**スコープごとのレジストリ URL** と **認証トークン** の 2 つが必要です。

```ini
# プロジェクトの .npmrc
@your-scope:registry=https://asia-northeast1-npm.pkg.dev/YOUR_PROJECT/YOUR_REPO/
```

ローカル開発では、Google 公式の認証ヘルパー [google-artifactregistry-auth](https://www.npmjs.com/package/google-artifactregistry-auth) が ADC（Application Default Credentials）や `gcloud auth login` の認証情報を読み取り、`~/.npmrc` にトークンを自動で書き込んでくれます。

```bash
npx google-artifactregistry-auth
```

しかし Docker コンテナや CI マシンには `gcloud` CLI も ADC もありません。そこで **アクセストークンを外部から注入する** アプローチが必要になります。

cf. [公式ドキュメント - Node.js パッケージの認証](https://cloud.google.com/artifact-registry/docs/nodejs/authentication)

## 共通の準備：.npmrc にトークンのプレースホルダーを設置する

Docker・CI どちらの場合も、まずプロジェクトの `.npmrc` に環境変数で差し替え可能なトークン設定を記述します。

```ini
# .npmrc（プロジェクトルートにコミットする）
@your-scope:registry=https://asia-northeast1-npm.pkg.dev/YOUR_PROJECT/YOUR_REPO/
//asia-northeast1-npm.pkg.dev/YOUR_PROJECT/YOUR_REPO/:_authToken=${NPM_TOKEN}
```

`${NPM_TOKEN}` は npm が環境変数から自動展開してくれるため、実行時に `NPM_TOKEN` をセットするだけで認証が通ります。

## Docker コンテナからアクセスする

### 1. ホスト側でアクセストークンを取得する

[direnv](https://direnv.net/) を使って、プロジェクトディレクトリに入ったときに自動でトークンを環境変数にセットする方法が便利です。

```bash
# .envrc
# Artifact Registry 認証用の NPM トークンを動的に取得
# direnv がインストールされている必要があります
# 初回は `direnv allow` を実行してください

export NPM_TOKEN=$(gcloud auth print-access-token 2>/dev/null)

if [ -z "$NPM_TOKEN" ]; then
  echo "Warning: Failed to get GCP access token"
  echo "  Run: gcloud auth login"
fi
```

:::message
`gcloud auth print-access-token` で取得するトークンは **有効期限が 1 時間** です。期限が切れたら `direnv reload` またはディレクトリに入り直すことで再取得できます。
:::

### 2. Docker BuildKit の secrets でトークンを渡す

Dockerfile 内で `npm ci` を実行するとき、BuildKit の `--mount=type=secret` を使うとトークンをイメージレイヤーに残さずに渡せます。

```dockerfile
# Dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json .npmrc ./

# Secret をマウントして環境変数に展開してから npm ci を実行
RUN --mount=type=secret,id=NPM_TOKEN,env=NPM_TOKEN \
    npm ci
```

### 3. docker compose で secrets を設定する

```yaml
# compose.yaml
services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
      secrets:
        - NPM_TOKEN

secrets:
  NPM_TOKEN:
    environment: NPM_TOKEN # ホスト側の環境変数を参照
```

この構成により、ホスト側で `NPM_TOKEN` 環境変数がセットされていれば、`docker compose build` 時にトークンが BuildKit secrets 経由で Dockerfile に渡されます。

:::message alert
`ARG` や `ENV` でトークンを渡すとイメージレイヤーに残ってしまいます。必ず BuildKit secrets を使いましょう。
:::

## GitHub Actions からアクセスする

CI 環境では、Workload Identity Federation を使って**サービスアカウント経由でアクセストークンを取得**します。キーファイルの管理が不要になるため、セキュリティ面でも推奨される方法です。

### 事前準備：IAM 権限の設定

CI 用のサービスアカウントに Artifact Registry への読み取り（または書き込み）権限を付与します。

```bash
# 読み取りのみ（npm install 用）
gcloud artifacts repositories add-iam-policy-binding YOUR_REPO \
  --location=asia-northeast1 \
  --member=serviceAccount:YOUR_SA@YOUR_PROJECT.iam.gserviceaccount.com \
  --role=roles/artifactregistry.reader

# 読み書き（npm publish も行う場合）
gcloud artifacts repositories add-iam-policy-binding YOUR_REPO \
  --location=asia-northeast1 \
  --member=serviceAccount:YOUR_SA@YOUR_PROJECT.iam.gserviceaccount.com \
  --role=roles/artifactregistry.writer
```

### ワークフローの実装

```yaml
# .github/workflows/ci.yaml
jobs:
  build:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      id-token: write # Workload Identity Federation に必要

    steps:
      - uses: actions/checkout@v4

      - name: Authenticate to Google Cloud
        id: gcp-auth
        uses: google-github-actions/auth@v2
        with:
          workload_identity_provider: ${{ secrets.GCP_WORKLOAD_IDENTITY_PROVIDER }}
          service_account: ${{ secrets.GCP_SA_EMAIL }}
          token_format: access_token
```

`token_format: access_token` を指定することで、`steps.gcp-auth.outputs.access_token` にアクセストークンがセットされます。

cf. [google-github-actions/auth | GitHub](https://github.com/google-github-actions/auth?tab=readme-ov-file#outputs)

あとは用途に応じてこのトークンを使い分けます。

#### Docker ビルド時に渡す場合

```yaml
- name: Build with Docker
  uses: docker/build-push-action@v6
  with:
    context: .
    file: Dockerfile
    target: builder
    load: true
    tags: my-app:latest
    secrets: |
      NPM_TOKEN=${{ steps.gcp-auth.outputs.access_token }}
```

#### npm publish する場合

```yaml
- name: Publish package
  env:
    NPM_TOKEN: ${{ steps.gcp-auth.outputs.access_token }}
  run: npm publish
```

## まとめ

| 環境           | トークンの取得方法               | トークンの渡し方               |
| -------------- | -------------------------------- | ------------------------------ |
| ローカル       | `gcloud auth print-access-token` | direnv で `NPM_TOKEN` に設定   |
| Docker         | ホストの `NPM_TOKEN` を利用      | BuildKit secrets               |
| GitHub Actions | Workload Identity Federation     | `steps.*.outputs.access_token` |

共通して重要なのは以下の 2 点です。

1. **プロジェクトの `.npmrc` に `${NPM_TOKEN}` プレースホルダーを設置する**ことで、環境ごとの認証方法を統一できる
2. **トークンをイメージレイヤーや環境変数に残さない**よう、BuildKit secrets や GitHub Actions の secrets を活用する

公式が推奨する方法は、ホストマシンの~/npmrcにトークンを設置することで、それ以外の環境については明記されておらず、開発の際に詰まりました。似たような状況の人の開発の助けになれば幸いです。
