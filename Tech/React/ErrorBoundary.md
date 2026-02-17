---
tags:
  - react
  - component
  - error-handling
created: 2026-01-03
updated_at: 2026-02-18
status: active
---

# ErrorBoundary

## 一言で

子コンポーネントツリーのレンダリング中に発生したエラーをキャッチし、フォールバック UI を表示する仕組み。

## なぜ必要か

React はレンダリング中にエラーが発生すると、**コンポーネントツリー全体がアンマウント**されて白い画面になる。
ErrorBoundary を使うと、エラーの影響範囲を限定してフォールバック UI を表示できる。

```text
ErrorBoundary なし:
  エラー発生 → アプリ全体が白画面

ErrorBoundary あり:
  エラー発生 → そのBoundary内だけフォールバック表示、他は正常動作
```

## キャッチできるもの / できないもの

| 種類                       | キャッチ                  |
| -------------------------- | ------------------------- |
| レンダリング中のエラー     | ✅ Yes                    |
| useEffect 内のエラー       | ✅ Yes                    |
| イベントハンドラ内のエラー | ❌ No（try-catch で対処） |
| 非同期処理（async/await）  | ❌ No（try-catch で対処） |
| サーバーサイドレンダリング | ❌ No                     |

## 実装方法

React 本体には関数コンポーネント用の ErrorBoundary API がまだない。
選択肢は 2 つ：

### 1. react-error-boundary ライブラリ（推奨）

```bash
npm install react-error-boundary
```

```tsx
"use client";

import { ErrorBoundary, type FallbackProps } from "react-error-boundary";

function Fallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <div role="alert">
      <p>エラーが発生しました: {error.message}</p>
      <button onClick={resetErrorBoundary}>再試行</button>
    </div>
  );
}

// 使い方
<ErrorBoundary FallbackComponent={Fallback}>
  <SomeComponent />
</ErrorBoundary>;
```

### 2. クラスコンポーネントで自作

```tsx
class ErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error(error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}
```

## Next.js での使い分け

Next.js App Router にはファイルベースのエラーハンドリング機構がある。

```text
ページ全体のエラー     → error.tsx（Next.js の機構）
コンポーネント単位のエラー → ErrorBoundary（react-error-boundary）
```

### error.tsx（ページレベル）

Next.js が自動的に ErrorBoundary でラップしてくれる。

```tsx
// app/dashboard/error.tsx
"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div>
      <h2>Something went wrong!</h2>
      <button onClick={() => reset()}>Try again</button>
    </div>
  );
}
```

### コンポーネントレベル

error.tsx ではカバーできない、特定のコンポーネントだけのエラーハンドリング。

```tsx
"use client";

import type { ReactNode } from "react";
import { ErrorBoundary, type FallbackProps } from "react-error-boundary";

interface ClientErrorBoundaryProps {
  children: ReactNode;
  fallback?: React.ComponentType<FallbackProps>;
  onReset?: () => void;
}

export function ClientErrorBoundary({
  children,
  fallback,
  onReset,
}: ClientErrorBoundaryProps) {
  const FallbackComponent = fallback ?? DefaultFallback;

  return (
    <ErrorBoundary
      FallbackComponent={FallbackComponent}
      {...(onReset && { onReset })}
    >
      {children}
    </ErrorBoundary>
  );
}

function DefaultFallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <div role="alert">
      <h3>エラーが発生しました</h3>
      <p>{error.message}</p>
      <button onClick={resetErrorBoundary}>再試行</button>
    </div>
  );
}
```

## 参考

- [React 公式: Error Boundary](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary)
- [react-error-boundary ライブラリ](https://github.com/bvaughn/react-error-boundary)
- [Next.js: error.js](https://nextjs.org/docs/app/api-reference/file-conventions/error)
- [Next.js のエラーハンドリング](https://zenn.dev/akfm/books/nextjs-basic-principle/viewer/part_5_error_handling)
