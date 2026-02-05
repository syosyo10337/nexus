---
tags:
	- computer-science
	- oop
	- programming
	- scala
created: 2026-02-06
status: active
---

# 菱形継承（ダイヤモンド問題）

菱形継承（Diamond Inheritance）は、ある基底クラスを共通の祖先として複数の派生クラスが存在し、さらにそれらをまた別のクラスが継承するときに起きる曖昧さの問題です。典型的には「同名メソッドをどの実装として解釈すべきか」が分からなくなります。

例えば、`Base` を継承した `Left` と `Right` が同じメソッドをオーバーライドし、`Final` が `Left` と `Right` を両方継承する場合、`Final` から見た `Base` の実装がどれになるべきかが問題になります。

## Scalaでの例（traitの線形化で解決）

Scalaでは、`trait` の合成順序を線形化（linearization）として決め、右側のtraitほど優先度が高くなります。これにより、曖昧さが解消されます。

```scala
trait Base {
 def name: String = "Base"
}

trait Left extends Base {
 override def name: String = "Left -> " + super.name
}

trait Right extends Base {
 override def name: String = "Right -> " + super.name
}

class Final extends Left with Right

val f = new Final
println(f.name) // Right -> Left -> Base
```

この例では、`Final` の継承順は `Left with Right` です。Scalaでは右側の `Right` が先に呼ばれ、その `super` は左側の `Left` に解決され、最終的に `Base` へとつながります。

## ポイント

- 菱形継承の本質は「同じ祖先の実装が複数経路で現れる」ことによる曖昧さ
- Scalaではtraitの線形化で呼び出し順序を決定し、曖昧さを避ける
- もし意図した順序があるなら、`with` の並び順を明示的に設計する
