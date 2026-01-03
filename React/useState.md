---
tags:
  - react
  - hooks
  - component
  - state
created: 2026-01-03
status: active
---

# useState

[基本用法](#17438cdd-027d-806f-a8c8-dcb8851da4f6)

[直前のStateの値を参照する](#17438cdd-027d-800a-b194-dac3b6d56daa)

[使用上の注意点](#17438cdd-027d-8034-bfd8-cb2e54eaec13)

[呼び出す位置について](#17438cdd-027d-80a7-87b2-dae125ead722)

[即時更新ではない!?](#2a1f548f-5b72-4403-969c-3a24f90781d3)

[オブジェクトのstateを扱う](#17538cdd-027d-8034-9871-db76f63d0268)

[新しいオブジェクトを渡す必要がある。](#19162ec0-1704-40a2-9a00-154676113c56)

[配列のステートを扱う](#17538cdd-027d-8042-8eaf-de7df3d93d34)

Reactの関数の一つ。ユーザの入力値に応じて、リアルタイムで出力の値を再生成することができる。

# 基本用法

---

- このメソッドの返り値は、2つ要素を持つ配列となっています。  
    その中身について

- [0]には、参照用の値が格納されています。(useState()呼び出し時の引数に初期値を取ると、初期値が最初格納されます。)。  
    //Reactの内部に状態を保持してもらうお願いしている。
    
    - [1]には、値の更新関数が格納されています。この関数に更新したい値を渡す形で,[0]の値を更新することができる。
    
    🔥
    
    より内部的な話をすると、React側で、useState[0]の状態を保持してくれていて、useState[1]を介して、更新もできる。また更新した際には、自身のコンポーネントの中身を再実行(render)もしてくれる。  
    
    ==**このようにReact内部に保持されるコンポーネントに紐づいた値をstateと呼ぶ**==
    

e.g.)　分割代入も駆使してuseStateを使う例

```TypeScript
import { useState } from "react";


const Example = () => {
  const [text, setText] = useState<string>("");
  const onChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => setText(e.target.value);

  return (
    <>
      <input type="text" onChange={onChangeInput} />
      <p>={text}</p>
    </>
  );
};

export default Example;

import { useState } from "react";

```

# 直前のStateの値を参照する

更新関数は引数を渡されてきているので、

useState[1]の更新関数は、非同期に処理されるが、再renderされる前の現在の状態におけるstateを更新したい場合には、引数にコールバック関数を取ることができる。

コールバック関数の引数に渡ってくる部分(今だとprev)は,直==前に更新依頼されたstateの値を参照==できる。

```TypeScript

const countUp = () => {
    setCount(count + 1); --①
	setCount(prev => prev + 1); --②
};

①は state = 1;
②は, state = func(state); のように実行される。
```

まあ、ということはシンプルにカウントアップやダウンを実行するのであれば、更新関数にはコールバック関数を渡して、その中の引数をいじる構成にするのが良さそうですね。

# 使用上の注意点

🔥

## 呼び出す位置について

useStateとは基本的に、**コンポーネントのトップレベル**もしくは、カスタムフック内でのみ呼び出すことができます。(即ち{}の部分 ifやfor文中には書けない。)  
((これは、Reactの各コンポーネントにおけるstateの保持の仕方によるもの。  
あるコンポーネントで、3つstateを作った時、それら3つは1,2,3番目と順番を持って(Listのように?)管理される。if文などの条件分岐によって1個目がない？！みたいなことになると、エラーが発生するから。))

以下の_owner > _memorizedState が保持されている箇所

また_owner自体がFiberNodeである。

[![](Screenshot_2025-01-08_at_0.57.00.png)](useState/Screenshot_2025-01-08_at_0.57.00.png)

🔥

## 即時更新ではない!?

更新関数で、React内部に保持されている値を更新します。この時、更新関数からstateの保持している値を更新するように依頼はしているが、即時実行ではない。  
==**ただ、これは非同期に処理される**==

コンポーネントが再描画される時に更新画面上には更新されるイメージ

ℹ️

ちなみに、更新関数は、callback fnと値でいうと更新関数の方が基本的に良いよ。

それはstateを連続して更新しようとする様なケースに、useState()[0]の値を参照する様な構造だと、予期せぬ値がよばれる可能性があるからね。

# オブジェクトのstateを扱う

---

更新関数には、保持されている同じ型を渡す必要がある。

🔥

## 新しいオブジェクトを渡す必要がある。

==**同一のオブジェクトセットしようとしてはいけない制約があるらしい。参照が変わらないからね（メモリアドレス上の変数名の参照は同一だろ？）**==

あとは、イミュータビリティに影響するよね。予期しないタイミングへの変更が生まれる実装になったり、エコシステムの恩恵を受けきれずパフォーマンスに問題を抱えることになる。

e.g.

```TypeScript
import { useState } from "react";

const Example = () => {
  const person: { name: string; age: number } = { name: "Tom", age: 18 };
  type PersonType = typeof person;

  const [personObj, setPersonObj] = useState<PersonType>({ name: "Tom", age: 18 });

  const changeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPersonObj({ ...personObj, name: e.target.value });
    // setPersonObj((prev) => ({ ...prev, name: e.target.value })); これでも動くよ。
  };

  const changeAge = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPersonObj({ ...personObj, age: Number(e.target.value) });
  };
  const reset = () => setPersonObj(person);

  return (
    <>
      <p>名前: {personObj.name}</p>
      <p>年齢: {personObj.age}</p>
      <input type="text" onChange={changeName} value={personObj.name} />
      <input type="number" onChange={changeAge} step={.5} value={personObj.age} />
      <button onClick={reset}>リセット</button>
    </>
  );
};

export default Example;
```

# 配列のステートを扱う

配列もオブジェクトなので、ステートを更新する際には、別のオブジェクトとして用意してあげる必要があります。

**というのもオブジェクトも配列も変数が表すメモリアドレスであって、実際の参照ではない。つまり、  
const new = current;としても、currentが示す配列へのアドレスをnewに格納しているだけ。**