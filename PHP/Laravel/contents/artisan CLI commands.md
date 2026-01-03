d 

# artisan CLI commands

```Plain
//  routingを表示
$ php artisan route:list

// debugコンソールを起動する
$ php artisan tinker

// サーバの起動
$ php artisan serve

// DBの情報を表示する
$ php artisan db:show

// modelの作成
$ php artisan make:model
// migrationつきで
$ php artisan make:model -m

//migrate UP
$ php artisan migarte

// 個別のmigrationファイルの作成(自動推測付き)
$ php artisan make:migration <migration_file_name>

// migrationの状態を確認する
$ php artisan migrate:status
// migrationを1から再度実行する
$ php artisan migrate:refresh
// (factoryによるseedingがある場合には、そちらも再実行される)
$ php artisan migrate:refresh --seed

// seeding
＄ php artisan db:seed

// Factoryの作成
$ php artisan make:factory ListingFactory
```