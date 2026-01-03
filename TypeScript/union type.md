 

# union type

配列要素にユニオン型を使う時の注意

```TypeScript
type List = (string | number)[];
```

型の絞り込み、narrowingをする時。

```TypeScript
const maybeUserId: string | null = localStorage.getItem("userId");
 
const userId: string = maybeUserId; // nullかもしれないので、代入できない。
 
if (typeof maybeUserId === "string") {
  const userId: string = maybeUserId; // この分岐内では文字列型に絞り込まれるため、代入できる。
}
```

# **判別可能なユニオン型 (discriminated union)**

タグ付きユニオン(tagged union)や直和型と呼ぶこともあります。

1. オブジェクトの型で構成されたユニオン型

2. 各オブジェクトの型を判別するためのプロパティ(しるし)を持つ
    
    - このプロパティのことをディスクリミネータ(discriminator)と呼ぶ
    

3. ディスクリミネータの型は[リテラル型](https://typescriptbook.jp/reference/values-types-variables/literal-types)などであること

4. ディスクリミネータさえ有れば、各オブジェクトの型は固有のプロパティを持ってもよい

e.g.

```TypeScript
type UploadStatus = InProgress | Success | Failure;
type InProgress = { type: "InProgress"; progress: number };
type Success = { type: "Success" };
type Failure = { type: "Failure"; error: Error };
```