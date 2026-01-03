---
tags:
  - typescript
  - type-system
  - syntax
  - function
created: 2026-01-03
status: active
---

![](TypeScript/Attachments/eslint.svg)

# ESLint

[https://qiita.com/Shilaca/items/c494e4dc6b536a5231de](https://qiita.com/Shilaca/items/c494e4dc6b536a5231de)

# Prettierの代わりにStylisticを使う

[

ESLint Stylistic

Stylistic Formatting for ESLint

![](TypeScript/Attachments/logo.svg)https://eslint.style/packages/default

![](TypeScript/Attachments/og.png)](https://eslint.style/packages/default)

[https://eslint.style/guide/why](https://eslint.style/guide/why)

[https://developers.cyberagent.co.jp/blog/archives/50143/](https://developers.cyberagent.co.jp/blog/archives/50143/)

設定例

```JavaScript
import stylistic from '@stylistic/eslint-plugin'

/**
 * @stylistic/eslint-plugin の設定ファイル
 * NOTE: Prettierの代わりにフォーマットとして適用する。
 * 推奨設定を適用しつつ、必要に応じて調整する。
 *
 * @see https://eslint.style/packages/default#rules
 * @see https://github.com/eslint-stylistic/eslint-stylistic/blob/main/packages/eslint-plugin/configs/index.ts
 */
export const stylisticConfig = {
  ...stylistic.configs.recommended,
  rules: {
    ...stylistic.configs.recommended.rules,
    '@stylistic/max-len': ['error', {
      code: 120,
      ignoreComments: true,
      ignoreUrls: true,
      ignoreStrings: true,
      ignoreTemplateLiterals: true,
      ignoreRegExpLiterals: true,
    }],
    '@stylistic/function-call-argument-newline': ['error', 'consistent'],
    '@stylistic/function-paren-newline': ['error', 'multiline-arguments'],
    // 以下は、recommendedの設定から上書き
    '@stylistic/brace-style': ['error', '1tbs', { allowSingleLine: true }],
    '@stylistic/indent': ['error', 2, {
      ArrayExpression: 1,
      CallExpression: { arguments: 1 },
      flatTernaryExpressions: false,
      FunctionDeclaration: { body: 1, parameters: 1 },
      FunctionExpression: { body: 1, parameters: 1 },
      ignoreComments: false,
      ignoredNodes: [
        'TSUnionType',
        'TSIntersectionType',
        'TSTypeParameterInstantiation',
        'FunctionExpression > .params[decorators.length > 0]',
        'FunctionExpression > .params > :matches(Decorator, :not(:first-child))',
      ],
      ImportDeclaration: 1,
      MemberExpression: 1,
      ObjectExpression: 1,
      offsetTernaryExpressions: true,
      outerIIFEBody: 1,
      SwitchCase: 0, // 上書き
      tabLength: 2,
      VariableDeclarator: 1,
    }],
    '@stylistic/jsx-max-props-per-line': ['error', { maximum: 1 }],
    '@stylistic/jsx-one-expression-per-line': ['error', { allow: 'single-line' }],
  },
}

export default stylisticConfig
```

[https://www.notion.so/ESLint-1ca38cdd027d8067a2e2fe9674212935](ESLint%201ca38cdd027d8067a2e2fe9674212935.html)

### ルールセット参考

[https://miraitranslate-tech.hatenablog.jp/entry/2021/09/10/080000](https://miraitranslate-tech.hatenablog.jp/entry/2021/09/10/080000)

[https://zenn.dev/noshiro_piko/articles/take-full-advantage-of-typescript-eslint](https://zenn.dev/noshiro_piko/articles/take-full-advantage-of-typescript-eslint)