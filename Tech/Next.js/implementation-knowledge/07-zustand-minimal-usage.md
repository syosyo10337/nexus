---
tags:
  - nextjs
  - zustand
  - state-management
created: 2026-02-24
updated_at: 2026-02-24
status: active
---

# Zustand 最小UIステート管理

Zustand の利用方針と、最小限の UI ステート管理パターンについて解説する。

ウィザードパターン（persist + skipHydration）については [07b-zustand-wizard-pattern.md](./07b-zustand-wizard-pattern.md) を参照。

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

Server Component はクライアントサイドの Zustand ストアに直接アクセスできない。BreadcrumbRegister が `'use client'` のブリッジとして機能し、`useEffect` でマウント時にデータを注入する。このパターンの詳細は [01-page-assembly-pattern.md](./01-page-assembly-pattern.md) を参照。

> **NOTE**: BreadcrumbRegister は Renderless Component（UI を持たず、副作用のみを担当するコンポーネント）である。Server Component から Client Component へのデータ受け渡しにおいて、このパターンは Page Assembly Pattern の一部として利用される。詳細は [01-page-assembly-pattern.md](./01-page-assembly-pattern.md) に記載されている。
