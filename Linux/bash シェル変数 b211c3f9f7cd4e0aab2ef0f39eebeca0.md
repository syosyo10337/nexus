 

# bash/シェル変数

---

[エイリアスの設定](#77647064-b304-4f60-a1a7-c8265dc462d5)

[シェル変数](#5c966218-7837-4e98-a131-e68fc03b07af)

[変数の設定](#ad627180-eae8-4392-820c-1b280bedbb4e)

[変数の参照](#e45d45aa-33bb-407c-b964-a17fdcdda17d)

[PATH](#18be41d8-398c-45a9-9751-ab525cb9e4a0)

[LANG](#29b0a5a7-8a29-4d1b-acd0-148d9c9e10ef)

[その他シェルの状態を表す変数](#7262dd45-e55f-42fb-8eac-08a867da0e74)

[環境変数(environment variable)](#2f6b53d8-7bb9-41a5-b2c7-5bbb249d3a47)

[外部コマンド/組み込みコマンド](#29344354-2f3e-428e-90c2-d2aeb78fc451)

[環境変数に関するコマンド(printenv/export)](#ab29f9b4-fd81-431c-91fc-e4e81b441f6e)

[bashの設定を永続化](#bce3a50f-e68f-4e19-b9b3-826dbf950241)

[シェル起動時に読み込まれる設定ファイル](#3bd5ef64-f5ae-4f45-a036-0eabbdd38d54)

[/etc/profile](#a557da36-f9f9-4e39-b713-c99455984eea)

[~/.bash_profile](#4bc19351-9984-4867-9006-09ac4a93b8a7)

[設定ファイルの記述に関するプラクティス](#c141ded0-5cfb-4771-b589-28d0d66d4940)

[sourceコマンド](#9e2f56ff-11aa-49a4-8c02-b5d437c93d5b)

# エイリアスの設定

---

```Bash
# エイリアスを設定する
$ alias <エイリアス名>='<コマンド>'
e.g.)
$ alias ls='ls -F' 


#エイリアスの確認と削除(本物かエイリアスかを見分ける)
$ type <コマンド名>

e.g.)lsにエイリアスをつけた時
$ type ls 
ls is an alias for ls -a

#エイリアスの削除
$ unalias <エイリアス名>


# エイリアスを一時的に無効にする方法

#①フルパスを記述する。
$ /bin/<コマンド名>
e.g.)
$ /bin/ls

#②commandをつけて、コマンドであることを明示する
$ command <コマンド名>

#③\つけてコマンドを明示する
$ \<コマンド名> 
```

- set -o/+o [オプション名] --shoptと同様にbashのオプションのオン/オフを切り替える。  
    *shopt -s/-u [オプション名] --setと同様にbashのオプションのオン/オフを切り替える。  
    set,shoptで設定できるオプションは別立てであるので、どのオプションがどちらのコマンドで設定できるかは調べてからやってね。  
    ex)ignoreeof,noglob,autocd 詳しくはp132参照

# シェル変数

---

シェル変数とは、bash内部で使用される変数。

PATH,LANGやPS1(プロンプトの表示文字を保存してる変数)

## 変数の設定

```Bash
# 基本書式　変数に対して代入する
<変数名>=<入れたい値>

# 入れたい値にspaceが入る場合は’か”で囲んであげること。
# =前後にspaceを挟まないこと
e.g.)
var1='test variable'
```

## 変数の参照

```Bash
# 基本書式
$<変数名>

e.g.)シェル変数$var1　をエコーしている例
#　echo --引数にとった文字列を標準出力するコマンド
echo $var1
```

## PATH

---

シェル変数PATHには、シェルがあるコマンドを実行する際に、そのコマンドの実体ファイルがどのディレクトリにあるかを探したのち実行される。その際に、実体ファイルの検索候補となるディレクトリパス群がこの変数には格納されている。(/binとかが多いですね。)また、自身でインストールしたアプリなどのコマンドについても、PATH変数の値に付け加えることで、実行する際にフルパスを打たなくても、実行することができる。

#ディレクトリパスが:で連結されて表示される。

```Bash
e.g.)
$ echo $PATH
/Users/masanao/.nodebrew/current/bin:/usr/local/opt/mysql/bin:/Users/masanao/.rbenv/shims:/Users/masanao/.rbenv/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:/Library/Apple/usr/bin
```

## LANG

---

ロケール(locale)(言語や国、地域を特定する識別子)が格納されている変数

## その他シェルの状態を表す変数

---

- HOME —ホームディレクトリのパスを格納

- SHELL —ログインシェルのパスを格納

- PWD —カレントディレクトリのパスを保持

```Bash
e.g.)
# HOMEを参照して、その階下のDesktopディレクトリにcd
cd $HOME/Desktop

# pwdコマンドが$PWDを参照しているのがわかる例
$ pwd
/Users/masanao/Desktop/environment/recorda_me
$ echo $PWD
/Users/masanao/Desktop/environment/recorda_me
```

# 環境変数(environment variable)

---

シェルの外部コマンドからも参照できる変数のこと。

シェルの外部コマンドは実行ファイルがどこかのディレクトリに存在していることからもわかるように、シェル内部に格納されるシェル変数からは直接アクセスできない（LANGにあげられるように、デフォルトで環境変数にも設定されているものもある。）

```Bash
e.g.)
# 外部コマンドcatが、環境変数にも設定されているLANGを参照して表示する言語を切り替えている例

$ LANG='ja_JP.UTF-8'
$ cat --help
使用法: cat [オプション]..以下略

$ LANG='en_US.UTF-8'
$ cat --help
Usage: cat [option]...以下略
```

### 外部コマンド/組み込みコマンド

シェルでは、さまざまなコマンドが呼び出せるが、その中でも実行ファイルとしてファイルシステムに存在するものを、特に==外部コマンド==と呼び、シェル自体に内蔵されているコマンドを==組み込みコマンドと呼ぶ。==

```Bash
# 外部コマンドか組み込みコマンドかを見分ける
# typeコマンドを利用

$ type cp
cp is /bin/cp
$ type set
set is a shell builtin
$ type type
type is a shell builtin
```

### 環境変数に関するコマンド(printenv/export)

- printenv

シェルに設定されている環境変数を表示させる。

```Bash
$ printenv
TERM_PROGRAM=Apple_Terminal
SHELL=/bin/zsh
TERM=xterm-256color
TMPDIR=/var/folders/c7/z8jt7r8n3gx7z4f06lvbhy040000gn/T/
TERM_PROGRAM_VERSION=445
TERM_SESSION_ID=F673BC44-F7A6-423E-9729-9F8D83F36B7F
USER=masanao
SSH_AUTH_SOCK=/private/tmp/com.apple.launchd.svka5cNefj/Listeners
PATH=/Users/masanao/.nodebrew/current/bin:/usr/local/opt/mysql/bin:/Users/masanao/.rbenv/shims:/Users/masanao/.rbenv/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:/Library/Apple/usr/bin
__CFBundleIdentifier=com.apple.Terminal
PWD=/Users/masanao/Desktop/environment/recorda_me
XPC_FLAGS=0x0
```

- export

環境変数を設定する

==「=」で定義したシェル変数は新しく起動したシェルから利用できないので、環境変数に設定する必要がある。==

```Bash
# 基本書式
$ export <シェル変数名>

e.g.)lessコマンド(外部)に用意されているLESSという変数を自分で設定する例。
# LESSには、自動で付与したいオプション値を格納できる。
# 今回は--noinitとlessコマンド終了時に画面を残すオプションを付与する

# シェル変数に値を格納して
$ LESS='--no-init'
# そのシェル変数を環境変数にも反映
# exportの時は参照ではなく指定しているので$いらないです。
$ export LESS


# シェル変数のセットと環境変数の宣言を一度に行うこともできる
$ export LESS='--no-init'
```

# bashの設定を永続化

---

端末を終了すると、変更した設定がリセットされてしまう。

次回ログインした際に、カスタムした設定を保持しておくには、

**シェルの設定ファイルを編集する必要がある。**

## シェル起動時に読み込まれる設定ファイル

bashの起動時には、いくつかの設定ファイルが読み込まれる。

1. まず、ユーザがログインした際にbashが起動して、`**/etc/profile**`が読み込まれる。

2. 次に、`**~/.bash_profile**`(zshの場合は、`**~/.zsh_profile**`)が読み込まれる。以上のようにスクリプトとしてシェルが実行する。

3. 大抵の場合は`~/.bash_profile`から`~/.bashrc`を呼び出す設定になっている

### /etc/profile

システム全体で使用する設定ファイル。全ユーザ共通の設定を行う時などにいじる。

### ~/.bash_profile

各ユーザ個別の設定ファイル。多くのdistributionでは、こちらのファイルから~/.bashrcを呼び出すようになっている。

一方で非ログインシェル（自身で`bash`==などのコマンドを打ってシェルを切り替えた場合）は、~/.bashrc(~/.zshrc)のみ読み込まれる。==

### 設定ファイルの記述に関するプラクティス

`/etc/profile`や`~/.bash_profile`はログイン時のみ読み込まれるので、自分で設定変えたい大抵の場合は`~/.bashrc(zshrc)`に書いておくと良い。

  
実際にzshの設定変更を行うときの注意点

- cpとかでバックアップファイルを作成する。

- 予備のシェルを起動しておく

- # コメントで小難しいことにはメモを入れておく

### sourceコマンド

configファイルを編集した後、変更を反映するには再ログインが求められるが、このコマンドを使うと、引数に指定した設定ファイルを即時反映する。

```Bash
# .bashrcの変更を即時反映する例
$ source ~/.bashrc
```

memo

**パスを通す。ex)PATH="$PATH:~/bin" --PATHというシェル変数に現在のPATHに:~/binを追加した形で代入。

exportだけだと一時的なので.zshrcに設定したいですね。　

```Ruby
e.g. echo 'export PATH="$ANDROID_HOME/platform-tools:$PATH"' >> ~/.zshrc
```