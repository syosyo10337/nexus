---
tags:
  - html-css
  - html
  - css
created: 2026-01-04
status: active
---

# @layer

~~Tailwindは、CSSを**3つの論理的な「レイヤー」**に分けて整理します: base/components/utilities~~

つまり、特別な意味を持つことなく、ただのレイヤー名として機能します。

v3では、tailwindがハイジャックしていましたが、v4では、cssの @layerになったので、 @utiltiyを使ってくださいね。

```CSS
@layer base {
  /* HTML要素のデフォルト */
  h1 {
    font-size: var(--text-2xl);
  }
  
  h2 {
    font-size: var(--text-xl);
  }
  
  body {
    background-color: var(--color-background);
    color: var(--color-foreground);
  }
}
```

```CSS
@layer components - 複雑なコンポーネントクラス(あまり使わない)
用途:

複数のプロパティを持つ複雑なクラス
サードパーティライブラリのスタイル上書き
Tailwindの推奨: React/Vueコンポーネントを使う方が良い

css@layer components {
  /* 複雑なカードコンポーネント */
  .card {
    background-color: var(--color-white);
    border-radius: var(--radius-lg);
    padding: --spacing(6);
    box-shadow: var(--shadow-xl);
  }
  
  /* サードパーティライブラリのカスタマイズ */
  .select2-dropdown {
    border-radius: var(--radius-md);
  }
}
✅ 適用範囲: HTMLで明示的にクラスを指定
html<div class="card">カード</div>
<div class="card rounded-none">ユーティリティで上書き可能</div>
```

## 主なメリット

### a) **CSS詳細度の問題を自動解決**

`@layer`を使うと、Tailwindが自動的にスタイルを適切な位置に配置し、詳細度の問題を避けられます [tailwindcss](https://tailwindcss.com/docs/adding-custom-styles)。

```CSS
/* 順番を気にしなくてOK */
@layer components {
  .btn-blue { 
    @apply bg-blue-500 text-white;
  }
}
```

### b) **ユーティリティクラスでオーバーライド可能**

`components`レイヤーに定義したスタイルは、後からユーティリティクラスで上書きできます [tailwindcss](https://tailwindcss.com/docs/adding-custom-styles):

```CSS
<!-- bg-green-500 が .btn-blue の背景色を上書きする -->
<button class="btn-blue bg-green-500">Button</button>
```

### c) **Tree-shaking(未使用CSS削除)が効く**

@layerの中に定義したスタイルは、実際に使われていない場合、本番ビルド時に自動削除されます [Bloggie](https://bloggie.io/@kinopyo/organize-your-css-in-the-tailwind-style-with-layer-directive)[Tailwind CSS](https://v3.tailwindcss.com/docs/adding-custom-styles)。

```CSS
@layer components {
  /* HTMLで使っていなければ削除される */
  .unused-card { /* ... */ }
}
```

### d) **Tailwindのバリアント(hover:, md:など)が使える**

@layerで定義したクラスに、`hover:`や`md:`などの修飾子を使えます [Stack Overflow](https://stackoverflow.com/questions/74429397/what-is-the-purpose-of-the-tailwind-layer-directive):

```CSS
<button class="hover:btn-blue sm:btn-blue">Button</button>
```