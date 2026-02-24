# 開発ツール (Docker / Orval / Plop / ESLint)

Birdcageプロジェクトでは、Docker を中心とした開発環境構築、Orval によるAPIクライアント自動生成、Plop によるコンポーネントスカフォールド、ESLint boundaries によるアーキテクチャルール強制を導入している。

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

### bin/test の詳細

```bash
#!/bin/bash
# bin/test -- プロジェクト名の短縮形をサポート

# プロジェクト名を直接指定
if [ "$1" = "storybook" ]; then
  echo "npm run test:storybook"
  return
fi

if [ "$1" = "client" ]; then
  echo "npm run test:client"
  return
fi

if [ "$1" = "server" ]; then
  echo "npm run test:server"
  return
fi

# 引数がある場合は -- を挟んでVitestに渡す
if [ $# -gt 0 ]; then
  args="$*"
  echo "${base_cmd} -- ${args}"
else
  echo "${base_cmd}"
fi
```

使用例:

```bash
./bin/test                        # 全テスト（watchモード）
./bin/test storybook              # Storybookプロジェクトのみ
./bin/test client                 # Clientプロジェクトのみ
./bin/test server                 # Serverプロジェクトのみ
./bin/test --run                  # 一度だけ実行
./bin/test --ci                   # CI用（カバレッジ付き）
./bin/test src/features/events    # 特定ディレクトリのテスト
```

### bin/check の詳細

```bash
# 使用例
./bin/check                # lint + tsc の両方を実行
./bin/check lint           # lint のみ実行
./bin/check lint --fix     # lint のみ実行（自動修正あり）
./bin/check tsc            # tsc のみ実行
```

### bin/plop の詳細

```bash
#!/bin/bash
# bin/plop -- UID/GIDを合わせてファイル権限問題を回避

HOST_UID=$(id -u)
HOST_GID=$(id -g)

CONTAINER_RUNNING=$(docker compose ps --status running --services | grep app || true)

if [ -z "$CONTAINER_RUNNING" ]; then
  docker compose run --rm -it --user "${HOST_UID}:${HOST_GID}" app npm run plop "$@"
else
  docker compose exec -it --user "${HOST_UID}:${HOST_GID}" app npm run plop "$@"
fi
```

`--user "${HOST_UID}:${HOST_GID}"` オプションで、生成されたファイルの所有者をホストマシンのユーザーに合わせ、パーミッション問題を回避している。

---

## Plopスカフォールド

### plopfile.js

```javascript
// plopfile.js
function plopfile(plop) {
  plop.setGenerator("component", {
    description: "新しいコンポーネントとStoriesファイルを作成",
    prompts: [
      {
        type: "list",
        name: "layer",
        message: "どのレイヤーに作成しますか？",
        choices: [
          { name: "app", value: "app" },
          { name: "features", value: "features" },
          { name: "shared", value: "shared" },
        ],
      },
      {
        type: "input",
        name: "dirPath",
        message:
          "レイヤー内のディレクトリパスを指定してください（例: events/[id]/_components)",
        filter: (value) => value.trim(),
        validate: (value) => {
          if (!value || value.length === 0) {
            return "ディレクトリパスは必須です";
          }
          if (value.endsWith("/")) {
            return "ディレクトリパスの末尾に/は不要です";
          }
          return true;
        },
      },
      {
        type: "input",
        name: "componentName",
        message:
          "コンポーネント名を入力してください（PascalCase、例: NewButton）",
        filter: (value) => value.trim(),
        validate: (value) => {
          if (!value || value.length === 0) {
            return "コンポーネント名は必須です";
          }
          if (!/^[A-Z][\dA-Za-z]*$/.test(value)) {
            return "コンポーネント名はPascalCaseで入力してください（例: NewButton）";
          }
          return true;
        },
      },
    ],
    actions: [
      {
        type: "add",
        path: "src/{{layer}}/{{dirPath}}/{{dashCase componentName}}/index.tsx",
        templateFile: "plop-templates/component.hbs",
      },
      {
        type: "add",
        path: "src/{{layer}}/{{dirPath}}/{{dashCase componentName}}/index.stories.tsx",
        templateFile: "plop-templates/stories.hbs",
      },
    ],
  });
}

export default plopfile;
```

### 生成されるファイル構造

```
src/{layer}/{dirPath}/{kebab-case-name}/
├── index.tsx          # コンポーネント
└── index.stories.tsx  # Storybook Story
```

### テンプレート: コンポーネント

```handlebars
{{! plop-templates/component.hbs }}
interface
{{pascalCase componentName}}Props { // TODO: propsを定義してください } export
function
{{pascalCase componentName}}(props:
{{pascalCase componentName}}Props) { return (
<div>
  {/* TODO: コンポーネントの実装を追加してください */}
</div>
) }
```

### テンプレート: Story

```handlebars
{{!-- plop-templates/stories.hbs --}}
import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect } from 'storybook/test'

import { {{pascalCase componentName}} } from '.'

const meta = {
  component: {{pascalCase componentName}},
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof {{pascalCase componentName}}>

export default meta
type Story = StoryObj<typeof {{pascalCase componentName}}>

export const Default: Story = {
  args: {
    // TODO: デフォルトのargsを定義してください
  },
  play: async ({ canvas, step }) => {
    await step('TODO: ステップ名を記述してください', async () => {
      // Arrange & Act
      // TODO: テスト対象の要素を取得してください

      // Assert
      // TODO: アサーションを追加してください
      // await expect(...).toBeInTheDocument()
    })
  },
}
```

### Plopの設計判断

- **PascalCaseバリデーション** -- コンポーネント名は `/^[A-Z][\dA-Za-z]*$/` で検証。先頭大文字のPascalCaseを強制。
- **dashCase変換** -- ディレクトリ名はPlop組み込みの `dashCase` でkebab-caseに自動変換（例: `NewButton` -> `new-button`）。
- **Storyファイル同時生成** -- コンポーネントとStoryを必ずセットで生成し、テストの書き忘れを防止。
- **play()関数の雛形** -- `step()` を含む雛形を生成し、インタラクションテストの記述を促進。

---

## Orval APIクライアント生成

### orval.config.ts

```typescript
// orval.config.ts
import { defineConfig } from 'orval'

import { replaceRequestInitType } from './orval-hooks/replace-request-init-type.ts'

const IBIS_SPEC_PATH = './wagtail/ibis/openapi/openapi3.yaml'
const OUTPUT_BASE_PATH = './src/api/__generated__'
const IBIS_API_SSR_BASE_PATH = process.env.IBIS_API_SSR_BASE_PATH ?? ''

const IBIS_INPUT = {
  target: IBIS_SPEC_PATH,
  filters: {
    mode: 'exclude' as const,
    schemas: [/^ForDuckSvcGrpc/, /^ForWoodpeckerSvcGrpc/],
  },
}

export default defineConfig({
  // サーバーサイド用 fetch クライアント
  apiIbis: {
    input: IBIS_INPUT,
    output: {
      mode: 'tags-split',
      target: `${OUTPUT_BASE_PATH}/endpoints`,
      schemas: `${OUTPUT_BASE_PATH}/models`,
      client: 'fetch',
      clean: true,
      baseUrl: IBIS_API_SSR_BASE_PATH,
      mock: false,
      override: {
        mutator: {
          path: './src/api/fetchers/server.ts',
          name: 'customServerFetch',
        },
        fetch: {
          includeHttpResponseReturnType: false,
        },
      },
    },
    hooks: {
      afterAllFilesWrite: async (filePaths) => {
        const paths = filePaths as string[]
        for (const filePath of paths) {
          if (filePath.includes('/endpoints/') &10 →& filePath.endsWith('.ts')) {
            await replaceRequestInitType(filePath)
          }
        }
      },
    },
  },

  // Zod バリデーションスキーマ
  zodIbis: {
    input: IBIS_INPUT,
    output: {
      mode: 'tags-split',
      target: `${OUTPUT_BASE_PATH}/endpoints`,
      client: 'zod',10 →
      fileExtension: '.zod.ts',
      override: {
        zod: {
          generate: {
            param: true,
            query: false,
            header: false,
            body: true,
            response: false,
          },
        },
      },
    },
  },

  // クライアントサイド用 React Query hooks
  reactQueryIbis: {
    input: {
      target: IBIS_SPEC_PATH,
      filters: {
        mode: 'include',
        tags: ['EventCheckInPortalService'],
      },
    },
    output: {
      mode: 'tags-split',
      target: `${OUTPUT_BASE_PATH}/endpoints`,
      schemas: `${OUTPUT_BASE_PATH}/models`,
      client: 'react-query',
      httpClient: 'fetch',
      fileExtension: '.query.ts',
      clean: false,
      baseUrl: '/api/proxy',
      override: {
        mutator: {
          path: './src/api/fetchers/client.ts',
          name: 'customClientFetch',
        },
        fetch: {
          includeHttpResponseReturnType: false,
        },
        query: {
          useQuery: true,
          useMutation: true,
          signal: true,
        },
      },
    },
  },
})
```

### 生成される3種類のファイル

| 設定名           | 生成ファイル | 用途                                           | fetch関数                                           |
| ---------------- | ------------ | ---------------------------------------------- | --------------------------------------------------- |
| `apiIbis`        | `*.ts`       | Server Components / Server Actions             | `customServerFetch`（直接バックエンドにリクエスト） |
| `zodIbis`        | `*.zod.ts`   | バリデーション（リクエストボディ・パラメータ） | --                                                  |
| `reactQueryIbis` | `*.query.ts` | Client Components（React Query hooks）         | `customClientFetch`（`/api/proxy` 経由）            |

### 設計上の重要ポイント

- **サーバー/クライアントの分離** -- サーバー用 (`*.ts`) はバックエンドに直接リクエスト、クライアント用 (`*.query.ts`) はAPI Routes (`/api/proxy`) を経由する。この分離により、認証トークンの取り扱いを適切に制御できる。
- **React Query hooksの限定生成** -- `reactQueryIbis` は `EventCheckInPortalService` タグのみをincludeフィルタで選択。全エンドポイントではなく、クライアントサイドで実際に使用するサービスのみhooksを生成する。
- **afterAllFilesWriteフック** -- Orval v7の `client: 'fetch'` モードでは `RequestInit` 型のカスタマイズが設定プロパティだけではサポートされていないため、生成後にフックで型を置換する。
- **内部スキーマの除外** -- `ForDuckSvcGrpc*`, `ForWoodpeckerSvcGrpc*` など他サービス向けの内部スキーマをexcludeフィルタで除外。

---

## ESLint boundaries設定

### import-boundary.mjs

```javascript
// eslint-config/import-boundary.mjs
import boundaries from "eslint-plugin-boundaries";

export const importBoundaryConfig = [
  {
    plugins: { boundaries },
    files: ["src/**/*.{js,jsx,ts,tsx}"],
    settings: {
      "boundaries/elements": [
        // App層
        {
          type: "app-page",
          pattern:
            "src/app/**/{page,loading,error,not-found,default,layout}.tsx",
          mode: "file",
        },
        {
          type: "app-private-component",
          pattern: "src/app/**/_components/**/*.{js,jsx,ts,tsx}",
          mode: "file",
        },
        {
          type: "app-private-hook",
          pattern: "src/app/**/_hooks/**/*.{js,jsx,ts,tsx}",
          mode: "file",
        },
        // Features層
        {
          type: "feature-component",
          pattern: "src/features/(*)/components/**/*.{js,jsx,ts,tsx}",
          capture: ["featureName"],
          mode: "file",
        },
        {
          type: "feature-hook",
          pattern: "src/features/(*)/hooks/**/*.{js,jsx,ts,tsx}",
          capture: ["featureName"],
          mode: "file",
        },
        {
          type: "feature-action",
          pattern: "src/features/(*)/actions/**/*.{js,jsx,ts,tsx}",
          capture: ["featureName"],
          mode: "file",
        },
        {
          type: "feature-store",
          pattern: "src/features/(*)/stores/**/*.{js,jsx,ts,tsx}",
          capture: ["featureName"],
          mode: "file",
        },
        {
          type: "feature-validator",
          pattern: "src/features/(*)/validator.{js,jsx,ts,tsx}",
          capture: ["featureName"],
          mode: "file",
        },
        {
          type: "feature-type",
          pattern: "src/features/(*)/types/**/*.{js,jsx,ts,tsx}",
          capture: ["featureName"],
          mode: "file",
        },
        {
          type: "feature-constant",
          pattern: "src/features/(*)/constants/**/*.{js,jsx,ts,tsx}",
          capture: ["featureName"],
          mode: "file",
        },
        // Shared層
        {
          type: "shared-component",
          pattern: "src/shared/components/**/*.{js,jsx,ts,tsx}",
          mode: "file",
        },
        {
          type: "shared-hook",
          pattern: "src/shared/hooks/**/*.{js,jsx,ts,tsx}",
          mode: "file",
        },
        {
          type: "shared-lib",
          pattern: "src/shared/libs/**/*.{js,jsx,ts,tsx}",
          mode: "file",
        },
        {
          type: "shared-type",
          pattern: "src/shared/types/**/*.{js,jsx,ts,tsx}",
          mode: "file",
        },
        {
          type: "shared-constant",
          pattern: "src/shared/constants/**/*.{js,jsx,ts,tsx}",
          mode: "file",
        },
        {
          type: "shared-error",
          pattern: "src/shared/errors/**/*.{js,jsx,ts,tsx}",
          mode: "file",
        },
        {
          type: "shared-validator",
          pattern: "src/shared/validator.{js,jsx,ts,tsx}",
          mode: "file",
        },
        // その他
        {
          type: "api-client",
          pattern: "src/api/**/*.{js,jsx,ts,tsx}",
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
              from: ["app-page"],
              allow: [
                "app-private-component",
                "app-private-hook",
                "feature-constant",
                "shared-component",
                "shared-hook",
                "shared-type",
                "shared-constant",
                "api-client",
              ],
            },
            {
              from: ["app-private-component"],
              allow: [
                "app-private-component",
                "app-private-hook",
                "feature-component",
                "feature-hook",
                "feature-action",
                "feature-store",
                "feature-validator",
                "feature-type",
                "feature-constant",
                "shared-component",
                "shared-hook",
                "shared-lib",
                "shared-type",
                "shared-constant",
                "shared-error",
                "shared-validator",
                "api-client",
              ],
            },
            {
              from: ["app-private-hook"],
              allow: [
                "app-private-hook",
                "feature-hook",
                "feature-constant",
                "shared-component",
                "shared-hook",
                "shared-constant",
                "shared-lib",
              ],
            },
            {
              from: [
                "feature-component",
                "feature-hook",
                "feature-action",
                "feature-store",
                "feature-validator",
                "feature-type",
                "feature-constant",
              ],
              allow: [
                // 同一feature内のみ許可
                ["feature-component", { featureName: "${from.featureName}" }],
                ["feature-hook", { featureName: "${from.featureName}" }],
                ["feature-action", { featureName: "${from.featureName}" }],
                ["feature-store", { featureName: "${from.featureName}" }],
                ["feature-validator", { featureName: "${from.featureName}" }],
                ["feature-type", { featureName: "${from.featureName}" }],
                ["feature-constant", { featureName: "${from.featureName}" }],
                "shared-component",
                "shared-hook",
                "shared-lib",
                "shared-type",
                "shared-constant",
                "shared-error",
                "shared-validator",
                "api-client",
              ],
            },
            {
              from: [
                "shared-component",
                "shared-hook",
                "shared-lib",
                "shared-type",
                "shared-constant",
                "shared-error",
                "shared-validator",
              ],
              allow: [
                "shared-component",
                "shared-hook",
                "shared-lib",
                "shared-type",
                "shared-constant",
                "shared-error",
                "shared-validator",
                "api-client",
              ],
            },
            {
              from: ["api-client"],
              allow: [
                "api-client",
                "shared-lib",
                "shared-error",
                "shared-constant",
              ],
            },
          ],
        },
      ],
      "boundaries/no-private": [
        "error",
        {
          allowUncles: true,
        },
      ],
    },
  },
];
```

### 依存関係ダイアグラム

```
app-page ──> app-private-component ──> feature-* ──> shared-*
   |                |                                    ^
   |                +──> feature-action                  |
   |                +──> feature-store                   |
   |                +──> feature-validator               |
   |                                                     |
   +──> shared-component                                 |
   +──> api-client ──────────────────────────────────────+
```

### 依存ルールの詳細

| ルール                                               | 説明                                                                                                                                                                                                               |
| ---------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **feature間のクロスインポート禁止**                  | `featureName: '${from.featureName}'` の条件で、同一feature内のモジュールのみインポートを許可。例えば `features/events/` から `features/settings/` をインポートするとエラーになる。                                 |
| **shared -> features/app へのインポート禁止**        | shared層は純粋なユーティリティ層として設計。上位レイヤーへの依存を持たないことで、再利用性を最大化する。                                                                                                           |
| **api-client -> shared-lib/error/constant のみ許可** | API層はビジネスロジック（features）に依存しない。共有ライブラリ、エラー定義、定数のみインポート可能。                                                                                                              |
| **app-page -> feature-component は不可**             | ページファイル（`page.tsx`, `layout.tsx` 等）からfeatureコンポーネントを直接インポートできない。必ず `_components` 配下のprivateコンポーネント経由にすることで、ページの責務をルーティングとレイアウトに限定する。 |
| **boundaries/no-private（allowUncles: true）**       | `_` プレフィックスのディレクトリ内のファイルはプライベートだが、叔父（uncle）ディレクトリからのアクセスは許可。これにより、同じページ内の `_components` と `_hooks` が相互参照できる。                             |

### デバッグ方法

boundariesルールが期待どおりに動作しない場合:

```bash
ESLINT_PLUGIN_BOUNDARIES_DEBUG=1 ./bin/check lint
```

環境変数 `ESLINT_PLUGIN_BOUNDARIES_DEBUG=1` を設定すると、各ファイルがどのelement typeにマッチしたかが出力される。

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
