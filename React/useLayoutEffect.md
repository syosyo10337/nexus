---
tags:
  - react
  - hooks
  - component
  - state
created: 2026-01-03
status: active
---

# useLayoutEffect

**useLayoutEffectは、useEffectよりも先に実行される。  
**よって、  
const _time = parseInt(window.localStorage.getItem('time-key'));  
のような処理を記述することで、ブラウザのストレージに対して、保持されていた値を、useEffectが再度マウントされる際（今回はExample >TimerコンポーネントのExampleコンポに含まれるtimeというstateによって、毎秒再レンダリングされている。)、useEffectに先んじて、ストレージにsetされていた値をとりに行くことで、状態の保持を有効にしている。

- **画面上での表示stateなどによって、更新がかかった際には、実際のレンダーよりも先んじて処理を実行する。(画面がチラつきなどが起きる場合には、画面の反映よりも先に実行されるuseLayoutEffectを使う。**  
    例えば以下のような例。

```TypeScript
import { useLayoutEffect, useEffect, useState, useRef } from "react";

const Random = () => {
const [state, setState] = useState(0);

useLayoutEffect(() => {
if (state === 0) {
setState(Math.floor(Math.random() * 300));
}
}, [state]);

return (
<button
className="effect-btn"
onClick={() => setState(0)}
style={{ fontSize: "2.5em" }}
>
state: {state}
</button>
);
};
export default Random;
```

1. 初回のレンダー時には、useLayoutEffectが実行されて、state===0によって、ランダムが数字がセット。  
    表示される。

2. onClickイベントとしてStateをゼロに変更するようになっているので、この時、まず、stateの値に変更依頼が予約される。

3. 再レンダーが行われる時に、  
    4.この時通常のuseEffectであれば、依存配列にstateが指定されるため、非同期的にsetState更新関数で、ランダムな値を設定し直し始める。その更新の前後差によって、実際にレンダーされる値が、新たなランダムな値であったり、0が見え隠れしたりする。

//この時にuseLayoutEffectを使用すると、stateの更新による再レンダーに先んじて、内部のコールバック関数を実行する。