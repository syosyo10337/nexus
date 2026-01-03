---
tags:
  - rails
  - controller
  - view
  - routing
created: 2026-01-03
status: active
---

# webpackerを使ったRails6.1アプリへのReact18を導入

---

react-rails gemを使うことなく、webpackerの機能だけを用いて、Reactを使えるようにする。

[検証環境](#6d8991aa-27db-439f-bdad-bd780dd7f93c)

[webpackerをつかってReactを使えるようにする。](#fb138daf-33e7-4da7-8602-ada9fd2951bd)

[reactの導入](#f8fa2c0c-5c39-45c2-9f20-f7a59e3b1806)

[`javascript_pack_tag ‘hello_react’`](#fd569d25-0fc9-4aae-8b99-1a3a88c74835)

[コントローラを作成して、Helloコンポーネントがレンダーされるか確認する](#a57d7889-07f8-45f0-b248-961721a24de7)

[問題が残っていた。](#2a07bfcf-ad65-4493-ae0e-86171c2f1d69)

[React18流に、hello_react.jsxを変更する](#5e0a1ab3-e39d-429a-9988-897ef1af4b09)

関連する記事)

[🌋続)React on Rails ChakraUI使えない。](webpacker%E3%82%92%E4%BD%BF%E3%81%A3%E3%81%9FRails6%201%E3%82%A2%E3%83%97%E3%83%AA%E3%81%B8%E3%81%AEReact18%E3%82%92%E5%B0%8E%E5%85%A5/%E7%B6%9A\)React%20on%20Rails%20ChakraUI%E4%BD%BF%E3%81%88%E3%81%AA%E3%81%84%E3%80%82%205800bb42d6674159be9e59c26389a909.html)

[👃続)reactに後からTypeScriptを導入する。](webpacker%E3%82%92%E4%BD%BF%E3%81%A3%E3%81%9FRails6%201%E3%82%A2%E3%83%97%E3%83%AA%E3%81%B8%E3%81%AEReact18%E3%82%92%E5%B0%8E%E5%85%A5/%E7%B6%9A\)react%E3%81%AB%E5%BE%8C%E3%81%8B%E3%82%89TypeScript%E3%82%92%E5%B0%8E%E5%85%A5%E3%81%99%E3%82%8B%E3%80%82%202503758a4c584bd6876fdebafba777c8.html)

[🧫続)React-Bootstrapの導入](webpacker%E3%82%92%E4%BD%BF%E3%81%A3%E3%81%9FRails6%201%E3%82%A2%E3%83%97%E3%83%AA%E3%81%B8%E3%81%AEReact18%E3%82%92%E5%B0%8E%E5%85%A5/%E7%B6%9A\)React-Bootstrap%E3%81%AE%E5%B0%8E%E5%85%A5%2063fd8a067824467687b7790b671e986d.html)

### 検証環境

Ruby 3.0.4

Rails 6.1.7

React 18

参考にした記事)

[

Let's build a CRUD app with Ruby on Rails and React.js - Part 2

![](favicon%2013.ico)https://www.youtube.com/watch?v=F0xErjOtJAQ

![](hqdefault.jpeg)](https://www.youtube.com/watch?v=F0xErjOtJAQ)

上の動画のリポジトリ

[

open-flights/Airline.js at master · zayneio/open-flights

OpenFlights - A CRUD app example built with ruby on rails and react.js using webpacker - open-flights/Airline.js at master · zayneio/open-flights

![](favicon%2014.ico)https://github.com/zayneio/open-flights/blob/master/app/javascript/src/components/Airlines/Airline.js

![](open-flights.png)](https://github.com/zayneio/open-flights/blob/master/app/javascript/src/components/Airlines/Airline.js)

[

How to use React with Ruby on Rails 6 | Learnetto

How to use React with Ruby on Rails 6

![](https://learnetto.com/assets/favicon-55999b11d9ec395613deb4468f5a4409689167aa92c8db5160f805ef1c24d4e8.ico)https://learnetto.com/blog/react-rails

![](1612610831092-learnetto.png)](https://learnetto.com/blog/react-rails)

# webpackerをつかってReactを使えるようにする。

---

今から新規で作成するプロジェクトの場合、ReactとRailsのアプリを分離して作成した上で、API連携させることになることが多いのかと思いますので、今回は、既存のプロジェクトであるという前提で進めます。

## reactの導入

```Bash
$ rails webpacker:install:react
```

cf)

- もし、新規アプリの場合
    
    ```Bash
    $ bin/rails new <app名> --webpack=react
    ```
    

これによって、新たに`app/javascript/packs/hello_react.jsx`が生成されます。

### `javascript_pack_tag ‘hello_react’`

layoutの<head>内に`javascript_pack_tag ‘hello_react’`を記述することで、railsアプリが、hello_react.jsxファイル内のコンポーネントをレンダーするようになります。

### コントローラを作成して、Helloコンポーネントがレンダーされるか確認する

実際のviewに反映されているかを、テスト用のcontrollerを追加して確認します。

```Bash
$ rails g controller site index
```

“/”へのアクセスで今作成したページが表示されるようにルーティングを変更します。

```Bash
# config/routes

Rails.application.routes.draw do
  get 'site/index'
	root 'site#index'
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end
```

以上で、コンポーネントを無事描画できるようになっているはずです。

[![](Screen_Shot_2023-01-10_at_16.38.42.png)](webpacker%E3%82%92%E4%BD%BF%E3%81%A3%E3%81%9FRails6%201%E3%82%A2%E3%83%97%E3%83%AA%E3%81%B8%E3%81%AEReact18%E3%82%92%E5%B0%8E%E5%85%A5/Screen_Shot_2023-01-10_at_16.38.42.png)

# 問題が残っていた。

特に問題はないと思いながらも、ブラウザのコンソールを開くと、

> ==Warning: ReactDOM.render is no longer supported in React 18. Use createRoot instead. Until you switch to the new API, your app will behave as if it's running React 17. Learn more:== ==[https://reactjs.org/link/switch-to-createroot](https://reactjs.org/link/switch-to-createroot)==

とエラーが吐かれてしまいました。どうやら、デフォルトのhello_react.jsxの記法がReact 17流の書き方だそうです。特に、ReactDOM.renderの部分。

(筆者がreactに入門したのはすでに18になっていたので、違いについてはあまりよくわかっていません。)

# React18流に、hello_react.jsxを変更する

---

生成されたhello_react.jsxは、以下のようになっています。

```JavaScript
:before
// hello_react.jsx

import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'

const Hello = props => (
  <div>Hello {props.name}!</div>
)

Hello.defaultProps = {
  name: 'David'
}

Hello.propTypes = {
  name: PropTypes.string
}

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(
    <Hello name="React" />,
    document.body.appendChild(document.createElement('div')),
  )
})
```

エラーのいうことを聞きながら変更を加えると以下のようになりました。

```JavaScript
:after
// hello_react.jsx

import React from 'react'
import ReactDOM from 'react-dom/client'

const Hello = props => (
  <div>Hello {props.name}!</div>
)

const root = ReactDOM.createRoot(document.getElementById('app'));

root.render(
  <Hello name="React" />,
);
```

ここままだと、#=”app”を持つHTML要素はどこにもないので、application.html.erbに空のdivタグを追加します。

```HTML
# app/views/layouts/application.html.erb
<!DOCTYPE html>
<html>
  <head>
    <title>App</title>
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <%= csrf_meta_tags %>
    <%= csp_meta_tag %>

    <%= stylesheet_link_tag 'application', media: 'all', 'data-turbolinks-track': 'reload' %>
    <%= javascript_pack_tag 'application', 'data-turbolinks-track': 'reload' %>
    <%= javascript_pack_tag "hello_react" %>
  </head>

  <body>
		<div id="app"></div>
    <%= yield %>
  </body>
</html>
```

この<div>要素がReactをマウントするrootとして機能するようになります。

あとは、ページ全体をreactをつかって描画したい場合には、

```HTML
e.g.)
<body>
		<div id="app"></div>
		<%= javascript_pack_tag 'hello_react' %>
    <%= yield %>
  </body>
```

のようにしたり、アプリの一部だけをreactにしたい場合には、そのページにて

React要素をマウントするroot(`<div id="app"></div>`)を設置し、それに続くように`javascript_pack_tag` メソッドで、コンポーネントをレンダーするようにして下さい。