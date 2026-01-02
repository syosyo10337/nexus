 

🏐

# **Cloud Run functions**

e.g.

```Bash
gcloud functions deploy chimer-wiki-bot \
--gen2 \
--runtime=nodejs24 \
--region=asia-northeast1 \
--source=. \
--entry-point=slackEvents \
--trigger-http \
--allow-unauthenticated \
--timeout=60s \
--memory=512MB \
--min-instances=1 \
--set-secrets=SLACK_BOT_TOKEN=slack-bot-token:latest,SLACK_SIGNING_SECRET=slack-signing-secret:latest
```

## **コマンドの全体像**

これは**Google Cloud Functions（第2世代）**に、Slackボット「chimer-wiki-bot」をデプロイするためのコマンドです。

## **各オプションの詳細解説**

**基本設定**

**gcloud functions deploy <func-name>**

- ✅ chimer-wiki-botはあなたが命名している関数名です

- この名前でGoogle Cloud上に関数が作成・管理されます

- 同じ名前で再度デプロイすると、既存の関数が更新されます

**実行環境**

-gen2

- ✅ Cloud Functions第2世代を使用（推奨）

- 第1世代より高性能で、Cloud Runベースのアーキテクチャ

- より柔軟なスケーリングと長時間実行が可能

-runtime=nodejs24

- ✅ Node.js 24ランタイムを使用

- 2024年末時点での最新LTS版対応ランタイム

-region=asia-northeast1

- ✅ 東京リージョンにデプロイ

- 日本国内からの低レイテンシーアクセスが可能

**ソースコードとエントリーポイント**

-source=.

- カレントディレクトリのコードをデプロイ

- slack-bot/ディレクトリから実行することを想定

- -entry-point=slackEvents

- エクスポートされた関数名slackEventsを実行エントリーポイントとして指定

- コード内でexport const slackEvents = ...として定義されているはず

**HTTP トリガー設定**

-trigger-http

- ✅ HTTPリクエストでトリガーされる関数として設定

- Slackのイベントを受信するために必須

-allow-unauthenticated

- ⚠️ 認証なしでのアクセスを許可

- Slackからのリクエストを受け取るために必要

- セキュリティはSLACK_SIGNING_SECRETで検証する想定

**パフォーマンス設定**

-timeout=60s

- 関数の最大実行時間を60秒に設定

- Vertex AIとの通信時間を考慮した設定

-memory=512MB

- 割り当てメモリを512MBに設定

- メモリ量に応じてCPU性能も自動調整されます

-min-instances=1

- ⚠️ 最小インスタンス数を1に設定（コールドスタート回避）

- **注意**: 常時1インスタンスが起動するため、課金が発生し続けます

- Slackボットの応答速度を優先する場合に有効

**シークレット管理**

-set-secrets=SLACK_BOT_TOKEN=slack-bot-token:latest,SLACK_SIGNING_SECRET=slack-signing-secret:latest

- ✅ Google Secret Managerから環境変数として注入

- セキュアな認証情報管理のベストプラクティス

- フォーマット: 環境変数名=シークレット名:バージョン

## **セキュリティとベストプラクティス**

✅

**推奨されている点:**

- Secret Managerでの認証情報管理

- 第2世代Cloud Functionsの使用

- 東京リージョンの選択（レイテンシー）

⚠️

**注意が必要な点:**

- -allow-unauthenticated: コード内でSlack署名検証が必須

- -min-instances=1: コスト増加（月額約$6-10程度）

- コールドスタート対策が不要なら--min-instances=0も検討可能

## **実行前の確認事項**

シークレットを追加したとき、CloudRunのサービスアカウントにSecretへアクセスする権利を付与。（以下は個別のシークレットではなく、プロジェクト全体に付与)

```Bash
# Cloud Functions のデフォルトサービスアカウントに権限付与
PROJECT_ID=syoya-internal
PROJECT_NUMBER=$(gcloud projects describe $PROJECT_ID --format='value(projectNumber)')

gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:${PROJECT_NUMBER}-compute@developer.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"
```

- cf 以下のようなエラーが出力される。
    
    失敗。詳細: spec.template.spec.containers[0].env[1].value_from.secret_key_ref.name: Permission denied on secret: projects/877688327905/secrets/discovery-engine-engine-id/versions/latest for Revision service account [877688327905-compute@developer.gserviceaccount.com](mailto:877688327905-compute@developer.gserviceaccount.com). The service account used must be granted the 'Secret Manager Secret Accessor' role (roles/secretmanager.secretAccessor) at the secret, project or higher level. spec.template.spec.containers[0].env[2].value_from.secret_key_ref.name: Permission denied on secret: projects/877688327905/secrets/discovery-engine-project-id/versions/latest for Revision service account [877688327905-compute@developer.gserviceaccount.com](mailto:877688327905-compute@developer.gserviceaccount.com). The service account used must be granted the 'Secret Manager Secret Accessor' role (roles/secretmanager.secretAccessor) at the secret, project or higher level.
    

## **関連ドキュメント**

- Cloud Functions (gen2) 公式ドキュメント

- Secret Manager integration

- Node.js runtimes

# 作成したfunctionのURLを取得する

```Bash
# URLを取得
gcloud functions describe chimer-wiki-bot \
  --gen2 \
  --region=asia-northeast1 \
  --format="value(serviceConfig.uri)"
```