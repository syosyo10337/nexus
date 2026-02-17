---
tags:
  - react
  - hooks
  - performance
created: 2026-01-03
updated_at: 2026-02-17
status: active
---

# useCallback

**関数をメモ化する** Hook。
依存配列が変わらない限り、同じ関数の参照を返す。

> コンポーネントのメモ化 → [memo](memo.md)
> 値のメモ化 → [useMemo](useMemo.md)

## なぜ必要か

React コンポーネント内で定義した関数は、レンダリングのたびに**新しい関数**が生成される。
そのため、propsとして渡された先のコンポーネントで参照の同一性(referential equality)が維持されず、再レンダリングされる。

\*関数が再度生成されること自体は問題ではない。むしろ不要なuseCallback実行によるoverheadがあるので、無闇に利用するのはマイナスとも言える。

```tsx
const Parent = () => {
  // 毎回新しい handleClick が作られる（参照が変わる）
  const handleClick = () => console.log("clicked");

  return <Child onClick={handleClick} />;
};
```

関数の中身は同じでも `===` で比較すると別物。
[memo](memo.md) でラップした子コンポーネントに渡すと、memo が無意味になる。

参照の同一性について詳しくは [memo.md の「参照の同一性が鍵」](memo.md) を参照。

## 基本構文

```tsx
const memoizedCallback = useCallback(() => {
  doSomething(a, b);
}, [a, b]);
```

- 第1引数: メモ化したいコールバック関数
- 第2引数: 依存配列 — この値が変わった時だけ新しい関数を生成する

## useMemo との関係

useCallback は [useMemo](useMemo.md) の関数特化版。以下は同等：

```tsx
// useCallback（こちらが読みやすい）
useCallback(fn, deps);

// useMemo で同じことを書くと
useMemo(() => fn, deps);
```

使い分け:

- **値**（オブジェクト・配列・計算結果）をメモ化 → [useMemo](useMemo.md)
- **関数**をメモ化 → useCallback

## 典型的なユースケース

### 1. memo された子に関数を渡す

```tsx
const MemoizedChild = React.memo(({ onClick }: { onClick: () => void }) => {
  console.log("Child rendered"); // useCallback なしだと毎回呼ばれる
  return <button onClick={onClick}>Click</button>;
});

const Parent = () => {
  const [count, setCount] = useState(0);

  // ✅ count が変わっても handleClick の参照は維持される
  const handleClick = useCallback(() => {
    console.log("clicked");
  }, []); // 依存なし

  return (
    <>
      <p>{count}</p>
      <button onClick={() => setCount((c) => c + 1)}>+1</button>
      <MemoizedChild onClick={handleClick} />
    </>
  );
};
```

**ポイント**: `React.memo` + `useCallback` はセットで使って初めて効果がある。

### 2. useEffect の依存配列に関数を渡す

memo なしでも useCallback が意味を持つケース。
useEffect の依存配列も `===` で比較するため、関数の参照が毎回変わると Effect が毎レンダリングで再実行される。

```tsx
// ❌ fetchData が毎回新しい参照 → useEffect が毎レンダリングで実行される
const fetchData = () => api.get(`/users/${id}`);

useEffect(() => {
  fetchData();
}, [fetchData]); // 毎回変わる

// ✅ id が変わった時だけ fetchData が新しくなる → useEffect も id 変更時だけ
const fetchData = useCallback(() => {
  return api.get(`/users/${id}`);
}, [id]);

useEffect(() => {
  fetchData();
}, [fetchData]);
```

```text
memo + useCallback       → memo が props の参照を比較
useEffect + useCallback  → useEffect が依存配列の参照を比較
```

**ただし、多くの場合は関数を useEffect の中に移す方がよい：**
useEffectを数少ない依存配列で実装する方がbetter

```tsx
// ✅ もっと良い — useCallback すら不要
useEffect(() => {
  // 関数を Effect 内で定義すれば、依存配列に関数を入れる必要がない
  const fetchData = () => api.get(`/users/${id}`);
  fetchData();
}, [id]); // 直接 id に依存
```

useCallback で関数を安定させるより、そもそも依存配列に関数を入れない設計の方がシンプル。
関数を Effect の外に出す必要があるのは、複数の Effect や他の箇所から同じ関数を呼ぶ場合に限られる。

## useCallback が不要なケース

```tsx
// ❌ 子が memo されていないなら useCallback は無意味
const handleClick = useCallback(() => {
  console.log("clicked");
}, []);
return <Child onClick={handleClick} />; // Child が memo でない → 意味なし

// ❌ イベントハンドラを直接 DOM 要素に渡すだけなら不要
const handleClick = useCallback(() => {
  setCount((c) => c + 1);
}, []);
return <button onClick={handleClick}>+1</button>; // HTML要素は memo 不要
```

## いつ使うべきか — 判断基準

| 状況                                        | useCallback が必要？ |
| ------------------------------------------- | -------------------- |
| `React.memo` された子に関数を渡す           | ✅ Yes               |
| `useEffect` の依存配列に関数を含める        | ✅ Yes               |
| 他の Hook（useMemo 等）の依存に関数を含める | ✅ Yes               |
| DOM 要素に直接イベントハンドラを渡す        | ❌ No                |
| memo されていない子に渡す                   | ❌ No                |

## React Compiler（2025〜）

React Compiler 1.0 がリリースされ、メモ化を**自動で**行うようになった。

仕組み自体は変わっていない（memo + useCallback のセットで効く）。Compiler がビルド時にこれらを自動挿入してくれるので、開発者が手動で書く必要がなくなった。

```text
手動で書いていたもの              → Compiler が自動でやること
──────────────────────────────────────────────────
React.memo(Child)                → コンポーネントを自動メモ化
useMemo(() => value, [dep])      → 値を自動メモ化
useCallback(fn, [dep])           → 関数を自動メモ化
```

現時点ではまだ Compiler 未導入のプロジェクトも多いため、手動で書くケースが残っている。

## 参考

- [React 公式: useCallback](https://react.dev/reference/react/useCallback)
- [Understanding useMemo and useCallback — Josh W. Comeau](https://www.joshwcomeau.com/react/usememo-and-usecallback/)
- [How to useMemo and useCallback: you can remove most of them](https://www.developerway.com/posts/how-to-use-memo-use-callback)
