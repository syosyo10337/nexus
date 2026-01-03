 

# ReferenceError: require is not defined in ES module scope, you can use import instead

[🔍 問題の前提知識](#2af38cdd-027d-80d2-9c22-fef2285d42ff)

[1. **Node.js 20.6.0以降の破壊的変更**](#2af38cdd-027d-80a8-978b-d200881e583b)

[2. **esbuild-registerの想定外の動作**](#2af38cdd-027d-8039-9807-cdfe3c005be6)

[3. **Storybook 9系のesbuild-register依存**](#2af38cdd-027d-807e-aea8-df679b062d2f)

[4. 🔬 Node.jsのモジュール読み込みの仕組み](#2af38cdd-027d-8024-b3ca-d99ba83f0baa)

[**前提知識: Node.jsの2つのモジュールシステム**](#2af38cdd-027d-8087-a611-c3a7584de0cc)

[起きていたこと](#2af38cdd-027d-801d-8455-f6c1baf28d05)

[🔍 スタックトレースが語る真実](#2af38cdd-027d-8092-b8e2-edba879df8e0)

[1. Storybookを起動する(内部でcommonJS依存がある。)](#2af38cdd-027d-8059-ae5c-c725f7141bc9)

[3. Node.jsがファイル形式を判定](#2af38cdd-027d-8081-a64f-dac50dd058bc)

[4. require() から ESM を読み込む特別な処理  
importSyncForRequire() が起動](#2af38cdd-027d-806b-b18e-dac717901916)

[5. ESM Loader が起動](#2af38cdd-027d-803e-83c6-ead27b31cab0)

[6. esbuild-register の load() がフックされる  
⚠️ 問題: トランスパイルせずに生のソース（TypeScript + ESM構文）を返す](#2af38cdd-027d-80cb-9a7b-fe689c5be7e6)

[8. Node.jsに返される:](#2af38cdd-027d-8060-bb33-f5fc0d070c7e)

[9. Node.js 20.6+ の新機能を検出:](#2af38cdd-027d-8038-b775-fd446d51e0ce)

[10. CommonJS互換層 (新機能) が起動　sourceを直接評価](#2af38cdd-027d-80f9-a68a-ca719251aee2)

[11. 生のソース（TypeScript + `import`文）  
かつ、commonJSのコードを含む状態で、ESMモジュール用のloader空間で実行される](#2af38cdd-027d-8066-abe0-eb26dc14d72f)

[📚 参考資料](#2af38cdd-027d-8079-9004-c050382ced4c)

[✅ 必読資料](#2af38cdd-027d-8057-ad07-cf8cc5a5d95d)

[⚠️ 関連情報](#2af38cdd-027d-80b2-80e4-d840110d156d)

[ソースコード](#2af38cdd-027d-8017-a9f5-f51cff4115e2)

[✅ 解決策](#2af38cdd-027d-808e-8f1c-c820cfe06894)

[**現在の対応 (Storybook 9系)**](#2af38cdd-027d-802d-a553-cebe51a4f786)

# 🔍 問題の前提知識

この問題は**3つの要因が重なって発生**しています:

## 1. **Node.js 20.6.0以降の破壊的変更**

✅ **Node.js公式ドキュメント**: [ES Modules - Node.js Documentation](https://nodejs.org/api/esm.html)

uhyoさんのZenn記事で詳しく解説されていますが、Node.js 20.6.0で`load`フックの挙動が変更されました。従来は`format :antCitation[]{citations="8020a45f-f596-4f8f-b067-c3e8451e00be"}: 'commonjs'`と一緒に返された`source`は無視されていましたが、20.6.0以降は**実際に使用される**ようになりました。

```Shell
// Node.js 20.5以前の挙動
export async function load(url, context, defaultLoad) {
  return {
    format: 'commonjs',
    source: source,  // ← これは無視されていた
  }
}
```

- Node20.6からESM loaderでも、cjsをロード出来るようになって"改善"された [https://github.com/nodejs/node/pull/47999](https://github.com/nodejs/node/pull/47999)

## 2. **esbuild-registerの想定外の動作**

  
[✅ **esbuild-register GitHub**: Issue #96  
](https://github.com/egoist/esbuild-register/issues/96)esbuild-registerは、TypeScriptファイルを読み込む際に`format: 'commonjs'`を返すことで、Node.jsの従来のCommonJSローダーにトランスパイル処理を委譲する設計でした。  
（ESMローダー側ではsourceは返していたが無視され、CommonJS側でesbuil-registerがフックされるときに返ってくるsourceを元にトランスパイルしていた。

しかし、Node.js 20.6.0の新機能によって、意図せず新しいCommonJS互換層にオプトインしてしまい、トランスパイルされていないコードがNode.jsに渡されるようになってしまいました 。

cf.　CommonJSへの互換層 [https://github.com/nodejs/node/pull/47999](https://github.com/nodejs/node/pull/47999)  

## 3. **Storybook 9系のesbuild-register依存**

  
⚠️ [**Storybook Issue**: [#11587 - Storybook cannot be built on packages using "type": "module"]](https://github.com/storybookjs/storybook/issues/11587)

v10で依存性がなくなったらしい。

## 4. 🔬 Node.jsのモジュール読み込みの仕組み

### **前提知識: Node.jsの2つのモジュールシステム**

Node.jsには2つの独立したモジュールローダーがあります:

```Shell
# Node.js 20.5以前
┌─────────────────────────────────────────┐
│          Node.js Process                │
├─────────────────────────────────────────┤
│  ESM Loader                             │
│  ・load() フック                         │
│  ・resolve() フック                      │
│  ・format判定のみ                        │
│                                         │
│  ↓ format: 'commonjs' を検出したら      │
│                                         │
├─────────────────────────────────────────┤
│  CJS Loader (Legacy)                    │
│  ・require() の実装                      │
│  ・Module._extensions でフック可能       │
│  ・esbuild-registerがここにフック       │
│  ・ファイルを読み直す                    │
└─────────────────────────────────────────┘



# Node.js 20.6以降の
┌─────────────────────────────────────────┐
│          Node.js Process                │
├─────────────────────────────────────────┤
│  ESM Loader                             │
│  ・load() フック                         │
│  ・resolve() フック                      │
│                                         │
│  ┌───────────────────────────────────┐  │
│  │ CommonJSハンドリング               │  │
│  │ ・format: 'commonjs' + source有   │  │
│  │ ・sourceを直接実行                │  │
│  │ ・ESM Loader提供のrequire()使用   │  │
│  │ ・CJS APIの一部のみ利用可能       │  │
│  └───────────────────────────────────┘  │
│                                         │
│  ↓ format: 'commonjs' + source無し     │
│                                         │
├─────────────────────────────────────────┤
│  CJS Loader (Legacy)                    │
│  ・require() の実装                      │
│  ・Module._extensions でフック可能       │
│  ・esbuild-registerがここにフック       │
└─────────────────────────────────────────┘
```

# 起きていたこと

dockerfの起動に失敗する

```Shell
docker run --rm test-image npm run test:storybook:ci

> birdcage@0.1.0 test:storybook:ci
> NODE_ENV=test ENV=test vitest run --project=storybook --reporter=default --reporter=junit --outputFile.junit=test-results-storybook.xml

SB_CORE-SERVER_0007 (MainFileEvaluationError): Storybook couldn't evaluate your .storybook/main.ts file.

Original error:
ReferenceError: require is not defined in ES module scope, you can use import instead
    at file:///.storybook/main.ts:1:46
    at ModuleJobSync.runSync (node:internal/modules/esm/module_job:458:37)
    at ModuleLoader.importSyncForRequire (node:internal/modules/esm/loader:435:47)
    at loadESMFromCJS (node:internal/modules/cjs/loader:1537:24)
    at Module._compile (node:internal/modules/cjs/loader:1688:5)
    at Module._compile (/node_modules/esbuild-register/dist/node.js:2258:26)
    at node:internal/modules/cjs/loader:1839:10
    at Object.newLoader [as .ts] (/node_modules/esbuild-register/dist/node.js:2262:9)
    at Module.load (node:internal/modules/cjs/loader:1441:32)
    at Function._load (node:internal/modules/cjs/loader:1263:12)
```

playwrightのイメージをつかいながら　

v22.20.0だと発生した。

```Shell
# =========== testerステージ（UIテスト専用・CI専用） ===========
# NOTE: depsステージでnpm@11.4.2を使用してnode_modulesをインストール済み。
#       testerステージではインストール済みのnode_modulesを再利用するため、baseイメージのnpmで問題ない
FROM mcr.microsoft.com/playwright:v1.56.1-noble AS tester

WORKDIR /opt/birdcage

# node_modulesを再利用
COPY --from=deps /opt/birdcage/node_modules ./node_modules
COPY . .

ENV NODE_ENV=test
ENV ENV=test

# デフォルトでStorybookテストを実行
CMD ["npm", "run", "test:storybook:ci"]
```

## 🔍 スタックトレースが語る真実

```Plain
file:///.storybook/main.ts:1:46
   ↑ ★ file:// = ESMとして読み込まれた証拠

ModuleLoader.importSyncForRequire
   ↑ ★ require()からESMを読み込もうとしている

loadESMFromCJS
   ↑ ★ CommonJSからESMをロード（これが異常）
```

### 1. Storybookを起動する(内部でcommonJS依存がある。)

### 3. Node.jsがファイル形式を判定

- package.json に "type": "module" がある

- 拡張子は .ts (not .cjs)  
    → .storybook/main.ts は ESM として扱うべき

### 4. require() から ESM を読み込む特別な処理  
importSyncForRequire() が起動

[

node/lib/internal/modules/esm/loader.js at main · nodejs/node

Node.js JavaScript runtime ✨🐢🚀✨. Contribute to nodejs/node development by creating an account on GitHub.

![](JavaScript/Node/content/Attachments/fluidicon.png)https://github.com/nodejs/node/blob/main/lib/internal/modules/esm/loader.js#L300

![](JavaScript/Node/content/Attachments/node.png)](https://github.com/nodejs/node/blob/main/lib/internal/modules/esm/loader.js#L300)

### 5. ESM Loader が起動

### 6. esbuild-register の load() がフックされる  
⚠️ 問題: トランスパイルせずに生のソース（TypeScript + ESM構文）を返す

```Mermaid
{ format: 'commonjs', source: <生のTypeScript + import文> }
```

### 8. Node.jsに返される:

### 9. Node.js 20.6+ の新機能を検出:

format === 'commonjs' && source !== undefined

### 10. CommonJS互換層 (新機能) が起動　sourceを直接評価

### 11. 生のソース（TypeScript + `import`文）  
かつ、commonJSのコードを含む状態で、ESMモジュール用のloader空間で実行される

## 📚 参考資料

### ✅ 必読資料

1. **uhyo氏によるZenn記事** (2023年8月)
    
    - [機能が無いことに依存していた例 esbuild-register編](https://zenn.dev/uhyo/articles/esbuild-register-node-20-6)
    
    - Node.js 20.6.0の変更点と影響を詳細に解説
    

2. **Node.js公式プルリクエスト**
    
    - [#47999 - module: add support for CommonJS in load hook](https://github.com/nodejs/node/pull/47999)
    
    - 実際の実装変更内容 CommonJS互換層の実装
    

3. **Storybook公式イシュー**
    
    - [#31415 - Node.js v24 - ReferenceError: require is not defined](https://github.com/storybookjs/storybook/issues/31415) [GitHub](https://github.com/storybookjs/storybook/issues/31415)
    
    - Node.js 24でも同様の問題が報告されている
    

### ⚠️ 関連情報

1. **esbuild-register GitHub**
    
    - [npm package - esbuild-register](https://www.npmjs.com/package/esbuild-register) [npm](https://www.npmjs.com/package/esbuild-register)
    
    - `"type": "module"`使用時の注意点
    

2. **Node.js公式ドキュメント**
    
    - [ESM Loader Hooks](https://nodejs.org/api/esm.html#loaders)
    
    - `source`の扱いに関する今後の方針
    

## ソースコード

https://github.com/nodejs/node/blob/v22.20.0/lib/internal/modules/esm/module_job.js#L458

https://github.com/nodejs/node/blob/v22.20.0/lib/internal/modules/esm/loader.js#L359

https://github.com/nodejs/node/blob/main/lib/internal/modules/cjs/loader.js#L1517

## ✅ 解決策

### **現在の対応 (Storybook 9系)**

✅ `**.storybook/main.cjs**`**に変更** (CommonJS形式)

これはStorybook 9系における**業界標準の対応方法**です:

- ✅ Node.js 20.6+, 23で動作確認済み

- ✅ Storybook公式も暗黙的に推奨(v10移行ガイドでCJS→ESM変更を言及)

- ✅ 既存のCommonJSローダーを使用するため安定

```Shell
// .storybook/main.cjs
const path = require('path');
const { mergeConfig } = require('vite');

const config = {
  // ... 設定
};

module.exports = config;
```