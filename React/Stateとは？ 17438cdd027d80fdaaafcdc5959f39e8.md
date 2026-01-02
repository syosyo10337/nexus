 

# Stateとは？

もし、画面が再renderされるような場合にも、何かしらの値を保持していたい時に、保持できる性質を広義に"状態を持つ(stateful)"を言う。

- Reactにおいて、stateは==**コンポーネント**==単位に保持、更新される。

以下の様に書いても　動かないのはなぜ？？

onChangeの関数は実行されるが、コンポーネントの関数自体が再実行されていないよね

```TypeScript
e.g.)
import { useState } from "react";

const Example = () => {
  let displayVal;
  return (
    <>
      <input
        type="text"
        onChange={(e) => {
          console.log(e.target.value);
          displayVal = e.target.value;
        }}
      />
      = {displayVal}
    </>
  );
};

export default Example;
```