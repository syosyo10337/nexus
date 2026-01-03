---
tags:
  - javascript
  - data
created: 2026-01-03
status: active
---

# JSON

---

JavaScript Object Notationのこと

JavaScriptのデータ定義文をベースとした、簡易的なデータ定義言語。

- 噛み砕いていうと、JavaScriptのオブジェクトっぽい書き型を使ったデータの表し方、記述方法のこと。(他にはXMLなどで代用することも技術的には可能)

- 拡張子には.jsonを用いる。また、通常のjsonファイルだとコメントを記述することができないが、.jsoncの拡張子にすることで//のコメントを記述することができるようになる。

- (JavaScriptと異なる点)==JSのオブジェクトを記述する際の、keyには、””は必要ないが,== JSONの場合には””(”ダブル”クォーテーション)である必要がある。

- また、valueとして設定できる値は、数値、文字列、配列、オブジェクトになる。(文字列をvalueに設定する際にはこちらも””である必要があります。)

- **配列、オブジェクトの末尾に、エクストラで(,)があることが許されません。**

## JSのオブジェクトをjson形式に変換する

```JavaScript
// オブジェクトや配列をJSON形式に変換するメソッド
// (具体的には、""付きの文字列に変更してくれる)
JSON.stringify(オブジェクトor配列)

//JSON形式で受け取った文字列をJavaScriptで認識できる形に変更する。
JSON.parse(JSON形式のデータ)

e.g.)
const usersDataString = JSON.stringify(usersData);
console.log(usersDataString);
//->[{"id":1,"username":"hoge太郎","age":20,"hobbies":["soccer"],"premiumAccount":true},
//{"id":2,"username":"fuga太郎","age":17,"hobbies":["カメラ"],"premiumAccount":false},
//{"id":3,"username":"piyo太郎","age":20,"hobbies":["筋トレ"],"premiumAccount":true}]

console.log(typeof usersDataString === 'string');
//JSON形式にしたことで、JavaScript的には、あくまで文字列を扱っている。

console.log(JSON.parse(usersDataString));
//サーバーなどから受け取った値をJSON.parseによって,オブジェクトの形に変換している。
```