---
tags:
  - sql
created: 2026-01-03
status: active
---

# JSONの扱い

- [https://zero-to-one.slack.com/archives/C4XULG1JN/p1726225357449039?thread_ts=1726027723.584189&cid=C4XULG1JN](https://zero-to-one.slack.com/archives/C4XULG1JN/p1726225357449039?thread_ts=1726027723.584189&cid=C4XULG1JN)

- area_cdsが配列のJSON文字列であるべきだが、Stringで登録されているケースがあるため、修正が必要。

- その他、不正なデータが登録されるパターンを特定し、データを洗い出してデータ修正を行う。

- `JSON_TYPE` [MySQL :: MySQL 8.0 リファレンスマニュアル :: 12.18.5 JSON 値属性を返す関数](https://dev.mysql.com/doc/refman/8.0/ja/json-attribute-functions.html)
    
    [![](https://labs.mysql.com/common/themes/sakila/favicon.ico)](https://labs.mysql.com/common/themes/sakila/favicon.ico)
    

- `JSON_EXTRACT`[MySQL :: MySQL 8.0 リファレンスマニュアル :: 12.18.3 JSON 値を検索する関数](https://dev.mysql.com/doc/refman/8.0/ja/json-search-functions.html)
    
    [![](https://labs.mysql.com/common/themes/sakila/favicon.ico)](https://labs.mysql.com/common/themes/sakila/favicon.ico)
    

- `JSON_UNQUOTE`/ `JSON_SET` [MySQL :: MySQL 8.0 リファレンスマニュアル :: 12.18.4 JSON 値を変更する関数](https://dev.mysql.com/doc/refman/8.0/ja/json-modification-functions.html)
    
    [![](https://labs.mysql.com/common/themes/sakila/favicon.ico)](https://labs.mysql.com/common/themes/sakila/favicon.ico)
    

- `JSON_ARRAY` /`JSON_QUOTE`[MySQL :: MySQL 8.0 リファレンスマニュアル :: 12.18.2 JSON 値を作成する関数](https://dev.mysql.com/doc/refman/8.0/ja/json-creation-functions.html)
    
    [![](https://labs.mysql.com/common/themes/sakila/favicon.ico)](https://labs.mysql.com/common/themes/sakila/favicon.ico)