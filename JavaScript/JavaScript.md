---
tags:
  - javascript
  - syntax
created: 2026-01-04
status: active
---

![](Import%20tech/Attachments/javascript-original.svg)

# JavaScript

シングルプロセス、シングルスレッドの言語です。

---

[基本のき](JavaScript/%E5%9F%BA%E6%9C%AC%E3%81%AE%E3%81%8D%20c54d1348a2cb417a9b00a0c732bf2191.html)

[データ型](JavaScript/%E3%83%87%E3%83%BC%E3%82%BF%E5%9E%8B%20bebe6c7a12d441b2ae8c0ddf48294057.html)

[変数](JavaScript/%E5%A4%89%E6%95%B0%2003bffb2c43d3445aab4add1c946fb968.html)

[変数のスコープ](JavaScript/%E5%A4%89%E6%95%B0%E3%81%AE%E3%82%B9%E3%82%B3%E3%83%BC%E3%83%97%208274ae915d6748fbb4863b2321964368.html)

[イベント](JavaScript/%E3%82%A4%E3%83%99%E3%83%B3%E3%83%88%20687cad174bc84673aab494338bd3e9ca.html)

[ループ処理](JavaScript/%E3%83%AB%E3%83%BC%E3%83%97%E5%87%A6%E7%90%86%20c7d26ce1fe504d0884820866be2cabd7.html)

[Documentオブジェクト](JavaScript/Document%E3%82%AA%E3%83%96%E3%82%B8%E3%82%A7%E3%82%AF%E3%83%88%20040bd3e35e2d4f5dbdf8c24a7ca284ac.html)

[Promise](JavaScript/Promise%205c32944bb10c4e3ab22c536cbd13abff.html)

[JSON](JavaScript/JSON%2077216dac8b764f01a07e61888561e9a7.html)

[access motifier](JavaScript/access%20motifier%2012b38cdd027d80d2903df3b1a6be666e.html)

[配列の操作](JavaScript/%E9%85%8D%E5%88%97%E3%81%AE%E6%93%8D%E4%BD%9C%2017538cdd027d80c4a4f3ed2ae68b7d71.html)

[例外処理](JavaScript/%E4%BE%8B%E5%A4%96%E5%87%A6%E7%90%86%2021d38cdd027d80c6b9f0cbd4f9dfe446.html)

# String型のメソッド

toUpperCase();

toLowerCase();

```Ruby
let cityName = "California";
 
 console.log(cityName.toUpperCase());
 console.log(cityName.toLowerCase());
```

substring関数

`str.substring(indexStart[, indexEnd])`

インデックスを指定して、該当する範囲の文字列を切り出す

第一引数だけを取る文字列のindexStartから最後までを取得する。

[![](JavaScript/Screen_Shot_2022-11-12_at_13.56.51.png)](JavaScript/Screen_Shot_2022-11-12_at_13.56.51.png)

インデックスの理解の仕方、頭についてる目印であると考えると、　

[0]→ ”a”

[2] → “c”

また、2個というと [0]”a” [1] “b” [2]なので、

“ab”

JSでsubstringでインデックスを終わりを指定する際にはこれを理解すること。

つまり

```JavaScript
"abcdef".substring(2,5) // "cde"


//これを長さ、文字の個数で考えると、

"abcdfe".substring(
```

find関数

JavaScriptで言うとindexOf

[testとmatchメソッド](JavaScript/test%E3%81%A8match%E3%83%A1%E3%82%BD%E3%83%83%E3%83%89%20ea930b2cbfa1414392acf03149361afb.html)

[Someメソッド](JavaScript/Some%E3%83%A1%E3%82%BD%E3%83%83%E3%83%89%201bd5266e70f0470f91ea6e5ef405618e.html)

[式文(expression statement)](JavaScript/%E5%BC%8F%E6%96%87\(expression%20statement\)%201cf38cdd027d80aa9588e135b90875ac.html)

[FileとBlobの違い](JavaScript/File%E3%81%A8Blob%E3%81%AE%E9%81%95%E3%81%84%2025e38cdd027d8020bff3c2d33aa43313.html)

[Intersedction API](JavaScript/Intersedction%20API%2029538cdd027d8069b023feae967c0e51.html)

[Object.fromEntries()](JavaScript/Object%20fromEntries\(\)%202b938cdd027d804d9216eb986482289c.html)