---
tags:
  - nextjs
  - server-actions
  - react-hook-form
  - zod
created: 2026-02-24
updated_at: 2026-02-24
status: active
---

# Server Action 実装パターン

Next.js の Server Action を使ったフォーム送信・データ変更処理のベストプラクティスをまとめる。

---

## ServerActionState 型定義

Server Action の戻り値は **Discriminated Union**（判別可能なユニオン型）で定義する。

```typescript
// src/shared/types/server-action.ts
export type ServerActionState =
  | {
    success: true
  }
  | {
    success: false
    message: string
  }

export type ValidateBodyResult<APIRequestBody> =
  | {
    error: ServerActionState
    data: undefined
  }
  | {
    error: undefined
    data: APIRequestBody
  }
```

```typescript
// src/shared/constants/server-action-state.ts
import type { ServerActionState } from '../types/server-action'

export const INITIAL_STATE: ServerActionState = {
  success: false,
  message: '',
}
```

### Discriminated Union の利点

`success` フィールドを判別子（discriminant）とすることで、TypeScript の型絞り込み（narrowing）が機能する。

```typescript
if (state.success) {
  // ここでは state は { success: true } 型
  // state.message にはアクセスできない（存在しない）
} else {
  // ここでは state は { success: false; message: string } 型
  // state.message に安全にアクセスできる
  console.error(state.message)
}
```

同様に `ValidateBodyResult` も `error` / `data` の有無で分岐することで、バリデーション成功時には `data` が確実に存在し、失敗時には `error` が確実に存在することが型レベルで保証される。

---

## 完全な Server Action 実装例

イベント作成の Server Action を例に、実装の全体像を示す。

```typescript
// src/features/events/actions/create-event-action.ts
'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'

import { communityEventServiceCreateCommunityEvent } from '@/api/__generated__/endpoints/community-event-service/community-event-service'
import { CommunityEventServiceCreateCommunityEventBody } from '@/api/__generated__/endpoints/community-event-service/community-event-service.zod'
import type { CreateCommunityEventRequestBody } from '@/api/__generated__/models'
import { type EventWizardFormValues } from '@/app/(authenticated)/events/new/_validators/event-wizard'
import { EVENT_ROUTES } from '@/shared/constants/routes'
import type { ServerActionState, ValidateBodyResult } from '@/shared/types/server-action'
import { IMAGE_FIELD_TYPES } from '@/shared/validators/image-field'

export async function createEventAction(
  _prevState: ServerActionState,
  data: Partial<EventWizardFormValues>,
): Promise<ServerActionState> {
  try {
    const { error: payloadError, data: validatedPayload } = _validateAndTransformPayload(data as EventWizardFormValues)
    if (payloadError) return payloadError

    await communityEventServiceCreateCommunityEvent(validatedPayload)

    revalidatePath(EVENT_ROUTES.INDEX)

    return { success: true }
  } catch (error) {
    console.error('イベント作成エラー:', error)
    return {
      success: false,
      message: 'イベントの作成中にエラーが発生しました',
    }
  }
}

function _validateAndTransformPayload({
  basicInfo,
  program,
  ticket,
  earlyBirdDiscount,
}: EventWizardFormValues): ValidateBodyResult<CreateCommunityEventRequestBody> {
  const payload: CreateCommunityEventRequestBody = {
    community_id: basicInfo.community_id,
    community_event_name: basicInfo.community_event_name,
    // ... フォームデータから API ペイロードへの変換 ...
  }

  const apiValidationResult = CommunityEventServiceCreateCommunityEventBody.safeParse(payload)

  if (!apiValidationResult.success) {
    console.error('API validation error:', z.prettifyError(apiValidationResult.error))
    return {
      error: { success: false, message: 'データ形式が正しくありません。入力内容をご確認ください。' },
      data: undefined,
    }
  }

  return { error: undefined, data: apiValidationResult.data as unknown as CreateCommunityEventRequestBody }
}
```

### 実装の流れ（5 ステップ）

| ステップ | 処理内容 | 詳細 |
| --- | --- | --- |
| 1. 変換 | フォームデータ → API ペイロード | UI 固有のフィールド（日付文字列等）を API が期待する形式に変換する |
| 2. バリデーション | Orval 生成の Zod スキーマで検証 | `CommunityEventServiceCreateCommunityEventBody.safeParse()` でサーバーサイドのデータ整合性を保証する |
| 3. API 呼び出し | 生成されたクライアントで API 実行 | サーバー側のインポート（`*.ts`）を使用する。`*.query.ts` は使わない |
| 4. キャッシュ無効化 | `revalidatePath` でページキャッシュを破棄 | 一覧ページ等の関連ページのキャッシュを更新する |
| 5. 結果返却 | `ServerActionState` で成否を返す | 成功時は `{ success: true }`、失敗時はユーザー向けメッセージ付き |

### 重要なポイント

- **`'use server'` ディレクティブ**: ファイル先頭に記述。この関数がサーバーでのみ実行されることを宣言する
- **`_prevState` パラメータ**: `useActionState` フックとの互換性のため必要。前回の実行結果が渡される
- **エラーハンドリング**: try-catch で API エラーを捕捉し、ユーザーフレンドリーなメッセージを返す。スタックトレースは `console.error` でサーバーログに記録する
- **プライベート関数の命名**: `_validateAndTransformPayload` のようにアンダースコアプレフィックスを付け、モジュール内部のヘルパーであることを示す

---

## クライアント側消費パターン: useActionState + useEffect

Server Action をクライアントコンポーネントから呼び出す際のパターン。

```typescript
// src/app/(authenticated)/events/new/(wizard)/confirmation/_components/event-wizard-confirmation/index.tsx
'use client'

import { useActionState, useEffect } from 'react'
import { toast } from 'sonner'

import { createEventAction } from '@/features/events/actions/create-event-action'
import { INITIAL_STATE } from '@/shared/constants/server-action-state'

export function ConfirmationStep({ formData, onBack, onSubmit }: ConfirmationStepProps) {
  const router = useRouter()
  const [state, formAction, isPending] = useActionState(createEventAction, INITIAL_STATE)

  useEffect(() => {
    if (state.success) {
      toast.success('イベントが作成されました', {
        description: 'イベントが正常に作成されました。',
      })
      router.replace(EVENT_ROUTES.INDEX)
      onSubmit()
    } else if (state.success === false && state.message) {
      toast.error('エラーが発生しました', {
        description: state.message,
      })
    }
  }, [state, onSubmit, router])

  const handleFormSubmit = () => formAction({
    basicInfo: formData.basicInfo,
    program: formData.program,
    ticket: formData.ticket,
    earlyBirdDiscount: formData.earlyBirdDiscount,
  })

  return (
    <form action={handleFormSubmit}>
      <WizardFormNavigation
        submitLabel={isPending ? '作成中...' : 'イベントを作成する'}
        disabled={isPending}
      />
    </form>
  )
}
```

### useActionState の戻り値

| 値 | 説明 |
| --- | --- |
| `state` | Server Action の最新の実行結果（`ServerActionState` 型）。初期値は `INITIAL_STATE` |
| `formAction` | フォームの `action` に渡す関数。呼び出すと Server Action が実行される |
| `isPending` | Server Action が実行中かどうかの boolean。送信ボタンの無効化やローディング表示に使用する |

### useEffect による結果ハンドリング

`useEffect` で `state` の変化を監視し、以下を実行する:

- **成功時**: トースト通知を表示し、一覧ページへリダイレクト（`router.replace`）。`onSubmit` コールバックで親コンポーネントに完了を通知
- **失敗時**: エラートースト通知を表示。`state.message` にサーバーから返されたエラーメッセージを表示する

### `INITIAL_STATE` の扱い

```typescript
export const INITIAL_STATE: ServerActionState = {
  success: false,
  message: '',
}
```

初期状態では `success: false` かつ `message: ''`（空文字列）である。useEffect 内で `state.message` の存在チェック（`state.success === false && state.message`）を行うことで、初期レンダリング時にエラートーストが表示されることを防いでいる。

---

## バリデーション戦略: フォーム用 vs API 用

Birdcage では **2 層バリデーション** を採用している。

### フォーム用バリデーション（UX 層）

React Hook Form と連携し、ユーザー入力のリアルタイムバリデーションを行う。

```typescript
// src/features/events/validator.ts
import * as z from 'zod'
import {
  CommunityEventServiceCreateCommunityEventBody,
} from '@/api/__generated__/endpoints/community-event-service/community-event-service.zod'

export const eventCreateFormSchema = CommunityEventServiceCreateCommunityEventBody.omit({
  community_event_end_at: true,
  community_event_start_at: true,
  tickets: true,
  programs: true,
  early_bird_coupon: true,
}).extend({
  ...eventFormCommonSchema,
  community_id: z.string({ error: ... }).min(1, { error: ... }),
}).superRefine(dateTimeRefinement)
```

### API 用バリデーション（データ整合性層）

Server Action 内で、API に送信する直前にバリデーションを行う。

```typescript
// Server Action 内
const apiValidationResult = CommunityEventServiceCreateCommunityEventBody.safeParse(payload)

if (!apiValidationResult.success) {
  console.error('API validation error:', z.prettifyError(apiValidationResult.error))
  return {
    error: { success: false, message: 'データ形式が正しくありません。入力内容をご確認ください。' },
    data: undefined,
  }
}
```

### 2 層バリデーションの比較

| 側面 | フォーム用バリデーション | API 用バリデーション |
| --- | --- | --- |
| **実行タイミング** | ユーザー入力時（リアルタイム） | Server Action 実行時（送信時） |
| **実行環境** | クライアント | サーバー |
| **スキーマの元** | Orval 生成スキーマを `.omit()` / `.extend()` でカスタマイズ | Orval 生成スキーマをそのまま使用 |
| **エラーメッセージ** | 日本語のユーザー向けメッセージ | 汎用メッセージ（詳細はサーバーログ） |
| **カスタムフィールド** | UI 固有のフィールド（日付文字列、ステップ管理等）を含む | API が期待する形式のみ |
| **目的** | UX 向上（即座のフィードバック） | データ整合性の保証（最終防衛線） |

### なぜ 2 層必要か

1. **フォーム用だけでは不十分**: フォームのバリデーションはクライアントで実行されるため、バイパス可能。また、フォームデータと API ペイロードの形式が異なる場合がある（日付の文字列 → ISO 8601 変換等）
2. **API 用だけでは不十分**: サーバーサイドバリデーションだけでは、ユーザーが入力エラーに気づくのが送信後になり、UX が悪化する
3. **Orval 生成スキーマの活用**: OpenAPI 定義から自動生成された Zod スキーマをベースとすることで、API 仕様との乖離を防ぐ。フォーム用スキーマは `.omit()` / `.extend()` で UI 要件に合わせてカスタマイズする
