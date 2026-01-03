 

# Someメソッド

配列の中に一つでもある条件を満たす要素があるかを調べることができる。

filterメソッドと同時に使うことで、いくつかの要素のうち一つでも満たす場合には、その配列は取得するというような操作ができる。(２次元配列)

```JavaScript
const people = [
	'masa': {
		age: 26,
		gender: 'male'
  },
  'kuya': {
		age: 27,
		gender: 'male',
	},
};

// この時
people.filter(person => person.some(ele => ele.age < 27));
```

cf. )

[

Array.prototype.some() - JavaScript | MDN

some() メソッドは、指定された関数で実装されているテストに、配列の中の少なくとも 1 つの要素が 合格するかどうかを判定します。配列の中で指定された関数が true を返す要素を見つけた場合は true を返し、そうでない場合は false を返します。それ以外の場合は false を返します。配列は変更しません。

![](https://developer.mozilla.org/favicon-48x48.cbbd161b.png)https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Array/some

![](https://developer.mozilla.org/mdn-social-share.cd6c4a5a.png)](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Array/some)