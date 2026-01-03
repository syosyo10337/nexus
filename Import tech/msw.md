---
tags:
  - misc
  - testing
  - api
  - tooling
created: 2026-01-04
status: active
---

# msw

結局、環境別にClient componentsはProviderで、serverはトップで起動する。

みたいな形式を撮った。

Next.jsについての設定方法の調査

- Next.js公式は少し古く、appRouter対応していない

[

next.js/examples/with-msw at canary · vercel/next.js

The React Framework. Contribute to vercel/next.js development by creating an account on GitHub.

![](Import%20tech/Attachments/fluidicon%201.png)https://github.com/vercel/next.js/tree/canary/examples/with-msw

![](Import%20tech/Attachments/4602445c-10a2-4903-a360-c96d70531f67.png)](https://github.com/vercel/next.js/tree/canary/examples/with-msw)

- 最も有用だったのはこれ。
    
    - [https://github.com/mswjs/examples/pull/101/files](https://github.com/mswjs/examples/pull/101/files)
        
        [
        
        Next.jsのApp routerでMSWをserver componentsとclient componentsで利用する方法 | SIOS Tech. Lab
        
        こんにちは、サイオステクノロジーの遠藤です。 前回はReact Router v7でMSWを利用する方法を整理
        
        ![](Import%20tech/Attachments/cropped-logo-sios-v.png)https://tech-lab.sios.jp/archives/46863
        
        ![](Import%20tech/Attachments/thumbnail.jpg)](https://tech-lab.sios.jp/archives/46863)
        
    

# 運用段階で検討すること

[

MockServiceWorker（MSW） を使った高速開発のための運用事例 - 弁護士ドットコム株式会社 Creators’ blog

クラウドサイン事業本部の田邉(𝕏@s_tanabe_)です。 フロントエンドの開発に携わっているみなさんは、バックエンドや BFF(Backends For Frontends) の開発を待たずにフロントエンドの開発に取りかかりたいと考えたことはありませんか？ これが実現できると フロントエンドでの不確定性を早いうちに…

![](Import%20tech/Attachments/link%202.png)https://creators.bengo4.com/entry/2024/10/10/083000#Nextjs-%E3%81%A7-MSW-%E3%82%92%E4%BD%BF%E3%81%88%E3%82%8B%E3%82%88%E3%81%86%E3%81%AB%E3%81%99%E3%82%8B

![](Import%20tech/Attachments/20241010084002.png)](https://creators.bengo4.com/entry/2024/10/10/083000#Nextjs-%E3%81%A7-MSW-%E3%82%92%E4%BD%BF%E3%81%88%E3%82%8B%E3%82%88%E3%81%86%E3%81%AB%E3%81%99%E3%82%8B)

# msw x orval

[

【Next.js + Orval + MSW】型安全 API クライアント & モック環境構築

今回初めて技術記事を書いてみました。 Next.js、Orval、MSW に関して気になっている方、ちょっと長いですが、ぜひ最後までお付き合いください！

![](Import%20tech/Attachments/icon%204.png)https://zenn.dev/teamlab_fe/articles/b895776223a3b2

![](Import%20tech/Attachments/og-base-w1200-v2%204.png)](https://zenn.dev/teamlab_fe/articles/b895776223a3b2)

[

Orvalを使ってOpenApiドキュメントからHooksを作成してみる

Orvalという、OpenApiのドキュメントからHooksを自動生成してくれるツールを見つけました。 ツールを使わなければ、httpリクエストのソースコードからHooksの作成までのコードを作成して、 メンテしなければならないところを自動生成してくれます。 他のことに集中でき、ミスも減るので是非使ってみたいなと思いました!!😆

![](Import%20tech/Attachments/icon%204.png)https://zenn.dev/collabostyle/articles/a47d3a31b27650

![](Import%20tech/Attachments/og-base-w1200-v2%205.png)](https://zenn.dev/collabostyle/articles/a47d3a31b27650)

[

MSW の実践活用例

msw の実践で活用する例を紹介します

![](https://azukiazusa.dev/favicon.png)https://azukiazusa.dev/blog/examples-of-msw-practice-Applications/

![](Import%20tech/Attachments/examples-of-msw-practice-Applications.png)](https://azukiazusa.dev/blog/examples-of-msw-practice-Applications/)