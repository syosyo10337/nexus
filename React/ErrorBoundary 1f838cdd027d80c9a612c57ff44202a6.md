 

# <ErrorBoundary>

Next.jsだとページレベルでは、エラーをハンドルできるが、コンポーネント単位でのハンドルはできない。

現状はクラスベースのバウンダリーコンポーネントを自前するか `[react-error-boundary](https://github.com/bvaughn/react-error-boundary#readme)` [ライブラリ](https://github.com/bvaughn/react-error-boundary#readme)を使う必要がありそう。

[https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary)

[https://qiita.com/kazukiiii/items/a08dbcf1a2d72b73267b](https://qiita.com/kazukiiii/items/a08dbcf1a2d72b73267b)

[

エラーハンドリング｜Next.jsの考え方

![](React/Attachments/icon.png)https://zenn.dev/akfm/books/nextjs-basic-principle/viewer/part_5_error_handling

![](React/Attachments/og-base-book_yz4z02.jpeg)](https://zenn.dev/akfm/books/nextjs-basic-principle/viewer/part_5_error_handling)

[

File-system conventions: error.js

API reference for the error.js special file.

![](https://nextjs.org/favicon.ico)https://nextjs.org/docs/app/api-reference/file-conventions/error#how-errorjs-works

![](React/Attachments/docs-og.png)](https://nextjs.org/docs/app/api-reference/file-conventions/error#how-errorjs-works)