---
tags:
  - rails
created: 2026-01-03
status: active
---

# リモート上での設定をCapistranoに対応させる。

---

capistarnoのディレクトリ構造についての理解を、まずは深めましょう。

[リモート上でのディレクトリ構成](../Capistrano%2048f514151b3b498798ab0f9b190eca84.html)

## 症状

```Bash
$ bundle exec cap production deploy:check
```

は問題ないが、リモート上でのディレクトリ構成が、Capistranoのsharedなどのファイル生成等で、うまくリンクが貼れていない可能性がある。

## 対応

- puma

- nginx

- 鍵情報

についての復習と、適宜設定を変更させること。

## 鍵について

---

デプロイ先にてmaster.keyは渡していましたので、cpする形でshared/ディレクトリに移動したところ動作しました。

これによって、rails sで起動ができました。

### Nginx

---

Nginxもdeploy.rbの設定にて、コピペで設定した部分がうまく動作しているみたいです。もし、内容を確認したいのであれば、

リモートのサーバ上での

nginx本体の設定については

- /etc/nginx/nginx.conf

railsとの噛み合わせについては　

- /etc/nginx/conf.d/<アプリ名とかrailsとか>.conf

を参照してください

参考)

[![](nginx-1.svg)Nginx及びwebサーバの設定](../Nginx%E5%8F%8A%E3%81%B3web%E3%82%B5%E3%83%BC%E3%83%90%E3%81%AE%E8%A8%AD%E5%AE%9A%20247c33005a62407c83cd79be643ec31c.html)

実際には、sharedなど、capistranoの影響に合わせていくつか、設定を修正しています。

```Bash
# /etc/nginx/conf.d/rails.conf

upstream puma {
	server unix:///var//www/recorda-me/current/tmp/sockets/puma.sock;
}

server {
	listen 3000 default_server;
	listen [::]:3000 default_server;
	server_name puma;
	
	access_log /var/www/recorda-me/current/log/nginx.access.log;
	error_log /var/www/recorda-me/current/log/nginx.error.log;

	location ^~ /assets/ {
		gzip_static on;
		expires max;
    		add_header Cache-Control public;
		root /var/www/recorda-me/current/public/;
	
	}

	location / {
		proxy_read_timeout 300;
		proxy_connect_timeout 300;
		proxy_redirect off;
		proxy_set_header Host $host;
		proxy_set_header X-Forwarded-Proto $http_x_forwarded_proto;
		proxy_set_header X-Forwarded_For $proxy_add_x_forwarded_for;

		proxy_pass http://puma;
	}
}
```