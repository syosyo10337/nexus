---
tags:
  - nextjs
  - eslint
  - architecture
  - boundaries
created: 2026-02-24
updated_at: 2026-02-24
status: active
---

# ESLint boundaries: アーキテクチャルール

`eslint-plugin-boundaries` を使用して、レイヤー間のインポート制約をコードレベルで強制する。

関連ドキュメント:

- [開発環境: Docker / next.config / tsconfig](./11a-tooling-docker.md)
- [Plop コンポーネントスカフォールド](./11b-tooling-plop.md)

---

## import-boundary.mjs

```javascript
// eslint-config/import-boundary.mjs
import boundaries from "eslint-plugin-boundaries";

export const importBoundaryConfig = [
  {
    plugins: { boundaries },
    files: ["src/**/*.{js,jsx,ts,tsx}"],
    settings: {
      "boundaries/elements": [
        // App層
        {
          type: "app-page",
          pattern:
            "src/app/**/{page,loading,error,not-found,default,layout}.tsx",
          mode: "file",
        },
        {
          type: "app-private-component",
          pattern: "src/app/**/_components/**/*.{js,jsx,ts,tsx}",
          mode: "file",
        },
        {
          type: "app-private-hook",
          pattern: "src/app/**/_hooks/**/*.{js,jsx,ts,tsx}",
          mode: "file",
        },
        // Features層
        {
          type: "feature-component",
          pattern: "src/features/(*)/components/**/*.{js,jsx,ts,tsx}",
          capture: ["featureName"],
          mode: "file",
        },
        {
          type: "feature-hook",
          pattern: "src/features/(*)/hooks/**/*.{js,jsx,ts,tsx}",
          capture: ["featureName"],
          mode: "file",
        },
        {
          type: "feature-action",
          pattern: "src/features/(*)/actions/**/*.{js,jsx,ts,tsx}",
          capture: ["featureName"],
          mode: "file",
        },
        {
          type: "feature-store",
          pattern: "src/features/(*)/stores/**/*.{js,jsx,ts,tsx}",
          capture: ["featureName"],
          mode: "file",
        },
        {
          type: "feature-validator",
          pattern: "src/features/(*)/validator.{js,jsx,ts,tsx}",
          capture: ["featureName"],
          mode: "file",
        },
        {
          type: "feature-type",
          pattern: "src/features/(*)/types/**/*.{js,jsx,ts,tsx}",
          capture: ["featureName"],
          mode: "file",
        },
        {
          type: "feature-constant",
          pattern: "src/features/(*)/constants/**/*.{js,jsx,ts,tsx}",
          capture: ["featureName"],
          mode: "file",
        },
        // Shared層
        {
          type: "shared-component",
          pattern: "src/shared/components/**/*.{js,jsx,ts,tsx}",
          mode: "file",
        },
        {
          type: "shared-hook",
          pattern: "src/shared/hooks/**/*.{js,jsx,ts,tsx}",
          mode: "file",
        },
        {
          type: "shared-lib",
          pattern: "src/shared/libs/**/*.{js,jsx,ts,tsx}",
          mode: "file",
        },
        {
          type: "shared-type",
          pattern: "src/shared/types/**/*.{js,jsx,ts,tsx}",
          mode: "file",
        },
        {
          type: "shared-constant",
          pattern: "src/shared/constants/**/*.{js,jsx,ts,tsx}",
          mode: "file",
        },
        {
          type: "shared-error",
          pattern: "src/shared/errors/**/*.{js,jsx,ts,tsx}",
          mode: "file",
        },
        {
          type: "shared-validator",
          pattern: "src/shared/validator.{js,jsx,ts,tsx}",
          mode: "file",
        },
        // その他
        {
          type: "api-client",
          pattern: "src/api/**/*.{js,jsx,ts,tsx}",
          mode: "file",
        },
      ],
    },
    rules: {
      "boundaries/element-types": [
        "error",
        {
          default: "disallow",
          rules: [
            {
              from: ["app-page"],
              allow: [
                "app-private-component",
                "app-private-hook",
                "feature-constant",
                "shared-component",
                "shared-hook",
                "shared-type",
                "shared-constant",
                "api-client",
              ],
            },
            {
              from: ["app-private-component"],
              allow: [
                "app-private-component",
                "app-private-hook",
                "feature-component",
                "feature-hook",
                "feature-action",
                "feature-store",
                "feature-validator",
                "feature-type",
                "feature-constant",
                "shared-component",
                "shared-hook",
                "shared-lib",
                "shared-type",
                "shared-constant",
                "shared-error",
                "shared-validator",
                "api-client",
              ],
            },
            {
              from: ["app-private-hook"],
              allow: [
                "app-private-hook",
                "feature-hook",
                "feature-constant",
                "shared-component",
                "shared-hook",
                "shared-constant",
                "shared-lib",
              ],
            },
            {
              from: [
                "feature-component",
                "feature-hook",
                "feature-action",
                "feature-store",
                "feature-validator",
                "feature-type",
                "feature-constant",
              ],
              allow: [
                // 同一feature内のみ許可
                ["feature-component", { featureName: "${from.featureName}" }],
                ["feature-hook", { featureName: "${from.featureName}" }],
                ["feature-action", { featureName: "${from.featureName}" }],
                ["feature-store", { featureName: "${from.featureName}" }],
                ["feature-validator", { featureName: "${from.featureName}" }],
                ["feature-type", { featureName: "${from.featureName}" }],
                ["feature-constant", { featureName: "${from.featureName}" }],
                "shared-component",
                "shared-hook",
                "shared-lib",
                "shared-type",
                "shared-constant",
                "shared-error",
                "shared-validator",
                "api-client",
              ],
            },
            {
              from: [
                "shared-component",
                "shared-hook",
                "shared-lib",
                "shared-type",
                "shared-constant",
                "shared-error",
                "shared-validator",
              ],
              allow: [
                "shared-component",
                "shared-hook",
                "shared-lib",
                "shared-type",
                "shared-constant",
                "shared-error",
                "shared-validator",
                "api-client",
              ],
            },
            {
              from: ["api-client"],
              allow: [
                "api-client",
                "shared-lib",
                "shared-error",
                "shared-constant",
              ],
            },
          ],
        },
      ],
      "boundaries/no-private": [
        "error",
        {
          allowUncles: true,
        },
      ],
    },
  },
];
```

## 依存関係ダイアグラム

```
app-page ──> app-private-component ──> feature-* ──> shared-*
   |                |                                    ^
   |                +──> feature-action                  |
   |                +──> feature-store                   |
   |                +──> feature-validator               |
   |                                                     |
   +──> shared-component                                 |
   +──> api-client ──────────────────────────────────────+
```

## 依存ルールの詳細

| ルール                                               | 説明                                                                                                                                                                                                               |
| ---------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **feature間のクロスインポート禁止**                  | `featureName: '${from.featureName}'` の条件で、同一feature内のモジュールのみインポートを許可。例えば `features/events/` から `features/settings/` をインポートするとエラーになる。                                 |
| **shared -> features/app へのインポート禁止**        | shared層は純粋なユーティリティ層として設計。上位レイヤーへの依存を持たないことで、再利用性を最大化する。                                                                                                           |
| **api-client -> shared-lib/error/constant のみ許可** | API層はビジネスロジック（features）に依存しない。共有ライブラリ、エラー定義、定数のみインポート可能。                                                                                                              |
| **app-page -> feature-component は不可**             | ページファイル（`page.tsx`, `layout.tsx` 等）からfeatureコンポーネントを直接インポートできない。必ず `_components` 配下のprivateコンポーネント経由にすることで、ページの責務をルーティングとレイアウトに限定する。 |
| **boundaries/no-private（allowUncles: true）**       | `_` プレフィックスのディレクトリ内のファイルはプライベートだが、叔父（uncle）ディレクトリからのアクセスは許可。これにより、同じページ内の `_components` と `_hooks` が相互参照できる。                             |

## デバッグ方法

boundariesルールが期待どおりに動作しない場合:

```bash
ESLINT_PLUGIN_BOUNDARIES_DEBUG=1 ./bin/check lint
```

環境変数 `ESLINT_PLUGIN_BOUNDARIES_DEBUG=1` を設定すると、各ファイルがどのelement typeにマッチしたかが出力される。
