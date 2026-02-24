---
tags:
  - nextjs
  - testing
  - vitest
  - container-presentational
created: 2026-02-24
updated_at: 2026-02-24
status: active
---

# テストパターン: Container/Presentational & Hooks

Birdcageでは Container/Presentational パターンに沿ってテストを分離している。

関連ドキュメント:

- [テスト環境: Vitest 3プロジェクト構成 & セットアップ](10a-testing-vitest-config.md)
- [Storybook設定 & Story実装パターン](10c-storybook-setup.md)

---

## Container (Server) テスト

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

### テスト手法の解説

- **async RSCを直接呼び出す** -- `await EventListContainer()` でサーバーコンポーネントを関数として実行する。React Server Componentはasync関数なので、Promiseとして評価できる。
- **`type` でレンダリングされるコンポーネントを確認** -- 戻り値のJSX要素の `type` プロパティで、正しいPresentationalコンポーネントが使われているかを検証。
- **`props` で渡されるデータを検証** -- Containerがfetchしたデータが正しくPresentationalに渡されることを確認。
- **MSWがAPIリクエストをインターセプト** -- `vitest.setup.ts` で起動されたMSWサーバーが、バックエンドAPIへのリクエストをモックデータで返す。

### エラーケースのテスト例

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

---

## Client (Hooks) テスト

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
