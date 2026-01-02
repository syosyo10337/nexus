 

# [birpc] rpc is closed, cannot call "onCancel"  

[起因 vitest v4に上げたことによるもの](#2b038cdd-027d-8019-b325-e3be4e0c4f1a)

[**💡 今後のアクション案**](#2b038cdd-027d-8063-b5a6-f9cb1462c252)

[**🐛 今回のエラーの根本原因**](#2b038cdd-027d-80ba-85cc-f14474a6f7c3)

[**問題の本質**](#2b038cdd-027d-80a3-9a29-e74728f1d264)

storybookのUI上でinteractionテストを実行すると、再実行時にエラーになる

# 起因 vitest v4に上げたことによるもの

poolの機構が切り替わったことによりSB上では、`isolate:false` が明示的に必要になる。

[

Vitest

Next generation testing framework powered by Vite

![](Storybook/Attachments/apple-touch-icon.png)https://vitest.dev/guide/migration.html#pool-rework

![](Storybook/Attachments/og.png)](https://vitest.dev/guide/migration.html#pool-rework)

[

Vitest

Next generation testing framework powered by Vite

![](Storybook/Attachments/apple-touch-icon.png)https://vitest.dev/config/isolate.html

![](Storybook/Attachments/og.png)](https://vitest.dev/config/isolate.html)

```Shell
Error

Failed to run tests

[birpc] rpc is closed, cannot call "onCancel"

Error: 
    at _call (file:///opt/birdcage/node_modules/@vitest/browser/dist/index.js:2694:13)
    at Proxy.sendEvent (file:///opt/birdcage/node_modules/@vitest/browser/dist/index.js:2770:38)
    at file:///opt/birdcage/node_modules/@vitest/browser/dist/index.js:3167:35
    at file:///opt/birdcage/node_modules/vitest/dist/chunks/cli-api.RnIE1JbW.js:11692:83
    at Array.map (<anonymous>)
    at Vitest.cancelCurrentRun (file:///opt/birdcage/node_modules/vitest/dist/chunks/cli-api.RnIE1JbW.js:11692:65)
    at VitestManager.cancelCurrentRun (file:///opt/birdcage/node_modules/@storybook/addon-vitest/dist/node/vitest.js:482:24)
    at VitestManager.runTests (file:///opt/birdcage/node_modules/@storybook/addon-vitest/dist/node/vitest.js:438:16)
    at process.processTicksAndRejections (node:internal/process/task_queues:103:5)
    at async callback (file:///opt/birdcage/node_modules/@storybook/addon-vitest/dist/node/vitest.js:724:11)



Troubleshoot: https://storybook.js.org/docs/writing-tests/integrations/vitest-addon/?renderer=react#what-happens-if-vitest-itself-has-an-errorg
```

## **💡 今後のアクション案**

**Option 1: Issueを報告する ✅ 推奨**

この問題は他のユーザーも遭遇する可能性が高いため、報告する価値があります：

**報告先:** storybookjs/storybook

**推奨タイトル（英語）:**

[addon-vitest] "rpc is closed" error when re-running tests in Storybook UI with browser.isolate: true

**内容に含めるべき情報:**

## Describe the bug

When re-running interaction tests in Storybook UI with `browser.isolate: true`,

it throws `[birpc] rpc is closed, cannot call "onCancel"` error.

## To Reproduce

1. Set `browser.isolate: true` in vitest.config.ts

2. Run interaction test in Storybook UI

3. Click re-run button

4. Error occurs

## Expected behavior

Tests should be able to re-run without errors

## Environment

- @storybook/addon-vitest: 10.0.8

- vitest: 4.0.10

- @vitest/browser: 4.0.10

## Workaround

Setting `browser.isolate: false` resolves the issue

**Option 2: ドキュメントへのコントリビュート**

Storybook Vitest Addonのドキュメントに、browser.isolate: falseを推奨する注意書きを追加するPRを送る

**Option 3: そのまま使用**

isolate: falseで問題なく動作しているなら、そのまま使用して様子を見る

## **🐛 今回のエラーの根本原因**

**エラーフロー詳細**

1. 初回テスト実行

↓

[ブラウザーコンテキストA作成]

↓

[RPCコネクションA確立]

↓

Storybook ←→ Vitest Browser (birpc経由)

↓

テスト完了

↓

[isolate: true のため]

↓

[ブラウザーコンテキストA破棄]

↓

[RPCコネクションA切断] ← ここが重要！

2. 再実行ボタンクリック

↓

VitestManager.runTests() 呼び出し

↓

VitestManager.cancelCurrentRun()

↓

❌ 前のRPCコネクションA（既に閉じている）に

"onCancel"メッセージを送信しようとする

↓

💥 [birpc] rpc is closed, cannot call "onCancel"

# **問題の本質**

**Storybook Vitest Addonの内部実装の問題**です：

1. isolate: trueでブラウザーコンテキストを破棄すると、RPCコネクションも閉じられる

2. しかし、VitestManagerは**古いRPCコネクション参照を保持**している

3. 再実行時に新しいコンテキストを作成する前に、古いコネクションにキャンセルメッセージを送ろうとする

4. 既に閉じたコネクションへの通信でエラー

**なぜisolate: falseで解決するのか？**

[ブラウザーコンテキスト作成]

↓

[RPCコネクション確立]

↓

1回目のテスト実行

↓

[コンテキストとRPCは維持される] ← ここがポイント！

↓

2回目のテスト実行

↓

[同じRPCコネクションを使用]

↓

✅ cancelCurrentRun()が正常に動作

RPCコネクションが常に有効な状態で維持されるため、再実行時のキャンセル処理が正常に機能します。