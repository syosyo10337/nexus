 

# associations

---

[

Ruby on Railsのbelongs_toのバリデーションを外部キーで行うか、アソシエーション名で行うか？ - Qiita

議論の提示です。１つの結論はありません。 Rule #1 to use belongs_to with presence validator - Rails Guides の内容です。 外部キーによるバリデーションとは このように、validatesメソッドの第一引数に、外部キーカラム名を指定することです。 この場合、 ActiveRecordモデルにおけるAssociationのバリデーション戦略 にも foo_idのpresenceでは、存在しないIDでも保存できてしまう と、あるように、存在しない外部キーで保存できます。 例えば、 とした時に 999999 がDB上に存在してもしなくても、保存できます。 アソシエーション名のバリデーションとは、validatesメソッドの第一引数を参照モデル名で指定することです。例えば です。この時、AcitveRecordは自動的に、DBを検索してレコードの有無を確認します。 Rails tip: display association validation errors on fields | IADA webdevelopment の話です。 上記のようにアソシエーション名でのバリデーションは一見良さそうですが、FormBuilderを使ったバリデーションエラーの表示が上手く動きません。 上記の例のモデル に対して、次のフォームを作ると アカウントを選択しなかった場合に、バリデーションが上手く表示されません。 バリデーションエラーが accountに対するもので、フォームの要素が account_id に対するもので、一致しないからです。 該当ブログで上げらている対応策です。動作検証はしていません。 ActionModelまたはActionViewにモンキーパッチを当てる方法が紹介されています。 長いので、 元の記事

![](Ruby%20on%20Rails/Attachments/production-c620d3e403342b1022967ba5e3db1aaa%203.ico)https://qiita.com/ledsun/items/25823f5addc41459b6b8

![](article-ogp-background-9f5428127621718a910c8b63951390ad%207.png)](https://qiita.com/ledsun/items/25823f5addc41459b6b8)

# 親＞子＞孫のassociations

---

親　⇒ user

子　⇒ item

孫　⇒ log

とあるとき、それぞれの関係は

```Ruby
User
	has_many :items
	has_many :logs, through: items


Item
	belongs_to :user
	has_many :logs

Log
	belongs_to :item
	has_one :user, through: item
```

[![](Screen_Shot_2022-10-31_at_22.53.56.png)](associations/Screen_Shot_2022-10-31_at_22.53.56.png)

このとき

user.logs

log.user

user.items

item.user

item.logs

log.item

全ての関連付けがされているので、参照はできる。

更新に関してはどうしようね。。。。