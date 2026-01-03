---
tags:
  - rails
  - testing
  - gem
  - config
created: 2026-01-03
status: active
---

# puma restartができない

## 症状

```Bash
01:11 t
      01 sudo /bin/systemctl restart puma_recorda-me_production
      01 sudo
      01 :
      01 no tty present and no askpass program specified
      01
#<Thread:0x00005581968b8fe0 /usr/local/bundle/gems/sshkit-1.21.3/lib/sshkit/runners/parallel.rb:10 run> terminated with exception (report_on_exception is true):
/usr/local/bundle/gems/sshkit-1.21.3/lib/sshkit/runners/parallel.rb:15:in `rescue in block (2 levels) in execute': Exception while executing as deploy@web: sudo exit status: 1 (SSHKit::Runner::ExecuteError)
sudo stdout: Nothing written
sudo stderr: sudo: no tty present and no askpass program specified
	from /usr/local/bundle/gems/sshkit-1.21.3/lib/sshkit/runners/parallel.rb:11:in `block (2 levels) in execute'
/usr/local/bundle/gems/sshkit-1.21.3/lib/sshkit/command.rb:97:in `exit_status=': sudo exit status: 1 (SSHKit::Command::Failed)
sudo stdout: Nothing written
sudo stderr: sudo: no tty present and no askpass program specified
	from /usr/local/bundle/gems/sshkit-1.21.3/lib/sshkit/backends/netssh.rb:170:in `execute_command'
	from /usr/local/bundle/gems/sshkit-1.21.3/lib/sshkit/backends/abstract.rb:148:in `block in create_command_and_execute'
	from <internal:kernel>:90:in `tap'
	from /usr/local/bundle/gems/sshkit-1.21.3/lib/sshkit/backends/abstract.rb:148:in `create_command_and_execute'
	from /usr/local/bundle/gems/sshkit-1.21.3/lib/sshkit/backends/abstract.rb:80:in `execute'
	from /usr/local/bundle/gems/capistrano-3.17.1/lib/capistrano/dsl.rb:44:in `sudo'
	from /usr/local/bundle/gems/capistrano3-puma-5.2.0/lib/capistrano/puma/systemd.rb:48:in `sudo_if_needed'
	from /usr/local/bundle/gems/capistrano3-puma-5.2.0/lib/capistrano/puma/systemd.rb:55:in `execute_systemd'
	from /usr/local/bundle/gems/capistrano3-puma-5.2.0/lib/capistrano/tasks/systemd.rake:105:in `block (3 levels) in eval_rakefile'
	from /usr/local/bundle/gems/sshkit-1.21.3/lib/sshkit/backends/abstract.rb:31:in `instance_exec'
	from /usr/local/bundle/gems/sshkit-1.21.3/lib/sshkit/backends/abstract.rb:31:in `run'
	from /usr/local/bundle/gems/sshkit-1.21.3/lib/sshkit/runners/parallel.rb:12:in `block (2 levels) in execute'
(Backtrace restricted to imported tasks)
cap aborted!
SSHKit::Runner::ExecuteError: Exception while executing as deploy@web: sudo exit status: 1
sudo stdout: Nothing written
sudo stderr: sudo: no tty present and no askpass program specified


Caused by:
SSHKit::Command::Failed: sudo exit status: 1
sudo stdout: Nothing written
sudo stderr: sudo: no tty present and no askpass program specified
```

参考)

[https://obel.hatenablog.jp/entry/20181030/1540880580#fn-209d17ff](https://obel.hatenablog.jp/entry/20181030/1540880580#fn-209d17ff)

[https://chihaso.hatenablog.com/entry/2021/02/10/001307](https://chihaso.hatenablog.com/entry/2021/02/10/001307)

## 対応

でているエラーを見る感じは、

ttyを有効化する必要がありそう。

```Bash
# config/deploy.rb

set :pty, true
```

## 対応2

それでも、ダメな時は、pumaの設定ファイルをcapistranoタスクで、本番上に置く。

```Bash
# リモート環境
$ cap production puma:config
```

参考までにリモートに生成されたファイルの一例。

```Ruby
#/var/www/recorda-me/shared/puma.rb

#!/usr/bin/env puma

directory '/var/www/recorda-me/current'
rackup "/var/www/recorda-me/current/config.ru"
environment 'production'

tag ''

pidfile "/var/www/recorda-me/shared/tmp/pids/puma.pid"
state_path "/var/www/recorda-me/shared/tmp/pids/puma.state"
stdout_redirect '/var/www/recorda-me/shared/log/puma_access.log', '/var/www/recorda-me/shared/log/puma_error.log', true


threads 0,16



bind 'unix:///var/www/recorda-me/shared/tmp/sockets/puma.sock'

workers 0




restart_command 'bundle exec puma'


prune_bundler


on_restart do
  puts 'Refreshing Gemfile'
  ENV["BUNDLE_GEMFILE"] = ""
end
```