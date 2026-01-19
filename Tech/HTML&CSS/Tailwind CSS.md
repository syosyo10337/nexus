---
tags:
  - html-css
  - html
  - css
  - layout
created: 2026-01-04
updated: 2026-01-19
status: active
---

# v4 CSS first なconfiguration

- [https://tailwindcss.com/docs/theme](https://tailwindcss.com/docs/theme)

＠themeに書くと、cssvariableとして参照できるよ。

- 雑感。

  - ダークモードが使える

    ```PHP
    <body class="bg-white dar:bg-gray-900">
    ```

  - hover時などの色の変化も`hover:`プレフィックスで使用できる

  - responsiveにも対応できる。(mediaクエリいらない)

  - スタイルを再利用する機能がある。`@apply`など

  - pixelパーフェクトにもできるって

  - flexをつけるとその要素がフレックコンテナになる。  
        e.g.)このときのcontainerはflexボックスとは関係ない

    ```HTML
    <div class="container mx-auto">
          <nav class="p-4 flex item-center justify-between">
            <div>x</div>
            <div>x</div>
            <div>x</div>
          </nav>
    ```

  - containerとつけるとpaddingを少々使うことができる。

## 文字の折返し

[break-words/ overflow-wrap: break-word;で折返しが効かない](Tailwind%20CSS/break-words%20overflow-wrap%20break-word;%E3%81%A7%E6%8A%98%E8%BF%94%E3%81%97%E3%81%8C%E5%8A%B9%E3%81%8B%E3%81%AA%E3%81%84%202b238cdd027d80c59e23ccbd0b6f84e6.html)

## grid layoutの使い方 in tailwind

e.g.)

```HTML
<div class="grid grid-cols-3 gap-4">
    <Box v-for="listing in listings" :key="listing.id">
      <div>
        <Link :href="route('listing.show', listing.id)">
          <ListingAddress :listing="listing" />
        </Link>
      </div>
      <div>
        <Link :href="route('listing.edit', listing.id)">Edit</Link>
      </div>
      <div>
        <Link :href="route('listing.destroy', listing.id)" method="delete" as="button">delete</Link>
      </div>
    </Box>
  </div>
```

- grid-cols-{n}を使うことで、n等分された幅のカラムを作成する。

> Use the `**grid-cols-{n}**` utilities to create grids with _n_ equally sized columns.

- gap-{n}を使うことで、隙間を調整できる。(このときの値は12としても画面いっぱいといういみではない。)

- gridを付与したクラスが、グリッドレイアウトの枠を作成する。

- その下の要素をどのように並べるかについては、grid-cols-{n}やgap-の値で調整する

- `grid-span-{n}`とすることで、グリッドレイアウトで指定した値のうち、どれくらいの割合を使用するかと決めることができる。

- `text-center`はtex-align:centerのこと

- .w-full { witdh: 100% }

mdなどの指定すると、デフォルトの値 < （mdの幅）mdの指定の値を用いる。

```HTML
e.g.)<!-- mdの幅までは、画像が下になり、文字が上になる --!>

<div class="flex flex-col-reverse md:grid grid-cols-12 gap-4">
    <Box class="md:col-span-7 flex items-center w-full">
      <div class="w-full text-center font-medium text-gray-500">No images</div>
    </Box>
    <Box class="md:col-span-5">
      <Price :price="listing.price" class="text-2xl" />
      <ListingSpace :listing="listing" class="text-lg" />
      <ListingAddress :listing="listing" class="text-gray-500"/>
    </Box>
  </div>
```

## flex

- item-centerは`align-items: center`のこと

```CSS
左側: flex-1 min-w-0 → 縮小可能

flex-1 は以下のショートハンドです：
flex-grow: 1 - 利用可能なスペースを埋める
flex-shrink: 1 - 必要に応じて縮小可能
flex-basis: 0% - 初期サイズを0から開始

右側: flex-shrink-0 → 縮小しない（金額とバッジの最小幅を確保）
```

## カスタムスタイルを当てたいと思ったとき

**推奨される優先順位**:

1. Tailwindユーティリティを直接使う(インラインクラス)

2. React/Vueコンポーネントで抽象化

3. `@layer` / `@utility`でカスタムクラス作成

    1. layerで、[https://tailwindcss.com/docs/adding-custom-styles#adding-base-styles](https://tailwindcss.com/docs/adding-custom-styles#adding-base-styles) それぞれのレイヤーに必要なutiltityクラスを定義できる。

        1. [https://tailwindcss.com/docs/upgrade-guide#adding-custom-utilities](https://tailwindcss.com/docs/upgrade-guide#adding-custom-utilities)

    2. 何度も利用する場合には、utilityを使う。

4. 最小限の`@apply`使用

5. 通常のCSS(必要な場合のみ)

[

Adding custom styles - Core concepts

Best practices for adding your own custom styles in Tailwind projects.

![](HTML&CSS/styling/Attachments/apple-touch-icon%202.png)<https://tailwindcss.com/docs/adding-custom-styles>

![](HTML&CSS/styling/Attachments/og%202.png)](<https://tailwindcss.com/docs/adding-custom-styles>)

## at-rules

cf. [https://developer.mozilla.org/en-US/docs/Web/CSS/At-rule](https://developer.mozilla.org/en-US/docs/Web/CSS/At-rule)

[@layer](Tailwind%20CSS/@layer%202a838cdd027d8026a0c3fa978756763d.html)

[@apply](Tailwind%20CSS/@apply%202a838cdd027d8061831dcc86299c201a.html)

[@utility](Tailwind%20CSS/@utility%202a838cdd027d80f9b9c7c169b7c6584d.html)

# v4での変更点

[🚧theme: じゃなくてvarをつかう。](Tailwind%20CSS/theme%20%E3%81%98%E3%82%83%E3%81%AA%E3%81%8F%E3%81%A6var%E3%82%92%E3%81%A4%E3%81%8B%E3%81%86%E3%80%82%2029338cdd027d80ce9532cc53ed5efa15.html)

# Image

[https://tailwindcss.com/docs/object-fit](https://tailwindcss.com/docs/object-fit)

# Shadcn/uiとの互換性

darkモードと使い分けるなら。 @theme　inlineと :rootでの変数定義を分ける。

[

Tailwind v4 and React 19 · shadcn-ui ui · Discussion #6714

It’s here! Tailwind v4 and React 19. Ready for you to try out. TLDR If you&#39;re starting a new project with Tailwind v4 and React 19, use the canary version of the command-line: npx shadcn@canary...

![](HTML&CSS/styling/Attachments/fluidicon.png)<https://github.com/shadcn-ui/ui/discussions/6714>

![](HTML&CSS/styling/Attachments/6714.png)](<https://github.com/shadcn-ui/ui/discussions/6714>)

[

Tailwind v4

How to use shadcn/ui with Tailwind v4 and React 19.

![](https://ui.shadcn.com/favicon.ico)<https://ui.shadcn.com/docs/tailwind-v4#1-follow-the-tailwind-v4-upgrade-guide>

![](HTML&CSS/styling/Attachments/og%203.png)](<https://ui.shadcn.com/docs/tailwind-v4#1-follow-the-tailwind-v4-upgrade-guide>)
