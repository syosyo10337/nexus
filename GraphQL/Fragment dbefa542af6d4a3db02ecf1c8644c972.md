 

# Fragment

# inline fragment

cf.

[

Queries and Mutations | GraphQL

On this page, you’ll learn in detail about how to query a GraphQL server.

![](GraphQL/Attachments/favicon.ico)https://graphql.org/learn/queries/#inline-fragments

![](GraphQL/Attachments/og-image.png)](https://graphql.org/learn/queries/#inline-fragments)

### レスポンスをunionの型に分けてfilterしたい。

Union型で、クエリのフィールドを特定のobjectタイプの時だけ、記述していなくても、該当のデータが存在する場合には、

データの取得は行われる。

そのため、基本的に取得件数を含めて、クライアント側で制御するには、

余分なレスポンスを受け取った前提で、加工する必要がある。

[![](GraphQL/Attachments/Screenshot_2024-05-02_at_17.20.22.png)](Fragment/Screenshot_2024-05-02_at_17.20.22.png)