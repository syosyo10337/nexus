---
tags:
  - github-actions
  - cache
  - performance
  - docker
created: 2026-02-06
status: active
---

# GitHub Actions キャッシュ戦略

## キャッシュの3種類

GitHub Actionsでは、主に以下の3種類のキャッシュが存在します。

### 1. Package Manager Cache

パッケージマネージャーの依存関係をキャッシュします。

**例**：npm/yarn for JavaScript

```yaml
- name: Setup Node.js
  uses: actions/setup-node@v4
  with:
    node-version: "20"
    cache: "npm"

- name: Install dependencies
  run: npm ci
```

### 2. Docker Layer Cache

Dockerのレイヤーをキャッシュして、ビルドを高速化します。

**例**：Image layers / Build cache / Multi-stage build cache

```yaml
- name: Set up Docker Buildx
  uses: docker/setup-buildx-action@v3

- name: Build with cache
  uses: docker/build-push-action@v6
  with:
    context: .
    file: Dockerfile
    target: builder
    load: true
    tags: myapp:builder
    cache-from: type=gha,scope=my-cache
    cache-to: type=gha,mode=max,scope=my-cache
```

### 3. Build Output Cache

コンパイル済みのアセットやテスト結果をキャッシュします。

**例**：Compiled assets / Generated files / Test results

```yaml
- name: Cache build output
  uses: actions/cache@v4
  with:
    path: |
      dist/
      .next/cache
    key: ${{ runner.os }}-build-${{ hashFiles('**/package-lock.json') }}
    restore-keys: |
      ${{ runner.os }}-build-
```

## 実践例：builderステージのキャッシュ

```yaml
- name: Set up Docker Buildx
  uses: docker/setup-buildx-action@v3

- name: Set cache scope
  id: set-cache-scope
  shell: bash
  run: |
    CACHE_SCOPE="${{ inputs.environment }}-builder-stage"
    echo "cache_scope=$CACHE_SCOPE" >> $GITHUB_OUTPUT

- name: Build builder stage with GHA cache
  uses: docker/build-push-action@v6
  with:
    context: .
    file: Dockerfile
    target: builder
    load: true
    tags: birdcage:builder
    cache-from: type=gha,scope=${{ steps.set-cache-scope.outputs.cache_scope }}
    cache-to: type=gha,mode=max,scope=${{ steps.set-cache-scope.outputs.cache_scope }}
```

## キャッシュのベストプラクティス

1. **適切なキャッシュキーを設定する**
   - ファイルのハッシュ値を使用：`${{ hashFiles('**/package-lock.json') }}`
   - 環境やブランチを含める：`${{ runner.os }}-${{ github.ref }}`

2. **restore-keysを活用する**
   - 完全一致しない場合の代替キャッシュを設定

3. **キャッシュスコープを適切に分ける**
   - 環境ごと（feature, staging, production）
   - ビルドステージごと

4. **キャッシュサイズに注意**
   - GitHub Actionsのキャッシュは最大10GBまで
   - 古いキャッシュは自動的に削除される

## 参考リンク

- [キャッシュ戦略の詳細（Medium）](https://medium.com/@everton.spader/how-to-cache-package-dependencies-between-branches-with-github-actions-e6a19f33783a)
- [依存関係のキャッシング - GitHub Docs](https://docs.github.com/ja/actions/using-workflows/caching-dependencies-to-speed-up-workflows)
- [actions/cache](https://github.com/actions/cache)
- [docker/build-push-action](https://github.com/docker/build-push-action)
