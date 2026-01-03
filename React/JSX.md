---
tags:
  - react
  - component
created: 2026-01-03
status: active
---

# JSX

厳密には, `React.JSX.Element`型のオブジェクトであるので、変数への代入などをすることができます。**これらのオブジェクトは仮想DOMと呼ばれている。**

🔥

**JSX --> JS function(createElement) by Babel -> JS object(仮想DOM（visual DOM）/React要素)**

## この時、HTMLライクなJSXの記法がどのようにして、JSのオブジェクトに変換されるか？

babel(トランスパイラー）を使っている。React.createElementを呼び出すことでが実際の正体らしい。

[https://babeljs.io/repl#?browsers=defaults%2C%20not%20ie%2011%2C%20not%20ie_mob%2011&build=&builtIns=false&corejs=3.21&spec=false&loose=false&code_lz=DwEwlgbgfAUABAxTgAsCMUASBTANrgewEJgB6dWJKuVAJigHECCQ4AXAuAZ22zgE8CAVwB0ZFPXhUy4aEA&debug=false&forceAllTransforms=false&modules=false&shippedProposals=false&evaluate=false&fileSize=false&timeTravel=false&sourceType=module&lineWrap=true&presets=env%2Creact&prettier=false&targets=&version=7.18.3&externalPlugins=&assumptions=%7B%7D](https://babeljs.io/repl#?browsers=defaults%2C%20not%20ie%2011%2C%20not%20ie_mob%2011&build=&builtIns=false&corejs=3.21&spec=false&loose=false&code_lz=DwEwlgbgfAUABAxTgAsCMUASBTANrgewEJgB6dWJKuVAJigHECCQ4AXAuAZ22zgE8CAVwB0ZFPXhUy4aEA&debug=false&forceAllTransforms=false&modules=false&shippedProposals=false&evaluate=false&fileSize=false&timeTravel=false&sourceType=module&lineWrap=true&presets=env%2Creact&prettier=false&targets=&version=7.18.3&externalPlugins=&assumptions=%7B%7D)

これらのReact要素(react Element )オブジェクトを以下のようにして、マウントすることができます。

```TypeScript
<body>
	<div id="app"></div>
</body>

const element = <h1>Hello!</h1> //JSX
//ルートを作成
const root = ReactDOM.createRoot(document.getElementById('app'));
//renderメソッドでJSXをマウントする。
root.render(element)

```

# Fragment

<> key属性はつけることができる。

# {}の理解

この中にはJSの値を指定することができる。

この時仮に配列を指定すると、勝手に展開してくれるよ。

```TypeScript
      <p>{array.join("")}</p>
      <p>{array)}</p>　//これでいいらしい。
```