---
tags:
  - javascript
  - typescript
  - validation
  - schema
  - zod
created: 2026-02-24
updated_at: 2026-02-24
status: active
---

# Zod

TypeScript-first なスキーマバリデーションライブラリ。型安全なバリデーションとパースを提供する。

> **Note**: このドキュメントは Zod v4 ベースです。v3 からの主な変更点:
>
> - `ZodIssueCode` enum は廃止（文字列リテラルを直接使用）
> - `errorMap` パラメータは `error` に統一
> - `z.setErrorMap()` は `z.config()` に変更
> - 国際化対応が強化（`z.locales` から各言語を読み込み可能）

## 基本的な使い方

### インストール

```bash
npm install zod
```

#### Zod vs Zod Mini

- **`zod`**: フル機能版（英語ロケールを自動読み込み）
- **`zod/mini`**: 軽量版（ロケールなし、エラーメッセージはデフォルトで `"Invalid input"`）

### スキーマの定義とバリデーション

```typescript
import { z } from "zod";

const UserSchema = z.object({
  name: z.string(),
  age: z.number().min(0),
  email: z.string().email(),
});

type User = z.infer<typeof UserSchema>;

const result = UserSchema.safeParse({
  name: "John",
  age: 30,
  email: "john@example.com",
});

if (result.success) {
  console.log(result.data);
} else {
  console.log(result.error);
}
```

### parse と safeParse

```typescript
// parse: エラー時に例外をスロー
const user = UserSchema.parse(data); // throws ZodError

// safeParse: エラー時も安全（推奨）
const result = UserSchema.safeParse(data);
if (!result.success) {
  // result.error で ZodError にアクセス
}
```

## よく使うスキーマ型

### プリミティブ型

```typescript
z.string();
z.number();
z.boolean();
z.bigint();
z.date();
z.undefined();
z.null();
z.any(); // 型安全性を失う
z.unknown();
z.void();
```

### 文字列のバリデーション

| メソッド                | 説明               |
| ----------------------- | ------------------ |
| `.min(5)`               | 最小文字数         |
| `.max(100)`             | 最大文字数         |
| `.length(10)`           | 正確な文字数       |
| `.email()`              | メールアドレス形式 |
| `.url()`                | URL 形式           |
| `.uuid()`               | UUID 形式          |
| `.regex(/^[A-Z]+$/)`    | 正規表現           |
| `.startsWith("prefix")` | 接頭辞チェック     |
| `.endsWith("suffix")`   | 接尾辞チェック     |
| `.trim()`               | 前後の空白を削除   |
| `.toLowerCase()`        | 小文字に変換       |
| `.toUpperCase()`        | 大文字に変換       |

### 数値のバリデーション

| メソッド         | 説明                      |
| ---------------- | ------------------------- |
| `.min(0)`        | 最小値                    |
| `.max(100)`      | 最大値                    |
| `.int()`         | 整数のみ                  |
| `.positive()`    | 正の数                    |
| `.nonnegative()` | 0 以上                    |
| `.negative()`    | 負の数                    |
| `.nonpositive()` | 0 以下                    |
| `.finite()`      | 有限数（Infinity を除外） |

### 配列とオブジェクト

```typescript
// 配列
z.array(z.string());
z.array(z.number()).min(1).max(10);
z.array(z.number()).nonempty();

// オブジェクト
z.object({ name: z.string(), age: z.number() });
z.object({ age: z.number().optional() }); // age?: number
z.object({ name: z.string().nullable() }); // name: string | null
```

### Union と Enum

```typescript
// Union
z.union([z.string(), z.number()]);
z.string().or(z.number());

// Enum
z.enum(["apple", "banana", "orange"]); // "apple" | "banana" | "orange"
z.nativeEnum(MyEnum); // ネイティブ enum を使用
```

### その他の便利な型

```typescript
z.literal("hello"); // リテラル型
z.record(z.string(), z.number()); // Record<string, number>
z.tuple([z.string(), z.number()]); // [string, number]
z.discriminatedUnion("type", [
  // 判別可能な Union
  z.object({ type: z.literal("a"), a: z.string() }),
  z.object({ type: z.literal("b"), b: z.number() }),
]);
```

## オプショナルとデフォルト値

```typescript
z.string().optional(); // string | undefined
z.string().nullable(); // string | null
z.string().nullish(); // string | null | undefined
z.string().default("default");
z.date().default(() => new Date());
```

## エラーハンドリング

### エラー情報の取得

```typescript
const result = UserSchema.safeParse(invalidData);

if (!result.success) {
  result.error.issues; // 全エラー情報
  result.error.format(); // フォーマット済み
  result.error.flatten(); // フラットなエラーメッセージ
}
```

### エラーメッセージのカスタマイズ

公式ドキュメント: [Error Customization](https://zod.dev/error-customization)

````typescript
// 個別フィールド
z.string("名前は文字列で入力してください")
z.number().min(0, "年齢は0以上である必要があります")
z.string({ error: (iss) => iss.input === undefined ? "必須項目です" : "無効な入力です" })

// パース時に指定
schema.safeParse(data, {
  error: (iss) => iss.code === "invalid_type" ? `型エラー: ${iss.expected}` : undefined
})

// グローバル設定 (v4)
z.config({
  customError: (iss) => {
    if (iss.code === "invalid_type") return `型エラー: ${iss.expected}`;
    if (iss.code === "too_small") return `最小: ${iss.minimum}`;
    return undefined; // デフォルトにフォールバック
  }
});

#### エラーコード一覧

Zod v4 では文字列リテラルを直接使用（`ZodIssueCode` enum は廃止）。

- `"invalid_type"`: 型が不正
- `"too_small"`: 最小値/最小文字数を下回る
- `"too_big"`: 最大値/最大文字数を上回る
- `"invalid_string"`: 文字列バリデーション失敗（email, url など）
- `"invalid_enum_value"`: enum の値が不正
- `"unrecognized_keys"`: 予期しないキーが存在
- `"invalid_union"`: union の全ての型にマッチしない
- `"invalid_literal"`: リテラル値が不正
- `"custom"`: カスタムバリデーションエラー

#### 国際化対応（i18n）

```typescript
// 日本語ロケール
z.config(z.locales.ja())

// 動的に読み込む
const { default: locale } = await import(`zod/v4/locales/ja.js`);
z.config(locale());
````

## スキーマの変換（Transform）

```typescript
z.string().transform((val) => parseInt(val));
z.string().transform((str) => new Date(str));
z.preprocess(
  (val) => (typeof val === "string" ? parseInt(val) : val),
  z.number()
);
```

## スキーマの合成

```typescript
BaseUser.merge(DetailUser); // 2つのオブジェクトスキーマを結合
BaseUser.extend({ email: z.string() }); // スキーマを拡張
FullUser.pick({ name: true }); // プロパティを選択
FullUser.omit({ age: true }); // プロパティを除外
FullUser.partial(); // 全てオプショナルに
PartialUser.required(); // 全て必須に
```

## バリデーションのカスタマイズ

```typescript
// refine: カスタムバリデーション
z.string().refine(
  (val) => val.length >= 8 && /[A-Z]/.test(val),
  "パスワードは8文字以上で大文字を含む必要があります"
);

// superRefine: 複数フィールドを跨いだバリデーション
z.object({ password: z.string(), confirmPassword: z.string() }).superRefine(
  (data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: "custom",
        message: "パスワードが一致しません",
        path: ["confirmPassword"],
      });
    }
  }
);
```

## React Hook Form との連携

```typescript
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const FormSchema = z.object({
  username: z.string().min(3, "3文字以上入力してください"),
  email: z.string().email("有効なメールアドレスを入力してください"),
});

type FormData = z.infer<typeof FormSchema>;

function MyForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(FormSchema),
  });

  return (
    <form onSubmit={handleSubmit(data => console.log(data))}>
      <input {...register("username")} />
      {errors.username && <span>{errors.username.message}</span>}
      <button type="submit">送信</button>
    </form>
  );
}
```

## 参考

- [Zod 公式ドキュメント](https://zod.dev/)
- [Error Customization](https://zod.dev/error-customization)
- [@hookform/resolvers](https://github.com/react-hook-form/resolvers)
