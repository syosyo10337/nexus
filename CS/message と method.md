---
tags:
  - cs
  - oop
  - terminology
created: 2026-01-04
status: active
---

# message と method

---

同じように聞こえるこれら二つの違いについて

## 結論　

---

==オブジェクトに対して、メッセージを送り==、==オブジェクト自身がそのメッセージに一致するメソッドを持っていれば、メソッドを実行する。==という流れがあるので、

オブジェクトに対して送っているのは、厳密には**”メッセージ”**であって、

多くの場合にオブジェクトが持っているメソッドをメッセージとして送るため、短絡的にメソッドと表現されることがある。

> Most of the time, ==you send a message to a receiving object,== and t==he object executes the corresponding method==. But sometimes, there is no corresponding method. You can put anything to the right of the dot, and there’s no guarantee that the receiver will have a method that matches the message you send.

例えば、以下のようにクラスとそのインスタンスを作ったときに、

```Ruby
class Foo

	def bar
		puts "bar!!"
	end
	
end

foo = Foo.new
```

当たり前のように

```Ruby
foo.bar
```

で、Foo#barを呼び出しますね。

このとき、fooオブジェクトに対して、barというメッセージを送って、fooオブジェクトは自身の持つbarメソッドを実行する。ということなのです。