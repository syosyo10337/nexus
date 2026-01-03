 

# psコマンド

実行中のプロセスを検索するコマンド

a = show processes for all users

u = display the process's user/owner

x = also show processes not attached to a terminal

```Bash

e.g. # ngrokのプロセスを検索
ps aux | grep ngrok

# 該当プロセスをkill（PIDを確認して）
kill <PID>

# 強制終了が必要な場合
kill -9 <PID>
```