 

# `Map<K, V>` マップを作成する

```TypeScript
const map = new Map<string, number>();
map.set("a", 1);
console.log(map.get("a"));

const m// タイムラインitemの種類と対応するコンポーネントをまとめたmap
const componentMap = {
[TimelineResponseBody.TypeEnum.OptionalEntryCommunityCreated]: TypeCommunityCreated,
[TimelineResponseBody.TypeEnum.CommunityMemberCreated]: TypeMemberJoined,
[TimelineResponseBody.TypeEnum.CommunityTopicCreated]: TypeTopicCreated,
[TimelineResponseBody.TypeEnum.CommunityCommentCreated]: TypeCommentCreated,
// [TimelineResponseBody.TypeEnum.CommunityReplyCreated]: TypeReplyCreated,
} as const
ap = new Map([
  ["a", 1],
  ["b", 2],
  ["c", 3],
]);
```

## Mapのキーは厳密等価で判定される[​](https://typescriptbook.jp/reference/builtin-api/map#map%E3%81%AE%E3%82%AD%E3%83%BC%E3%81%AF%E5%8E%B3%E5%AF%86%E7%AD%89%E4%BE%A1%E3%81%A7%E5%88%A4%E5%AE%9A%E3%81%95%E3%82%8C%E3%82%8B)

`NaN`同士は厳密等価ではありませんが、例外的に同じキーとみなされます。

```TypeScript
// JavaScript
 
console.log(NaN === NaN); //-> false


const map = new Map<number, number>();
map.set(NaN, 1);
map.set(NaN, 2);
console.log(map);
Map (1) {NaN => 2} //上書きさせている。
```

Mapの操作

- set(key, value)

- get(key)

- delete(key): boolean

- has(key): boolean

💡

存在確認からの要素取得

hasでチェックしたとしても型ガードはできていないので、

```TypeScript
const map = new Map([["a", 1]]);
const n = map.get("a");
if (typeof n === "number") {
  n * 2;
}
```

- size(): number

- clear()

- keys()

- values()

- entries()

```TypeScript
const map = new Map([
  ["a", 1],
  ["b", 2],
  ["c", 3],
]);
 
for (const [key, value] of map) {
  console.log(key, value);
  // "a", 1
  // "b", 2
  // "c", 3 の順で出力される
}
```

- 複製する。shallow copyを作るには、オブジェクトをそのままコンストラクタに渡せば良い。

```TypeScript
const map1 = new Map([["a", 1]]);
const map2 = new Map(map1);
console.log(map2);
```

## Map → JSON

```TypeScript
const map = new Map([
  ["a", 1],
  ["b", 2],
  ["c", 3],
]);
const obj = Object.fromEntries(map);
console.log(JSON.stringify(obj));
```

## Map → 配列

`Map<K, V>`にスプレッド構文を使うと、タプル型配列`[K, V][]`が得られます。

```TypeScript
const map = new Map([
  ["a", 1],
  ["b", 2],
  ["c", 3],
]);
const keyValues = [...map];
console.log(keyValues);
```

## Map → オブジェクト

```TypeScript
const map = new Map([
  ["a", 1],
  ["b", 2],
  ["c", 3],
]);
const obj = Object.fromEntries(map);
console.log(obj);
```