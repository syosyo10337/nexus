---
tags:
  - rails
created: 2026-01-03
status: active
---

# perform/perfom_later

[https://railsguides.jp/active_job_basics.html#ジョブをキューに登録する](https://railsguides.jp/active_job_basics.html#%E3%82%B8%E3%83%A7%E3%83%96%E3%82%92%E3%82%AD%E3%83%A5%E3%83%BC%E3%81%AB%E7%99%BB%E9%8C%B2%E3%81%99%E3%82%8B)

```Ruby
# 「キューイングシステムが空いたらジョブを実行する」とキューに登録する
GuestsCleanupJob.perform_later guest
```