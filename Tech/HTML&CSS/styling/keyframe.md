---
tags:
  - html-css
  - animation
created: 2026-01-04
updated_at: 2026-02-23
status: active
---

# @keyframes

より複雑なアニメーションを実装するには、`@keyframes` と `animation` プロパティを組み合わせる。経過時間ごとのアニメーションを細かく設定できる。

---

## @keyframes

### Syntax

```css
@keyframes <animation-name> {
  from {
    /* = 0% */
  }
  <percentage > {
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
