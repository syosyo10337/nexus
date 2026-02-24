# Zustandの最小主義 + ウィザードパターン

Zustand の利用方針と、イベント作成ウィザードにおける永続化パターンについて解説する。

---

## 設計方針

Birdcage では、Zustand は **最小限の UI ステート** にのみ使用する。

| ステートの種類        | 管理手段                      | 例                                         |
| --------------------- | ----------------------------- | ------------------------------------------ |
| サーバーステート      | React Query（TanStack Query） | API から取得したイベント一覧、チケット情報 |
| フォームステート      | React Hook Form + Zod         | 入力値、バリデーションエラー               |
| UI ステート（最小限） | Zustand                       | パンくずリスト、ウィザードフォームの永続化 |

Zustand の出番は、React Query でも React Hook Form でも管理できない **アプリケーション横断的な UI ステート** に限定される。具体的には以下のようなケースである:

- **パンくずリスト**: Server Component のページから注入され、ヘッダーのレイアウトコンポーネントで表示される
- **ウィザードフォームの永続化**: 複数ステップのフォームデータをブラウザリロード後も復元する
- **モーダルの開閉状態**: 複数コンポーネントから制御される UI の状態

この方針により、「どのステートがどこで管理されているか」が明確になり、デバッグやテストが容易になる。

## 最小UIストア: breadcrumb-store

最もシンプルな Zustand ストアの例として、パンくずリストの管理を示す。

```typescript
// src/shared/stores/breadcrumb-store.ts
"use client";

import { create } from "zustand";

import type { BreadcrumbItemType } from "@/shared/components/layout/app-breadcrumb";

interface BreadcrumbState {
  items: BreadcrumbItemType[];
  setItems: (items: BreadcrumbItemType[]) => void;
  clear: () => void;
}

export const useBreadcrumbStore = create<BreadcrumbState>((set) => ({
  items: [],
  setItems: (next) => {
    if (next.length > 4) {
      console.warn(
        "[Breadcrumb] supports up to 4 levels. Extra levels are ignored."
      );
      set({ items: next.slice(0, 4) });
    } else {
      set({ items: next });
    }
  },
  clear: () => set({ items: [] }),
}));
```

### ポイント

- **シンプルな `create` のみ**: middleware（`persist`, `devtools` 等）は不要。ストアが小さいので複雑化させない
- **バリデーションロジック内蔵**: `setItems` 内で 4 レベル上限のバリデーションを行う。ストアの利用側にバリデーション責務を押し付けない
- **`'use client'` ディレクティブ**: Zustand は React のフック（`useSyncExternalStore`）に依存するため、クライアントコンポーネントでのみ使用可能

### データフロー: BreadcrumbRegister パターン

パンくずリストのデータは、Server Component のページから Renderless Component 経由で Zustand ストアに注入される。

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

ストアを読み取る側は、ヘッダーの `BreadcrumbBar` コンポーネントである:

```typescript
// src/shared/components/layout/breadcrumb-bar.tsx
'use client'

import { Separator } from '@/shared/components/ui/separator'
import { SidebarTrigger } from '@/shared/components/ui/sidebar'
import { useBreadcrumbStore } from '@/shared/stores/breadcrumb-store'

import { AppBreadcrumb } from './app-breadcrumb'

export function BreadcrumbBar() {
  const items = useBreadcrumbStore(s => s.items)
  return (
    <div className="flex items-center gap-4 px-4 h-12 border-b">
      <SidebarTrigger />
      <Separator
        orientation="vertical"
        className="data-[orientation=vertical]:h-4"
      />
      <AppBreadcrumb items={items} />
    </div>
  )
}
```

```text
データフロー:
Page (RSC) → BreadcrumbRegister (useEffect) → useBreadcrumbStore → BreadcrumbBar (UI)
```

Server Component はクライアントサイドの Zustand ストアに直接アクセスできない。BreadcrumbRegister が `'use client'` のブリッジとして機能し、`useEffect` でマウント時にデータを注入する。このパターンの詳細は `01-page-assembly-pattern.md` を参照。

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

  // Actions
  /**
   * フォームデータを更新する
   * @param key - 更新するフォームデータのキー
   * @param data - 更新するデータ
   */
  updateFormData: <K extends keyof EventWizardFormValues>(
    key: K,
    data: EventWizardFormValues[K] | undefined
  ) => void;

  /**
   * フォームデータをリセットする
   */
  resetFormData: () => void;

  /**
   * 手動でhydrationを実行
   */
  hydrate: () => Promise<void>;
}

const initialFormData: Partial<EventWizardFormValues> = {};
const EVENT_WIZARD_PERSIST_KEY = "event-wizard-form-store";

/**
 * イベント作成ウィザードのフォーム状態管理ストア
 * @description イベント作成の複数ステップフォームのデータを管理する
 *
 * NOTE: SSRだと、localStorageを読み込めないため、手動でhydrationを実行する。
 *
 * NOTE: ステップを遷移する度に状態を保持しており、フォームのonChangeごとに全てを保持する管理はしていない。
 */
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
      partialize: (state) => ({
        formData: state.formData,
      }),
      skipHydration: true, // 自動hydrationを無効化
      storage: {
        getItem: async (name) => {
          const str = localStorage.getItem(name);
          if (!str) return null;

          const { state } = JSON.parse(str);
          const converted = await convertBase64ToFiles(state);
          return { state: converted };
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

### 核心コンセプトの解説

#### 1. skipHydration: true -- SSR との共存

```typescript
skipHydration: true, // 自動hydrationを無効化
```

Zustand の `persist` middleware は、デフォルトでストア作成時に localStorage からデータを自動復元する。しかし Next.js の SSR 環境ではサーバー側で `localStorage` にアクセスできないため、エラーが発生する。

`skipHydration: true` により自動復元を無効化し、代わりにクライアントサイドで手動 `hydrate()` を呼び出す:

```typescript
hydrate: async () => {
  if (get().hasHydrated) return          // 重複hydration防止
  await useEventFormStore.persist.rehydrate()  // localStorageから復元
  set({ hasHydrated: true })             // フラグを更新
},
```

各ウィザードステップのページコンポーネントでは、`useEffect` 内で `hydrate()` を呼び出す:

```typescript
// src/app/(authenticated)/events/new/(wizard)/basic-info/_components/page-content.tsx
export function BasicInfoPageContent({ communities }: BasicInfoPageContentProps) {
  const { formData, updateFormData, hydrate, hasHydrated } = useEventFormStore()

  useEffect(() => {
    void hydrate()
  }, [hydrate])

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

`hasHydrated` が `false` の間はスケルトン UI を表示し、hydration 完了後にフォームをレンダリングする。これにより、サーバーサイドレンダリングとクライアントサイドの localStorage 復元のタイミング差による UI のちらつき（hydration mismatch）を防ぐ。

#### 2. カスタム storage -- File オブジェクトの永続化

```typescript
storage: {
  getItem: async (name) => {
    const str = localStorage.getItem(name)
    if (!str) return null

    const { state } = JSON.parse(str)
    const converted = await convertBase64ToFiles(state)
    return { state: converted }
  },
  setItem: async (name, value) => {
    const converted = await convertFilesToBase64(value.state)
    localStorage.setItem(name, JSON.stringify({ state: converted }))
  },
  removeItem: name => localStorage.removeItem(name),
},
```

イベント作成フォームには画像アップロードフィールドがある。`File` オブジェクトは `JSON.stringify()` でシリアライズできないため、保存時に Base64 文字列に変換し、復元時に File オブジェクトに戻す。

処理の流れ:

```text
保存時: FormData → convertFilesToBase64 → JSON.stringify → localStorage
復元時: localStorage → JSON.parse → convertBase64ToFiles → FormData
```

#### 3. partialize -- 永続化する部分の限定

```typescript
partialize: state => ({
  formData: state.formData,
}),
```

ストアの全状態ではなく、`formData` のみを localStorage に保存する。`hasHydrated` フラグや関数は永続化の対象外である。これにより、localStorage に保存されるデータ量を最小限に抑え、復元時の不整合を防ぐ。

---

## File⇔Base64変換ユーティリティ

カスタム storage で使用している変換ユーティリティの実装を示す。

```typescript
// src/shared/utils/adapters/base64.ts

// 変換後の型定義
interface SerializedFile {
  _isFile: true;
  base64: string;
  name: string;
  type: string;
  lastModified?: number;
}

const isFile = (value: unknown): value is File => {
  return value instanceof File;
};

const isSerializedFile = (value: unknown): value is SerializedFile => {
  return (
    typeof value === "object" &&
    value !== null &&
    "_isFile" in value &&
    value._isFile === true
  );
};

/**
 * FileをBase64に変換するヘルパー関数
 */
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!isFile(file)) {
      reject(new Error("Invalid file object"));
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === "string") {
        resolve(result);
      } else {
        reject(new Error("Failed to convert file to base64"));
      }
    };
    reader.onerror = () => reject(reader.error);
  });
};

/**
 * Base64からFileに変換するヘルパー関数
 */
const base64ToFile = async (
  base64: string,
  filename: string,
  type?: string,
  lastModified?: number
): Promise<File> => {
  try {
    if (!base64.startsWith("data:")) {
      throw new Error("Invalid base64 string");
    }

    const res = await fetch(base64);
    if (!res.ok) {
      throw new Error("Failed to fetch base64 data");
    }

    const blob = await res.blob();
    return new File([blob], filename, {
      type: type ?? blob.type ?? "application/octet-stream",
      lastModified: lastModified ?? Date.now(),
    });
  } catch (error) {
    throw new Error(`Failed to convert base64 to file: ${error}`);
  }
};

async function convertFilesToBase64<T>(data: T): Promise<Serializable<T>> {
  if (isFile(data)) {
    const base64 = await fileToBase64(data);
    return {
      _isFile: true,
      base64,
      name: data.name,
      type: data.type,
      lastModified: data.lastModified,
    } as Serializable<T>;
  }

  if (Array.isArray(data)) {
    const results = await Promise.all(
      data.map((item) => convertFilesToBase64(item))
    );
    return results as Serializable<T>;
  }

  if (data && typeof data === "object") {
    const converted: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(data)) {
      converted[key] = await convertFilesToBase64(value);
    }
    return converted as Serializable<T>;
  }

  return data as Serializable<T>;
}

// 逆変換も同様の再帰構造
async function convertBase64ToFiles<T>(data: T): Promise<Deserializable<T>> {
  if (isSerializedFile(data)) {
    return (await base64ToFile(
      data.base64,
      data.name,
      data.type,
      data.lastModified
    )) as Deserializable<T>;
  }

  if (Array.isArray(data)) {
    const results = await Promise.all(
      data.map((item) => convertBase64ToFiles(item))
    );
    return results as Deserializable<T>;
  }

  if (data && typeof data === "object" && data !== null) {
    const converted: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(data)) {
      converted[key] = await convertBase64ToFiles(value);
    }
    return converted as Deserializable<T>;
  }

  return data as Deserializable<T>;
}
```

### 仕組み

再帰的にオブジェクトを走査し、`File` インスタンスを `SerializedFile`（Base64 文字列 + メタデータ）に変換する。逆変換では `_isFile: true` マーカーを手がかりに `SerializedFile` を検出し、`File` オブジェクトに復元する。

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
├── layout.tsx                 # ウィザード共通レイアウト（BreadcrumbRegister + Stepper）
├── _components/
│   ├── event-wizard-stepper.tsx  # ステッパーUI（共通）
│   └── skelton.tsx               # ローディング用スケルトン
├── _hooks/
│   └── use-event-wizard-step.ts  # ウィザードナビゲーションフック
├── _validators/
│   └── event-wizard.ts           # ウィザード全体のバリデーションスキーマ
└── (wizard)/                     # Route Group（URLに影響しない）
    ├── basic-info/
    │   └── page.tsx              # Step 1: 基本情報
    ├── programs/
    │   └── page.tsx              # Step 2: プログラム
    ├── tickets/
    │   └── page.tsx              # Step 3: チケット
    ├── discount/
    │   └── page.tsx              # Step 4: 割引設定
    └── confirmation/
        └── page.tsx              # Step 5: 確認・送信
```

### ウィザード共通レイアウト

```typescript
// src/app/(authenticated)/events/new/layout.tsx
import { BreadcrumbRegister } from '@/shared/components/layout/breadcrumb-register'
import { EVENT_ROUTES } from '@/shared/constants/routes'

import { EventWizardStepper } from './_components/event-wizard-stepper'

interface WizardLayoutProps {
  children: React.ReactNode
}

export default function WizardLayout({ children }: WizardLayoutProps) {
  const breadcrumbItems = [
    {
      href: EVENT_ROUTES.INDEX,
      label: 'コミュニティイベント',
      isCurrent: false,
    },
    {
      label: '新規作成',
      isCurrent: true,
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <BreadcrumbRegister items={breadcrumbItems} />

      <div className="max-w-4xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold tracking-tight mb-6">イベント作成</h1>
        <EventWizardStepper />
        {children}
      </div>
    </div>
  )
}
```

### ステッパーコンポーネントとステップ定義

```typescript
// src/app/(authenticated)/events/new/_components/event-wizard-stepper.tsx
'use client'

import { useEventWizardStep } from '@/app/(authenticated)/events/new/_hooks/use-event-wizard-step'
import { Stepper } from '@/shared/components/business/stepper'

export function EventWizardStepper() {
  const { currentStepIndex, navigateToStepByIndex, steps } = useEventWizardStep()

  return (
    <Stepper
      steps={steps}
      currentStep={currentStepIndex}
      onStepClick={navigateToStepByIndex}
      className="mb-8"
    />
  )
}
```

```typescript
// src/features/events/constants/event-wizard-step.ts
import { ROUTES } from "@/shared/constants/routes";

// 作成フォームのステップの定義
export const EVENT_WIZARD_STEPS = [
  { key: "basicInfo", label: "基本情報", path: ROUTES.EVENTS.NEW.BASIC_INFO },
  { key: "program", label: "プログラム", path: ROUTES.EVENTS.NEW.PROGRAMS },
  { key: "ticket", label: "チケット", path: ROUTES.EVENTS.NEW.TICKETS },
  { key: "discount", label: "割引設定", path: ROUTES.EVENTS.NEW.DISCOUNT },
  { key: "confirmation", label: "確認", path: ROUTES.EVENTS.NEW.CONFIRMATION },
] as const;

// NOTE: enumを使わずにArray<Object>で定義して、keyを抽出
export type EventCreateWizardStepKey =
  (typeof EVENT_WIZARD_STEPS)[number]["key"];
```

### ウィザード全体のバリデーションスキーマ

```typescript
// src/app/(authenticated)/events/new/_validators/event-wizard.ts
import { z } from "zod";

import { ticketCouponFormSchema } from "@/features/early-bird-discounts/validator";
import { programWizardFormSchema } from "@/features/event-programs/validator";
import { ticketWizardFormSchema } from "@/features/event-tickets/validator";
import { eventCreateFormSchema } from "@/features/events/validator";

// eventForm送信前の全体を管理するスキーマ、現状は型としてのみ使用する。
const eventWizardSchema = z.object({
  basicInfo: eventCreateFormSchema,
  program: programWizardFormSchema,
  ticket: ticketWizardFormSchema,
  earlyBirdDiscount: ticketCouponFormSchema.optional(),
});

export type EventWizardFormValues = z.infer<typeof eventWizardSchema>;
```

---

## ウィザードのデータフロー

各ステップでフォームが送信されると、データが Zustand ストアに保存され、次のステップに遷移する。

### Step 1: 基本情報

```typescript
// src/app/(authenticated)/events/new/(wizard)/basic-info/_components/page-content.tsx
'use client'

import { useEffect } from 'react'

import type { CommunityListItem } from '@/api/__generated__/models'
import { FormSkeleton } from '@/app/(authenticated)/events/new/_components/skelton'
import { useEventWizardStep } from '@/app/(authenticated)/events/new/_hooks/use-event-wizard-step'
import { useEventFormStore } from '@/features/events/stores/event-form-store'
import type { EventCreateFormValues } from '@/features/events/validator'

import { EventInfoForm } from './event-info-form'

export function BasicInfoPageContent({ communities }: BasicInfoPageContentProps) {
  const { navigateToStep } = useEventWizardStep()
  const { formData, updateFormData, hydrate, hasHydrated } = useEventFormStore()

  useEffect(() => {
    void hydrate()
  }, [hydrate])

  const handleSubmit = (data: EventCreateFormValues) => {
    updateFormData('basicInfo', data)  // ストアに保存
    navigateToStep('program')          // 次のステップへ
  }

  if (!hasHydrated) return <FormSkeleton />

  return (
    <EventInfoForm
      onSubmit={handleSubmit}
      currentValues={formData.basicInfo}   // ストアから復元した値を初期値として渡す
      communitiesOptions={communities}
    />
  )
}
```

### Step 5: 確認・送信

```typescript
// src/app/(authenticated)/events/new/(wizard)/confirmation/_components/page-content.tsx
'use client'

import { redirect } from 'next/navigation'
import { useEffect } from 'react'

import { FormSkeleton } from '@/app/(authenticated)/events/new/_components/skelton'
import { useEventWizardStep } from '@/app/(authenticated)/events/new/_hooks/use-event-wizard-step'
import type { EventWizardFormValues } from '@/app/(authenticated)/events/new/_validators/event-wizard'
import { useEventFormStore } from '@/features/events/stores/event-form-store'
import { EVENT_ROUTES } from '@/shared/constants/routes'

import { ConfirmationStep } from './event-wizard-confirmation'

export function ConfirmationPageContent() {
  const { navigateToStep } = useEventWizardStep()
  const { formData, hydrate, hasHydrated, resetFormData } = useEventFormStore()

  useEffect(() => {
    void hydrate()
  }, [hydrate])

  const handleBack = () => navigateToStep('discount')

  if (!hasHydrated) return <FormSkeleton />

  // NOTE: データが不十分なときに直接アクセスされた時の対応
  if (!formData.basicInfo
    || !formData.program
    || !formData.ticket) {
    redirect(EVENT_ROUTES.INDEX)
  }

  return (
    <ConfirmationStep
      formData={formData as EventWizardFormValues}
      onBack={handleBack}
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
