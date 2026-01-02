 

🌒

# gemでGraphQLを実装する

[導入](#db49a16c-2c68-4d57-994c-f645fdc75ae4)

[設定(tutorial)](#a70f8060-52ab-45dc-b4ad-cf113cbbfa93)

[テストする](#30e88ed6-8408-4238-95bd-7fe12885a54b)

[resolver?](#e08b938a-411f-4ec7-922c-ce0743318542)

[暗黙的には,　field名のメソッドでも、resolveしてもらえるらしいけど](#c6d7657d-6c26-422a-ad59-31ba0d96cc44)

[具体的な記述](#5f6ed3d8-0242-4daa-8a90-5a4e81bf85a3)

[1. 型を宣言する(Declare Type)](#3a3db099-5fc8-403a-9dd7-ff25064ba90b)

[in GQL](#c4a14e18-8dfb-4434-8ab0-3847eb2ed299)

[in Ruby](#4d6bc50f-5bf3-47e9-91a9-fa64d8ced48c)

[2-0. エントリーポイントを設定する](#4ca3adee-d986-43c7-a8cb-ca30a67f4247)

[in GQL](#a736d27e-4dd1-45f1-97d9-72af08440aef)

[in Ruby](#5251401b-fb71-44be-a2c8-d527b7589dbb)

[2-1.](#760cc67c-a6e3-45cb-9656-f6d00f20886e)

[Connection(pagination)](#fa665b04-e190-4a3a-affd-1b5822500261)

[cursorについて](#a291fe20-fece-4cea-b013-346d1e64d19b)

[mutation](#333d72d6-c187-4cf0-a6b1-0e1b4bc60f0a)

[用語](#845792e0-c237-40b0-8aff-f07735187fd5)

[GraphiQLの導入](#2364257b-cc26-4662-82b7-605e149ae2ad)

[Typeの定義について](#4feb2daa-ff72-4f4a-a883-2ba0376c5ae6)

[null: false](#ef7686ec-4356-48ad-b619-eecd59af48da)

[preprocessing](#967e9317-6b92-4b2c-8ff5-b163b1b9c13b)

[ライフサイクルというか、リクエストされたときの挙動について](#23e3936b-5bc8-4b5d-9768-b877a9395145)

[**1. Query Parsing and Validation**](#efca442e-46ff-4790-ac73-9c4aa6e6c875)

[**2. Executing the Query - Resolver Functions**](#723cf7b4-8db5-411b-a35d-2c2bf762e951)

[**3. Type Resolution in Unions and Interfaces**](#6b9e5995-9621-445d-aca3-12ff3f2dab87)

[**4. Response Construction**](#963a3ad7-99e4-4899-bcea-b4fca9772ca9)

[**Summary**](#e5806b2c-1977-46b4-8b54-f7a25b89ee9d)

[argについて](#bab540d6-7f22-44eb-9f4f-2c679dda1f9c)

[resolverに書くか、モデルに書くか？](#91306527-0696-48cf-8def-5cce3c1c4646)

[GraphqL Loader](#39fbcf1a-f850-4645-ae6d-1f642d7bf406)

cf. )

[

GraphQL - Getting Started

![](GraphQL/Attachments/graphql-ruby-icon.png)https://graphql-ruby.org/getting_started



](https://graphql-ruby.org/getting_started)

[

[Rails基礎] GraphQL基礎講座｜Railsの練習帳

![](GraphQL/Attachments/icon.png)https://zenn.dev/igaiga/books/rails-practice-note/viewer/rails_graphql_workshop

![](GraphQL/Attachments/og-base-book_yz4z02.jpeg)](https://zenn.dev/igaiga/books/rails-practice-note/viewer/rails_graphql_workshop)

# 導入

1. **Add the necessary gems**: The `**graphql**` gem is the primary tool you'll need for adding GraphQL functionality to your Rails app. You can add it to your Gemfile and then run `**bundle install**` to install it.
    
    ```Bash
    $ gem 'graphql'
    ```
    

2. **Generate the GraphQL setup**: Once the gem is installed, you can generate the necessary setup files by running the following command:
    
    ```Bash
    $ rails generate graphql:install
    ```
    
    ライブラリを実行すると、graphql/ディレクトリが作成され、graphiql-rails用のルートも作成される。
    
    > This will create several files and directories in your application, including a `**graphql**` directory under `**app**` which will hold your types and mutations, and a `**graphiql-rails**` route in your routes file for testing queries and mutations.
    

# 設定(tutorial)

1. (**Define your types**: In the generated `**graphql**` directory, you will see a `**types**` directory. This is where you define the types that match your ActiveRecord models. Here's a basic example for a `**User**` model:
    
    ```Ruby
    module Types
      class UserType < Types::BaseObject
        field :id, ID, null: false
        field :name, String, null: false
        field :email, String, null: true
      end
    end
    
    # idというフィールドを持ち、その型はIDでnot nullable
    ```
    

2. **Define your queries and mutations**: In the `**graphql**` directory, you'll also see a `**mutations**` directory and a `**query_type.rb**` file. Mutations define what sort of create, update, or delete operations you can perform, while queries define what data you can fetch. Here's a basic example of each:
    
    ```Ruby
    # app/graphql/types/query_type.rb
    module Types
      class QueryType < Types::BaseObject
        field :user, Types::UserType, null: false do
          argument :id, ID, required: true
        end
    
        def user(id:)
          User.find(id)
        end
      end
    end
    
    # app/graphql/mutations/create_user.rb
    module Mutations
      class CreateUser < Mutations::BaseMutation
        argument :name, String, required: true
        argument :email, String, required: true
    
        type Types::UserType
    
        def resolve(name:, email:)
          User.create!(name: name, email: email)
        end
      end
    end
    ```
    

# テストする

1. **Test your queries and mutations**: Once you've set up your types, queries, and mutations, you can test them using the GraphiQL IDE. You can access this by starting your server and navigating to `**localhost:3000/graphiql**`.

# resolver?

**Resolvers**: GraphQLの文脈では、resolverは特定のフィールドのデータを「解決」する方法を定義する関数です。つまり、どのようにしてそのフィールドのデータを取得または計算するかを指定します。例えば、特定のユーザーを取得するクエリフィールドのresolverは、そのユーザーのIDを引数として受け取り、そのIDに一致するユーザーをデータベースから取得するでしょう。また、ユーザーが持つ投稿のリストを返すフィールドのresolverは、そのユーザーが所有する投稿をデータベースから取得するでしょう。

### 暗黙的には,　field名のメソッドでも、resolveしてもらえるらしいけど

リゾルバーを本当に作成するのであれば、`resolve`メソッド定義してその中に実際のデータ取得ロジックをかくらしい。

```Ruby
module Resolvers
  class RecommendedItems < Resolvers::Base
    type [Types::Item], null: false

    argument :order_by, Types::ItemOrder, required: false
    argument :category, Types::ItemCategory, required: false

    def resolve(order_by: nil, category: nil)
      # call your application logic here:
      recommendations = ItemRecommendation.new(
        viewer: context[:viewer],
        recommended_for: object,
        order_by: order_by,
        category: category,
      )
      # return the list of items
      recommendations.items
    end
  end
end
```

Loader

1. **Loaders (or Data Loaders)**: DataLoaderは、データベースへのリクエストを効率的にバッチ処理するためのユーティリティで、N+1問題を防ぐために一般的に使用されます。GraphQLのリクエストはしばしば多数の関連するデータを要求するため、それぞれのデータ項目に対して個別にクエリを発行するとパフォーマンスが低下する可能性があります。DataLoaderはこれらのクエリをまとめてバッチ処理し、効率的にデータを取得します。たとえば、特定のユーザーが所有するすべての投稿を取得する代わりに、一度に多数のユーザーのすべての投稿を取得します。

# 具体的な記述

## 1. 型を宣言する(Declare Type)

### in GQL

```GraphQL
type Character {
  name: String!
  appearsIn: [Episode!]!
}
```

### in Ruby

```Ruby
module Types
  class CharacterType < Commons::Types::BaseObject
		field :name, String, null :false
		field :appearsIn, [Types::EpisodeType], null :false,   description: "The name of this thing"

  end
end
```

cf. )

[

Schemas and Types | GraphQL

A query language for your API — GraphQL provides a complete description of the data in your API, gives clients the power to ask for exactly what they need and nothing more, makes it easier to evolve APIs over time, and enables powerful developer tools.

![](GraphQL/Attachments/favicon%201.ico)https://graphql.org/learn/schema/#the-query-and-mutation-types

![](GraphQL/Attachments/og-image%201.png)](https://graphql.org/learn/schema/#the-query-and-mutation-types)

[

GraphQL - Getting Started

![](GraphQL/Attachments/graphql-ruby-icon.png)https://graphql-ruby.org/getting_started#declare-types



](https://graphql-ruby.org/getting_started#declare-types)

## 2-0. エントリーポイントを設定する

- スキーマを作成する前に、’query root’と呼ばれるエントリーポイントを設定する必要があるそうです。

先ほど、定義したようなTypesの他に2つの特別なTypesが存在します。(これがEntry Pointとなるquery rootなんですね。)

- `Query`タイプは必須で、

- `Mutation`タイプはあるときないときあります。

具体的には、以下のようにしてエントリーポイントとなる特殊な型を定義します。

### in GQL

```GraphQL
# Query型の定義
schema {
  query: Query
  mutation: Mutation
}

# heroって呼ばれたら、任意でEpisode型のepisodeを取得して、Character型をオブジェクトを返す。
type Query {
  hero(episode: Episode): Character #引数も受け取る。
  droid(id: ID!): Droid
}
```

以下のようにクエリを発行することができる。特別な型とはいえ、他の通常の型と同様に扱うことができる。

```GraphQL
# Query実行
query <opreation_name>{
  hero {
    name
  }
  droid(id: "2000") {
    name
  }
}
```

### in Ruby

```Ruby
class Schema < GraphQL::Schema
  query QueryType
end


# Query型の定義
class QueryType < GraphQL::Schema::Object
  description "The query root of this schema"

  # First describe the field signature:
	# 第二引数は戻り値です。
  field :hero, Types::CharacterType, "Find a hero by Episode" do
    argument :episode, Types::EpisodeType
  end

  # Then provide an implementation():
	# 実際の実装内容を記述する。
  def hero(episode:)
    Character.find(episode)
  end
end
```

```Bash
# query実行の一例。 文字列を保存して、Schema.execute するらしいよね。
query_string = "
{
  post(id: 1) {
    id
    title
    truncatedPreview
  }
}"
result_hash = Schema.execute(query_string)
# {
#   "data" => {
#     "post" => {
#        "id" => 1,
#        "title" => "GraphQL is nice"
#        "truncatedPreview" => "GraphQL is..."
#     }
#   }
# }
```

`graphql / ruby` についていうと、Resolverを使って以下のようにも書くことができるでしょう。

cf. )

[

GraphQL - Resolvers

![](GraphQL/Attachments/graphql-ruby-icon.png)https://graphql-ruby.org/fields/resolvers.html#using-resolver



](https://graphql-ruby.org/fields/resolvers.html#using-resolver)

以下に、Resolver定義ファイルの基本的な書き方、構造について説明する。

```Ruby
module Resolvers
  class RecommendedItems < Resolvers::Base
    type [Types::Item], null: false #戻り値の型っていうか、
#　あるfieldに紐づくこのresolverが呼び出されたら、取得されていく値についての情報を設定(型だけど、実態を持つ感じだよね。)

    argument :order_by, Types::ItemOrder, required: false #引数について
    argument :category, Types::ItemCategory, required: false

    def resolve(order_by: nil, category: nil) #実装
      # call your application logic here:
      recommendations = ItemRecommendation.new(
        viewer: context[:viewer],
        recommended_for: object,
        order_by: order_by,
        category: category,
      )
      # return the list of items
      recommendations.items
    end
  end
end
```

> [https://graphql.org/learn/schema/#the-query-and-mutation-types](https://graphql.org/learn/schema/#the-query-and-mutation-types)

## 2-1.

## Connection(pagination)

connectionおよび、connection_typeはGraphQLにおけるpaginationのベストプラクティスとして用いられているそうです。

`xxxx.connection_type`  

> the `**connection_type**` method in GraphQL-Ruby is used to generate a connection type for paginating over objects of a given type.

In your schema definition, you would use it in the `**field**` method like this:

```Ruby
field :items, Types::ItemType.connection_type, null: false
```

上の例では、ItemTypesに対して、connection_typeメソッドが実行されていてこれはItemTypeをページネイトしたいということを意味しています。

戻り値は, `ItemConnection` になります。つまりこれは、connection_typeというものはページネーションのために用いられるということを意味します。

> In this example, the `**connection_type**` method is used on `**Types::ItemType**`, which means that we want to paginate over objects of the `**ItemType**`. The return type generated by this will be called `**ItemConnection**`. This indicates that it's a connection type that should be used for pagination.

Because the name ends in `**Connection**`, the `**field**` method automatically configures this with `**connection: true**`, which means it's a field that should be handled as a connection. If the connection type’s name doesn’t end in `**Connection**`, you have to add that configuration yourself:

```Ruby

# here's a custom type whose name doesn't end in "Connection", so `connection: true` is required:
field :items, Types::ItemConnectionPage, null: false, connection: true

```

When you use `**connection_type**`, the field is given some arguments by default: `**first**`, `**last**`, `**after**`, and `**before**`. These arguments are used for pagination[**1**](https://graphql-ruby.org/pagination/using_connections.html).

### cursorについて

ruby gemの場合には、cursorは先頭からの連番をbase64変換しているだけなので、要は先頭からの位置を算出しているだけ

[graphql-batchライブラリ](gem%E3%81%A7GraphQL%E3%82%92%E5%AE%9F%E8%A3%85%E3%81%99%E3%82%8B/graphql-batch%E3%83%A9%E3%82%A4%E3%83%96%E3%83%A9%E3%83%AA%20e7a8d54897f84e81a9fe4b7256f7ae89.html)

# mutation

引数先に書きたいよね。

```Ruby
class Mutations::AddStar < Mutations::BaseMutation
  argument :post_id, ID, loads: Types::Post

  field :post, Types::Post

  def resolve(post:)
    post.star

    {
      post: post,
    }
  end
end
```

# 用語

- schemaとtype

以下のようにエントリーポイントが定義されることから分かるように、

GraphQLのschemaはクエリやみゅーてーしょんで扱うことをできるデータを定義するものです。

その中にそれぞれのfieldが存在して、個々のフィールドについての具体的なデータ型を定める単位としてtypeが存在しますよ。

```GraphQL
schema {
 query: Query,
 mutation : Mutation
}
# とした後に、
type Query {
...
}
```

# GraphiQLの導入

graphiql-rubyというライブラリを使用することができるらしいよ。

# Typeの定義について

## null: false

GraphQL’s concept of _non-null_ is expressed in the [Schema Definition Language](https://graphql.org/learn/schema/#type-language) (SDL) with `!`, for example:

意味は、nullになり得ない！。

→queryのfieldであれば、 fieldが指定された時にnullを返すことはあり得ない。

→ 引数の値であれば、必ず値を取得する。

[

GraphQL - Non-Null Types

GraphQL’s concept of non-null is expressed in the Schema Definition Language (SDL) with !, for example:

![](GraphQL/Attachments/graphql-ruby-icon.png)https://graphql-ruby.org/type_definitions/non_nulls.html



](https://graphql-ruby.org/type_definitions/non_nulls.html)

# preprocessing

[

GraphQL - Arguments

Fields can take arguments as input. These can be used to determine the return value (eg, filtering search results) or to modify the application state (eg, updating the database in MutationType).

![](GraphQL/Attachments/graphql-ruby-icon.png)https://graphql-ruby.org/fields/arguments.html#preprocessing



](https://graphql-ruby.org/fields/arguments.html#preprocessing)

# ライフサイクルというか、リクエストされたときの挙動について

In GraphQL, the resolution process for a query involves several steps where the schema, resolvers, and types all play specific roles. The order of operations is crucial to understand how each component confirms and returns the correct data. Here's a simplified breakdown of how this process works:

### **1. Query Parsing and Validation**

First, the GraphQL server parses the query to ensure it's syntactically correct. It then validates the query against the schema to ensure all fields exist on the types they are queried on and that all fields are used correctly according to the schema (correct types for arguments, return types, etc.).

### **2. Executing the Query - Resolver Functions**

Once the query is validated, the server executes it. This involves calling the appropriate resolver functions for the fields specified in the query. Here’s how it works:

- **Top-level Query Resolvers**: The process begins with the resolvers for the top-level fields in the query. These resolvers are responsible for fetching the initial data. In a typical GraphQL setup, each field in the schema can have its own resolver function, though GraphQL also provides default resolvers if none are specified.

- **Nested Resolvers**: After the top-level resolvers, GraphQL processes nested fields. If the data returned by a higher-level resolver contains types that themselves have fields needing resolution, the corresponding resolvers for these nested fields are called. This continues recursively until all fields requested in the query are resolved.

### **3. Type Resolution in Unions and Interfaces**

When dealing with union or interface types, GraphQL needs to determine which concrete type to use for each returned object. This is where the `**resolve_type**` method comes into play:

- `**resolve_type**` **Method**: For union and interface types, the `**resolve_type**` method is used to determine the actual type of each returned object. This method is called after the data for that field is fetched (typically in a resolver for a field returning a union or interface type). The method checks the nature of the object (often using a type identifier field or the presence of certain fields) and maps it to the correct GraphQL type defined in the schema.

- **Validation of Type Appropriateness**: After `**resolve_type**` assigns a specific type to an object, the fields requested in the query are validated against this type. If the query asks for fields not present on the resolved type, it results in an error.

### **4. Response Construction**

Finally, once all the fields are resolved and their types determined, GraphQL constructs the response. This response includes only the fields specified in the query and adheres to the structure defined by the query.

### **Summary**

To answer your question directly:

- **Resolver Execution**: First, GraphQL executes resolvers based on the query structure, fetching data as required.

- **Type Confirmation**: If the data involves a union or interface, each object's type is determined using the `**resolve_type**` method. GraphQL then confirms that the fields requested in the query are valid for the resolved types.

- **Field Resolution**: After determining the correct types, GraphQL continues to resolve any remaining fields required by the query, ensuring at each step that the fields are appropriate for the type of the object being processed

# argについて

resolveでは、**argやそれぞれのkeywordの形でargmentに指定した値を取得できる

privateメソッド内では、arugementsのhash内に格納されているので参照することができる。

```Ruby
# e.g.
module Businesses::Mutations
  module Roulettes
    class CreateZasUserRouletteRight < Commons::Mutations::LoginRequiredMutation
      description 'ルーレット実行権をユーザに付与する。(エラーコード => BAD_REQUEST: ルーレットが無効, TOO_MANY_REQUEST: 1日の付与上限に達した)'

      field :zas_user_roulette_plays, [Commons::Types::Roulettes::ZasUserRoulettePlayType], null: false, description: '作成したルーレット実行権'

      argument :zas_user_id, ID, '実行権付与対象の一般ユーザID', required: true
      argument :roulette_id, ID, '対象のルーレットID', required: true

      def resolve(**_args)
        ActiveRecord::Base.transaction do
          zas_user = find_zas_user
          roulette = find_roulette

          validate!(zas_user, roulette)

          {
            zas_user_roulette_plays: create_roulette_plays(zas_user, roulette)
          }
        end
      end

      private

      def find_zas_user
        ZasUser.find(arguments[:zas_user_id])
      rescue ActiveRecord::RecordNotFound
        raise Errors::GraphqlNotFoundError, '該当のユーザが見つかりませんでした。'
      end

      def find_roulette
        Roulette.find(arguments[:roulette_id])
      rescue ActiveRecord::RecordNotFound
        raise Errors::GraphqlNotFoundError, '該当のルーレットが見つかりませんでした。'
      end

      def validate!(zas_user, roulette)
        raise Errors::GraphqlBadRequestError, '無効なルーレットです。' unless roulette.enabled?
        return if zas_user.free_wheel_user?
        if roulette.daily_limit_exceeded_for?(zas_user)
          raise Errors::GraphqlTooManyRequestsError, '該当ユーザーの対象のルーレットは1日の付与上限に達しています。'
        end
      end

      def create_roulette_plays(zas_user, roulette)
        roulette.create_roulette_play_count(:qr_code).times.map do
          zas_user.roulette_plays.create!(
            transaction_kind: :qr_code,
            roulette: roulette,
            shop_id: current_user.business.id
          )
        end
      end
    end
  end
end
```

# resolverに書くか、モデルに書くか？

```Plain
リゾルバに書くべき内容

	•	リゾルバは、入力の受け取り、関連するモデルの呼び出し、結果の整形と返却に集中します。
	•	バリデーションやビジネスロジックが複雑な場合は、モデルに委譲します。

モデルに書くべき内容

	•	モデルは、ビジネスロジック、バリデーション、関連オブジェクトとのやり取りなど、データ操作に関連するロジックを含むべきです。
	•	モデルは、データベースに関連する操作を直接扱います。
	```
```

# GraphqL Loader

[https://blog.kymmt.com/entry/graphql-batch-examples](https://blog.kymmt.com/entry/graphql-batch-examples)