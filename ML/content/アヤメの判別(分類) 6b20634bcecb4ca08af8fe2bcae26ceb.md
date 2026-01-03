 

🚐

# アヤメの判別(分類)

### 前処理

[カテゴリカルデータの集計](%E3%82%A2%E3%83%A4%E3%83%A1%E3%81%AE%E5%88%A4%E5%88%A5\(%E5%88%86%E9%A1%9E\)/%E3%82%AB%E3%83%86%E3%82%B4%E3%83%AA%E3%82%AB%E3%83%AB%E3%83%87%E3%83%BC%E3%82%BF%E3%81%AE%E9%9B%86%E8%A8%88%20db62ee7846b34df1863758173be2b277.html)

[🏠欠損値の基本的な取り扱い](%E3%82%A2%E3%83%A4%E3%83%A1%E3%81%AE%E5%88%A4%E5%88%A5\(%E5%88%86%E9%A1%9E\)/%E6%AC%A0%E6%90%8D%E5%80%A4%E3%81%AE%E5%9F%BA%E6%9C%AC%E7%9A%84%E3%81%AA%E5%8F%96%E3%82%8A%E6%89%B1%E3%81%84%20c2449c2ffdbd4c1382d903c133208187.html)

[代表値の計算](%E3%82%A2%E3%83%A4%E3%83%A1%E3%81%AE%E5%88%A4%E5%88%A5\(%E5%88%86%E9%A1%9E\)/%E4%BB%A3%E8%A1%A8%E5%80%A4%E3%81%AE%E8%A8%88%E7%AE%97%207be9a2e6e51c4b058542678cd418ea1d.html)

### モデルの理解

[決定木(decision tree)の概要](%E3%82%A2%E3%83%A4%E3%83%A1%E3%81%AE%E5%88%A4%E5%88%A5\(%E5%88%86%E9%A1%9E\)/%E6%B1%BA%E5%AE%9A%E6%9C%A8\(decision%20tree\)%E3%81%AE%E6%A6%82%E8%A6%81%20dd0ce998a8234202b2882d8be53af99c.html)

### 評価

[ホールドアウト法(hold-out)](%E3%82%A2%E3%83%A4%E3%83%A1%E3%81%AE%E5%88%A4%E5%88%A5\(%E5%88%86%E9%A1%9E\)/%E3%83%9B%E3%83%BC%E3%83%AB%E3%83%89%E3%82%A2%E3%82%A6%E3%83%88%E6%B3%95\(hold-out\)%20b39a58e66d6b4509ab16f907ed90c009.html)

[決定木の図の作成](%E3%82%A2%E3%83%A4%E3%83%A1%E3%81%AE%E5%88%A4%E5%88%A5\(%E5%88%86%E9%A1%9E\)/%E6%B1%BA%E5%AE%9A%E6%9C%A8%E3%81%AE%E5%9B%B3%E3%81%AE%E4%BD%9C%E6%88%90%202071d216a99941a9bc237a3aa7d6c560.html)

### 一連の流れ

```Python
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn import tree


# DataFrameを作成
df = pd.read_csv('./datafiles/iris.csv')

#　欠損値の確認
df.isnull().any(axis = 0)
df.isnull().sum()


# 欠損値の処理
## 欠損値うめるための平均値を列ごとに算出(series)
col_mean = df.mean()

## 欠損値を平均値によって穴埋め
df2 = df.fillna(col_mean)

## 欠損値がないことを確認
df2.isnull().any(axis = 0)


#特徴量と、正解ラベルの取り出し
x_index = df2.columns[0:4]
x = df2[x_index]

y = df2['種類']



# hold-out method
x_train, x_test, y_train, y_test = train_test_split(x, y, test_size = 0.3, random_state= 42)


# モデルの作成学習
model = tree.DecisionTreeClassifier(random_state=42, max_depth=2)
model.fit(x_train, y_train)


model.score(x_test, y_test)


# modelの保存[
import pickle

with open('./machine_learning/ch5/irismodel.pkl', 'wb') as f:
  pickle.dump(model, f)
```