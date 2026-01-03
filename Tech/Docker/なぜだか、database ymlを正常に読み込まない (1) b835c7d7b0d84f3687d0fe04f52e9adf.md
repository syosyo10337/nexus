---
tags:
  - docker
  - container
created: 2026-01-03
status: draft
---

# なぜだか、database.ymlを正常に読み込まない (1)

既存のアプリ等で、別環境に対してkeyを発行してencrypted credentialsがばら撒かれている時は、masterkey を別途コンテナ内の環境に放り込む必要があります。

そうじゃないとrails環境変数？の部分でエラーが起きがち