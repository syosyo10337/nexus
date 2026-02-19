---
tags:
  - nextjs
  - caching
  - server-actions
created: 2026-02-19
status: active
---

# Next.js 16: updateTag() と refresh()

Next.js 16 で追加された **Server Actions 専用** の新しいキャッシュ API。

## updateTag()

`next/cache` からインポートする。指定した tag に紐づくキャッシュを失効させ、再取得する。

```ts
"use server";
import { updateTag } from "next/cache";

export async function updateProfile(userId: string, data: Profile) {
  await db.users.update(userId, data);
  updateTag(`user-${userId}`); // Server Action 内でのみ使用可能
}
```

### revalidateTag との違い

- `revalidateTag()` → キャッシュを**無効化するだけ**（次のリクエストで再取得）
- `updateTag()` → キャッシュを無効化し**即座に再取得**（read-your-writes セマンティクス）

## refresh()

Server Action 内でキャッシュされていないデータをリフレッシュする API。

## なぜ Server Actions 限定か

Server Action は「ユーザー操作 → データ変更 → UI 更新」を **1リクエストで完結** させる仕組み。`updateTag()` の read-your-writes セマンティクスは、この単一リクエスト内で完結するからこそ意味がある。

## 役割分担

| やること                          | どこで                           |
| --------------------------------- | -------------------------------- |
| tag を**付ける**                  | `fetch()` の `next.tags`         |
| tag を**失効・再取得する**        | Server Action 内で `updateTag()` |
| uncached データを**リフレッシュ** | Server Action 内で `refresh()`   |
