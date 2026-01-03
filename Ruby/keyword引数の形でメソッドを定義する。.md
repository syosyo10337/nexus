---
tags:
  - ruby
  - syntax
created: 2026-01-03
status: active
---

# keyword引数の形でメソッドを定義する。

以下のような `arugument:`の形で関数が定義されている場合。

```Ruby
def youAreSuch(bad_word:)
	puts bad_word
end
```

呼び出せる方法は以下の一つである。

```Ruby
youAreSuch bad_word: 'an asshole'
(もしくは、youAreSuch(bad_word: 'an asshole'))
```

以下のような記述は

`ArgumentError: wrong number of arguments (given 1, expected 0; required keyword: id)`

を吐き出します。

```Ruby
youAreSuch 'asshole'
```

### つまり、

`def method key_arg: ;end`の記法で書かれた場合には、メソッドの呼び出し時に、明示的に引数名を指定しながら呼び出す必要がある。この時に仮に引数の個数が同じでもエラーになるため、

効用としては、

呼び出しがわにメソッドの定義、引数について強く意識させるということができる。