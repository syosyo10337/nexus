---
tags:
  - database
  - connection-pooling
  - performance
created: 2026-02-28
updated_at: 2026-02-28
status: draft
---

## 概要

データベースへの接続（コネクション）を事前に確保しプールとして管理することで、接続の生成・破棄コストを削減するパターン。ほぼすべての本番アプリケーションで採用される基本的な最適化手法。

## なぜ必要か

DB コネクションの確立には以下のコストがかかる:

1. **TCP ハンドシェイク** — ネットワーク往復
2. **認証** — ユーザー名/パスワードの検証、TLS ネゴシエーション
3. **セッション初期化** — DB 側でメモリ・プロセス確保

リクエストごとにこれを繰り返すと、レイテンシが増大しスループットが低下する。プーリングにより、確立済みコネクションを再利用してこのオーバーヘッドを排除する。

## 基本的な仕組み

```text
Application
    │
    ▼
┌──────────────┐
│ Connection   │  ← idle connections を保持
│    Pool      │
│  [C1][C2][C3]│
└──────┬───────┘
       │  確立済みコネクションを貸し出し
       ▼
┌──────────────┐
│   Database   │
└──────────────┘
```

1. アプリ起動時にプールが一定数のコネクションを確立（**min idle**）
2. リクエスト処理時、プールからコネクションを **borrow**（借用）
3. 処理完了後、コネクションをプールに **return**（返却）
4. プールが空の場合、**max pool size** まで新規コネクションを生成
5. max に達している場合は空きが出るまで待機（**connection timeout**）

## 主要パラメータ

| パラメータ          | 意味                                     | 典型的なデフォルト |
| ------------------- | ---------------------------------------- | ------------------ |
| `maxPoolSize`       | 同時に保持する最大コネクション数         | 10                 |
| `minIdle`           | アイドル状態で維持する最小コネクション数 | 同上 or 0          |
| `connectionTimeout` | プールから借用する際の最大待機時間       | 30秒               |
| `idleTimeout`       | 未使用コネクションを閉じるまでの時間     | 10分               |
| `maxLifetime`       | コネクションの最大生存時間               | 30分               |
| `validationQuery`   | コネクションの有効性チェック用クエリ     | `SELECT 1`         |

## メリット・デメリット

**メリット:**

- コネクション確立のレイテンシを排除
- DB 側のコネクション数を制御（過負荷防止）
- コネクションの再利用によりリソース効率が向上

**デメリット:**

- 設定の誤りがデッドロックやリソース枯渇を引き起こす
- アイドルコネクションがメモリを消費
- DB のフェイルオーバー時に stale connection が残るリスク

## サーバーレス環境での問題

従来のサーバーではプロセスが常駐するためプーリングがうまく機能するが、AWS Lambda のようなサーバーレス環境ではプーリングが逆効果になる。

### 問題のメカニズム

1. Lambda がリクエストを受け、コネクションプールがコネクションを確立
2. 処理完了後、Lambda プロセスは **freeze（凍結）** される（CPU が停止）
3. 凍結中、プールの **reaping 処理**（`setInterval` 等によるアイドル接続の回収）が動かない
4. DB 側から見るとコネクションは開いたまま残り続ける（**stale connection**）
5. 新たなリクエストで別の Lambda インスタンスが起動し、さらにコネクションを確立
6. これが積み重なり DB の `max_connections` に到達 → **"Too many clients"** エラー

```text
Lambda A (frozen) ──── conn1 (stale) ────┐
Lambda B (frozen) ──── conn2 (stale) ────┤
Lambda C (frozen) ──── conn3 (stale) ────├──→ DB: max_connections 超過!
Lambda D (active)  ──── conn4 ───────────┤
Lambda E (active)  ──── conn5 ───────────┘
```

この現象は一般に **connection leak**（コネクションリーク）と呼ばれる。凍結されたプロセスに紐づく回収不能なコネクションは **stale connection** や **orphaned connection** とも呼ばれる。

### 対策

| 対策                            | 説明                                                                                                                          |
| ------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| **外部プロキシの導入**          | RDS Proxy や PgBouncer を Lambda と DB の間に配置。多数の Lambda コネクションを少数の DB コネクションに多重化する             |
| **DB 側の idle timeout**        | PostgreSQL の `idle_session_timeout` をアプリ側の `idleTimeoutMillis` より少し長く設定し、DB 側で stale connection を強制切断 |
| **Lambda 内でプールを使わない** | Lambda ではプールサイズを 1 にする、または都度接続・切断する設計にする                                                        |
| **Serverless 対応 DB**          | Aurora Serverless、PlanetScale、Neon などコネクション管理を内蔵した DB を使う                                                 |

## 代表的な実装

| 言語/環境  | ライブラリ                             |
| ---------- | -------------------------------------- |
| Java/JVM   | HikariCP, c3p0, DBCP2                  |
| Go         | `database/sql`（標準ライブラリに内蔵） |
| Ruby/Rails | ActiveRecord の内蔵プール              |
| Python     | SQLAlchemy の `QueuePool`              |
| Node.js    | `pg-pool`, Knex.js                     |
| インフラ層 | PgBouncer, ProxySQL                    |

## 参考

- [HikariCP - About Pool Sizing](https://github.com/brettwooldridge/HikariCP/wiki/About-Pool-Sizing)
- [Application Side Database Connection Pooling can lead to a Connection Leak in an AWS Lambda Application](https://blog.stefanwaldhauser.me/posts/lambda_db_connection_leak/)
- [How To: Manage RDS Connections from AWS Lambda Serverless Functions](https://www.jeremydaly.com/manage-rds-connections-aws-lambda/)
