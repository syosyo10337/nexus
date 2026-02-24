---
tags:
  - nextjs
  - zustand
  - wizard-pattern
  - persist
created: 2026-02-24
updated_at: 2026-02-24
status: active
---

# Zustand ウィザードパターン: persist + skipHydration

イベント作成ウィザードにおける Zustand の永続化パターンについて解説する。

Zustand の設計方針と最小 UI ストアの例については [07-zustand-minimal-usage.md](./07-zustand-minimal-usage.md) を参照。

---

## ウィザードパターン: persist + skipHydration

イベント作成ウィザードは、5 つのステップに分かれたフォームで構成される。各ステップの遷移時にフォームデータを Zustand ストアに保存し、ブラウザリロード後も復元可能にする。

```typescript
// src/features/events/stores/event-form-store.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { EventWizardFormValues } from "@/app/(authenticated)/events/new/_validators/event-wizard";
import {
  convertBase64ToFiles,
  convertFilesToBase64,
} from "@/shared/utils/adapters/base64";

interface EventFormState {
  formData: Partial<EventWizardFormValues>;
  hasHydrated: boolean;
  updateFormData: <K extends keyof EventWizardFormValues>(
    key: K,
    data: EventWizardFormValues[K] | undefined
  ) => void;
  resetFormData: () => void;
  hydrate: () => Promise<void>;
}

const initialFormData: Partial<EventWizardFormValues> = {};
const EVENT_WIZARD_PERSIST_KEY = "event-wizard-form-store";

export const useEventFormStore = create<EventFormState>()(
  persist(
    (set, get) => ({
      formData: initialFormData,
      hasHydrated: false,

      updateFormData: (key, data) =>
        set((state) => ({ formData: { ...state.formData, [key]: data } })),
      resetFormData: () => set({ formData: initialFormData }),

      hydrate: async () => {
        if (get().hasHydrated) return;
        await useEventFormStore.persist.rehydrate();
        set({ hasHydrated: true });
      },
    }),
    {
      name: EVENT_WIZARD_PERSIST_KEY,
      partialize: (state) => ({ formData: state.formData }),
      skipHydration: true,
      storage: {
        getItem: async (name) => {
          const str = localStorage.getItem(name);
          if (!str) return null;
          const { state } = JSON.parse(str);
          return { state: await convertBase64ToFiles(state) };
        },
        setItem: async (name, value) => {
          const converted = await convertFilesToBase64(value.state);
          localStorage.setItem(name, JSON.stringify({ state: converted }));
        },
        removeItem: (name) => localStorage.removeItem(name),
      },
    }
  )
);
```

### 核心コンセプト

#### 1. skipHydration: true -- SSR との共存

Zustand の `persist` middleware は、デフォルトでストア作成時に localStorage からデータを自動復元する。しかし Next.js の SSR 環境ではサーバー側で `localStorage` にアクセスできないため、エラーが発生する。

`skipHydration: true` により自動復元を無効化し、クライアントサイドで手動 `hydrate()` を呼び出す。各ステップのページコンポーネントでは `useEffect` 内で `hydrate()` を実行し、`hasHydrated` が `false` の間はスケルトン UI を表示する。これにより hydration mismatch を防ぐ。

#### 2. カスタム storage -- File オブジェクトの永続化

イベント作成フォームには画像アップロードフィールドがある。`File` オブジェクトは `JSON.stringify()` でシリアライズできないため、保存時に Base64 文字列に変換し、復元時に File オブジェクトに戻す。

```text
保存時: FormData → convertFilesToBase64 → JSON.stringify → localStorage
復元時: localStorage → JSON.parse → convertBase64ToFiles → FormData
```

#### 3. partialize -- 永続化する部分の限定

`formData` のみを localStorage に保存する。`hasHydrated` フラグや関数は永続化の対象外とし、localStorage に保存されるデータ量を最小限に抑え、復元時の不整合を防ぐ。

---

## File⇔Base64変換ユーティリティ

カスタム storage で使用している変換ユーティリティ（`src/shared/utils/adapters/base64.ts`）の公開 API と仕組みを示す。

```typescript
interface SerializedFile {
  _isFile: true;
  base64: string;
  name: string;
  type: string;
  lastModified?: number;
}

type Serializable<T> = /* File → SerializedFile への再帰的変換型 */
type Deserializable<T> = /* SerializedFile → File への再帰的変換型 */

// 公開API
async function convertFilesToBase64<T>(data: T): Promise<Serializable<T>>;
async function convertBase64ToFiles<T>(data: T): Promise<Deserializable<T>>;
```

再帰的にオブジェクトを走査し、`File` インスタンスを `SerializedFile`（Base64 文字列 + メタデータ）に変換する。逆変換では `_isFile: true` マーカーを手がかりに `SerializedFile` を検出し、`File` オブジェクトに復元する。内部では `FileReader` による Base64 エンコードと `fetch` + `Blob` による Base64 デコードをヘルパー関数として利用している。

```ts
// 変換例:
{
  basicInfo: {
    name: "テストイベント",
    image: File { name: "event.png", type: "image/png", ... }
  }
}
// ↓ convertFilesToBase64
{
  basicInfo: {
    name: "テストイベント",
    image: { _isFile: true, base64: "data:image/png;base64,iVBOR...", name: "event.png", type: "image/png" }
  }
}
```

型レベルでも `Serializable<T>` / `Deserializable<T>` という条件型を定義し、変換前後の型安全性を保証している。

---

## ウィザードのルート構成

```text
src/app/(authenticated)/events/new/
├── layout.tsx                    # 共通レイアウト（BreadcrumbRegister + Stepper）
├── _components/
│   ├── event-wizard-stepper.tsx  # ステッパーUI
│   └── skelton.tsx               # ローディング用スケルトン
├── _hooks/
│   └── use-event-wizard-step.ts  # ナビゲーションフック
├── _validators/
│   └── event-wizard.ts           # 全体のバリデーションスキーマ
└── (wizard)/                     # Route Group（URLに影響しない）
    ├── basic-info/page.tsx       # Step 1: 基本情報
    ├── programs/page.tsx         # Step 2: プログラム
    ├── tickets/page.tsx          # Step 3: チケット
    ├── discount/page.tsx         # Step 4: 割引設定
    └── confirmation/page.tsx     # Step 5: 確認・送信
```

共通の `layout.tsx` で `BreadcrumbRegister` と `EventWizardStepper` を配置し、全ステップで共有する。ステッパーは `useEventWizardStep` フックで現在のステップを判定し、クリックによるステップ間ナビゲーションを提供する。

---

## ウィザードのデータフロー

各ステップでフォームが送信されると、データが Zustand ストアに保存され、次のステップに遷移する。

### Step 1: 基本情報

```typescript
// src/app/(authenticated)/events/new/(wizard)/basic-info/_components/page-content.tsx
export function BasicInfoPageContent({ communities }: BasicInfoPageContentProps) {
  const { navigateToStep } = useEventWizardStep()
  const { formData, updateFormData, hydrate, hasHydrated } = useEventFormStore()

  useEffect(() => { void hydrate() }, [hydrate])

  const handleSubmit = (data: EventCreateFormValues) => {
    updateFormData('basicInfo', data)  // ストアに保存
    navigateToStep('program')          // 次のステップへ
  }

  if (!hasHydrated) return <FormSkeleton />

  return (
    <EventInfoForm
      onSubmit={handleSubmit}
      currentValues={formData.basicInfo}
      communitiesOptions={communities}
    />
  )
}
```

### Step 5: 確認・送信

```typescript
// src/app/(authenticated)/events/new/(wizard)/confirmation/_components/page-content.tsx
export function ConfirmationPageContent() {
  const { navigateToStep } = useEventWizardStep()
  const { formData, hydrate, hasHydrated, resetFormData } = useEventFormStore()

  useEffect(() => { void hydrate() }, [hydrate])

  if (!hasHydrated) return <FormSkeleton />

  // データが不十分なときに直接アクセスされた場合のガード
  if (!formData.basicInfo || !formData.program || !formData.ticket) {
    redirect(EVENT_ROUTES.INDEX)
  }

  return (
    <ConfirmationStep
      formData={formData as EventWizardFormValues}
      onBack={() => navigateToStep('discount')}
      onSubmit={() => {
        resetFormData()          // ストアをクリア（localStorageも）
        redirect(EVENT_ROUTES.INDEX)
      }}
    />
  )
}
```

### データフローの全体像

```text
Step 1 (basic-info)    → updateFormData('basicInfo', data) → navigateToStep('program')
Step 2 (programs)      → updateFormData('program', data)   → navigateToStep('ticket')
Step 3 (tickets)       → updateFormData('ticket', data)    → navigateToStep('discount')
Step 4 (discount)      → updateFormData('earlyBirdDiscount', data) → navigateToStep('confirmation')
Step 5 (confirmation)  → Server Action に全データを渡して一括送信 → resetFormData()
```

### パターンのまとめ

| 要素                             | 説明                                                                                     |
| -------------------------------- | ---------------------------------------------------------------------------------------- |
| **Route Group `(wizard)/`**      | URL に影響しない。`/events/new/basic-info` のように綺麗な URL 構造を維持する             |
| **共通 layout.tsx**              | パンくずリストとステッパー UI を全ステップで共有する                                     |
| **Zustand persist**              | 各ステップのフォームデータを localStorage に保存。ブラウザリロードしても途中から再開可能 |
| **skipHydration + 手動 hydrate** | SSR 環境での localStorage アクセスエラーを防ぎ、クライアントサイドで安全に復元する       |
| **カスタム storage**             | File オブジェクトを Base64 に変換して localStorage にシリアライズ可能にする              |
| **確認ステップのガード**         | 必須データが揃っていない状態で直接アクセスされた場合、一覧ページにリダイレクトする       |
| **送信後の resetFormData**       | Server Action の成功後にストアをクリアし、localStorage の古いデータが残らないようにする  |
