 

# displayNameの必要性

## `displayName` プロパティとは

typescript

`WhatUpLine.displayName = "WhatUpLine";`

これは **Reactコンポーネントのデバッグ用プロパティ** です。

### 主な用途

**🟢React DevToolsでの表示名の設定**

- React Developer Toolsでコンポーネントツリーを見るときに、この名前が表示されます

- 特に無名関数やHOC(Higher-Order Components)でラップされたコンポーネントで有用です

### 具体例

```TypeScript
// ケース1: 通常の名前付きコンポーネント（displayNameは不要）
function WhatUpLine() {
  return <div>Hello</div>;
}
// React DevToolsでは自動的に "WhatUpLine" と表示される// ケース2: 無名関数で定義した場合（displayNameが役立つ）
const WhatUpLine = () => {
  return <div>Hello</div>;
};
WhatUpLine.displayName = "WhatUpLine";
// これがないと "Anonymous" や "_c" などと表示される可能性がある// ケース3: HOCでラップされた場合（displayNameが特に重要）
const WhatUpLine = memo(() => {
  return <div>Hello</div>;
});
WhatUpLine.displayName = "WhatUpLine";
// これがないと "Memo" とだけ表示され、どのコンポーネントか分からない
```

### いつ使うべきか

**必須ではない場合:**

- 通常の名前付き関数コンポーネント

- クラスコンポーネント（自動的にクラス名が使われる）

**推奨される場合:**

- `React.memo()` でラップしたコンポーネント

- `forwardRef()` でラップしたコンポーネント

- HOC（Higher-Order Components）を使用する場合

- 無名関数で定義したコンポーネント

### ベストプラクティス

**🟢公式推奨アプローチ:**

```TypeScript
// memo使用時
const WhatUpLine = memo(() => {
  return <div>Hello</div>;
});
WhatUpLine.displayName = "WhatUpLine";

// forwardRef使用時
const WhatUpLine = forwardRef((props, ref) => {
  return <div ref={ref}>Hello</div>;
});
WhatUpLine.displayName = "WhatUpLine";
```