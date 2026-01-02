 

# Unionとinterfaces

ユニオンとインターフェースは、抽象GQLタイプで、1つもしくはそれ以上のobject型を返すフィールドを有効にする。

# Union

```GraphQL
type Query {
  allMedia: [Media] # This list can include both Book and Movie objects
}
```

ユニオンに含まれるのは、オブジェクト型であることが必須です。(scalerやinputではいけません。)

ただ、ユニオンの構成要素の型同士がfieldを共有している**必要はありません。**

## 型定義例

```GraphQL
union SearchResult = Book | Author

type Book {
  title: String!
}

type Author {
  name: String!
}

type Query {
  search(contains: String): [SearchResult!]
}
```

この時 `Query.search`はBooksとAutherを含んだリストを返しますね。

## Querying a union

GQLクライアントは、もし、ユニオン型の戻り値を返すフィールドの場合に、実際のどのオブジェクト型なのか知ることはできません。

こちらを考慮するために、クエリを記述する際には、複数のありえるタイプのサブフィールドを含めることができます。

例

```GraphQL
query GetSearchResults {
  search(contains: "Shakespeare") {
    # Querying for __typename is almost always recommended,
    # but it's even more important when querying a field that
    # might return one of multiple types.
    __typename
    ... on Book {
      title
    }
    ... on Author {
      name
    }
  }
}
```

# Unionを使う(graphql-ruby)

該当の型ファイルにて

self.resolve_typeメソッドを定義する。

e.g.

```Ruby
module Types
  class OrderSlipType < Commons::Types::BaseUnion
    description '購入履歴・注文情報の伝票'
    possible_types ShopSlipType, CustomerOrderHistoryType, CrooooberOrderSlipType

    def self.resolve_type(object, _context)
      case object.__typename
      when 'CustomerOrderHistory' then CustomerOrderHistoryType
      when 'ShopSlip' then ShopSlipType
      when 'CrooooberOrderSlip' then CrooooberOrderSlipType
      end
    end
  end
end
```