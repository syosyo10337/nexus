---
tags:
  - typescript
  - syntax
  - function
  - tooling
created: 2026-01-03
updated_at: 2026-02-19
status: active
---

# tsconfig.json

## module — import/export の出力形式

TS が `.js` を出力するとき、import/export をどの形式にするか。

```ts
// 元のコード
import { foo } from "./bar";
```

| 値           | 出力                                                    |
| ------------ | ------------------------------------------------------- |
| `"commonjs"` | `const { foo } = require("./bar")` に変換               |
| `"esnext"`   | `import { foo } from "./bar"` のまま（ESM）             |
| `"preserve"` | 書いたまま一切触らない                                  |
| `"Node16"`   | `package.json` の `"type"` を見て CJS か ESM か自動判定 |

Next.js など Turbopack/webpack がバンドルするプロジェクトでは、TS は何も変換しなくていいので `"preserve"` が適切。

---

## type（package.json）— CJS か ESM かの宣言

Node.js が `.js` ファイルを読むとき、CJS / ESM どちらとして扱うかの宣言。

| 値                 | `.js` ファイルの扱い        |
| ------------------ | --------------------------- |
| なし（デフォルト） | **CJS**（`require` の世界） |
| `"module"`         | **ESM**（`import` の世界）  |

`module: "Node16"` のとき、TS はこの `"type"` を見てファイルが CJS か ESM か判定する。`"type"` なしだと全ファイル CJS 扱いになり、ESM-only パッケージが import できなくなる。`"bundler"` ならこの判定自体をしないので問題なし。

---

## moduleResolution — import パスの探し方

`import { foo } from "bar"` と書いたとき、`"bar"` をどこから探すか。

| 値          | 探し方                                                                      |
| ----------- | --------------------------------------------------------------------------- |
| `"node"`    | 旧 Node.js 方式。`node_modules/bar/index.js` を探す（レガシー）             |
| `"node16"`  | 新 Node.js 方式。`package.json` の `exports` を見る。**ESM では拡張子必須** |
| `"bundler"` | バンドラー方式。`exports` を見る。**拡張子不要**                            |

`"node16"` と `"bundler"` の最大の違い:

```ts
// node16（ESM モード）
import { Foo } from "./components/Foo.js"; // ← 拡張子必須
import { cn } from "@/utils/cn.js"; // ← 拡張子必須

// bundler
import { Foo } from "./components/Foo"; // ← 拡張子不要
import { cn } from "@/utils/cn"; // ← 拡張子不要
```

既存コードが拡張子なしで import しているなら `"bundler"` 一択。

---

## 3つの設定の関係

```text
module           = 出力形式を何にする？     → "preserve"（何もしない）
type             = CJS か ESM か？          → 設定不要（bundler なら無関係）
moduleResolution = import パスの探し方は？  → "bundler"（拡張子不要）
```

3つは独立した設定だが、`module: "Node16"` を選ぶと `moduleResolution: "node16"` が必須になり、さらに `"type"` の有無が重要になる…という連鎖でエラーが起きやすい。バンドラーを使うプロジェクトでは `module: "preserve"` + `moduleResolution: "bundler"` にしておけばこの連鎖を回避できる。

---

## allowJS/checkJS

JSを許すか、その上でチェックするか。

```YAML
{
  "compilerOptions": {
    "lib": [
      "dom",
      "dom.iterable",
      "esnext"
    ],
    "allowJs": true,
    "target": "ES2022",
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "outDir": "./dist",
    "rootDir": ".",
    "forceConsistentCasingInFileNames": true,
    "exactOptionalPropertyTypes": true,
    "noFallthroughCasesInSwitch": true,
    "noImplicitOverride": true,
    "noImplicitReturns": true,
    "noUncheckedIndexedAccess": true,
    "sourceMap": true,
    "verbatimModuleSyntax": true,
    "allowSyntheticDefaultImports": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "baseUrl": ".",
    "paths": {
      "@/*": [
        "./src/*"
      ]
    }
  },
  "include": [
    "next-env.d.ts",
    "env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts",
  ],
  "exclude": [
    "node_modules"
  ]
}
```
