---
tags:
  - react
  - hooks
  - performance
created: 2026-01-03
updated_at: 2026-02-17
status: active
---

# useMemo

**計算結果（値）をメモ化する** Hook。
依存配列が変わらない限り、前回の計算結果を再利用する。

> コンポーネントのメモ化 → [memo](memo.md)
> 関数のメモ化 → [useCallback](useCallback.md)

## 基本構文

```tsx
const memoizedValue = useMemo(() => {
  return expensiveCalculation(a, b);
}, [a, b]);
```

- 第1引数: 値を返す関数（「作成関数」）
- 第2引数: 依存配列 — この値が変わった時だけ再計算する

## 2つのユースケース

### 1. 重い計算のキャッシュ

```tsx
const TodoList = ({ todos, filter }: Props) => {
  // ❌ 毎レンダリングで全件フィルタリングが走る
  const filtered = todos.filter((t) => t.status === filter);

  // ✅ todos か filter が変わった時だけ再計算
  const filtered = useMemo(
    () => todos.filter((t) => t.status === filter),
    [todos, filter]
  );

  return filtered.map((t) => <TodoItem key={t.id} todo={t} />);
};
```

目安: `console.time` で計測して **1ms 以上**かかる処理なら検討する価値がある。

**注意: 依存配列の参照も安定している必要がある。** 上の例で `todos` が親コンポーネントで毎回新しく生成されていると、依存配列が毎回変わるので useMemo が毎回再計算される（＝意味なし）。

```tsx
// ❌ 親が毎レンダリングで新しい配列を生成 → 子の useMemo が効かない
const Parent = () => {
  const todos = items.map((item) => ({ ...item, done: false })); // 毎回新しい参照
  return <TodoList todos={todos} filter="active" />;
};

// ✅ useState で管理 → setState するまで参照が安定
const Parent = () => {
  const [todos, setTodos] = useState(initialTodos);
  return <TodoList todos={todos} filter="active" />;
};
```

参照の同一性の問題はツリー全体に連鎖する。子で useMemo しても、親がその依存値を毎回生成していたら無意味。

### 2. 参照の同一性を維持する

[memo](memo.md) でラップした子コンポーネントにオブジェクト/配列を渡すとき、参照が変わると memo が効かなくなる。

```tsx
const Parent = () => {
  const [count, setCount] = useState(0);

  // ❌ 毎回新しいオブジェクトが生成される → MemoizedChild が毎回再レンダリング
  const config = { theme: "dark", lang: "ja" };

  // ✅ 参照が維持される → MemoizedChild の再レンダリングをスキップできる
  const config = useMemo(
    () => ({ theme: "dark", lang: "ja" }),
    [] // 依存なし = 初回のみ生成
  );

  return <MemoizedChild config={config} />;
};
```

参照の同一性について詳しくは [memo.md の「参照の同一性が鍵」](memo.md) を参照。

## useCallback との関係

`useCallback` は useMemo の関数版のショートカット。以下は同等：

```tsx
// useCallback
const handleClick = useCallback(() => {
  console.log(id);
}, [id]);

// useMemo で同じことを書くと
const handleClick = useMemo(() => {
  return () => console.log(id);
}, [id]);
```

関数をメモ化したいなら [useCallback](useCallback.md) の方が読みやすい。

## よくある間違い

### 依存配列の漏れ

```tsx
// ❌ filter が依存配列にない → filter が変わっても古い結果が返る
const filtered = useMemo(
  () => todos.filter((t) => t.status === filter),
  [todos] // filter が抜けている
);
```

### 安い計算に使ってしまう

```tsx
// ❌ 文字列結合程度なら useMemo のオーバーヘッドの方が大きい
const fullName = useMemo(
  () => `${firstName} ${lastName}`,
  [firstName, lastName]
);

// ✅ そのまま書く
const fullName = `${firstName} ${lastName}`;
```

## いつ使うべきか — 判断基準

| 状況                                   | useMemo が必要？          |
| -------------------------------------- | ------------------------- |
| 重い計算（ソート、フィルタ、変換）     | ✅ Yes                    |
| memo された子に渡すオブジェクト/配列   | ✅ Yes                    |
| useEffect の依存配列に渡すオブジェクト | ✅ Yes                    |
| 単純な文字列結合や算術演算             | ❌ No                     |
| プリミティブ値（string, number）       | ❌ No（参照の問題がない） |

## React Compiler（2025〜）

React Compiler 1.0 がリリースされ、memo / useMemo / useCallback を**ビルド時に自動挿入**するようになった。
仕組み自体は変わっていない（浅い比較 + 参照の同一性）。人間が書かなくてよくなっただけ。
現時点では Compiler 未導入のプロジェクトも多いため、手動で書くケースが残っている。

## 参考

- [React 公式: useMemo](https://react.dev/reference/react/useMemo)
- [計算コストが高いかどうかの判断](https://react.dev/reference/react/useMemo#how-to-tell-if-a-calculation-is-expensive)
- [When to useMemo and useCallback — Kent C. Dodds](https://kentcdodds.com/blog/usememo-and-usecallback)
