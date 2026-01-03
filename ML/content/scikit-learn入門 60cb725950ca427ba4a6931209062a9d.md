 

# scikit-learn入門

<目次>

[とりあえず入れてみる](#ec4c5569-3ef3-47cb-ade3-ce4d7d4f1811)

[とりあえず学習させてみる。](#13568764-309b-40d2-b90d-fb09e53bb071)

[モデルの学習](#cfdbc144-3a91-44c3-81cf-8f71f0dc5b33)

[モデルから予測結果を取り出す。](#d83f1988-d311-48f8-a482-7e8df713ed10)

[エラーハンドル -UserWarning: X has feature namesについて](#62d79cb7-7997-4182-9d4f-1717ab7fa171)

[モデルの正解率を計算する](#0c6862e1-0a94-4021-9901-b01f01439109)

[train_test_split()](scikit-learn%E5%85%A5%E9%96%80/train_test_split\(\)%206f444b455a114dc1b8c8d8f3abd68e9e.html)

[決定木(decision tree)の概要](%E3%82%A2%E3%83%A4%E3%83%A1%E3%81%AE%E5%88%A4%E5%88%A5\(%E5%88%86%E9%A1%9E\)/%E6%B1%BA%E5%AE%9A%E6%9C%A8\(decision%20tree\)%E3%81%AE%E6%A6%82%E8%A6%81%20dd0ce998a8234202b2882d8be53af99c.html)

[決定木の図の作成](%E3%82%A2%E3%83%A4%E3%83%A1%E3%81%AE%E5%88%A4%E5%88%A5\(%E5%88%86%E9%A1%9E\)/%E6%B1%BA%E5%AE%9A%E6%9C%A8%E3%81%AE%E5%9B%B3%E3%81%AE%E4%BD%9C%E6%88%90%202071d216a99941a9bc237a3aa7d6c560.html)

[線形回帰分析](%E6%98%A0%E7%94%BB%E3%81%AE%E8%88%88%E8%A1%8C%E5%8F%8E%E5%85%A5%E3%82%92%E4%BA%88%E6%B8%AC%E3%81%99%E3%82%8B\(%E5%9B%9E%E5%B8%B0\)/%E7%B7%9A%E5%BD%A2%E5%9B%9E%E5%B8%B0%E5%88%86%E6%9E%90%2053b5b7e2c8ad470ebb183e1066c136bf.html)

[回帰式の係数と切片を調べる](%E6%98%A0%E7%94%BB%E3%81%AE%E8%88%88%E8%A1%8C%E5%8F%8E%E5%85%A5%E3%82%92%E4%BA%88%E6%B8%AC%E3%81%99%E3%82%8B\(%E5%9B%9E%E5%B8%B0\)/%E5%9B%9E%E5%B8%B0%E5%BC%8F%E3%81%AE%E4%BF%82%E6%95%B0%E3%81%A8%E5%88%87%E7%89%87%E3%82%92%E8%AA%BF%E3%81%B9%E3%82%8B%203da6e33ebbe846c29ed3ec8f78e19ab4.html)

[特徴量重要度](%E3%82%BF%E3%82%A4%E3%82%BF%E3%83%8B%E3%83%83%E3%82%AF%E5%8F%B7%E3%81%AE%E7%94%9F%E5%AD%98%E8%80%85\(%E5%88%86%E9%A1%9E\)/%E7%89%B9%E5%BE%B4%E9%87%8F%E9%87%8D%E8%A6%81%E5%BA%A6%20e6290fcaa03b413280440cdee6492adb.html)

## とりあえず入れてみる

```Python
# 決定木モデルを提供するtreeモジュールをインポートする
from sklearn import tree
```

## とりあえず学習させてみる。

```Python
# モデルを作成する
#これはtreeモジュールの中の、
# 決定木モデルの分類(classification)のためのモデルを呼び出しています。
# random_stateはシード値のこと
model = tree.DecisionTreeClassifier(random_state = 0)


#モデルに学習を実行させる。 x,tは事前に用意した特徴量(説明変数)と正解ラベル
# この時xには、DataFrame型のオブジェクトではなく、二次元リストを渡したい。
# x.valuesとするのが適切
model.fit(x.values,t)
```

(出力)

[![](ML/content/Attachments/Screenshot_2023-02-07_at_18.16.26.png)](scikit-learn%E5%85%A5%E9%96%80/Screenshot_2023-02-07_at_18.16.26.png)

# モデルの学習

- `.fix(X,y)`メソッド

```Python
model_variable.fix(特徴量、正解データ)
```

# モデルから予測結果を取り出す。

- `.predict(X,[...)` #→ numpy.array型のオブジェクトをreturnする。

```Python
model_variable.predict()

e.g.)
taro = [
  [170, 70, 20]
]

model.predict(taro)

#->array(['きのこ'], dtype=object)
```

☝

複数の予測を一度に実行するために、predictに渡すXの値は==**２次元list**==である必要がある。

## エラーハンドル -UserWarning: X has feature namesについて

ワーニングの内容としては、predictに渡したデータがただのリストで、カラム名(特徴量の名前)がないよ！って言っています。なので、predictするデータに対して、dataframeオブジェクトを作成し、それに付随するcolumnsを足してあげる。

```Python
expdata = pd.DataFrame([[1.56, 0.23, -1.1, -2.8]], columns= df2.columns[0:4])
model.predict(expdata)
```

# モデルの正解率を計算する

- `model.score(<特徴量>, <正解ラベル>)`

このメソッドは作成したモデルに対して、(学習の際に与えた)特徴量を与えて、その答えとなっていた正解データも渡すことで、モデルの正解率を知ることができる(0-1.0)

実際には、学習させたデータとは異なる、教師データを利用します。