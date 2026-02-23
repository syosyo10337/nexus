---
tags:
  - web-performance
  - inp
  - core-web-vitals
created: 2026-02-23
status: draft
---

## 概要

INP (Interaction to Next Paint) はユーザー操作（クリック、タップ、キー入力）から、その結果が画面に反映されるまでの遅延。2024年3月に FID を置き換えた新指標。

FID との違い: FID は最初のインタラクションの**入力遅延のみ**を計測。INP はページ滞在中の**すべてのインタラクションの最悪値**を計測する。

目標: **< 200ms**

## インタラクションの内訳

```
ユーザー操作
    ↓ Input Delay（イベントがキューに入るまでの待ち時間）
    ↓ Processing Time（イベントハンドラの実行時間）
    ↓ Presentation Delay（次のフレームが描画されるまでの時間）
画面反映
```

INP = Input Delay + Processing Time + Presentation Delay

## 改善手法

### イベントハンドラを軽量化する

ハンドラ内で重い処理を実行すると Processing Time が伸びる。

```js
// NG: クリックハンドラで重い処理
button.addEventListener('click', () => {
  const result = heavyComputation(data); // 長時間実行
  updateUI(result);
});

// OK: 重い処理を requestAnimationFrame で次のフレームに遅らせる
button.addEventListener('click', () => {
  // 即座に UI を更新（ユーザーへのフィードバックを先に返す）
  showLoadingState();

  requestAnimationFrame(() => {
    const result = heavyComputation(data);
    updateUI(result);
  });
});

// OK: Web Worker に処理をオフロード
const worker = new Worker('heavy-computation.js');
button.addEventListener('click', () => {
  worker.postMessage(data);
});
worker.onmessage = (e) => updateUI(e.data);
```

### `content-visibility: auto` で画面外の DOM コストを削減

画面外のレンダリングを遅延させる CSS プロパティ。ページ全体の初期レンダリングを高速化し、スクロール中の再描画も軽量になる。

```css
.article-section {
  content-visibility: auto;
  /* contain-intrinsic-size でスクロールバーのずれを防ぐ */
  contain-intrinsic-size: 0 500px;
}
```

注意: `content-visibility: auto` はコンテンツが画面外にある間はレンダリングをスキップするため、検索や印刷に影響する場合がある。

### 大量リストの仮想スクロール

1000 件以上のリストを全件 DOM に持つとスクロール時のレイアウト計算が重くなる。仮想スクロールは画面に見えている分だけ DOM を保持する手法。

React では TanStack Virtual や React Virtuoso を使う:

```tsx
import { useVirtualizer } from '@tanstack/react-virtual';

function VirtualList({ items }) {
  const parentRef = useRef(null);
  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 50,
  });

  return (
    <div ref={parentRef} style={{ height: '400px', overflow: 'auto' }}>
      <div style={{ height: `${virtualizer.getTotalSize()}px`, position: 'relative' }}>
        {virtualizer.getVirtualItems().map(virtualItem => (
          <div
            key={virtualItem.key}
            style={{
              position: 'absolute',
              top: `${virtualItem.start}px`,
              width: '100%',
            }}
          >
            {items[virtualItem.index].name}
          </div>
        ))}
      </div>
    </div>
  );
}
```

### React の状態更新を最適化する

不要な再レンダリングが Processing Time を増やす。

```tsx
// useMemo: 重い計算結果をキャッシュ
const sortedData = useMemo(() => expensiveSort(data), [data]);

// useCallback: 関数の参照を固定（子コンポーネントの再レンダリング防止）
const handleClick = useCallback(() => { /* ... */ }, [dependency]);

// React.memo: props が変わらない限り再レンダリングをスキップ
const ListItem = React.memo(({ item }) => <div>{item.name}</div>);

// useTransition: ユーザー操作を優先し、重い更新を後回しにする
const [isPending, startTransition] = useTransition();
const handleSearch = (query) => {
  startTransition(() => {
    setFilteredItems(items.filter(i => i.name.includes(query)));
  });
};
```

## 参考

- [Lighthouse Core Web Vitals](../Lighthouse%20Core%20Web%20Vitals.md)
- [TBT 改善](tbt.md)
