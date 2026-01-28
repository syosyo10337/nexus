---
tags:
  - oop
  - ddd
  - tidy-first
created: 2026-01-29
status: active
---

# Value Object (値オブジェクト)

Value Object（値オブジェクト）とは、そのアイデンティティ（識別子）ではなく、保持している「値」そのものによって等価性が定義される不変（Immutable）なオブジェクトです。

## Barrier Object (バリアオブジェクト) とは

Value Objectは、プログラムにおいて**「バリア（障壁）」**としての役割を果たします。これは主に『Tidy First?』（Kent Beck著）などの文脈で語られる概念で、不適切なデータや複雑さがシステムの他の部分に拡散するのを防ぐ設計パターンを指します。

### バリアとしての主な役割

1. **不正な値の進入防止 (Guard)**
    コンストラクタでバリデーションを強制することで、ドメインルールに違反した値（例：負の金額、不正な形式のメールアドレス）がシステム内部に存在することを許しません。これにより、後続の処理では「その値が正しいこと」を前提にコードを書くことができます。

2. **型安全性の確保 (Type Safety)**
    単なる `string` や `int`（プリミティブ型）ではなく、`EmailAddress` や `Money` といった固有の型を与えることで、意味の異なる値を混同するミスをコンパイルタイム（または静的解析）で防ぎます。

3. **複雑さの隔離 (Encapsulation)**
    外部システムから受け取った「扱いにくいデータ構造」や「生の値」を Value Object で包み込むことで、その複雑な変換ロジックや検証ロジックをオブジェクト内部に閉じ込めます。システムの他の部分は、この「バリア」を通過したクリーンなオブジェクトのみを扱います。

4. **不変性の保証 (Immutability)**
    一度生成されたバリアオブジェクトは状態を変えないため、予期せぬ場所で値が書き換えられる副作用の連鎖を断ち切ります。

## 実装例 (Conceptual)

```typescript
// プリミティブな値（messy world）を Value Object（barrier）で保護する例
class EmailAddress {
  private readonly value: string;

  constructor(value: string) {
    // バリア：不正な形式の進入を阻止
    if (!this.isValidEmail(value)) {
      throw new Error("Invalid email format.");
    }
    this.value = value;
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  public toString(): string {
    return this.value;
  }

  public equals(other: EmailAddress): boolean {
    return this.value === other.value;
  }
}
```

このように、Value Object をバリアとして配置することで、コードの堅牢性と可読性を向上させることができます。
