---
tags:
  - html-css
  - animation
  - performance
created: 2026-01-04
updated_at: 2026-02-23
status: active
---

# @keyframes

より複雑なアニメーションを実装するには、`@keyframes` と `animation` プロパティを組み合わせる。経過時間ごとのアニメーションを細かく設定できる。

---

## Syntax

```css
@keyframes <animation-name> {
  from {
    /* = 0% */
  }
  <percentage> {
  }
  to {
    /* = 100% */
  }
}
```

- `0%` は `from`、`100%` は `to` で代用可能
- 途中の任意のパーセンテージ (`25%`, `50%` など) も指定できる

### Example

```css
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
```

---

## animation プロパティ

変化させたい要素に対して付与する。

### Syntax

```css
animation: <name> <duration> <timing-function> <delay> <iteration-count>
  <direction> <fill-mode> <play-state>;
```

個別プロパティ:

| プロパティ                  | 説明                 | 値の例                                  |
| --------------------------- | -------------------- | --------------------------------------- |
| `animation-name`            | @keyframes 名を指定  | `fadeIn`                                |
| `animation-duration`        | アニメーションの長さ | `0.3s`, `2s`                            |
| `animation-delay`           | 開始までの遅延       | `1s`                                    |
| `animation-timing-function` | イージング           | `linear`, `ease`, `ease-in-out`         |
| `animation-iteration-count` | 繰り返し回数         | `1`, `infinite`                         |
| `animation-direction`       | 再生方向             | `normal`, `reverse`, `alternate`        |
| `animation-fill-mode`       | 終了後の状態         | `none`, `forwards`, `backwards`, `both` |
| `animation-play-state`      | 再生/停止            | `running`, `paused`                     |

### Example

```css
/* 透明から 0.3s かけてフェードインする */
#modalContent {
  background: white;
  padding: 20px;
  border-radius: 15px;
  animation: fadeIn 0.3s forwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
```

---

## パフォーマンス最適化

### will-change

ブラウザに「このプロパティがこれから変わる」と事前に伝えるヒントプロパティ。

```css
.animated-element {
  will-change: transform;
}
```

**仕組み:**

1. ブラウザがヒントを受け取り、対象要素を独自の**合成レイヤー (composite layer)** に昇格させる
2. レイヤーが分離されると、アニメーション時にその要素だけを動かせばよく、周囲の要素の再描画 (repaint) が不要になる
3. 仕様上は GPU 使用を「強制」するものではないが、合成レイヤー昇格の結果、実際にはほぼ確実に GPU で合成処理が行われる

**注意点:**

- 乱用すると各レイヤーがメモリを消費し、逆にパフォーマンスが悪化する
- 常時指定するのではなく、アニメーション開始前に JS で付与 → 終了後に解除するのが理想

```javascript
el.addEventListener("mouseenter", () => {
  el.style.willChange = "transform, opacity";
});
el.addEventListener("animationend", () => {
  el.style.willChange = "auto";
});
```

### prefers-reduced-motion

OS のアクセシビリティ設定（「視差効果を減らす」等）を検知するメディアクエリ。前庭障害やモーション過敏のユーザーへの配慮として、アニメーションを無効化または軽減する。

```css
@media (prefers-reduced-motion: reduce) {
  .animated-element {
    animation: none;
  }
}
```

対応する OS 設定:

| OS         | 設定場所                                                         |
| ---------- | ---------------------------------------------------------------- |
| macOS      | システム設定 > アクセシビリティ > ディスプレイ > 視差効果を減らす |
| Windows 11 | 設定 > アクセシビリティ > 視覚効果 > アニメーション効果          |
| iOS        | 設定 > アクセシビリティ > 動作                                   |
| Android 9+ | 設定 > ユーザー補助 > アニメーションの削除                       |

---

## 関連

- [無限スクロール (フィルムロール)](infinite-scroll-filmroll.md) — `@keyframes` + `transform` を使ったシームレスループの実践例
