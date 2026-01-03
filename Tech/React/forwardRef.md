---
tags:
  - react
  - hooks
  - component
created: 2026-01-03
status: active
---

# forwardRef

# Refのコンポーネント間での受け渡し

## 1. refは予約語なので、カスタムprop名をつかって、refオブジェクトをやり取りする

```TypeScript
import { useRef } from "react";

const Input = ({ customRef }: { customRef: React.RefObject<HTMLInputElement> }) => {
  return <input type="text" ref={customRef} />
}

const Example = () => {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <>
      <Input customRef={ref} />
      <button onClick={() => ref.current?.focus()}>
        インプット要素をフォーカスする
      </button>
    </>
  );
};

export default Example;
```

## 2. forwardRefを使う。

```TypeScript
import { useRef, forwardRef } from "react";


const Input = forwardRef<HTMLInputElement>((props, ref) => {
  return <input type="text" ref={ref} />
})

const Example = () => {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <>
      <Input ref={ref} />
      <button onClick={() => ref.current?.focus()}>
        インプット要素をフォーカスする
      </button>
    </>
  );
};

export default Example;
```