---
tags:
  - react
  - hooks
  - component
  - state
created: 2026-01-03
status: active
---

# Stateとコンポーネント

コンポーネントごとにステートをもちますが、ツリー構造上同一である場合には、Reactはステートを引き継ぐ。

もし、ツリー構造上は同一だが、異なるステートを管理したい場合にはkey属性を設定するよ。

[こちら](State%E3%81%A8%E3%82%B3%E3%83%B3%E3%83%9D%E3%83%BC%E3%83%8D%E3%83%B3%E3%83%88%2017538cdd027d809c8d97edcec5e9b562.html)の2参照

# Stateのprops渡し

- コンポーネントが消滅してしまう可能性がある時。（消したくない）

- 特定のstateを複数小コンポーネントで共有したい時。

# ユースケース別ステート管理早引き

1. stateを共有して属性を切り替えたい->同一ツリー位置に条件分岐で置き換える。  
    色だけ変えたい時とかだね。

2. stateを独立させて、stateは切り替え毎に初期化 -> key属性をつけて、一意に識別

3. stateを独立させつつ、stateも保持し続けたい。 -> 親コンポにstateをそれぞれ用意。propsを使って、子コンポへstateをわたす。

```TypeScript
const Example = () => {
  const [toggle, setToggle]  = useState(true;
  const toggleComponent = () => {
    setToggle(prev =>  !prev);
  }
  return (
    <>
    <button onClick={toggleComponent}>切り替え</button>
    { toggle ? <Count title="A"/> : <Count title="B"/>}
    </>
  )

}
const Count = ({title}) => {
  const [count, setCount] = useState(0);
  const countUp = () => {
    setCount((prevstate) => prevstate + 1);
  };
  const countDown = () => {
    setCount(count - 1);
  };
  return (
    <>
      <h3>{title}: {count}</h3>
      <button onClick={countUp}>+</button>
      <button onClick={countDown}>-</button>
    </>
  );
};

export default Example;

```

```TypeScript
e.g.)
import { useState } from "react";

const Example = () => {
  const [ toggle, setToggle ] = useState(true);
  const [countA, setCountA] = useState(0); //Count(子コンポ)用のstate
  const [countB, setCountB] = useState(0); //Count(子コンポ)用のstate
  const toggleComponent = () => {
    setToggle(prev => !prev);
  }
  return (
    <>
    <button onClick={toggleComponent}>toggle</button>
    { toggle ?
    <Count key="A" title="A" count={countA} setCount={setCountA}/>  //propsとして、Countコンポへ渡している。
    : <Count key="B" title="B" count={countB} setCount={setCountB}/>
    }
    </>
  )
}


//これによって、Countコンポの中では、 setCountというと、setCountBやら、SetCountAなどの事前に親コンポで設定されたuseStateの更新関数を指すようになる。
const Count = ({ title, count, setCount }) => {
  const countUp = () => {
    setCount((prevstate) => prevstate + 1);
  };
  const countDown = () => {
    setCount(count - 1);
  };
  return (
    <>
      <h3>{title}: {count}</h3>
      <button onClick={countUp}>+</button>
      <button onClick={countDown}>-</button>
    </>
  );
};

```