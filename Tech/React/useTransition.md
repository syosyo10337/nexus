---
tags:
  - react
  - hooks
  - performance
created: 2026-03-03
updated_at: 2026-03-03
status: active
---

# useTransition

UIの一部をバックグラウンドでレンダーさせるためのhooks

状態更新を**Transition（非ブロッキングな更新）**としてマークし、UIの応答性を保つためのフック。Transitionとしてマークされた更新は低優先度として扱われ、より緊急な更新（ユーザー入力など）によって中断される。
startTransitionの中で呼び出される関数は慣慣としてactionと呼ばれます。なのでpropsなどで受け取る時はactionまたは、Action suffixを使うようにしましょう。

```jsx
const [isPending, startTransition] = useTransition();

// startTransitionのコールバック関数に、実行の優先順位を下げたい処理を記述する。
const changeHandler = (e) => {
  startTransition(() => {
    setFilterVal(e.target.value);
  });
};
```

- isPendingは、startTransitionの処理が終了前であればtrue、でなければfalseを返す。

## 具体的なユースケース

- **重いリストのフィルタリング** — 入力欄のキー入力は即座に反映しつつ、数千件のリスト再描画を後回しにする
- **タブ切り替え** — 切り替え先のタブの描画が重い場合、操作自体はすぐ反映し、コンテンツ描画を非ブロッキングにする
- **Suspense + lazy によるルーティング** — 遷移先の読み込み中に前の画面を表示し続ける

→ 共通点: 「ユーザーの直接操作は即座に反映したいが、その結果の重い描画は後回しにしたい」場面

## startTransition（スタンドアロン関数）

useTransitionのstartTransitionと同じく、状態更新をTransitionとしてマークする。useTransitionとの違いは`isPending`を提供しないこと。コンポーネント外（データライブラリなど）でも使用できる。

コールバックは**即座に同期的に実行される**（setTimeoutのように遅延しない）。その中の状態更新が低優先度としてマークされ、より緊急な更新があればレンダリングが中断される。

```jsx
<button
  onClick={() => {
    startTransition(() => {
      setCompA((prev) => !prev);
    });
  }}
/>
```

## useDeferredValue

UIの応答性を保つという目的はuseTransitionと同じだが、仕組みが異なる。

- `useTransition` — **状態更新をラップ**して低優先度にする
- `useDeferredValue` — **値そのものの更新を遅延**させる（状態更新のコードにアクセスできない場合に有用）

引数に遅延させたい値を渡す。

```jsx
const filteredItems = dummyItems
  .filter((item) => {
    if (filterVal === "") return true;
    return item.includes(filterVal);
  })
  .map((item) => <li key={item}>{item}</li>);

const deferredItems = useDeferredValue(filteredItems);

return (
  <>
    <input type="text" onChange={changeHandler} />
    <ul>{deferredItems}</ul>
  </>
);
```

## 関連ノート

- [useActionState](useActionState.md) — フォームAction特化のフック（内部的にTransitionを使用）

## 参考

- [useTransition - React公式](https://react.dev/reference/react/useTransition)
- [useDeferredValue - React公式](https://react.dev/reference/react/useDeferredValue)
- [startTransition - React公式](https://react.dev/reference/react/startTransition)
