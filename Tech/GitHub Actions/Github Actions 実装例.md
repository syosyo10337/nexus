---
tags:
  - github-actions
  - examples
  - ci-cd
  - matrix
created: 2026-02-06
status: active
---

# GitHub Actions 実装例

## Flutter関連

### pubspec.yamlのバージョンをGitHub Actionsで更新する

参考記事：

- [【Flutter】GitHub Actions で pubspec.yml 記載のビルド番号をインクリメントする](https://naipaka.hatenablog.com/entry/2022/03/18/204856)
- [pubspec.ymlのバージョン更新自動化（Zenn）](https://zenn.dev/beeeyan/articles/ffe38e4fad00bc)

PRをトリガーにpubspec.yml記載のビルド番号をインクリメントしてpushまで行う。

参考リポジトリ：[git-pr-release](https://github.com/x-motemen/git-pr-release)

## 実践例：Feature環境へのデプロイワークフロー

```yaml
# BirdcageをFeature環境にデプロイするためのワークフローです｡
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

      # NOTE: Composite Actionsはcheckoutされないと使えないため、
      # リポジトリのチェックアウトはComposite Actionとして定義できない。
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
      id-token: write # JWTリクエスト用（google-github-actions/auth）
      contents: read # actions/checkout用
    outputs:
      deploy_target_image_base64: ${{ steps.set-deploy-target-image.outputs.deploy_target_image_base64 }}
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
      id-token: write # JWTリクエスト用（google-github-actions/auth）
      contents: read # actions/checkout用
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

## Composite Action例：Unit Test

```yaml
name: "Run Unit Tests"
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

## Matrixでの並行実行

複数のジョブを並行して実行する際に、matrixを使って効率的に実行できます。

```yaml
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
        options:
          - PRODUCT_DOCS
          - CHIMER_TENANT_OPS
          - CHIMER_FEATURE
        default: "PRODUCT_DOCS"

permissions:
  id-token: write # Workload Identity Federation用
  contents: read # actions/checkout用

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
          SERVICE_ACCOUNT: ${{ secrets.AVALON_SA_EMAIL_GCR }}
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

### Matrix戦略のポイント

1. **動的なマトリックス生成**：`prepare`ジョブで条件に応じてマトリックスを生成
2. **fail-fast: false**：1つのジョブが失敗しても他のジョブを継続
3. **Artifacts**: ジョブ間でファイルを共有
