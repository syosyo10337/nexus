 Instagram API連携 - イベント自動投稿システム設計書

 概要

 イベントが「公開 (Published)」ステータスに変更された時、自動的にInsta
 gramへ投稿するシステム。

 要件

- 投稿形式: シングル画像投稿（サムネイル + キャプション）
- 投稿タイミング: 即時（Draft → Published 時）
- エラー処理: 非ブロッキング（Instagram失敗でもイベント公開は成功）
- Archive/Delete: 手動対応が必要とユーザーに通知

 ---
 アーキテクチャ

 ┌─────────────────────────────────────────────────────────────┐
 │  Admin UI (Refine)                                          │
 │  EventEditForm → status: "published"                        │
 └────────────────────────┬────────────────────────────────────┘
                          ↓
 ┌─────────────────────────────────────────────────────────────┐
 │  tRPC Router (events.update)                                │
 │  adminProcedure → validation                                │
 └────────────────────────┬────────────────────────────────────┘
                          ↓
 ┌─────────────────────────────────────────────────────────────┐
 │  EventService.updateEvent()                                 │
 │  1. 現在の状態を取得                                         │
 │  2. DBを更新                                                │
 │  3. Draft→Published検出 → Instagram投稿を非同期トリガー      │
 └────────────────────────┬────────────────────────────────────┘
                          ↓ (非同期・非ブロッキング)
 ┌─────────────────────────────────────────────────────────────┐
 │  EventInstagramService.postEventToInstagram()               │
 │  - キャプション生成                                          │
 │  - InstagramService呼び出し                                  │
 │  - 結果をDBに保存                                            │
 └────────────────────────┬────────────────────────────────────┘
                          ↓
 ┌─────────────────────────────────────────────────────────────┐
 │  InstagramService (Infrastructure Layer)                    │
 │  1. メディアコンテナ作成 (POST /{account-id}/media)          │
 │  2. 公開 (POST /{account-id}/media_publish)                 │
 └─────────────────────────────────────────────────────────────┘

 ---
 新規ファイル構成

 src/
 ├── domain/
 │   └── entities/
 │       └── instagram/
 │           └── index.ts              # InstagramPostStatus enum
 │
 ├── infrastructure/
 │   └── social/
 │       └── instagram/
 │           ├── index.ts              # エクスポート
 │           ├── instagramService.ts   # Graph API呼び出し
 │           ├── tokenManager.ts       # トークン管理
 │           └── types.ts              # 型定義
 │
 └── services/
     └── eventInstagramService.ts      # イベント→Instagram変換

 ---

 1. データベーススキーマ拡張

 1.1 Instagram投稿ステータスEnum追加

 // src/infrastructure/db/schema.ts に追加

 export const instagramPostStatusEnum =
 pgEnum("instagram_post_status", [
   "pending",   // 投稿処理中
   "posted",    // 投稿完了
   "failed",    // 投稿失敗
   "skipped",   // スキップ（サムネイルなし）
 ]);

 1.2 eventsテーブル拡張

 // src/infrastructure/db/schema.ts の events テーブルに追加

 export const events = pgTable("events", {
   // ... 既存フィールド ...

   // Instagram連携フィールド（新規追加）
   instagramPostId: text("instagram_post_id"),
   instagramPostStatus:
 instagramPostStatusEnum("instagram_post_status"),
   instagramPostError: text("instagram_post_error"),
   instagramPostedAt: timestamp("instagram_posted_at", {
     mode: "date",
     withTimezone: true
   }),
 });

 ---

 1. ドメイン層

 2.1 InstagramPostStatus Entity

 // src/domain/entities/instagram/index.ts

 export const InstagramPostStatus = {
   Pending: "pending",
   Posted: "posted",
   Failed: "failed",
   Skipped: "skipped",
 } as const satisfies Record<string, string>;

 export type InstagramPostStatus =
   [typeof InstagramPostStatus](keyof typeof InstagramPostStatus);

 export interface InstagramPostResult {
   success: boolean;
   postId?: string;
   error?: string;
   errorCode?: string;
 }

 2.2 EventEntity拡張

 // src/domain/entities/event/index.ts に追加

 export interface EventEntity {
   // ... 既存フィールド ...

   // Instagram連携（オプショナル）
   instagramPostId?: string | null;
   instagramPostStatus?: InstagramPostStatus | null;
   instagramPostError?: string | null;
   instagramPostedAt?: string | null;
 }

 ---

 1. インフラストラクチャ層 - Instagram Service

 3.1 InstagramService

 // src/infrastructure/social/instagram/instagramService.ts

```typeScript
 export class InstagramService {
   private instagramAccountId: string;

   constructor() {
     this.instagramAccountId = process.env.INSTAGRAM_ACCOUNT_ID!;
   }

   /**
    *画像をInstagramに投稿（2段階プロセス）
    */
   async postImage(payload: {
     imageUrl: string;
     caption: string;
   }): Promise<InstagramPostResult> {
     // 1. 画像URL検証
     // 2. メディアコンテナ作成 (POST /{account-id}/media)
     // 3. 公開 (POST /{account-id}/media_publish)
     // 4. 結果返却
   }
 }
```

3.2 Instagram Graph API制約
 ┌────────────────────┬──────────────────────┐
 │        制約        │          値          │
 ├────────────────────┼──────────────────────┤
 │ 投稿数上限         │ 25件/24時間          │
 ├────────────────────┼──────────────────────┤
 │ APIリクエスト      │ 200回/時間           │
 ├────────────────────┼──────────────────────┤
 │ キャプション文字数 │ 2,200文字            │
 ├────────────────────┼──────────────────────┤
 │ 画像サイズ         │ 最大8MB              │
 ├────────────────────┼──────────────────────┤
 │ トークン有効期限   │ 60日（長期トークン） │
 └────────────────────┴──────────────────────┘
 ---

 1. サービス層

 4.1 EventInstagramService

 // src/services/eventInstagramService.ts

 export class EventInstagramService {
   /**
    *イベントをInstagramに投稿
    */
   async postEventToInstagram(event: EventEntity):
 Promise<InstagramPostData> {
     // サムネイルなし → スキップ
     if (!event.thumbnail) {
       return { status: "skipped", ... };
     }

     // キャプション生成
     const caption = this.generateCaption(event);
     // 🎉 {タイトル}
     // 📅 {日付}
     // {説明}
     // 📍 SOY-POY
     // #soypoy #イベント #tokyo

     // Instagram投稿
     return await this.instagramService.postImage({
       imageUrl: event.thumbnail,
       caption,
     });
   }
 }

 4.2 EventService修正

 // src/services/eventService.ts

 async updateEvent(id: string, input: Partial<...>):
 Promise<EventEntity> {
   // 現在の状態を取得
   const currentEvent = await this.repository.findById(id);

   // DB更新
   const updatedEvent = await this.repository.update(id, input);

   // Draft → Published 検出
   const isPublishing =
     currentEvent?.publicationStatus !== "published" &&
     input.publicationStatus === "published";

   if (isPublishing) {
     // 非同期でInstagram投稿（結果を待たない）
     this.triggerInstagramPost(updatedEvent).catch(console.error);
   }

   return updatedEvent;
 }

 ---

 1. 環境変数

# .env.local に追加（dotenvxで暗号化）

# Instagram Graph API

 INSTAGRAM_ACCESS_TOKEN="長期アクセストークン"
 INSTAGRAM_ACCOUNT_ID="Instagramビジネスアカウント ID"

# オプション: トークンリフレッシュ用

 FACEBOOK_APP_ID="FacebookアプリID"
 FACEBOOK_APP_SECRET="Facebookアプリシークレット"

 認証情報の取得手順

 1. Meta Developer Console でFacebookアプリを作成
 2. Instagram Graph API 製品を追加
 3. instagram_content_publish スコープでユーザートークン生成
 4. 短期トークン → 長期トークン（60日）に交換
 5. Instagram Business Account IDを取得

 ---

 1. 管理画面UI更新

 6.1 Instagram投稿ステータスバッジ

 // src/components/admin/InstagramStatusBadge.tsx

 // ステータス表示
 // - pending: "投稿中..." (グレー)
 // - posted: "投稿済み" (グリーン)
 // - failed: "失敗" (レッド) + 再試行ボタン
 // - skipped: "スキップ" (アウトライン)

 6.2 イベント詳細画面に追加

 ┌─────────────────────────────────────────┐
 │ イベント詳細                             │
 ├─────────────────────────────────────────┤
 │ タイトル: xxx                           │
 │ 日付: 2025/01/20                        │
 │ ステータス: 公開済み                      │
 │                                         │
 │ Instagram: [投稿済み ✓]                  │
 │ → 投稿を見る (リンク)                    │
 │                                         │
 │ ⚠️ この投稿はInstagramにも公開されています │
 │    アーカイブ/削除してもInstagram投稿は    │
 │    自動削除されません                     │
 └─────────────────────────────────────────┘

 6.3 失敗時の再試行

 ┌─────────────────────────────────────────┐
 │ Instagram: [失敗 ✗] [再試行]             │
 │ エラー: API利用制限に達しました           │
 └─────────────────────────────────────────┘

 ---

 1. エラーハンドリング

 7.1 エラーコード対応表
 エラー: Rate Limit (code: 4, 17)
 対応: ログ記録、管理画面で通知、後で再試行
 ────────────────────────────────────────
 エラー: Invalid Token (code: 190)
 対応: ログ記録、管理者に通知
 ────────────────────────────────────────
 エラー: Permission Denied (code: 10, 200)
 対応: ログ記録、設定確認を促す
 ────────────────────────────────────────
 エラー: Image URL Invalid
 対応: スキップ、エラーメッセージ保存
 7.2 トークン期限切れ対応

 1. トークン有効期限を監視（残り7日で警告）
 2. 自動リフレッシュ試行
 3. 失敗時は管理者に手動更新を通知

 ---

 1. 修正対象ファイル一覧

 新規作成

- src/domain/entities/instagram/index.ts
- src/infrastructure/social/instagram/index.ts
- src/infrastructure/social/instagram/instagramService.ts
- src/infrastructure/social/instagram/tokenManager.ts
- src/infrastructure/social/instagram/types.ts
- src/services/eventInstagramService.ts
- src/components/admin/InstagramStatusBadge.tsx

 修正

- src/infrastructure/db/schema.ts - Instagramフィールド追加
- src/domain/entities/event/index.ts - EventEntity拡張
- src/domain/entities/index.ts - エクスポート追加
- src/services/eventService.ts - Instagram投稿トリガー追加
- src/infrastructure/db/repositories/drizzleEventRepository.ts -
 新フィールド対応
- src/infrastructure/trpc/routers/events.ts -
 再試行エンドポイント追加
- src/app/admin/(authenticated)/events/[id]/_components/EventDetailCa
 rd/index.tsx - UI更新

 ---

 1. 実装順序

 Phase 1: データベース

 1. schema.ts にEnum・フィールド追加
 2. マイグレーション生成・適用
 3. Repository更新

 Phase 2: ドメイン層

 1. InstagramPostStatus Entity作成
 2. EventEntity 拡張

 Phase 3: インフラ層

 1. InstagramService 実装
 2. トークン管理実装
 3. 環境変数設定

 Phase 4: サービス層

 1. EventInstagramService 実装
 2. EventService 修正

 Phase 5: API・UI

 1. tRPC再試行エンドポイント
 2. 管理画面UI更新
 3. 警告表示実装

 ---

 1. 検証方法

 10.1 単体テスト（手動）

 1. Instagram API接続テスト

# トークン検証

 curl "<https://graph.facebook.com/v21.0/me?access_token={TOKEN}>"
 25. テスト投稿

- テスト用イベントを作成（Draft）
- サムネイルをアップロード
- Published に変更
- Instagramアカウントで投稿確認

 10.2 エラーケーステスト

 1. サムネイルなしイベントの公開 → スキップされること確認
 2. 無効なトークンでの投稿試行 → エラーがDBに保存されること確認
 3. 再試行ボタン → 投稿が再実行されること確認

 10.3 E2Eフロー

 1. 管理画面でイベント作成
 2. サムネイル画像アップロード
 3. ステータスを「公開」に変更
 4. イベント詳細画面でInstagramステータス確認
 5. Instagramアプリで投稿確認
 6. イベントをアーカイブ → 警告メッセージ表示確認

 ---
 注意事項

- Instagram Graph APIは Instagram Business/Creator アカウント が必須
- 画像URLは 公開アクセス可能 である必要あり（Cloudinary URLはOK）
- 投稿の 削除API は存在しないため、Archive/Deleteは手動対応
- レート制限（25件/24時間）に注意
