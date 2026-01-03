 

🛃

# Validation

---

[Validationとは？](#5ce1dba1-48ed-4389-be35-67685ba9fae0)

[Validationのトリガー](#987eb7f5-2179-4837-867c-4b8c1a0006d0)

[手動でvalidationをトリガーさせる。](#ee27a773-05c0-4901-aae2-17ccb71a6fa0)

[valid?(/ invalid?)](#57dbc237-a96e-45c3-8a96-1056f2b6c286)

[validationがスキップされるメソッド](#16007f4b-0afc-4183-8ec7-91deda90cc0e)

[update_attribute](#326c52be-f7ee-43be-ba3c-3aca70250621)

[update_columns(属性: 値, 属性: 値)](#8bdf6119-72a9-4aa2-988e-96da75759d61)

[Error Messages](#66a85368-bc25-41f2-8227-2e6050b575b6)

[メソッド ActiveRecord#errors](#272c4af4-b607-4fd7-96e9-57f165266f13)

[人間が見やすい形でのエラー出力](#9b1addc7-4195-49ff-bc46-53cdd7bb7c2f)

[errors.messages](#4d82ea22-5457-492b-aa9d-0d58d28ffac2)

[errors.full_messages](#f90e5816-86ad-4c12-af83-90d8ffe6ecb5)

[Validationヘルパー](#c952b9b4-2134-4b17-9d56-b101cf6dc6a7)

[よく使われるvalidationヘルパー例](#39caf403-2baf-4505-a619-cfc753131c1a)

[presence](#babb6547-6b16-487a-9a3f-cab900845825)

[length](#30585248-b4c2-44ec-b545-9255742dcf2e)

[format](#a38d13ec-d0a2-4b5a-9459-69c77bded8fa)

[uniqueness](#e007c9b1-b056-4994-9f31-9745e3f43aa9)

[Validationのカスタム](#1a722700-608e-4c2a-99d1-8e867d5a3d6c)

# Validationとは？

Modelファイルにて、アプリ要件/ビジネスロジックに応じたデータの値の有効値検証を行うこと。また、有効値を定義すること。

Railsアプリでは、

バリデーションヘルパーの`validates`メソッドを使って設定し,オブジェクトがデータベース(テーブル)に保存される前に検証を行う。

いずれかのvalidationに失敗すると、オブジェクトはinvalid(無効)マークされ、実際のデータベースに保存されない。

```Ruby
#app/models/xxx.rbにて
tpl)
validates :<属性(カラム名)>, {検証の条件(ハッシュ)}
	#{}はRubyの慣習的に省略されがち
```

```Ruby

ex)#このページで使うモデルの情報
class Book < ApplicationRecord

	belongs_to :publisher

	validates :name, presence: true
  validates :name, length: { maximum: 25 }
  validates :price, numericality: { greater_than_or_equal_to: 0 }
end
```

# Validationのトリガー

---

主にvalidationがトリガされるのは、データベースに変更を加える時(SQLで言う、INSERT/UPADATEが起きるとき)

具体的には以下のメソッドを使ったとき。

- create /create!

- update /update!

- save /save!

ref)

💡

**.createと.new**  
newはオブジェクトを生成するだけ、saveする時になってvalidationがトリガされる。createはオブジェクトの作成とデータベースへの反映も試みる

💡

**createとcreate!の違い  
**”!”が語尾につくメソッドは、バリデーション失敗時に例外クラス(ActiveRecord::RecordInvalid)が発生する。  
”!”がないメソッドは,バリデーション失敗してもエラーは発生しない。⇒falseを返す

## 手動でvalidationをトリガーさせる。

---

### valid?(/ invalid?)

オブジェクトに対して、バリデーションを手動でトリガさせるメソッド。エラーがない場合のみtrueを返し、エラーがある場合はfalseを返す。(invalid?は逆、エラーありでtrueを返す)

## validationがスキップされるメソッド

---

### update_attribute

検証をスキップし、 オブジェクトの特定の属性を更新する。第一引数に属性をシンボルでとり、第二引数に反映させたい値を入れる

⚠️

update_attribute”s”を使った複数項目更新にはvalidationがトリガーされる。

### update_columns(属性: 値, 属性: 値)

複数の属性を一度にvalidationをスキップして更新する。modelのコールバックやバリデーションが実行されない

# Error Messages

---

ActiveRecordオブジェクトをデータベースに保存するときに、validationによって失敗する(つまりinvalid)と、==どんなエラーが発生したのか？どの属性についてか？==という情報をインスタンスに記録される。

## メソッド ActiveRecord#errors

---

validation(検証)が失敗した時、そのエラーに関する情報を取得するためのメソッド。

```Ruby
ex)
> book.errors
=> #<ActiveModel::Errors [
#<ActiveModel::Error attribute=publisher, type=blank, options={:message=>:required}>, 
#<ActiveModel::Error attribute=name, type=blank, options={}>, 
#<ActiveModel::Error attribute=price, type=not_a_number, options={:value=>nil}>]>



#ちなみに
> book.errors.class
=> ActiveModel::Errors
```

## 人間が見やすい形でのエラー出力

---

errorsメソッドを使うと、ActiveRecordオブジェクトに記録されたエラー情報を取得できるが、それを人間からわかりやすいような形で出力することも可能です。

### errors.messages

オブジェクトの属性値をkey、エラーメッセージを値にとる==ハッシュ==を返す。ハッシュの値となるエラーメッセージ自体は配列で格納される。そのため単に xxx.errors[:<属性>]とハッシュのキーを指定すると、メッセージの配列を取得できる。

```Ruby
ex)
> book.errors.messages
=> 
{:publisher=>["must exist"],                                                    
 :name=>["can't be blank"],                                                     
 :price=>["is not a number"]}
#ちなみに
> book.errors.messages.class
=> Hash


> book.errors[:publisher]
=> ["must exist"]

#ちなみに
book.errors[:publisher].class
=> Array
```

### errors.full_messages

オブジェクトが持つエラー情報のメッセージ全てを配列で返す。

```Ruby
ex)
> book.errors.full_messages
=> ["Publisher must exist", 
		"Name can't be blank", 
		"Price is not a number"]
> book.errors.full_messages.class
=> Array
```

💡

オブジェクトの”属性”と”カラム名”はほぼ同義だが、例のpublisherで見るように、あくまでActiveRecordオブジェクトに定義したバリデーションエラーなので、ActiveRecord流の扱いをする。  
つまり、publisher_idでキー指定してもエラーは出力されない。

# Validationヘルパー

---

Active Recordには、組み込みバリデーションヘルパーが多数用意されている

## よく使われるvalidationヘルパー例

---

### presence

指定された属性が空（empty）でないことを確認する。内部でblank?メソッドが使われる。

### length

属性値の長さ制限を指定できる optハッシュのmaximum/minimumで値指定

```Ruby
validates :content, {presence: true, length: { maximum: 140} }
```

### format

正規表現(Regular Expression)と属性の値がマッチするかを検証する

(メールアドレスの形式等)

```Ruby

tpl)
format: { with: <Regex> }

ex)
#任意の正規表現を定数で宣言して
#iはIgnoreCase
VALID_EMAIL_REGEX = /\A[\w+\-.]+@[a-z\d\-.]+\.[a-z]+\z/i  

#withオプションで与えられた定数と属性を検証。
validates :email, format: { with: VALID_EMAIL_REGEX } 
```

### uniqueness

オブジェクトが保存される直前に、属性の値の一意性を検証する。

⚠️

このヘルパーは一意性の制約をデータベース自体には作成しないので、本来一意にすべきカラムに、たまたま2つのデータベース接続によって同じ値を持つレコードが2つ作成される可能性が残ります。  
これを避けるには、データベースのそのカラムに一意インデックスを作成する必要があります

```Ruby
ex1)
#デフォルトだと、case_sensitive:true
uniqueness: true 
ex2)
#大文字小文字の区別をせず一意性を検証する(メールアドレスの形式とか)
uniqueness: { case_sensitive: false } 

ex3)
#:scopeオプションを使った例
#ある属性の一意性チェックを、別の属性だけに範囲限定を指定する
validates :project_name, uniqueness: { scope: :user_id }
#つまりこの例だと、当該モデルの属性は、user_id属性の範囲において一意でなければならない。
#(投稿の名前はあるユーザにおいて重複してはいけない。別のユーザがたまたま重複した名前を持つことは許容する。といった意味)
```

より詳しい情報はRails guideを参照してください。

[

Active Record バリデーション - Railsガイド

きわめてシンプルなバリデーションの例を以下に紹介します。 irb> Person.create(name: "John Doe").valid? => true irb> Person.create(name: nil).valid? => false バリデーションの詳細を説明する前に、アプリケーション全体においてバリデーションがいかに重要であるかについて説明します。 ...

![](favicon%2018.ico)https://railsguides.jp/active_record_validations.html#%E3%83%90%E3%83%AA%E3%83%87%E3%83%BC%E3%82%B7%E3%83%A7%E3%83%B3%E3%83%98%E3%83%AB%E3%83%91%E3%83%BC

![](cover_for_facebook%203.png)](https://railsguides.jp/active_record_validations.html#%E3%83%90%E3%83%AA%E3%83%87%E3%83%BC%E3%82%B7%E3%83%A7%E3%83%B3%E3%83%98%E3%83%AB%E3%83%91%E3%83%BC)

# Validationのカスタム

---

複雑なカスタムvalidationをつけたり、エラーメッセージを変える最も手軽な方法は、validatesメソッドにブロックを渡すことです。(エラーメッセージはlocaleファイルで一括管理したい気持ちもあるので、どうなんでしょう)

```Ruby
class Book < ApplicationRecord
	validate do |book|
	    if book.name.include?("exercise")
	      book.errors[:name] << "I don't like exercise"
	    end
	end
end
```

もちろん、メソッド化して、メソッドを渡すことも可

```Ruby
# 商品閲覧履歴において、外部サービスに対して外部key制約を持たせる。

validate :stock_item_id_contained_in_depot


def stock_item_id_contained_in_depot
    unless KikanClient::Models::Depot::V1::StockItem.find_by(id: self.stock_item_id)
      errors.add(:stock_item_id, "received ID don't exists in Depot")
    end
end
```

[https://railsguides.jp/active_record_validations.html#カスタムバリデーションを実行する](https://railsguides.jp/active_record_validations.html#%E3%82%AB%E3%82%B9%E3%82%BF%E3%83%A0%E3%83%90%E3%83%AA%E3%83%87%E3%83%BC%E3%82%B7%E3%83%A7%E3%83%B3%E3%82%92%E5%AE%9F%E8%A1%8C%E3%81%99%E3%82%8B)