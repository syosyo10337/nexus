---
tags:
  - web-performance
  - tbt
  - core-web-vitals
created: 2026-02-23
status: draft
---

## 概要

TBT (Total Blocking Time) は FCP〜TTI の間で、メインスレッドを **50ms 以上**ブロックした「Long Task」の超過分の合計。

例: 70ms のタスクなら 50ms を超えた **20ms** が TBT に加算される。200ms のタスクなら **150ms** が加算される。

目標: **< 200ms**。Lighthouse はメインスレッドのタスクを監視し、Long Task を検出する。

## 改善手法

### JS バンドルの分割

初期ロードで不要な JS を削減する。使われていない機能のコードを最初に読み込まない。

```js
// Before: すべてのコンポーネントを初期 bundle に含める
import HeavyChart from './HeavyChart';

// After: 表示が必要になったタイミングで読み込む（Dynamic Import）
const HeavyChart = dynamic(() => import('./HeavyChart'), { ssr: false });
```

webpack や Vite は `import()` を検出して自動的に chunk を分割する。

### 重い処理を分割して Main Thread を解放する（Yield to Main Thread）

JS は単一スレッドで実行される。重い処理をひとつのタスクとして実行すると Long Task になる。小さなチャンクに分割してブラウザが合間にレンダリングできるようにする。

```js
// Before: 1000件を一気に処理 → Long Task
function processItems(items) {
  items.forEach(item => heavyProcess(item));
}

// After: 50件ずつ処理して、合間にメインスレッドを解放
async function processItems(items) {
  const chunkSize = 50;
  for (let i = 0; i < items.length; i += chunkSize) {
    const chunk = items.slice(i, i + chunkSize);
    chunk.forEach(item => heavyProcess(item));

    // メインスレッドを一時解放（次のフレームまで待つ）
    await new Promise(resolve => setTimeout(resolve, 0));
  }
}
```

`scheduler.yield()` (Chrome 129+) を使うとより適切に優先度制御できる。

### サードパーティスクリプトの遅延

Analytics、広告、チャットウィジェット等はページの主機能に無関係なのに重い JS を実行する。

```html
<!-- defer: DOM パース完了後に実行 -->
<script src="https://analytics.example.com/script.js" defer></script>

<!-- type="module": 自動的に defer 扱いになる -->
<script type="module" src="chat-widget.js"></script>
```

Intersection Observer でユーザーがスクロールしてからロードする方法も有効。

```js
const observer = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting) {
    loadChatWidget();
    observer.disconnect();
  }
});
observer.observe(document.querySelector('#chat-section'));
```

### 不要な JS の削除

- **Tree Shaking** — webpack/Rollup/Vite は `export` されているが使われていないコードを削除する。`import * as utils` より `import { specific } from 'utils'` を使う
- **未使用ポリフィルの除去** — `@babel/preset-env` の `targets` を正確に指定して、不要なポリフィルを削除
- **バンドルサイズの可視化** — `webpack-bundle-analyzer` や Vite の `rollup-plugin-visualizer` でどのライブラリが重いか特定する

## 参考

- [Lighthouse Core Web Vitals](../Lighthouse%20Core%20Web%20Vitals.md)
- [INP 改善](inp.md)
