 

🔄

# ActiveRecord::Relation

---

## ActiveRecord::Relationとは

---

ActiveRecordのQuery Interfaceによる操作結果をオブジェクトとして表現したもの。メソッド(メソッドチェイン)呼び出しを通してActiveRecord::Relationは内部にどのようなSQLを持つかという情報をだけを保持する。実際にSQLの実行が必要になったときにデータを取得する。

- Query Interface
    
    Railsにおける仕様のひとつ。
    
    RailsアプリのModelに対して、SQLに対応するメソッド群を呼び出すことでDBへのCRUD操作を実現させる接点となる仕組みのこと。(インターフェイス)。  
    ==このインターフェイスを通して、データをオブジェクト指向プログラミング風に扱えるし、逆に==、==言い換えると、メソッドチェインによってクエリ構築ができるととも言える。==
    

> _ref) Perfect Rails p56_

### 実際にSQLが発行されるまで

---

1. ActiveRecordに対してQuery Interfaceが呼ばれると、SQL情報を保持した、ActiveRecord::Relationインスタンスが生成される。

2. これに対して、追加でQuer Interfaceを呼ぶこともでき、SQL文に関する情報が累積する。

3. データが実際に必要になったタイミングで初めて、SQLが発行され、データ取得がなされる。

4. また、ActiveRecord::Relationは配列と同様に扱うことができる

```Ruby
irb(main):024:0> 
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




#ActiveRecordに対してwhereを使用し、ActiveRecord::Relationインスタンスを作成していることの確認
irb(main):025:0> 
Book.where("price > 3000").class
=> Book::ActiveRecord_Relation


#配列と同様に扱えることを確認。
irb(main):026:0>  
Book.where("price > 3000")[1]
  Book Load (0.5ms)  SELECT "books".* FROM "books" WHERE (price > 3000)
=>                                                                              
#<Book:0x0000000110abeb70                                                       
 id: 5,                                                                         
 name: "Book 5",                                                                
 published_on: Tue, 23 Jul 2019,                                                
 price: 5000,                                                                   
 created_at: Fri, 21 Oct 2022 10:40:15.627416000 UTC +00:00,                    
 updated_at: Fri, 21 Oct 2022 10:40:15.627416000 UTC +00:00>
```

ActiveRecord::Relationに対してto_aメソッドをつけることで、明示的にSQLを発行するというテクニックもある。