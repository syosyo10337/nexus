 

![](SQL/MySQL/Attachments/mysql-3.svg)

# MySQL

---

将来的にはpostgresqlとまとめて、SQLとして管理したい。

[

MySQLとPostgreSQLコマンド比較表 - Qiita

機能 MySQL PostgreSQL 起動 $ mysql -p -h ホスト名 -P ポート番号 -u ユーザ名 DB名 $ psql -h ホスト名 -p ポート番号 -U ユーザ名 DB名 データベース一覧 ...

![](SQL/MySQL/Attachments/apple-touch-icon-ec5ba42a24ae923f16825592efdc356f.png)https://qiita.com/aosho235/items/c657e2fcd15fa0647471

![](SQL/MySQL/Attachments/article-ogp-background-9f5428127621718a910c8b63951390ad.png)](https://qiita.com/aosho235/items/c657e2fcd15fa0647471)

- mysql(DB)コンテナに入る方法

dbコンテナに入るときは、基本的にはローカルで接続する時を同様のコマンドで良い。

ただし、user名とpasswordを `docker-compose.yml`を忘れずに

```Bash
# リモートのコンテナや別のコンテナから接続する際には
# -P <ポート番号> -h <ホスト名> 等も指定する必要があるかも

$ mysql -u <user_name> -p
# パスワード入力求められる
```

- テーブル定義をみたい時には

```SQL
# desc| describe
mysql> desc <table_name>
```

- record数を確認したい！

```SQL
mysql> select count(* | <column_name>) from <table>;
```

# ダンプファイルをimportする

```Bash
// 該当のコンテナやサーバ内で
$ mysql -u user_name -p  <databases_name> < <file_path>

e.g.)
mysql -u root -p upg_web < /media/upg_web.sql



// dockerコマンド一発でやる場合
$ docker-compose exec db mysql -u <your-username> -p<your-password> <your-db-name> < /backup/your-dump-file.sql
```

DBコンテナがdocker上にあるときは、`docker cp`でファイルを移動させる必要があります。

[JSONの扱い](MySQL/JSON%E3%81%AE%E6%89%B1%E3%81%84%20ffec05d0baf2436b8f94dc1cdf7cf54a.html)