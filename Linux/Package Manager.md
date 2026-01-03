Package  Manager(パッケージ管理システム)-----------

**パッケージ --実行ファイルや設定ファイル、ライブラリなどをまとめた一つのファイル

**パッケージ管理システム --パッケージをまとめて管理するもの。
ex) mac → homebrew 
	linux →RPM(Redhat Package Manager)


*使い方 
-linuxなら、yumコマンド(依存性の解決もしてくれる)
-macOSなら brewコマンド
ref)  rbenv — Rubyの複数バージョンを管理するもの



## パッケージの操作(Linux/yum)

#パッケージをインストールする
$ yum install パッケージ名
#確認プロンプトに全てyesと答えるオプション
$ yum install  -y パッケージ名

#パッケージを削除する。(yumが依存性のあるパッケージも同時に削除してくれる)
$ yum remove パッケージ名

#パッケージを探す(summaryのみが検索対象)
$ yum search パッケージ名 

#パッケージの詳細情報を表示
$ yum info パッケージ名

---------


## Homebrewのコマンド一例
#パッケージをインストール
$ brew install <パッケージ名>

#インストールされているパッケージ一覧
$ brew list

#更新可能なパッケージの一覧を表示
$ brew outdated

#パッケージの情報を表示
$ brew info パッケージ名

#パッケージをアンインストール
$ brew remove <パッケージ名>

# すべてのパッケージをアップグレード
$ brew upgrade

# 個別のパッケージをアップグレード
$ brew upgrade <パッケージ名>

#Homebrewの更新
$ brew update

--------


apt-get update -qq
-q  はquickモード。進捗状況を表示しません。

apt-get clean
を実行すると，/var/cache/apt以下のファイルを(ロックファイルを除いて)削除してくれます

https://parashuto.com/rriver/tools/updating-node-js-and-npm

