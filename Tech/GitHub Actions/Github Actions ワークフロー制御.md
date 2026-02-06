---
tags:
  - github-actions
  - workflow
  - triggers
  - permissions
  - concurrency
created: 2026-02-06
status: active
---

# GitHub Actions ワークフロー制御

## トリガーの設定

### PRとMainへのマージどちらも実行

```yaml
on:
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

## 重複実行を避ける

### Push/PRの両方で重複実行を避ける方法

```yaml
on:
  push:
    branches:
      - master
  pull_request:
    branches:
      - master
```

[How to trigger an action on push or pull request but not both?](https://github.com/orgs/community/discussions/26276)

### Concurrencyによる制御

`concurrency`を使用して、同じワークフローの重複実行を防ぐことができます。

```yaml
concurrency:
  group: ${{ github.workflow }}-${{ github.head_ref || github.ref }}
  cancel-in-progress: true
```

[ワークフロー構文 - concurrency](https://docs.github.com/ja/actions/reference/workflows-and-actions/workflow-syntax#concurrency)

## 権限を与える（Permissions）

`GITHUB_TOKEN`に付与される既定の権限を変更します。

```yaml
permissions:
  id-token: write # Workload Identity Federation用のJWT取得に必要
  contents: read # actions/checkoutに必要
```

### 参考

- [権限をジョブに割り当てる - GitHub Docs](https://docs.github.com/ja/enterprise-cloud@latest/actions/using-jobs/assigning-permissions-to-jobs)
- [github actionsの「permissions」とはなにか？](https://zenn.dev/not75743/scraps/926f2693809744)

## Workflowが表示されない

`workflow_dispatch`トリガーを設定すると、手動実行が可能になります。

```yaml
on:
  workflow_dispatch:
```

[Events that trigger workflows - workflow_dispatch](https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows#workflow_dispatch)

## 条件分岐

### デプロイ条件のチェック例

```yaml
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
                "${{ github.event.pull_request.head.ref }}" =~ ^feature/.* ]]; then
            echo "should_deploy=true" >> $GITHUB_OUTPUT
          else
            echo "should_deploy=false" >> $GITHUB_OUTPUT
          fi

  deploy:
    needs: check-deployment-conditions
    if: needs.check-deployment-conditions.outputs.should_deploy == 'true'
    runs-on: ubuntu-24.04
    steps:
      - name: Deploy
        run: echo "Deploying..."
```

## 参考リンク

- [ワークフロー構文リファレンス](https://docs.github.com/ja/actions/using-workflows/workflow-syntax-for-github-actions)
- [ワークフローをトリガーするイベント](https://docs.github.com/ja/actions/using-workflows/events-that-trigger-workflows)
- [重複実行をやめる](<Github%20Actions%E3%82%92(%E7%A0%94%E3%81%8E)%E3%81%99%E3%81%BE%E3%81%9B%E3%81%B0/%E9%87%8D%E8%A4%87%E5%AE%9F%E8%A1%8C%E3%82%92%E3%82%84%E3%82%81%E3%82%8B%202b038cdd027d8020a327ff070b7baa93.html>)
