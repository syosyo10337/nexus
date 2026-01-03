---
tags:
  - nextjs
  - routing
  - rendering
  - api
created: 2026-01-03
status: active
---

![](NextJS/Attachments/woodcuts_1.jpg)

![](NextJS/Attachments/next-js-svgrepo-com.svg)

# NEXT.js

---

## TypeScriptを使用したプロジェクトの作成

```Bash
yarn create next-app --example with-typescript random-cat
```

# Next特有の型達

[Next関連の型](NEXT%20js/Next%E9%96%A2%E9%80%A3%E3%81%AE%E5%9E%8B%2015638cdd027d801d871ce3d8faab44e7.html)

[Linkコンポーネント](NEXT%20js/Link%E3%82%B3%E3%83%B3%E3%83%9D%E3%83%BC%E3%83%8D%E3%83%B3%E3%83%88%2018938cdd027d8062a183edb395c0e13e.html)

[https://zenn.dev/hayato94087/books/6a55108faa37ba/viewer/g020a7mv5jy51mss](https://zenn.dev/hayato94087/books/6a55108faa37ba/viewer/g020a7mv5jy51mss)

- currentPathの情報がほしいとき
    
    - `usePathname`
    

parallel data fetchingできるよ。

[https://nextjs.org/learn/dashboard-app/fetching-data#parallel-data-fetching](https://nextjs.org/learn/dashboard-app/fetching-data#parallel-data-fetching)

[Standaloneモードでのビルド](NEXT%20js/Standalone%E3%83%A2%E3%83%BC%E3%83%89%E3%81%A7%E3%81%AE%E3%83%93%E3%83%AB%E3%83%89%2029a38cdd027d80bca5f6e855d0251351.html)

# Static renderingについて

- Faster websites

dataが不要だったり、データがユーザによってshareされているものだったりすると便利。blogポストとかproduct pageであれば、

頻繁に更新されるような値を扱う場合には不向きである。

# Dyanamic Renderingについて

# Partial Prerendering PPR　(experimental)

### debounce

[https://www.npmjs.com/package/use-debounce](https://www.npmjs.com/package/use-debounce)

# Server Actions

“use server”をつけるとserver actionsが使えると

“user client"とするとhooksとかが使えるよ。クライアントコンポーネントになるよ。

何もつけないと、サーバコンポーネントになるよ。

[

Next.jsのServer Actionとreact-hook-formでフォームを実装した - BASEプロダクトチームブログ

はじめに 本記事はBASEアドベントカレンダー2024の20日目の記事です。 Pay IDのフロントエンドエンジニアをしているnojiです。 以前執筆した システムリニューアルでNext.jsのApp Router/Server Actionを使って便利だと思ったところ に記載したように、Pay IDのアカウント管理画…

![](NextJS/Attachments/link.png)https://devblog.thebase.in/entry/2024/12/20/110000

![](NextJS/Attachments/20241218194934.png)](https://devblog.thebase.in/entry/2024/12/20/110000)

### テスト

[

Next.js App Routerを駆使したアプリケーション開発：React Server Componentを使った機能実装とテストの結合 | ドクセル

BuriKaigi2024 https://burikaigi.dev/speakers/024/

![](https://bcdn.docswell.com/assets/images/favicon.ico)https://www.docswell.com/s/junseinagao/KGXPXN-nextjs-app-router-testing-strategy#p46

![](NextJS/Attachments/VJNMRXW378.jpg)](https://www.docswell.com/s/junseinagao/KGXPXN-nextjs-app-router-testing-strategy#p46)

[https://zenn.dev/naofumik/articles/032b3ab4db6c28](https://zenn.dev/naofumik/articles/032b3ab4db6c28)

### クライアント側（モーダル）の責務

1. ユーザーインターフェースの提供

2. フォームの初期値設定

3. クライアント側のバリデーション

4. ユーザー操作の処理（送信、キャンセル）

5. Server Actionsからの返り値に基づく状態更新（成功メッセージ、エラー表示）

### サーバー側（Server Actions）の責務

1. データ検証と変換

2. APIクライアントを用いたバックエンドとの通信

3. エラーハンドリング

4. キャッシュ最適化

5. 結果の返却

# cf

[

Next.jsの考え方

Next.js App Routerにおける設計やベストプラクティスを、筆者なりにまとめました。

![](NextJS/Attachments/icon.png)https://zenn.dev/akfm/books/nextjs-basic-principle

![](NextJS/Attachments/og-base-book_yz4z02.jpeg)](https://zenn.dev/akfm/books/nextjs-basic-principle)

[

Data Fetching: Data Fetching and Caching

Learn best practices for fetching data on the server or client in Next.js.

![](https://nextjs.org/favicon.ico)https://nextjs.org/docs/app/building-your-application/data-fetching/fetching#fetching-data-where-its-needed

![](NextJS/Attachments/docs-og.png)](https://nextjs.org/docs/app/building-your-application/data-fetching/fetching#fetching-data-where-its-needed)

一方サイドナビゲーションやcmd+kで開く検索モーダルのように、リロード復元やURLシェアをする必要がないケースでは、Server Actionsと`useActionState()`の実装が非常に役立つことでしょう。

[

React Server Component のテストと Container / Presentation Separation

React Server Component のテストについて、最近考えていたこと

![](NextJS/Attachments/10fd5c419ac61637245384e7099e131627900034828f4f386bdaa47a74eae156.png)https://quramy.medium.com/react-server-component-%E3%81%AE%E3%83%86%E3%82%B9%E3%83%88%E3%81%A8-container-presentation-separation-7da455d66576

![](NextJS/Attachments/1*vpodlXNe0OlEmfFyebKHiA.jpeg)](https://quramy.medium.com/react-server-component-%E3%81%AE%E3%83%86%E3%82%B9%E3%83%88%E3%81%A8-container-presentation-separation-7da455d66576)

、データを提供する層とそれを表現する層に分離するパターンは**Container/Presentationalパターン**の再来とも言えます。

[https://developers.cyberagent.co.jp/blog/archives/49429/](https://developers.cyberagent.co.jp/blog/archives/49429/)

[https://dev.classmethod.jp/articles/next-js-parallel-routes-intercept-routes/](https://dev.classmethod.jp/articles/next-js-parallel-routes-intercept-routes/)

[https://blog.shinonome.io/next-js-app-routershi-dai-no/](https://blog.shinonome.io/next-js-app-routershi-dai-no/)

[https://dev.classmethod.jp/articles/cm-react-study-meeting-osaka-app-router-keys/](https://dev.classmethod.jp/articles/cm-react-study-meeting-osaka-app-router-keys/)

[App Routerへの段階的移行](NEXT%20js/App%20Router%E3%81%B8%E3%81%AE%E6%AE%B5%E9%9A%8E%E7%9A%84%E7%A7%BB%E8%A1%8C%2022238cdd027d80cd9822ebe389c26ac9.html)

[SSGとgenerateStaticParams](NEXT%20js/SSG%E3%81%A8generateStaticParams%2024538cdd027d8079bb45d10768e36b6e.html)

# Logging戦略について

[Logging戦略について](NEXT%20js/Logging%E6%88%A6%E7%95%A5%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6%2028d38cdd027d8017b06dd5d5fef17c7c.html)

# DataFetch

[

Getting Started: Fetching Data

Learn how to fetch data and stream content that depends on data.

![](https://nextjs.org/favicon.ico?favicon.e9a7e71a.ico)https://nextjs.org/docs/app/getting-started/fetching-data#client-components

![](NextJS/Attachments/docs-og%201.png)](https://nextjs.org/docs/app/getting-started/fetching-data#client-components)

[

use – React

The library for web and native user interfaces

![](NextJS/Attachments/apple-touch-icon.png)https://react.dev/reference/react/use#streaming-data-from-server-to-client

![](NextJS/Attachments/og-reference.png)](https://react.dev/reference/react/use#streaming-data-from-server-to-client)

# env

Client Componentsで参照したい環境変数はNEXT_PUBLICが必要。

このとき、これらの変数はbuild前に設定されている必要がある。  
つまり、containerのビルド後に、実行環境の環境変数として設定する方式だと、動作しない。

[

Guides: Environment Variables

Learn to add and access environment variables in your Next.js application.

![](https://nextjs.org/favicon.ico?favicon.e9a7e71a.ico)https://nextjs.org/docs/app/guides/environment-variables

![](NextJS/Attachments/docs-og%202.png)](https://nextjs.org/docs/app/guides/environment-variables)

あー NEXT_PUBLIC変数を理解していなかったわ。

1. Next.js: NEXT_PUBLIC_*変数はビルド時にクライアント側コードに埋め込まれる

2. Kubernetes: 環境変数は実行時に設定される

3. Docker build: ビルド時には環境変数が存在しない

→ 結果として、クライアント側では環境変数がundefinedになるこれありそう[https://nextjs.org/docs/pages/guides/environment-variables#bundling-environment-variables-for-the-browser](https://nextjs.org/docs/pages/guides/environment-variables#bundling-environment-variables-for-the-browser) （編集済み）

[![](https://slack-imgs.com/?c=1&o1=wi32.he32.si&url=https%3A%2F%2Fnextjs.org%2Ffavicon.ico)](https://slack-imgs.com/?c=1&o1=wi32.he32.si&url=https%3A%2F%2Fnextjs.org%2Ffavicon.ico)

**nextjs.org**

**[Guides: Environment Variables | Next.js](https://nextjs.org/docs/pages/guides/environment-variables#bundling-environment-variables-for-the-browser)**

Learn to add and access environment variables in your Next.js application. (23 kB)

### RuntimeEnvという選択肢

[

Env

Never build your apps with invalid environment variables again. Validate and transform your environment with the full power of Zod.

![](NextJS/Attachments/favicon.ico)https://env.t3.gg/

![](NextJS/Attachments/opengraph-image.png)](https://env.t3.gg/)

[

How To Strongly Type process.env

Learn how to strongly type process.env in TypeScript by either augmenting global type or validating it at runtime with t3-env.

![](https://www.totaltypescript.com/favicon.ico)https://www.totaltypescript.com/how-to-strongly-type-process-env

![](NextJS/Attachments/og-default.png)](https://www.totaltypescript.com/how-to-strongly-type-process-env)

# Rendering

[https://nextjs.org/docs/app/guides/caching#static-and-dynamic-rendering](https://nextjs.org/docs/app/guides/caching#static-and-dynamic-rendering)

# 画像のアップロードについて

```TypeScript
/**
 * 異なるスキーマ型とImageUploader間のアダプター層
 * この層で型変換の責務を集約し、変更の影響を局所化する
 */

import type { ImageValue } from '@/shared/components/ui/image-uploader/types'
import { IMAGE_FIELD_TYPES, type ImageFieldValue } from '@/shared/validators/image-field'

/**
 * Zod discriminated union → ImageUploader value
 */
function fromImageFieldValue(value: ImageFieldValue): ImageValue {
  if (!value) return undefined

  switch (value.type) {
  case IMAGE_FIELD_TYPES.EXISTING:
    return value.url
  case IMAGE_FIELD_TYPES.NEW:
    return value.file
  case IMAGE_FIELD_TYPES.EMPTY:
    return null
  default:
    return undefined
  }
}

/**
 * ImageUploader value → Zod discriminated union
 */
function toImageFieldValue(value: ImageValue): ImageFieldValue {
  if (!value || value === null) {
    return { type: 'empty' }
  }

  if (typeof value === 'string') {
    return { type: IMAGE_FIELD_TYPES.EXISTING, url: value }
  }

  if (value instanceof File) {
    return { type: IMAGE_FIELD_TYPES.NEW, file: value }
  }

  return { type: IMAGE_FIELD_TYPES.EMPTY }
}

// Zodスキーマ用のアダプター
export const zodImageAdapter = {
  fromSchema: fromImageFieldValue,
  toSchema: toImageFieldValue,
}
```