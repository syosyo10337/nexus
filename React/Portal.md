---
tags:
  - react
  - component
created: 2026-01-03
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

## 注意点: ポータルの使用におけるbubblingの注意点

ポータルを使った際には、バブリングが発生した際には、_==**元々**==_==**の**==親に紐づいたクリックイベントが伝播していく(つまり、**実際のDOMツリー上での親関係に伝播するのではなく、React要素として親要素に伝播していく**。)

ℹ️

そもそもevent bubblingとは？

イベントバブリングは、特定の要素で発生したイベントが、その親要素、さらにその上の親要素へと階層を遡って伝播していく仕組みを指します。

例えば、次のようなHTML構造があったとします。

```HTML
<div id="parent">
  <button id="child">Click me</button>
</div>

```

ここで、`#child` ボタンをクリックすると、クリックイベントは次の順序で発生します：

1. ボタン（`#child`）に対してイベントが発生。

2. イベントはボタンの親要素（`#parent`）に伝播。

3. さらに上位の親要素へ（もしあれば）伝播。

この動作を「バブリング（泡のように上へ上へ伝わる）」と呼びます。