---
tags:
  - computer-science
  - algorithm
  - data-structure
  - oop
created: 2026-01-04
status: active
---

# Big O Notation

---

# 概要

コードのパフォーマンス。計算量を数値で表現するための表記

# What is Big O Notation?

メモリ消費や、実行時間についての計算量を正確性ではなく、general trendsにのみ注目して表現する(linear quadratic constant)

例としては、O(1)/O(n)/(n^2)などが挙げられる。

# time complexity

時間計算量。あるアルゴリズムを実行する際に、どれだけ時間がかかるのかを測る指標。Big O Notationが用いられる

# space complexity

空間計算量。あるアルゴリズムを実行する際に、どれだけのメモリを消費するかと測る指標。Big O Notationが用いられる

### auxiliary space complexity

入力値のspace(メモリー消費)を除いたあるアルゴリズムの計算に必要なメモリ消費のこと。

Space in JS

- Most primitives(booleans, numbers, undefined, null) are constant space

つまり、数値が1でも、1000でもメモリ容量は同じということ。

- Strings require O(n) space(where n is the string length)

- Reference types are generally O(n), where n is the length(for arrays) or the number of keys(for objects)  
    つまり、参照型(オブジェクト型)の場合も同様にして配列の長さやオブジェクトのkeyの数によってとりうるメモリが変わるよ。

```JavaScript
// Space Complextityについての例
//e.g.1)
function sum(arr) {
// one number分のメモリスペース
	let total = 0;
// one number分のメモリスペース
	for (let i = 0; i < arr.length; i ++) {
		total += arr[i];
	}
	return total;
}

//-> therefore O(1) space
```

```JavaScript
// Space Complextityについての例
//e.g.2)
function double(arr) {
	let newArr = [];
	for (let i = 0; i < arr.length; i++) {
		newArr.push(2 * arr[i]);
	}
	return newArr;
}

//-> O(n) space
```

## Logarithm(対数)表現を用いたBig O Notation

searching algorithmsと、some Efficient Sorting algorithms 　はlogarithim time complexityを持つ。

Recursion sometimes involves logarithmic space complexity