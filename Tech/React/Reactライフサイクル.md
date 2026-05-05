---
tags:
  - react
  - lifecycle
  - hooks
  - component
  - state
created_at: 2026-05-05
updated_at: 2026-05-05
status: active
---

# Reactライフサイクル

React コンポーネントの「いつ何が起きるか」を時系列で整理した全景マップ。
個別 Hook の挙動詳細は、各専用ノートにリンクしている。

## 1. レンダー / コミット / Effect の3フェーズ

React の更新は必ずこの順序で処理される。

```text
[レンダー]  コンポーネント関数を実行し、JSXを返す（まだ画面は変わらない）
    |
[コミット]  ReactがDOMを実際に更新する（画面に反映される）
    |
[Effect]   useEffect のコールバックが実行される
```

### レンダー (Render)

- コンポーネント関数が呼ばれ、JSX を組み立てるフェーズ
- **純粋な計算であるべき** — DOM 操作や API コールはここでやらない（[ReactとPure functions](ReactとPure functions.md) 参照）
- この時点では画面にはまだ何も反映されていない

### コミット (Commit)

- レンダー結果をもとに、React が実際の DOM を更新するフェーズ
- ユーザに見える画面がここで変わる

### Effect

- `useEffect` のコールバックが実行されるフェーズ
- **DOM が更新された後**に走る
- Effect 内で `setState` すると再度レンダーが走り、計 2 回のレンダーが発生する

```text
          画面への反映タイミング
               |
[レンダー] --- [コミット] --- [Effect]
    |                           |
 画面まだ古い              ここで setState すると
                           もう1回レンダーが走る
```

`useLayoutEffect` はコミット直後・ブラウザ描画前に走る。詳細は [useLayoutEffect](useLayoutEffect.md)。

---

## 2. マウント・再レンダー・アンマウント

### マウント (Mount)

コンポーネントが**初めて**画面に表示されること。

- `useState(初期値)` の初期値が使われるのはこの時だけ
- `useEffect` は必ずマウント後に 1 回実行される

### 再レンダー (Re-render)

コンポーネントが**2 回目以降**に描画し直されること。以下がトリガーになる:

- 自身の `setState` が呼ばれた
- **親コンポーネントが再レンダーされた**（props が変わったかどうかは関係ない）
- Context の値が変わった

### アンマウント (Unmount)

コンポーネントが画面から取り除かれること。

- `useEffect` のクリーンアップ関数が実行される

```text
[マウント] → [再レンダー] → [再レンダー] → ... → [アンマウント]
    |              |
 初期値で箱を作る   箱の既存の値を返す
```

ツリー位置による state 識別の詳細は [Stateとコンポーネント](Stateとコンポーネント.md)、key で同位置のコンポーネントを別物として扱うパターンは [keyの指定](keyの指定.md) を参照。

---

## 3. 親の再レンダーと子の関係

```js
function Parent() {
  const [items, setItems] = useState([A, B, C]);
  //     ↑ 親の state

  return <List items={items} />;
  //           ↑ 子の props
}
```

1. `setItems([D, E, F])` で親の state が変わる
2. 親が再レンダーされる
3. JSX 内の `<List items={items} />` が再評価される
4. **React が子 (List) も再レンダーする**

子が再レンダーされる理由は「props が変わったから」ではなく**「親が再レンダーされたから」**。
`React.memo` でラップした場合のみ、props が同じなら子の再レンダーをスキップできる（[memo](memo.md) 参照）。

---

## 4. ページリロードが起こすこと

```text
ページリロード
  |
  v
React アプリ全体が破棄される
  - すべてのコンポーネントがアンマウント
  - useState の箱がすべて消える
  - useEffect のクリーンアップが走る（※ブラウザが許す範囲で）
  |
  v
React アプリが最初から起動する
  - すべてのコンポーネントが「マウント」される
  - useState(初期値) → 初期値で箱が新規作成される
  - useEffect が全コンポーネントで初回実行される
```

**要点**: ページリロード = React の世界が完全にリセットされる = 全コンポーネントが初回マウントからやり直し。

---

## 5. 実践: props 変更時の state 調整パターン

前提: **props が変わっても state は自動でリセットされない**（state はコンポーネント自身の箱に独立保存されている。詳細は [useState](useState.md) 参照）。そのため、props 変更時に state を初期化・追従させたい場合は明示的な対応が必要になる。

### パターン 1: useEffect で調整（避けるべき）

```js
function List({ items }) {
  const [selection, setSelection] = useState(null);

  useEffect(() => {
    setSelection(null);
  }, [items]);
}
```

```text
items変更 → [レンダー: selection=古い値] → [DOM更新: 古い画面が見える]
         → [Effect: setSelection(null)]
         → [レンダー: selection=null] → [DOM更新: 正しい画面]
```

問題: 2 回レンダー + 古い状態が一瞬画面に出る。

### パターン 2: レンダー中に state 調整（ベター）

```js
function List({ items }) {
  const [selection, setSelection] = useState(null);
  const [prevItems, setPrevItems] = useState(items);

  if (items !== prevItems) {
    setPrevItems(items);
    setSelection(null);
  }
}
```

```text
items変更 → [レンダー中に検知 → setState → レンダーやり直し]
         → [レンダー: selection=null] → [DOM更新: 正しい画面]
```

改善: 古い状態が画面に出ない。ただしコードがやや複雑。

### パターン 3: レンダー中に計算（ベスト）

```js
function List({ items }) {
  const [selectedId, setSelectedId] = useState(null);
  const selection = items.find(item => item.id === selectedId) ?? null;
}
```

```text
items変更 → [レンダー: 計算で selection を導出] → [DOM更新: 正しい画面]
```

改善: state 調整が不要。items に該当があれば選択が維持される。最もシンプル。

---

## 関連ノート

- [renderingってなんだ？](renderingってなんだ？.md) — レンダーの定義、CSR/SSR の分岐
- [useState](useState.md) — 更新関数、prev 参照、オブジェクト/配列の扱い
- [useEffect](useEffect.md) — 依存配列、クリーンアップ、落とし穴
- [useLayoutEffect](useLayoutEffect.md) — useEffect との実行タイミングの違い
- [Stateとコンポーネント](Stateとコンポーネント.md) — ツリー位置と state 識別
- [ReactとPure functions](ReactとPure functions.md) — レンダーフェーズの純粋性
- [memo](memo.md) — `React.memo` による子の再レンダースキップ
- [keyの指定](keyの指定.md) — key と state 保持の関係

## 参考リンク

- [レンダーとコミット – React](https://react.dev/learn/render-and-commit)
- [state はスナップショット – React](https://react.dev/learn/state-as-a-snapshot)
- [You Might Not Need an Effect – React](https://react.dev/learn/you-might-not-need-an-effect)
- [useState — 前回のレンダー情報を保存する – React](https://react.dev/reference/react/useState#storing-information-from-previous-renders)
- [コンポーネントを純粋に保つ – React](https://react.dev/learn/keeping-components-pure)
