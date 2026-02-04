---
tags:
  - typescript
  - linter
  - eslint
  - syntax
created: 2026-01-03
updated: 2026-02-04
status: active
---

# ESlint

## Flat Config

v9 から推奨され、v10 では、eslintrc は削除されるらしいので対応する

### 具体的な書き方について

Flat config は「設定オブジェクトの配列」です。

```javascript
export default [
  {
    /* 設定 1 */
  },
  {
    /* 設定 2 */
  },
  {
    /* 設定 3 */
  },
];
```

各オブジェクトは以下のプロパティを持てます：

```markdown
┌─────────────────┬──────┬────────────────────────────┐
│ プロパティ │ 必須 │ 説明 │
├─────────────────┼──────┼────────────────────────────┤
│ files │ × │ 対象ファイルの glob パターン │
├─────────────────┼──────┼────────────────────────────┤
│ ignores │ × │ 無視するファイル │
├─────────────────┼──────┼────────────────────────────┤
│ plugins │ × │ 使用するプラグイン │
├─────────────────┼──────┼────────────────────────────┤
│ rules │ × │ ルール設定 │
├─────────────────┼──────┼────────────────────────────┤
│ languageOptions │ × │ parser, globals 等 │
└─────────────────┴──────┴────────────────────────────┘
→ 全部オプショナル。必須プロパティはありません。
```

### plugin を入れるだけで動く？

動きません。
plugin は「ルールの定義集」なだけで、有効化は別途必要です。

```javascript
// これだけだとルールは何も有効にならない
  {
    plugins: { unicorn: unicornPlugin }
  }

  // rules で有効化が必要
  {
    plugins: { unicorn: unicornPlugin },
    rules: {
      'unicorn/no-null': 'error',
    },
  },
```

cf. [plugin](https://eslint.org/docs/latest/use/configure/configuration-files#using-configurations-from-plugins)

recommended を使えば楽

多くのプラグインは recommended
設定を提供しています。これを使えば個別に rules を書かなくて OK：

```javascript
import eslintPluginUnicorn from 'eslint-plugin-unicorn'

export default [
  eslintPluginUnicorn.configs['flat/recommended'], // これだけで OK
]

// recommended の中身は結局こうなってます：
{
plugins: { unicorn: ... },
rules: {
  'unicorn/no-null': 'error',
  'unicorn/prefer-string-slice': 'error',
    // ... 推奨ルールが全部入り
  },
};
```

## Prettier の代わりに Stylistic を使う

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
 * @see https://github.com/eslint-stylistic/eslint-stylistic/blob/main/packages/eslint-plugin/configs/index.
[https://qiita.com/Shilaca/items/c494e4dc6b536a5231de](https://qiita.com/Shilaca/items/c494e4dc6b536a5231de)
ts
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

## ルールセット参考

[https://miraitranslate-tech.hatenablog.jp/entry/2021/09/10/080000](https://miraitranslate-tech.hatenablog.jp/entry/2021/09/10/080000)

[https://zenn.dev/noshiro_piko/articles/take-full-advantage-of-typescript-eslint](https://zenn.dev/noshiro_piko/articles/take-full-advantage-of-typescript-eslint)

## 参考

- [SonarJS（ESLint プラグイン）](./SonarJS.md) — 当リポジトリ内
- [Qiita: ESLint](https://qiita.com/Shilaca/items/c494e4dc6b536a5231de)
- [ESLint Configuration files](https://eslint.org/docs/latest/use/configure/configuration-files)
- [ESLint Plugins](https://eslint.org/docs/latest/use/configure/plugins)
