 

![](StoryBook/storybook-icon-svgrepo-com.svg)

# StoryBook

# CSF

component story format

# Args

引数で、propsをコントールするためのプロパティ、

sizeや中に入れるテキストを維持れるコンポーネントであれば、それらの値をargに指定してあげると、自動でそのprops画渡ったコンポーネントを描画してくれる。

あとはargTypesを指定することで、storybook上での、propsの制御がしやすくなります。selectboxの見た目にするとかね。(何も指定しないと、Objectになるらしいから。)

[https://storybook.js.org/docs/writing-stories/args#story-args](https://storybook.js.org/docs/writing-stories/args#story-args)

[Titleの自動付与](StoryBook/Title%E3%81%AE%E8%87%AA%E5%8B%95%E4%BB%98%E4%B8%8E%202b038cdd027d80989a39fde48c747cbd.html)

# Parameters

[

Parameters | Storybook docs

Storybook is a frontend workshop for building UI components and pages in isolation. Thousands of teams use it for UI development, testing, and documentation. It's open source and free.

![](Import%20tech/Attachments/icon.svg)https://storybook.js.org/docs/api/parameters#available-parameters

![](Import%20tech/Attachments/opengraph-image.jpg)](https://storybook.js.org/docs/api/parameters#available-parameters)

# tips:コンテクストのリフレッシュ

`mount`を使うらしい。

vitestでいうところの `cleanup`です。

```CSS

describe('EventPublishModal インタラクションテスト', () => {
  beforeEach(() => {
    cleanup() // 各テスト前にDOMをクリーンアップ
  })
```

[

Interaction tests | Storybook docs

Storybook is a frontend workshop for building UI components and pages in isolation. Thousands of teams use it for UI development, testing, and documentation. It's open source and free.

![](Import%20tech/Attachments/icon.svg)https://storybook.js.org/docs/writing-tests/interaction-testing#run-code-before-the-component-gets-rendered

![](Import%20tech/Attachments/opengraph-image.jpg)](https://storybook.js.org/docs/writing-tests/interaction-testing#run-code-before-the-component-gets-rendered)

# tips:canvasとscreenの利用。

canvasはstoryのrootを見れる。

dialogなどstory rootの外の要素にアクセスするようなときは、screenを使ってね。

[

Play function | Storybook docs

Storybook is a frontend workshop for building UI components and pages in isolation. Thousands of teams use it for UI development, testing, and documentation. It's open source and free.

![](Import%20tech/Attachments/icon.svg)https://storybook.js.org/docs/writing-stories/play-function#working-with-the-canvas

![](Import%20tech/Attachments/opengraph-image.jpg)](https://storybook.js.org/docs/writing-stories/play-function#working-with-the-canvas)

### canvasElementsやwithinでの絞り込みは過去のもの？らしい。

[

Interaction tests | Storybook docs

Storybook is a frontend workshop for building UI components and pages in isolation. Thousands of teams use it for UI development, testing, and documentation. It's open source and free.

![](Import%20tech/Attachments/icon.svg)https://storybook.js.org/docs/writing-tests/interaction-testing

![](Import%20tech/Attachments/opengraph-image.jpg)](https://storybook.js.org/docs/writing-tests/interaction-testing)

## Controlアドオン

[

Controls • Storybook docs

Storybook is a frontend workshop for building UI components and pages in isolation. Thousands of teams use it for UI development, testing, and documentation. It’s open source and free.

![](https://storybook.js.org/icons/icon-512x512.png?v=eac3ed5255c5d69cad47bb7ed6ce3dbf)https://storybook.js.org/docs/essentials/controls

![](https://storybook.js.org/images/social/open-graph.jpg)](https://storybook.js.org/docs/essentials/controls)

[

ArgTypes • Storybook docs

Storybook is a frontend workshop for building UI components and pages in isolation. Thousands of teams use it for UI development, testing, and documentation. It’s open source and free.

![](https://storybook.js.org/icons/icon-512x512.png?v=eac3ed5255c5d69cad47bb7ed6ce3dbf)https://storybook.js.org/docs/api/arg-types

![](https://storybook.js.org/images/social/open-graph.jpg)](https://storybook.js.org/docs/api/arg-types)

# Nextでの使い方。

[

StorybookでuseRouter()を使ったらエラーが出た！

こちらに'Storybookは「UIカタログ」です。それぞれのUIコンポーネントをブラウザで手軽にチェックすることができます。'と書いてありました！

![](Import%20tech/Attachments/icon%202.png)https://zenn.dev/yumemi9808/articles/c02735804c4f36

![](Import%20tech/Attachments/og-base-w1200-v2%203.png)](https://zenn.dev/yumemi9808/articles/c02735804c4f36)

[

Storybook for Next.js | Storybook docs

Storybook is a frontend workshop for building UI components and pages in isolation. Thousands of teams use it for UI development, testing, and documentation. It's open source and free.

![](Import%20tech/Attachments/icon.svg)https://storybook.js.org/docs/9/get-started/frameworks/nextjs#with-vite

![](Import%20tech/Attachments/opengraph-image.jpg)](https://storybook.js.org/docs/9/get-started/frameworks/nextjs#with-vite)

windowはあるのに typeof windowはtrue問題

https://github.com/storybookjs/storybook/issues/32028

# Play function

Interaction addon

[https://storybook.js.org/blog/storybook-8-3/](https://storybook.js.org/blog/storybook-8-3/)

# Vitestとの統合

stoyrbook/test-addonをviteベースのstorybookで実行するとき、

1. viteベースのでStorybookUIでのinteractionテスト

2. vitest CLI(PlaywrightのChromiumブラウザ)でのテスト実行がある。

### mockの仕方

vi.mockがstorybookでは聞きません。vitestではなくstoorybookなので,,

* nextの機能はparameterとして渡せたりします*

[

Mocking modules | Storybook docs

Storybook is a frontend workshop for building UI components and pages in isolation. Thousands of teams use it for UI development, testing, and documentation. It's open source and free.

![](Import%20tech/Attachments/icon.svg)https://storybook.js.org/docs/writing-stories/mocking-data-and-modules/mocking-modules

![](Import%20tech/Attachments/opengraph-image.jpg)](https://storybook.js.org/docs/writing-stories/mocking-data-and-modules/mocking-modules)

[

Mocking modules | Storybook docs

Storybook is a frontend workshop for building UI components and pages in isolation. Thousands of teams use it for UI development, testing, and documentation. It's open source and free.

![](Import%20tech/Attachments/icon.svg)https://storybook.js.org/docs/writing-stories/mocking-data-and-modules/mocking-modules

![](Import%20tech/Attachments/opengraph-image.jpg)](https://storybook.js.org/docs/writing-stories/mocking-data-and-modules/mocking-modules)

[https://tech.mirrativ.stream/entry/2024/11/22/120000](https://tech.mirrativ.stream/entry/2024/11/22/120000)

[

scaffdog - Markdown driven scaffolding tool.

Markdown driven scaffolding tool. scaffdog speeds up the first steps of your creative activity.

![](https://scaff.dog/favicon.ico)https://scaff.dog/

![](Import%20tech/Attachments/ogp.png)](https://scaff.dog/)

composeStoryベースで、UIカタログとして存在するものを正とした上で、テストを書く。方針にしたいが、Storybookとvitestの実行環境に差異がある。mswもどちらも設定する必要がある。

[

テスト戦略のアンチパターンにハマっていたけど、学びは多かった話｜PharmaX Blog

こんにちは。 PharmaXのエンジニアの古家（@enzerubank）です！ 普段PharmaXではスクラムマスターをやったり、Webフロントエンドのテックリードをやったりしています。 今日は自分がフロントエンドのテスト戦略を考えた時にアンチパターンにハマった話をしたいと思います。 また最初に考えたテスト戦略はこちらです！ こちらも合わせて読んでもらえるとより前提が理解しやすいかと思います。 新規事業の開発チームにフロントのテストを導入した際の初期設計 - Qiita はじめに こんにちは。PharmaX株式会社エンジニアの古家です。 この記事はPharmaXアドベ

![](Import%20tech/Attachments/android-chrome-512x512.png)https://note.com/pharmax/n/n397eee6486d5#c4936ebf-1f1a-45ad-9898-6f5a346b6390

![](Import%20tech/Attachments/rectangle_large_type_2_2800e04d982a6f20994f80dc90dff5ef.png)](https://note.com/pharmax/n/n397eee6486d5#c4936ebf-1f1a-45ad-9898-6f5a346b6390)

[

薬急便におけるフロントエンド・テストガイドライン | CyberAgent Developers Blog

はじめに こんにちは、株式会社 MG-DX で Web フロントエンドエンジニアをしている柳萬真伸で ...

![](Import%20tech/Attachments/cropped-ca-192x192.png)https://developers.cyberagent.co.jp/blog/archives/51490/

![](Import%20tech/Attachments/17db55667deaaf8db8a6f6cac09f8a72-2.png)](https://developers.cyberagent.co.jp/blog/archives/51490/)

[

プロダクト特性を理解したフロントエンドテスト戦略 - バイセル Tech Blog

プロダクト特性を理解したフロントエンドテスト戦略 はじめに 背景と課題 あるべき姿 プロダクトについて理解を深める テスト観点 テスト分類 テストの優先順位 テスト戦略を決めた効果 今後の展望 まとめ はじめに こんにちは、開発1部で出張訪問アプリケーションVisitの開発担当をしている望月です。 今回は、Visitチ…

![](Import%20tech/Attachments/link%201.png)https://tech.buysell-technologies.com/entry/2025/03/26/120000

![](Import%20tech/Attachments/20250321191108.png)](https://tech.buysell-technologies.com/entry/2025/03/26/120000)

# テストを書く

[Component testって？](StoryBook/Component%20test%E3%81%A3%E3%81%A6%EF%BC%9F%2028838cdd027d801fab61dfc3989b505b.html)

[Querying canvas object](StoryBook/Querying%20canvas%20object%2028838cdd027d80dd8b24e1d8081e43a3.html)

[migration v8→v9](StoryBook/migration%20v8%E2%86%92v9%202a738cdd027d802799d1fce70f060a8a.html)

# RSC on Storybook

[

storybook-rsc-demo/app at main · storybookjs/storybook-rsc-demo

Project demo to showcase Storybook's new module mocking functionality - storybookjs/storybook-rsc-demo

![](Import%20tech/Attachments/fluidicon.png)https://github.com/storybookjs/storybook-rsc-demo/tree/main/app

![](Import%20tech/Attachments/storybook-rsc-demo.png)](https://github.com/storybookjs/storybook-rsc-demo/tree/main/app)

# SB　playwrightのbroserモードをうまく記入できるように

[[birpc] rpc is closed, cannot call "onCancel"](StoryBook/%5Bbirpc%5D%20rpc%20is%20closed,%20cannot%20call%20onCancel%202b038cdd027d805db8c2de89838a18f0.html)

# MCPサーバ統合

https://github.com/storybookjs/mcp

[https://storybook.js.org/addons/@storybook/addon-mcp](https://storybook.js.org/addons/@storybook/addon-mcp)

````Shell

## アーキテクチャ

```
┌─────────────────────────────────────────────────┐
│  Cursor / AI Development Environment            │
│                                                  │
│  ┌──────────────────────────────────────────┐  │
│  │  AI Assistant (Claude)                   │  │
│  │  - コンポーネント情報を参照              │  │
│  │  - 一貫性のあるコード生成                │  │
│  └──────────────────────────────────────────┘  │
│                     ↓ HTTP                      │
└─────────────────────┼───────────────────────────┘
                      │
                      │ http://localhost:6006/mcp
                      ↓
┌─────────────────────────────────────────────────┐
│  Docker Container (storybook service)           │
│                                                  │
│  ┌──────────────────────────────────────────┐  │
│  │  Storybook Dev Server (0.0.0.0:6006)     │  │
│  │  - @storybook/addon-mcp                  │  │
│  │  - /mcp エンドポイント                   │  │
│  └──────────────────────────────────────────┘  │
│                                                  │
│  ポートマッピング: 127.0.0.1:6006 → 6006        │
└────────
````