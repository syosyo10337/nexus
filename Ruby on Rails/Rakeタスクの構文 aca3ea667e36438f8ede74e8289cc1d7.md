 

# Rakeタスクの構文

### **Rakeタスクの構文**

Rakeタスクの基本的な定義は以下のような構文を持っています：

```Ruby
rubyCopy code
task :task_name => [:dependency1, :dependency2] do |task_args|
  # タスクの処理
end

```

ここで、`**task_name**`はタスクの名前、`**:dependency1**`, `**:dependency2**`はこのタスクが実行される前に実行されるべき依存タスクです。

### `**[:args] => :environment**`**の意味**

この構文の中で、`**[:args] => :environment**`は特別な意味を持ちます。

- `**[:args]**`は、タスクに引数があることを示しています。この場合、`**args**`は引数の名前です。タスクを実行する際にコマンドラインから引数を渡すことができます。

- `**=> :environment**`は、このタスクが実行される前に`**:environment**`タスクが実行されることを意味します。Railsアプリケーションにおいて、`**:environment**`タスクはRails環境をロードすることを意味し、モデルやライブラリへのアクセスが必要なタスクで一般的に使われます。

### **タスクのブロック引数**

```Ruby
rubyCopy code
task :send_official_registration_reminders, [:args] => :environment do |_, args|
  # タスクの処理
end

```

- ここで、`**|_, args|**`はブロック引数です。`**_**`はRubyで「この引数は使わない」という意味で使われる慣習です。この場合、最初の引数（通常はタスク自身の参照）は無視され、`**args**`引数のみが使用されます。

- 結論として、このRakeタスクの定義は、Rails環境をロードした上で、コマンドラインから渡された引数を取得し、それを使って特定の処理を実行するよう設計されています。

[![](AEdFTp45dJl4UFFNvszgzGZ8QVzEHfNXmeXSNgTWChpC=s96-c.jpeg)](https://lh3.googleusercontent.com/a/AEdFTp45dJl4UFFNvszgzGZ8QVzEHfNXmeXSNgTWChpC=s96-c)

つまり、

```Ruby

task :send_official_registration_reminders, [:arguments] => :environment do |_, args|
    logger_task_start
    type, days = args.arguments.split('/')
```

# rake タスクのテストコードを書く

[https://blog.nightonly.com/2020/08/10/バッチ処理task作成とテストrspec実装/](https://blog.nightonly.com/2020/08/10/バッチ処理task作成とテストrspec実装/)