 

🚲

# useImperativeHandle

refを使った操作を限定する。先ほどの操作だけだと、input要素を使ってどんな作業もできてしまう。

第一引数でもらったrefオブジェクトが使えるメソッドを限定する。定義したものだけを使用できるようになる。

```TypeScript
import { useRef, forwardRef, useImperativeHandle } from "react";

interface InputHandle {
  myFocus: () => void;
}

const Input = forwardRef<InputHandle>((props, ref) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useImperativeHandle(ref, () => ({
    myFocus() {
      inputRef.current?.focus();
    },
  }));

  return <input type="text" ref={inputRef} />;
});

const Example = () => {
  const ref = useRef<InputHandle>(null);

  return (
    <>
      <Input ref={ref} />
      <button onClick={() => ref.current?.myFocus()}>
        インプット要素をフォーカスする
      </button>
    </>
  );
};

export default Example;
```