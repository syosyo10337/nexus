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

- `push`
- `replace`
- `reload`
- `back`
- `forward`
- `prefetch`

## 参考

- [https://nextjs.org/docs/pages/api-reference/functions/use-router](https://nextjs.org/docs/pages/api-reference/functions/use-router)
