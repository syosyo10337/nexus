 

# optional parameter/default parameter

# optional parameter

```TypeScript
function 関数名(引数名?: 型) {}
```

## 省略すると`undefined`になる[​](https://typescriptbook.jp/reference/functions/optional-parameters#%E7%9C%81%E7%95%A5%E3%81%99%E3%82%8B%E3%81%A8undefined%E3%81%AB%E3%81%AA%E3%82%8B)

オプション引数の型は、型と`undefined`の[ユニオン型](https://typescriptbook.jp/reference/values-types-variables/union)になります。ユニオン型は日本語で言うと「いずれか」の意味です。上の例では、引数`person`は`string | undefined`型になります。

引数を省略した場合、引数の型は 型 | undefinedのユニオン型になり、

引数を省略した場合、オプション引数の実行時の値は`undefined`になります。

## `**T | undefined**`

型としては上記になりますが、なぜわざわざoptional parameterの記法が存在するのか？

それは、引数の省略ができるかどうか？という違いがあるから。もし仮にunion型の`**T | undefined**`

を引数に取る関数を作成しても、この時引数の省略はできません。

引数の記法の順序として、オプション引数は最後に書きます。

# default parameter

```TypeScript
// 関数宣言
function 関数名(引数: 型 = デフォルト値) {}
// アロー関数
(引数: 型 = デフォルト値) => {};
```

引数の途中だけ指定することもできる/ 初期化処理もかけます。/非同期処理はかけません。

```TypeScript
function foo(x, y = 2, z) {}
function foo(x = parseInt("1.5")) {}
```