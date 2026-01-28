---
tags:
  - typescript
  - type-system
  - function
  - data-structure
created: 2026-01-03
status: active
---

# Intersection type

考え方はユニオン型と相対するものです。ユニオン型が**どれか**を意味するなら**インターセクション型はどれもです**。言い換えるとオブジェクトの定義を合成させることを指します。

```TypeScript
type TwoDimensionalPoint = {
  x: number;
  y: number;
};
 
type Z = {
  z: number;
};
 
type ThreeDimensionalPoint = TwoDimensionalPoint & Z;
 
const p: ThreeDimensionalPoint = {
  x: 0,
  y: 1,
  z: 2,
};
```

## プリミティブ型のインターセクション型

neverという型になるそうな。

```TypeScript
type Never = string & number;
 
const n: Never = "2";
```

## インターセクションを使いこなす

Required<T> Partial<T>は後々出てきますので。

```TypeScript
type Parameter = {
  id: string;
  index?: number;
  active: boolean;
  balance: number;
  photo?: string;
  age?: number;
  surname: string;
  givenName: string;
  company?: string;
  email: string;
  phoneNumber?: string;
  address?: string;
  // ...
};


type Mandatory = Required<{
  id: string;
  active: boolean;
  balance: number;
  surname: string;
  givenName: string;
  email: string;
}>;
 
type Optional = Partial<{
  index: number;
  photo: string;
  age: number;
  company: string;
  phoneNumber: string;
  address: string;
}>;

type Parameter = Mandatory & Optional;
```
