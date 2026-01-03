---
tags:
  - rails
created: 2026-01-03
status: active
---

🧫

# 続)React-Bootstrapの導入

---

# 経緯

既存のアプリをBootstrapでスタイリングしていたので、スタイルを統合する意味でも、素のブートストラップのclassnameを付与するより、React-Bootstrapのコンポーネントを用意する方が容易に、コンポーネントを作成できると考えた。

(*React on Railsの状態で、ChakraUIはなぜか動作しなかったため、妥協案としてこちらを採用した。)

# 導入

[公式](https://react-bootstrap.github.io/getting-started/introduction)を参照して、

```Bash
$ npm install react-bootstrap bootstrap
#yarnを使っているなら
$ yarn add react-bootstrap bootstrap
```

# Import First Components

library全体ではなく、特定のコンポーネント別にimportすること

```JavaScript
e.g.)
import Button from 'react-bootstrap/Button';

// or less ideally
import { Button } from 'react-bootstrap';
```

react-bootstrapを使うと、よりReactコンポーネント的に、bootstrapを使用できるが、ただのCSSスタイリングフレームワークとして、bootstrapを導入することもできる。