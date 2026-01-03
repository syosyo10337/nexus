 

# pandas(超)入門

---

==<目次>==

[import](#56509d51-158e-4b4b-96e5-a3b3e99677dd)

[pandasのデータ構造](#7275278b-e856-4373-9dee-bc65ac0d8486)

[pandas.DataFrameの構造](#8ad7300d-8869-4e2f-ba19-979391a27a43)

[`DataFrame.shape`属性](#b382a2d3-72c3-4561-9874-886da8bbc213)

[`DataFrame.head(n=5)`](#013108b0-317d-46e5-981b-5702c3fb4baf)

[`DataFrame.tail(n=5)`](#5e373148-cdbe-4e52-926b-fbe5829a8721)

[`DataFrame.index`属性/  
`DataFrame.columns`](#19c0d08d-a9cc-42a0-bc6c-01daf58bb95b)

[CSVファイルを読み込む](#1a41b100-ae03-4a07-8c58-84168a4e8aff)

[`pandas.read_csv()`](#778a3281-f78a-4b22-92e1-c46ad8c5d421)

[特定の列/複数列を参照する](#16555360-68fd-4603-b6ea-83abc25bd56d)

[`DataFrame[’columns_name’]`](#4ef3df8b-fe10-4908-8747-978a64c5e610)

[`DataFrame[<columns_list>]`](#26b2ccf0-835a-4ee5-81f7-9c8697d0ddc0)

[実際に学習させるための特徴量と正解データの抽出](#d9d06d8e-b1a0-41ee-898c-8fa3cd952ac2)

[map処理(`pandas.Series.map()`)](#7b613270-2f87-4952-a8cf-9fb321ca54ef)

[行や列を追加する](#010723d8-c1fc-43bd-9fac-900a87055aac)

[`df[’new_col’] = <Series or list>`](#6a3a1623-46d4-414e-9a41-10612f924c78)

[`df.loc[index_num] = <Series or list>`](#02468f01-f126-4bf3-a74b-3cd97c6c7f75)

[Seriesの算術演算](#5e59d520-4402-4384-ac42-ce3291e3da67)

[カテゴリカルデータの集計](pandas\(%E8%B6%85\)%E5%85%A5%E9%96%80/%E3%82%AB%E3%83%86%E3%82%B4%E3%83%AA%E3%82%AB%E3%83%AB%E3%83%87%E3%83%BC%E3%82%BF%E3%81%AE%E9%9B%86%E8%A8%88%2009e3c4f2a1804fec9e1f58096f93334d.html)

[🏠欠損値の基本的な取り扱い](%E3%82%A2%E3%83%A4%E3%83%A1%E3%81%AE%E5%88%A4%E5%88%A5\(%E5%88%86%E9%A1%9E\)/%E6%AC%A0%E6%90%8D%E5%80%A4%E3%81%AE%E5%9F%BA%E6%9C%AC%E7%9A%84%E3%81%AA%E5%8F%96%E3%82%8A%E6%89%B1%E3%81%84%20c2449c2ffdbd4c1382d903c133208187.html)

[代表値の計算](%E3%82%A2%E3%83%A4%E3%83%A1%E3%81%AE%E5%88%A4%E5%88%A5\(%E5%88%86%E9%A1%9E\)/%E4%BB%A3%E8%A1%A8%E5%80%A4%E3%81%AE%E8%A8%88%E7%AE%97%207be9a2e6e51c4b058542678cd418ea1d.html)

[外れ値の扱い](%E6%98%A0%E7%94%BB%E3%81%AE%E8%88%88%E8%A1%8C%E5%8F%8E%E5%85%A5%E3%82%92%E4%BA%88%E6%B8%AC%E3%81%99%E3%82%8B\(%E5%9B%9E%E5%B8%B0\)/%E5%A4%96%E3%82%8C%E5%80%A4%E3%81%AE%E6%89%B1%E3%81%84%20671d050e607a4643bddaca89434038a2.html)

[データフレームの結合](%E3%82%BF%E3%82%A4%E3%82%BF%E3%83%8B%E3%83%83%E3%82%AF%E5%8F%B7%E3%81%AE%E7%94%9F%E5%AD%98%E8%80%85\(%E5%88%86%E9%A1%9E\)/%E3%83%87%E3%83%BC%E3%82%BF%E3%83%95%E3%83%AC%E3%83%BC%E3%83%A0%E3%81%AE%E7%B5%90%E5%90%88%20a5f8169c86be498ea735417e6c613677.html)

[ダミー変数化(クロス集計)](%E3%82%BF%E3%82%A4%E3%82%BF%E3%83%8B%E3%83%83%E3%82%AF%E5%8F%B7%E3%81%AE%E7%94%9F%E5%AD%98%E8%80%85\(%E5%88%86%E9%A1%9E\)/%E3%83%80%E3%83%9F%E3%83%BC%E5%A4%89%E6%95%B0%E5%8C%96\(%E3%82%AF%E3%83%AD%E3%82%B9%E9%9B%86%E8%A8%88\)%2060b30efd702548a782783edddf836941.html)

[グループ集計](%E3%82%BF%E3%82%A4%E3%82%BF%E3%83%8B%E3%83%83%E3%82%AF%E5%8F%B7%E3%81%AE%E7%94%9F%E5%AD%98%E8%80%85\(%E5%88%86%E9%A1%9E\)/%E3%82%B0%E3%83%AB%E3%83%BC%E3%83%97%E9%9B%86%E8%A8%88%20399583b289534f7c842648e40ce0e557.html)

[相関係数と特徴量](%E4%BD%8F%E5%AE%85%E5%B9%B3%E5%9D%87%E4%BE%A1%E6%A0%BC%E3%81%AE%E4%BA%88%E6%B8%AC\(%E5%9B%9E%E5%B8%B0\)/%E7%9B%B8%E9%96%A2%E4%BF%82%E6%95%B0%E3%81%A8%E7%89%B9%E5%BE%B4%E9%87%8F%208225590aac68434f93ec4d7f8b4b3c61.html)

[データの標準化](%E4%BD%8F%E5%AE%85%E5%B9%B3%E5%9D%87%E4%BE%A1%E6%A0%BC%E3%81%AE%E4%BA%88%E6%B8%AC\(%E5%9B%9E%E5%B8%B0\)/%E3%83%87%E3%83%BC%E3%82%BF%E3%81%AE%E6%A8%99%E6%BA%96%E5%8C%96%20a777a27ccbef49f69013e8342d4da68a.html)

### import

```Python
import pandas as pd
# 慣習的に　pdとエイリアスをつける。
```

# pandasのデータ構造

pandasにおいては、データ構造には、いくつかあり、

- Series

- DataFrame

中でも表形式(行と列を持った配列)データとして**Dataframe**と言います

==(python内では、Dataframe型のオブジェクト になります。)==

e.g.) keyにcolumns名、valuesにそのkeyの値を入れるdictをDataFrame()メソッドの引数として渡す。

```Python
import pandas as pd


data = {
  '松田の労働時間': [160, 160],
  'アサギの労働時間': [161, 175],
}

df = pd.DataFrame(data)
print(type(df))
#-> <class 'pandas.core.frame.DataFrame'>
```

## pandas.DataFrameの構造

`DataFrame`は`values`, `columns`, `index`の3つの要素から構成されている。

`values`は実際のデータの値、

`columns`は列名（列ラベル）、

`index`は行名（行ラベル）

```Python
# 基本書式
variable = pd.DataFrame(<二次元データ>, index(<list>), columns(<list>))

#e.g.)
d = {
    "one": pd.Series([1.0, 2.0, 3.0], index=["a", "b", "c"]),
    "two": pd.Series([1.0, 2.0, 3.0, 4.0], index=["a", "b", "c", "d"]),
}
df = pd.DataFrame(d)

df
Out[40]: 
   one  two
a  1.0  1.0
b  2.0  2.0
c  3.0  3.0
d  NaN  4.0
```

### `DataFrame.shape`属性

作成したDataFrame型の(行数, 列数)を表示する。

```Python
df.shape
#e.g.) -> (2, 2)
```

### `DataFrame.head(n=5)`

最初のn行を返す。メソッド

### `DataFrame.tail(n=5)`

最後のn行を返すメソッド

### `DataFrame.index`属性/  
`DataFrame.columns`

index/columns属性に対して、インデックスやコラム名を直接代入したり、参照することもできる。

```Python
df.index = ['4月', '5月']


print(df.index)
#-> Index(['4月', '5月'], dtype='object')

print(df.columns)
#-> Index(['松田の労働時間', 'アサギの労働時間'], dtype='object')
```

## CSVファイルを読み込む

## `pandas.read_csv()`

ファイルシステムに当該ファイルが存在する場合には、パス名を引数に取る。

> Read a comma-separated values (csv) file into **DataFrame.**

```Python
e.g.)
df = pd.read_csv('datafiles/KvsT.csv')
df
```

☝

この時のパス指定は、==docker==を使っているときには、Dockerfileで指定した　WORKDIRをカレントディレクトリとしたものを指定する。それがジュパイターサーバにとってのルートになるってことなんだろうな.  
なので、アプリルートからの絶対パスを書くこと。 file関数に関しては相対パス使えたんだけどね。)

## 特定の列/複数列を参照する

### `DataFrame[’columns_name’]`

#→ Series型のオブジェクトが返る

### `DataFrame[<columns_list>]`

#→ DataFrame型のオブジェクトが返る。

# 実際に学習させるための特徴量と正解データの抽出

```Python
e.g.)
#特徴量と、正解ラベルの取り出し
x_index = df2.columns[0:3]

x = df2[x_index]
# <class 'pandas.core.frame.DataFrame'>

y = df2['種類']
# <class 'pandas.core.series.Series'>
```

# map処理(`pandas.Series.map()`)

Python組み込みのmap処理はあれだけども、pandasのSeriesでは引数にとった、functionを処理した値もしくは、dict/Series形式で対応される値に置換したものを返すことができる`se.map()`が実装されています。

```Python
e.g)

# sandbox for se.map()
se = pd.Series([1,2,3,-4,5,6,7,-1])
print(se.map(abs))
#->
0    1
1    2
2    3
3    4
4    5
5    6
6    7
7    1
dtype: int64



print(se.map(lambda x: x // 2))
#->
0    0
1    1
2    1
3   -2
4    2
5    3
6    3
7   -1
dtype: int64


print(se.map({
  1: "one",
  -1: 'minus one',
  }
))
#->
0          one
1          NaN
2          NaN
3          NaN
4          NaN
5          NaN
6          NaN
7    minus one
dtype: object
```

# 行や列を追加する

## `df[’new_col’] = <Series or list>`

新しいカラムの値を決めて、リストもしくは、seriesを渡す

```Python
e.g.)
# 多項式特徴量を追加し、特徴量エンジニアリングを行う
df['RM2'] = df['RM'] ** 2
```

## `df.loc[index_num] = <Series or list>`

指定した番号のインデックスに対して、値を代入し、行を追加する。

# Seriesの算術演算

A + Bを足すようにして、各インデックスについての足し算をすることができる。

同様のことが四則演算についてもできる。

```Python
se1 = pd.Series([1,2,3])
se2 = pd.Series([10,100,1000])

se1 + se2
#->
0      11
1     102
2    1003
```