---
tags:
  - nextjs
  - router
  - page router
created: 2026-01-19
status: active
---

# useRouter in Page Router

router インスタンスを取得する、`withRouter`で取得することも可能らしい。

## `router`object

## よく使うプロパティ

- `pathname`: パス名だけを取得する `pages`
- `query`: クエリパラメータを取得する
- `asPath`: ブラウザに表示されているサーチパラメータを含めた値を取得します。`basePath`/`locale`は含まれません。

## よくつかうメソッド

- `push`: Link では不十分なときに使う。useState を適切にリセットしたいときなど特に。
  - cf. [https://nextjs.org/docs/pages/api-reference/functions/use-router#resetting-state-after-navigation](https://nextjs.org/docs/pages/api-reference/functions/use-router#resetting-state-after-navigation)
- `replace`: 履歴を差し替える。
- `reload`: browser の更新ボタンクリックと同等の処理を行う。

## 参考

- [https://nextjs.org/docs/pages/api-reference/functions/use-router](https://nextjs.org/docs/pages/api-reference/functions/use-router)
