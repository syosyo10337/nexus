# ボイラープレート用コードスニペット集

新プロジェクトにコピペで持っていけるテンプレート集。各スニペットは最小限の修正で動作するよう設計されている。

> **使い方**: 必要なスニペットをコピーし、プロジェクト固有の型名・パス・ドメイン名を置換するだけで利用可能。

---

## 目次

| #   | スニペット                                                                                | 用途                                                  |
| --- | ----------------------------------------------------------------------------------------- | ----------------------------------------------------- |
| 1   | [ServerActionState + ValidateBodyResult 型](#1-serveractionstate--validatebodyresultt-型) | Server Action の戻り値型定義                          |
| 2   | [Server Action テンプレート](#2-server-action-テンプレート)                               | Server Action の実装雛形                              |
| 3   | [customServerFetch テンプレート](#3-customserverfetch-テンプレート)                       | Server Component / Server Action 用 fetch ラッパー    |
| 4   | [customClientFetch テンプレート](#4-customclientfetch-テンプレート)                       | Client Component 用 fetch ラッパー                    |
| 5   | [shouldRetry + QueryClient config](#5-shouldretry--queryclient-config-テンプレート)       | React Query のリトライ制御とデフォルト設定            |
| 6   | [useQueryControl hook](#6-usequerycontrolt-hook)                                          | URL SearchParams によるフィルタ・ページネーション管理 |
| 7   | [useFormModal hook](#7-useformodalt-hook)                                                 | 作成/編集モーダルの状態管理                           |
| 8   | [画像フィールド Discriminated Union schema](#8-画像フィールド-discriminated-union-schema) | Zod による画像入力の型安全なバリデーション            |
| 9   | [ClientErrorBoundary コンポーネント](#9-clienterrorboundary-コンポーネント)               | クライアントサイドエラーバウンダリ                    |
| 10  | [ルーティング定数パターン](#10-ルーティング定数パターン)                                  | 型安全なルート定数定義                                |
| 11  | [Middleware テンプレート](#11-middleware-テンプレートauth-check--request-id)              | 認証チェック + Request ID 付与                        |
| 12  | [Zustand persist + skipHydration](#12-zustand-persist--skiphydration-テンプレート)        | ウィザードフォーム用の永続化ストア                    |
| 13  | [Vitest 3プロジェクト構成](#13-vitest-3プロジェクト構成テンプレート)                      | client / server / storybook の3環境テスト設定         |
| 14  | [ESLint boundaries 設定](#14-eslint-boundaries-設定テンプレート)                          | レイヤー間の依存ルール強制                            |

---

## 1. ServerActionState + ValidateBodyResult\<T\> 型

Server Action の戻り値を **Discriminated Union** で定義する。`success` フィールドで型絞り込みが効くため、呼び出し側で安全に分岐できる。

### コード

```typescript
// src/shared/types/server-action.ts
export type ServerActionState =
  | { success: true }
  | { success: false; message: string };

export type ValidateBodyResult<APIRequestBody> =
  | { error: ServerActionState; data: undefined }
  | { error: undefined; data: APIRequestBody };
```

```typescript
// src/shared/constants/server-action-state.ts
import type { ServerActionState } from "../types/server-action";

export const INITIAL_STATE: ServerActionState = { success: false, message: "" };
```

### 使用方法

- `ServerActionState` は Server Action の戻り値型として使用する
- `ValidateBodyResult<T>` はバリデーション関数の戻り値として使用し、成功時には `data` が、失敗時には `error` が確定する
- `INITIAL_STATE` は `useActionState` の初期値として渡す

```typescript
const [state, formAction, isPending] = useActionState(
  createXxxAction,
  INITIAL_STATE
);

if (state.success) {
  // success: true — message プロパティは存在しない
} else {
  // success: false — state.message に安全にアクセス可能
  toast.error(state.message);
}
```

---

## 2. Server Action テンプレート

「変換 → バリデーション → API呼び出し → revalidation」の統一フローに従う Server Action の雛形。

### コード

```typescript
// src/features/{domain}/actions/{action-name}.ts
"use server";

import { revalidatePath } from "next/cache";
import type {
  ServerActionState,
  ValidateBodyResult,
} from "@/shared/types/server-action";

export async function createXxxAction(
  _prevState: ServerActionState,
  data: FormData | SomeType
): Promise<ServerActionState> {
  try {
    // 1. Transform & Validate
    const { error, data: validated } = _validateAndTransform(data);
    if (error) return error;

    // 2. API Call
    await apiClient.createXxx(validated);

    // 3. Revalidate
    revalidatePath("/xxx");

    // 4. Return success
    return { success: true };
  } catch (error) {
    console.error("Error:", error);
    return { success: false, message: "エラーが発生しました" };
  }
}

function _validateAndTransform(
  data: SomeType
): ValidateBodyResult<ApiRequestBody> {
  const payload = {
    /* transform: フォームデータを API リクエスト形式に変換 */
  };
  const result = zodSchema.safeParse(payload);
  if (!result.success) {
    return {
      error: { success: false, message: "データ形式が正しくありません" },
      data: undefined,
    };
  }
  return { error: undefined, data: result.data };
}
```

### 使用方法

1. `{domain}` と `{action-name}` をプロジェクトのドメインに合わせて変更する
2. `SomeType` / `ApiRequestBody` を実際の型に置換する
3. `_validateAndTransform` 内の変換ロジックをドメインに合わせて実装する
4. クライアント側では `useActionState` で消費する

```typescript
"use client";
import { useActionState } from "react";
import { createXxxAction } from "@/features/xxx/actions/create-xxx-action";
import { INITIAL_STATE } from "@/shared/constants/server-action-state";

const [state, formAction, isPending] = useActionState(
  createXxxAction,
  INITIAL_STATE
);
```

---

## 3. customServerFetch テンプレート

Server Component / Server Action から直接バックエンドAPIを呼ぶための fetch ラッパー。`server-only` パッケージにより、クライアントバンドルへの混入を防ぐ。

### 依存パッケージ

```bash
npm install server-only
```

### コード

```typescript
// src/api/fetchers/server.ts
import "server-only";
import { cookies, headers } from "next/headers";

export interface CustomServerFetchOptions extends RequestInit {
  skipAuth?: boolean;
}

export async function customServerFetch<T>(
  url: string,
  options: CustomServerFetchOptions
): Promise<T> {
  const headersList = await headers();
  const requestId = headersList.get("x-request-id") ?? "unknown";

  const requestUrl = url.startsWith("/")
    ? `${process.env.API_BASE_URL}${url}`
    : url;
  const requestHeaders: HeadersInit = {
    ...(!(options.body instanceof FormData) && {
      "Content-Type": "application/json",
    }),
    "x-request-id": requestId,
    ...options.headers,
  };

  if (!options.skipAuth) {
    const cookieStore = await cookies();
    const token = cookieStore.get("session-token");
    if (token) requestHeaders["cookie"] = `session=${token.value};`;
  }

  const response = await fetch(requestUrl, {
    ...options,
    headers: requestHeaders,
  });
  const data = response.headers
    .get("content-type")
    ?.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    throw createApiError(
      response.status,
      data?.message ?? "API request failed",
      data
    );
  }

  return data as T;
}
```

### 使用方法

- Orval の `customServerFetch` オプションでこの関数を指定すると、生成される `*.ts`（非 `.query.ts`）ファイルがこのfetcherを使用する
- `API_BASE_URL` 環境変数にバックエンドのベースURLを設定する
- `skipAuth: true` で認証ヘッダーを省略可能（公開APIなど）
- `createApiError` はプロジェクト固有のエラークラスファクトリに置換する

---

## 4. customClientFetch テンプレート

Client Component から Next.js の API Route（プロキシ）経由でバックエンドを呼ぶための fetch ラッパー。

### コード

```typescript
// src/api/fetchers/client.ts
"use client";

export interface CustomClientFetchOptions extends RequestInit {
  skipAuth?: boolean;
}

export async function customClientFetch<T>(
  url: string,
  options: CustomClientFetchOptions = {}
): Promise<T> {
  const proxyBase = options.skipAuth ? "/api/proxy-public" : "/api/proxy";
  const requestUrl = url.startsWith("/")
    ? `${window.location.origin}${url}`
    : url;
  const requestHeaders: HeadersInit = {
    ...(!(options.body instanceof FormData) && {
      "Content-Type": "application/json",
    }),
    ...options.headers,
  };

  const response = await fetch(requestUrl, {
    ...options,
    headers: requestHeaders,
    credentials: "same-origin",
  });

  const data = response.headers
    .get("content-type")
    ?.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    throw createApiError(
      response.status,
      data?.message ?? "API request failed",
      data
    );
  }

  return data as T;
}
```

### 使用方法

- Orval の `customClientFetch` オプションでこの関数を指定すると、生成される `*.query.ts` ファイルがこのfetcherを使用する
- クライアントからのリクエストは `/api/proxy` または `/api/proxy-public` を経由するため、CORS問題を回避できる
- `credentials: 'same-origin'` により、同一オリジンのCookieが自動送信される
- `createApiError` はプロジェクト固有のエラークラスファクトリに置換する

---

## 5. shouldRetry + QueryClient config テンプレート

React Query のデフォルトオプションとリトライ制御を一元管理する設定。

### 依存パッケージ

```bash
npm install @tanstack/react-query
```

### コード

```typescript
// src/shared/components/utility/query-client-provider/config.ts
import { QueryClient, type QueryClientConfig } from "@tanstack/react-query";

export function createQueryClient(): QueryClient {
  return new QueryClient(queryClientConfig);
}

export const queryClientConfig: QueryClientConfig = {
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 10,
      retry: shouldRetry,
      retryDelay: (failureCount: number) =>
        Math.min(1000 * 2 ** failureCount, 30_000),
      refetchOnWindowFocus: false,
    },
    mutations: { retry: false },
  },
};

function shouldRetry(failureCount: number, error: unknown): boolean {
  // AbortError（ユーザーによるキャンセル）はリトライしない
  if (error instanceof DOMException && error.name === "AbortError")
    return false;
  // リトライ不要なエラークラスをここに追加する
  // if (error instanceof BadRequestError || error instanceof UnauthorizedError) return false
  return failureCount < 3;
}
```

### 使用方法

- `createQueryClient()` をアプリケーションのルートで呼び出し、`QueryClientProvider` に渡す
- `staleTime: 5分` — データ取得後5分間は再フェッチしない
- `gcTime: 10分` — 未使用のキャッシュは10分後に破棄
- `shouldRetry` にプロジェクト固有の非リトライエラークラス（400系など）を追加する
- mutation はデフォルトでリトライしない（副作用の重複実行を防止）

---

## 6. useQueryControl\<T\> hook

URL の SearchParams を利用して、フィルタ条件やページネーションを管理する汎用フック。フィルタ変更時に自動でページ番号をリセットする。

### コード

```typescript
// src/shared/hooks/use-query-control.ts
"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, useTransition, useMemo } from "react";

interface QueryControlConfig<
  TParams extends Record<string, string | undefined>,
> {
  paramKeys: Record<string, keyof TParams>;
  resetTriggerKeys: readonly (keyof TParams)[];
  pageKey?: keyof TParams;
}

interface QueryControlResult<
  TParams extends Record<string, string | undefined>,
> {
  currentValues: TParams;
  isPending: boolean;
  updateParam: (key: keyof TParams, value: string | undefined) => void;
  updateParams: (updates: Partial<TParams>) => void;
  updatePage: (page: number) => void;
}

export function useQueryControl<
  TParams extends Record<string, string | undefined>,
>({
  paramKeys,
  resetTriggerKeys,
  pageKey = "page" as keyof TParams,
}: QueryControlConfig<TParams>): QueryControlResult<TParams> {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const navigate = useCallback(
    (params: URLSearchParams) => {
      startTransition(() => {
        router.push(`${pathname}?${params.toString()}`);
      });
    },
    [pathname, router]
  );

  const updateSearchParams = useCallback(
    (updates: Partial<TParams>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (value === undefined || value === "") params.delete(key);
        else params.set(key, value as string);
      });
      // フィルタ変更時はページ番号をリセット
      const isFilterChange = Object.keys(updates).some((k) =>
        resetTriggerKeys.includes(k as keyof TParams)
      );
      if (isFilterChange) params.delete(pageKey as string);
      navigate(params);
    },
    [searchParams, navigate, resetTriggerKeys, pageKey]
  );

  const updateParam = useCallback(
    (key: keyof TParams, value: string | undefined) => {
      updateSearchParams({ [key]: value } as Partial<TParams>);
    },
    [updateSearchParams]
  );

  const updateParams = useCallback(
    (updates: Partial<TParams>) => {
      updateSearchParams(updates);
    },
    [updateSearchParams]
  );

  const updatePage = useCallback(
    (page: number) => {
      updateSearchParams({ [pageKey]: page.toString() } as Partial<TParams>);
    },
    [updateSearchParams, pageKey]
  );

  const currentValues = useMemo(() => {
    const values = {} as TParams;
    Object.values(paramKeys).forEach((paramKey) => {
      (values as any)[paramKey] =
        searchParams.get(paramKey as string) ?? undefined;
    });
    return values;
  }, [searchParams, paramKeys]);

  return { currentValues, isPending, updateParam, updateParams, updatePage };
}
```

### 使用方法

一覧ページのフィルタ・ページネーションに使用する。

```typescript
type EventListParams = {
  status?: string;
  keyword?: string;
  page?: string;
};

const { currentValues, isPending, updateParam, updatePage } =
  useQueryControl<EventListParams>({
    paramKeys: {
      status: "status",
      keyword: "keyword",
      page: "page",
    },
    resetTriggerKeys: ["status", "keyword"], // これらが変更されたらページをリセット
  });

// フィルタ変更（ページ番号は自動リセット）
updateParam("status", "published");

// ページ変更
updatePage(3);
```

---

## 7. useFormModal\<T\> hook

作成モードと編集モードを切り替え可能なモーダルの状態管理フック。

### コード

```typescript
// src/shared/hooks/use-form-modal.ts
"use client";

import { useState } from "react";

type FormModalMode = "create" | "edit";

export interface FormModalControls<T> {
  isOpen: boolean;
  mode: FormModalMode;
  initialData: T | undefined;
  openCreateModal: () => void;
  openEditModal: (data: T) => void;
  closeModal: () => void;
}

export function useFormModal<T>(): FormModalControls<T> {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<FormModalMode>("create");
  const [initialData, setInitialData] = useState<T | undefined>();

  return {
    isOpen,
    mode,
    initialData,
    openCreateModal: () => {
      setMode("create");
      setInitialData(undefined);
      setIsOpen(true);
    },
    openEditModal: (data: T) => {
      setMode("edit");
      setInitialData(data);
      setIsOpen(true);
    },
    closeModal: () => {
      setIsOpen(false);
      setInitialData(undefined);
    },
  };
}
```

### 使用方法

```typescript
const modal = useFormModal<EventTicket>()

// 新規作成モーダルを開く
<Button onClick={modal.openCreateModal}>新規作成</Button>

// 編集モーダルを開く（既存データを渡す）
<Button onClick={() => modal.openEditModal(ticket)}>編集</Button>

// モーダルコンポーネントに渡す
<FormModal
  isOpen={modal.isOpen}
  mode={modal.mode}
  initialData={modal.initialData}
  onClose={modal.closeModal}
/>
```

---

## 8. 画像フィールド Discriminated Union schema

画像入力の3状態（既存画像 / 新規アップロード / 未設定）を Discriminated Union で表現する Zod スキーマ。

### 依存パッケージ

```bash
npm install zod@^3.24  # Zod v4
```

### コード

```typescript
// src/shared/validators/image-field.ts
import { z } from "zod";

export const IMAGE_FIELD_TYPES = {
  EXISTING: "existing",
  NEW: "new",
  EMPTY: "empty",
} as const;

export const requiredImageFieldSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal(IMAGE_FIELD_TYPES.EXISTING),
    url: z.url(),
  }),
  z.object({
    type: z.literal(IMAGE_FIELD_TYPES.NEW),
    file: z
      .file()
      .mime(["image/jpeg", "image/png"], { error: "JPEG、PNGのみ対応" })
      .max(5 * 1024 * 1024, { error: "5MB以下にしてください" }),
  }),
  z.object({
    type: z.literal(IMAGE_FIELD_TYPES.EMPTY),
  }),
]);

export type ImageFieldValue = z.infer<typeof requiredImageFieldSchema>;
```

### 使用方法

フォームで画像の状態を管理する際に使用する。

```typescript
// 既存画像がある場合
const existingImage: ImageFieldValue = {
  type: "existing",
  url: "https://example.com/image.jpg",
};

// 新規アップロード
const newImage: ImageFieldValue = {
  type: "new",
  file: selectedFile, // File オブジェクト
};

// 画像未設定
const emptyImage: ImageFieldValue = { type: "empty" };

// Server Action 内での変換例
function transformImageField(
  image: ImageFieldValue
): string | File | undefined {
  switch (image.type) {
    case "existing":
      return undefined; // 変更なし — API に送信しない
    case "new":
      return image.file; // FormData に追加
    case "empty":
      return ""; // 削除を示す空文字
  }
}
```

---

## 9. ClientErrorBoundary コンポーネント

`react-error-boundary` をラップした汎用エラーバウンダリ。デフォルトのフォールバックUIを提供しつつ、カスタムフォールバックも受け付ける。

### 依存パッケージ

```bash
npm install react-error-boundary
```

### コード

```typescript
// src/shared/components/utility/client-error-boundary.tsx
'use client'

import type { ReactNode } from 'react'
import { ErrorBoundary, type FallbackProps } from 'react-error-boundary'

interface ClientErrorBoundaryProps {
  children: ReactNode
  fallback?: React.ComponentType<FallbackProps>
  onReset?: () => void
}

export function ClientErrorBoundary({
  children,
  fallback,
  onReset,
}: ClientErrorBoundaryProps) {
  const FallbackComponent = fallback ?? DefaultFallback
  return (
    <ErrorBoundary
      FallbackComponent={FallbackComponent}
      {...(onReset && { onReset })}
    >
      {children}
    </ErrorBoundary>
  )
}

function DefaultFallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <div className="rounded-md bg-red-50 p-4">
      <h3 className="text-sm font-medium text-red-800">
        エラーが発生しました
      </h3>
      <p className="mt-2 text-sm text-red-700">{error.message}</p>
      <button
        onClick={resetErrorBoundary}
        className="mt-4 rounded bg-red-100 px-2 py-1 text-sm text-red-800 hover:bg-red-200"
      >
        再試行
      </button>
    </div>
  )
}
```

### 使用方法

ページ組み立てパターンの `ClientErrorBoundary > Suspense > Container` 構成で使用する。

```tsx
// app/events/page.tsx
import { Suspense } from "react";
import { ClientErrorBoundary } from "@/shared/components/utility/client-error-boundary";
import { EventListContainer } from "./_components/event-list-container";

export default function EventsPage() {
  return (
    <ClientErrorBoundary>
      <Suspense fallback={<EventListSkeleton />}>
        <EventListContainer />
      </Suspense>
    </ClientErrorBoundary>
  );
}
```

---

## 10. ルーティング定数パターン

ルートパスを定数として一元管理する。動的セグメントは関数として定義し、型安全に引数を受け取る。

### コード

```typescript
// src/shared/constants/routes.ts
const eventBase = "/events";

const EVENT_ROUTES = {
  INDEX: eventBase,
  SHOW: (id: string) => `${eventBase}/${id}`,
  EDIT: (id: string) => `${eventBase}/${id}/edit`,
  NEW: {
    STEP1: `${eventBase}/new/step1`,
    STEP2: `${eventBase}/new/step2`,
    CONFIRMATION: `${eventBase}/new/confirmation`,
  },
} as const;

const ROUTES = {
  ROOT: "/",
  EVENTS: EVENT_ROUTES,
  LOGIN: "/login",
} as const;

export { EVENT_ROUTES, ROUTES };
```

### 使用方法

```typescript
import { ROUTES } from '@/shared/constants/routes'

// 静的パス
<Link href={ROUTES.EVENTS.INDEX}>イベント一覧</Link>

// 動的パス
<Link href={ROUTES.EVENTS.SHOW(event.id)}>詳細</Link>

// revalidation
revalidatePath(ROUTES.EVENTS.INDEX)

// ウィザードのステップ遷移
router.push(ROUTES.EVENTS.NEW.STEP2)
```

**拡張時のルール**: 新しいドメインを追加する場合は `xxxBase` 変数 + `XXX_ROUTES` オブジェクトのパターンに従う。

---

## 11. Middleware テンプレート（auth check + request ID）

認証チェックとリクエストID伝播を行う Next.js Middleware。NextAuth.js 5 の `auth` ラッパーを使用する。

### 依存パッケージ

```bash
npm install next-auth@beta
```

### コード

```typescript
// src/middleware.ts
import { NextResponse } from "next/server";
import { auth as middleware } from "@/auth";

const authExemptPaths = ["/login", "/api/auth", "/api/public"];

export default middleware((req) => {
  const requestId = req.headers.get("x-request-id") ?? crypto.randomUUID();
  let response = NextResponse.next();

  if (
    !req.auth &&
    !authExemptPaths.some((p) => req.nextUrl.pathname.startsWith(p))
  ) {
    response = NextResponse.redirect(new URL("/login", req.nextUrl.origin));
  }

  response.headers.set("x-request-id", requestId);
  return response;
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|public).*)"],
};
```

### 使用方法

- `authExemptPaths` に認証不要なパスを追加する
- `x-request-id` はリクエスト全体を通じて伝播され、`customServerFetch` でバックエンドAPIにも転送される
- `matcher` で静的アセットを除外し、パフォーマンスへの影響を最小限にする
- `auth` は NextAuth.js 5 の設定ファイルからエクスポートされたミドルウェアラッパー

---

## 12. Zustand persist + skipHydration テンプレート

ウィザード形式のフォームで、ページ遷移間のデータを localStorage に永続化するストア。`skipHydration: true` により SSR/SSG 時のハイドレーション不整合を防ぐ。

### 依存パッケージ

```bash
npm install zustand
```

### コード

```typescript
// src/features/{domain}/stores/wizard-form-store.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface WizardFormState<T> {
  formData: Partial<T>;
  hasHydrated: boolean;
  updateFormData: <K extends keyof T>(key: K, data: T[K] | undefined) => void;
  resetFormData: () => void;
  hydrate: () => Promise<void>;
}

export const useWizardFormStore = create<WizardFormState<YourFormType>>()(
  persist(
    (set, get) => ({
      formData: {},
      hasHydrated: false,
      updateFormData: (key, data) =>
        set((state) => ({
          formData: { ...state.formData, [key]: data },
        })),
      resetFormData: () => set({ formData: {} }),
      hydrate: async () => {
        if (get().hasHydrated) return;
        await useWizardFormStore.persist.rehydrate();
        set({ hasHydrated: true });
      },
    }),
    {
      name: "wizard-form-store",
      partialize: (state) => ({ formData: state.formData }),
      skipHydration: true,
    }
  )
);
```

### 使用方法

1. `YourFormType` を実際のフォームデータ型に置換する
2. 各ウィザードステップのページで `hydrate()` を呼び出してから `formData` を使用する
3. フォーム送信完了後に `resetFormData()` でストアをクリアする

```typescript
'use client'

import { useEffect } from 'react'
import { useWizardFormStore } from '@/features/events/stores/wizard-form-store'

export function WizardStep2() {
  const { formData, hasHydrated, hydrate, updateFormData } =
    useWizardFormStore()

  useEffect(() => {
    hydrate()
  }, [hydrate])

  if (!hasHydrated) return <Skeleton />

  // formData.step1 にステップ1のデータが入っている
  return <Form defaultValues={formData.step2} />
}
```

---

## 13. Vitest 3プロジェクト構成テンプレート

client（jsdom）/ server（node）/ storybook（browser）の3環境でテストを実行する Vitest 設定。

### 依存パッケージ

```bash
npm install -D vitest @vitejs/plugin-react vite-tsconfig-paths
npm install -D @storybook/addon-vitest @vitest/browser-playwright
```

### コード

```typescript
// vitest.config.ts
import path from "path";
import { fileURLToPath } from "url";
import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";
import react from "@vitejs/plugin-react";
import { playwright } from "@vitest/browser-playwright";
import tsconfigPaths from "vite-tsconfig-paths";
import { configDefaults, defineConfig } from "vitest/config";

const dirname =
  typeof __dirname !== "undefined"
    ? __dirname
    : path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    env: { ENV: "test", NODE_ENV: "test" },
    projects: [
      {
        extends: true,
        test: {
          name: { label: "client", color: "green" },
          environment: "jsdom",
          include: ["**/use-*.test.ts", "**/*.client.test.ts"],
          exclude: [
            ...configDefaults.exclude,
            "**/*.server.test.tsx",
            "**/*.stories.tsx",
          ],
          setupFiles: ["./src/test/vitest.setup.ts"],
        },
      },
      {
        extends: true,
        test: {
          name: { label: "server", color: "blue" },
          environment: "node",
          include: ["**/*.server.test.{ts,tsx}", "**/*.test.ts"],
          exclude: [
            ...configDefaults.exclude,
            "**/use-*.test.ts",
            "**/*.stories.tsx",
          ],
          setupFiles: ["./src/test/vitest.setup.ts"],
        },
      },
      {
        plugins: [
          storybookTest({
            configDir: path.join(dirname, ".storybook"),
          }),
        ],
        extends: true,
        test: {
          name: { label: "storybook", color: "magenta" },
          isolate: false,
          browser: {
            enabled: true,
            headless: true,
            provider: playwright(),
            instances: [{ browser: "chromium" }],
          },
          setupFiles: [".storybook/vitest.setup.ts"],
        },
      },
    ],
  },
});
```

### 使用方法

- **client プロジェクト**: `use-*.test.ts` / `*.client.test.ts` — jsdom 環境でフックやクライアントロジックをテスト
- **server プロジェクト**: `*.server.test.{ts,tsx}` / `*.test.ts` — node 環境で Server Component や Server Action をテスト
- **storybook プロジェクト**: `*.stories.tsx` — Playwright ブラウザで Storybook の play 関数を実行

```bash
# 全テスト実行
npm run test

# クライアントテストのみ
npm run test:client   # vitest --project client

# サーバーテストのみ
npm run test:server   # vitest --project server

# 特定ファイル
npm run test -- src/features/events/actions/create-event-action.server.test.ts
```

---

## 14. ESLint boundaries 設定テンプレート

`eslint-plugin-boundaries` を使用して、レイヤー間の依存ルールをリント時に強制する設定。

### 依存パッケージ

```bash
npm install -D eslint-plugin-boundaries
```

### コード

```javascript
// eslint-config/import-boundary.mjs
import boundaries from "eslint-plugin-boundaries";

export const importBoundaryConfig = [
  {
    plugins: { boundaries },
    files: ["src/**/*.{js,jsx,ts,tsx}"],
    settings: {
      "boundaries/elements": [
        {
          type: "app",
          pattern: "src/app/**/*",
          mode: "file",
        },
        {
          type: "feature",
          pattern: "src/features/(*)/**/*",
          capture: ["featureName"],
          mode: "file",
        },
        {
          type: "shared",
          pattern: "src/shared/**/*",
          mode: "file",
        },
        {
          type: "api",
          pattern: "src/api/**/*",
          mode: "file",
        },
      ],
    },
    rules: {
      "boundaries/element-types": [
        "error",
        {
          default: "disallow",
          rules: [
            {
              from: ["app"],
              allow: ["app", "feature", "shared", "api"],
            },
            {
              from: ["feature"],
              allow: [
                ["feature", { featureName: "${from.featureName}" }],
                "shared",
                "api",
              ],
            },
            {
              from: ["shared"],
              allow: ["shared", "api"],
            },
            {
              from: ["api"],
              allow: ["api", "shared"],
            },
          ],
        },
      ],
    },
  },
];
```

### 使用方法

1. 上記ファイルをプロジェクトの ESLint 設定ディレクトリに配置する
2. ルートの `eslint.config.mjs` でインポートしてスプレッドする

```javascript
// eslint.config.mjs
import { importBoundaryConfig } from "./eslint-config/import-boundary.mjs";

export default [
  // ... 他の設定
  ...importBoundaryConfig,
];
```

**依存ルールの要約**:

| レイヤー  | インポート可能な対象               |
| --------- | ---------------------------------- |
| `app`     | `app`, `feature`, `shared`, `api`  |
| `feature` | 同一 feature のみ, `shared`, `api` |
| `shared`  | `shared`, `api`                    |
| `api`     | `api`, `shared`                    |

feature 間のクロスインポートは禁止されており、feature 間で共有したいロジックは `shared` に昇格させる必要がある。
