---
tags:
  - react
  - performance
created: 2026-01-03
updated_at: 2026-02-17
status: active
---

# React.memo

**コンポーネントをメモ化する**高階コンポーネント（HOC）。
props が変わらなければ再レンダリングをスキップする。

> 値のメモ化 → [useMemo](useMemo.md)
> 関数のメモ化 → [useCallback](useCallback.md)

## なぜ必要か — 再レンダリングの仕組み

React は親コンポーネントが再レンダリングされると、**props が変わっていなくても子を再レンダリングする**。
これがデフォルトの挙動。

```text
Parent (state変更) → 再レンダリング
  └─ Child          → props同じでも再レンダリング ← ここがムダ
```

`React.memo` で子を包むと、**props の浅い比較（shallow compare）**を行い、変化がなければ再レンダリングをスキップする。

## 基本構文

```tsx
const MemoizedChild = React.memo(({ name, count }: Props) => {
  return (
    <div>
      {name}: {count}
    </div>
  );
});
```

## 参照の同一性（referential equality）が鍵

浅い比較は `===` で行われる。ここが最大の落とし穴。

```tsx
// プリミティブ → 値が同じなら true
"hello" === "hello" // true
42 === 42           // true

// オブジェクト・配列・関数 → 毎回新しい参照が生成される
{ a: 1 } === { a: 1 } // false（別のオブジェクト）
[1, 2]  === [1, 2]    // false（別の配列）
() => {} === () => {} // false（別の関数）

const a = { a: 1 };
a === { a: 1 } // false
```

つまり、親が再レンダリングされるたびに `{}` や `() => {}` は**新しい参照**になるので、`React.memo` が効かなくなる。

これを解決するのが [useMemo](useMemo.md)（値の参照を維持）と [useCallback](useCallback.md)（関数の参照を維持）。

## memo が有効なケース

```tsx
// 親が頻繁に再レンダリングされるが、この子には関係ない
const HeavyList = React.memo(({ items }: { items: Item[] }) => {
  return items.map((item) => <Row key={item.id} item={item} />);
});
```

- 親が頻繁に再レンダリングされる
- 子のレンダリングコストが高い
- props が実際にはあまり変わらない

## memo 単体で効く例 — props がプリミティブだけの場合

props が string / number / boolean だけなら、useMemo や useCallback なしで memo が効く。
プリミティブは `===` で**値そのもの**が比較されるため、参照の問題が起きない。

```tsx
const Parent = () => {
  const [count, setCount] = useState(0);
  const [name] = useState("Alice");

  return (
    <>
      <button onClick={() => setCount((c) => c + 1)}>
        +1: {count}
      </button>

      {/* ✅ name="Alice", age=25, isActive=true は全てプリミティブ */}
      {/* count が変わって Parent が再レンダリングされても */}
      {/* これらの props は === で true → 再レンダリングスキップ */}
      <MemoizedProfile name={name} age={25} isActive={true} />
    </>
  );
};

const MemoizedProfile = React.memo(({ name, age, isActive }: Props) => {
  console.log("Profile rendered"); // count 変更時には呼ばれない
  return (
    <div>
      {name} ({age}) {isActive ? "ON" : "OFF"}
    </div>
  );
});
```

```text
props の型による memo の効き方:
  プリミティブ (string, number, boolean) → memo 単体で OK
  オブジェクト / 配列                    → useMemo が必要
  関数                                   → useCallback が必要
```

## memo だけでは不十分な典型パターン

```tsx
const Parent = () => {
  const [count, setCount] = useState(0);

  // ❌ 毎回新しいオブジェクトと関数が生成される
  const style = { color: "red" };
  const handleClick = () => console.log("clicked");

  // memo しても props の参照が毎回変わるので意味がない
  return <MemoizedChild style={style} onClick={handleClick} />;
};
```

解決策：

- `style` → [useMemo](useMemo.md) で参照を維持
- `handleClick` → [useCallback](useCallback.md) で参照を維持

これらを併用することで、同一性比較がうまく効くようになる

## カスタム比較関数

デフォルトの浅い比較では不足する場合、第2引数に比較関数を渡せる。

```tsx
const MemoizedChild = React.memo(MyComponent, (prevProps, nextProps) => {
  // true を返すと再レンダリングをスキップ
  return prevProps.id === nextProps.id;
});
```

ただし、比較関数自体にコストがかかるため、本当に必要な場合のみ使う。

## memo を使う前に — そもそもメモ化を不要にする設計原則

React 公式が推奨する「memo に頼らずにパフォーマンスを改善する方法」がある。
**memo は最後の手段であり、まずはこれらの原則を検討すべき。**

> "In practice, you can make a lot of memoization unnecessary by following a few principles."
> — [React 公式: memo](https://react.dev/reference/react/memo#should-you-add-memo-everywhere)

### 1. children として JSX を受け取る

```tsx
// ❌ Wrapper が再レンダリングすると Content も再レンダリング
const Page = () => {
  const [count, setCount] = useState(0);
  return (
    <div>
      <button onClick={() => setCount((c) => c + 1)}>+1</button>
      <HeavyContent /> {/* count と無関係なのに毎回再レンダリング */}
    </div>
  );
};

// ✅ children として渡すと、親の state 変更の影響を受けない
const Counter = ({ children }: { children: React.ReactNode }) => {
  const [count, setCount] = useState(0);
  return (
    <div>
      <button onClick={() => setCount((c) => c + 1)}>+1</button>
      {children} {/* React は children が変わっていないことを知っている */}
    </div>
  );
};

// 使う側
<Counter>
  <HeavyContent />
</Counter>;
```

### 2. state はできるだけローカルに保つ

```tsx
// ❌ フォームの入力値をグローバル state に置く → アプリ全体が再レンダリング
// ✅ フォームの入力値はそのコンポーネント内の state に留める
```

state を必要以上にリフトアップしない。一時的な状態（フォーム入力、ホバー状態など）はローカルに。

### 3. レンダリングロジックを純粋に保つ

再レンダリングで表示がおかしくなるなら、それはバグ。memo で隠すのではなく、バグを直す。

### 4. 不要な useEffect を避ける

useEffect 内で state を更新すると、連鎖的に再レンダリングが起きる。
多くのパフォーマンス問題の原因はここにある。

### 判断フロー

```text
アプリが遅い？
  └─ No  → memo 不要。再レンダリングは React の正常な挙動
  └─ Yes → React DevTools Profiler でボトルネックを特定
             └─ 上記4原則で解決できるか検討
             └─ それでもダメなら → memo / useMemo / useCallback を導入
```

## 注意点

- memo は**最適化のヒント**であり、保証ではない（React は必要に応じてスキップしないこともある）
- コンポーネント内部で `useState` / `useContext` を使っている場合、それらの変更では memo に関係なく再レンダリングされる
- 過度な memo は逆にパフォーマンスを下げることがある（比較コスト > レンダリングコスト）

## React Compiler（2025〜）

React Compiler 1.0 がリリースされ、memo / [useMemo](useMemo.md) / [useCallback](useCallback.md) を**ビルド時に自動挿入**するようになった。
仕組み自体は変わっていない（浅い比較 + 参照の同一性）。人間が書かなくてよくなっただけ。
現時点では Compiler 未導入のプロジェクトも多いため、手動で書くケースが残っている。

## 参考

- [React 公式: memo](https://ja.react.dev/reference/react/memo)
- [React 公式: Should you add memo everywhere?](https://react.dev/reference/react/memo#should-you-add-memo-everywhere)
- [React 公式: 再レンダリングのスキップ](https://react.dev/reference/react/memo#skipping-re-rendering-when-props-are-unchanged)
