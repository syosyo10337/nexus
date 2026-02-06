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

リポジトリ構成出力コマンド`gcloud artifacts print-settings npm ..` 以下略
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

認証ヘルパー [google-artifactregistry-auth](https://www.npmjs.com/package/google-artifactregistry-auth)の実行をします。

この認証ライブラリは、

1. ADC
2. `gcloud auth application-default login`などのgcloud CLI
   の順で、認証情報をとってくるらしい。

ローカルで実行するときは、前項のCLI認証で問題ないと思うので知識として理解しておく。

### アクセストークンを取得する

```bash
# プロジェクトルートで実行
npx google-artifactregistry-auth
```

cf. <https://docs.cloud.google.com/artifact-registry/docs/nodejs/authentication?hl=ja#get-token>

これで認証は通るわけですが、、

> Artifact Registry はプロジェクト .npmrc ファイル内の Artifact Registry リ> ポジトリの設定を読み取り、それらを使用してユーザーの .npmrc ファイルにトークン認> 証情報を追加します。ユーザーの .npmrc ファイルにトークンを保存すると、認証情報が> ソースコードとソース コントロール システムから分離されます。

つまり、~/.npmrcに認証情報は置かれるってことですな。

### 4. パッケージの公開

```bash
# パッケージをビルド（必要に応じて）
npm run build

# パッケージを公開
npm publish
```

## 関連: 利用側でも、privaterepoへのアクセス情報が必要

Google CLIがインストールされている環境であれば、~/.npmrcに認証情報があるはずなので、プロジェクトごとに宛先だけかいた.npmrcがあればよいということになる
ただし、dockerコンテナやCIサービスで npm iなどアクセスする場合には、access_tokenが必要になる

### 対応策の一例

#### Dockerコンテナへ: .envrcをつかって,環境変数としてprint

```bash
Artifact Registry認証用のNPMトークンを動的に取得
# direnvがインストールされている必要があります
# 初回は `direnv allow` を実行してください

export NPM_TOKEN=$(gcloud auth print-access-token 2>/dev/null)

if [ -z "$NPM_TOKEN" ]; then
  echo "⚠️  Warning: Failed to get GCP access token"
  echo "   Run: gcloud auth login"
fi
```

それをcomposeのsecrets値として渡してあげる

```yaml
# 例: NPM_TOKENの名前で受け取っている
services:
  storybook:
    image: birdcage:local
    build:
      context: .
      dockerfile: Dockerfile
      target: dev
      args:
        BUILDKIT_INLINE_CACHE: 1
      secrets:
        - NPM_TOKEN
    ports:
      - "127.0.0.1:6006:6006"
    environment:
      - NODE_ENV=development
      - NPM_TOKEN=${NPM_TOKEN}
    command: npm run sb:no-open -- --host 0.0.0.0
    profiles:
      - storybook
      - dev
    volumes:
      - ./:/opt/birdcage

secrets:
  NPM_TOKEN:
    environment: NPM_TOKEN
```

#### CI: 専用のSAを作って、workload indentity federation経由でアクセストークンだけ持ってくる

```yaml
# ...
- name: Authenticate to Google Cloud
  id: gcp-auth
  uses: google-github-actions/auth@v2
  with:
    workload_identity_provider: ${{ secrets.AVALON_GCP_WORKLOAD_IDENTITY_PROVIDER_SYOYA_INTERNAL }}
    service_account: ${{ secrets.AVALON_SA_EMAIL_GCR }} #GCR用のSAを拝借
    token_format: access_token
```

このようにすると、本来ユーザ環境で必要な ~/.npmrcに配置されているaccss_tokenが
`steps.xxx.outputs.access_token`という形でセットできる。こいつを使えばよい。

```yaml
# e.g.buildkitで用いるとき
# docker secretsに入れてあげる
- name: Build builder stage with GHA cache
  uses: docker/build-push-action@v6
  with:
    context: .
    file: Dockerfile
    target: builder
    load: true
    tags: birdcage:builder
    cache-from: type=gha,scope=${{ steps.set-cache-scope.outputs.cache_scope }}
    cache-to: type=gha,mode=max,scope=${{ steps.set-cache-scope.outputs.cache_scope }}
    secrets: |
      NPM_TOKEN=${{ steps.gcp-auth.outputs.access_token }}
```

```yaml
# e.g. 自動でnpm publishしたいとき
- name: Publish package
  if: steps.check_version.outputs.exists == 'false'
  env:
    NPM_TOKEN: ${{ steps.gcp-auth.outputs.access_token }}
  run: npm publish
```
