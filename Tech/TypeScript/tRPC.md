---
tags:
  - trpc
  - api
  - typescript
  - nextjs
created: 2026-01-04
updated: 2026-01-08
status: active
---

## 概要

 **tRPC (TypeScript Remote Procedure Call)** は、TypeScriptの型システムを活用した**エンドツーエンドで型安全なAPI**を構築するためのフレームワークです。コード生成やスキーマ定義なしに、クライアントとサーバー間の型の整合性を保証します。

### 主な特徴

 **完全な型安全性**: TypeScriptの型推論により、クライアント・サーバー間の型の不整合を防ぐ
 **開発効率の向上**: APIスキーマの手動定義やコード生成が不要
 **優れたDX (Developer Experience)**: 自動補完、型チェック、リファクタリングが容易
 **Next.jsとの優れた統合**: App Router / Pages Router両方に対応
 **軽量**: 追加のランタイムオーバーヘッドがほぼない



## 基本概念

### Router（ルーター）

利用可能なプロシージャ（エンドポイント）とそれに対応するハンドラーを定義する中核的な要素。複数のルーターを組み合わせて、APIの構造を階層化できる。

### Procedure（プロシージャ）

単一のAPIエンドポイントを表現する。以下の2種類がある：

- **Query**: データ取得用（GETに相当）
- **Mutation**: データ変更用（POST/PUT/DELETEに相当）

### Context（コンテキスト）

すべてのプロシージャで利用可能なオブジェクト。以下のような情報を渡すために使用される：

- サービス層のインスタンス（DI）
- データベース接続
- 認証情報（ユーザー情報など）
- リクエストメタデータ

---

## 基本的なセットアップ

### 1. ルーターインスタンスの作成

tRPCの初期化は**バックエンドごとに1度だけ**行う。ヘルパー関数だけをエクスポートし、オブジェクトの再生成を避ける。

```typescript
import { initTRPC } from '@trpc/server';
 
/**
 * tRPCバックエンドの初期化
 * バックエンドごとに1度だけ実行すること！
 */
const t = initTRPC.create();
 
/**
 * 再利用可能なルーターとプロシージャヘルパーをエクスポート
 * これらはルーター全体で使用できる
 */
export const router = t.router;
export const publicProcedure = t.procedure;
```

### 2. ルーターの型シグネチャをエクスポート

クライアント側で型安全に呼び出すために、**ルーターの型のみ**をエクスポートする。

```typescript
import { router } from './trpc';
 
const appRouter = router({
  // プロシージャを定義...
});
 
// ルーター自体ではなく、型シグネチャのみをエクスポート
export type AppRouter = typeof appRouter;
```

### 3. プロシージャの追加

ルーターにプロシージャを追加して、APIのエンドポイントを定義する。

```typescript
import { z } from 'zod';
import { db } from './db';
import { publicProcedure, router } from './trpc';
 
const appRouter = router({
  // ユーザー一覧を取得（Query）
  userList: publicProcedure
    .query(async () => {
      const users = await db.user.findMany();
      // 戻り値の型: User[]
      return users;
    }),
  
  // IDでユーザーを取得（Query + Input）
  userById: publicProcedure
    .input(z.string()) // Zodでバリデーション
    .query(async (opts) => {
      const { input } = opts; // input: string
      const user = await db.user.findById(input);
      // 戻り値の型: User | undefined
      return user;
    }),
  
  // ユーザーを作成（Mutation）
  userCreate: publicProcedure
    .input(z.object({
      name: z.string(),
      email: z.string().email(),
    }))
    .mutation(async (opts) => {
      const { input } = opts;
      const user = await db.user.create(input);
      return user;
    }),
});
```

**プロシージャの構成要素:**

- **プロシージャ名**: クライアントから呼び出す際の識別子（例: `userList`, `userById`）
- **入力バリデーション**: `.input()` で入力値の型とバリデーションを定義
- **ハンドラー**: `.query()` または `.mutation()` で実際の処理を定義

---

## Dependency Injection（依存性注入）

Contextを使用してサービスやリポジトリを注入し、プロシージャ内で利用できるようにする。

```typescript
import { initTRPC } from "@trpc/server";
import { DrizzleClosedDayRepository } from "@/infrastructure/db/repositories/drizzleClosedDayRepository";
import { DrizzleEventRepository } from "@/infrastructure/db/repositories/drizzleEventRepository";
import { ClosedDayService } from "@/services/closedDayService";
import { EventService } from "@/services/eventService";

// リポジトリとサービスのインスタンスを生成
const eventRepository = new DrizzleEventRepository();
const eventService = new EventService(eventRepository);

const closedDayRepository = new DrizzleClosedDayRepository();
const closedDayService = new ClosedDayService(closedDayRepository);

// Contextの作成
export const createContext = () => {
  return { eventService, closedDayService };
};

// Contextの型を定義
export type Context = ReturnType<typeof createContext>;

// Contextを含めてtRPCを初期化
const t = initTRPC.context<Context>().create();

export const router = t.router;
export const publicProcedure = t.procedure;
```

**Contextを使用したプロシージャ例:**

```typescript
const appRouter = router({
  getEvents: publicProcedure
    .query(async ({ ctx }) => {
      // Contextからサービスを取得
      const events = await ctx.eventService.getAllEvents();
      return events;
    }),
});
```

---

## Next.jsとの統合

### App Routerでの動作フロー

Next.js App RouterにおけるtRPCの動作は以下の流れで行われます：

```
┌─────────────────────────────────────────────────────────────┐
│ 1. Client Component ('use client')                         │
│    └─ trpc.hello.useQuery() を呼び出し                      │
└─────────────────────────────────────────────────────────────┘
                           ↓ (HTTPリクエスト)
┌─────────────────────────────────────────────────────────────┐
│ 2. tRPC Client (Provider内で初期化済み)                     │
│    └─ httpBatchLink経由でHTTP POSTリクエストを送信          │
│       送信先: /api/trpc/hello                               │
└─────────────────────────────────────────────────────────────┘
                           ↓ (POST /api/trpc/hello)
┌─────────────────────────────────────────────────────────────┐
│ 3. Next.js API Route Handler                               │
│    app/api/trpc/[trpc]/route.ts                            │
│    └─ fetchRequestHandler がリクエストを受け取り            │
└─────────────────────────────────────────────────────────────┘
                           ↓ (ルーティング)
┌─────────────────────────────────────────────────────────────┐
│ 4. tRPC Router                                              │
│    server/routers/_app.ts                                   │
│    └─ appRouter.hello プロシージャを実行                    │
│       └─ ビジネスロジック・DB操作など                        │
└─────────────────────────────────────────────────────────────┘
                           ↓ (レスポンス)
┌─────────────────────────────────────────────────────────────┐
│ 5. Client Component                                         │
│    └─ 型安全なレスポンスを受け取り、UIを更新                 │
└─────────────────────────────────────────────────────────────┘
```

**重要なポイント：**

1. **Client Component内での呼び出し**: `trpc.hello.useQuery()`はProviderの子要素内でのみ使用可能
2. **HTTPリクエストの送信**: tRPCクライアントは内部的に通常のHTTP POST リクエストを送信
3. **API Routeでの受信**: Next.jsのAPI Route Handler(`/api/trpc/[trpc]`)がリクエストを受け取る
4. **適切なプロシージャへのルーティング**: tRPCルーターが該当するプロシージャを特定して実行
5. **型安全なレスポンス**: クライアント側では完全に型推論されたレスポンスを受け取る

**具体例：**

```typescript
// Client Component
'use client';

export default function UserList() {
  // ① この呼び出しがHTTPリクエストをトリガー
  const { data } = trpc.user.getAll.useQuery();
  
  // ② HTTPリクエスト: POST /api/trpc/user.getAll
  // ③ API Route Handler → tRPC Router
  // ④ appRouter.user.getAll プロシージャが実行される
  // ⑤ 型安全なレスポンスが返ってくる（data の型は自動推論）
  
  return <div>{data?.users.map(u => u.name)}</div>;
}
```

---

### 必要なパッケージのインストール

```bash
npm install @trpc/server @trpc/client @trpc/react-query @trpc/next @tanstack/react-query zod
```

### セットアップ手順

#### 1. tRPCの初期化（サーバー側）

`src/server/trpc.ts`

```typescript
import { initTRPC } from '@trpc/server';

const t = initTRPC.create();

export const router = t.router;
export const publicProcedure = t.procedure;
```

#### 2. ルーターの定義

`src/server/routers/_app.ts`

```typescript
import { router, publicProcedure } from '../trpc';
import { z } from 'zod';

export const appRouter = router({
  hello: publicProcedure
    .input(z.object({ name: z.string().optional() }))
    .query(({ input }) => {
      return {
        greeting: `Hello, ${input.name ?? 'World'}!`,
      };
    }),
  
  // 他のプロシージャ...
});

// 型のエクスポート（重要！）
export type AppRouter = typeof appRouter;
```

#### 3. Next.js APIルートの作成

 **Pages Router の場合:**

`src/pages/api/trpc/[trpc].ts`

```typescript
import { createNextApiHandler } from '@trpc/server/adapters/next';
import { appRouter } from '@/server/routers/_app';
import { createContext } from '@/server/context';

export default createNextApiHandler({
  router: appRouter,
  createContext, // Contextが必要な場合
});
```

 **App Router の場合:**

`src/app/api/trpc/[trpc]/route.ts`

```typescript
import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { appRouter } from '@/server/routers/_app';

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext: () => ({}),
  });

export { handler as GET, handler as POST };
```

#### 4. クライアントのセットアップ

`src/utils/trpc.ts`

```typescript
import { createTRPCReact } from '@trpc/react-query';
import type { AppRouter } from '@/server/routers/_app';

export const trpc = createTRPCReact<AppRouter>();
```

#### 5. Providerの設定

 **Pages Router の場合:**

`src/pages/_app.tsx`

```typescript
import { trpc } from '@/utils/trpc';
import { httpBatchLink } from '@trpc/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { AppProps } from 'next/app';
import { useState } from 'react';

function MyApp({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: '/api/trpc',
        }),
      ],
    })
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <Component {...pageProps} />
      </QueryClientProvider>
    </trpc.Provider>
  );
}

export default MyApp;
```

 **App Router の場合:**

`src/app/providers.tsx`

```typescript
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import { useState } from 'react';
import { trpc } from '@/utils/trpc';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: '/api/trpc',
        }),
      ],
    })
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </trpc.Provider>
  );
}
```

`src/app/layout.tsx`

```typescript
import { Providers } from './providers';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

#### 6. クライアント側での使用

**Client Componentでの使用:**

```typescript
'use client'; // App Routerの場合

import { trpc } from '@/utils/trpc';

export default function HomePage() {
  // Query の使用例
  const { data, isLoading, error } = trpc.hello.useQuery({ 
    name: 'tRPC' 
  });

  // Mutation の使用例
  const mutation = trpc.userCreate.useMutation({
    onSuccess: (data) => {
      console.log('User created:', data);
    },
  });

  if (isLoading) return <div>読み込み中...</div>;
  if (error) return <div>エラー: {error.message}</div>;

  return (
    <div>
      <h1>{data?.greeting}</h1>
      <button onClick={() => mutation.mutate({ 
        name: 'John', 
        email: 'john@example.com' 
      })}>
        ユーザー作成
      </button>
    </div>
  );
}
```

---

## Server Componentsでの実装

Next.js App RouterのServer Componentsでは、React Queryのフック（`useQuery`、`useMutation`）を使用できません。代わりに、tRPCルーターを**直接呼び出す**ことで、HTTPリクエストを介さずにサーバー側でデータを取得できます。

### Server Components用のヘルパー作成

`src/server/trpc-server.ts`

```typescript
import 'server-only'; // Server専用モジュールであることを明示
import { cache } from 'react';
import { createCallerFactory } from '@trpc/server';
import { appRouter } from './routers/_app';
import { createContext } from './context';

/**
 * Server Components用のtRPCヘルパー
 * React.cacheでラップすることで、同一リクエスト内での重複呼び出しを防ぐ
 */
export const createCaller = cache(async () => {
  const ctx = await createContext();
  const callerFactory = createCallerFactory()(appRouter);
  return callerFactory(ctx);
});
```

### Server Componentでの使用例

#### 基本的な使用方法

`src/app/users/page.tsx`

```typescript
import { createCaller } from '@/server/trpc-server';

export default async function UsersPage() {
  // tRPCルーターを直接呼び出し（HTTPリクエストなし）
  const trpc = await createCaller();
  const users = await trpc.user.getAll();

  return (
    <div>
      <h1>ユーザー一覧</h1>
      <ul>
        {users.map((user) => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </div>
  );
}
```

#### エラーハンドリング付きの例

`src/app/users/[id]/page.tsx`

```typescript
import { createCaller } from '@/server/trpc-server';
import { TRPCError } from '@trpc/server';
import { notFound } from 'next/navigation';

interface PageProps {
  params: { id: string };
}

export default async function UserDetailPage({ params }: PageProps) {
  const trpc = await createCaller();
  
  try {
    const user = await trpc.user.getById({ id: params.id });
    
    return (
      <div>
        <h1>{user.name}</h1>
        <p>Email: {user.email}</p>
      </div>
    );
  } catch (error) {
    // tRPCエラーのハンドリング
    if (error instanceof TRPCError && error.code === 'NOT_FOUND') {
      notFound(); // Next.jsのnot-foundページを表示
    }
    throw error; // その他のエラーはerror.tsxで処理
  }
}
```

#### 動的データ取得の例（revalidate設定）

`src/app/posts/page.tsx`

```typescript
import { createCaller } from '@/server/trpc-server';

// 30秒ごとに再検証
export const revalidate = 30;

export default async function PostsPage() {
  const trpc = await createCaller();
  const posts = await trpc.post.getAll();

  return (
    <div>
      <h1>投稿一覧</h1>
      {posts.map((post) => (
        <article key={post.id}>
          <h2>{post.title}</h2>
          <p>{post.content}</p>
        </article>
      ))}
    </div>
  );
}
```

### Server ActionsとClient Componentsの組み合わせ

Server Componentsで初期データを取得し、Client Componentsでインタラクティブな操作を行う実装パターン。

`src/app/users/page.tsx` (Server Component)

```typescript
import { createCaller } from '@/server/trpc-server';
import { UserList } from './user-list';

export default async function UsersPage() {
  // Server側で初期データを取得
  const trpc = await createCaller();
  const initialUsers = await trpc.user.getAll();

  // Client Componentに初期データを渡す
  return <UserList initialData={initialUsers} />;
}
```

`src/app/users/user-list.tsx` (Client Component)

```typescript
'use client';

import { trpc } from '@/utils/trpc';
import type { User } from '@/types';

interface UserListProps {
  initialData: User[];
}

export function UserList({ initialData }: UserListProps) {
  // initialDataを使用してSSRされたデータを表示しつつ、
  // バックグラウンドで最新データを取得
  const { data: users, refetch } = trpc.user.getAll.useQuery(undefined, {
    initialData,
    refetchOnMount: false,
  });

  const deleteMutation = trpc.user.delete.useMutation({
    onSuccess: () => {
      refetch(); // データを再取得
    },
  });

  return (
    <div>
      <h1>ユーザー一覧</h1>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.name}
            <button onClick={() => deleteMutation.mutate({ id: user.id })}>
              削除
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

### Server Componentsの利点と使い分け

**Server Componentsで直接呼び出す利点:**

1. **パフォーマンス向上**: HTTPリクエストのオーバーヘッドがない
2. **SEO最適化**: サーバー側でレンダリングされたコンテンツ
3. **初期表示の高速化**: クライアント側のJavaScriptバンドルサイズを削減
4. **セキュリティ**: 機密情報をクライアントに送信せずに処理可能

**使い分けの指針:**

| ケース | 推奨される方法 | 理由 |
|--------|--------------|------|
| 初期表示のデータ取得 | Server Components | SEO対応、初期表示の高速化 |
| ユーザーインタラクション | Client Components | リアルタイムな更新、楽観的UI |
| 認証が必要なAPI | Server Components | セッショントークンをクライアントに公開しない |
| リアルタイム更新 | Client Components | ポーリング、自動リフレッシュ |
| フォーム送信 | Server Actions or Client Components | 要件に応じて選択 |

### Context with Server Components

Server Componentsでcontextを使用する場合の実装例：

`src/server/context.ts`

```typescript
import { cookies, headers } from 'next/headers';
import { db } from '@/lib/db';
import { auth } from '@/lib/auth';

export async function createContext() {
  // Next.jsのheaders/cookiesを使用して認証情報を取得
  const session = await auth.getSession(cookies());
  
  return {
    db,
    session,
    user: session?.user ?? null,
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
```

`src/app/dashboard/page.tsx`

```typescript
import { createCaller } from '@/server/trpc-server';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const trpc = await createCaller();
  
  // Contextから認証情報を取得してプロシージャが実行される
  try {
    const userData = await trpc.user.getProfile();
    
    return (
      <div>
        <h1>ダッシュボード</h1>
        <p>ようこそ、{userData.name}さん</p>
      </div>
    );
  } catch (error) {
    // 認証エラーの場合はログインページへリダイレクト
    redirect('/login');
  }
}
```

---

## ベストプラクティス

 推奨される実装方法

1. **Zodを使用した入力バリデーション**: 型安全性とランタイムバリデーションの両立
2. **Contextを使ったDI**: テスタビリティと保守性の向上
3. **ルーターの分割**: 機能ごとにルーターを分けて管理しやすくする
4. **エラーハンドリング**: `TRPCError` を使用した適切なエラー処理

```typescript
import { TRPCError } from '@trpc/server';

const appRouter = router({
  getUserById: publicProcedure
    .input(z.string())
    .query(async ({ input, ctx }) => {
      const user = await ctx.db.user.findById(input);
      
      if (!user) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'ユーザーが見つかりません',
        });
      }
      
      return user;
    }),
});
```

### ⚠️ 注意点

- tRPCはREST APIの完全な代替ではない（同一モノレポ/同一言語環境に最適）
- 外部APIとの統合には従来のREST/GraphQLを使用
- Client ComponentsではReact Queryのフックを、Server Componentsでは直接呼び出しを使用する


### 参考リンク

- [Next.js with React Server Components](https://trpc.io/docs/client/react/server-components)
- [TanStack Query (React Query)](https://tanstack.com/query/latest)

- [公式ドキュメント](https://trpc.io/)
- [コンセプト解説](https://trpc.io/docs/concepts)
- [Qiita - tRPC解説](https://qiita.com/megmogmog1965/items/86ea05966027881afca0)
- [Zenn - tRPC入門](https://zenn.dev/big_tanukiudon/articles/2f5e6efd851686)
