---
tags:
  - rails
created: 2026-01-03
status: draft
---

👃

# 続)reactに後からTypeScriptを導入する。

---

1. webpackerにスクリプトとしてある程度処理させる。

```Bash
$ bundle exec rails webpacker:install:typescript
```

2. yarnによってパッケージをインストールするのを忘れずに,(スクリプト内で導入してくれている感じはする。。。)

```Bash
$ yarn add @types/react @types/react-dom
```