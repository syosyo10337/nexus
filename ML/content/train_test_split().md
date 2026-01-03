---
tags:
  - machine-learning
created: 2026-01-04
status: active
---

# train_test_split()

---

ref)

[

sklearn.model_selection.train_test_split

Examples using sklearn.model_selection.train_test_split: Release Highlights for scikit-learn 0.24 Release Highlights for scikit-learn 0.24 Release Highlights for scikit-learn 0.23 Release Highlight...

![](https://scikit-learn.org/stable/_static/favicon.ico)https://scikit-learn.org/stable/modules/generated/sklearn.model_selection.train_test_split.html

![](https://scikit-learn.org/stable/_static/scikit-learn-logo-small.png)](https://scikit-learn.org/stable/modules/generated/sklearn.model_selection.train_test_split.html)

### `x_train, x_test, y_train, y_test = \   sklearn.model_selection.``**train_test_split**``(   X, Y,` `_test_size=None_``,` `_random_state=None_``   )`

明確なものについてはreferenceを見に行ってください。

XとYを与えた上で、

test_sizeにで0.0 ~ 1.0 の値を取り、その割合分だけをtestデータとします。

整数を与えると件数での指定になるので、注意

また、この時、ランダムにtest/trainに分別するので、random_stateでシード値を指定することも忘れずに。

```Python
e.g.)

from sklearn.model_selection import train_test_split

x_train, x_test, y_train, y_test = train_test_split(x, y, test_size = 0.3, random_state= 0)

print(x_train.shape)
print(x_test.shape)
```

# `train_val, test = train_test_split(df, test_size=, random_state)`

X,yを分けずに、ただ存在するデータセットを二分する時にもつかえる

仕様としては、*arraysとして可変長引数で受け取る

```Python
e.g.)
train_val, test = train_test_split(df2, 
                                    test_size = 0.2,
                                    random_state = 0)
```