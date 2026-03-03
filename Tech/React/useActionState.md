---
tags:
  - react
  - hooks
  - form
created: 2026-03-03
updated_at: 2026-03-03
status: active
---

# useActionState

React 19で追加されたフック。Actionの結果に基づいてstateを管理する。

内部的にTransitionでラップされるため、`startTransition`を自分で呼ぶ必要がない。

```tsx
const [state, formAction, isPending] = useActionState(fn, initialState, permalink?);
```

## 引数

- `fn` — Actionがトリガーされた時に呼ばれる関数。`(previousState, actionPayload) => newState` のシグネチャ。非同期（async）可、副作用も許容される
- `initialState` — stateの初期値。初回dispatch以降は無視される
- `permalink?`（省略可） — Server Componentでのプログレッシブエンハンスメント用URL。JSが読み込まれる前でもフォーム送信を可能にする

## 戻り値

- `state` — 現在のstate（初回は`initialState`、以降は`fn`の戻り値）
- `formAction` — `<form action={formAction}>` に渡すアクション。または`dispatchAction(payload)`として直接呼び出しも可
- `isPending` — Action実行中かどうかのboolean

## 基本的な使い方

```tsx
import { useActionState } from "react";

async function incrementAction(previousState: number, formData: FormData) {
  return previousState + 1;
}

function Counter() {
  const [count, formAction, isPending] = useActionState(incrementAction, 0);

  return (
    <form action={formAction}>
      <p>Count: {count}</p>
      <button type="submit" disabled={isPending}>
        Increment
      </button>
    </form>
  );
}
```

## 具体的なユースケース

- **フォーム送信とサーバーへのデータ変更**（ユーザー登録、カート更新など）
- **Server Actionsとの連携** — Server Functionを直接`fn`に渡せる
- **エラーハンドリング付きのフォーム** — `fn`の戻り値でエラー状態を管理する

## エラーハンドリング

throwするとキューに溜まった後続のActionもキャンセルされる。stateとしてエラーを返すパターンが推奨される。

```tsx
async function submitAction(prevState: State, formData: FormData) {
  try {
    const result = await submitData(formData);
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
```

## 注意点

- `formAction`は複数回呼んでも**順番に逐次実行**される（並列ではない）
- `formAction`の参照は安定しているため、useEffectの依存配列から省略できる
- Server Functionsと組み合わせる場合、`initialState`と`actionPayload`はシリアライズ可能である必要がある

## useTransitionとの違い

|              | useTransition                        | useActionState                   |
| ------------ | ------------------------------------ | -------------------------------- |
| 目的         | 任意の状態更新を非ブロッキングにする | Actionの結果でstateを管理する    |
| 前回のstate  | 自分で管理が必要                     | `fn`の第一引数で自動的に渡される |
| フォーム連携 | 自分で`startTransition`を呼ぶ        | `<form action>`に直接渡せる      |
| 副作用       | 状態更新のみ                         | 非同期処理・副作用も許容         |

## 関連ノート

- [useTransition](useTransition.md) — 任意の状態更新を非ブロッキングにするフック
- [Server Action 実装パターン](../Next.js/implementation-knowledge/02-server-action-pattern.md) — Next.jsでのuseActionState + useEffect消費パターン、ServerActionState型、2層バリデーション

## 参考

- [useActionState - React公式](https://react.dev/reference/react/useActionState)
- [Server Actions with Conform](https://zenn.dev/akfm/articles/server-actions-with-conform)
- [React 19 useActionState解説](https://dev.classmethod.jp/articles/react-19-understanding-use-action-state/)
- [useActionState解説](https://zenn.dev/tsuboi/articles/0fc94356667284)
- [Next.js Server Action + react-hook-form](https://devblog.thebase.in/entry/2024/12/20/110000)
