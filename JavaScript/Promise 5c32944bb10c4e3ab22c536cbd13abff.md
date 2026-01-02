 

# Promise

---

# Promiseとは

Promiseは非同期処理をエレガントに扱うためのオブジェクト。

[

【ES6】 JavaScript初心者でもわかるPromise講座 - Qiita

Promiseって...難しくないですか？？？ 3ヶ月くらい前の私は、 Promiseをほとんど理解できてないのに async/awaitとか使っちゃってたし、様々な記事を読み漁ってもなかなか理解できず、 Promise の正体を掴むのに時間がかかってしまいました。 そんな3ヶ月くらい前の自分にも伝わるように、できる限り丁寧に Promise を説明していこうと思います。 本記事では、Promise以外のES6の書き方に関しては触れておりません。 アロー関数やテンプレート文字列などを例文で用いているため、わからない方がいましたら下記記事などを参考にしていただけると幸いです。 まずはじめに、下記コードを実行してみると、どのような結果になるでしょうか。 1番目、 2番目、 3番目...という順番で実行されることが理想的ではありますね。 しかし、実際には下記のような順序で実行されてしまいます。 JavaScriptは 非同期言語であるため、 一つ前の実行に時間がかかった場合、実行完了をまたずに次の処理が行われてしまいます 。 Promiseを日本語に翻訳すると「 約束」です。 なので、私は Promiseのことを、処理の順序に「 お約束」を取り付けることができるもの、 処理を待機することや、その結果に応じて次の処理をすることお約束するもの だと思っています。 先ほどの例で詳しく見ていきましょう。 (コードの中身は、後ほど説明していきますので、わからなくて大丈夫です！) すると、実行結果は下記のようになります。 Promise を用いることで、理想の処理を実行することができました。 それでは、より詳しく Promise をみていきましょう。 Promiseには、 PromiseStatus というstatusがあり、3つのstatusがあります。 new Promise()で作られたPromiseオブジェクトは、 pendeingという PromiseStatusで作られます。 処理が成功した時に、 PromiseStatusは resolvedに変わり, thenに書かれた処理が実行されます。 処理が失敗した時は、 PromiseStatusが rejectedに変わり、 catch に書かれた処理が実行されます。 Promiseの大まかな処理の流れはわかりましたでしょうか。 それでは実際に書いてみましょう...！ Promiseの引数には関数を渡し、その関数の第一引数に resolveを設定し、第二引数に rejectを任意で設定します。 ( resolveも reject も関数です。) ちなみに、上記コードにて定義した promiseを console.logすると下記のような Promiseオブジェクト が返ってきます。 作りたてのPromiseオブジェクトなので、 PromiseStatusは、 pendeing ですね。 sample1のコードを resolve させてみましょう。 実行結果は下記のようになります。 Promiseオブジェクトを確認してみると...

![](JavaScript/Attachments/production-c620d3e403342b1022967ba5e3db1aaa.ico)https://qiita.com/cheez921/items/41b744e4e002b966391a

![](JavaScript/Attachments/article-ogp-background-9f5428127621718a910c8b63951390ad.png)](https://qiita.com/cheez921/items/41b744e4e002b966391a)

[

とほほのPromise入門 - とほほのWWW入門

トップ >アラカルト > とほほのPromise入門目次 Promiseとは Promise は、JavaScript や Node.js において、非同期処理のコールバック関数をエレガントに記述するための仕組みです。英語の promise は、「制約」、「保障」などの意味を持ちます。Promise は、Chrome 63, Firefox 58, Safari 11.1, Edge 18, Node.js 4.* から利用可能です。IE11 ではサポートされていません。 コールバック地獄 JavaScript や Node.js では、ブロックする(処理が終わるまで待ち合わせる)関数よりも、非同期関数(処理の完了を待たず、処理が完了した時点でコールバック関数が呼び出される)の方が多様されます。ここで、例えば、膨大な演算(実は単に元の数を2倍するだけ)を行う非同期関数 aFunc1() があるとします。下記は、100の2倍を求める非同期関数の使用例です。 // 引数を2倍にする非同期関数 function aFunc1(data, callback) { setTimeout(function() { callback(data * 2); }, Math.random() * 1000); } function sample_callback() {

![](JavaScript/Attachments/favicon.ico)https://www.tohoho-web.com/ex/promise.html



](https://www.tohoho-web.com/ex/promise.html)

[Promiseとは](#4bea3dff-97fb-4db4-a74c-997cc0ceb0a9)

[非同期処理とは](#2a18f2e3-4623-4fa1-bd4b-c372ede4743a)

[==//非同期に行われる処理の一例==](#373058de-7070-41ae-84d9-ed6b82669c12)

[`**Promise**`**には3つの状態がある**](#090d122e-c934-438b-b31d-1cf092dd2ac5)

[**Promiseインスタンスの作成**](#e07e6b9e-ce1c-44b0-a651-68c5dbb550c5)

[`****resolve****`****させよう****](#b87e47a3-c89a-4fb5-a459-362fcf134081)

[`****reject****`****させよう****](#43e56256-855e-484c-990b-6e9a154616de)

[`**Promise.all**`**と**`**Promise.race**`](#e304b2bb-2937-4aca-940f-db708f56c436)

[`**Promise.all**`](#81b10b14-76ff-4922-b889-a815314742b8)

[`**Promise.race**`](#350299f9-bcfc-4e1f-a0ef-b712341db564)

[`**async**`**とは**](#04923cfe-0ce6-4657-abb5-4be56476513d)

[await](#3021abcb-3d9b-4b3f-bb1e-e7496c3a22e5)

## 非同期処理とは

コードの記述順に実行されない処理っていうイメージ。

**一つ前の実行に時間がかかった場合、実行完了をまたずに次の処理が行われてしまいます**  

### ==//非同期に行われる処理の一例==

```JavaScript
let a = 0;
console.log(a);

//この中で呼ばれているコールバック関数が非同期処理している。
seTimeout(() => {
	a = 1;
}, 2000);

console.log(a);　//-> 0 なぜなら2000ms経つ前に、aを標準出力する
								//記述であるため。
```

### `**Promise**`**には3つの状態がある**

`Promise`には、`PromiseStatus`というstatusがあり、3つのstatusがあります。

- `pending`: **未解決** (処理が終わるのを待っている状態)

- `resolved`: **解決済み** (処理が終わり、無事成功した状態)

- `rejected`: **拒否** (処理が失敗に終わってしまった状態)

### **Promiseインスタンスの作成**

```JavaScript
const promise = new Promise((resolve, reject) = > {});
```

Promiseの引数には関数を渡し、その関数の第一引数に`resolve`を設定し、第二引数に`reject`を任意で設定します。(`resolve`も`reject`も関数です。)

(ちなみに、上記コードにて定義した`promise`を`console.log`すると下記のような`Promiseオブジェクト`が返ってきます。

作りたてのPromiseオブジェクトなので、`PromiseStatus`は、`pendeing`ですね。)

## `****resolve****`****させよう****

```JavaScript
// rejectは今回使わないため、引数から削除
const promise = new Promise((resolve) => {
  resolve();
}).then(() => {
  console.log("resolveしたよ");
});
```

`resolve()`を呼び出すことで、`PromiseStatus`は`resolved`に変わり,`then`の処理が走ってることがわかりますね。

- `resolve`関数は、引数を受け取ることができ、次に呼ばれるメソッド(then)の第一引数にそのまま、引数を渡してあげることができます。PromiseStatusを変えながら。

## `****reject****`****させよう****

```JavaScript
const promise = new Promise((resolve, reject) => {
  reject();
})
  .then(() => {
    console.log("resolveしたよ");
  })
  .catch(() => {
    console.log("rejectしたよ");
  });
// rejectしたよ
```

実は、`catch`にて実行される関数がreturnした値を`resolve`します。

めちゃくちゃ簡単にいうと、`catch`はエラー返したら満足して、解決済みだ！ってするみたいです。

つまり、catchにて返された`promiseオブジェクト`の`PromiseStatus`は`resolve`になります。

## `**Promise.all**`**と**`**Promise.race**`

これらは、`Promise`を複数実行して、その結果に応じて次の処理に進む便利メソッドです。

## `**Promise.all**`

`Promise.all()`は配列でPromiseオブジェクトを渡し（受け取り？）、全てのPromiseオブジェクトが`resolved`になったら次の処理に進みます。

```JavaScript
const promise1 = new Promise((resolve) => {
  setTimeout(() => {
    resolve();
  }, 1000);
}).then(() => {
  console.log("promise1おわったよ！");
});

const promise2 = new Promise((resolve) => {
  setTimeout(() => {
    resolve();
  }, 3000);
}).then(() => {
  console.log("promise2おわったよ！");
});

Promise.all([promise1, promise2]).then(() => {
  console.log("全部おわったよ！");
});
```

```JavaScript
promise1おわったよ！
promise2おわったよ！
全部おわったよ！
```

## `**Promise.race**`

`Promise.race()`は`Promise.all()`と同じく配列でPromiseオブジェクトを渡し、どれか1つのPromiseオブジェクトが`resolved`になったら次に進みます。

```JavaScript
const promise1 = new Promise((resolve) => {
  setTimeout(() => {
    resolve();
  }, 1000);
}).then(() => {
  console.log("promise1おわったよ！");
});

const promise2 = new Promise((resolve) => {
  setTimeout(() => {
    resolve();
  }, 3000);
}).then(() => {
  console.log("promise2おわったよ！");
});

Promise.race([promise1, promise2]).then(() => {
  console.log("どれか一つおわったよ！");
});
```

```JavaScript
promise1おわったよ！
どれか一つおわったよ！
promise2おわったよ！
```

# `**async**`**とは**

`async`は非同期関数を定義する関数宣言であり、関数の頭につけることで、`Promiseオブジェクト`を返す関数にすることができます。そのような関数を`async function`といいます。

これは、非同期処理を同期処理っぽく見せるらしい。

- async関数自体の戻り値は、Promiseオブジェクト

- 関数内で値がリターンされた場合には、`PromiseValue`として扱われる。

- もちろん、戻り値をresolveすることも忘れないresolve(return value)

### await

awaitは、Promiseオブジェクトが値を返すのを待つ演算子