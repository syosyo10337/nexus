---
tags:
  - javascript
  - syntax
  - async
  - promise
created_at: 2026-01-03
updated_at: 2026-02-14
status: active
---

# Promise

cf. <https://qiita.com/cheez921/items/41b744e4e002b966391a>)

## 非同期処理とは

コードの記述順に実行されない処理っていうイメージ。
**一つ前の実行に時間がかかった場合、実行完了をまたずに次の処理が行われてしまいます**

### 非同期に行われる処理の一例

```javascript
let a = 0;
console.log(a);

//この中で呼ばれているコールバック関数が非同期処理している。
seTimeout(() => {
  a = 1;
}, 2000);

console.log(a); //-> 0 なぜなら2000ms経つ前に、aを標準出力する記述であるため。
```

### `**Promise**`**には3つの状態がある**

`Promise`には、`PromiseStatus`というstatusがあり、3つのstatusがあります。

- `pending`: **未解決** (処理が終わるのを待っている状態)

- `resolved`: **解決済み** (処理が終わり、無事成功した状態)

- `rejected`: **拒否** (処理が失敗に終わってしまった状態)

### **Promiseインスタンスの作成**

```javascript
const promise = new Promise((resolve, reject) = > {});
```

Promiseの引数には関数を渡し、その関数の第一引数に`resolve`を設定し、第二引数に`reject`を任意で設定します。(`resolve`も`reject`も関数です。)

(ちなみに、上記コードにて定義した`promise`を`console.log`すると下記のような`Promiseオブジェクト`が返ってきます。

作りたてのPromiseオブジェクトなので、`PromiseStatus`は、`pendeing`ですね。)

## **resolve**させよう

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

## **reject**させよう

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
//-> rejectしたよ
```

実は、`catch`にて実行される関数がreturnした値を`resolve`します。
めちゃくちゃ簡単にいうと、`catch`はエラー返したら満足して、解決済みだ！ってするみたいです。
つまり、catchにて返された`promiseオブジェクト`の`PromiseStatus`は`resolve`になります。

## **Promise.all**と**Promise.race**

これらは、`Promise`を複数実行して、その結果に応じて次の処理に進む便利メソッドです。

## **`Promise.all`**

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

## **`Promise.allSettled`**

`Promise.allSettled()`は配列でPromiseオブジェクトを渡し、**全てが完了（fulfilled / rejected）するまで待つ**メソッドです。失敗があっても止まらず、結果はそれぞれの状態を含む配列になります。

```JavaScript
Promise.allSettled([promise1, promise2]).then((results) => {
  results.forEach((result) => {
    if (result.status === "fulfilled") {
      console.log("ok:", result.value);
    } else {
      console.log("ng:", result.reason);
    }
  });
});
```

### `Promise.all` との違い

- `Promise.all`：1つでも`rejected`なら即`rejected`
- `Promise.allSettled`：全て完了するまで待ち、`fulfilled`/`rejected`の両方の結果を返す

## **`Promise.race`**

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

## **`async`**とは

`async`は非同期関数を定義する関数宣言であり、関数の頭につけることで、`Promiseオブジェクト`を返す関数にすることができます。そのような関数を`async function`といいます。

これは、非同期処理を同期処理っぽく見せるらしい。

- async関数自体の戻り値は、Promiseオブジェクト
- 関数内で値がリターンされた場合には、`PromiseValue`として扱われる。
- もちろん、戻り値をresolveすることも忘れないresolve(return value)

### await

awaitは、Promiseオブジェクトが値を返すのを待つ演算子
