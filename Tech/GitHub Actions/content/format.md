---
tags:
  - github-actions
  - workflow
created: 2026-01-03
status: active
---

# format

[

ワークフローとアクションで式を評価する - GitHub ドキュメント

GitHub Actions 内の式について説明します。

![](GitHub%20Actions/Attachments%201/favicon.png)https://docs.github.com/ja/actions/reference/workflows-and-actions/expressions

![](GitHub%20Actions/Attachments%201/actions.png)](https://docs.github.com/ja/actions/reference/workflows-and-actions/expressions)

```Bash
format( string, replaceValue0, replaceValue1, ..., replaceValueN)
# e.g.
format('Hello {0} {1} {2}', 'Mona', 'the', 'Octocat')
```