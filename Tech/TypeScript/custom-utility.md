---
tags:
  - typescript
  - utility-types
  - type-system
  - custom-types
created: 2026-01-23
status: active
---

# PartialToUndefined

オプショナルプロパティを明示的な `undefined` を許可する形に変換するユーティリティ型。

`exactOptionalPropertyTypes: true` の環境で、プロパティドリリング（バケツリレー）を行う際に、オプショナルプロパティを `undefined` として明示的に扱う必要がある場合に使用します。

このユーティリティを使用することで、以下のような条件付きスプレッド演算子の記述を回避できます：

```typescript
// 回避したい冗長な記述
<Component
  {...(props.value && { value: props.value })}
  {...(props.onChange && { onChange: props.onChange })}
/>
```

## 使用例

```typescript
// 元の型（オプショナルプロパティ）
interface Config {
  apiKey?: string;
  timeout?: number;
}

// 変換後（undefined を明示的に許可）
type ExplicitConfig = PartialToUndefined<Config>;
// Result: {
//   apiKey: string | undefined
//   timeout: number | undefined
// }
```

## 実装

```typescript
export type PartialToUndefined<T> = {
  [K in keyof T]-?: T[K] | undefined;
};
```

### `-?` の意味

`-?` は TypeScript の**マッピング修飾子（Mapping Modifiers）**の一つで、オプショナル修飾子（`?`）を**削除**する構文です。

- `-?`: オプショナル修飾子を削除（必須プロパティにする）
- `-readonly`: `readonly` 修飾子を削除
- `+?` または `?`: オプショナル修飾子を追加（デフォルト）
- `+readonly` または `readonly`: `readonly` 修飾子を追加（デフォルト）

#### 動作の詳細

```typescript
// 元の型
interface Config {
  apiKey?: string; // オプショナルプロパティ
  timeout?: number; // オプショナルプロパティ
}

// [K in keyof T]-? の処理
// 1. keyof T で全てのキーを取得: "apiKey" | "timeout"
// 2. -? でオプショナル修飾子を削除（必須プロパティに変換）
// 3. T[K] | undefined で型を string | undefined に変換

// 結果
type ExplicitConfig = {
  apiKey: string | undefined; // 必須プロパティ（undefined を明示的に許可）
  timeout: number | undefined; // 必須プロパティ（undefined を明示的に許可）
};
```

#### なぜ `-?` が必要か

オプショナルプロパティ（`apiKey?: string`）と、`undefined` を明示的に許可する必須プロパティ（`apiKey: string | undefined`）は、`exactOptionalPropertyTypes: true` の環境では**異なる型**として扱われます。

- `apiKey?: string`: プロパティ自体が存在しない可能性がある
- `apiKey: string | undefined`: プロパティは必ず存在するが、値が `undefined` の可能性がある

`-?` を使うことで、オプショナル修飾子を削除し、`undefined` を明示的に許可する必須プロパティに変換できます。
