---
tags:
  - linux
  - command
created: 2026-01-04
status: draft
---

# dockerコマンドで毎回sudoしなくてよ様にするには。

```TypeScript
sudo usermod -aG docker $USER
```

current userをdockerのuser accout groupに追加している。

これによって、dockerコマンドの実行の度にsudoを実行する必要がない。