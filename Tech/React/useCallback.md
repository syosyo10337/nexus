---
tags:
  - react
  - hooks
  - component
  - performance
created: 2026-01-03
status: active
---

# useCallback

[https://tyotto-good.com/react/use-callback](https://tyotto-good.com/react/use-callback)

メモ化されたコールバック関数をreturnする。

。メモ化とは同じ入力が再度発生した時に、キャッシュした結果を返すことです。

メモ化については、[こちらの記事](https://tyotto-good.com/react/use-memo)でも説明しています。

`useCallBack`は以下のように定義します

```TypeScript
const memorizedCallback = useCallback(() => {
  callbackFunc(value);
}, [value]);
```

第一引数には、コールバック関数

第二引数には依存配列を受け取る。

# _useCallbackが有効の場合_

```SQL
const MemoizedChild = React.memo(({ onCallback }) => {

*// 重い処理を含むコンポーネント*

});

*// 親コンポーネント*

const Parent = () => {

const callback = useCallback(() => {

*// 複雑な処理*

}, [*/* 依存値 */*]);

return <MemoizedChild onCallback={callback} />;

};
```

つまり、useCallbackが本当に必要なのは：

- 子コンポーネントがReact.memoで最適化されている

- コールバック関数が複雑な処理を含む

- 関数が外部の値に依存している

- パフォーマンス測定で明確なボトルネックが確認された

という場合です。
