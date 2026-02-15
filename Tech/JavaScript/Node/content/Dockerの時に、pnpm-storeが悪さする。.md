---
tags:
  - javascript
  - syntax
  - data
created: 2026-01-03
status: active
---

# Dockerの時に、pnpm-storeが悪さする

pnpm は content-addressable store という仕組みを使用しており、すべてのパッケージをグローバルな [Crafteo](https://blog.crafteo.io/2023/07/16/169/)ディスク上のストアに保管します。プロジェクトの node_modules は、この pnpm store の内容へのシンボリックリンクまたはハードリンクとなり、ダウンロード時間を大幅に削減できます。

## 🔍 エラーの根本原因

あなたのエラーは **Docker の volume とハードリンクの制約** が原因です：

Docker では、ビルド時にコンテナとホストファイルシステム間で reflink やハードリンクを作成することは不可能です。 [pnpm](https://pnpm.io/docker)

Docker は異なる volume 間でハードリンクを作成できないため、bind mount でリポジトリ全体をマウントし、node_modules を別の volume に配置すると、"cross-device link not permitted" エラーが発生し、pnpm はパッケージのコピーにフォールバックします。 [GitHub](https://github.com/pnpm/pnpm/issues/5318)

あなたの場合：

- **ビルド時**: `/pnpm/store` を使用

- **開発時**: `.:/app` の bind mount + `/app/node_modules` の volume

- pnpm がハードリンクできないため、`/app/.pnpm-store` を作成しようとしている

なので、開発環境では、pnpm-storeをappは以下に追加する。

```Docker
# syntax=docker/dockerfile:1
# cf. https://pnpm.io/docker
FROM node:24.10.0-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0
WORKDIR /app
# Gitとssh関連ツールをインストール
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        git \
        openssh-client \
    && rm -rf /var/lib/apt/lists/*

# == 依存関係ステージ ==
FROM base AS deps

COPY pnpm-lock.yaml ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm fetch --frozen-lockfile
COPY package.json ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --frozen-lockfile --offline

# === 開発ステージ ===
FROM base AS dev

# NOTE: 開発環境では store を node_modules 内に配置
RUN pnpm config set store-dir /app/node_modules/.pnpm-store

COPY --from=deps /app/node_modules ./node_modules
COPY . .

EXPOSE 3000
ENV NODE_ENV=development
CMD ["pnpm", "dev"]
```

```YAML
services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
      target: dev
    ports:
      - "3000:3000"
    volumes:
      - .:/app
      - /app/.next
      - node_modules:/app/node_modules
    environment:
      - NODE_ENV=development
volumes:
  node_modules:
```
