---
tags:
  - rails
  - testing
  - config
created: 2026-01-03
status: active
---

# [Capistrano]append とset

---

### そもそも

deploy.rbなどcapistranoの設定ファイルで、capistranoのDSLとして用いられるメインは、以下の2つになっている。

```Ruby
set :名前, 値 #値の設定
fetch :名前 #値の参照

e.g.)
set :repo_url, 'git@github.com:mumoshu/finagle_sample_app' 
fetch :repo_url
#=> "git@github.com:mumoshu/finagle_sample_app"**
```

setで値を設定し、fetchで参照できるようになっている。

### 設定ファイルを理解する上で詰んだポイント

参考にする記事間で`:linked_dirs`と`:linkerd_filed`

部分の記述か異なる,`append`だったり`set`だったり

## docを確認

> **New in Capistrano 3.5:**  
>  for a variable that holds an Array, easily add values to it using `**append**`. This comes in especially handy for `**:linked_dirs**` and `**:linked_files**`  
>  (see Variables reference below).  
>   
> 以下雑な訳です。  
>   
> Capistrano 3.5の新機能:  
> 配列を保持する変数のために、`append`を使うことで簡単に、値を挿入できるようになります。この機能は特に、  
> `**:linked_dirs**` と`**:linked_files**`の変数で有用です。  
> (詳細については、下記の変数一覧を参照してください。)  

> Capistranoのソースコード)

```Ruby
#capistrano/lib/capistrano/configuration.rb

def append(key, *values)
      set(key, Array(fetch(key)).concat(values))
    end
```

## 結論　

配列として値を保持する変数(e.g. `:linked_dirs`)などを設定する時には、setでもできるけど、appendが便利だよ。

### 深堀り`**:linked_dirs**` と`**:linked_files**`**って？**

例よって、また公式ドキュメントをみてきました。

> - `**:linked_files**`
>     
>     - **default:** `**[]**`
>     
>     - Listed files will be symlinked from the shared folder of the application into each release directory during deployment.
>     
>     - Can be used for persistent configuration files like `**database.yml**`. See Structure for the exact directories.
>     
> 
> - `**:linked_dirs**`
>     
>     - **default:** `**[]**`
>     
>     - Listed directories will be symlinked into the release directory during deployment.
>     
>     - Can be used for persistent directories like uploads or other data. See Structure for the exact directories.
>     

えっと、つまり、ここに配列として記述されたファイル名、およびディレクトリ名のシンボリックリンク(windowsでいうショートカットみたいな、)

cf)

[

Configuration

Configuration variables can be either global or specific to your stage. Each variable can be set to a specific value: A value can be retrieved from the configuration at any time: New in Capistrano 3.5: for a variable that holds an Array, easily add values to it using append.

![](https://capistranorb.com/assets/favicon.ico)https://capistranorb.com/documentation/getting-started/configuration/

![](https://cdn.dnsimple.com/assets/resolving-with-us/logo-dark.png)](https://capistranorb.com/documentation/getting-started/configuration/)