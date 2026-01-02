 

# Discriminated Union

```TypeScript
type ProgramFormModalProps = 
  | {
      mode: 'create'
      program?: undefined  // より明確に
      action: typeof createEventProgramAction
      onCancel?: () => void
    }
  | {
      mode: 'edit'
      program: EventProgram
      action: typeof updateEventProgramAction
      onCancel?: () => void
    }

// 使用例
const ProgramFormModal: React.FC<ProgramFormModalProps> = (props) => {
  if (props.mode === 'create') {
    // props.program は undefined として型推論される
    // props.action は createEventProgramAction として型推論される
  } else {
    // props.program は EventProgram として型推論される
    // props.action は updateEventProgramAction として型推論される
  }
}
```

## Discriminated Unionが特に有効な場面：

1. **互いに排他的な状態を表現したい時**
    
    - ローディング中は data がない
    
    - 成功時は error がない
    

2. **型安全性を最大化したい時**
    
    - コンパイル時に不正なプロパティアクセスを防げる
    

3. **switch文やif文での分岐が自然な時**
    
    - 判別子（discriminator）で簡潔に分岐できる
    

4. **将来の拡張を考慮したい時**
    
    - 新しいケースを追加しても既存コードが型エラーで保護される
    

5. **複雑なオプションオブジェクトを型安全にしたい時**
    
    - 設定の組み合わせが決まっている場合
    

逆に、**単純にオプショナルなプロパティがあるだけ**の場合は、通常のinterface/typeで十分です。判別が必要で、状態によってプロパティの有無が明確に分かれる場合にDiscriminated Unionの真価が発揮されます。