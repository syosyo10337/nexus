---
tags:
  - nextjs
  - vitest
  - testing
  - msw
created: 2026-02-24
updated_at: 2026-02-24
status: active
---

# テスト環境: Vitest 3プロジェクト構成 & セットアップ

Birdcageプロジェクトでは、Vitest 3のプロジェクト機能を活用して、テスト環境を3つに分離している。加えて、StorybookをPlaywrightベースのブラウザテストとして統合し、ビジュアルリグレッションとインタラクションテストを実現している。

関連ドキュメント:

- [テストパターン: Container/Presentational & Hooks](10b-testing-patterns.md)
- [Storybook設定 & Story実装パターン](10c-storybook-setup.md)

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
