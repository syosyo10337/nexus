# 汎用 Hooks リファレンス

Birdcage で利用されている汎用 Hooks とコンポーネントパターンをまとめる。

---

## useQueryControl -- 型安全な URL 検索パラメータ管理

URL の検索パラメータ（クエリパラメータ）を型安全に操作するための汎用 Hook。

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

### 設計上の判断

| 要素 | 解説 |
| --- | --- |
| `useTransition` | `router.push` をトランジションとしてマークする。これにより `isPending` でローディング状態を管理でき、ナビゲーション中も UI がブロックされない。Suspense と組み合わせることで、データフェッチ中のスケルトン表示を制御する |
| `resetTriggerKeys` | フィルター変更時にページを自動リセットする機能。例えば検索条件やステータスフィルターを変更した場合、自動的に `page` パラメータが削除され 1 ページ目に戻る。ユーザーが 3 ページ目でフィルターを変えた際に、空の結果ページが表示される問題を防ぐ |
| `updateParams` | 複数パラメータを 1 回の `router.push` にまとめて更新する。ソート種別とソート方向の同時変更など、関連パラメータを一括反映したいケースで使用する。個別に `updateParam` を 2 回呼ぶと中間状態でナビゲーションが発生してしまう |
| `TParams` generics | 利用側が `Record<string, string \| undefined>` を満たす型を定義し、それに制約される。パラメータ名のタイプミスをコンパイル時に検出できる |

### ヘルパー関数

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

### 利用例: イベント参加者検索

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

---

## useFormModal -- 作成/編集モーダル状態管理

1 つのモーダルで「作成」と「編集」を兼用するためのモーダル状態管理 Hook。

```typescript
// src/shared/hooks/use-form-modal.ts
'use client'

import { useState } from 'react'

type FormModalMode = 'create' | 'edit'

export interface FormModalControls<T> extends Omit<FormModalProps<T>, 'eventId'> {
  openCreateModal: () => void
  openEditModal: (data: T) => void
}

export interface FormModalProps<T> {
  eventId: string
  isOpen: boolean
  mode: FormModalMode
  initialData: T | undefined
  closeModal: () => void
}

/**
 * 複数のトリガーによって表示したいFormModalの状態管理hooks（汎用版）
 * @template T - フォームで扱うデータの型
 */
export function useFormModal<T>(): FormModalControls<T> {
  const [isOpen, setIsOpen] = useState(false)
  const [mode, setMode] = useState<FormModalMode>('create')
  const [initialData, setInitialData] = useState<T | undefined>()

  const openCreateModal = () => {
    setMode('create')
    setInitialData(undefined)
    setIsOpen(true)
  }

  const openEditModal = (data: T) => {
    setMode('edit')
    setInitialData(data)
    setIsOpen(true)
  }

  const closeModal = () => {
    setIsOpen(false)
    setInitialData(undefined)
  }

  return {
    isOpen,
    mode,
    initialData,
    openCreateModal,
    openEditModal,
    closeModal,
  }
}
```

### 設計の解説

- **mode による切り替え**: `'create'` と `'edit'` の 2 つのモードでモーダルの表示内容と動作を切り替える。作成時は `initialData` が `undefined`、編集時は既存データが設定される
- **closeModal でのクリーンアップ**: モーダルを閉じる際に `initialData` を `undefined` にリセットする。これにより、次にモーダルを開いた際に前回の編集データが残留する問題を防ぐ
- **FormModalProps の型分離**: Hook の戻り値（`FormModalControls`）とモーダルコンポーネントの Props（`FormModalProps`）を分離している。`FormModalProps` には `eventId` が含まれるが、Hook の戻り値には含まれない（`Omit<FormModalProps<T>, 'eventId'>`）。`eventId` は親コンポーネントから直接渡す設計である

### 利用例: プログラムフォームモーダル

```typescript
// src/features/event-programs/components/program-form-modal/index.tsx
'use client'

import type { CommunityEventProgram } from '@/api/__generated__/models'
import { createEventProgramAction } from '@/features/event-programs/actions/create-event-program-action'
import { updateEventProgramAction } from '@/features/event-programs/actions/update-event-program-action'
import { Dialog } from '@/shared/components/ui/dialog'
import { useFormModal, type FormModalProps } from '@/shared/hooks/use-form-modal'

import { ProgramFormModalContent } from './modal-content'

export function ProgramFormModal({
  eventId,
  isOpen,
  mode,
  initialData,
  closeModal,
}: FormModalProps<CommunityEventProgram>) {
  return (
    <Dialog
      open={isOpen}
      onOpenChange={closeModal}
    >
      {isOpen && (
        mode === 'create'
          ? (
              <ProgramFormModalContent
                mode="create"
                program={initialData}
                eventId={eventId}
                action={createEventProgramAction}
                onCancel={closeModal}
              />
            )
          : (
              <ProgramFormModalContent
                mode="edit"
                program={initialData!}
                eventId={eventId}
                action={updateEventProgramAction}
                onCancel={closeModal}
              />
            )
      )}
    </Dialog>
  )
}

export function useProgramFormModal() {
  const {
    openCreateModal,
    openEditModal,
    ...rest
  } = useFormModal<CommunityEventProgram>()

  return {
    ...rest,
    openCreateProgramModal: openCreateModal,
    openEditProgramModal: openEditModal,
  }
}
```

`useProgramFormModal` は汎用 Hook をラップし、`openCreateProgramModal` / `openEditProgramModal` というドメイン固有の名前を付けている。`mode` に応じて `createEventProgramAction` と `updateEventProgramAction` を使い分けることで、1 つのモーダルコンポーネントで作成と編集の両方に対応する。

---

## DeleteModal -- Compound Component パターン

削除確認モーダルを汎用的に構築するための Compound Component パターン。状態管理（Hook）、外枠（AlertDialog）、内容（確認 UI + Server Action 実行）の 3 つの部品を組み合わせて使用する。

### ディレクトリ構成

```text
src/shared/components/business/delete-modal/
├── index.ts                # 公開API（エクスポート）
├── types.ts                # 型定義
├── hooks.ts                # 状態管理Hook
├── delete-modal.tsx        # 外枠コンポーネント
└── delete-modal-content.tsx # 内容コンポーネント
```

### types.ts -- 型定義

```typescript
// src/shared/components/business/delete-modal/types.ts
import type { ReactNode } from 'react'

// Modal UIに必要な基本プロパティ
export interface DeleteModalProps<T> {
  isOpen: boolean
  data: T | undefined
  closeModal: () => void
}

// フックが返すコントロール（基本プロパティ + openModal）
export interface DeleteModalControls<T> extends DeleteModalProps<T> {
  openModal: (data: T) => void
}

// UIコンポーネントのプロパティ（基本プロパティ + children）
export interface DeleteModalComponentProps<T> extends DeleteModalProps<T> {
  children: (data: T) => ReactNode
}

// 削除アクションのstate定義
export type BaseDeleteState =
  | {
    success: true
  }
  | {
    success: false
    message: string
  }

// 削除アクションの型定義
export type DeleteAction = (
  prevState: BaseDeleteState,
  params: any,
) => Promise<BaseDeleteState>
```

### hooks.ts -- 状態管理 Hook

```typescript
// src/shared/components/business/delete-modal/hooks.ts
'use client'

import { useState } from 'react'

import type { DeleteModalControls } from './types'

export function useDeleteModal<T>(): DeleteModalControls<T> {
  const [isOpen, setIsOpen] = useState(false)
  const [data, setData] = useState<T | undefined>()

  const openModal = (data: T) => {
    setIsOpen(true)
    setData(data)
  }

  const closeModal = () => {
    setIsOpen(false)
    setData(undefined)
  }

  return {
    isOpen,
    data,
    openModal,
    closeModal,
  }
}
```

### delete-modal.tsx -- 外枠コンポーネント

```typescript
// src/shared/components/business/delete-modal/delete-modal.tsx
'use client'

import { AlertDialog } from '@/shared/components/ui/alert-dialog'

import type { DeleteModalComponentProps } from './types'

export function DeleteModal<T>({
  isOpen,
  data,
  closeModal,
  children,
}: DeleteModalComponentProps<T>) {
  return (
    <AlertDialog
      open={isOpen}
      onOpenChange={closeModal}
    >
      {data && children(data)}
    </AlertDialog>
  )
}
```

`data && children(data)` により、`data` が存在する場合のみ子コンポーネント（`DeleteModalContent`）をレンダリングする。これは null guard の役割を果たし、`children` 内で `data` が必ず存在することを保証する。

### delete-modal-content.tsx -- 内容コンポーネント

```typescript
// src/shared/components/business/delete-modal/delete-modal-content.tsx
import { useActionState, useEffect } from 'react'
import { toast } from 'sonner'

import {
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/shared/components/ui/alert-dialog'
import { Button } from '@/shared/components/ui/button'
import { INITIAL_STATE } from '@/shared/constants/server-action-state'

import type { DeleteAction } from './types'

interface DeleteModalContentProps<T extends { name: string }> {
  data: T
  action: DeleteAction
  onCancel: () => void
  entityName: string
  getActionParams: (data: T) => unknown
  variant?: 'default' | 'destructive'
  additionalDescription?: string
}

export function DeleteModalContent<T extends { name: string }>({
  data,
  action,
  onCancel,
  entityName,
  getActionParams,
  variant = 'destructive',
  additionalDescription,
}: DeleteModalContentProps<T>) {
  const [state, formAction, isPending] = useActionState(action, INITIAL_STATE)

  useEffect(() => {
    if (state.success) {
      toast.success(`${entityName}が正常に削除されました。`)
      onCancel()
      return
    }

    if (!state.success && state.message) {
      toast.error(`${entityName}の削除に失敗しました。`, {
        description: state.message,
      })
    }
  }, [state, onCancel, entityName])

  const onFormSubmit = (_: FormData) => {
    formAction(getActionParams(data))
  }

  const buttonClass
    = variant === 'destructive'
      ? 'bg-destructive hover:bg-destructive/90 text-destructive-foreground'
      : 'bg-primary hover:bg-primary/90 text-primary-foreground'

  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>{entityName}を削除しますか？</AlertDialogTitle>
        <AlertDialogDescription className="leading-relaxed whitespace-pre-wrap">
          {`「${data.name}」を削除します。この操作は取り消せません。`}
          {additionalDescription && (
            <>
              <br />
              {additionalDescription}
            </>
          )}
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel onClick={onCancel}>キャンセル</AlertDialogCancel>
        <form action={onFormSubmit}>
          <Button
            type="submit"
            className={buttonClass}
            disabled={isPending}
          >
            {isPending ? '削除中...' : '削除する'}
          </Button>
        </form>
      </AlertDialogFooter>
    </AlertDialogContent>
  )
}
```

### Compound Component パターンの解説

| 部品 | 役割 | カスタマイズポイント |
| --- | --- | --- |
| `useDeleteModal` | 状態管理（開閉状態 + 削除対象データ） | ジェネリクス `T` で任意のデータ型に対応 |
| `DeleteModal` | 外枠（AlertDialog + null guard） | `data` の存在チェックを担当し、内部で安全にデータにアクセス可能にする |
| `DeleteModalContent` | 内容（確認 UI + Server Action 実行） | `entityName` で表示テキスト、`getActionParams` で Action のパラメータ、`action` で実行する Server Action をカスタマイズ |

利用者はこの 3 つを組み合わせて使用する。`entityName` と `getActionParams` を変えるだけで、任意のエンティティ（プログラム、チケット、早割クーポン等）の削除に対応できる。

### 利用例: プログラム削除モーダル

```typescript
// src/features/event-programs/components/program-delete-modal/index.tsx
'use client'

import type { CommunityEventProgram } from '@/api/__generated__/models'
import { deleteEventProgramAction } from '@/features/event-programs/actions/delete-event-program-action'
import { DeleteModal, useDeleteModal, type DeleteModalProps } from '@/shared/components/business/delete-modal'

import { ProgramDeleteModalContent } from './modal-content'

interface ProgramDeleteModalProps extends DeleteModalProps<CommunityEventProgram> {
  eventId: string
}

export function ProgramDeleteModal({
  eventId,
  isOpen,
  data: program,
  closeModal,
}: ProgramDeleteModalProps) {
  return (
    <DeleteModal
      isOpen={isOpen}
      data={program}
      closeModal={closeModal}
    >
      {program => (
        <ProgramDeleteModalContent
          eventId={eventId}
          program={program}
          action={deleteEventProgramAction}
          onCancel={closeModal}
        />
      )}
    </DeleteModal>
  )
}

export function useProgramDeleteModal() {
  const {
    openModal,
    ...rest
  } = useDeleteModal<CommunityEventProgram>()

  return {
    ...rest,
    openDeleteProgramModal: openModal,
  }
}
```

`useProgramDeleteModal` で `openModal` を `openDeleteProgramModal` にリネームし、ドメイン固有のインターフェースを提供する。`DeleteModal` と `DeleteModalContent` を組み合わせて使い、`children` の render prop パターンで null guard 済みの `program` データを受け取る。

### index.ts -- 公開 API

```typescript
// src/shared/components/business/delete-modal/index.ts
// UIコンポーネント
export { DeleteModal } from './delete-modal'
export { DeleteModalContent } from './delete-modal-content'

// フック
export { useDeleteModal } from './hooks'

// 型定義
export type {
  DeleteModalProps,
  DeleteModalControls,
  DeleteModalComponentProps,
  BaseDeleteState,
  DeleteAction,
} from './types'
```

`index.ts` でバレルエクスポートを提供し、利用側は `@/shared/components/business/delete-modal` からまとめてインポートできる。

---

## 画像フィールド Discriminated Union

画像フィールドの 3 つの状態（既存画像 / 新規アップロード / 未設定）を Discriminated Union で表現するバリデーションスキーマ。

```typescript
// src/shared/validators/image-field.ts
import { z } from 'zod'

// 画像フィールドのタイプ定数
export const IMAGE_FIELD_TYPES = {
  EXISTING: 'existing',
  NEW: 'new',
  EMPTY: 'empty',
} as const

export type ImageFieldType = typeof IMAGE_FIELD_TYPES[keyof typeof IMAGE_FIELD_TYPES]

/**
 * 画像フィールドのUnion型スキーマ
 * @see https://zod.dev/api#files
 */
export const requiredImageFieldSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal(IMAGE_FIELD_TYPES.EXISTING),
    url: z.url(),
  }),
  z.object({
    type: z.literal(IMAGE_FIELD_TYPES.NEW),
    // NOTE: ユーザがアップロードできる画像サイズの上限(圧縮前の画像サイズ)
    //       imageCompressionで最大2MBに圧縮されるため、実際のリクエストボディには圧縮後のサイズ（最大2MB）が含まれる
    file: z.file()
      .mime(['image/jpeg', 'image/png'], { error: '画像形式はJPEG、PNGのみ対応しています' })
      .max(5 * 1024 * 1024, { error: '画像サイズは5MB以下にしてください' }),
  }),
  z.object({
    type: z.literal(IMAGE_FIELD_TYPES.EMPTY),
  }),
])

export type ImageFieldValue = z.infer<typeof requiredImageFieldSchema>
```

### 3 つの状態

| type | 含まれるフィールド | 用途 |
| --- | --- | --- |
| `'existing'` | `url: string` | 既存の画像 URL を保持。編集フォームで画像が変更されなかった場合 |
| `'new'` | `file: File` | 新規にアップロードされたファイル。MIME タイプ（JPEG/PNG）とサイズ（5MB 以下）のバリデーション付き |
| `'empty'` | なし | 画像が未設定の状態。任意画像フィールドで画像を削除した場合など |

### Discriminated Union の利点

`type` フィールドを判別子として `z.discriminatedUnion` を使用することで、TypeScript の型絞り込み（narrowing）が機能する。

```typescript
// 型安全なアクセスの例
function processImage(image: ImageFieldValue) {
  switch (image.type) {
    case 'existing':
      // image.url に安全にアクセス可能（string型）
      console.log(image.url)
      break
    case 'new':
      // image.file に安全にアクセス可能（File型）
      uploadFile(image.file)
      break
    case 'empty':
      // 追加フィールドなし
      clearImage()
      break
  }
}
```

通常の `z.union` と比較して、`z.discriminatedUnion` はバリデーション時に `type` フィールドを先に確認して該当するスキーマのみを検証するため、パフォーマンスとエラーメッセージの精度が向上する。

### 画像サイズに関する注意

スキーマ上の上限は 5MB だが、実際のアップロードフローでは `imageCompression` ライブラリにより最大 2MB に圧縮される。5MB はユーザーが選択可能なファイルサイズの上限であり、API リクエストボディに含まれる画像は圧縮後のサイズとなる。
