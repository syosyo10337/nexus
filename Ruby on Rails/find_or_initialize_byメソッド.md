 

# find_or_initialize_byメソッド

条件を指定して初めの1件を取得し1件もなければ作成するメソッド

### 使い方  
`モデル.find_or_initialize_by(条件, ブロック引数)`

# 失敗したら例外が発生する

```Ruby
モデル.find_or_initialize_by!(条件, ブロック引数)

e.g.)
# 存在しないので新しく作成
User.find_or_initialize_by(first_name: 'Penélope')

# 既に存在する場合は既存のレコードを取得
User.find_or_initialize_by(first_name: 'Penélope')

# ブロック指定
User.find_or_initialize_by(first_name: 'Scarlett') do |user|
user.last_name = "O'Hara"
end
```

## sourceコード

```Ruby
# File activerecord/lib/active_record/relation.rb, line 200
    def find_or_initialize_by(attributes, &block)
      find_by(attributes) || new(attributes, &block)
    end
```

cf)

[

find_or_initialize_by | Railsドキュメント

条件を指定して初めの1件を取得し1件もなければ作成 。オプションや使い方の例などを多く載せて説明しています。

![](Ruby%20on%20Rails/Attachments/apple-touch-icon.png)https://railsdoc.com/page/find_or_initialize_by

![](ogp%201.png)](https://railsdoc.com/page/find_or_initialize_by)