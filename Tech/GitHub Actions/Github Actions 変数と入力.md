---
tags:
  - github-actions
  - variables
  - environment
  - inputs
created: 2026-02-06
status: active
---

# GitHub Actions 変数と入力

## ワークフロー内で変数を使う（環境変数）

`env`に設定した値を、`node client.js`内部で使用することができます。

```yaml
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

## GitHubで用意されている変数

[変数リファレンス - GitHub ドキュメント](https://docs.github.com/ja/actions/reference/workflows-and-actions/variables)

GitHub Actionsワークフローでサポートされている変数、名前付け規則、制限、コンテキストについて説明します。

## 入力を受け付ける

再利用可能なワークフローで入力を定義できます。

```yaml
on:
  workflow_call:
    inputs:
      username:
        description: "A username passed from the caller workflow"
        default: "john-doe"
        required: false
        type: string

jobs:
  print-username:
    runs-on: ubuntu-latest
    steps:
      - name: Print the input name to STDOUT
        run: echo The username is ${{ inputs.username }}
```

[ワークフロー構文 - inputs](https://docs.github.com/ja/actions/using-workflows/workflow-syntax-for-github-actions#onworkflow_callinputs)

## Step間で値を共有

`GITHUB_OUTPUT`を利用して、step間で値を共有できます。

```yaml
steps:
  - name: Set output
    id: step1
    run: echo "result=success" >> $GITHUB_OUTPUT

  - name: Use output
    run: echo "Previous step result: ${{ steps.step1.outputs.result }}"
```

[GitHub Actions で step間で値を共有する - Qiita](https://qiita.com/fussy113/items/def629e9922e0ce2d924)

## 参考リンク

- [アクションで入出力を使用する](https://docs.github.com/ja/actions/learn-github-actions/finding-and-customizing-actions?learn=getting_started&learnProduct=actions#using-inputs-and-outputs-with-an-action)
- [変数のデフォルト値](https://docs.github.com/ja/actions/learn-github-actions/variables#default-environment-variables)
