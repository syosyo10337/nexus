---
tags:
  - ruby
  - syntax
  - oop
created: 2026-01-03
status: active
---

# memoization

# メモ化について

実際のアプリコードにて、インスタンス変数の寿命を考える。

リクエストのたびに生成されるのであれば、メモ化して問題ない。

[

Rubyのメモ化（memoization）を理解する（翻訳）｜TechRacho by BPS株式会社

概要 原著者の許諾を得て翻訳・公開いたします。 英語記事: Understanding Ruby - Memoization - DEV Community 原文公開日: 2023/10/01 原文更新日: 2024/04/29 原著者: Brandon Weaver Rubyのメモ化（memoization）を理解する（翻訳） 🔗 はじめに メモ化はRubyで広く使われている手法ですが、残念ながら、メモ化を効果的に使いこなすためには、注意しなければならない落とし穴がいくつか潜んでいます。本記事では、メソッドで計算した値をメモ化する、つまり記憶するときに注意する必要のある事項について手短に紹介します。 🔗 本記事 […]

![](Ruby/Imported/Attachments/cropped-techracho_official_icon-1-192x192.png)https://techracho.bpsinc.jp/hachi8833/2024_05_10/141720

![](Ruby/Imported/Attachments/ruby_understanding_memoization_eyecatch-min.png)](https://techracho.bpsinc.jp/hachi8833/2024_05_10/141720)

```Ruby
class MyClass
  def some_method
    @some_method ||= some_expensive_computation_or_api_call
  end
end
```

ただし、boolを返したいような場合には、defined?でアーリーリターンしましょう。