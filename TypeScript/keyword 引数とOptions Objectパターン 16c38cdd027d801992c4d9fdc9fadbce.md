 

# keyword 引数とOptions Objectパターン

JSやTSには、Pythonなどにあるキーワード引数の機能はありません。その代わりに分割代入引数を応用して同等の機能を実現している。

## **Options Objectパターン**

Options Objectパターンは複数の位置引数を受け取る代わりに、ひとつのオブジェクトを引数に受け取るように設計された関数を設計するパターンのこと。

## Options Objectパターンの利点[​](https://typescriptbook.jp/reference/functions/keyword-arguments-and-options-object-pattern#options-object%E3%83%91%E3%82%BF%E3%83%BC%E3%83%B3%E3%81%AE%E5%88%A9%E7%82%B9)

Options Objectパターンの利点は次の3つがあります。

- 引数の値が何を指すのか分かりやすい

- 引数追加時に古いコードを壊さない

- デフォルト引数が省略できる

```TypeScript
// 位置引数の関数
function normalFunc(x, y, z) {
  console.log(x, y, z);
}
 
// オブジェクトひとつだけを引数に持つ関数
function func(options) {
  console.log(options.x, options.y, options.z);
}
 
func({ x: 1, y: 2, z: 3 });


function func({ x, y, z }) {
  console.log(x, y, z);
}
```

### **Options Objectパターンの型注釈**

```TypeScript
function func({ x, y, z }): { x: number , y: number, z: number }) {
}

type Options = {
	x: number;
	y: number,
	z: number,
}
```

# Partialを使うとより、綿密な引数管理が行える。

```TypeScript
type User = {
  surname: string;
  middleName?: string;
  givenName: string;
  age: number;
  address?: string;
  nationality: string;
  createdAt: string;
  updatedAt: string;
};
 
function findUsers(
  surname?: string,
  middleName?: string,
  givenName?: string,
  age?: number,
  address?: string,
  nationality?: string
) {
  // ...
}

findUsers(undefined, undefined, undefined, 22);

type FindUsersArgs = Partial<User>;

function findUsers({
  surname,
  middleName,
  givenName,
  age,
  address,
  nationality,
}: FindUsersArgs = {}) {
  // ...
}
 
findUsers();
findUsers({ age: 22 });
```