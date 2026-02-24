---
tags:
  - nextjs
  - react-hooks
  - modal
  - compound-component
created: 2026-02-24
updated_at: 2026-02-24
status: active
---

# モーダル & フォームパターン

モーダル関連の汎用 Hooks とコンポーネントパターンをまとめる。

> 関連ファイル: [useQueryControl: 型安全なURL検索パラメータ管理](09a-hooks-query-control.md)

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

export function useFormModal<T>(): FormModalControls<T> {
  const [isOpen, setIsOpen] = useState(false)
  const [mode, setMode] = useState<FormModalMode>('create')
  const [initialData, setInitialData] = useState<T | undefined>()

  const openCreateModal = () => {
    setMode('create'); setInitialData(undefined); setIsOpen(true)
  }
  const openEditModal = (data: T) => {
    setMode('edit'); setInitialData(data); setIsOpen(true)
  }
  const closeModal = () => { setIsOpen(false); setInitialData(undefined) }

  return { isOpen, mode, initialData, openCreateModal, openEditModal, closeModal }
}
```

### 設計の解説

- **mode による切り替え**: `'create'` / `'edit'` でモーダルの表示内容と動作を切り替える。作成時は `initialData` が `undefined`、編集時は既存データが設定される
- **closeModal でのクリーンアップ**: 閉じる際に `initialData` をリセットし、次回オープン時に前回データが残留する問題を防ぐ
- **FormModalProps の型分離**: Hook の戻り値（`FormModalControls`）と Props（`FormModalProps`）を分離。`eventId` は親コンポーネントから直接渡す設計（`Omit<FormModalProps<T>, 'eventId'>`）

利用側では `useFormModal` をラップし、`openCreateProgramModal` / `openEditProgramModal` のようなドメイン固有の名前を付ける。`mode` に応じて `createAction` と `updateAction` を使い分けることで、1 つのモーダルで作成と編集の両方に対応する。

---

## DeleteModal -- Compound Component パターン

削除確認モーダルを汎用的に構築するための Compound Component パターン。状態管理（Hook）、外枠（AlertDialog）、内容（確認 UI + Server Action 実行）の 3 つの部品を組み合わせる。

```text
src/shared/components/business/delete-modal/
├── index.ts                # 公開API
├── types.ts                # 型定義
├── hooks.ts                # 状態管理Hook
├── delete-modal.tsx        # 外枠コンポーネント
└── delete-modal-content.tsx # 内容コンポーネント
```

### types.ts

```typescript
// src/shared/components/business/delete-modal/types.ts
import type { ReactNode } from 'react'

export interface DeleteModalProps<T> {
  isOpen: boolean
  data: T | undefined
  closeModal: () => void
}
export interface DeleteModalControls<T> extends DeleteModalProps<T> {
  openModal: (data: T) => void
}
export interface DeleteModalComponentProps<T> extends DeleteModalProps<T> {
  children: (data: T) => ReactNode
}
export type BaseDeleteState =
  | { success: true }
  | { success: false; message: string }
export type DeleteAction = (
  prevState: BaseDeleteState, params: any,
) => Promise<BaseDeleteState>
```

### hooks.ts

```typescript
// src/shared/components/business/delete-modal/hooks.ts
'use client'
import { useState } from 'react'
import type { DeleteModalControls } from './types'

export function useDeleteModal<T>(): DeleteModalControls<T> {
  const [isOpen, setIsOpen] = useState(false)
  const [data, setData] = useState<T | undefined>()
  const openModal = (data: T) => { setIsOpen(true); setData(data) }
  const closeModal = () => { setIsOpen(false); setData(undefined) }
  return { isOpen, data, openModal, closeModal }
}
```

### delete-modal.tsx

```typescript
// src/shared/components/business/delete-modal/delete-modal.tsx
'use client'
import { AlertDialog } from '@/shared/components/ui/alert-dialog'
import type { DeleteModalComponentProps } from './types'

export function DeleteModal<T>({ isOpen, data, closeModal, children }: DeleteModalComponentProps<T>) {
  return (
    <AlertDialog open={isOpen} onOpenChange={closeModal}>
      {data && children(data)}
    </AlertDialog>
  )
}
```

`data && children(data)` で null guard を行い、`children` 内で `data` が必ず存在することを保証する。

### delete-modal-content.tsx

```typescript
// src/shared/components/business/delete-modal/delete-modal-content.tsx
import { useActionState, useEffect } from 'react'
import { toast } from 'sonner'
import {
  AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
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
  data, action, onCancel, entityName, getActionParams,
  variant = 'destructive', additionalDescription,
}: DeleteModalContentProps<T>) {
  const [state, formAction, isPending] = useActionState(action, INITIAL_STATE)

  useEffect(() => {
    if (state.success) {
      toast.success(`${entityName}が正常に削除されました。`); onCancel(); return
    }
    if (!state.success && state.message) {
      toast.error(`${entityName}の削除に失敗しました。`, { description: state.message })
    }
  }, [state, onCancel, entityName])

  const buttonClass = variant === 'destructive'
    ? 'bg-destructive hover:bg-destructive/90 text-destructive-foreground'
    : 'bg-primary hover:bg-primary/90 text-primary-foreground'

  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>{entityName}を削除しますか？</AlertDialogTitle>
        <AlertDialogDescription className="leading-relaxed whitespace-pre-wrap">
          {`「${data.name}」を削除します。この操作は取り消せません。`}
          {additionalDescription && (<><br />{additionalDescription}</>)}
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel onClick={onCancel}>キャンセル</AlertDialogCancel>
        <form action={(_: FormData) => { formAction(getActionParams(data)) }}>
          <Button type="submit" className={buttonClass} disabled={isPending}>
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
| `useDeleteModal` | 状態管理（開閉 + 対象データ） | ジェネリクス `T` で任意のデータ型に対応 |
| `DeleteModal` | 外枠（AlertDialog + null guard） | `data` の存在チェックを担当 |
| `DeleteModalContent` | 内容（確認 UI + Server Action） | `entityName`, `getActionParams`, `action` をカスタマイズ |

利用側では `useDeleteModal` をラップし、`openDeleteProgramModal` のようなドメイン固有の名前を付ける。`entityName` と `getActionParams` を変えるだけで、任意のエンティティの削除に対応できる。

### index.ts -- 公開 API

```typescript
export { DeleteModal } from './delete-modal'
export { DeleteModalContent } from './delete-modal-content'
export { useDeleteModal } from './hooks'
export type {
  DeleteModalProps, DeleteModalControls, DeleteModalComponentProps,
  BaseDeleteState, DeleteAction,
} from './types'
```

---

## 画像フィールド Discriminated Union

画像フィールドの 3 つの状態（既存画像 / 新規アップロード / 未設定）を Discriminated Union で表現するバリデーションスキーマ。

```typescript
// src/shared/validators/image-field.ts
import { z } from 'zod'

export const IMAGE_FIELD_TYPES = {
  EXISTING: 'existing', NEW: 'new', EMPTY: 'empty',
} as const

export type ImageFieldType = typeof IMAGE_FIELD_TYPES[keyof typeof IMAGE_FIELD_TYPES]

export const requiredImageFieldSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal(IMAGE_FIELD_TYPES.EXISTING), url: z.url() }),
  z.object({
    type: z.literal(IMAGE_FIELD_TYPES.NEW),
    file: z.file()
      .mime(['image/jpeg', 'image/png'], { error: '画像形式はJPEG、PNGのみ対応しています' })
      .max(5 * 1024 * 1024, { error: '画像サイズは5MB以下にしてください' }),
  }),
  z.object({ type: z.literal(IMAGE_FIELD_TYPES.EMPTY) }),
])

export type ImageFieldValue = z.infer<typeof requiredImageFieldSchema>
```

### 3 つの状態

| type | 含まれるフィールド | 用途 |
| --- | --- | --- |
| `'existing'` | `url: string` | 既存画像 URL を保持。編集フォームで画像未変更の場合 |
| `'new'` | `file: File` | 新規アップロード。MIME（JPEG/PNG）とサイズ（5MB以下）のバリデーション付き |
| `'empty'` | なし | 画像未設定。任意画像フィールドで画像を削除した場合 |

### Discriminated Union の利点

`type` フィールドを判別子として使用することで、TypeScript の型絞り込み（narrowing）が機能する。

```typescript
function processImage(image: ImageFieldValue) {
  switch (image.type) {
    case 'existing': console.log(image.url); break    // string型
    case 'new':      uploadFile(image.file); break     // File型
    case 'empty':    clearImage(); break               // 追加フィールドなし
  }
}
```

通常の `z.union` と比較して、`z.discriminatedUnion` は `type` を先に確認して該当スキーマのみを検証するため、パフォーマンスとエラーメッセージの精度が向上する。スキーマ上の上限は 5MB だが、`imageCompression` ライブラリにより実際のアップロードは最大 2MB に圧縮される。
