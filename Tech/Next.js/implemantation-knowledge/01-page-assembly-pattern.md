# ページ組み立てパターン

Next.js 15 App Router におけるページの組み立て方のベストプラクティスをまとめる。

---

## 核心パターン: ClientErrorBoundary > Suspense > Container

Birdcage のページは、以下の 3 層ネスト構造を基本とする。

```typescript
// src/app/(authenticated)/events/(list)/page.tsx
import { Suspense } from 'react'

import { BreadcrumbRegister } from '@/shared/components/layout/breadcrumb-register'
import { ClientErrorBoundary } from '@/shared/components/utility/client-error-boundary'
import { EVENT_ROUTES } from '@/shared/constants/routes'

import { EventListContainer } from './_components/event-list-container'
import { EventListErrorFallback } from './_components/event-list-container/error-fallback'
import { EventSkeleton } from './_components/event-list-container/event-list-skeleton'
import { EventListHeader } from './_components/header'

export default function Page() {
  const breadcrumbItems = [
    {
      label: 'コミュニティイベント',
      href: EVENT_ROUTES.INDEX,
    },
    {
      label: '一覧',
      isCurrent: true,
    },
  ]

  return (
    <div className="flex flex-col gap-4">
      <BreadcrumbRegister items={breadcrumbItems} />
      <EventListHeader />

      <ClientErrorBoundary fallback={EventListErrorFallback}>
        <Suspense fallback={<EventSkeleton />}>
          <EventListContainer />
        </Suspense>
      </ClientErrorBoundary>
    </div>
  )
}
```

### 3 層の役割

| レイヤー              | 役割                                                                                                                                                                                                            |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ClientErrorBoundary` | Container 内で発生した非同期エラー（API エラー等）をキャッチし、エラーフォールバック UI を表示する。React の Error Boundary はクライアントコンポーネントでしか動作しないため、`'use client'` で実装されている。 |
| `Suspense`            | Container が `async` で非同期データ取得を行う間、スケルトン UI をフォールバックとして表示する。ストリーミング SSR の起点となる。                                                                                |
| `Container`           | 実際のデータフェッチを行う async React Server Component。取得したデータを Presentational コンポーネントに渡す。                                                                                                 |

この順序は重要である。ErrorBoundary が Suspense の外側にあることで、データフェッチ中のエラーが確実にキャッチされる。逆にすると、Suspense が解決する前にエラーが発生した場合にフォールバックが表示されない。

---

## Suspense key トリック

`searchParams` の変更だけでは Suspense の再レンダリングがトリガーされない。React は同じコンポーネントツリー構造であれば既存のインスタンスを再利用するためである。

```typescript
// src/app/(authenticated)/event-registrants/page.tsx
interface PageProps {
  searchParams: Promise<ActiveEventRegistrantsSearchParams>
}

export default async function Page({ searchParams }: PageProps) {
  const awaitedSearchParams = await searchParams
  const suspenseKey = JSON.stringify(awaitedSearchParams)

  return (
    <div className="flex flex-col gap-4">
      {/* ... */}
      <Suspense
        key={suspenseKey}
        fallback={<EventRegistrantsListSkelton />}
      >
        <EventRegistrantsListContainer searchParams={awaitedSearchParams} />
      </Suspense>
    </div>
  )
}
```

### なぜ必要か

`key` に `JSON.stringify(searchParams)` を指定することで、searchParams が変わるたびに React はその Suspense boundary を破棄・再生成する。これにより以下が保証される:

1. **RSC の再フェッチ**: Container コンポーネントが新しい searchParams で再実行される
2. **スケルトン表示**: 再生成されるため、Suspense のフォールバック（スケルトン UI）が再表示される
3. **古い状態のクリア**: 前回の検索結果が残留せず、確実に新しいデータに切り替わる

`key` を指定しない場合、URL のクエリパラメータが変わっても画面が更新されないという問題が発生する。

---

## Renderless Component: BreadcrumbRegister

Server Component のページから Zustand ストアに値を注入するためのパターン。`null` をレンダリングし、副作用のみを実行する。

```typescript
// src/shared/components/layout/breadcrumb-register.tsx
"use client";

import { useEffect } from "react";

import { useBreadcrumbStore } from "@/shared/stores/breadcrumb-store";

import type { BreadcrumbItemType } from "./app-breadcrumb";

interface Props {
  items: BreadcrumbItemType[];
  clearOnUnmount?: boolean;
}

export function BreadcrumbRegister({ items, clearOnUnmount = true }: Props) {
  const setItems = useBreadcrumbStore((s) => s.setItems);
  const clear = useBreadcrumbStore((s) => s.clear);

  useEffect(() => {
    setItems(items);
    return () => {
      if (clearOnUnmount) clear();
    };
  }, [items, setItems, clear, clearOnUnmount]);

  return null;
}
```

### パターンの解説

- **目的**: Server Component であるページコンポーネントから、クライアントサイドの Zustand ストア（パンくずリスト）にデータを渡す
- **仕組み**: `'use client'` コンポーネントとして宣言し、`useEffect` でマウント時にストアへ値をセットする。アンマウント時には `clear()` でクリーンアップする
- **UI への影響なし**: `return null` であるため DOM には何もレンダリングされない。純粋な副作用コンポーネントである

このパターンは、Server Component がクライアントサイドの状態管理（Zustand）に直接アクセスできない制約を、宣言的に解決する手法である。

---

## loading.tsx / error.tsx / not-found.tsx / global-error.tsx の使い分け

Next.js App Router が提供する特殊ファイルの役割と使い分けを整理する。

| ファイル           | 役割                                                                   | 実行環境                               | ログレベル       |
| ------------------ | ---------------------------------------------------------------------- | -------------------------------------- | ---------------- |
| `loading.tsx`      | Suspense fallback の自動生成。ページ遷移時のスケルトン UI 表示         | Server Component                       | -                |
| `error.tsx`        | Error Boundary として機能。そのルートセグメント内のエラーをキャッチ    | Client Component (`'use client'` 必須) | `LogLevel.Error` |
| `not-found.tsx`    | 404 ページ。`notFound()` 関数呼び出し時に表示                          | Server Component                       | -                |
| `global-error.tsx` | ルートレイアウト (`layout.tsx`) のエラー用。アプリ全体のフォールバック | Client Component (`'use client'` 必須) | `LogLevel.Fatal` |

### loading.tsx の例

```typescript
// src/app/(authenticated)/campus-funds/[id]/loading.tsx
import { Skeleton } from '@/shared/components/ui/skeleton'

export default function Loading() {
  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-64" />
      </div>
      {/* ... */}
    </div>
  )
}
```

### 使い分けの方針

- **`loading.tsx`**: ページ全体のローディング状態に使用。ルートセグメント単位で自動的に Suspense boundary となる。ページ遷移時にスケルトン UI を表示する用途に適している
- **`error.tsx`**: API エラーやランタイムエラーのキャッチに使用。`reset()` 関数でリトライ機能を提供できる。`LogLevel.Error` でエラーレポートを送信する
- **`not-found.tsx`**: 存在しないリソースへのアクセス時に表示。Server Component として実装できるため、データフェッチも可能
- **`global-error.tsx`**: ルートレイアウト自体のエラーをキャッチする最終防衛ライン。`<html>` と `<body>` タグを自前で描画する必要がある（ルートレイアウトが壊れているため）。`LogLevel.Fatal` で最も深刻なエラーとして報告する

---

## Container/Presentational パターン

データフェッチとUIレンダリングを明確に分離するパターン。

### ディレクトリ構成

```text
event-list-container/
├── index.tsx              # Container: データフェッチ（async RSC）
├── presentational.tsx     # Presentational: UI レンダリング（'use client'）
├── presentational.test.tsx # Presentational のテスト
└── index.server.test.tsx  # Container のサーバーサイドテスト
```

### Container（async RSC）

```typescript
// src/app/(authenticated)/events/(list)/_components/event-list-container/index.tsx
import { communityEventServiceListCommunityEvents } from '@/api/__generated__/endpoints/community-event-service/community-event-service'

import { EventListPresentational } from './presentational'

export async function EventListContainer() {
  const events = await communityEventServiceListCommunityEvents({
    per_page: MAX_EVENTS_PER_PAGE,
  })

  return <EventListPresentational events={events.community_events} />
}
```

### Presentational（'use client'）

```typescript
// presentational.tsx
'use client'

export function EventListPresentational({ events }: EventListPresentationalProps) {
  const { dateFilter, statusFilter, ... } = useEventFiltering(events)
  const { sortedEvents } = useEventSorting(filteredEvents)
  const { currentPage, totalPages, paginatedEvents } = useEventPagination(sortedEvents)

  return (
    <div className="space-y-4">
      <EventListFilters ... />
      <EventTable events={paginatedEvents} />
      <Pagination ... />
    </div>
  )
}
```

### 分離の利点

| 側面           | Container                        | Presentational                            |
| -------------- | -------------------------------- | ----------------------------------------- |
| 実行環境       | サーバー                         | クライアント                              |
| ディレクティブ | なし（デフォルト RSC）           | `'use client'`                            |
| 責務           | データフェッチ、データ変換       | UI レンダリング、ユーザーインタラクション |
| 状態管理       | なし                             | hooks（useState, カスタムフック等）       |
| テスト         | `*.server.test.tsx`（node 環境） | `*.test.tsx`（jsdom 環境）                |

この分離により、以下が実現される:

1. **テスタビリティ向上**: Container はサーバーサイドテストで API モック、Presentational は jsdom で UI テストと、それぞれ適切な環境でテストできる
2. **責務の明確化**: データの取得方法と表示方法が明確に分離される
3. **再利用性**: Presentational コンポーネントはデータソースに依存しないため、Storybook での表示やテストデータでの動作確認が容易
