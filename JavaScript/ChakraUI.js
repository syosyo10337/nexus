# ChakraUI
1. npm installとかで導入する
2. import { ChakraProvider } from "@chakra-ui/react"; 

3. ChakraProviderコンポーネントでコンポーネントを適用したい範囲を囲む
e.g.)

<ChakraProvider>
	<Todo />
</ChakraProvider>



## {Chakraのコンポーネント}
### {Box}
最も抽象的なコンポーネント
- デフォルトでは<div>タグになる。
- as propsを使うことで、他のHTML要素にもなる
- 囲まれた要素はレスポンシブになる
- bgなどのプロップスを用いることで、スタイルを適用できる。

## { CheckboxGroup }
これは子要素となるcheckboxのステイト管理に良い。
defaultValueプロップスを活用すると、該当するCheckboxがisChecked状態となる。

### { Checkbox }
Boxではなく、boxなところは注意。bootstrap的に
使える。

### { Text }
p要素を作成する。
- fontsize フォントサイズを調整できる。


### { Center }
子要素を取ることができ、高さと幅(h,w)プロップスをとりながら、子要素を中央揃えで配置する。


### { Flex }
display: flexを持ったBoxを作成する。デフォルトでは<div>タグになる。 
//display:flexを持った要素の子要素はデフォルトだと横並びになるflexアイテムとなる。

### { Input }
text_fieldを持ったインプット要素を配置する。
入力欄の大きさをsizeプロップスで変更できたり、htmlsizeとwidth: autoを併用することで、横幅も変更できる。


### { Button }
ButtonGroupと併用されることもある。
Buttonコンポーネントは基本的にはbutton要素を作る。

- { VStack }
vertical stack
縦並びのコンポーネントを設定する。
- { StackDivider }


- { HStack }
horizontal stack 
