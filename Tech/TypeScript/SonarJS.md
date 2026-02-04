---
tags:
  - typescript
  - eslint
  - sonarjs
  - linter
  - code-quality
---

# SonarJS（ESLint プラグイン）

[eslint-plugin-sonarjs](https://github.com/SonarSource/eslint-plugin-sonarjs) は SonarSource が提供する ESLint プラグイン。SonarJS のルールを ESLint 上で使え、**バグ検出・コードスメル・認知複雑度**などにフォーカスしたルールを追加できる。

- ルール一覧（SonarJS 側）: [SonarJS rules README](https://github.com/SonarSource/SonarJS/blob/master/packages/jsts/src/rules/README.md)
- プラグイン公式: [eslint-plugin-sonarjs](https://github.com/SonarSource/eslint-plugin-sonarjs)

※ 2024年10月時点で eslint-plugin-sonarjs の GitHub リポジトリはアーカイブ（read-only）だが、npm パッケージは引き続き利用可能。

---

## インストール

```bash
npm install eslint-plugin-sonarjs --save-dev
```

ESLint 9 では Node.js ^18.18.0 || ^20.9.0 || >=21 を推奨。

---

## ルール設定サンプル（必須）

recommended をそのまま使ってもよいが、**最低限避けたい実装だけ**に絞った設定例。コメントの URL で全ルール一覧を参照できる。

```javascript
/**
 * SonarJSのルール設定
 * https://github.com/SonarSource/SonarJS/blob/master/packages/jsts/src/rules/README.md
 *
 * NOTE: recommendedの設定を使用してもよいがここでは、最低限避けたいコード実装だけ設定している。
 */

import sonarjs from 'eslint-plugin-sonarjs'

export const sonarjsConfig = {
  plugins: { sonarjs },
  rules: {
    'sonarjs/cognitive-complexity': ['error', 15],
    'sonarjs/no-duplicated-branches': 'error',
    'sonarjs/prefer-single-boolean-return': 'error',
    'sonarjs/prefer-immediate-return': 'error',
  },
}
```

Flat Config では、この `sonarjsConfig` を配列の要素として `...sonarjsConfig` で展開するか、`rules` などを既存の設定にマージして使う。

---

## 設定しているルールの意味

| ルール | 概要 |
| --- | --- |
| `cognitive-complexity` | 関数の認知複雑度の上限（ここでは 15）。ネスト・分岐・三項演算子などで加算され、高すぎる関数を検出する。 |
| `no-duplicated-branches` | if/else や switch の複数ブランチが同じ実装になっているバグや冗長を検出する。 |
| `prefer-single-boolean-return` | 真偽だけ返す関数で、`if (cond) return true; else return false;` のような形をやめ、単一の `return cond` にまとめるよう促す。 |
| `prefer-immediate-return` | 変数に代入した直後にその変数だけを return している場合、代入をやめて直接 return するよう促す（冗長な変数を減らす）。 |

---

## recommended について

プラグインは `recommended` 設定を提供している。

```javascript
import sonarjs from 'eslint-plugin-sonarjs'

export default [sonarjs.configs.recommended]
```

「とにかく多くのルールを一括で」使うならこれでよい。上記サンプルは、**recommended は使わず、避けたい実装に絞ったルールだけを明示的に有効にする**方針の例。

---

## 参考リンク

- [SonarJS rules README](https://github.com/SonarSource/SonarJS/blob/master/packages/jsts/src/rules/README.md) — ルール一覧・説明
- [eslint-plugin-sonarjs](https://github.com/SonarSource/eslint-plugin-sonarjs) — プラグインリポジトリ
- [npm: eslint-plugin-sonarjs](https://www.npmjs.com/package/eslint-plugin-sonarjs)
- [ESLint Flat Config](./ESLint.md) — 当リポジトリ内の ESLint 設定の話
