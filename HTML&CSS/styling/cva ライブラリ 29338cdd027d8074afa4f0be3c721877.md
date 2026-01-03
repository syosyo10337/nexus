 

# cva ライブラリ

```TypeScript
import { cva } from "class-variance-authority";

const componentStyles = cva(
  // 第1引数: ベースクラス（全variantで共通のクラス）
  "base-classes-here",
  
  // 第2引数: オプション設定オブジェクト
  {
    variants: {
      // variant定義
    },
    compoundVariants: [
      // 複合variant定義
    ],
    defaultVariants: {
      // デフォルト値
    },
  }
);
```

自動で型定義まで生成してくれる

```Go
import { cva, type VariantProps } from "class-variance-authority";

const button = cva("base", {
  variants: {
    intent: {
      primary: "bg-blue-500",
      secondary: "bg-gray-200",
    },
    size: {
      small: "text-sm",
      large: "text-lg",
    },
  },
});

// :チェックマーク_緑: VariantPropsで型を自動生成
type ButtonProps = VariantProps<typeof button>;
// 生成される型:
// {
//   intent?: "primary" | "secondary";
//   size?: "small" | "large";
// }

// Reactコンポーネントでの使用
type ButtonComponentProps = React.ComponentProps<"button"> & ButtonProps;

function Button({ intent, size, className, ...props }: ButtonComponentProps) {
  return (
    <button 
      className={button({ intent, size, className })} 
      {...props} 
    />
  );
}
```