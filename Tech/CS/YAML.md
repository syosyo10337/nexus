---
tags:
  - cs
  - yaml
  - data-format
created: 2026-01-04
status: active
---

# YAML

## yml って何？

yml(訳読み: ヤムル/ヤメル)は、データ形式の一種。構造化データやオブジェクトを文字列にシリアライズ(直列化?)するために用いられる。(JSON/XML などの種類もあるそうです。)

- シリアライズ(シリアライゼーション)とは、
  複数の並列データを直列化して送信することである。要は、プログラムの情報とかをネットワーク(0|1)のデータで送るために変換するってことだね?

---

### 記述する上での注意点

- ==`key: value`==の形でオブジェクトが表現される

- key と value の間は、半角スペース！

- インデントさせてデータを構造化する時も, 半角スペース x2 を使うこと

- 配列を表す際には、「-」を使う。

- 字列に「`" "`（`' '`）（ダブル/シングルクオテーション）」を使わなくていい

- **==「&（アンカー）」を使うと、記号に値を代入できる（変数のような機能）==**

- **==• 変数の呼び出しは「\*（エイリアス） 」と 「<<（インジェクト）」で行う。（<<を使うと同じ次元に要素を記述できる。）==**

- コメントアウトは「#」を使う。

- null は「~」を使う。

### リスト（yaml ではシーケンスと呼ぶ）の表し方

---

```YAML
# block style
a:
	- 1
	- 2


# flow style
a: [1,2]
```

```JSON
//JSONだと
{ "a": [1, 2] ] }
```

cf. [https://qiita.com/aminosan000/items/168e735d26fffdbaef52#%E3%82%82%E3%81%86%E4%B8%80%E3%81%A4%E3%81%AE%E6%9B%B8%E3%81%8D%E6%96%B9](https://qiita.com/aminosan000/items/168e735d26fffdbaef52#%E3%82%82%E3%81%86%E4%B8%80%E3%81%A4%E3%81%AE%E6%9B%B8%E3%81%8D%E6%96%B9)

[https://www.dbc-works.org/feedback/entry/2019/5/18/#gsc.tab=0](https://www.dbc-works.org/feedback/entry/2019/5/18/#gsc.tab=0)

## & /\* の使い方

---

yaml では, &（アンパサンド）」と「\*（アスタリスク）」を使って、**変数のような機能を使うことができる。**

- アンカー

`&`  を利用して、他の場所でも参照できるようにします。

- エイリアス

`*`を利用して、アンカーで定義した内容を参照します。

```YAML
# YAML
a:
	 # 1をankorというエイリアスで参照できるようにアンカーをつけて
	- &ankor 1
	# *エイリアスで参照
	- *ankor
```

```JSON
// JSON
{ "a": [ 1, 1 ] }
```

```YAML
# YAML
# オブジェクトの中の値を代入する場合

a:
	- &x 1
	-2

b:
	- 3
	- *x
```

```JSON
// JSON
{ "a": [1, 2], "b": [3, 1] }
```

🚨

==配列やオブジェクト自体にエイリアスをつけることはできません。==

```YAML
以下はエラーとなります。

&x
- 1
- 2

&x:
  - 1
  - 2
```

🚨

==「\*」でマージすることはできない  
要素の一つとして指定したエイリアスを呼び出すことができません==

つまり、オブジェクトの要素群を、親となるオブジェクトの孫として指定できない

```YAML
e.g.) NGパターン

a: &x
	c: 1
	d: 2
b:
	*x
	e: 3

{ a: { c: 1, d: 2 } },
{ b: { { c: 1, d: 2 }, e: 3 } }とはならない。
```

## オブジェクトの値をマージさせたい時

あるオブジェクトの中に、

オブジェクト形式の複数の値が入っている場合に、その値をエイリアスとして設定する場合は「&」を使います。

```YAML
オブジェクト名: &エイリアス
	プロパティ名1: 値1
	プロパティ名2: 値2
```

これを、他のオブジェクトの中で呼び出して、他の要素とマージさせるためには、「**<<: \*エイリアス**」を記述します。

```YAML
オブジェクト名':
  <<: *エイリアス
  プロパティ名: 値
```

- database.yml での例

```YAML
default: &default
  adapter: mysql2
  encoding: utf8
  pool: <%= ENV.fetch("RAILS_MAX_THREADS") { 5 } %>
  username: root
  password:
  socket: /tmp/mysql.sock

ここで設定したエイリアスを使って、呼び出してみる　

development:
  <<: *default
  database: sample_app_development

これは以下と同義です。
development:
  adapter: mysql2
  encoding: utf8
  pool: <%= ENV.fetch("RAILS_MAX_THREADS") { 5 } %>
  username: root
  password:
  socket: /tmp/mysql.sock
  database: sample_app_development
```

### folded block scalar

YAML の folded block scalar は、改行を半角スペースに変換して 1 行に結合し、末尾の改行を削除する。

> - の意味:

- > : 改行を半角スペースに変換して 1 行に結合
- - : 末尾の改行を削除
