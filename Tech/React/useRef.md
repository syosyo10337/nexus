---
tags:
  - react
  - hooks
  - state
created: 2026-01-03
status: active
---

# useRef

**用途: DOMを直接操作する。 /** **再レンダリングを発生させずに値を保持する。**

- useRefはrefオブジェクトを返す。

- currentプロパティに値が設定される

- ref.currentで値にアクセスでき、読み書きが可能

## DOMを直接操作する場合。

refオブジェクトを作成する。

操作したい対象のDOM(厳密には、操作したいJSXのref属性)に対して、refオブジェクトを渡す。

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
};

export default Example;
```