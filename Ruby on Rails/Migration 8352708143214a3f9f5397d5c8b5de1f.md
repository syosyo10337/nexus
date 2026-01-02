 

🎒

# Migration

---

[1. マイグレーションファイルの扱い](#94fb81e3-b827-4a90-96f8-b0ea60e72d33)

[マイグレーションファイル名の命名規則について](#a1b5ac99-e61e-49f7-a2c4-282fc1228c8a)

[tips](#3a97c551-8ae3-46d5-8855-ad14f9c26142)

[マイグレーションを作成/編集する。](#4e6ef24f-e4f2-4a66-be0e-193a7bc591d5)

[特殊なカラム型 references in migration file](#9a06a38e-cbed-42f6-a42e-7f9385319422)

[migrateにおけるup/downメソッド](#2aa8989a-b282-49f2-b686-bb93b16b271a)

[(補足)本番環境でのDBのいじり方](#58401098-a60f-4f31-a3e6-bbaacf10eb87)

[commentをオプションをつけてみんなに優しくする。](#b75d60a2-a79c-4342-a3f6-a2839b13f65e)

[例: カラムにコメントを追加する](#f97d7079-92d9-4a38-ac12-9ffbfb96c7b1)

[既存のカラムにコメントを追加する](#a167f44a-3f71-4057-8a1b-04f6914316ef)

[コメントの確認](#55778578-f629-4c63-a606-407f91e35690)

# 1. マイグレーションファイルの扱い

Modelを作成するときに、マイグレーションファイルも自動生成されるが、マイグレーションファイルを単体で作成することもできる。

## マイグレーションファイル名の命名規則について

---

基本的には==キャメルケース==で書くのがお作法らしい

```Bash
#基本書式
$ rails g migration <ファイル名> <カラム名>:<カラムの型>
```

これで作成すると、`[timestamp]ファイル名.rb`というファイルが作成される。

## tips

---

**“Add(/Remove)カラム名To/Fromテーブル名”**の書式で記述すると、マイグレーションファイル内もある程度書いてくれる。

例えば、

```Bash
#terminalにて
$ rails g migration AddPartNumberToProducts part_number:string
```

とgenerateスクリプトを実行すると

```Ruby
#[timestamps]_add_partnumber_to_products.rbが作成されて
#そのファイル内では、

class AddPartNumberToProducts < ActiveRecord::Migration[7.0]
  def change
    add_column :products, :part_number, :string
  end
end
```

ここまで自動で記述してくれる

## マイグレーションを作成/編集する。

---

マイグレーションの記法は大きく分けて二つある。

1. `create_table` /`change_table`に対してブロックでカラムについての変更情報を記述する

```Ruby
#productsテーブルに対して、以下のカラム達を更新する。マイグレーション
change_table :products do |t|
  t.remove :description, :name
  t.string :part_number
  t.index :part_number
  t.rename :upccode, :upc_code
end
```

2. `add_column`/`remove_column`に対して、引数を与える形で変更を加える。

```Ruby
#上の例との違いは、第一引数に対して、テーブル名を指定すること。

#logsテーブルから、item_numカラムをremoveする例
remove_column :logs, :item_num,
```

## 特殊なカラム型 references in migration file

---

このカラム型は、別のモデルに対する参照を意味する。

今回はマイグレーションファイルを単体で生成するケースについて

==Modelのgenerateスクリプトでも指定できるが、それはまた次回。==

例えば、

```Bash

$ rails g migration AddPublisherIdToBooks \
publisher:references
			invoke  active_record
      create    db/migrate/20221021132119_add_publisher_id_to_books.rb
```

生成されたマイグレーションファイルを見てみると、

```Ruby
class AddPublisherIdToBooks < ActiveRecord::Migration[7.0]
  def change
    add_reference :books, :publisher, null: false, foreign_key: true
  end
end

# Booksテーブルに対して、publisherという参照を追加。
#(実際に追加されるのは、publisher_idカラム)
#publisher_id, null: false, foreign_key: trueが同時に追加されている。
```

つまり、指定したテーブルに

- "参照先_id"カラムの追加、

- [外部キー制約](https://www.notion.so/acb02c877b114b12b05c5982887ffdbd?pvs=21)

- not null制約

- 追加されるカラムへのインデックスの追加(暗示的な追加)

を一度に設定するマイグレーションのDSLが記述される。

(後ろ2つについてはDB上の制約ですよ)

⚠️

この時、SQLite3では、not null制約を付与したまま、default値を指定してないと、カラム追加に対してエラーが発生する。

そのため、今回のようなケースでは、migrate前に一手間加えてあげる。

```Ruby
class AddPublisherIdToBooks < ActiveRecord::Migration[7.0]
  def change
		#カラムの追加 |
    add_reference :books, :publisher, foreign_key: true
		#not null制約を付与
		change_column :books, :publisher_id, null: false
  end
end
```

既存のデータがある場合には、外部キー制約との不整合が起きる可能性が有るので、

```Ruby
#データベースをdropして、schema.rbを元に再度構築します
$ rails db:reset
$ rails db:migrate
```

```Ruby
#schema.rbにて
ActiveRecord::Schema[7.0].define(version: 2022_10_21_132119) do
 create_table "books", force: :cascade do |t|
    t.string "name"
    t.date "published_on"
    t.integer "price"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "publisher_id", null: false
    t.index ["publisher_id"], name: "index_books_on_publisher_id"
	end
	add_foreign_key "books", "publishers" 
end

#<参照先>_idカラム,not null,外部キー、indexが追加されている。
```

**モデルレベルでの関連付けが行われてない時は、適宜has_many/belongs_toを追加しましょう。

**モデル作成時に user:referencesと型指定をすると、このbelongs_to関連付けまで自動化される。(この時、SQLiteのnot null制約によるエラーも回避できる)

[

Active Record マイグレーション - Railsガイド

マイグレーションは、 データベーススキーマの継続的な変更 （英語）を、統一的かつ簡単に行なうための便利な手法です。マイグレーションではRubyのDSLが使われているので、生のSQLを作成する必要がなく、スキーマおよびスキーマ変更がデータベースに依存しなくなります。 ...

![](favicon%209.ico)http://railsguides.jp/active_record_migrations.html

![](cover_for_facebook%201.png)](http://railsguides.jp/active_record_migrations.html)

## migrateにおけるup/downメソッド

---

本番環境にguestユーザデータを注入したい時に使った。

upメソッド内には、追加したいデータ.

downメソッド内には、削除したいデータを書き込むことで、

```Bash
#upメソッドの内容が実行
$ bin/rails db:migrate 
#downメソッドの内容が実行
$ bin/rails db:rollback 

とすることができる。
```

e.g.)ゲストユーザを注入する例

```Ruby
class UpLogs < ActiveRecord::Migration[6.1]
  LANGUAGES = %w[Java Ruby Go PHP TypeScript Perl Rust Kotlin Flutter Swift JavaScript Python]
  ACITIVE_AMOUNTS = [15, 30, 45, 60, 120,180]

  def up
    guest = User.create!(name: 'ゲストユーザ',
                        email: 'guest@hogehoge.com',
                        password: 'guestpass',
                        password_confirmation: 'guestpass',
                      )
    12.times do |i|
      guest.items.create(name: LANGUAGES[(i)])
    end
    @items = Item.where(user_id: guest.id)
    guest.items.each do |item|
      rand(10..30).times do
        item.logs.create!(amount: ACITIVE_AMOUNTS.sample, created_at:(rand(1..50)).days.ago)
      end
    end
  end

  def down
    guest = User.find_by(email: 'guest@hogehoge.com')
    guest.destroy
  end
end
```

### (補足)本番環境でのDBのいじり方

通常のdb: コマンドだと、実行環境がdevlopmentになってしまうので,

```Ruby
$ rails db:migrate RAILS_ENV=production
```

のようにすると良い。

# commentをオプションをつけてみんなに優しくする。

コメントオプションを使うことで、データベースのカラムに説明を付与することができます。これにより、データベーススキーマの理解が容易になり、将来の保守性が向上します。例えば、どのようなデータが格納されるか、特定のカラムの用途などについての情報を記述できます。

### 例: カラムにコメントを追加する

以下は、`users`テーブルに`age`カラムを追加し、そのカラムにコメントを付けるmigrationファイルの例です。

```Ruby
class AddAgeToUsers < ActiveRecord::Migration[6.1]
  def change
    add_column :users, :age, :integer, comment: "User's age in years"
  end
end
```

### 既存のカラムにコメントを追加する

既存のカラムにコメントを追加する場合は、`change_column_comment`メソッドを使用します。

```Ruby
class AddCommentToExistingColumn < ActiveRecord::Migration[6.1]
  def change
    change_column_comment :users, :email, "User's email address"
  end
end
```

### コメントの確認

データベースのコメントを確認するには、データベースクライアントやツールを使用するか、Railsコンソールで次のようなコマンドを使用します。

```Ruby
ActiveRecord::Base.connection.execute("SELECT column_name, column_comment FROM information_schema.columns WHERE table_name = 'users'")
```

コメントを追加することにより、チームメンバーや将来の開発者にとってコードベースがより理解しやすくなります。データの意味や用途が明確になることで、データベースの設計と管理が容易になります。