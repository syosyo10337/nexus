---
tags:
  - react
  - hooks
  - component
  - state
created: 2026-01-03
status: active
---

# **条件付きオブジェクトスプレッド（Conditional Object Spread）**

**基本的な仕組み**

```TypeScript
{...(namePath && { namePath })}

*// 1. namePath が truthy な場合*

namePath = "tickets.0"

namePath && { namePath }  *// → { namePath: "tickets.0" }*

{...{ namePath: "tickets.0" }}  *// → namePath="tickets.0" としてpropsに追加*

*// 2. namePath が falsy な場合*

namePath = undefined

namePath && { namePath }  *// → false (短絡評価)*

{...false}  *// → 何も追加されない*

```

```TypeScript


**他のパターンとの比較**

*// ❌ 問題のあるパターン*

<Component namePath={namePath} />

*// namePathがundefinedでも明示的にpropsとして渡される*

*// → Component側でundefinedを受け取ることになる*

*// ✅ 条件分岐パターン（冗長）*

{namePath ? (

<Component namePath={namePath} />

) : (

<Component />

)}

*// ✅ 条件付きスプレッドパターン（スマート）*

<Component {...(namePath && { namePath })} />

**より複雑な例**

*// 複数の条件付きプロパティ*

<Component

required

{...(error && { error })}

{...(disabled && { disabled })}

{...(placeholder && { placeholder })}

{...(namePath && { namePath })}

/>

*// オブジェクト形式でも使える*

const optionalProps = {

...(namePath && { namePath }),

...(error && { error }),

...(disabled && { disabled })

}

<Component required {...optionalProps} />

**異なる条件での例**

*// 条件によって異なるプロパティ名*

<Input

{...(isPassword && { type: 'password' })}

{...(isEmail && { type: 'email' })}

{...(isNumber && { type: 'number' })}

/>

*// 複数のプロパティを一度に*

<FormField

{...(isRequired && {

required: true,

'aria-required': true

})}

{...(hasError && {

error: errorMessage,

'aria-invalid': true

})}

/>
```

```TypeScript

**TypeScript での型安全性**


interface ComponentProps {

required: boolean

namePath?: string  *// optional*

error?: string     *// optional*

}

*// 型安全性が保たれる*

<Component

required

{...(namePath && { namePath })}  *// ✅ 型チェック通る*

{...(error && { error })}        *// ✅ 型チェック通る*

{...(invalid && { invalid })}    *// ❌ 型エラー（invalidはPropsにない）*

/>

**実際の使用例（フォームライブラリ）**

*// react-hook-form での使用例*

<Controller

name="email"

control={control}

{...(rules && { rules })}

{...(defaultValue && { defaultValue })}

render={({ field, fieldState }) => (

<Input

{...field}

{...(fieldState.error && { error: fieldState.error.message })}

{...(placeholder && { placeholder })}

/>

)}

/>

**パフォーマンスへの影響**

*// ❌ 毎回新しいオブジェクトが作成される*

<Component {...(condition && { prop: value })} />

*// ✅ メモ化で最適化（必要に応じて）*

const optionalProps = useMemo(() => ({

...(condition && { prop: value })

}), [condition, value])

<Component {...optionalProps} />
```

## **まとめ**

この条件付きスプレッドパターンは：

1. **簡潔性**: 条件分岐を簡潔に書ける  
1. **型安全性**: TypeScriptの型チェックが効く  
1. **動的性**: 実行時の条件に基づいてpropsを動的に制御  
1. **可読性**: 意図が明確で理解しやすい

1. 1. **簡潔性**: 条件分岐を簡潔に書ける

2. 1. **型安全性**: TypeScriptの型チェックが効く

3. 1. **動的性**: 実行時の条件に基づいてpropsを動的に制御

4. 1. **可読性**: 意図が明確で理解しやすい

特にReactのコンポーネントで、オプショナルなpropsを条件付きで渡したい場合に非常に有用なパターンです！