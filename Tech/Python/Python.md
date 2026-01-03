---
tags:
  - python
  - syntax
  - data
created: 2023-01-13
status: active
---

Pythonのノート

"""
この中に書いたものがコメントになります。
"""

# 単一行のコメントはrubyと同じ


# 算術演算子について
- / と //の違い
//は割り算の商を表示する(整数部のみ表示)
e.g.)

7 / 4 #=> 1.75
7 // 4 #=> 1

- ** 累乗(べき乗)
- ^ XOR演算子らしいよ

# 文字列における演算子

- * 文字列の反復


*対話型インタプリター
$ pythonで起動する。

# 変数の宣言と代入
Rubyと同じ
variable = "";

## 慣習的に全て大文字を使って、定数のように宣言する
TAX_RATE

# Ruby同様多重代入ができる。
e.g)
a, b = 1,2 
# a -> 1
# b -> 2

>>> a,b,c = [1,2,3];
>>> a
1
>>> b
2
>>> c
3
>>> 

# input()関数を用いて、標準入力を受け入れる
e.g.)
引数には、表示させたい文字列をとる。
user_input = input('何か入力してください')

# type()関数: 型を調べる
e.g.)
x = 10;
print(type(x))

# print関数
optとしてend=の値が文字列の終わりを指定できる
- \n(改行抜きで表現する)
e.g) prin("hello", end="")

- デフォルトで、endの引数は"\n"なので、print()"\n"を出力できる。



# isinstance(object, classinfo):
第一paramsのデータの値が、第二引数のデータ型(データクラス)であれば Trueを返す。

##pythonの中での型の名称
- int
- float 
- str 
- bool

## データ型の変換(cast)
- int() //小数の入力があった場合には、切り捨て
- float()
- str()
- bool

### Pythonでは、文字列と数値間における暗黙の型変換が行われることがない。


# 文字列の中に数値を埋め込む
テンプレートリテラル的なものは、format()を使って表現する?
///この時は、文字列も暗黙的に数値に変換される。
e.g.)
name = "Masanao"
age = 23
height = 165

print('私の名前は{}で、年齢{},身長{}でござる'.format(name, age, height))

## f-stringを使ってより、簡潔に書く。
上述の内容を書き換えて、
print(f'私の名前は{name}で、年齢{age},身長{height}でござる'

## より簡素な書き方(,で区切るだけ)
暗黙の型変換が行われる。
e.g.)
height = 100
print("masnao", height, "desu")

- strip()
空白のスペースを消す。文字列の先頭と末尾から改行を削除：

# Pythonにおけるdata structure
Pythonにおいては、collection/containerなどと呼ばれる。

# list(リスト)
- 要素1のリストを作る時は[]リテラルを使う。

配列のこと。配列の要素の型は同一である必要はない。
存在しないindexの要素を参照するとエラーになる。
## 配列関連の関数
- sum(array): 数値の要素の合計を取得
- len(array): 要素の個数を取得する。
e.g.)
array = [1,2,3,4,5]
print(len(array))

- array.append(new_element):rubyでいうArray#push
- array.remove(exist_element):引数にとった値を配列から探して、取り除く。戻り値なさそう
- array[index] = arranged_element: 特定のindexの要素を変更する。

###スライスを使った範囲指定
Rubyでいう 1..3(1,2,) 1...3(1,2,3)のことですね。
- array[A:B]: A以上B未満の要素を参照するリストにたいして評価数R。
- array[A:]: A以上の全て
- array[B:]: B以上の全て

- array[-1]: リストの最後の要素を参照(rubyと同じ)



# ディクショナリ(辞書、マップ)
Rubyでいうhash/JavaScriptでいうオブジェクト
key:value型のデータストラクチャです。
## 定義(基本書式)
variable  = { "key": "value", key: "value2"}
## 要素の追加/参照
variable[key]
## 既存の要素の上書きも、新規要素の追加も参照するkeyに対して代入する形を取る
e.g.)
scores = {
  "network": 60,
  "database": 55,
  "security": 34,
}

scores['network'] = 100
scores['new_el'] = 1000

print(scores)

# 存在しないkeyへの参照はエラーになる。"KeyError"

## 要素の削除 del文を使うことで、特定のkeyを持つディクショリの要素を削除できる。 リストのインデックスを指定することもできる。

e.g.)
del scores['network']

- dictionary.values():これによって、ディクショナリのvalueの集合を取得できる。
e.g.)
dict_vaules = scores.values()
# -> dict_values([100, 55, 34, 1000])
print(type(dict_vaules))
# -> <class 'dict_values'> //dict_vaulesのクラスのオブジェクト？らしい
sum = sum(scores.values())
#合計値の取得 
print(sum)


###タプル(tuple)とセット(set)
- tuple:要素の追加、変更、削除ができないリスト#readonly
e.g.)
scores = (1,3,5)

タプルにおいては、(,)でタプルを判別している.
要素１のタプルを作成するのは
e.g.)
members = ("増田",) #カンマ必須

#### シーケンス(sequence)
リストとタプルの総称


# セット(set)
リストやタプルに類似しているが、異なる点は、
1. 重複した値を格納することができない.
2. 添字やkeyが存在せず、特定の要素を参照/代入する方法がない
3. 順列を持たない
4. append関数の代わりにadd関数を用いて、末尾の要素を追加できる。
種類を管理する際には、有用です。e.g.)信号機
e.g.)
trafic_light = {"red", "blue", "yellow"}


#コレクションの相互変換
- list()
- tuple()
- set()
##これらの関数にdictを渡すと、keyを用いたコレクションとして生成される。もし、値のみを用いたい場合には、
e.g.)
scores = {
  "network": 60,
  "database": 55,
  "security": 34,
}

set_scores = set(scores.values())

###setの集合演算(積集合を求める演算子)
e.g.)

common_hobbies = members["matz"] & members["DHH"]
print(common_hobbies) #-> {'baseball'}

e.g.)
A = {1, 2, 3, 4}
B = {2, 3, 4, 5}

print(A | B) #和集合
print(A & B)
print(A - B) #Aを記述にBの要素を除く
print(A ^ B)

# if文
##基本書式
if 条件式:
  trueの時の処理
elif 条件式2:
  falseの時の処理
else:
  条件1,2がFalseの時の処理


Ruby(if~end)やJavascript({})と異なり、インデントされている部分がブロックとして認識される

# in演算子
e.g.)
members = {
  "matz": { 'baseball', 'football', 'cycling'},
  "DHH": { 'baseball', 'comedy', 'flight'},
}

if 'baseball' in members["matz"]:
  print("matzは野球が好きなようです。")
else:
  print("matzは野球ではないようです。")

## 基本書式
if (not) "特定の要素" in collection

### dictのkeyの値が存在するかを調べる
e.g.)
if "keyの要素?" in dict

## 論理演算子とpythonの真偽値
pythonでは,True/Falseのbooleanを持つ。
falsyな値: {0, 0.0, False, None, "", '', [], {},()}


論理演算子
- and
- or
- not

&& ||などはない

#### 範囲指定の条件式
pythonでは数式のように範囲指定することができる
e.g.)
if 60 <= score <= 100

#### 空のブロックは許可されない
もし、仮に空のブロックを使用する場合には、passを挿入する
if xxx:
  処理
elif yyy:
  処理
else zzz:
  pass


# 三項演算子
trueの時の処理 if 条件式 else falseの時の処理
まるで後置if(ruby)と ? :の組み合わせみたいですね。


# while文
## 基本書式
while 条件式:
  whileブロックの処理

# counterをつかって、リスト(配列)を参照する。
e.g.)
counter = 0;
while counter < len(lists):
  #lists[counter]を使った処理
  counter += 1


# for文
##基本書式
for param in scores:
  # paramには、各配列(list)の値が入っています。
  # それらを回してくれる。
e.g.)
scores = [120,150,200,300]

for data in scores:
  if data >= 160:
    print("you are brilliant")
  else:
    print("nahh...")

## rubyでいう n.times do |n| endのpython流の書き方
e.g.)
for param in range(n):
  繰り返したい処理
  # paramを使うかは任意です。
  
- range(n):0からn未満の整数列を作る

# for/range続き
for 変数 in range(start, end, step)


## break
繰り返しの制御を抜ける。
breakをインタプリタが読み取ると、繰り返しの制御を抜ける。
## continue
現在の繰り返しの回だけをskipをし、次の繰り返し処理を実行する。



# 関数の定義
def function_name(argument):
  """処理"""
# 呼び出し
function_name()

## Pythonにおける関数名の名前衝突
Built-in-functionのoverrideであってもエラーにならないため、気を付ける必要があります。

# ローカル変数と関数スコープ
つまり、関数内外でローカル変数は独立している。

## 関数の戻り値
Rubyとは異なり、最後に評価された式が戻り値になることがないので、明示的にreturn に続けて戻り値を指定する必要がある。指定しない場合にはNoneになります。

## 関数呼び出し演算子()
つまり、呼び出し演算子をつけなければ、関数も変数に代入することができる。
e.g.)
def add(x, y):
  return x + y

plus = add
print(plus(1,4))


## 暗黙的なタプルによる、複数の戻り値
関数の戻り値は1つだが、見かけ上複数受け取ることもできる。
e.g.)
def plus_and_minus(x, y):
  return x + y, x - y

added, minussed = plus_and_minus(1009, 3)
print(added, minussed)
#複数の値を返り値として受け取っているように見えますが、実際には、タプルが戻っていて、それをunpack 代入(多重代入、分割代入)をしているんだよ。


## default引数
def func(arg = default_value, ...)
  処理
  return return_value
制約としては、デフォルト引数を持つ引数は、関数の最後の引数になる必要がある。

### キーワード引数
関数呼び出し時に 仮引数=実引数のように記述することで、代入したい引数を指定できる。

def func(arg1, arg2,...):
  処理

func(arg2="2に入れてあげたい", arg1="1を入れてあげたい")

# 可変長引数 *rubyを同じですね。
*argとして受けとった値は、関数内で"タプル"として用いられるようです。

e.g.)
def eat(breakfast, lunch, dinner="curry", *desserts):
  print(f"朝は{breakfast}を食べました")
  print(f"昼は{lunch}を食べました")
  print(f"夜は{dinner}を食べました")
  
  for dessert in desserts:
    print(f"おやつには、{dessert}を食べました")

eat("トースト","トースト","トースト","トースト","トースト","トースト",)


- 多重代入
[a,b,c] = [1,3,4]

## dictを受け取る可変長引数(**)


## global関数
関数のスコープの外で定義された変数は、グローバル関数と言われます。(関数内で参照される場合には、ローカル変数が優先されるものの参照することはできる)
明示的に、関数の中でグローバル変数に値を代入したい場合には、
global <変数>を文をつけてあげる。あくまで、文であり、

NG.e.g.)
global name = "new_name"



# リテラルを使わず、明示的にオブジェクトを生成する
rubyでいうところのArray.new()みたいなの

e.g.)
int_val = int()
list_val = list('マツダ', 'アサギ')
# より明確にはタプルを渡してlistクラスのオブジェクトを生成している。


# クラス名の定義
class Klass:

## インスタンスの生成

variable = Klass()


Pythonでは、オブジェクトを生成したさいにidなるものが付与される。

通常の(==)演算子を用いた場合には、等値判定となるので、
e.g.)
scores1 = [10, 20, 30]
scores2 = [10, 20, 30]

scores1 == scores2 # true

# id()関数を用いた際には,同一性に関する比較することになるので(JavaScriptでいう厳密等価演算子)
同一性まで比較する。

id(scores1) #->140451887246592
id(scores1) == id(scores2) # false

より具体的な話をすると、オブジェクトを格納する変数に対しては、オブジェクトの実態への参照を持つidentityが格納されている。

##破壊的変更がオブジェクトに対して起きないようにするために、 防御的コピーと呼ばれる対処をすることがある。(同一参照を持たないリストを作成する（スプレッド演算子みたいなこと）)

実際には、copy()メソッドやスライス記法を使ったコピーを作成する手法が一般的
e.g.)

obj1 = [1,2,3]
obj2 = obj1.copy()
obj3 = obj1[:]

# mutableとimmutableなオブジェクト

プリミティブなint/str/boolなど、
また、tuple型もimmutableである。

immutableなオブジェクトの場合には、変数へ代入をし直すというのは、別の値(アドレス)への参照に切り替えるということになります。



- クラス変数
class定義内でローカル変数と同様の形で宣言する
e.g.)
class Takahashi:
  name = "masanao"
# 読み出し
# (インスタンスからも参照できる)
Takahashi.name -> "masanao"
masa = Takahashi()
masa.name -> "masanao"

- インスタンス変数
def __init__(self, name)
  self.name = name
の形で初期化し、インスタンスごとに異なる属性値を保つことができる。

- インスタンスメソッド
def method1
  # 処理の内容
  # クラス内で定義する

- クラスメソッド
@staticmethod
def method2
  # 処理の内容を記述する






## Fileの扱い
e.g.)
text = input("何を記録します　か？")
# open("directory", "mode")関数を使って、ファイルオブジェクトを取得する(a は追記モード)
file = open("diary.txt", "a")
# 記述する
file.write(text + "\n")
# fileをクローズする
file.close()

より簡便にfileのアクセスを記述するには、

e.g.)
with open('log.txt', 'a') as file:
  file.write(text + "\n")
  
  


# モジュールのimport
import文の記述

e.g.)
import math <モジュール名> as <alias>#aliasをつけることも可能である。

- module内の変数/関数を参照する
e.g.)
math.ceil()

#or 
import math as m
m.floor("#")


# 特定のmethods/attributesのみを参照する

e.g.)
from math import ceil
# JSと逆になるね。

from math import ceil as <alias>

- モジュールとは、特定の目的を達成するために作られた関数/属性値の集まり。部品。実態は、1つのファイル。

- パッケージとは、モジュールの集まりで実態としては、ディレクトリ群である。
- ライブラリとは、モジュールのまとまり。役割でくくられているイメージ。

# パッケージの読み込み
- パッケージ内のモジュールの読み込み
import <パッケージ>.<モジュール>

- パッケージ内のモジュールの変数読み込み
import <パッケージ>.<モジュール>.<変数/関数>

- 特定のモジュールだけをパッケージから読み込む
from <パッケージ> import <モジュール>
# 複数読み込みたい時は
e.g.)

from math import pi, sqrt;

print(pi, sqrt(2))

- 特定のモジュールの変数だけをパッケージから読み込む
from <パッケージ>.<変数名> import <モジュール>

# 参照する時には、importの後ろに書いたものを記述する必要がある点に注意する。



# 外部ライブラリのインストール
pipを使う
$ pip install



# 外部ライブラリrequests



# 例外処理を扱う
try-expect文

e.g.)

try:
  #やりたい処理
except <キャッチするエラー名を記述(opt)>:
  #例外時にやりたい処理




# python3 のmapイテレータを返す。(つまり、マップオブジェクトであり、listを返さない。
# listの操作をするmap/filterの戻り値がlistではないので、list()でリスト化する必要がある。

#推奨される形としてはリスト内包表記らしい。



dictのkeyとvauleについてループ処理
item()関数を使う

for inをindexを用いて使う
https://uxmilk.jp/8680


# evalとexec を使って変数を動的に定義する

eval は式
exec は文

# pythonループ処理早見表
https://atmarkit.itmedia.co.jp/ait/articles/2009/18/news023.html


可変に使う.copy()
shallowコピーを作成する
つまり、オブジェクトの中身だけをコピーする等価

**dictはdeepcopy? shallowcopy?



pythonにおけるクラスメソッド、スタティックメソッド、インスタンスメソッドの違いと使い分け
https://helve-blog.com/posts/python/python-staticmethod-classmethod/


## オブジェクトが持つ、プロパティとメソッドを一覧で表示する.

dir()関数を使う
e.g.)

https://step-learn.com/article/python/141-object-attribute.html