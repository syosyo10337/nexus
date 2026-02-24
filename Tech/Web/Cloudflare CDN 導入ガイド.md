---
tags:
  - web
  - cdn
  - cloudflare
  - dns
  - performance
created: 2026-02-25
updated_at: 2026-02-25
status: active
---

## 概要

Netlify でホスティングしているサイトの前段に Cloudflare CDN を配置し、静的アセットのキャッシュによるレスポンス高速化を図る構成ガイド。

## 背景と動機

Netlify の Serverless Functions（Next.js SSR）は AWS Lambda（us-east-1 固定）ベースで動いており、以下の問題がある：

- **Cold start**: warm 状態でも他プラットフォームの 3 倍以上遅く、cold start は 3 秒超
- **地理的距離**: 日本からは物理的に遠い

## 登場人物と役割

| サービス        | 役割                                            |
| --------------- | ----------------------------------------------- |
| **ロリポップ**  | ドメイン所有（レジストラ）                      |
| **Netlify DNS** | DNS 管理（現在）→ Cloudflare に移行             |
| **Netlify**     | サイトホスティング（soypoy-portal.netlify.app） |
| **Cloudflare**  | CDN + DNS 管理（変更後）                        |

## 構成変更の全体像

### Before（現在）

```
ユーザー
  ↓ soypoy.com にアクセス
NS を確認 → Netlify DNS（dns1〜4.p01.nsone.net）
  ↓
Netlify DNS → soypoy-portal.netlify.app に解決
  ↓
Netlify サーバーで Next.js SSR 実行 ← ここが遅い（cold start）
  ↓
HTML をユーザーに返す
```

### After（Cloudflare CDN 導入後）

```
ユーザー
  ↓ soypoy.com にアクセス
NS を確認 → Cloudflare DNS
  ↓
Cloudflare エッジサーバー（日本に近い拠点）
  ├─ キャッシュあり → そのまま返す（速い）
  └─ キャッシュなし → Netlify まで届く → SSR 実行 → キャッシュに保存
```

## CDN で改善するもの・しないもの

| 対象                             | CDN 効果 | 理由                                |
| -------------------------------- | -------- | ----------------------------------- |
| 静的アセット（HTML/CSS/JS/画像） | 大きい   | Cloudflare エッジにキャッシュされる |
| API レスポンス（キャッシュ可能） | 大きい   | Cache-Control 設定で有効            |
| API レスポンス（動的・認証あり） | ほぼなし | キャッシュできずオリジンまで到達    |
| SSR の初回 cold start            | なし     | 初回はオリジンまで届く              |

## 設定手順

### Step 1: Cloudflare にサイトを追加

1. [cloudflare.com](https://cloudflare.com) でアカウント作成（無料）
2. 「Add a site」→ ドメイン名を入力 → Free プラン選択
3. 自動スキャンで既存レコードが表示される

### Step 2: DNS レコードを整理

自動スキャンで古い A レコード（ロリポップの IP）が拾われる場合がある。これは不要なので整理する。

**削除するもの:**

- ロリポップ時代の A レコード（すべて）

**追加するもの:**

| タイプ | 名前  | コンテンツ                | プロキシ         |
| ------ | ----- | ------------------------- | ---------------- |
| CNAME  | `@`   | soypoy-portal.netlify.app | ON（オレンジ雲） |
| CNAME  | `www` | soypoy-portal.netlify.app | ON（オレンジ雲） |

プロキシ ON（オレンジ雲マーク）にすることで、トラフィックが Cloudflare を経由し CDN として機能する。OFF（グレー雲）だと DNS 解決のみで CDN 効果なし。

### Step 3: ロリポップで NS を変更

Cloudflare が指定する 2 つの NS をメモし、ロリポップ管理画面でネームサーバーを変更する。

```
例:
xxx.ns.cloudflare.com
yyy.ns.cloudflare.com
```

ロリポップ管理画面 → 独自ドメイン → 対象ドメインのネームサーバーを上記 2 つに変更。

反映には最大 48 時間かかるが、通常は 1 時間以内。

### Step 4: Netlify の DNS zone を削除

Cloudflare が DNS を管理するようになるため、Netlify の DNS zone は不要。

Netlify Dashboard → DNS → 対象ドメイン → 「Delete DNS zone」

> Netlify のカスタムドメイン設定（サイト設定側）はそのまま残す。削除するのは DNS zone のみ。

## NS 切り替え時のダウンタイム

基本的にアクセス不能にはならない。切り替え中は：

- 古い NS（Netlify）→ まだこちらで見ている人
- 新しい NS（Cloudflare）→ こちらで見ている人

どちらも最終的に soypoy-portal.netlify.app を向いているため、どちらからアクセスしても繋がる。

## 根本解決：SSR から SSG/ISR への移行

CDN はキャッシュヒット時のみ高速化する。初回 cold start を根本的に解決するには：

| レンダリング方式 | 説明                                        | 速度                      |
| ---------------- | ------------------------------------------- | ------------------------- |
| **SSR**          | リクエストごとに HTML 生成                  | 遅い（cold start 影響大） |
| **SSG**          | ビルド時に HTML 生成                        | 速い（静的ファイル配信）  |
| **ISR**          | 一定時間キャッシュ + バックグラウンド再生成 | 速い + 更新可能           |

トップページが動的に変わらないなら SSG、定期的に更新が必要なら ISR が最適。

## Cloudflare Free プランの制限

- CDN・DNS は無制限
- Page Rules: 3 つまで
- SSL: 自動で Full (Strict) に設定される

## 参考リンク

- [Cloudflare 公式 - Get Started](https://developers.cloudflare.com/fundamentals/setup/)
- [Cloudflare CDN ドキュメント](https://developers.cloudflare.com/cache/)
- [DNS の仕組み](<DNS(%20Domain%20Name%20System).md>)
