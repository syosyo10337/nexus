---
tags:
  - html-css
  - html
  - css
created: 2026-01-04
status: active
---

# @apply

**Tailwindユーティリティを再利用する機能**  

`@apply`は、既存のユーティリティクラスを独自のカスタムCSSクラスにインライン化するディレクティブです [Bloggie](https://bloggie.io/@kinopyo/organize-your-css-in-the-tailwind-style-with-layer-directive)[DEV Community](https://dev.to/githubmor/what-the-heck-are-layer-in-tailwind-and-how-i-finally-got-it-380j):

```CSS
@layer components {
  .btn-primary {
    @apply py-2 px-5 bg-violet-500 text-white font-semibold rounded-full;
    @apply hover:bg-violet-700 focus:ring focus:ring-violet-400;
  }
}
```

```CSS
<!-- Before -->
<button class="py-2 px-5 bg-violet-500 text-white font-semibold rounded-full hover:bg-violet-700">
  Save
</button>

<!-- After -->
<button class="btn-primary">Save</button>
```

  

## 注意したい用法

> **[Avoiding premature abstraction](https://v3.tailwindcss.com/docs/reusing-styles#avoiding-premature-abstraction)**

> Whatever you do, **don’t use** `**@apply**` **just to make things look “cleaner”**. Yes, HTML templates littered with Tailwind classes are kind of ugly. Making changes in a project that has tons of custom CSS is worse.