 

# ActiveRecordとRepositoryパターン

[参考資料](#9e62f0c6-3bf0-4ce4-ae42-a0d595f33d20)

[根源的な問題点](#3853d2d0-a277-405a-80c0-f5b12cf97f01)

[Repositoryパターンについて](#ada84a80-4579-4906-a170-eee5a6e69281)

[データアクセスロジックって言うけど？](#b59b6b25-5ff0-4af6-86cd-3e867113ea6b)

[じゃあどうやってRepositoryを運用するべき？](#156f5e69-f5ab-4bf8-8503-444960809d88)

### 参考資料

[

データアクセスのパターンと、ActiveRecord や Eloquant による Repository の実装について - 完全に理解した.com

アプリケーション・アーキテクチャについて議論する中で、最近は DDD の戦術的設計やクリーンアーキテクチャなどがキーワードとして解説されることが多いです。 この記事では、データアクセスのパターンについて改めて整理し、よく見かける議論の 1 つである「Rails の ActiveRecord や Laravel の Eloquant による Repository の実装」についても考察してみます。

![](Import%20tech/Attachments/icon-512x512.png)https://www.kanzennirikaisita.com/posts/data-access-patterns

![](Import%20tech/Attachments/thumbnail.png)](https://www.kanzennirikaisita.com/posts/data-access-patterns)

[

CQRS実践入門 [ドメイン駆動設計] - little hands' lab

この記事では、CQRSの入門として、軽量CQRS、別名クエリモデルについて解説します。 DDDの参照系処理で発生する課題 解決策 CQRSのメリット、デメリット 実装時の注意事項 部分的導入について なぜQueryServiceの定義がUseCase層なのか 整合性をどうやって担保するのか よくある誤解 データソースを…

![](Import%20tech/Attachments/link.png)https://little-hands.hatenablog.com/entry/2019/12/02/cqrs

![](Import%20tech/Attachments/20191202061944.png)](https://little-hands.hatenablog.com/entry/2019/12/02/cqrs)

[

Repositoryパターンのアンチパターン - Qiita

よく見かけるRepositoryパターンのアンチパターンの紹介と対策です。 Repositoryパターンとは Repositoryパターンとは永続化を隠蔽するためのデザインパターンで、DAO(DataAccessObject)パター...

![](Import%20tech/Attachments/apple-touch-icon-ec5ba42a24ae923f16825592efdc356f.png)https://qiita.com/mikesorae/items/ff8192fb9cf106262dbf

![](Import%20tech/Attachments/article-ogp-background-9f5428127621718a910c8b63951390ad.png)](https://qiita.com/mikesorae/items/ff8192fb9cf106262dbf)

[

「ビジネスロジック」とは何か、どう実装するのか - Qiita

アプリケーション開発で、「ビジネスロジックは分離しろ」だとか「Controller にビジネスロジックを書くな」といったことをよく言われると思います。 しかし、ビジネスロジックという言葉の意味を聞いたり調べたりしてみても、「システム...

![](Import%20tech/Attachments/apple-touch-icon-ec5ba42a24ae923f16825592efdc356f.png)https://qiita.com/os1ma/items/25725edfe3c2af93d735

![](Import%20tech/Attachments/article-ogp-background-9f5428127621718a910c8b63951390ad%201.png)](https://qiita.com/os1ma/items/25725edfe3c2af93d735)

[

CQRS実践入門 [ドメイン駆動設計] - little hands' lab

この記事では、CQRSの入門として、軽量CQRS、別名クエリモデルについて解説します。 DDDの参照系処理で発生する課題 解決策 CQRSのメリット、デメリット 実装時の注意事項 部分的導入について なぜQueryServiceの定義がUseCase層なのか 整合性をどうやって担保するのか よくある誤解 データソースを…

![](Import%20tech/Attachments/link.png)https://little-hands.hatenablog.com/entry/2019/12/02/cqrs

![](Import%20tech/Attachments/20191202061944.png)](https://little-hands.hatenablog.com/entry/2019/12/02/cqrs)

[

5年間 Laravel を使って辿り着いた，全然頑張らない「なんちゃってクリーンアーキテクチャ」という落としどころ

![](Import%20tech/Attachments/icon.png)https://zenn.dev/mpyw/articles/ce7d09eb6d8117#%E5%AE%9F%E3%81%AF%E3%82%B5%E3%83%BC%E3%83%93%E3%82%B9%E3%81%AB%E3%81%AF2%E7%A8%AE%E9%A1%9E%E3%81%82%E3%82%8B

![](Import%20tech/Attachments/og-base.png)](https://zenn.dev/mpyw/articles/ce7d09eb6d8117#%E5%AE%9F%E3%81%AF%E3%82%B5%E3%83%BC%E3%83%93%E3%82%B9%E3%81%AB%E3%81%AF2%E7%A8%AE%E9%A1%9E%E3%81%82%E3%82%8B)

# 根源的な問題点

- 非正規なテーブルと、LaravelのActiveRecord的なORMの相性の悪さ。

ドキュメントには、非正規なテーブルとLaravelのActiveRecord的なORMの相性が悪いという根本的な問題が挙げられています。ActiveRecordは、クラスのインスタンスを使用してデータベーステーブルの行を表す設計パターンであり、そのインスタンスのメソッドを使用してその行のデータを操作することができます。しかし、従来の命名規則や構造に従わないテーブルの場合、ActiveRecordを効果的に使用することが難しくなることがあります。これは複雑なクエリやシステムの一貫性を維持する上で問題となる可能性があります。この問題に対処するため、ドキュメントでは、Repositoryパターンを使用してデータアクセスロジックを一元化することを提案しています。Repositoryクラス内に外部データソース（データベースやAPIなど）への直接的な接続を実装することで、システムの残りの部分が実装の詳細に直接的に結びつくことなくデータにアクセスできるようになります。これにより、データアクセス層の変更が容易になり、システム全体に影響を与えることなく、メンテナンス性とスケーラビリティが向上する可能性があります。==(AIによる作成)==

つまり、

- ActiveRecordによる責務の一元化が、複雑なクエリや非正規なテーブルに対応するのが難しいこと。

## Repositoryパターンについて

改めて、データアクセスロジックをまとめるクラス。このクラスにデータのアクセス(外部APIだろうが、csvだろうが、RDSだろうが)との直接のコネクションを実装することで、外部(コントローラやサービスクラス)はDBへのアクセスを意識する必要がなくなる。というもの。

### データアクセスロジックって言うけど？

実際にLaravel等のフレームワークを使った上で、DBにつなげるには、

1. 素のSQLを書いて、DBとのコネクションはlaravelに乗っかる(DBServiceでの実装)

2. クエリビルダ(laravel)に乗っかって、メソッドチェーンでSQLを発行

3. EloquentORMを使うことで、ActiveRecordパターンに則る。

ここでいう3のケースはrepositoryの内部実装として、activerecordを使っていると言うことになる

**ビジネスロジック層とのインタフェースは Repository とし、内部実装を Table Data Gateway (または ActiveRecord) にする**

- ActiveRecordパターン
    
    DBのデータと操作するメソッドを持ったインスタンスを用いてデータを扱う方法
    
    RailsやLaravelの推奨と標準的なアプローチはこちらになっている。
    

## じゃあどうやってRepositoryを運用するべき？

DDDの集約を参考にしたい

- [https://qiita.com/mikesorae/items/ff8192fb9cf106262dbf#対策-1](https://qiita.com/mikesorae/items/ff8192fb9cf106262dbf#%E5%AF%BE%E7%AD%96-1)

- 改めて、アプリケーションの設計について考えたい。
    
    - 店舗情報は完全に参照系
    
    - 在庫検索も基本的には参照系(user情報のような作成更新削除が実装されることは考えにくい)　
        
        - お気に入り商品（気になる、後で買う）を実装するような場合には、在庫自体のモデルを操作するのではなく、userFavoriteItemsのようにして、サービスとして実装し、必要とアラバデータを永続化する。