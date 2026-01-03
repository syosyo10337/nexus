---
tags:
  - html-css
  - html
  - css
  - layout
created: 2026-01-04
status: active
---

# break-words/ `overflow-wrap: break-word;`で折返しが効かない

# 症状

[

CSSのdisplay: flexだとoverflow-wrap: break-wordが効かない

CSSのdisplay: flexで以下のようなレイアウトを作成した際に英数字のテキストが折り返さずはみ出してしまうことがある。記事に記載されているケースで2行目から開始して折り返したい場合はoverflow-wrap: break-word;を使用するのが定石なのだが、display: flex;が使用されている場合はoverflow-wrap: break-word;だけだと折り返さない。

![](HTML&CSS/styling/Attachments/iwbjp_512.png)https://iwb.jp/css-display-flex-overflow-wrap-min-width-0/

![](HTML&CSS/styling/Attachments/css-display-flex-overflow-wrap-min-width-0.png)](https://iwb.jp/css-display-flex-overflow-wrap-min-width-0/)

cf. break-words自体はv3まで、v4でも暗黙的動作するが、docからは削除されている [https://v3.tailwindcss.com/docs/text-wrap](https://v3.tailwindcss.com/docs/text-wrap)

# 理解

[https://developer.mozilla.org/ja/docs/Web/CSS/Reference/Properties/overflow-wrap](https://developer.mozilla.org/ja/docs/Web/CSS/Reference/Properties/overflow-wrap)

overflow-wrap: break-word は、最小固有幅（min-content）の計算時に単語途中の改行を考慮しません。そのため、Flexbox/Grid の子要素では折り返しが効かないことがあります。

対処法: wrap-anywrhere

[

overflow-wrap - Typography

Utilities for controlling line breaks within words in an overflowing element.

![](HTML&CSS/styling/Attachments/apple-touch-icon.png)https://tailwindcss.com/docs/overflow-wrap#wrapping-anywhere

![](HTML&CSS/styling/Attachments/og.png)](https://tailwindcss.com/docs/overflow-wrap#wrapping-anywhere)

# 詳細

## **Flexboxの最小要素幅の計算メカニズム**

**1. 基本概念：min-content（最小固有幅）**

min-content は、コンテンツが折り返されずに表示される最小の幅です。

例：

テキスト: "verylongword"

min-content = "verylongword"の幅（約150px）

**2. Flexboxのデフォルト動作：min-width: auto**

Flexboxの子要素は、デフォルトで min-width: auto です。これは次を意味します：

_/* Flexboxの子要素のデフォルト */_

min-width: auto; _/* = min-content に基づく */_

つまり、Flexboxの子要素は、内容の min-content より小さく縮小できません。

**3. overflow-wrap: break-word の問題**

overflow-wrap: break-word は、レンダリング時に単語を折り返しますが、最小幅（min-content）の計算時には折り返しを考慮しません。

具体例：

```HTML
<div class="flex">
	<p class="wrap-break-word">verylongword@example.com</p>
</div>
```

計算の流れ：

1. ブラウザが min-content を計算

- overflow-wrap: break-word は計算時に無視される

- min-content = "verylongword@example.com" 全体の幅（約250px）

1. Flexboxがサイズを決定

- 子要素は min-width: auto（= min-content）

- 250px未満には縮小できない

1. 結果

- 親が狭い場合でも、子要素は250pxを維持しようとする

- はみ出す

**4. overflow-wrap: anywhere の解決策**

overflow-wrap: anywhere は、最小幅（min-content）の計算時にも折り返しを考慮します。

同じ例で：

```HTML
<div class="flex">
	<p class="wrap-anywhere">verylongword@example.com</p>
<div>
```

計算の流れ：

1. ブラウザが min-content を計算

- overflow-wrap: anywhere は計算時に考慮される

- 折り返し可能と仮定して計算

- min-content = 最も長い単語の幅（例：約50px）

1. Flexboxがサイズを決定

- 子要素は min-width: auto（= min-content）

- 50pxまで縮小可能

1. 結果

- 親が狭くても、子要素は適切に縮小し、テキストは折り返される

## **視覚的な比較**

**ケース1: overflow-wrap: break-word + Flexbox**

```HTML
親コンテナ: [============] (200px)
子要素:     [verylongword@example.com] (250px) ← はみ出す！
```

min-content の計算：

- break-word は無視される

- min-content = 250px

- 200px未満には縮小できない

**ケース2: overflow-wrap: anywhere + Flexbox**

```HTML
親コンテナ: [============] (200px)
子要素:     [verylongwor-] (200px) ← 収まる！
            [d@example.co-]
            [m]
```

min-content の計算：

- anywhere は考慮される

- min-content = 約50px（最長単語）

- 200pxに収まる

**ケース3: overflow-wrap: break-word + min-width: 0**

```HTML
親コンテナ: [============] (200px)
子要素:     [verylongwor-] (200px) ← 収まる！
            [d@example.co-]
            [m]
```

min-width: 0 により：

- min-content の制約を無視

- 強制的に縮小可能

- テキストは折り返される

## **まとめ**

|プロパティ|レンダリング時の折り返し|min-content計算時の折り返し|Flexboxでの動作|
|---|---|---|---|
|overflow-wrap: break-word|✅ 折り返す|❌ 考慮しない|min-width: 0 が必要|
|overflow-wrap: anywhere|✅ 折り返す|✅ 考慮する|min-width: 0 不要|

**重要なポイント**

1. min-content は、折り返しを考慮しない場合の最小幅

2. Flexboxの子要素は、デフォルトで min-width: auto（= min-content）

3. break-word はレンダリング時のみ折り返し、min-content 計算には影響しない

4. anywhere は min-content 計算時にも折り返しを考慮する

5. min-width: 0 を指定すると、min-content の制約を無視できる

このため、Flexbox内では wrap-anywhere を使うか、wrap-break-word + min-w-0 の組み合わせが必要です。wrap-anywhere の方がシンプルで推奨されます。

この説明で理解が深まりましたか？追加で知りたい点があれば教えてください。