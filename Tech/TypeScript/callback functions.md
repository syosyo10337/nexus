---
tags:
  - typescript
  - function
  - async
created: 2026-01-03
status: active
---

# callback functions

そもそもコールバック関数って？

関数の引数として渡される関数のこと。

コールバック関数という言語レベルの構文が存在する訳ではなく、設計パターンのひとつとしてコールバック関数と呼ばれています。

- 振る舞いの制御

- 非同期な結果の受け取りに使うことができる。

ただ、これによってコールバック関数地獄が発生するようになったので、

コールバック地獄(Callback hell)の問題を解消するために、Promiseが登場して以降は非同期処理の結果を取得する場合には、コールバック関数を用いずにPromiseを利用することが一般的になっています。

```TypeScript
import { promises as fs } from "fs";
 
fs.readFile("a.txt", "utf-8")
  .then((data) => fs.readFile(data, "utf-8"))
  .then((data) => fs.readFile(data, "utf-8"))
  .then((data) => console.log(data));
```