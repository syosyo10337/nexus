 

# （途中）TechRachoから学ぶ、reactの導入

app/javascriptsディレクトリの中で、reactのアプリを完結させる。

[

Rails 7とReactによるCRUDアプリ作成チュートリアル（翻訳）｜TechRacho by BPS株式会社

概要 原著者の許諾を得て翻訳・公開いたします。 英語記事: How to Create a CRUD App with Rails and React · James Hibbard 原文公開日: 2022/04/01 原著者: James Hibbard 日本語タイトルは内容に即したものにしました。 React logo is licensed under Creative Commons - Attribution 4.0 International - CC BY 4.0. Rails 7とReactによるCRUDアプリ作成チュートリアル（翻訳） ほとんどのWebアプリケーションでは、何らかの形式でデータを [...]

![](favicon%2015.ico)https://techracho.bpsinc.jp/hachi8833/2022_05_26/118202

![](rails7_react_crud_app_tutorial_eyecatch-min.png)](https://techracho.bpsinc.jp/hachi8833/2022_05_26/118202)

---

[環境構築](#beb3d2f8-f478-4414-8efb-2933f844852c)

[1. Railsの環境とその他下準備](#b9834a06-0d98-4853-8c4f-0dfa18e95ee1)

[2. Reactを導入する。](#0a54b617-31a8-492f-8bcc-659204f67e61)

[3. babel/preset-reactをpackage.jsonに追加する](#5ba380d1-64c7-4bcc-b06b-392fbfac1add)

[4. Reactを配信するためのコントローラを生成する。](#fcb7b7fc-7f2c-4e48-9a51-078670153dfd)

# 環境構築

## 1. Railsの環境とその他下準備

まずは、Railsの実行環境を用意する。

次に、開発環境にyarnがインストールされていることを確認.

```Bash
$ yarn -v 
```

- shakapackerを導入

```Bash
$ bundle add shakapacker --strict
```

その後,webpackerのインストールも確認する。

```Bash
$ bin/rails webpacker:install
```

## 2. Reactを導入する。

```Bash
$ yarn add react react-dom @babel/preset-react
```

## 3. babel/preset-reactをpackage.jsonに追加する

```JSON
"babel": {
  "presets": [
    "./node_modules/shakapacker/package/babel/preset.js",
    "@babel/preset-react"
  ]
}
```

## 4. Reactを配信するためのコントローラを生成する。

- rails側の配信するコントローラを適宜設定して、

```Bash
$ rails g controller site index
```

app/views/site/index.html.erbの内容を以下で置き換えます。

```HTML
<!-- app/views/site/index.html.erb --><div id="root"></div>
```

- React側のApp.jsを作成する

```Bash
mkdir app/javascript/components
touch app/javascript/components/App.js
```

`application.js`にテンプレートを記載します。

```JavaScript
// app/javascript/packs/application.js
// （省略）
import React from 'react';
import { createRoot } from 'react-dom/client';
import HelloMessage from './components/App';

const container = document.getElementById('root');
const root = createRoot(container);

document.addEventListener('DOMContentLoaded', () => {
  root.render(<HelloMessage name="World" />);
});
```

cf)create-react-appの`index.js`だとちなみに、、

```JavaScript
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
```

- 最後に、sites#indexのルーティングを設定して環境構築ができているか確認する。

```Ruby
Rails.application.routes.draw do
  root 'site#index'
end
```

—webpack=react の代わりに

rails webpacker:install:react