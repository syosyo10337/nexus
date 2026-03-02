---
tags:
  - react
  - hooks
  - state
created: 2026-01-03
updated_at: 2026-03-02
status: active
---

# useRef

**用途: DOMを直接操作する。

- useRefはrefオブジェクトを返す。

- currentプロパティに値が設定される

- ref.currentで値にアクセスでき、読み書きが可能

- useRefの第一引数は`.current`の初期値
  - DOM操作の場合 → `useRef(null)` （マウント時にReactが実際のDOMノードで上書きする）
  - 値の保持の場合 → 保持したい初期値を渡す（例: `useRef(0)`, `useRef(false)`）

## DOMを直接操作する場合

refオブジェクトを作成する。

操作したい対象のDOM(厳密には、操作したいJSXのref属性)に対して、refオブジェクトを渡す。

ReactがそのDOM要素をマウントすると、ref.currentに実際のDOMノードがセットされる。アンマウント時にはnullに戻る。

e.g.

```TypeScript
import { useState, useRef } from "react";

const Case1: React.FC = () => {
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div>
      <h3>ユースケース1</h3>
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        ref={inputRef}
      />
      <button onClick={() => inputRef.current?.focus()}>
        インプット要素をフォーカスする
      </button>
    </div>
  );
};

const Example = () => {
  return (
    <>
      <Case1 />
    </>
  );


export default Example;
```

## 再レンダリングを発生させずに値を保持する場合

useStateとの違い:

- `useState` — setterを呼ぶと**再レンダリングが発生**し、画面が更新される
- `useRef` — `.current`を書き換えても**再レンダリングは発生しない**。値は保持されるが画面には反映されない

画面に表示する必要はないが、コンポーネントのライフサイクルを通じて保持したい値に向いている。

典型的なユースケース:

- タイマーID（setInterval / setTimeout の戻り値）
- 前回のstateやpropsの記録
- DOM参照（上記のユースケース）
