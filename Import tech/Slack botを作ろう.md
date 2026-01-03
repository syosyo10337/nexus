---
tags:
  - misc
  - security
  - testing
  - api
created: 2026-01-04
status: active
---

![](Slack%20bot%E3%82%92%E4%BD%9C%E3%82%8D%E3%81%86/Slack_icon_2019.svg)

# Slack botを作ろう

[こちら](https://api.slack.com/apps)からまずは作成を実行する

### 1.2 必要なPermissions (OAuth Scopes) の設定

**Bot Token Scopes** (Features > OAuth & Permissions):

`app_mentions:read # @メンションの検知   chat:write # メッセージ送信   reactions:read # リアクション検知   channels:history # チャンネル履歴読み取り   groups:history # プライベートチャンネル履歴   im:history # DMの履歴   mpim:history # グループDMの履歴`

**1.3 Event Subscriptionsの有効化**  
**Event Subscriptionsでボットが反応するイベントを登録する**

- **Request URL**:リクエスト先のURLを入力

**e.g.**

**Subscribe to bot events**:

- `app_mention`

- `reaction_added`

# TSでコードを書くときはslack Boltアップがおすすめ

[Slack Bolt](Slack%20bot%E3%82%92%E4%BD%9C%E3%82%8D%E3%81%86/Slack%20Bolt%202cb38cdd027d8020ab2dff31ee7a6c98.html)

[

Bolt 入門ガイド | Slack Developer Docs

このガイドでは、Bolt を使用して Slack アプリを起動し実行する方法について説明します。その過程で、新しい Slack アプリを作成し、ローカル環境を設定し、Slack ワークスペースからのメッセージをリッスンして応答するアプリを開発します。

![](Import%20tech/Attachments/favicon%202.ico)https://docs.slack.dev/tools/bolt-js/ja-jp/getting-started/#tokens-and-installing-apps



](https://docs.slack.dev/tools/bolt-js/ja-jp/getting-started/#tokens-and-installing-apps)

### Cloud Run Functionsでデプロイ

# デプロイ実行

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