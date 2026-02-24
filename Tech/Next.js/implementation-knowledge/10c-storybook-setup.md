---
tags:
  - nextjs
  - storybook
  - testing
  - playwright
created: 2026-02-24
updated_at: 2026-02-24
status: active
---

# Storybook設定 & Story実装パターン

関連ドキュメント:

- [テスト環境: Vitest 3プロジェクト構成 & セットアップ](10a-testing-vitest-config.md)
- [テストパターン: Container/Presentational & Hooks](10b-testing-patterns.md)

---

## Storybook設定

### .storybook/main.ts

```typescript
// .storybook/main.ts
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { mergeConfig } from 'vite';
import type { StorybookConfig } from '@storybook/nextjs-vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const config: StorybookConfig = {
  stories: ["../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [
    '@chromatic-com/storybook',
    '@storybook/addon-docs',
    '@storybook/addon-vitest',
    '@storybook/addon-mcp'
  ],
  framework: { name: '@storybook/nextjs-vite', options: {} },
  staticDirs: ['../public'],
  viteFinal: async (config) => {
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...config.resolve.alias,
      'server-only': path.resolve(__dirname, './mocks/server-only.ts'),
      'next/headers': path.resolve(__dirname, './mocks/next-headers.ts'),
      'next/navigation': path.resolve(__dirname, './mocks/next-navigation.ts'),
      'next/cache': path.resolve(__dirname, './mocks/next-cache.ts'),
      '@/shared/utils/auth/tenant/get-tenant': path.resolve(__dirname, './mocks/get-tenant.ts'),
      '@/shared/utils/logger$': path.resolve(__dirname, './mocks/logger.ts'),
      '@/shared/utils/logger/config': path.resolve(__dirname, './mocks/logger-config.ts'),
      '@google-cloud/pino-logging-gcp-config': path.resolve(__dirname, './mocks/gcp-logging.ts'),
    };
    config.optimizeDeps = config.optimizeDeps || {};
    config.optimizeDeps.exclude = [
      ...(config.optimizeDeps.exclude || []),
      'net', 'tls', 'fs', 'child_process', 'async_hooks',
      'node:events', 'node:process', 'node:util', 'node:fs', 'node:net', 'node:tls',
    ];
    config.optimizeDeps.include = [
      ...(config.optimizeDeps.include || []),
      '@hookform/resolvers/zod',
      '@radix-ui/react-radio-group',
      '@radix-ui/react-aspect-ratio',
    ];
    return mergeConfig(config, { define: getStorybookEnvDefine() });
  },
};
```

### Viteエイリアスによるサーバーモジュールのモック化

Storybookはブラウザ環境で動作するため、Node.js専用のモジュールをそのまま読み込むとエラーになる。Viteのresolve aliasを使って、これらをブラウザ互換のスタブに差し替える。

| エイリアス | モック先 | 理由 |
|-----------|---------|------|
| `server-only` | `./mocks/server-only.ts` | Node.js環境チェックを無効化 |
| `next/headers` | `./mocks/next-headers.ts` | `cookies()`, `headers()` のスタブ |
| `next/navigation` | `./mocks/next-navigation.ts` | `useRouter()`, `useParams()` のスタブ |
| `next/cache` | `./mocks/next-cache.ts` | `revalidatePath()` 等のスタブ |
| `@/shared/utils/logger$` | `./mocks/logger.ts` | pino依存のロガーをコンソール出力に置換 |
| `@google-cloud/pino-logging-gcp-config` | `./mocks/gcp-logging.ts` | Node.jsネイティブモジュール依存をモック |

### .storybook/preview.tsx

```typescript
// .storybook/preview.tsx
import type { Preview } from '@storybook/nextjs-vite'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { initialize, mswLoader } from 'msw-storybook-addon'
import React, { useMemo } from 'react'
import { handlers as mockHandlers } from '../src/mocks/handlers'
import '../src/shared/styles/globals.css'

initialize({ onUnhandledRequest: 'warn', quiet: true })

const preview: Preview = {
  decorators: [
    (Story) => {
      const queryClient = useMemo(() => new QueryClient({
        defaultOptions: { queries: { retry: false, staleTime: 0, gcTime: 0 } },
      }), [])
      return (
        <QueryClientProvider client={queryClient}>
          <Story />
        </QueryClientProvider>
      )
    },
  ],
  parameters: {
    controls: { matchers: { color: /(background|color)$/i, date: /Date$/i } },
    msw: { handlers: [...mockHandlers] },
    nextjs: { appDirectory: true },
  },
  loaders: [mswLoader],
}
export default preview
```

設定のポイント: MSWは `quiet: true` で詳細ログを抑制。QueryClientは `retry: false`, `staleTime: 0`, `gcTime: 0` でStoryの独立性を担保。`msw.handlers` で共通ハンドラーを登録し、個別Storyで上書き可能。`nextjs: { appDirectory: true }` でApp Router互換モードを有効化。

---

## Story実装パターン

### Plopで自動生成されるテンプレート

`./bin/plop` を実行すると、以下のテンプレートからStoryファイルが自動生成される。

```typescript
// plop-templates/stories.hbs
import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect } from 'storybook/test'
import { {{pascalCase componentName}} } from '.'

const meta = {
  component: {{pascalCase componentName}},
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof {{pascalCase componentName}}>

export default meta
type Story = StoryObj<typeof {{pascalCase componentName}}>

export const Default: Story = {
  args: {},
  play: async ({ canvas, step }) => {
    await step('TODO: ステップ名を記述してください', async () => {
      // await expect(...).toBeInTheDocument()
    })
  },
}
```

`play()` 関数でインタラクションテストを記述する。`step()` で論理的にテストを構造化し、Storybook UIのインタラクションパネルで各ステップの実行状況を確認できる。

### 実践的なStory例: テーブルコンポーネント

```typescript
// src/features/events/components/event-table/index.stories.tsx
import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, within } from 'storybook/test'
import type { CommunityEventListItem } from '@/api/__generated__/models'
import { EventTable } from '.'

const meta = {
  component: EventTable,
  tags: ['autodocs'],
  parameters: { layout: 'padded', nextjs: { appDirectory: true } },
  decorators: [Story => (<div className="container py-10"><Story /></div>)],
} satisfies Meta<typeof EventTable>

export default meta
type Story = StoryObj<typeof EventTable>

export const WithEvents: Story = {
  name: 'イベントあり',
  args: { events: mockEvents },
  play: async ({ canvasElement, step, args }) => {
    const canvas = within(canvasElement)
    await step('カラムヘッダーが表示されること', async () => {
      await expect(canvas.getByRole('columnheader', { name: '日時' })).toBeInTheDocument()
    })
    await step('イベント行が正しい数表示されること', async () => {
      await expect(canvas.getAllByRole('row').length - 1).toBe(args.events?.length)
    })
  },
}

export const Empty: Story = {
  name: 'イベントなし',
  args: { events: [] },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByText('表示するイベントがありません')).toBeInTheDocument()
  },
}
```

### 実践的なStory例: インタラクションとモーダル

QRスキャナーのStoryで、より複雑なインタラクションテストのパターンを示す。

```typescript
// src/app/external/check-in/[staffPortalToken]/qr-scanner/_components/scanner-area/index.stories.tsx
import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { useEffect } from 'react'
import { expect, userEvent, within } from 'storybook/test'
import ScannerArea from '.'

const meta = {
  component: ScannerArea,
  parameters: {
    layout: 'centered',
    nextjs: { navigation: { segments: [['staffPortalToken', 'story-specific-token']] } },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ScannerArea>

export default meta
type Story = StoryObj<typeof meta>

export const ManualInput_InteractionFlow: Story = {
  name: '手動入力: 入力・削除・再入力の流れ',
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByPlaceholderText('入場コードを入力')
    const button = canvas.getByRole('button', { name: '確認' })
    await step('文字を入力するとボタンが有効化される', async () => {
      await userEvent.type(input, 'A')
      await expect(button).toBeEnabled()
    })
    await step('すべて削除するとボタンが無効化される', async () => {
      await userEvent.clear(input)
      await expect(button).toBeDisabled()
    })
  },
}

// モーダルテスト: ポータル経由の要素は within(document.body) + findByRole で検索
export const ModalOpen_FromManualInput: Story = {
  name: 'モーダル: 手動入力から開く',
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    await step('確認ボタンをクリックするとモーダルが開く', async () => {
      await userEvent.type(canvas.getByPlaceholderText('入場コードを入力'), 'TEST_CODE_001')
      await userEvent.click(canvas.getByRole('button', { name: '確認' }))
      await expect(await within(document.body).findByRole('dialog')).toBeInTheDocument()
    })
  },
}

// カメラアクセス拒否 -- decoratorでブラウザAPIをモックし、useEffectでクリーンアップ
export const Camera_PermissionDenied: Story = {
  name: 'カメラ: アクセス拒否',
  decorators: [(Story) => {
    const orig = navigator.mediaDevices?.getUserMedia
    if (navigator.mediaDevices)
      navigator.mediaDevices.getUserMedia = () =>
        Promise.reject(new DOMException('Permission denied', 'NotAllowedError'))
    function W() {
      useEffect(() => () => { if (navigator.mediaDevices && orig) navigator.mediaDevices.getUserMedia = orig }, [])
      return <Story />
    }
    return <W />
  }],
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByText('カメラへのアクセスが拒否されました')).toBeInTheDocument()
  },
}
```

### テクニック集

| テクニック | 説明 |
|-----------|------|
| `within(document.body)` | ポータル経由のモーダルなど、canvasElement外にレンダリングされる要素を検索する |
| `findByRole('dialog')` | 非同期でレンダリングされる要素を待機して取得する（`getBy*` は即座に検索、`findBy*` は待機付き） |
| `userEvent.type()` / `userEvent.clear()` | ユーザー操作をシミュレート |
| `nextjs.navigation.segments` | Next.jsのルートパラメータをモック |
| decorator での `getUserMedia` モック | ブラウザAPIをStory単位でモックし、クリーンアップも実装 |

---

## テスト実行コマンド

```bash
./bin/test                # 全テスト実行（watchモード）
./bin/test client         # Hooksテストのみ
./bin/test server         # サーバーテストのみ
./bin/test storybook      # Storybookテストのみ
./bin/test src/features/events/hooks/use-event-filtering.test.ts  # 特定ファイル
./bin/test --ci           # CI用（カバレッジ付き、一度だけ実行）
```
