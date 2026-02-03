---
tags:
  - github-actions
  - workflow
  - ci
  - cd
created: 2026-01-03
status: active
---

# 基本的な用語の理解

- Workflows

1 つ以上のジョブを実行する、自分で構成可能な自動化プロセスのこと。

yaml ファイルによって定義されて、リポジトリのイベントによってトリガーされた時に実行される。

手動でのトリガやスケジューラを使うこともできる。

- イベント

ワークフロー実行をトリガーする、リポジトリ内の特定のアクティビティです

pull request が作成された時。

- ジョブ

ジョブは、同じランナーで実行される、ワークフロー内の一連の  *ステップ*  です。 各ステップは、実行されるシェル スクリプト、または実行される  *アクション*  のいずれかです。

- アクション

*アクション*  は、GitHub Actions 用のカスタム アプリケーションであり、複雑で頻繁に繰り返されるタスクを実行します。 アクションを使用すると、ワークフロー ファイルに記述する繰り返しコードの量を削減するのに役立ちます

- ランナー

ワークフローがトリガーされると実際にジョブを実行するサーバのこと。

## アクションの基本構造

```text
- workflow

  - job1

    - step1

    - step2

  - job2

    - step1

    - step2
```

cf. [https://www.youtube.com/watch?v=sx-aIgP2S00](https://www.youtube.com/watch?v=sx-aIgP2S00)

## yml の書き方

```YAML
name: learn-github-actions #(optional) Actionsタブに表示されるワークフローの名前
run-name: ${{ github.actor }} is learning GitHub Actions #(optional)
on: [push]
jobs:
  check-bats-version:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm install -g bats
      - run: bats -v
```

### name と run-name の違いについて

![画像](GitHub%20Actions/Attachments/Screenshot_2024-04-24_at_15.27.35.png)

## アクション

cf. [composite action を作成する。](<Github%20Actions%E3%82%92(%E7%A0%94%E3%81%8E)%E3%81%99%E3%81%BE%E3%81%9B%E3%81%B0/composite%20action%E3%82%92%E4%BD%9C%E6%88%90%E3%81%99%E3%82%8B%E3%80%82%202a238cdd027d805da88cda3a88526093.html>)

cf. [https://docs.github.com/ja/actions/learn-github-actions/finding-and-customizing-actions?learn=getting_started&learnProduct=actions#using-inputs-and-outputs-with-an-action](https://docs.github.com/ja/actions/learn-github-actions/finding-and-customizing-actions?learn=getting_started&learnProduct=actions#using-inputs-and-outputs-with-an-action)

cf. [format](<Github%20Actions%E3%82%92(%E7%A0%94%E3%81%8E)%E3%81%99%E3%81%BE%E3%81%9B%E3%81%B0/format%202cc38cdd027d8078b4ebfa6488ca5926.html>)

## ワークフロー内で変数を使う(環境変数)

env に設定した値を、node client.js 内部で使用することができます。

```YAML
jobs:
  example-job:
    runs-on: ubuntu-latest
    steps:
      - name: Connect to PostgreSQL
        run: node client.js
        env:
          POSTGRES_HOST: postgres
          POSTGRES_PORT: 5432
```

[https://docs.github.com/ja/actions/learn-github-actions/finding-and-customizing-actions?learn=getting_started&learnProduct=actions#using-inputs-and-outputs-with-an-action](https://docs.github.com/ja/actions/learn-github-actions/finding-and-customizing-actions?learn=getting_started&learnProduct=actions#using-inputs-and-outputs-with-an-action)

## Github で用意されている変数の理由

[

変数リファレンス - GitHub ドキュメント

GitHub Actions ワークフローでサポートされている変数、名前付け規則、制限、コンテキストについて説明します。

cf. [https://docs.github.com/ja/actions/reference/workflows-and-actions/variables](https://docs.github.com/ja/actions/reference/workflows-and-actions/variables)

cf. [head_ref on PR/ ref_name on Push](<Github%20Actions%E3%82%92(%E7%A0%94%E3%81%8E)%E3%81%99%E3%81%BE%E3%81%9B%E3%81%B0/head_ref%20on%20PR%20ref_name%20on%20Push%202b038cdd027d8084bf11f82eae0df00c.html>)

cf. [重複実行をやめる](<Github%20Actions%E3%82%92(%E7%A0%94%E3%81%8E)%E3%81%99%E3%81%BE%E3%81%9B%E3%81%B0/%E9%87%8D%E8%A4%87%E5%AE%9F%E8%A1%8C%E3%82%92%E3%82%84%E3%82%81%E3%82%8B%202b038cdd027d8020a327ff070b7baa93.html>)

ワークフローの詳細。

- 構文チートシート

[https://docs.github.com/ja/actions/using-workflows/workflow-syntax-for-github-actions#onworkflow_callinputs](https://docs.github.com/ja/actions/using-workflows/workflow-syntax-for-github-actions#onworkflow_callinputs)

[

ワークフローについて - GitHub Docs

トリガー、構文、高度な機能など、GitHub Actions のワークフローの概要について説明します。

cf. [https://docs.github.com/ja/actions/using-workflows/about-workflows?learn=getting_started&learnProduct=actions](https://docs.github.com/ja/actions/using-workflows/about-workflows?learn=getting_started&learnProduct=actions)

より高度なワークフロー機能について

- シークレットの保存

- 依存ジョブの作成

- マトリックスを使用。

- 依存関係のキャッシング

ワークフローについて - GitHub Docs

トリガー、構文、高度な機能など、GitHub Actions のワークフローの概要について説明します。

cf. [https://docs.github.com/ja/actions/using-workflows/about-workflows?learn=getting_started&learnProduct=actions#advanced-workflow-features](https://docs.github.com/ja/actions/using-workflows/about-workflows?learn=getting_started&learnProduct=actions#advanced-workflow-features)

## 入力を受け付ける

```YAML
on:
  workflow_call:
    inputs:
      username:
        description: 'A username passed from the caller workflow'
        default: 'john-doe'
        required: false
        type: string

jobs:
  print-username:
    runs-on: ubuntu-latest

    steps:
      - name: Print the input name to STDOUT
        run: echo The username is ${{ inputs.username }}
```

[

ギットハブ　アクション　のワークフロー構文 - GitHub Docs

ワークフローは、1 つ以上のジョブからなる設定可能な自動化プロセスです。 ワークフローの設定を定義するには、YAML ファイルを作成しなければなりません。

https://docs.github.com/ja/actions/using-workflows/workflow-syntax-for-github-actions#onworkflow_callinputs

https://docs.github.com/ja/actions/using-workflows/workflow-syntax-for-github-actions#onworkflow_callinputs

## Flutter 関連

pubspec.yaml のバージョンを Github Actions で更新する

※ 補足 作成当初は気づいていませんでしたが、題材については似た先人の記事もありました！ （改めて zenn にまとめる際に参考にさせてもらいました） https://naipaka.hatenablog.com/entry/2022/03/18/204856

https://zenn.dev/beeeyan/articles/ffe38e4fad00bc

![](GitHub%20Actions/Attachments/og-base-w1200-v2.png)](https://zenn.dev/beeeyan/articles/ffe38e4fad00bc)

[

【Flutter】GitHub Actions で pubspec.yml 記載のビルド番号をインクリメントする - ないぱかの記録

概要 最近個人開発や副業で Flutter で CI/CD 環境を構築しています。 その中で PR をトリガーに pubspec.yml 記載のビルド番号をインクリメントして push まで行うジョブを作ってみたので紹介します。 GitHub Actions でワークフローが走るたびに採番される番号をビルド番号に使うのも良さそうなのですが、…

![](GitHub%20Actions/Attachments/link.png)https://naipaka.hatenablog.com/entry/2022/03/18/204856

![](GitHub%20Actions/Attachments/1647604136.png)](https://naipaka.hatenablog.com/entry/2022/03/18/204856)

[https://github.com/x-motemen/git-pr-release](https://github.com/x-motemen/git-pr-release)

## e.g. PR 出したとき、main にまーじされたときどちらも走らせたい。

```Bash
  workflow_dispatch:
  pull_request:
    paths:
      - "slack-bot/**"
      - ".github/workflows/deploy-slack-bot.yml"
  push:
    branches: [main]
    paths:
      - "slack-bot/**"
      - ".github/workflows/deploy-slack-bot.yml"
```

# 重複実行を避ける。

以下にすると良いらしい？

```YAML
on:
  push:
    branches:
    - master
  pull_request:
    branches:
    - master
```

[

How to trigger an action on push or pull request but not both? · community · Discussion #26276

I would like my workflow to be triggered by either a push or a pull-request, but if it a push to a pull-request only trigger one rather than two workflows. Something like, on: [push | pull_request]

https://github.com/orgs/community/discussions/26276

conrurrency でも避けられそう

GitHub Actions 　のワークフロー構文 - GitHub ドキュメント

ワークフローは、1 つ以上のジョブからなる設定可能な自動化プロセスです。 ワークフローの設定を定義するには、YAML ファイルを作成しなければなりません。

https://docs.github.com/ja/actions/reference/workflows-and-actions/workflow-syntax#concurrency

https://docs.github.com/ja/actions/reference/workflows-and-actions/workflow-syntax#concurrency

### 権限を与える。(permissions)

[

権限をジョブに割り当てる - GitHub Enterprise Cloud Docs

GITHUB_TOKEN に付与される既定の権限を変更します。

https://docs.github.com/ja/enterprise-cloud@latest/actions/using-jobs/assigning-permissions-to-jobs

](https://docs.github.com/ja/enterprise-cloud@latest/actions/using-jobs/assigning-permissions-to-jobs)

[

github actions の「permissions」とはなにか？

https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions#permissions

https://zenn.dev/not75743/scraps/926f2693809744

](https://zenn.dev/not75743/scraps/926f2693809744)

## workflow が表示されない

[

Events that trigger workflows - GitHub Docs

You can configure your workflows to run when specific activity on GitHub happens, at a scheduled time, or when an event outside of GitHub occurs.

https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows#workflow_dispatch

](https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows#workflow_dispatch)

## step 間で値を共有

[

GitHub Actions で step 間で値を共有する - Qiita

この記事は何 GitHub Actions を利用していて、step 間で値を共有して、実行した場面があったため、その方法を記載した記事になります。方法 GITHUB_OUTPUT を利用します。st…

![](GitHub%20Actions/Attachments/production-c620d3e403342b1022967ba5e3db1aaa.ico)https://qiita.com/fussy113/items/def629e9922e0ce2d924

![](GitHub%20Actions/Attachments/article-ogp-background-412672c5f0600ab9a64263b751f1bc81.jpeg)](https://qiita.com/fussy113/items/def629e9922e0ce2d924)

# Cache 戦略

3 種類の cache が存在する

**Package Manager Cache**

e.g. npm/yarn for JavaScript

**Docker Layer Cache**

e.g. Image layers/Build cache/Multi-stage build cache

**Build Output Cache**

e.g. Compiled assets /Generated files/ Test result

## 参考

- cache 戦略: [https://medium.com/@everton.spader/how-to-cache-package-dependencies-between-branches-with-github-actions-e6a19f33783a](https://medium.com/@everton.spader/how-to-cache-package-dependencies-between-branches-with-github-actions-e6a19f33783a)

- 過去に実装した内容

  ```Shell
  # Birdcage を Feature 環境にデプロイするためのワークフローです｡
  # 1. CIはブランチのpushに毎回行います(lint-and-type, unit-tests, ui-tests)
  # 2. CDは、draftではないPRが,master <- feature/*で存在する場合のみ行います。(check-deployment-conditions)

  name: Birdcage / Feature

  on:
    workflow_dispatch:
      inputs:
        deploy_to_feature:
          description: "Deploy to Feature environment after CI"
          required: false
          type: boolean
          default: false
    push:
      paths-ignore:
        - ".cursor/**"
        - ".github/pull_request_template.md"
        - "docs/**"
        - ".gitignore"
        - "**.md"
    pull_request:
      types:
        - opened
        - synchronize
        - reopened
        - ready_for_review
      branches:
        - master
        - feature/base/*

  concurrency:
    group: ${{ github.workflow }}-${{ github.head_ref || github.ref }}
    cancel-in-progress: true

  env:
    ENVIRONMENT: feature
    NEXT_TELEMETRY_DISABLED: 1

  jobs:
    check-deployment-conditions:
      name: Check Deployment Conditions
      runs-on: ubuntu-24.04
      outputs:
        should_deploy: ${{ steps.check-deploy.outputs.should_deploy }}
      steps:
        - name: Check deployment conditions
          id: check-deploy
          shell: bash
          run: |
            if [[ "${{ github.event_name }}" == "pull_request" && \
                  "${{ github.event.pull_request.draft }}" == "false" && \
                  "${{ github.event.pull_request.head.ref }}" =~ ^feature/.* && \
                  ( "${{ github.event.pull_request.base.ref }}" == "master" || \
                    "${{ github.event.pull_request.base.ref }}" =~ ^feature/base/.* ) ]]; then
              echo "should_deploy=true" >> $GITHUB_OUTPUT
            else
              echo "should_deploy=false" >> $GITHUB_OUTPUT
            fi

    lint-and-type:
      name: Lint and Type Check
      runs-on: ubuntu-24.04
      steps:
        - name: Generate token for Avalon CI/CD Ops App
          id: generate_token_for_avalon_cicd_ops_gh_app
          uses: tibdex/github-app-token@v2
          with:
            app_id: ${{ secrets.GH_AVALON_CICD_OPS_APP_ID }}
            private_key: ${{ secrets.GH_AVALON_CICD_OPS_APP_SECRET_KEY }}

        # NOTE: Composite Actions は Checkoutされないと使えないため、リポジトリのチェックアウトはComposite Actionとして定義できない。
        - name: Checkout repository
          uses: actions/checkout@v4
          with:
            token: ${{ steps.generate_token_for_avalon_cicd_ops_gh_app.outputs.token }}
            submodules: true

        - name: Run lint and type check
          uses: ./.github/actions/lint-and-type-check
          with:
            environment: ${{ env.ENVIRONMENT }}

        # lint/type checkは失敗の場合のみ通知する。
        - name: Notify if lint/type check failure
          uses: ./.github/actions/notify-failure
          if: failure()
          with:
            SLACK_CHANNEL: ${{ secrets.SLACK_NOTIFICATION_CHANNEL_AVALON }}
            SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK }}

    unit-tests:
      name: Unit Tests
      runs-on: ubuntu-24.04
      needs: lint-and-type
      steps:
        - name: Generate token for Avalon CI/CD Ops App
          id: generate_token_for_avalon_cicd_ops_gh_app
          uses: tibdex/github-app-token@v2
          with:
            app_id: ${{ secrets.GH_AVALON_CICD_OPS_APP_ID }}
            private_key: ${{ secrets.GH_AVALON_CICD_OPS_APP_SECRET_KEY }}

        - name: Checkout repository
          uses: actions/checkout@v4
          with:
            token: ${{ steps.generate_token_for_avalon_cicd_ops_gh_app.outputs.token }}
            submodules: true

        - name: Run unit tests
          uses: ./.github/actions/unit-test
          with:
            environment: ${{ env.ENVIRONMENT }}

        - name: Notify if test failure
          uses: ./.github/actions/notify-failure
          if: failure()
          with:
            SLACK_CHANNEL: ${{ secrets.SLACK_NOTIFICATION_CHANNEL_AVALON }}
            SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK }}

    ui-tests:
      name: Storybook UI Tests
      runs-on: ubuntu-24.04
      needs: lint-and-type
      steps:
        - name: Generate token for Avalon CI/CD Ops App
          id: generate_token_for_avalon_cicd_ops_gh_app
          uses: tibdex/github-app-token@v2
          with:
            app_id: ${{ secrets.GH_AVALON_CICD_OPS_APP_ID }}
            private_key: ${{ secrets.GH_AVALON_CICD_OPS_APP_SECRET_KEY }}

        - name: Checkout repository
          uses: actions/checkout@v4
          with:
            token: ${{ steps.generate_token_for_avalon_cicd_ops_gh_app.outputs.token }}
            submodules: true

        - name: Run Storybook UI tests
          uses: ./.github/actions/ui-test
          with:
            environment: ${{ env.ENVIRONMENT }}

        - name: Notify if UI test failure
          uses: ./.github/actions/notify-failure
          if: failure()
          with:
            SLACK_CHANNEL: ${{ secrets.SLACK_NOTIFICATION_CHANNEL_AVALON }}
            SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK }}

    build-and-push:
      name: Build and Push Application
      runs-on: ubuntu-24.04
      needs: [check-deployment-conditions, lint-and-type, unit-tests, ui-tests]
      if: |
        needs.check-deployment-conditions.outputs.should_deploy == 'true' ||
        (github.event_name == 'workflow_dispatch' && github.event.inputs.deploy_to_feature == 'true')
      permissions:
        id-token: write # This is required for requesting the JWT (for google-github-actions/auth)
        contents: read # This is required for actions/checkout
      outputs:
        deploy_target_image_base64: ${{ steps.set-deploy-target-image.outputs.deploy_target_image_base64 }}
      steps:
        - name: Generate token for Avalon CI/CD Ops App
          id: generate_token_for_avalon_cicd_ops_gh_app
          uses: tibdex/github-app-token@v2
          with:
            app_id: ${{ secrets.GH_AVALON_CICD_OPS_APP_ID }}
            private_key: ${{ secrets.GH_AVALON_CICD_OPS_APP_SECRET_KEY }}

        # NOTE: Composite Actions は Checkoutされないと使えないため、リポジトリのチェックアウトはComposite Actionとして定義できない。
        - name: Checkout repository
          uses: actions/checkout@v4
          with:
            token: ${{ steps.generate_token_for_avalon_cicd_ops_gh_app.outputs.token }}
            submodules: true

        - name: Build and push image
          id: build-and-push
          uses: ./.github/actions/build-and-push-image
          with:
            workload_identity_provider: ${{ secrets.AVALON_GCP_WORKLOAD_IDENTITY_PROVIDER_SYOYA_INTERNAL }}
            service_account: ${{ secrets.AVALON_SA_EMAIL_GCR }}
            project_id: ${{ secrets.GCP_PROJECT_ID_SYOYA_INTERNAL }}
            environment: ${{ env.ENVIRONMENT }}
        # NOTE: GitHub Actionsでは、ジョブ間で出力を渡す際に、Composite Actionの出力を直接参照すると
        # 正しく伝播しなかった。そのため、base64エンコードしてからジョブの出力として設定し、受け取り側でデコードする。
        - name: Set deploy target image output (base64 encoded)
          id: set-deploy-target-image
          shell: bash
          run: |
            DEPLOY_TARGET_IMAGE="${{ steps.build-and-push.outputs.deploy_target_image }}"
            if [ -z "$DEPLOY_TARGET_IMAGE" ]; then
              echo "Error: DEPLOY_TARGET_IMAGE is empty"
              exit 1
            fi
            # Base64エンコードしてジョブの出力として設定
            DEPLOY_TARGET_IMAGE_B64=$(echo -n "$DEPLOY_TARGET_IMAGE" | base64 | tr -d '\n')
            echo "deploy_target_image_base64=$DEPLOY_TARGET_IMAGE_B64" >> $GITHUB_OUTPUT

        # GCRへのpushが失敗した場合のみ通知する。
        - name: Notify if GCR push failure
          uses: ./.github/actions/notify-failure
          if: failure()
          with:
            SLACK_CHANNEL: ${{ secrets.SLACK_NOTIFICATION_CHANNEL_AVALON }}
            SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK }}

    deploy:
      name: Deploy to Feature Environment
      runs-on: ubuntu-24.04
      needs: build-and-push
      permissions:
        id-token: write # This is required for requesting the JWT (for google-github-actions/auth)
        contents: read # This is required for actions/checkout
      steps:
        - name: Checkout repository
          uses: actions/checkout@v4

        - name: Setup Google Cloud CLI for GKE
          uses: ./.github/actions/setup-google-cloud
          with:
            WORKLOAD_IDENTITY_PROVIDER: ${{ secrets.AVALON_GCP_WORKLOAD_IDENTITY_PROVIDER_SYOYA_AVALON_DEV }}
            SERVICE_ACCOUNT: ${{ secrets.AVALON_SA_EMAIL_GKE_FEATURE }}
            PROJECT_ID: ${{ secrets.GCP_PROJECT_ID_SYOYA_AVALON_DEV }}
            GCLOUD_INSTALL_COMPONENTS: "gke-gcloud-auth-plugin"
            ENABLE_GET_GKE_CREDENTIALS: "true"
            GKE_PROJECT_ID: ${{ secrets.GCP_PROJECT_ID_SYOYA_AVALON_DEV }}
            GKE_CLUSTER_ID: ${{ secrets.AVALON_GKE_CLUSTER_ID_FEATURE }}
            GKE_CLUSTER_LOCATION: ${{ secrets.AVALON_GKE_CLUSTER_LOCATION_FEATURE }}

        - name: Setup Deployment Tools
          uses: ./.github/actions/setup-deployment-tools

        # NOTE: build-and-pushジョブからbase64エンコードされた値を取得し、デコードしてから使用する。
        - name: Deploy to feature environment
          run: |
            DEPLOY_TARGET_IMAGE_B64="${{ needs.build-and-push.outputs.deploy_target_image_base64 }}"
            if [ -z "$DEPLOY_TARGET_IMAGE_B64" ]; then
              echo "Error: deploy_target_image_base64 is not set or empty"
              exit 1
            fi
            # Base64デコード
            DEPLOY_TARGET_IMAGE=$(echo -n "$DEPLOY_TARGET_IMAGE_B64" | base64 -d)
            if [ -z "$DEPLOY_TARGET_IMAGE" ]; then
              echo "Error: Failed to decode deploy_target_image_base64"
              exit 1
            fi
            make deploy \
              IMAGE="$DEPLOY_TARGET_IMAGE" \
              ENV=${{ env.ENVIRONMENT }} \
              IS_CI=true

        - name: Notify if deployment success
          uses: ./.github/actions/notify-success
          if: success()
          with:
            SLACK_CHANNEL: ${{ secrets.SLACK_NOTIFICATION_CHANNEL_AVALON }}
            SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK }}

        - name: Notify if deployment failure
          uses: ./.github/actions/notify-failure
          if: failure()
          with:
            SLACK_CHANNEL: ${{ secrets.SLACK_NOTIFICATION_CHANNEL_AVALON }}
            SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK }}
  ```

  ```Shell
  name: 'Run Unit Tests'
  description: |
    Dockerイメージをビルドし、コンテナ内でunit testsを実行します。
    テスト結果とカバレッジレポートをアップロードします。

  inputs:
    environment:
      description: "Environment name (feature or staging)"
      required: true

  runs:
    using: "composite"
    steps:
      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Set cache scope
        id: set-cache-scope
        shell: bash
        run: |
          CACHE_SCOPE="${{ inputs.environment }}-builder-stage"
          echo "cache_scope=$CACHE_SCOPE" >> $GITHUB_OUTPUT

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

      - name: Run unit tests
        shell: bash
        run: |
          set +e
          docker run --name test-runner birdcage:builder npm run test:ci
          TEST_EXIT_CODE=$?
          set -e

          # テスト結果を抽出
          docker cp test-runner:/opt/birdcage/test-results.xml ./ || true
          docker cp test-runner:/opt/birdcage/coverage ./ || true

          # クリーンアップ
          docker rm test-runner || true

          exit $TEST_EXIT_CODE

      - name: Upload test results
        uses: actions/upload-artifact@v4
        if: always()
        with:
          name: unit-test-results
          path: |
            test-results.xml
            coverage/
          retention-days: 7
  ```

# matrix での並行実行

```Bash
name: Sync Notion Docs to GCS

on:
  schedule:
    - cron: "0 15 * * 1-5" # UTC (JST 0:00)
  workflow_dispatch:
    inputs:
      root_page_key:
        description: "Sync specific root page only (leave empty for all)"
        required: false
        type: choice
        # 選ぶ
        options:
          - PRODUCT_DOCS
          - CHIMER_TENANT_OPS
          - CHIMER_FEATURE
        default: "PRODUCT_DOCS"

permissions:
  id-token: write # Required for Workload Identity Federation
  contents: read # Required for actions/checkout

jobs:
  prepare:
    runs-on: ubuntu-latest
    outputs:
      matrix: ${{ steps.set-matrix.outputs.matrix }}
    steps:
      - name: Set matrix
        id: set-matrix
        run: |
          # root_page_keyが指定されている場合は単一ジョブ、それ以外は全ジョブ
          if [ -n "${{ inputs.root_page_key }}" ]; then
            echo 'matrix={"include":[{"key":"${{ inputs.root_page_key }}"}]}' >> $GITHUB_OUTPUT
          else
            echo 'matrix={"include":[{"key":"PRODUCT_DOCS"},{"key":"CHIMER_TENANT_OPS"},{"key":"CHIMER_FEATURE"}]}' >> $GITHUB_OUTPUT
          fi

  fetch-documents:
    needs: prepare
    runs-on: ubuntu-latest
    strategy:
      matrix: ${{ fromJson(needs.prepare.outputs.matrix) }}
      fail-fast: false # 1つ失敗しても他は継続
    name: Sync ${{ matrix.key }}

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "24"
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Fetch Notion pages and convert to Markdown
        working-directory: tools
        run: npm run sync
        env:
          NOTION_API_TOKEN: ${{ secrets.NOTION_API_TOKEN }}
          # matrix.keyに対応するroot page IDをsecretsから取得
          # 例: NOTION_ROOT_PAGE_ID_DOCS, NOTION_ROOT_PAGE_ID_PRODUCT など
          NOTION_ROOT_PAGE_ID: ${{ secrets[format('NOTION_ROOT_PAGE_ID_{0}', matrix.key)] }}
          GCS_BUCKET_NAME: ${{ secrets.GCS_BUCKET_NAME }}

      - name: Upload artifact
        uses: actions/upload-artifact@v4
        with:
          name: notion-${{ matrix.key }}
          path: notion/
          retention-days: 1

  sync-to-gcs:
    needs: fetch-documents
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Download all artifacts
        uses: actions/download-artifact@v4
        with:
          path: notion/
          pattern: notion-*
          merge-multiple: true

      - name: Install Pandoc
        run: sudo apt-get install -y pandoc

      - name: Convert MD to HTML
        run: ./.github/script/convert-md-to-html.sh "notion" "dist"

      - name: Setup Google Cloud CLI for GCR
        uses: ./.github/actions/setup-google-cloud
        with:
          WORKLOAD_IDENTITY_PROVIDER: ${{ secrets.AVALON_GCP_WORKLOAD_IDENTITY_PROVIDER_SYOYA_INTERNAL }}
          SERVICE_ACCOUNT: ${{ secrets.AVALON_SA_EMAIL_GCR }} # NOTE: GCRとあるが、Internal projectのワークフロー用のSA
          PROJECT_ID: ${{ secrets.GCP_PROJECT_ID_SYOYA_INTERNAL }}
          ENABLE_GET_GKE_CREDENTIALS: "false"

      - name: Sync HTML to GCS
        run: |
          gcloud storage rsync ./dist/notion gs://${{ secrets.GCS_BUCKET_NAME }}/notion \
            --recursive \
            --delete-unmatched-destination-objects \
            --content-type=text/html

      - name: Notify if deployment success
        uses: ./.github/actions/notify-success
        if: success()
        with:
          SLACK_CHANNEL: ${{ secrets.SLACK_NOTIFICATION_CHANNEL_AVALON }}
          SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK }}

      - name: Notify if deployment failure
        uses: ./.github/actions/notify-failure
        if: failure()
        with:
          SLACK_CHANNEL: ${{ secrets.SLACK_NOTIFICATION_CHANNEL_AVALON }}
          SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK }}
```
