---
tags:
  - ruby
created: 2026-01-03
status: active
---

# rbenvの使い方

```Shell
#現在のディレクトリでのバージョンを確認
$ ruby -v(--versions)

#ローカルにあるrubyのバージョンを表示
$ rbenv versions 

#インストールできるバージョンのリストを表示(-Lで全てマイナーバージョンも表示できる)
$ rbenv install -l
#インストールするバージョンを指定してインストール
$ rbenv install x.x.x

#インストールしたバージョンに変更する
#(globalで指定するとシステム全体で使うバージョンの指定になる)
#変更したいディレクトリで使うバージョンを指定
$ rbenv local x.x.x

```

[

rbenv cheatsheet

Install rbenv and ruby-build git clone https://github.com/sstephenson/rbenv.git ~/.rbenv git clone https://github.com/sstephenson/ruby-build.git ~/.rbenv/plugins/ruby-build Add to ~/.bash_profile echo 'export PATH="$HOME/.rbenv/bin:$PATH"' >> ~/.bash_profile echo 'eval "$(rbenv init -)"' >> ~/.bash_profile Verify installation type rbenv # → "rbenv is a function" These are generic instructions; there may be rbenv packages available for your OS.

![](Ruby/Imported/Attachments/favicon.png)https://devhints.io/rbenv

![](Ruby/Imported/Attachments/rbenv.jpeg)](https://devhints.io/rbenv)

- もし入れたいバージョンがない場合には、rbenvが古いことが考えられるので

```Shell
#Homebrewを最新にした上で
$ brew update
#rbenvを更新
$ brew upgrade rbenv ruby-build
```