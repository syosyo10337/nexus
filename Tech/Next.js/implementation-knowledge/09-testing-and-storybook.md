# テスト & Storybook実装パターン

Birdcageプロジェクトでは、Vitest 3のプロジェクト機能を活用して、テスト環境を3つに分離している。加えて、StorybookをPlaywrightベースのブラウザテストとして統合し、ビジュアルリグレッションとインタラクションテストを実現している。

---

## Vitest 3プロジェクト構成

テスト設定は `vitest.config.ts` で定義されている。1つの設定ファイルで3つの異なるテストプロジェクトを管理する。

```typescript
// vitest.config.ts
import path from 'path'
import { fileURLToPath } from 'url'

import { storybookTest } from '@storybook/addon-vitest/vitest-plugin'
import react from '@vitejs/plugin-react'
import { playwright } from '@vitest/browser-playwright'
import tsconfigPaths from 'vite-tsconfig-paths'
import { configDefaults, defineConfig } from 'vitest/config'

const dirname = typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    env: {
      ENV: 'test',
      NODE_ENV: 'test',
      ENABLE_MSW: 'true',
      IBIS_API_SSR_BASE_PATH: 'http://mocking-ibis:5000',
    },
    projects: [{
      extends: true,
      test: {
        name: { label: 'client', color: 'green' },
        environment: 'jsdom',
        include: ['**/use-*.test.ts', '**/*.client.test.ts'],
        exclude: [...configDefaults.exclude, '**/*.server.test.tsx', '**/*.stories.tsx'],
        setupFiles: ['./src/test/vitest.setup.ts'],
      },
    },
    {
      extends: true,
      test: {
        name: { label: 'server', color: 'blue' },
        environment: 'node',
        include: ['**/*.server.test.{ts,tsx}', '**/*.test.ts'],
        exclude: [...configDefaults.exclude, '**/use-*.test.ts', '**/*.stories.tsx'],
        server: {
          deps: {
            inline: [/next-auth/],
          },
        },
        setupFiles: ['./src/test/vitest.setup.ts'],
      },
    },
    {
      plugins: [storybookTest({ configDir: path.join(dirname, '.storybook') })],
      extends: true,
      test: {
        name: { label: 'storybook', color: 'magenta' },
        isolate: false,
        browser: {
          enabled: true,
          headless: true,
          provider: playwright({
            launchOptions: {
              // @see https://playwright.dev/docs/api/class-browsertype#browser-type-launch
              args: [
                '--use-fake-device-for-media-stream', // カメラのフェイクデバイスを使用
                '--use-fake-ui-for-media-stream', // パーミッションダイアログをスキップ
              ],
            },
          }),
          instances: [{
            browser: 'chromium',
          }],
        },
        setupFiles: ['.storybook/vitest.setup.ts'],
      },
    }],
  },
})
```

### プロジェクト比較表

| プロジェクト | 環境 | 対象ファイル | 用途 |
|-------------|------|-------------|------|
| **client** | jsdom | `use-*.test.ts`, `*.client.test.ts` | Hooks、クライアントコンポーネント |
| **server** | node | `*.server.test.{ts,tsx}`, `*.test.ts` | Server Actions、Container、サーバーユーティリティ |
| **storybook** | browser (Playwright) | `*.stories.tsx` | ビジュアルリグレッション、インタラクションテスト |

### ファイル命名とプロジェクト振り分けのルール

- **`use-*.test.ts`** -- Hooks テストは必ず **client** プロジェクト（jsdom環境）で実行される。Hooksは `renderHook` を使ってテストするためDOM環境が必須。
- **`*.server.test.tsx`** -- サーバーテストは必ず **server** プロジェクト（node環境）で実行される。RSCの直接呼び出しや `next/headers` のモックが正しく動作するためにNode.js環境が必要。
- **`*.test.ts`** -- 上記のパターンに該当しない汎用テストは **server** プロジェクトで実行される。プロジェクト内では `server-only` インポートを使うモジュールが多いため、デフォルトをnode環境とした。
- **`*.stories.tsx`** -- Storybook プロジェクトはPlaywrightブラウザで実行される。カメラフェイクデバイス設定はQRスキャナーのテスト用。

---

## テストセットアップ

### vitest.setup.ts

テスト環境の共通セットアップは `src/test/vitest.setup.ts` で定義されている。client / server 両プロジェクトから共通で読み込まれる。

```typescript
// src/test/vitest.setup.ts
import { cleanup } from '@testing-library/react'
import { vi, afterAll, afterEach, beforeAll } from 'vitest'

import { testServer } from '@/mocks/node'
import { IS_SERVER } from '@/shared/constants/environment'

vi.mock('server-only', () => ({}))

// MOCK for server tests
if (IS_SERVER) {
  beforeAll(() => testServer.listen({ onUnhandledRequest: 'warn' }))
  afterEach(() => {
    testServer.resetHandlers()
    cleanup()
  })
  afterAll(() => testServer.close())
  // Next.jsのcookiesをモック
  vi.mock('next/headers', () => ({
    cookies: vi.fn().mockReturnValue({
      toString: () => 'test-cookie-string',
      get: vi.fn(),
      set: vi.fn(),
      delete: vi.fn(),
    }),
    headers: vi.fn().mockReturnValue({
      get: vi.fn(),
      set: vi.fn(),
      delete: vi.fn(),
    }),
  }))

  // getTenant関数をモック
  vi.mock('@/shared/utils/auth/tenant/get-tenant', () => ({
    getTenant: vi.fn().mockResolvedValue({
      id: 'test-tenant-id',
      name: 'Test Tenant',
    }),
  }))
}
```

### 各設定項目の解説

| 設定 | 理由 |
|------|------|
| `vi.mock('server-only', () => ({}))` | `server-only` モジュールを空モックにして、jsdom環境でもインポートエラーにならないようにする。Next.jsの `server-only` パッケージはNode.js以外での実行を禁止するが、テスト時はこの制約を無効化する必要がある。 |
| `IS_SERVER` ガード | サーバープロジェクトのみでMSWサーバーを起動する。jsdom環境ではMSWのブラウザ用ワーカー（`setupWorker`）が別途存在するため、`setupServer` はNode.js環境限定。 |
| `next/headers` モック | サーバーテストで `cookies()` や `headers()` が使えるようにする。Server ActionsやRSCはこれらの関数に依存しているが、テスト環境ではNext.jsランタイムが存在しないためモックが必要。 |
| `getTenant` モック | テナント取得をモック化する。認証に依存するロジックを分離し、テスト対象のビジネスロジックに集中できるようにする。 |

### Storybook用 vitest.setup.ts

Storybookプロジェクトには専用のセットアップファイルがある。

```typescript
// .storybook/vitest.setup.ts
import { setProjectAnnotations } from '@storybook/nextjs-vite';
import * as projectAnnotations from './preview';
import { IS_SERVER } from '../src/shared/constants/environment';

setProjectAnnotations([projectAnnotations]);

if (!IS_SERVER) {
  // ResizeObserver など、ブラウザ環境で必要なモック
  class ResizeObserverMock implements ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }

  if (!window.ResizeObserver) {
    window.ResizeObserver = ResizeObserverMock as unknown as typeof ResizeObserver;
  }

  // NOTE: @yudiel/react-qr-scannerのScannerコンポーネントがgetUserMediaのrejectionを
  // onErrorコールバックに渡す前に、一時的にunhandled rejectionとして扱われる可能性があるため、
  // メディアストリーム関連のエラー（NotAllowedError）の場合はunhandled rejectionとして扱わない
  window.addEventListener('unhandledrejection', (event: PromiseRejectionEvent) => {
    if (
      event.reason instanceof DOMException
      && (event.reason.name === 'NotAllowedError' )
    ) {
      event.preventDefault()
    }
  })
}
```

ポイント:
- `setProjectAnnotations` でpreviewの設定（デコレーター、MSWハンドラー等）をVitest経由のテストにも適用
- `ResizeObserver` のポリフィルを追加（Radix UIなど一部のUIライブラリが依存）
- QRスキャナーの `NotAllowedError` をハンドリングしてテストの誤失敗を防止

---

## Container/Presentational テストパターン

Birdcageでは Container/Presentational パターンに沿ってテストを分離している。

### Container (Server) テスト

RSCのContainerコンポーネントは async 関数として直接呼び出し、戻り値のJSX要素を検証する。

```typescript
// src/app/(authenticated)/events/(list)/_components/event-list-container/index.server.test.tsx
import { describe, it, expect } from 'vitest'

import { EventListContainer } from '.'
import { EventListPresentational } from './presentational'

describe('EventListContainer', () => {
  it('データを取得して、EventListPresentationalを表示する', async () => {
    const { type, props } = await EventListContainer()

    expect(type).toBe(EventListPresentational)
    expect(props.events).toHaveLength(25)
  })
})
```

#### テスト手法の解説

- **async RSCを直接呼び出す** -- `await EventListContainer()` でサーバーコンポーネントを関数として実行する。React Server Componentはasync関数なので、Promiseとして評価できる。
- **`type` でレンダリングされるコンポーネントを確認** -- 戻り値のJSX要素の `type` プロパティで、正しいPresentationalコンポーネントが使われているかを検証。
- **`props` で渡されるデータを検証** -- Containerがfetchしたデータが正しくPresentationalに渡されることを確認。
- **MSWがAPIリクエストをインターセプト** -- `vitest.setup.ts` で起動されたMSWサーバーが、バックエンドAPIへのリクエストをモックデータで返す。

#### エラーケースのテスト例

```typescript
// src/features/events/components/event-publish-modal/container.server.test.tsx
import { describe, it, expect } from 'vitest'

import { NotFoundError } from '@/shared/errors/api-error/api-error'

import { EventPublishModalContentContainer } from './container'
import { EventPublishModalContentPresentational } from './presentational'

describe('EventPublishModalContentContainer', () => {
  it('データを取得して、EventPublishModalContentPresentationalを表示する', async () => {
    const eventId = '1'
    const { type, props } = await EventPublishModalContentContainer({ eventId })

    expect(type).toBe(EventPublishModalContentPresentational)
    expect(props.event).toBeDefined()
    expect(props.eventTickets).toBeDefined()
  })

  it('イベントが存在しない場合はNotFoundErrorをスローする', async () => {
    const eventId = '999'

    await expect(
      EventPublishModalContentContainer({ eventId }),
    ).rejects.toThrow(NotFoundError)
  })
})
```

存在しないリソースへのリクエストでは、MSWがエラーレスポンスを返し、Container内のエラーハンドリングが `NotFoundError` をスローすることを検証する。

### Client (Hooks) テスト

カスタムHooksは `renderHook` と `act` を使ってjsdom環境でテストする。

```typescript
// src/features/events/hooks/use-event-filtering.test.ts
import { renderHook, act } from '@testing-library/react'
import { DateTime } from 'luxon'
import { expect, describe, beforeAll, afterAll, it } from 'vitest'

import type { CommunityEventListItem } from '@/api/__generated__/models'
import { mockDate } from '@/test/utils/date-mock'

import { useEventFiltering } from './use-event-filtering'

const TODAY = DateTime.fromISO('2023-11-13T00:00:00.000Z')
const mockEvents: CommunityEventListItem[] = [
  {
    community_event_id: '1',
    community_event_name: 'Past Published Event',
    community_event_start_at: '2023-11-10T10:00:00.000Z',
    published_at: '2023-11-01T00:00:00.000Z',
    community: { community_id: '1', community_name: 'Test Community' },
    community_event_end_at: '2023-11-10T10:00:00.000Z',
    total_event_tickets: 100,
  },
  // ... 他のモックイベント
]

describe('useEventFiltering', () => {
  let cleanupDateMock: () => void
  beforeAll(() => {
    cleanupDateMock = mockDate(TODAY)
  })

  afterAll(() => {
    cleanupDateMock()
  })

  it('全てのイベントが返される', () => {
    const { result } = renderHook(() => useEventFiltering(mockEvents))
    expect(result.current.filteredEvents).toHaveLength(6)
    expect(result.current.dateFilter).toBe('all')
    expect(result.current.statusFilter).toBe('all')
  })

  describe('日付フィルター', () => {
    it('upcomingの時、今日以降の開始日のイベントのみ返される', () => {
      const { result } = renderHook(() => useEventFiltering(mockEvents))

      act(() => {
        result.current.setDateFilter('upcoming')
      })

      expect(result.current.filteredEvents).toHaveLength(4)
      expect(result.current.filteredEvents.map(e => e.community_event_id))
        .toEqual(expect.arrayContaining(['3', '4', '5', '6']))
    })
  })
})
```

ポイント:
- `renderHook` でHookを独立してテスト可能にする
- `act` でステート更新をラップして、Reactの同期的な更新を保証
- `mockDate` で日付を固定し、日付依存のロジックを安定してテストする
- Luxonの `DateTime` を使用（プロジェクト全体でネイティブ `Date` ではなくLuxonを使用する規約）

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
  stories: [
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  addons: [
    '@chromatic-com/storybook',
    '@storybook/addon-docs',
    '@storybook/addon-vitest',
    '@storybook/addon-mcp'
  ],
  framework: {
    name: '@storybook/nextjs-vite',
    options: {},
  },
  staticDirs: ['../public'],
  viteFinal: async (config) => {
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...config.resolve.alias,
      // Server-only modules
      'server-only': path.resolve(__dirname, './mocks/server-only.ts'),

      // Next.js modules
      'next/headers': path.resolve(__dirname, './mocks/next-headers.ts'),
      'next/navigation': path.resolve(__dirname, './mocks/next-navigation.ts'),
      'next/cache': path.resolve(__dirname, './mocks/next-cache.ts'),

      // Application modules
      '@/shared/utils/auth/tenant/get-tenant': path.resolve(__dirname, './mocks/get-tenant.ts'),
      '@/shared/utils/logger$': path.resolve(__dirname, './mocks/logger.ts'),
      '@/shared/utils/logger/config': path.resolve(__dirname, './mocks/logger-config.ts'),

      // GCP Loggingパッケージを直接モック
      '@google-cloud/pino-logging-gcp-config': path.resolve(__dirname, './mocks/gcp-logging.ts'),
    };

    // optimizeDepsでNode.jsネイティブモジュールを除外
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
    return mergeConfig(config, {
      define: getStorybookEnvDefine(),
    });
  },
};
```

#### Viteエイリアスによるサーバーモジュールのモック化

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
import React from 'react'

import { handlers as mockHandlers } from '../src/mocks/handlers'
import '../src/shared/styles/globals.css'
import { useMemo } from 'react';

// MSWの詳細ログを抑制（テスト環境では不要なログを出力しない）
initialize({
  onUnhandledRequest: 'warn',
  quiet: true,
})

const preview: Preview = {
  decorators: [
    (Story) => {
      const queryClient = useMemo(() => new QueryClient({
        defaultOptions: {
          queries: {
            retry: false,
            staleTime: 0,
            gcTime: 0,
          },
        },
      }), [])

      return (
        <QueryClientProvider client={queryClient}>
          <Story />
        </QueryClientProvider>
      )
    },
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    msw: {
      handlers: [...mockHandlers],
    },
    nextjs: {
      appDirectory: true,
    },
  },
  loaders: [mswLoader],
}

export default preview
```

#### 設定のポイント

| 設定 | 目的 |
|------|------|
| `initialize({ onUnhandledRequest: 'warn', quiet: true })` | MSWの初期化。未処理リクエストは警告のみ、詳細ログは抑制。 |
| `QueryClient` のテスト用設定 | `retry: false` でリトライを無効化、`staleTime: 0` と `gcTime: 0` でキャッシュを即座に無効化。Storyの独立性を担保。 |
| `msw.handlers` | アプリケーション共通のMSWハンドラーを登録。個別のStoryでハンドラーを上書き可能。 |
| `nextjs: { appDirectory: true }` | App Router互換モードを有効化。`useRouter`, `usePathname` 等のNext.js Hooksが正しく動作する。 |

---

## Storybook Story の実装パターン

### Plopで自動生成されるテンプレート

`./bin/plop` を実行すると、以下のテンプレートからStoryファイルが自動生成される。

```typescript
// plop-templates/stories.hbs
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

`play()` 関数でインタラクションテストを記述する。`step()` で論理的にテストを構造化し、Storybook UIのインタラクションパネルで各ステップの実行状況を確認できる。

### 実践的なStory例: テーブルコンポーネント

```typescript
// src/features/events/components/event-table/index.stories.tsx
import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, within } from 'storybook/test'

import type { CommunityEventListItem } from '@/api/__generated__/models'
import { nowInUTC } from '@/shared/utils/format/date'

import { EventTable } from '.'

const meta = {
  component: EventTable,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    nextjs: { appDirectory: true },
  },
  decorators: [
    Story => (
      <div className="container py-10">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof EventTable>

export default meta
type Story = StoryObj<typeof EventTable>

const futureDateString = nowInUTC().plus({ days: 7 }).toISO()
const pastDateString = nowInUTC().minus({ days: 7 }).toISO()

const mockEvents: CommunityEventListItem[] = [
  {
    community_event_id: 'event-1',
    community: { community_id: 'community-1', community_name: 'テストコミュニティ1' },
    community_event_name: '未来のイベント（公開済み）',
    community_event_description: 'これは未来のイベントです',
    community_event_start_at: futureDateString,
    community_event_end_at: futureDateString,
    total_event_tickets: 100,
  },
  // ... 他のモックイベント
]

export const WithEvents: Story = {
  name: 'イベントあり',
  args: { events: mockEvents },
  play: async ({ canvasElement, step, args }) => {
    const canvas = within(canvasElement)

    await step('カラムヘッダーが表示されること', async () => {
      const dateHeader = canvas.getByRole('columnheader', { name: '日時' })
      const eventNameHeader = canvas.getByRole('columnheader', { name: 'イベント名' })

      await expect(dateHeader).toBeInTheDocument()
      await expect(eventNameHeader).toBeInTheDocument()
    })

    await step('イベント行が正しい数表示されること', async () => {
      const eventRows = canvas.getAllByRole('row')
      const eventRowCount = eventRows.length - 1 // ヘッダー行を除く

      await expect(eventRowCount).toBe(args.events?.length)
    })
  },
}

export const Empty: Story = {
  name: 'イベントなし',
  args: { events: [] },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)

    await step('EmptyTableRowが表示されること', async () => {
      const emptyMessage = canvas.getByText('表示するイベントがありません')
      await expect(emptyMessage).toBeInTheDocument()
    })
  },
}
```

### 実践的なStory例: インタラクションとモーダル

より複雑なインタラクションテストの例として、QRスキャナーのStoryを示す。

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
    nextjs: {
      navigation: {
        segments: [['staffPortalToken', 'story-specific-token']],
      },
    },
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

    await step('再度入力するとボタンが有効化される', async () => {
      await userEvent.type(input, 'TEST')
      await expect(button).toBeEnabled()
    })
  },
}

export const ModalOpen_FromManualInput: Story = {
  name: 'モーダル: 手動入力から開く',
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByPlaceholderText('入場コードを入力')
    const button = canvas.getByRole('button', { name: '確認' })

    await step('確認ボタンをクリックするとモーダルが開く', async () => {
      await userEvent.type(input, 'TEST_CODE_001')
      await userEvent.click(button)

      // モーダルはポータル経由でcanvasの外側にレンダリングされるため、
      // document.bodyから検索する
      const body = within(document.body)
      const dialog = await body.findByRole('dialog')
      await expect(dialog).toBeInTheDocument()
    })
  },
}

// カメラアクセス拒否のテスト -- decoratorでnavigator.mediaDevicesをモック
export const Camera_PermissionDenied: Story = {
  name: 'カメラ: アクセス拒否',
  decorators: [
    (Story) => {
      const originalGetUserMedia = navigator.mediaDevices?.getUserMedia

      if (navigator.mediaDevices) {
        navigator.mediaDevices.getUserMedia = () => {
          return Promise.reject(
            new DOMException('Permission denied', 'NotAllowedError'),
          )
        }
      }

      function Wrapper() {
        const storyElement = <Story />
        useEffect(() => {
          return () => {
            if (navigator.mediaDevices && originalGetUserMedia) {
              navigator.mediaDevices.getUserMedia = originalGetUserMedia
            }
          }
        }, [])
        return storyElement
      }

      return <Wrapper />
    },
  ],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const alertTitle = canvas.getByText('カメラへのアクセスが拒否されました')
    await expect(alertTitle).toBeInTheDocument()
  },
}
```

#### テクニック集

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
# 全テスト実行（watchモード）
./bin/test

# プロジェクト別実行
./bin/test client       # Hooksテストのみ
./bin/test server       # サーバーテストのみ
./bin/test storybook    # Storybookテストのみ

# 特定ファイルのテスト
./bin/test src/features/events/hooks/use-event-filtering.test.ts

# CI用（カバレッジ付き、一度だけ実行）
./bin/test --ci
```
