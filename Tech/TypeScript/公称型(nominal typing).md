---
tags:
  - typescript
  - type-system
  - class
created: 2026-01-03
status: draft
---

# 公称型(nominal typing)

💡

TypeScriptでは、クラスに1つでも非パブリックなプロパティがあると、そのクラスだけ構造的部分型ではなく公称型(nominal typing)になります。

公称型とは別名、**名前的型付け**

対義語は、structural typing
