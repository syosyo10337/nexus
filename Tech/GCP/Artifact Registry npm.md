---
tags:
  - GCP
  - npm
  - artifact-registry
  - private-package
created: 2026-02-06
updated_at: 2026-02-09
status: active
---

# 概要

npmのprivateパッケージをGoogle Cloudに配置する方法
基本は公式に則るで良さそう
cf. <https://docs.cloud.google.com/artifact-registry/docs/nodejs/authentication>

## 1. パッケージ作成と設定

### @scope/packageの形で、パッケージ名を設定する

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
@`<scope>`:registry=<https://asia-northeast1-npm.pkg.dev/avalon-project-id/my-repo-name/>

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

CIでWorkload Identity Federationなどを使いながら、SAによって認証したい場合には、追加で権限の付与が必要です。

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

1. ADC（Application Default Credentials）
   a. GOOGLE_APPLICATION_CREDENTIALS 環境変数
   a. デフォルトSA
   a. gcloud auth application-default login
1. `gcloud auth login`のアクティブアカウント
   の順で、認証情報をとってくるらしい。

ローカルで実行するときは、前項のCLI認証で問題ないと思うので知識として理解しておく。

### アクセストークンを取得する

```bash
# プロジェクトルートで実行
npx google-artifactregistry-auth
```

cf. <https://docs.cloud.google.com/artifact-registry/docs/nodejs/authentication?hl=ja#get-token>

これで認証は通るわけですが、、

> Artifact Registry はプロジェクト .npmrc ファイル内の Artifact Registry リポジトリの設定を読み取り、それらを使用してユーザーの .npmrc ファイルにトークン認>証情報を追加します。ユーザーの .npmrc ファイルにトークンを保存すると、認証情報が> ソースコードとソース コントロール システムから分離されます。

つまり、~/.npmrcに認証情報は置かれるってことですな。

## 4. パッケージの公開

```bash
# パッケージをビルド（必要に応じて）
npm run build

# パッケージを公開
npm publish
```

## 関連: 利用側でも、privaterepoへのアクセス情報が必要

Google CLIがインストールされている環境であれば、~/.npmrcに認証情報があるはずなので、プロジェクトごとに宛先だけかいた.npmrcがあればよいということになる

## Docker・CI 環境からアクセスするとき

Docker コンテナや CI サービスには gcloud CLI がないため、アクセストークンを外部から注入するアプローチが必要になる。

ポイントは以下の通り:

- プロジェクトの `.npmrc` に `${NPM_TOKEN}` プレースホルダーを設置する
- Docker では BuildKit secrets でトークンを渡す（`ARG`/`ENV` はレイヤーに残るので NG）
- CI では Workload Identity Federation 経由でアクセストークンを取得する

詳細な手順・コード例は以下の記事にまとめている:

[Artifact Registry の private npm パッケージに Docker・CI からアクセスする](private-npm-auth-in-docker-and-ci.md)
