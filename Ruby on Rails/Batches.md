---
tags:
  - rails
created: 2026-01-03
status: draft
---

# ::Batches

## find_eachのバッチサイズを変更する

batch_sizeのoptionを取ることで設定できる

```Ruby
target_users.find_each(batch_size: 200) do |user|
```