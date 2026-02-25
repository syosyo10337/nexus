---
tags:
  - react
  - component
  - styling
created: 2026-01-03
status: active
---

# Props

## 特別なprops

- children props

コンポーネントの呼び出し時にJSX構造の小要素として指定したものを参照するもの。/明示的にchildrenプロップスを指定することも可能です。

- e.g.  
   Containerコンポーネント呼び出し時に子要素として定義されたものを、  
   Containerのpropsのchildrenプロパティで受けることができる。

```TypeScript
const Example = () => {
  return (
    <div>
      <Container title="Childrenとは？">
        {1}
        <Container />
    </div>
  );
};
```

💡

同様にして、あるコンポーネントをchildrenとしてpropsで渡すこともできる。つまり、親コンポーネントのJSXの中にコンポーネントの呼び出しを含めることができる。

```TypeScript
//参考 TSで書くとき
import React, { ReactNode } from "react";
import "./Container.css";

interface ContainerProps {
  title: string;
  children: ReactNode;
}

const Container: React.FC<ContainerProps> = ({ title, children }) => {
  return (
    <div className="container">
      <h3>{title}</h3>
      {children}
    </div>
  );
};

export default Container;
```

# Propsについて理解しておきたい項目

1. propsの流れは一方通行  
   親コンポーネントから呼び出し先の子コンポーネントへpropsを介して、一方通行にデータの受け渡しを行える。

2. propsは読み取り専用。つまり書き換えはできない。  
   props.nameなどpropsが持つプロパティはすべて、read-onlyつまり、再代入はできません。

### 実際のプロパティの隠し設定についてみてみる

```TypeScript
e.g.)
const desc = Reflect.getOwnPropertyDescriptor(props, "name");
console.log(desc);
//->
configurable: false
enumerable: true
value: "Tom"
writable: false
```
