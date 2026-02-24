---
tags:
  - web
  - serverless
  - performance
  - cloudflare
  - netlify
created: 2026-02-25
status: draft
---

## 概要

サーバーレス / エッジランタイムの cold start 特性とアーキテクチャの違いを比較する。ホスティング先の選定やパフォーマンス改善の判断材料として使う。

## Cold Start とは

サーバーレス関数が一定時間呼ばれないと、実行環境が破棄される。次のリクエスト時に環境を再構築する時間が **cold start**。

```text
リクエスト
  ↓
実行環境が存在する？
  ├─ Yes（warm）→ すぐ実行（数ms）
  └─ No（cold）→ 環境構築 → 実行（数百ms〜数秒）
```

## プラットフォーム比較

| プラットフォーム | ランタイム | Cold start | エッジ拠点 | 備考 |
|-----------------|-----------|------------|-----------|------|
| **Cloudflare Workers** | V8 Isolate | ほぼゼロ | 300+ | 最速。軽量な isolate で起動が速い |
| **Netlify Edge Functions** | Deno (V8 Isolate) | ほぼゼロ | 限定的 | Workers と同じ仕組み。通常の Functions より高速 |
| **Vercel Edge Functions** | V8 Isolate | ほぼゼロ | 多数 | Next.js middleware 等で使用 |
| **Netlify Functions** | AWS Lambda | 3秒超 | us-east-1 固定 | Node.js ベース。日本から遠い |
| **Vercel Serverless Functions** | AWS Lambda | 1-2秒 | リージョン選択可 | Netlify より柔軟だが cold start あり |
| **AWS Lambda** | コンテナ | 1-3秒 | リージョン選択可 | Provisioned Concurrency で緩和可能 |

## アーキテクチャの違い

### コンテナベース（Lambda 系）

```text
リクエスト → コンテナ起動 → ランタイム初期化 → コード実行
              ↑ ここが遅い（cold start の原因）
```

- Node.js / Python 等のフルランタイムを起動
- メモリ・CPU の自由度が高い
- 実行時間制限が長い（Netlify: 10秒、AWS Lambda: 15分）

### V8 Isolate ベース（Workers / Edge 系）

```text
リクエスト → Isolate 生成（軽量）→ コード実行
              ↑ 数ms で完了
```

- V8 エンジンの軽量サンドボックス内で実行
- Node.js API の一部が使えない制約あり
- 実行時間制限が短い（Cloudflare: CPU 10ms Free / 30ms Paid）

## Netlify Functions が遅い理由

1. **AWS Lambda ベース**: コンテナ型のため cold start が大きい
2. **us-east-1 固定**: リージョン選択不可。日本からのレイテンシが大きい
3. **warm 状態でも遅い**: ベンチマークで他プラットフォームの 3 倍以上

## 対策の選択肢

| 対策 | 効果 | 難易度 |
|------|------|--------|
| CDN（Cloudflare）を前段に置く | 静的コンテンツのみ改善 | 低 |
| SSR → SSG / ISR に変更 | cold start を回避 | 中 |
| Netlify Edge Functions に移行 | cold start 解消 | 中 |
| Cloudflare Workers に移行 | cold start 解消 + 最速 | 高 |

## 参考

- [Cloudflare CDN 導入ガイド](Cloudflare%20CDN%20導入ガイド.md)
- [Cloudflare Workers 公式](https://developers.cloudflare.com/workers/)
- [Netlify Edge Functions 公式](https://docs.netlify.com/edge-functions/overview/)
