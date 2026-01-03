---
tags:
  - react
  - trpc
  - api
  - typescript
created: 2026-01-04
status: active
---

# tRPC

[https://qiita.com/megmogmog1965/items/86ea05966027881afca0](https://qiita.com/megmogmog1965/items/86ea05966027881afca0)

[https://zenn.dev/big_tanukiudon/articles/2f5e6efd851686](https://zenn.dev/big_tanukiudon/articles/2f5e6efd851686)

[https://trpc.io/](https://trpc.io/)

[https://trpc.io/docs/concepts](https://trpc.io/docs/concepts)

## 1. create router instance

helperだけを取り出して、オブジェクトは何度も生成や呼び出ししないようにする。

```TypeScript
import { initTRPC } from '@trpc/server';
 
/**
 * Initialization of tRPC backend
 * Should be done only once per backend!
 */
const t = initTRPC.create();
 
/**
 * Export reusable router and procedure helpers
 * that can be used throughout the router
 */
export const router = t.router;
export const publicProcedure = t.procedure;
```

# 2. routerのtype signatureをexport

client sideで呼び出すために必要になる。

```TypeScript
import { router } from './trpc';
 
const appRouter = router({
  // ...
});
 
// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter;
```

### 3. 手続きを追加する。

```TypeScript
import { db } from './db';
import { publicProcedure, router } from './trpc';
 
const appRouter = router({
  userList: publicProcedure
    .query(async () => {
      // Retrieve users from a datasource, this is an imaginary database
      const users = await db.user.findMany();
             
const users: User[]
      return users;
    }),
  userById: publicProcedure
    .input(z.string())
    .query(async (opts) => {
      const { input } = opts;
               
const input: string
      // Retrieve the user with the given ID
      const user = await db.user.findById(input);
             
const user: User | undefined
      return user;
    }),
});
```

つまり、以下のような構成によって　

- なんという名前で呼び出すのか？

- 呼び出した先にどんな手続きを行うのか？

を決める。

```TypeScript
const appRouter = t.router({
	<routerName>: t.publicProcedure.query( <project e.g. get data from DB>)
	})
```

## (その他) DIするためにcontextを作成して、それを元にTRPCをinitする。

```TypeScript
import { initTRPC } from "@trpc/server";
import { DrizzleClosedDayRepository } from "@/infrastructure/db/repositories/drizzleClosedDayRepository";
import { DrizzleEventRepository } from "@/infrastructure/db/repositories/drizzleEventRepository";
import { ClosedDayService } from "@/services/closedDayService";
import { EventService } from "@/services/eventService";

const eventRepository = new DrizzleEventRepository();
const eventService = new EventService(eventRepository);

const closedDayRepository = new DrizzleClosedDayRepository();
const closedDayService = new ClosedDayService(closedDayRepository);

export const createContext = () => {
  return { eventService, closedDayService };
};
export type Context = ReturnType<typeof createContext>;

const t = initTRPC.context<Context>().create();

export const router = t.router;
export const publicProcedure = t.procedure;
```

tRPC with Next.js

[

Set up with React Server Components | tRPC

These are the docs for our 'Classic' React Query integration, which (while still supported) is not the recommended way to start new tRPC projects with TanStack React Query. We recommend using the new TanStack React Query Integration instead.

![](https://trpc.io/img/favicon.ico)https://trpc.io/docs/client/react/server-components#2-create-a-trpc-router

![](Import%20tech/Attachments/docs.png)](https://trpc.io/docs/client/react/server-components#2-create-a-trpc-router)