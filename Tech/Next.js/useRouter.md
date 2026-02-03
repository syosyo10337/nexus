---
tags:
  - nextjs
  - router
  - page router
created: 2026-01-19
status: active
---

# useRouter in Page Router

`useRouter` は React Hook のため、関数コンポーネント内でのみ使用可能。クラスコンポーネントでは `withRouter` HOC を使用する必要がある。

基本的には Router オブジェクトを直接使用することなく、useRouter 経由で取得すること。
cf. [https://nextjs.org/docs/pages/building-your-application/routing/linking-and-navigating#injecting-the-router](https://nextjs.org/docs/pages/building-your-application/routing/linking-and-navigating#injecting-the-router)

## よく使うプロパティ

- `pathname`: `/pages` 以下のルートファイルに対応するパス名を取得。`basePath`、`locale`、trailing slash は含まれない。
- `query`: クエリパラメータおよび動的ルートパラメータをオブジェクトで取得。プリレンダリング中は空のオブジェクト `{}`。
- `asPath`: ブラウザに表示されている完全なパス（クエリパラメータ含む）を取得。`basePath` と `locale` は含まれない。

## よく使うメソッド

- `push`: Link では不十分なときに使う。useState を適切にリセットしたいときなど特に。
  - cf. [https://nextjs.org/docs/pages/api-reference/functions/use-router#resetting-state-after-navigation](https://nextjs.org/docs/pages/api-reference/functions/use-router#resetting-state-after-navigation)
- `replace`: 履歴スタックを更新せずに現在の URL を置き換える。client-side navigation/getServerSidePropsを再実行
- `reload`: ブラウザの更新ボタンクリックと同等の処理を行う。

## 参考

- [https://nextjs.org/docs/pages/api-reference/functions/use-router](https://nextjs.org/docs/pages/api-reference/functions/use-router)
