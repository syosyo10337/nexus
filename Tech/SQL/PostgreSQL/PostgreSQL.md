---
tags:
  - sql
  - query
  - ddl
created: 2026-01-03
status: active
---

![](SQL/PostgreSQL/Attachments/postgresql-original.svg)

# PostgreSQL

# 導入

---

macOSの場合

```Bash
#インストール
$ brew install postgresql

#バージョン確認
$ postgres --version

#サーバーの起動と停止
$ brew services start postgresql
$ brew services stop postgresql

#サーバーの起動状態の確認
$ brew services list

```

### DBに入る時は　psqlコマンドを使う

mysqlとpostgresのコマンド比較

[

MySQLとPostgreSQLコマンド比較表 - Qiita

起動 $ mysql -p -h ホスト名 -P ポート番号 -u ユーザ名 DB名 $ psql -h ホスト名 -p ポート番号 -U ユーザ名 DB名 行表示の切り替え select * from t \G \xselect * from t;※mysql同様、1回のクエリだけ\xしたい場合はselect * from t \gx psql 9以前の場合はこちら TSVダンプ mysqldump -u USER --password=PASS DATABASE_NAME TABLE_NAME -T /tmp \copy テーブル名 to 'data.tsv' csv delimiter ' ' header;または\copy (select * from テーブル名) to 'data.tsv' csv delimiter ' ' header; TSVインポート LOAD DATA LOCAL INFILE ファイル名 REPLACE INTO TABLE テーブル名 IGNORE 1 LINES; copy テーブル名 from '/absolute_path/to/data.tsv' ( delimiter ' ', format csv, header true ); ※1 ※1 TSVインポートはMySQL, PostgreSQLとも面倒だから、TSVからSQLに変換するスクリプトを自作するのがベスト。 information_schemaはSQL標準なので、どちらでも同じSQLが使える。 PostgreSQL：環境変数で設定 MySQL：~/.my.cnfで設定

![](SQL/PostgreSQL/Attachments/production-c620d3e403342b1022967ba5e3db1aaa.ico)https://qiita.com/aosho235/items/c657e2fcd15fa0647471

![](SQL/PostgreSQL/Attachments/article-ogp-background-9f5428127621718a910c8b63951390ad.png)](https://qiita.com/aosho235/items/c657e2fcd15fa0647471)

## RailsアプリでPostgreSQLを使う

```Bash
#Gemfile
gem 'pg'

#Rails 6.1環境ではpg 1.4.4だった

# ちなみに
$ psql -V 
psql (PostgreSQL) 14.5 (Homebrew)
```

rails new -d postgresqlしてない時は、

`database.yml`も編集する必要がある。

その際の参考資料

[

PostgreSQLのインストールからRailsでのDB変更まで - Qiita

お疲れ様です。RailsのPostgreSQL環境再構築の項です。 RailsのDBをPostgreSQLに変更するとき 以下の点に留意して下さい。 上記を踏まえ, 止むを得ずDBを変更する場面を想定して 本項をまとめました。 Railsの開発環境で, PostgreSQLを使えるようにする PostgreSQLにSeedデータを挿入する Mac OS Mojave 10.14.3 Homebrewを使える Rails 5.2 を使える Model, validates, View, Controllerは作成済み Herokuへのデプロイまではカバーしない PostgreSQLとは PostgreSQLインストール PostgreSQLセットアップ Railsに適用する 参考 : インストール時のHEADオプションでエラー発生 $brew info postgresql postgresql: stable 11.2 (bottled), HEAD $brew install postgresql --HEAD # HEADバージョン ...

![](SQL/PostgreSQL/Attachments/production-c620d3e403342b1022967ba5e3db1aaa.ico)https://qiita.com/krtsato/items/4565051608a63f11b316

![](SQL/PostgreSQL/Attachments/article-ogp-background-9f5428127621718a910c8b63951390ad%201.png)](https://qiita.com/krtsato/items/4565051608a63f11b316)

# debian Aptリポジトリを使う

---

Debian のバージョンに含まれているバージョンが必要なバージョンでない場合は、[**PostgreSQL Apt リポジトリ**](https://apt.postgresql.org/)を使用できます。[**このリポジトリは、通常のシステムおよびパッチ管理と統合され、PostgreSQL のサポート期間**](https://www.postgresql.org/support/versioning/)中、サポートされているすべてのバージョンの PostgreSQL の自動更新を提供し ます。

```Bash
# ファイル リポジトリ構成を作成します。
sudo sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list'

wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key 追加 -

sudo apt-get アップデート

sudo apt-get -y install postgresql
```

cf)

[🚤Dockerfile](Docker/Dockerfile%201fa03e40c5b14260893c679556ba7cb7.html)

[SQL join](PostgreSQL/SQL%20join%2095bf0a878f91430db15d4d5942939ddc.html)