 

# postgresのコンテナがアプリから繋げない (1)

結局postgresのイメージに

必須のパスワードだけ渡して、

後は、rails側からdb:create でDB作成

db:migrateでテーブル反映

db:seedでサンプルファイルを注入した。

railsコンテナから

```Bash
psql -U postgres -h <dbコンテナ名>
# これで解決できる
```