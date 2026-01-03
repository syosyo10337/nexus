---
tags:
  - typescript
  - function
created: 2026-01-03
status: active
---

# **戻り値がない関数とvoid型 (void type)**

TSでは、戻り値を持たない関数にはvoidをつけます。

JavaScriptでは、戻り値がない関数を呼び出したとき、その関数から返る値は`undefined`です。

# undefinedとvoidの違い

**戻り値がundefinedのときはreturnが必須**

```TypeScript
function fn(): undefined {
	return;
}

// こっちの方が良い。
function fn(): void {}
```

# voidはundefinedの上位型

void型へ対して、undefinedを代入することはできるが、undefined型へ対して、void型を代入することはできません。これはつまり、void型はundefined型の上位型(super type)と言うことができるでしょう。