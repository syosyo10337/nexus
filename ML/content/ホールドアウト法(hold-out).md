---
tags:
  - machine-learning
  - data
created: 2026-01-04
status: active
---

# ホールドアウト法(hold-out)

---

教師あり学習において、教師データの扱いを、

- {TRAIN}学習に利用するデータ(training datasets)

- {TEST}学習に関与させずに、正解率の検証にのみ利用するデータ(test/validation datasets)

に分割すること。

目安としては、20~30％の教師データをテストデータにすると良い。

sklearnにおいては、train_test_splitメソッドを活用するとhold-out methodが簡単に実践できるそうだよ。

[train_test_split()](../scikit-learn%E5%85%A5%E9%96%80/train_test_split\(\)%206f444b455a114dc1b8c8d8f3abd68e9e.html)