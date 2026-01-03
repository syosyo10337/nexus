---
tags:
  - rails
  - testing
  - gem
  - config
created: 2026-01-03
status: active
---

# bin/setupって何?

# 結論

rails アプリのセットアップをしてくれる**スクリプト**

実際に、catで見てみると。

```Bash
cat bin/setup


#!/usr/bin/env ruby
require "fileutils"

# path to your application root.
APP_ROOT = File.expand_path("..", __dir__)

def system!(*args)
  system(*args) || abort("\n== Command #{args} failed ==")
end

FileUtils.chdir APP_ROOT do
  # This script is a way to set up or update your development environment automatically.
  # This script is idempotent, so that you can run it at any time and get an expectable outcome.
  # Add necessary setup steps to this file.

  puts "== Installing dependencies =="
  system! "gem install bundler --conservative"
  system("bundle check") || system!("bundle install")

  # puts "\n== Copying sample files =="
  # unless File.exist?("config/database.yml")
  #   FileUtils.cp "config/database.yml.sample", "config/database.yml"
  # end

  puts "\n== Preparing database =="
  system! "bin/rails db:prepare"
  # To avoid error https://github.com/rails/rails/issues/46845
  system! "bin/rails db:environment:set RAILS_ENV=test"

  puts "\n== Removing old logs and tempfiles =="
  system! "bin/rails log:clear tmp:clear"

  puts "\n== Restarting application server =="
  system! "bin/rails restart"
end
```

以上のようになっており、

内容としてざっくり言えるのは

- bundle installを走らせたり、

- dbの準備をして、cloneしてようなrailsプロジェクトをローカルで実行できる準備をしてくれる

詳しく知りたい方はコードを読んでみてください。