---
tags:
  - Playwright
  - E2E
  - testing
  - e2e
  - playwright
created: 2026-01-30
status: active
---

# Playwright 入門

[Playwright](https://playwright.dev/) は Microsoft が開発するブラウザ自動化・E2E テストツール。Chromium / Firefox / WebKit を単一の API で扱える。

---

## 1. インストール

### 最小構成（package.json は最低限）

依存は `@playwright/test` のみでよい。ブラウザバイナリは後述の `npx playwright install` で入れる。

```json
{
  "name": "my-playwright-project",
  "devDependencies": {
    "@playwright/test": "^1.49.0"
  }
}
```

```bash
npm install
```

### ブラウザのインストール（docs として残す手順）

パッケージを入れたあと、**ブラウザバイナリ**を別途インストールする。

```bash
npx playwright install
```

- 全ブラウザ（Chromium, Firefox, WebKit）をインストールする標準のやり方。
- 特定だけ入れる例: `npx playwright install chromium`
- CI などでシステム依存も入れる: `npx playwright install --with-deps`

※ 新規プロジェクトなら `npm init playwright@latest` で対話的にセットアップすることもできる。

---

## 2. テストの実行方法

cf. [Running tests | Playwright Docs](https://playwright.dev/docs/running-tests)

### 基本

```bash
npx playwright test
```

### おすすめ: UI モード

**普段の開発・確認には UI モードがおすすめ。**

```bash
npx playwright test --ui
```

- テスト一覧の閲覧・フィルタ
- ステップごとのスナップショット・タイムライン
- Locator の確認や Watch モード
- 失敗時の原因確認がしやすい

### 詳細にデバッグするとき

ブレークポイントを置いたり、1 ステップずつ実行したいときは **Debug モード**を使う。

```bash
npx playwright test --debug
```

- Playwright Inspector が開き、`--headed`・1 ワーカー・タイムアウト無効などが自動で設定される。
- ステップ実行・要素の検証・Locator の試し書きに便利。

その他オプションは `npx playwright test --help` で確認できる。

---

## 3. Locator API で要素を特定する

cf. [Locators | Playwright Docs](https://playwright.dev/docs/locators)

ページ内の要素は **Locator** で取得する。Locator は「いつか DOM に現れる要素」を表し、**自動待機・リトライ**が組み込まれている。

### 推奨: ユーザー目線の Locator

実装（クラス名や DOM 構造）より、**ユーザーや支援技術から見た振る舞い**で指定すると安定しやすい。

| API | 用途 |
| --- | --- |
| `getByRole()` | アクセシブルなロール＋名前（ボタン・見出し・リンクなど） |
| `getByText()` | 表示テキスト |
| `getByLabel()` | フォームのラベル |
| `getByPlaceholder()` | プレースホルダー |
| `getByAltText()` | 画像の代替テキスト |
| `getByTitle()` | `title` 属性 |
| `getByTestId()` | `data-testid`（実装に依存するが安定させたいとき） |

### 使用例

```ts
// ロール＋アクセシブル名（おすすめ）
await page.getByRole('button', { name: 'サインイン' }).click();
await expect(page.getByRole('heading', { name: 'ダッシュボード' })).toBeVisible();

// テキスト
await expect(page.getByText('ようこそ、田中さん')).toBeVisible();

// フォーム
await page.getByLabel('メールアドレス').fill('user@example.com');
await page.getByPlaceholder('パスワードを入力').fill('secret');
```

### ポイント

- **`getByRole(role, { name })`** を優先すると、アクセシビリティとテストの両方に良い。
- Locator は `page`、`locator`、`frameLocator` から使え、チェーンできる。
- CSS や XPath が必要なときは [Other locators](https://playwright.dev/docs/other-locators) を参照。

---

## 参考リンク

- [Playwright 公式ドキュメント](https://playwright.dev/docs/intro)
- [Running tests](https://playwright.dev/docs/running-tests)
- [Locators](https://playwright.dev/docs/locators)
- [Debugging tests](https://playwright.dev/docs/debug)
- [UI Mode](https://playwright.dev/docs/test-ui-mode)
