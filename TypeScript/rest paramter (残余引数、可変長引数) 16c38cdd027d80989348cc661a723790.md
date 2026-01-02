 

# rest paramter (残余引数、可変長引数)

## 残余引数の型注釈[​](https://typescriptbook.jp/reference/functions/rest-parameters#%E6%AE%8B%E4%BD%99%E5%BC%95%E6%95%B0%E3%81%AE%E5%9E%8B%E6%B3%A8%E9%87%88)

配列の型を書きます。たとえば、残余引数がnumber型なら、`number[]`のように書きます。

```Plain
function func(...params: number[]) {

```