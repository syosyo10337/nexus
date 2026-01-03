---
tags:
  - react
  - component
  - styling
  - server
created: 2026-01-03
status: active
---

# renderingってなんだ？

レンダリングとは、日本語にすると描画する。とか訳される。これはbrowser rendering(paintと表現したりする。)

ただし、browserがHTMLをcssやJSと一緒に表示する。ときに言われる描画する。とは異なります。

`rendering engine`でいわれる内容とも少し異なるらしい。

# React語としてのrender

**「レンダー」とは、React がコンポーネントを呼び出すことです。**

[

レンダーとコミット – React

The library for web and native user interfaces

![](React/Attachments/apple-touch-icon%201.png)https://ja.react.dev/learn/render-and-commit

![](og-learn.png)](https://ja.react.dev/learn/render-and-commit)

ただし！SSRで登場で、Hydrationという概念とともに、serverでstatig HTMLが生成されるようになりました。

CSR ↔ SSR

SSRが SSG/ ISR/ RSC

## 業界標準の理解 ✅

Next.js公式ドキュメント(最新)やReact公式ドキュメントでは:

- **Client Components** = "クライアント側でインタラクティブ性が必要なコンポーネント"

- サーバーとクライアントの両方でレンダリングされる

- SSR + Hydrationのハイブリッドアプローチ

dynamic renderingとは？SSGについて

[![](4-wire-diagram-rsc-rendering-lifecycle.jpg)](rendering%E3%81%A3%E3%81%A6%E3%81%AA%E3%82%93%E3%81%A0%EF%BC%9F/4-wire-diagram-rsc-rendering-lifecycle.jpg)