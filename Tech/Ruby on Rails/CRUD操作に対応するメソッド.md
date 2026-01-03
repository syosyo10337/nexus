---
tags:
  - rails
  - activerecord
  - testing
created: 2026-01-03
status: active
---

🤏

# CRUD操作に対応するメソッド

---

[レコードを一件だけ検索する](#f5240e58-ba99-400c-aa61-b3625f5540db)

[Find](#eb08763c-9ccc-4a84-9a79-b67710541e5f)

[Find_by](#8d622d4a-e754-40b8-9734-f211106fc8fa)

[複数件のレコードを検索する](#b13b0396-1fbc-4dfc-9c18-632990a7b330)

[where](#c4541f82-f8d5-4d0b-9c8f-d9675bdd200b)

[その他のメソッド](#8f8cc8d7-91d2-4aa7-8ac6-8ddd0951b5f8)

[first](#93b67f4e-a7f0-4b68-ba1a-50de570c2aea)

[all](#77668eed-5316-4a88-a61b-5afa4a5a0832)

[order](#1e3adfe4-9519-4e59-b983-ecec1257f103)

[count](#45e596e0-d059-455c-b6f2-81d98ff6ca32)

[pluck](#8d58fbe9-ee85-49c7-aff0-791383d9840c)

[☆includes](#c9452610-1823-44eb-b26f-4af5d5490e4d)

[更新系メソッド](#81b5e77f-936f-4fe6-b0cd-a649dc7c560a)

[- save /save!](#d698202d-bd58-4cf1-adf0-fa28a50439aa)

[- new /new!](#8213c68f-6510-46b5-bc12-c4e9628f2fa1)

[- create /create!](#02f64b3d-f9a7-4263-90ed-5b13e6c25aef)

[cf)ActiveRecord#new_record?メソッド](#0cc41dc7-e9c1-42fe-81e3-822482a73abb)

[クエリインターフェースを踏み込んで](#950c1238-a71d-4872-a3ed-af210db22e40)

## レコードを一件だけ検索する

---

### Find

レコードのPKであるidを引数に取る。一致するidのデータを取得する。(該当する値がない時は例外が発生する)

該当する値がない時はActiveRecord::RecordNotFoundが発生する

### Find_by

引数に属性値をとって検索する。

該当する値がない時はnilを返す

```Ruby
User.find_by(id:3)
User.find_by(name: "masanao")
```

☝

==この二つのメソッドを使った時の戻り値はそのモデルクラスのインスタンス==

```Ruby
#Bookクラスのオブジェクトを返している例
irb)>Book.find(4).class
  Book Load (0.2ms)  SELECT "books".* FROM "books" WHERE "books"."id" = ? LIMIT ?  [["id", 4], ["LIMIT", 1]]                                                    
=> Book(id: integer, name: string, published_on: date, price: integer, created_at: datetime, updated_at: datetime)
```

## 複数件のレコードを検索する

---

### where

SQLのWHERE句に相当する。SQL文を直に文字列で記述することも可能

複数件該当がある時は、配列風のオブジェジェクトを返す。

該当する値がない時は空のActiveRecord::Relationインスタンスを返す。

```Ruby
ex1)
User.where(name: 'David', occupation: "Artist").order(created_at: :desc)


ex2)
Book.where("price > 3000")
  Book Load (0.3ms)  SELECT "books".* FROM "books" WHERE (price > 3000)
=> 
[#<Book:0x00000001102837a8
  id: 4,
  name: "Book 4",
  published_on: Fri, 23 Aug 2019,
  price: 4000,
  created_at: Fri, 21 Oct 2022 10:40:15.624507000 UTC +00:00,
  updated_at: Fri, 21 Oct 2022 10:40:15.624507000 UTC +00:00>,
 #<Book:0x00000001102836b8
  id: 5,
  name: "Book 5",
  published_on: Tue, 23 Jul 2019,
  price: 5000,
  created_at: Fri, 21 Oct 2022 10:40:15.627416000 UTC +00:00,
  updated_at: Fri, 21 Oct 2022 10:40:15.627416000 UTC +00:00>]
```

☝

この時の戻り値は、**Book**::**ActiveRecord_Relationのインスタンス**

[🔄ActiveRecord::Relation](ActiveRecord%20Relation%2026e23797379f40e4b4dc9f99b2bd2395.html)

## その他のメソッド

---

前述のように、Activerecord::Relationは配列同様に扱うことができるので、関連するメソッドも`Array`クラスのメソッドに対応している。

### first

id1の最初のデータを返す

### all

データベースのすべてのオブジェクト(レコード）を返す

### order

SQLでいうORDER BY句。引数に渡された':カラム名'をグループ分けする。

```Ruby

tpl)order(カラム名: :並び替えの順序）:asc/:desc
ex) User.order(created_at: :desc)
```

### count

データの件数をカウントする。

```Ruby
#likesテーブルのpost_id
ex)Like.where(post_id: 1).count 
```

### pluck

引数に指定したカラムの値を配列で返してくれるメソッド（花びらをつまむ(pluck)感じ）

```Ruby
#nameカラムの値を配列として取得
authors.pluck(:name)
```

### ☆includes

関連づいたテーブルに関する情報も、まとめて取得する. [N + 1問題](../N%20+%201%20%E5%95%8F%E9%A1%8C%208c0e50a5b4064639a546c6e481090cbd.html)の対処として用いれることもある。

```Ruby
Parent/Child/G_CHildの3つのモデルが存在すると仮定する時

#孫モデルまでまとめて取得(親、子、孫まとめて)
Parent.includes(children: :g_children)
```

[

includes | Railsドキュメント

関連するテーブルをまとめて取得 。オプションや使い方の例などを多く載せて説明しています。

![](Ruby%20on%20Rails/Attachments/favicon%201.ico)https://railsdoc.com/page/includes

![](ogp.png)](https://railsdoc.com/page/includes)

応用として、親テーブルから、孫テーブルについての情報も一括で取得することもできる。

## 更新系メソッド

---

### - save /save!

ActiveRecordのオブジェクトをデータベースに保存するメソッド。バリデーションに失敗すると→ `False` を返す。

### - new /new!

インスタンスを作成.引数にとった値で属性を指定できる。

### - create /create!

newでのインスタンス生成とsaveを同時に行う。

### cf)ActiveRecord#new_record?メソッド

ActiveRecordはデータベースのレコードに対応するオブジェクトとそうでないものの２種類存在するが、あるオブジェクトに対して、このメソッドを使うと、データベース上に存在しないときtrueを返す。

# クエリインターフェースを踏み込んで

---

[https://railsguides.jp/active_record_querying.html#条件を文字列だけで表す](https://railsguides.jp/active_record_querying.html#条件を文字列だけで表す)

- JSON文字列を mysql5.7で扱おうとした際にjson型を指定することはできたが、

DBでは以下のようになり

```Bash
mysql> select * from item_search_terms;
+----+-------------+---------+-------------+----------------------------+----------------------------+--------------+----------------------------------------------------------------------------+
| id | zas_user_id | keyword | category_id | created_at                 | updated_at                 | title        | query_param                                                                |
+----+-------------+---------+-------------+----------------------------+----------------------------+--------------+----------------------------------------------------------------------------+
|  1 |           1 | NULL    |           2 | 2024-06-04 06:15:36.577976 | 2024-06-04 06:15:36.577976 | test         | "{\"category_code\": \"01\", \"is_new\": true}"                            |
|  2 |           1 | NULL    |           7 | 2024-06-06 10:12:36.163728 | 2024-06-06 10:12:36.163728 | ??????? ???? | "{\"category_code\":\"90\",\"d_bunrui_cd\":\"24\",\"c_bunrui_cd\":\"01\"}" |
+----+-------------+---------+-------------+----------------------------+----------------------------+--------------+----------------------------------------------------------------------------+
2 rows in set (0.02 sec)
```

アプリで取得した際にも　class → Stringになってしまう。

```Bash
[43] pry(main)> a= ItemSearchTerm.first
  ItemSearchTerm Load [writing] (16.1ms)  SELECT `item_search_terms`.* FROM `item_search_terms` ORDER BY `item_search_terms`.`id` ASC LIMIT 1
=> #<ItemSearchTerm:0x0000ffff83acf778
 id: 1,
 zas_user_id: 1,
 keyword: nil,
 category_id: "bike",
 created_at: Tue, 04 Jun 2024 15:15:36.577976000 JST +09:00,
 updated_at: Tue, 04 Jun 2024 15:15:36.577976000 JST +09:00,
 title: "test",
 query_param: "{\"category_code\": \"01\", \"is_new\": true}">
[44] pry(main)> a
=> #<ItemSearchTerm:0x0000ffff83acf778
 id: 1,
 zas_user_id: 1,
 keyword: nil,
 category_id: "bike",
 created_at: Tue, 04 Jun 2024 15:15:36.577976000 JST +09:00,
 updated_at: Tue, 04 Jun 2024 15:15:36.577976000 JST +09:00,
 title: "test",
 query_param: "{\"category_code\": \"01\", \"is_new\": true}">
[45] pry(main)> a.query_param
=> "{\"category_code\": \"01\", \"is_new\": true}"
[46] pry(main)> a.query_param.class
=> String
[47] pry(main)> a.query_param.is_a?(String)
=> true
[48] pry(main)> ItemSearhTerm.where(query_param: a.query_param)
NameError: uninitialized constant ItemSearhTerm
Did you mean?  ItemSearchTerm
from (pry):52:in `__pry__'
[49] pry(main)> ItemSearchTerm.where(query_param: a.query_param)
^[[A  ItemSearchTerm Load [writing] (12.0ms)  SELECT `item_search_terms`.* FROM `item_search_terms` WHERE `item_search_terms`.`query_param` = '\"{\\\"category_code\\\": \\\"01\\\", \\\"is_new\\\": true}\"'
=> []
```

そのため、where()で検索しようとすると、エスケープが余分されてしまい、ヒットしない。

whereの条件を文字列で表現することで回避する。