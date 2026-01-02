 

# functions

[https://go.dev/blog/declaration-syntax](https://go.dev/blog/declaration-syntax)

```Go

func add(x int, y int) int {
	return x + y
}

// 型が同じ場合は省略できるんだってさ
func add(x, y int) int {
	return x + y
}
```

# multiple-results

複数の戻り値を返すことができるよ

```Go
func swap(x, y string) (string, string) {
	return y, x
}
```

# **Named return values**

Goでの戻り値となる変数に名前をつける( _named return value_ )ことができます。戻り値に名前をつけると、関数の最初で定義した変数名として扱われます。

この戻り値の名前は、戻り値の意味を示す名前とすることで、関数のドキュメントとして表現するようにしましょう。

名前をつけた戻り値の変数を使うと、 `return` ステートメントに何も書かずに戻すことができます。これを "naked" return と呼びます。

💡

例のコードのように、naked returnステートメントは、短い関数でのみ利用すべきです。長い関数で使うと読みやすさ( _readability_ )に悪影響があります。

```Go
func split(sum int) (x, y int) {
	x = sum * 4 / 9
	y = sum - x
	return
}
```