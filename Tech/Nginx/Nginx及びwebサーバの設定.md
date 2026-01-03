---
tags:
  - nginx
  - config
  - proxy
created: 2026-01-04
status: active
---

### 実証環境

Amazon-linux2

# 本番環境でのdeployにあたって最低限必要な設定

---

1. `nginx.conf`編集
    
    nginx全体の設定を追加
    

2. `conf.d`配下にファイル作成

3. /etc/nginx/conf.d/のしたですね。
    
    アプリケーションごとの設定ファイルを作成
    

### ①世界1丁寧な本の場合の設定

ELBなし

### /etc/nginx/nginx.confファイルの中で、

```Bash
user nginx;
worker_processes auto;
# ログファイルの出力先や、pidの配置の設定(どのようなエラーが起きているのか確認したい時には、こちらを使う)
error_log /var/log/nginx/error.log;
pid /run/nginx.pid;

# Load dynamic modules. See /usr/share/doc/nginx/README.dynamic.
# アプリケーションの設定ファイルを読み込む　
include /usr/share/nginx/modules/*.conf;

events {
    worker_connections 1024;
}

http {
    log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"';

    access_log  /var/log/nginx/access.log  main;

    sendfile            on;
    tcp_nopush          on;
    tcp_nodelay         on;
    keepalive_timeout   65;
    types_hash_max_size 4096;

    include             /etc/nginx/mime.types;
    default_type        application/octet-stream;

    # Load modular configuration files from the /etc/nginx/conf.d directory.
    # See http://nginx.org/en/docs/ngx_core_module.html#include
    # for more information.
    include /etc/nginx/conf.d/*.conf;

    gzip on;
    gzip_http_version 1.0;
    gzip_proxied any;
    gzip_min_length 500;
    gzip_disable "MSIE [1-6]\.";
    gzip_types text/plain text/xml text/css
               text/comma-separated-values
               text/javascript application/x-javascript
               application/atom+xml;
}
```

### ②Railsアプリと連携できるように`conf.d`を変更する。　

まず、管理者権限を使って、新規ファイルを作成する。rails.confやアプリ名.confがよいのではないでしょうか

cf)世界1丁寧AWSより

```Bash
upstream puma {
  server unix:/var/www/<appのディレクトリ名>/tmp/sockets/puma.sock;
}

server {
  server_name  test.com;

  keepalive_timeout 0;

  access_log  /var/log/nginx/test.access.log  main;
  client_max_body_size 4G;

  root /var/www/test/public;
  location ~ .*\.(swf|SWF|ico|ICO|jar|txt|gz|js) {
    root /var/www/test/public;
    expires 15m;
    break;
  }
  location ~ ^\/fonts\/* {
    root /var/www/test/public;
    expires 15m;
    break;
  }
  location ~ ^\/assets\/* {
    root /var/www/test/public;
    break;
  }
  location ~ ^\/favicon\/* {
    root /var/www/test/public;
    break;
  }
  location = /manifest.json {
    root /var/www/test/public;
    break;
  }
  location / {
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header Host $http_host;
    proxy_redirect off;

    #auth_basic "Restricted";
    #auth_basic_user_file /etc/nginx/.htpasswd;
    #if ($http_x_forwarded_proto = "http") {
     #rewrite ^(.*) https://$server_name$1
      #break;
    #}
    proxy_pass http://puma;
  }
}
```

`upstream`

これは、先述したアプリケーションサーバのソケット(命令受付窓口のようなもの)の位置を記載しています。

ここがしっかりと記述していないと、「webサーバに命令は来ているけど、それをうまくアプリケーションサーバに引き渡せない」という事態となりますので、ここはしっかりと押さえておくようにしましょう。

# 起動について

```Bash
$ sudo  nginx
```

[🎰本番環境の構築](AWS/%E6%9C%AC%E7%95%AA%E7%92%B0%E5%A2%83%E3%81%AE%E6%A7%8B%E7%AF%89%209290dba9324649558f7faa57e50c3f3f.html)

[AWSインフラ本格入門。環境変数の在処](AWS/AWS%E3%82%A4%E3%83%B3%E3%83%95%E3%83%A9%E6%9C%AC%E6%A0%BC%E5%85%A5%E9%96%80%E3%80%82%E7%92%B0%E5%A2%83%E5%A4%89%E6%95%B0%E3%81%AE%E5%9C%A8%E5%87%A6%20b72787553a1b43429223b8676f55b3f8.html)

[https://www.notion.so/9290dba9324649558f7faa57e50c3f3f#37814607290b4f4e832357c82dee9bb3](AWS/%E6%9C%AC%E7%95%AA%E7%92%B0%E5%A2%83%E3%81%AE%E6%A7%8B%E7%AF%89%209290dba9324649558f7faa57e50c3f3f.html)

# エラーログの確認

`/etc/nginx/nginx.conf`

ファイルを除くとエラーログの吐かれる場所を設定しているはずなので、そこにアクセスして何が起こっているかみて見てください。

今回は/var/log/nginx/error.log;でした。

# Configuration

## `server_name`

ドメイン名を指定して、リクエストに対して処理するserverブロックを指定する。

リクエストが来たときに、Nginxは以下の優先順位でserverブロックを選択します：

1. **正確な名前（Exact name）:** これが最も優先されます。つまり、リクエストのホスト名がサーバーブロックの`**server_name**`ディレクティブと完全に一致する場合、そのサーバーブロックが選択されます。

2. **最長のワイルドカード名（Longest wildcard name）:** 先頭にワイルドカードがあるパターン、例えば `**.example.org**` のような形は次に優先されます。これは、ホスト名のサブドメイン部分をワイルドカードでマッチさせます。

3. **最長のワイルドカード名（Longest wildcard name）:** 末尾にワイルドカードがあるパターン、例えば `**mail.***` のような形が次に優先されます。これは、ホスト名のドメイン部分をワイルドカードでマッチさせます。

4. **最初のマッチング正規表現（First matching regular expression）:** 最後に、`**server_name**`ディレクティブが正規表現を使用していて、その正規表現がリクエストのホスト名とマッチする場合、設定ファイルで最初に出現したマッチング正規表現が選択されます。

これらのルールに従って、Nginxは入力されたリクエストに最も適したサーバーブロックを選択します。ただし、これらのルールは一部の一致を考慮しており、リクエストのホスト名が複数の`**server_name**`ディレクティブと完全に一致する場合は、設定ファイル内で最初に定義されたサーバーブロックが選択されます。

### server_name _;

: アンダースコア（_）は特殊な値で、どのドメイン名ともマッチしないという意味です。この設定は通常、デフォルトのサーバーブロックで使われます。

```Bash

server {
	listen  80 default_server;
	server_name _;
```

### `**proxy_pass**`**ディレクティブ**

リクエストを他のサーバーに転送する設定を行います。

### `location`ディレクティブ

設定したURIに応じてリクエストの処理を決定する。

指定するexpressionにあたる部分は単なる文字列でも、正規表現でもよい。

正規表現を使用する場合には

- `~ *`で大文字小文字を区別しない(i), `~`で大文字小文字を区別する正規表現を使用することを宣言します。

- `**^~**` は最初に一致した場合にはそれ以上探さないという意味です。

> “`~*`” modifier (for case-insensitive matching), or the “`~`” modifier (for case-sensitive matching).

cf.)

[

Module ngx_http_core_module

![](http://nginx.org/favicon.ico)http://nginx.org/en/docs/http/ngx_http_core_module.html#location



](http://nginx.org/en/docs/http/ngx_http_core_module.html#location)

```Bash

location <expression> {
	root /some/path;
}

e.g.)

location /{
	root /some/path;
}

//全てのリクエストは,/requestだとすると、/some/path/requestの形のファイルをサーバ内で探しにいく。
```

expressionの部分とリクエストのURLを比較して、マッチするものがあれば、`root`をリクエストで受けたパスに追加します。

🔑

expressionを指定したパターンの部分ができるだけ長いprefixが優先的にマッチされる。  
下の例のように/imagesというファイルが存在する場合に、そちらのロケーションを優先させます。

e.g.)

```Bash
server {
    location / {
        root /data/www;
    }

    location /images/ {
        root /data;
    }
}
```

## キャプチャする`$1`

locationの部分の正規表現でキャプチャした文字列を、{}のなかで使用する。

e.g.)

```Bash
location ~ ^/images/(.*)$ {
    try_files /static/images/$1 =404;
}
```

# build-in variables

cf. )

[

Alphabetical index of variables

![](http://nginx.org/favicon.ico)http://nginx.org/en/docs/varindex.html



](http://nginx.org/en/docs/varindex.html)

## `$args`

URLのクエリパラメータの部分を保持している変数。

`$query_string`も同様。

## `is_args`

> return “`?`” if a request line has arguments, or an empty string otherwise

## `$uri`

リクエストされたuriを保持している。

## `$scheme`

リクエストのスキーマを保持する。つまり、‘https’か ‘http’

## `@`を用いて名前つきブロックを作成する。

Nginxの設定ファイルにおける`**@**`記号は、名前付きlocationブロックを作成するために使用されます。名前付きlocationブロックは、通常のlocationブロックとは異なり、リクエストURIに直接マッチするものではなく、他のlocationブロックから内部的にリダイレクトされるために使用されます。

以下に、名前付きlocationブロックの例を示します：

```Plain
nginxCopy code
location / {
    try_files $uri $uri/ @backend;
}

location @backend {
    proxy_pass http://127.0.0.1:8080;
}

```

この設定では、まず`**/**`にマッチするlocationブロックがリクエストを受け取ります。その中の`**try_files**`ディレクティブは、まず`**$uri**`（リクエストされたURI）に対応するファイル、次にそのディレクトリを探します。どちらも見つからない場合、Nginxは`**@backend**`という名前付きlocationブロックに処理をリダイレクトします。

そして`**@backend**`ブロックでは、リクエストがローカルホストの8080ポートにプロキシされます。これはたとえば、バックエンドのアプリケーションサーバがそのポートで実行されている場合に便利です。

このように、名前付きlocationブロックは、条件によって異なる処理を行いたい場合や、複数のlocationブロックから同じ処理を共有したい場合などに有用です。

Regenerate response