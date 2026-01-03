 

# useReducer

Redux的に、少し複雑になる様な状態変化を扱えるもの。

## useReducerの利点/useStateの違い

そもそもuseReducerは,Reduxのreducerに強く影響を受けている。

- useStateは状態の更新の仕方を利用側に託す。

- useReducerは状態の更新の仕方も状態(定義)側で担当する。

大規模かつ複雑な場合には、定義側で仕様が決められているほうが安全/管理しやすい

```TypeScript
import { useReducer } from "react";

type Action = { type: "+" | "-", step?: number };

const Example = () => {
  const [rstate, dispatch] = useReducer((prev: number, { type, step = 2 }: Action
  ) => {
    switch (type) {
      case "+":
        return prev + step;
      case "-":
        return prev - step;
      default:
        throw new Error("Invalid action");
    }
  }, 0);

  const rcountUp = () => dispatch({ type: '+' });
  const rcountDown = () => dispatch({ type: '-' });

  return (
    <>
      <div>
        <h3>{rstate}</h3>
        <button onClick={rcountUp}>add</button>
        <button onClick={rcountDown}>minus</button>
      </div>
    </>
  );
};

export default Example;
```

## useReducerの利点/useStateの違い(Function programingの視点から)

- 純粋関数であることを保つには、reducerの方が扱いやすい。
    
    - もし、純粋関数でなければ、関数の単体テストが書けない形になる。
    

# 四則演算をするもプログラムを書いてみた。

reduxの思想に乗っとるならtypeにやる操作を指定して、payloadに必要な情報を渡してあげることになるらしい。

```TypeScript
import { useReducer } from "react";

const CALC_OPTIONS = ["add", "minus", "divide", "multiply"] as const;
type CalcType = (typeof CALC_OPTIONS)[number]

interface CalcState {
  a: number,
  b: number;
  type: CalcType;
  result: number;
}

type Action =
  | { type: CalcType }
  | { a: number }
  | { b: number }

function Example() {
  const initState: CalcState = {
    a: 1,
    b: 2,
    type: "add",
    result: 3
  };

  const reducer = (prev: CalcState, action: Action): CalcState => {
    const newA = "a" in action ? action.a : prev.a;
    const newB = "b" in action ? action.b : prev.b;
    const newType = "type" in action ? action.type : prev.type;

    let result = prev.result;
    switch (newType) {
      case "add":
        result = newA + newB;
        break;
      case "minus":
        result = newA - newB;
        break;
      case "divide":
        result = newB === 0 ? 0 : newA / newB;
        break;
      case "multiply":
        result = newA * newB;
        break;
    }

    return { a: newA, b: newB, type: newType, result };
  };

  const [state, dispatch] = useReducer(reducer, initState);

  const calculate = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value
    if (!CALC_OPTIONS.includes(value as CalcType)) return
    dispatch({ type: value as CalcType })
  };

  const numChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = Number(e.target.value)

    if (e.target.name === 'a') {
      dispatch({ a: newVal })
    } else { 
      dispatch({ b: newVal })
    }
  }

  return (
    <>
      <div>
        a:
        <input
          type="number"
          name="a"
          value={state.a}
          onChange={numChangeHandler}
        />
      </div>
      <div>
        b:
        <input
          type="number"
          name="b"
          value={state.b}
          onChange={numChangeHandler}
        />
      </div>
      <select value={state.type} onChange={calculate}>
        {CALC_OPTIONS.map(opt =>
          <option key={opt} value={opt}>{opt}</option>
        )}
      </select>
      <h1>結果：{state.result}</h1>
    </>
  );
};

export default Example;
```