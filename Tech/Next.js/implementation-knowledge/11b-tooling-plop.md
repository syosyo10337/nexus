---
tags:
  - nextjs
  - plop
  - scaffolding
  - dx
created: 2026-02-24
updated_at: 2026-02-24
status: active
---

# Plop コンポーネントスカフォールド

Plop を使用してコンポーネントと Storybook Story ファイルをセットで自動生成する仕組み。

関連ドキュメント:

- [開発環境: Docker / next.config / tsconfig](./11a-tooling-docker.md)
- [ESLint boundaries: アーキテクチャルール](./11c-tooling-eslint-boundaries.md)

---

## plopfile.js

```javascript
// plopfile.js
function plopfile(plop) {
  plop.setGenerator("component", {
    description: "新しいコンポーネントとStoriesファイルを作成",
    prompts: [
      {
        type: "list",
        name: "layer",
        message: "どのレイヤーに作成しますか？",
        choices: [
          { name: "app", value: "app" },
          { name: "features", value: "features" },
          { name: "shared", value: "shared" },
        ],
      },
      {
        type: "input",
        name: "dirPath",
        message:
          "レイヤー内のディレクトリパスを指定してください（例: events/[id]/_components)",
        filter: (value) => value.trim(),
        validate: (value) => {
          if (!value || value.length === 0) {
            return "ディレクトリパスは必須です";
          }
          if (value.endsWith("/")) {
            return "ディレクトリパスの末尾に/は不要です";
          }
          return true;
        },
      },
      {
        type: "input",
        name: "componentName",
        message:
          "コンポーネント名を入力してください（PascalCase、例: NewButton）",
        filter: (value) => value.trim(),
        validate: (value) => {
          if (!value || value.length === 0) {
            return "コンポーネント名は必須です";
          }
          if (!/^[A-Z][\dA-Za-z]*$/.test(value)) {
            return "コンポーネント名はPascalCaseで入力してください（例: NewButton）";
          }
          return true;
        },
      },
    ],
    actions: [
      {
        type: "add",
        path: "src/{{layer}}/{{dirPath}}/{{dashCase componentName}}/index.tsx",
        templateFile: "plop-templates/component.hbs",
      },
      {
        type: "add",
        path: "src/{{layer}}/{{dirPath}}/{{dashCase componentName}}/index.stories.tsx",
        templateFile: "plop-templates/stories.hbs",
      },
    ],
  });
}

export default plopfile;
```

## 生成されるファイル構造

```
src/{layer}/{dirPath}/{kebab-case-name}/
├── index.tsx          # コンポーネント
└── index.stories.tsx  # Storybook Story
```

## テンプレート: コンポーネント

```handlebars
{{! plop-templates/component.hbs }}
interface
{{pascalCase componentName}}Props { // TODO: propsを定義してください } export
function
{{pascalCase componentName}}(props:
{{pascalCase componentName}}Props) { return (
<div>
  {/* TODO: コンポーネントの実装を追加してください */}
</div>
) }
```

## テンプレート: Story

```handlebars
{{!-- plop-templates/stories.hbs --}}
import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect } from 'storybook/test'

import { {{pascalCase componentName}} } from '.'

const meta = {
  component: {{pascalCase componentName}},
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof {{pascalCase componentName}}>

export default meta
type Story = StoryObj<typeof {{pascalCase componentName}}>

export const Default: Story = {
  args: {
    // TODO: デフォルトのargsを定義してください
  },
  play: async ({ canvas, step }) => {
    await step('TODO: ステップ名を記述してください', async () => {
      // Arrange & Act
      // TODO: テスト対象の要素を取得してください

      // Assert
      // TODO: アサーションを追加してください
      // await expect(...).toBeInTheDocument()
    })
  },
}
```

## Plopの設計判断

- **PascalCaseバリデーション** -- コンポーネント名は `/^[A-Z][\dA-Za-z]*$/` で検証。先頭大文字のPascalCaseを強制。
- **dashCase変換** -- ディレクトリ名はPlop組み込みの `dashCase` でkebab-caseに自動変換（例: `NewButton` -> `new-button`）。
- **Storyファイル同時生成** -- コンポーネントとStoryを必ずセットで生成し、テストの書き忘れを防止。
- **play()関数の雛形** -- `step()` を含む雛形を生成し、インタラクションテストの記述を促進。
