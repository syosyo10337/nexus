---
tags:
  - nextjs
  - react-hooks
  - url-params
  - typescript
created: 2026-02-24
updated_at: 2026-02-24
status: active
---

# useQueryControl: 型安全なURL検索パラメータ管理

URL の検索パラメータ（クエリパラメータ）を型安全に操作するための汎用 Hook。

> 関連ファイル: [モーダル & フォームパターン](09b-hooks-modal-patterns.md) -- useFormModal, DeleteModal Compound Component, 画像フィールド Discriminated Union

---

## 型定義と実装

```typescript
// src/shared/hooks/use-query-control.ts
'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useCallback, useTransition, useMemo } from 'react'

import { resetPageParam, buildSearchParams, shouldResetPage } from '@/shared/utils/format/search-params'

/**
 * クエリコントロールの設定型
 */
interface QueryControlConfig<TParams extends Record<string, string | undefined>> {
  /** 検索パラメータのキー定義 */
  paramKeys: Record<string, keyof TParams>
  /** ページリセットをトリガーするキー */
  resetTriggerKeys: readonly (keyof TParams)[]
  /** ページキー名（デフォルト: 'page'） */
  pageKey?: keyof TParams
}

/**
 * 汎用クエリコントロールhookの戻り値の型
 */
interface QueryControlResult<TParams extends Record<string, string | undefined>> {
  /** 現在のパラメータ値 */
  currentValues: TParams
  /** ローディング状態 */
  isPending: boolean
  /** パラメータ更新関数 */
  updateParam: (key: keyof TParams, value: string | undefined) => void
  /** 複数パラメータ一括更新関数 (1回のpushにまとめる) */
  updateParams: (updates: Partial<TParams>) => void
  /** ページ更新関数 */
  updatePage: (page: number) => void
}

/**
 * 汎用検索パラメータ制御hook
 *
 * URLパラメータの取得・更新・ナビゲーションを管理する汎用hook。
 * 設定オブジェクトを受け取り、各機能に必要な検索パラメータ操作を提供する。
 */
export function useQueryControl<TParams extends Record<string, string | undefined>>(
  {
    paramKeys,
    resetTriggerKeys,
    pageKey = 'page',
  }: QueryControlConfig<TParams>,
): QueryControlResult<TParams> {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  // URLパラメータ更新の実行
  const executeNavigation = useCallback((params: URLSearchParams) => {
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`)
    })
  }, [pathname, router])

  // パラメータ更新のコア処理
  const updateSearchParams = useCallback((updates: Partial<TParams>) => {
    const params = buildSearchParams(searchParams, updates)

    if (shouldResetPage(updates, resetTriggerKeys)) {
      resetPageParam(params, pageKey as string)
    }

    executeNavigation(params)
  }, [searchParams, executeNavigation, resetTriggerKeys, pageKey])

  const updateParam = useCallback((key: keyof TParams, value: string | undefined) => {
    updateSearchParams({ [key]: value } as Partial<TParams>)
  }, [updateSearchParams])

  // 複数キーをまとめて更新 (ソート種別+方向など同時反映したいケース向け)
  const updateParams = useCallback((updates: Partial<TParams>) => {
    updateSearchParams(updates)
  }, [updateSearchParams])

  const updatePage = useCallback((page: number) => {
    updateSearchParams({ [pageKey]: page.toString() } as Partial<TParams>)
  }, [updateSearchParams, pageKey])

  const currentValues = useMemo(() => {
    const values = {} as TParams
    Object.entries(paramKeys).forEach(([_, paramKey]) => {
      values[paramKey as keyof TParams] = searchParams.get(paramKey as string) as TParams[keyof TParams]
    })
    return values
  }, [searchParams, paramKeys])

  return {
    currentValues,
    isPending,
    updateParam,
    updateParams,
    updatePage,
  }
}
```

## 設計上の判断

| 要素 | 解説 |
| --- | --- |
| `useTransition` | `router.push` をトランジションとしてマークする。これにより `isPending` でローディング状態を管理でき、ナビゲーション中も UI がブロックされない。Suspense と組み合わせることで、データフェッチ中のスケルトン表示を制御する |
| `resetTriggerKeys` | フィルター変更時にページを自動リセットする機能。例えば検索条件やステータスフィルターを変更した場合、自動的に `page` パラメータが削除され 1 ページ目に戻る。ユーザーが 3 ページ目でフィルターを変えた際に、空の結果ページが表示される問題を防ぐ |
| `updateParams` | 複数パラメータを 1 回の `router.push` にまとめて更新する。ソート種別とソート方向の同時変更など、関連パラメータを一括反映したいケースで使用する。個別に `updateParam` を 2 回呼ぶと中間状態でナビゲーションが発生してしまう |
| `TParams` generics | 利用側が `Record<string, string \| undefined>` を満たす型を定義し、それに制約される。パラメータ名のタイプミスをコンパイル時に検出できる |

## ヘルパー関数

```typescript
// src/shared/utils/format/search-params.ts

/**
 * URLパラメータを構築する汎用ヘルパー関数
 */
export function buildSearchParams<T extends Record<string, string | undefined>>(
  currentParams: URLSearchParams,
  updates: Partial<T>,
): URLSearchParams {
  // 元のURLSearchParamsオブジェクトを変更しないよう
  const params = new URLSearchParams(currentParams.toString())

  Object.entries(updates).forEach(([key, value]) => {
    if (value === undefined || value === '') {
      params.delete(key)
    } else {
      params.set(key, value)
    }
  })

  return params
}

/**
 * ページ番号をリセット
 */
export function resetPageParam(params: URLSearchParams, pageKey = 'page'): void {
  params.delete(pageKey)
}

/**
 * 指定されたキーのいずれかが更新オブジェクトに含まれているかを判定
 */
export function shouldResetPage<T extends Record<string, string | undefined>>(
  updates: Partial<T>,
  resetKeys: readonly (keyof T)[],
): boolean {
  return resetKeys.some(key => key in updates)
}
```

- `buildSearchParams` は元の `URLSearchParams` を破壊しないよう新しいインスタンスを生成する（イミュータブルな操作）
- `undefined` や空文字列の値はパラメータから削除される（URL をクリーンに保つ）

## 利用例: イベント参加者検索

```typescript
// src/app/(authenticated)/event-registrants/_hooks/use-event-registrants-query-control.ts
'use client'

import { useCallback } from 'react'

import { useQueryControl } from '@/shared/hooks/use-query-control'

import { EVENT_REGISTRANTS_SEARCH_PARAM_KEYS } from '../_constants/search-control'
import type { ActiveEventRegistrantsSearchParams } from '../_types/event-registrants-search-params'

interface UseEventRegistrantsQueryControl {
  currentValues: ActiveEventRegistrantsSearchParams
  isPending: boolean
  updateSearchQuery: (query: string) => void
  updateEventFilter: (eventId: string | undefined) => void
  updatePage: (page: number) => void
}

const resetTriggerKeys = [
  EVENT_REGISTRANTS_SEARCH_PARAM_KEYS.SEARCH_QUERY,
  EVENT_REGISTRANTS_SEARCH_PARAM_KEYS.FILTER_COMMUNITY_EVENT_ID,
] as const

/**
 * イベント参加者検索・フィルタリング操作フック
 *
 * URLパラメータの取得・更新・ナビゲーションを管理する。
 * 検索やフィルター変更時は自動的にページをリセットする。
 */
export function useEventRegistrantsQueryControl(): UseEventRegistrantsQueryControl {
  const {
    currentValues,
    isPending,
    updateParam,
    updatePage,
  } = useQueryControl<ActiveEventRegistrantsSearchParams>({
    paramKeys: EVENT_REGISTRANTS_SEARCH_PARAM_KEYS,
    resetTriggerKeys,
    pageKey: EVENT_REGISTRANTS_SEARCH_PARAM_KEYS.PAGE,
  })

  // 検索クエリ更新
  const updateSearchQuery = useCallback((query: string) => {
    updateParam(EVENT_REGISTRANTS_SEARCH_PARAM_KEYS.SEARCH_QUERY, query)
  }, [updateParam])

  // イベントフィルター更新
  const updateEventFilter = useCallback((eventId: string | undefined) => {
    updateParam(EVENT_REGISTRANTS_SEARCH_PARAM_KEYS.FILTER_COMMUNITY_EVENT_ID, eventId)
  }, [updateParam])

  return {
    currentValues,
    isPending,
    updateSearchQuery,
    updateEventFilter,
    updatePage,
  }
}
```

ページ固有の Hook でラップすることで、`updateParam` のキー指定を隠蔽し、`updateSearchQuery` や `updateEventFilter` といったドメイン固有のインターフェースを提供する。汎用 Hook の柔軟性を保ちながら、利用側の API を簡潔にする設計である。
