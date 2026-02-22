---
tags:
  - html-css
  - animation
  - performance
created: 2026-02-23
updated_at: 2026-02-23
status: active
---

# 無限スクロール (フィルムロール)

コンテンツを2倍の高さで配置し、`translateY(-50%)` → `translateY(0)` をループさせることで継ぎ目のない無限スクロールを実現するテクニック。

---

## 全体の構造

```text
外側コンテナ
├── overflow: hidden    → はみ出た部分を隠す「窓枠」
└── film-roll-scroll div
    ├── 画像A (1枚目)
    └── 画像A (2枚目・完全コピー)
```

2枚を縦に並べることで **「継ぎ目のない輪っか」** を作るのが核心。

---

## アニメーションのキーフレーム

```css
@keyframes filmRoll {
  from {
    transform: translateY(-50%); /* ← 1枚分上にずれた状態 */
  }
  to {
    transform: translateY(0%); /* ← 元の位置 */
  }
}
```

### なぜ `-50%` が「ちょうど1枚分」なのか

```text
film-roll-scroll の全高 = 画像A × 2枚 = 200px とすると

translateY(-50%) = -100px = 画像1枚分ぴったり
```

`%` は **自分自身の高さに対する割合** なので、枚数が変わっても `height: 200%` + `translateY(-50%)` の関係は常に成立する。

---

## 時系列で追う

```text
t=0   [  A2の途中  ]  ← -50% (1枚上にずれ)
      [            ]
      ↓ GPUがレイヤーを下へスライド
t=50% [  A1の途中  ]
      [────────────]  ← 継ぎ目 (A=A なので視覚的に不可視)
      [  A2の途中  ]
      ↓
t=100 [  A2の途中  ]  ← translateY(0) = t=0 と見た目が完全一致
                        → linear infinite で t=0 に戻ってもバレない
```

**シームレスの理由:**

1. 開始位置と終了位置の **見た目が完全一致**（同一画像コピーのため）
2. `linear infinite` で **瞬間的にループ** するが、見た目が同じなので知覚不可能

---

## なぜ `transform` が最適なのか（レンダリングパイプライン視点）

ブラウザのレンダリングは以下の順で処理される:

```text
JavaScript → Style → Layout → Paint → Composite
                                        ↑
                              transform はここだけ
```

| プロパティ            | 影響するステージ           | コスト   |
| --------------------- | -------------------------- | -------- |
| `top` / `margin`      | Layout → Paint → Composite | 高い     |
| `background-position` | Paint → Composite          | 中程度   |
| `transform`           | **Composite のみ**         | ほぼゼロ |

### GPU 合成の仕組み

1. ブラウザが要素を GPU テクスチャとして「一度だけ」ラスタライズ
2. あとはフレームごとに GPU がテクスチャの「座標だけ」を変更
3. CPU・メインスレッドは一切関与しない

`will-change: transform` を付けると、ブラウザが事前に独立レイヤーを作成し、他の要素の repaint の影響も受けない。

---

## 実装例

```css
@keyframes film-roll-scroll {
  0% {
    transform: translateY(-50%);
  }
  100% {
    transform: translateY(0);
  }
}

.film-roll-scroll {
  will-change: transform;
  animation: film-roll-scroll 60s linear infinite;
}

@media (prefers-reduced-motion: reduce) {
  .film-roll-scroll {
    animation: none;
  }
}
```

- `will-change: transform` — レイヤー昇格し、スムーズな描画を確保
- `linear infinite` — 等速無限ループ
- `prefers-reduced-motion` — アクセシビリティ対応

---

## まとめ

```text
シームレスループ = 同一画像の2枚複製 × translateY(-50%→0%) の往復
パフォーマンス  = transform による Composite 専用処理 = GPU任せ = 60fps維持
```

この2つの組み合わせが、CPU を使わず視覚的に完璧なループを実現する理由。

---

## 関連

- [@keyframes](keyframe.md) — キーフレームアニメーションの基本構文
