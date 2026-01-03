 

# (draft)RepositoryとServiceそしてInterface

[Sevice層とrepository層への分離によるfat controllerへの対処](#911e5410-f1d8-4378-a25d-6c5752ad42d1)

[リポジトリとは](#7ac2f083-68a4-4971-817a-24de8472b95d)

## Sevice層とrepository層への分離によるfat controllerへの対処

mvcの拡張

modelに収束されるビジネスロジックを細分化したもの

- service層はビジネスロジックに集中する(DBと接続しない)  
    リポジトリからレコードを取得して、加工してcontrollerに渡す。

- リポジトリはDB接続のクラス レコードを引っ張ってきて、モデルオブジェクトに突っ込んでいく。  
    これをサービス層に渡す  
    流れとしてh  
    controller -> service -> repository -> DB

### リポジトリとは

**modelのデータにアクセスする部分だけをrepositoryというフォルダ配下に切り出して書くことにした**

**repositoryはmodelにアクセスするクエリを発行するだけの場所にして、serviceでそのデータを整形してコントローラーで扱いやすくしてあげる**

cf. )

[

LaravelでService層とRepository層を取り入れる | ENJOYWORKS エンジョイワークス

![](PHP/Laravel/contents/Attachments/apple-touch-icon.png)https://enjoyworks.jp/tech-blog/7743

![](PHP/Laravel/contents/Attachments/スライド1-2.png)](https://enjoyworks.jp/tech-blog/7743)

[

Laravelのapiの作り方とserviceとrepositoryの使い方とか５分で学べる。 | 合同会社FIELD

合同会社FIELDのブログです「Laravelのapiの作り方とserviceとrepositoryの使い方とか５分で学べる。」

![](https://field.asia/laravel%E3%81%AEapi%E3%81%AE%E4%BD%9C%E3%82%8A%E6%96%B9%E3%81%A8service%E3%81%A8repository%E3%81%AE%E4%BD%BF%E3%81%84%E6%96%B9%E3%81%A8%E3%81%8B%EF%BC%95%E5%88%86%E3%81%A7%E5%AD%A6%E3%81%B9%E3%82%8B/static/images/favicon/favicon_32_32.ico)https://field.asia/laravel%E3%81%AEapi%E3%81%AE%E4%BD%9C%E3%82%8A%E6%96%B9%E3%81%A8service%E3%81%A8repository%E3%81%AE%E4%BD%BF%E3%81%84%E6%96%B9%E3%81%A8%E3%81%8B%EF%BC%95%E5%88%86%E3%81%A7%E5%AD%A6%E3%81%B9%E3%82%8B/

![](PHP/Laravel/contents/Attachments/logo01.svg)](https://field.asia/laravel%E3%81%AEapi%E3%81%AE%E4%BD%9C%E3%82%8A%E6%96%B9%E3%81%A8service%E3%81%A8repository%E3%81%AE%E4%BD%BF%E3%81%84%E6%96%B9%E3%81%A8%E3%81%8B%EF%BC%95%E5%88%86%E3%81%A7%E5%AD%A6%E3%81%B9%E3%82%8B/)

As mentioned previously, the repositories shown are coupled to Eloquent models, and so they aren’t returning true domain objects. A true repository pattern would allow you to switch between different ORMs, such as changing from Eloquent to Doctrine without affecting the service layer