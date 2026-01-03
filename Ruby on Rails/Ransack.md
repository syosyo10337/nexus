---
tags:
  - rails
  - auth
created: 2026-01-03
status: active
---

# Ransack

`**ransackable_scopes**` メソッドは、Ransack（Ruby on Rails で広く使用される検索フォームの構築を支援するライブラリ）と連携する際に使用されるメソッドです。Ransack は、モデルの属性に基づく検索だけでなく、カスタムスコープを利用したより複雑な検索もサポートしています。`**ransackable_scopes**` メソッドは、どのカスタムスコープが Ransack 検索で利用できるかを定義します。

### **ransackable_scopes の説明**

- **定義**: このメソッドはモデルクラス内にクラスメソッドとして定義され、Ransack が検索に使用できるスコープのリストを返します。

- **引数**: `**_auth_object**` はオプションの引数で、現在のユーザーや他の認証オブジェクトに基づいてスコープのアクセスを制限するために使用されることがあります。ただし、多くの実装ではこれを使用しないこともあります。

- **戻り値**: このメソッドは、Ransack で使用可能なスコープの名前の配列を返します。

### **あなたのコードのコンテキスト**

```Ruby
rubyCopy code
def ransackable_scopes(_auth_object = nil)
  %i[by_honbus_member_number]
end

```

このコードは、`**by_honbus_member_number**` という名前のスコープが Ransack による検索で使用可能であることを指定しています。つまり、Ransack を使ってこのモデルに対する検索フォームを作成する際、`**by_honbus_member_number**` スコープを検索条件として利用できるようになります。

### **実用的な例**

例えば、ユーザーがウェブインターフェースを通じて `**honbus_member_number**` に基づいてレコードを検索する場合、この設定により、その検索クエリが `**by_honbus_member_number**` スコープを通じて処理されることになります。

この機能は、ActiveAdmin や他の Ransack を使用する場所で、ユーザーがより高度な検索を行えるようにするために非常に便利です。