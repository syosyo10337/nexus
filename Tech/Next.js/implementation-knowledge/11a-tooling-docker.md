---
tags:
  - nextjs
  - docker
  - devops
  - typescript
created: 2026-02-24
updated_at: 2026-02-24
status: active
---

# 開発環境: Docker / next.config / tsconfig

関連: [Plop スカフォールド](./11b-tooling-plop.md) / [ESLint boundaries](./11c-tooling-eslint-boundaries.md)

---

## Docker開発環境

### Dockerfile -- マルチステージビルド

単一のDockerfileで開発・テスト・本番の全環境をカバーする。環境ごとに利用するstageを切り替える設計。

```dockerfile
# syntax=docker/dockerfile:1
# NOTE: birdcageでは、単一Dockerfileの構成を採用し,環境ごとに利用するstageを切り替えている。

FROM node:24.11.1-slim AS base
WORKDIR /opt/birdcage

# =========== depsステージ ===========
FROM base AS deps
# 後続処理で参照する可能性があるのと、サイズが小さいため、--mount=type=bindを使用しない
COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm,sharing=locked \
    npm ci

# =========== devステージ ===========
FROM deps AS dev
# Playwright をインストール（ローカル開発用）
RUN npx playwright install --with-deps chromium

# dockerコンテナ内で、codemodなどを利用するときにリポジトリの所有者とプロセス実行者が違ってエラーになるため
# NOTE: git configコマンドを実行するためだけにgitをインストール
RUN apt-get update && \
    apt-get install -y --no-install-recommends git && \
    git config --global --add safe.directory /opt/birdcage && \
    rm -rf /var/lib/apt/lists/*

ENV NODE_ENV=development
EXPOSE 3000 6006
CMD ["npm", "run", "dev"]

# =========== testerステージ（UIテスト専用・CI専用） ===========
# Node 22.20.0が入っている。
FROM mcr.microsoft.com/playwright:v1.56.1-noble AS tester

WORKDIR /opt/birdcage

# node_modulesを再利用
COPY --from=deps /opt/birdcage/node_modules ./node_modules
COPY . .

ENV NODE_ENV=test
ENV ENV=test

# デフォルトでStorybookテストを実行
CMD ["npm", "run", "test:storybook:ci"]

# =========== builderステージ ===========
FROM base AS builder

COPY --from=deps /opt/birdcage/node_modules ./node_modules
COPY . .
RUN --mount=type=cache,target=/opt/birdcage/.next/cache,sharing=locked \
    npm run build
# NOTE: 開発環境以外ではmswは利用しないので該当ファイルを削除する
RUN rm public/mockServiceWorker.js

# =========== runnerステージ ===========
FROM base AS runner
USER 1000
ENV NODE_ENV=production

# standaloneビルド出力をコピー
COPY --chown=1000:1000 --from=builder /opt/birdcage/.next/standalone ./
COPY --chown=1000:1000 --from=builder /opt/birdcage/.next/static ./.next/static
COPY --chown=1000:1000 --from=builder /opt/birdcage/public ./public

EXPOSE 3000/tcp
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
CMD ["node", "server.js"]
```

### ステージ一覧

| ステージ    | 目的                 | 特徴                                                                                                |
| ----------- | -------------------- | --------------------------------------------------------------------------------------------------- |
| **base**    | 共通ベース           | `node:24.11.1-slim` イメージ。全ステージの起点。                                                    |
| **deps**    | 依存関係インストール | `npm ci` を実行。`--mount=type=cache` でnpmキャッシュを永続化し、再ビルドを高速化。                 |
| **dev**     | ローカル開発         | Playwrightブラウザ（chromium）とgitをインストール。ポート3000（Next.js）と6006（Storybook）を公開。 |
| **tester**  | Storybookテスト (CI) | Playwright公式イメージをベースに使用。CI環境でのStorybookインタラクションテスト専用。               |
| **builder** | 本番ビルド           | `.next/cache` をマウントしてビルドキャッシュを活用。ビルド後にMSWのService Workerファイルを削除。   |
| **runner**  | 本番実行             | `standalone` 出力のみコピー。非rootユーザー（UID 1000）で実行し、セキュリティを担保。               |

### compose.yaml

```yaml
services:
  app:
    image: birdcage:local
    build:
      context: .
      dockerfile: Dockerfile
      target: dev
      args:
        BUILDKIT_INLINE_CACHE: 1
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
    command: npm run dev
    profiles:
      - app
      - dev
    # 開発時に、node_modulesと.nextをホストマシンでも参照容易にするため
    volumes:
      - ./:/opt/birdcage

  storybook:
    image: birdcage:local
    build:
      context: .
      dockerfile: Dockerfile
      target: dev
      args:
        BUILDKIT_INLINE_CACHE: 1
    ports:
      - "127.0.0.1:6006:6006"
    environment:
      - NODE_ENV=development
    command: npm run sb:no-open -- --host 0.0.0.0
    profiles:
      - storybook
      - dev
    volumes:
      - ./:/opt/birdcage
```

ポイント:

- **profilesによるサービス選択** -- `dev` プロファイルでapp + storybookの両方を起動。`app` または `storybook` で個別起動も可能。
- **ボリュームマウント** -- `./:/opt/birdcage` でホストのソースコードをコンテナ内にマウント。ファイル変更がリアルタイムで反映される。
- **Storybook のポートバインド** -- `127.0.0.1:6006` でlocalhostのみにバインドし、外部からのアクセスを制限。

---

## bin/ スクリプト

Dockerコンテナを透過的に使うためのユーティリティスクリプト群。コンテナが起動中なら `docker compose exec`、未起動なら `docker compose run --rm` で一時コンテナを実行する共通パターンを採用している。

### スクリプト一覧

| スクリプト    | 用途                            | 使用例                                   |
| ------------- | ------------------------------- | ---------------------------------------- |
| `./bin/dev`   | 開発環境起動（app + storybook） | `./bin/dev`                              |
| `./bin/npm`   | npm コマンド実行                | `./bin/npm install`                      |
| `./bin/npx`   | npx コマンド実行                | `./bin/npx tsc --noEmit`                 |
| `./bin/check` | lint + tsc 実行                 | `./bin/check` / `./bin/check lint --fix` |
| `./bin/test`  | テスト実行                      | `./bin/test` / `./bin/test storybook`    |
| `./bin/gen`   | Orvalコード生成                 | `./bin/gen`                              |
| `./bin/plop`  | コンポーネント生成              | `./bin/plop`                             |

### 共通パターンの実装例

```bash
#!/bin/bash
# bin/npm

# コンテナが起動しているか確認
CONTAINER_RUNNING=$(docker compose ps --status running --services | grep app || true)

if [ -z "$CONTAINER_RUNNING" ]; then
  echo "開発コンテナが実行されていません。一時的なコンテナで実行します..."
  docker compose run --rm app npm "$@"
else
  echo "開発コンテナ内で 'npm $@' を実行中..."
  docker compose exec app npm "$@"
fi
```

**重要**: `node_modules` はDockerコンテナ内のrootユーザーが所有しているため、ホストマシンで直接 `npm install` を実行してはならない。必ず `./bin/npm install` を使用すること。

### bin/test -- プロジェクト名の短縮形をサポート

第1引数にプロジェクト名（`storybook` / `client` / `server`）を指定すると対応する npm スクリプトを実行する。引数がある場合は `--` を挟んで Vitest に渡す。

```bash
./bin/test                        # 全テスト（watchモード）
./bin/test storybook              # Storybookプロジェクトのみ
./bin/test client                 # Clientプロジェクトのみ
./bin/test --run                  # 一度だけ実行
./bin/test --ci                   # CI用（カバレッジ付き）
./bin/test src/features/events    # 特定ディレクトリのテスト
```

### bin/check -- lint + tsc

```bash
./bin/check                # lint + tsc の両方を実行
./bin/check lint --fix     # lint のみ実行（自動修正あり）
./bin/check tsc            # tsc のみ実行
```

### bin/plop -- UID/GID を合わせてファイル権限問題を回避

`--user "${HOST_UID}:${HOST_GID}"` オプションで、生成されたファイルの所有者をホストマシンのユーザーに合わせ、パーミッション問題を回避している。

---

## next.config.ts

```typescript
// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  experimental: {
    // NOTE: 画像送信を可能にするため、imageCompressionで圧縮された画像も含めて3MBまで許可
    serverActions: {
      bodySizeLimit: "3mb",
    },
  },
  // NOTE: dev-kitで開発するときのための設定
  allowedDevOrigins: ["local-admin.chimer.in"],
  serverExternalPackages: [
    "pino",
    "pino-pretty",
    "@google-cloud/pino-logging-gcp-config",
  ],
};
export default nextConfig;
```

### 各設定の解説

| 設定                           | 値                          | 目的                                                                                                                                       |
| ------------------------------ | --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `output`                       | `'standalone'`              | Dockerデプロイ用。`.next/standalone` に自己完結型のサーバーを出力。`node_modules` の必要なファイルのみをコピーし、イメージサイズを最小化。 |
| `serverActions.bodySizeLimit`  | `'3mb'`                     | 画像アップロード対応。デフォルトの1MBでは圧縮後の画像でも超過する可能性があるため、3MBに引き上げ。                                         |
| `allowedDevOrigins`            | `['local-admin.chimer.in']` | dev-kit（ローカル開発用リバースプロキシ）経由でのアクセスを許可。                                                                          |
| `serverExternalPackages`       | `['pino', ...]`             | Node.jsネイティブモジュールに依存するパッケージをWebpackバンドルから除外。バンドルに含めるとランタイムエラーが発生する。                   |
| `eslint.ignoreDuringBuilds`    | `true`                      | ビルド時のlintをスキップ。CIパイプラインで別途lint実行するため、ビルド時間を短縮。                                                         |
| `typescript.ignoreBuildErrors` | `true`                      | ビルド時の型チェックをスキップ。CIパイプラインで別途tsc実行するため、ビルド時間を短縮。                                                    |

---

## tsconfig.json strict設定

```json
{
  "compilerOptions": {
    "strict": true,
    "exactOptionalPropertyTypes": true,
    "noFallthroughCasesInSwitch": true,
    "noImplicitOverride": true,
    "noImplicitReturns": true,
    "noUncheckedIndexedAccess": true,
    "verbatimModuleSyntax": true,
    "forceConsistentCasingInFileNames": true
  }
}
```

### 注目すべきstrict設定の解説

| 設定                               | 効果                                                                                                                                                                                           |
| ---------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `exactOptionalPropertyTypes`       | `undefined` と「プロパティが存在しない」を区別する。`{ name?: string }` に対して `{ name: undefined }` を代入するとエラーになる。APIレスポンスのオプショナルフィールドの取り扱いを厳密にする。 |
| `noUncheckedIndexedAccess`         | 配列・オブジェクトのインデックスアクセスに `T \| undefined` を強制する。`arr[0]` の型が `T` ではなく `T \| undefined` になり、存在しない要素へのアクセスをコンパイル時に検出できる。           |
| `verbatimModuleSyntax`             | `import type` の使用を強制する。型のみのインポートに `import type { Foo } from './bar'` を要求し、ランタイムへの型の漏出を防止する。不要なモジュール副作用の実行を回避できる。                 |
| `noImplicitOverride`               | クラスメソッドのオーバーライド時に `override` キーワードを強制する。基底クラスのメソッド名変更時にサブクラスの追従漏れを検出できる。                                                           |
| `noImplicitReturns`                | すべてのコードパスで明示的な `return` を要求する。`if` 分岐で一部のみ `return` するような暗黙の `undefined` 返却を防止。                                                                       |
| `noFallthroughCasesInSwitch`       | `switch` 文での `case` のフォールスルーを禁止。意図しない `break` 忘れを検出。                                                                                                                 |
| `forceConsistentCasingInFileNames` | ファイル名の大文字小文字を厳密にチェック。macOS（大文字小文字を区別しない）で開発し、Linux（区別する）のCI/本番環境でエラーになるケースを防止。                                                |

**Orval APIクライアント生成** -- 詳細は [03a-api-client-overview.md](./03a-api-client-overview.md) を参照。

