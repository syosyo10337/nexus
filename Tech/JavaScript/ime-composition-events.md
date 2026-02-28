---
tags:
  - javascript
  - ime
  - keyboard-events
created: 2026-02-28
status: active
---

## 概要

日本語などの IME（Input Method Editor）入力時に、変換確定の Enter キーと通常の Enter キーを区別する方法。

## 問題

`keydown` イベントで `Enter` を検知すると、IME の変換確定操作も同じ `Enter` として検知されてしまう。
例えばタグ入力 UI で Enter 確定する場合、変換途中のひらがなが意図せずタグとして追加される。

## 解決策: `isComposing`

`KeyboardEvent.isComposing` プロパティで IME が変換中かどうかを判定できる。

```typescript
const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
  if (e.key === "Enter" && !e.nativeEvent.isComposing) {
    e.preventDefault();
    doSomething();
  }
};
```

- `isComposing === true`: IME が変換中（変換確定の Enter）→ 無視する
- `isComposing === false`: 通常の Enter キー → 処理を実行する

## React での注意点

React の `SyntheticEvent` には `isComposing` がないため、`e.nativeEvent.isComposing` でネイティブイベントにアクセスする必要がある。

## 関連イベント

`compositionstart` / `compositionupdate` / `compositionend` イベントでも IME の状態を追跡できるが、単純なケースでは `isComposing` チェックで十分。

## 参考

- [MDN - KeyboardEvent.isComposing](https://developer.mozilla.org/ja/docs/Web/API/KeyboardEvent/isComposing)
- [MDN - CompositionEvent](https://developer.mozilla.org/ja/docs/Web/API/CompositionEvent)
