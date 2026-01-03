---
tags:
  - rails
  - activerecord
created: 2026-01-03
status: active
---

# destroy_allの代わりにdelete_allを使用する。

これらの違い。 端的にいうと

- delete_allは直接SQLを発行して、

- destroy_allはvalidationや関連づけされたデータも同時に削除します。

端的に削除することだけを検討するのであれば, delete_allの方が効果的

その通りです。`destroy_all`は関連付けられたモデルも含めて削除しますが、`delete_all`は関連付けを無視して直接SQL DELETE文を実行するため、関連付けられたレコードは削除されません。

もし関連付けを維持しながらパフォーマンスの改善を行いたい場合、`destroy_all`を使いつつ、関連付けのカスケード削除を効率的に実行する方法を検討する必要があります。ここではいくつかの方法を提案します。

### 方法1: バッチでの削除

大規模なデータ削除の場合、削除をバッチで行うことで、パフォーマンスの向上とシステムの安定性を図ることができます。例えば、以下のように削除をバッチ処理するコードを書きます。

```Ruby
batch_size = 1000
loop do
  batch = ser.favorite_items.reorder(created_at: :asc, id: :asc).limit(excess_count).limit(batch_size)
  break if batch.empty?
  batch.destroy_all
end
```

### 方法2: dependentオプションを利用した関連付けの設定

関連付けのモデルに`dependent: :destroy`オプションを設定している場合、`delete_all`を使用しても関連付けのカスケード削除を実現することができます。

```Ruby
class User < ApplicationRecord
  has_many :favorite_items, dependent: :destroy
end
```

ただし、これを使うと`delete_all`のメリットである高速削除は得られないので注意が必要です。

### 方法3: 直接SQLを使用したカスケード削除

RailsのORMを使わずに直接SQLを使用して関連レコードを削除する方法もあります。例えば、ActiveRecordの`connection`を使って直接SQL文を実行します。

```Ruby
ids_to_delete = ser.favorite_items.reorder(created_at: :asc, id: :asc).limit(excess_count).pluck(:id)
FavoriteItem.where(id: ids_to_delete).delete_all
```

### まとめ

- `**destroy_all**`: 関連付けされたレコードも削除するが、バリデーションやコールバックが発生するため、高コスト。

- `**delete_all**`: 高速だが、関連付けのレコードは削除されない。

- **バッチ処理**: 大規模データ削除の場合はバッチ処理でパフォーマンスと安定性を向上。

- **直接SQL**: 必要に応じて直接SQLを使い、高速かつカスケード削除を実現。

実際のユースケースやデータ量に応じて最適な方法を選択してください。