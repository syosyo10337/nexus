---
tags:
  - react
  - component
created: 2026-01-03
updated_at: 2026-02-18
status: active
---

# Portal

ポータルの子要素を、直接の親要素ではなく別のDOM要素にマウントすることができる。

//例えばモーダル。モーダルを発火されるはずのbtn要素の親に対して、直接親の要素をマウントできたりする  
コンポーネントのように扱うことができる。

- `createPortal(children,domNode)`  
   第一引数: Reactの子要素としてレンダー可能なもの(要素、文字列、フラグメント、このポーネント)  
   第二引数: レンダー先のDOM要素

e.g.)

```TypeScript
const ModalPortal = ({ children }) => {
  const target = document.querySelector('.container.start');
  return createPortal(children, target)
}
```

children呼び出し時に子要素になるものをpropsの分割代入で受け取っている。

## 注意点: Portal でのイベントバブリング

Portal で描画された要素は **DOM 上**では `<body>` 直下などに配置されるが、**React のコンポーネントツリー上**では元の位置に留まる。

そのため、React の合成イベントは Portal 内から**元の親コンポーネントまでバブリング**する。DOM ツリー上の親ではなく、React コンポーネントツリー上の親に伝播する点が重要。

この仕様により、Portal 内のクリックが意図せず親コンポーネントの `onClick` を発火させるバグが起きやすい。詳細な仕組みと解決策は [イベントバブリングと合成イベント](イベントバブリングと合成イベント.md) を参照。
