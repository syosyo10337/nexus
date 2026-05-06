---
tags:
  - llm
  - prompt-engineering
  - self-consistency
created_at: 2026-05-06
status: draft
---

# Self-Consistency の本質を理解するノート

> **目的**: なぜ Self-Consistency が精度を上げるのかを、LLM のトークン生成メカニズムから出発して理解する。

---

## 0. 前提：LLM はどうやってトークンを出すか

これが分からないと self-consistency の理屈がただの「多数決」に見えてしまう。

LLM は **autoregressive**（自己回帰的）にテキストを生成する。1トークンずつ順番に出して、出したトークンを次の入力に組み込んで、また次を出す、を繰り返す。

### 1 ステップの仕組み

```
[入力] "日本の首都は"
   │ → Transformer → logits（数万次元の生スコア）
   │ → softmax → probabilities { "東京":0.85, "大阪":0.05, "京都":0.04, ... }
   │ → サンプリング戦略で 1 つ選ぶ → "東京"
   ▼
[次の入力] "日本の首都は東京"  → ループ（EOS まで続く）
```

### サンプリング戦略の違い

| 戦略 | 選び方 | 結果 |
|---|---|---|
| Greedy (`temp=0`) | 常に argmax を取る | 同じ入力なら毎回同じ出力（決定的）|
| Sampling (`temp>0`) | 確率に比例して 1 つを引く | 毎回違う出力（確率的）|

**ここが核**: Greedy は **各ステップで「その時点で見えてる範囲の最大値」を選ぶだけ**。先読みしない。

---

## 1. Greedy が抱える構造的弱点：myopic な選択

### "見えてる範囲で最大" ≠ "全体で最大"

数学的に書くと：

```
シーケンス全体の確率:
  P(t1, t2, t3, ...) = P(t1) × P(t2|t1) × P(t3|t1,t2) × ...

Greedy:
  各ステップ独立に argmax(P(t_i | t_<i)) を取る
```

つまり Greedy は **ステップごとの局所最適を貪欲に追う**だけで、シーケンス全体の最尤を見つけてはいない。

### 具体例

```
[ステップ 1]
  トークン "A": P = 0.51  ← Greedy はこれを選ぶ
  トークン "B": P = 0.49

[ステップ 2 以降の最良展開]
  A から続く最良パス: 全体 P = 0.51 × 0.3 = 0.153
  B から続く最良パス: 全体 P = 0.49 × 0.8 = 0.392 ← 本当はこっちが最良
```

Greedy は最初の `0.51 vs 0.49` で「見えてる範囲で勝った方」 = A を選び、B から続く本当の最高確率シーケンスを永久に失う。これを **myopic（近視眼的）な選択** と呼ぶ。

### CoT との相性が悪い理由

Chain of Thought は推論ステップが長い。1 つの中間トークンで間違うと、autoregressive なので **間違った前提から続く推論を真面目に組み立ててしまう**。

```
[CoT 例] "リンゴ 3 個、ミカン 5 個。合計は？"

ステップ1: "リンゴが 3 個、"           OK
ステップ2: "ミカンが 5 個、"           OK
ステップ3: "なので、3 _"               ← ここで "+" と "−" が
                                         "+" : 0.51
                                         "−" : 0.49
                                       Greedy は "+" を引けば正解、
                                       "−" を引いたら詰む
ステップ4: "− 5 = −2"                  ← autoregressive で前提に従って続ける
ステップ5: "よって合計は −2 個"         ← 完全に間違った答え
```

**最初の小さな logprob の差（0.51 vs 0.49 みたいな）が、最終答えで完全に違う結果を生む**。長い CoT ほどこのリスクが累積する。

---

## 2. Self-Consistency の核心：収束/発散の非対称性

### 直感

複雑な推論問題は **正解に至る道筋が複数ある**。一方、**間違いには間違い方が無数にある**。

```
正解パス:
  「3 + 5」直接計算         → 8
  「5 + 3」交換律で計算     → 8
  「リンゴ 3 + ミカン 5」順 → 8
  すべて 8 に集まる ─────────► 引力がある

不正解パス:
  「引き算と勘違い」→ 5 - 3 = 2
  「掛け算と勘違い」→ 3 × 5 = 15
  「ミカンだけ数える」→ 5
  みんなバラバラの場所へ ────► 散らばる
```

### 図解：木構造で見る path の振る舞い

```
              [質問]
                │
   ┌─────┬─────┼─────┬─────┐    ← sampling で各 path の
   │     │     │     │     │       中間トークンがバラける
   ▼     ▼     ▼     ▼     ▼
 [ 8 ] [ 8 ] [ 8 ] [ 2 ] [ 15 ]   ← 答え空間にマッピング
   ╲     │    ╱      │     │
    ╲    │   ╱       │     │
     ▼▼▼▼▼          ▼     ▼
   「8」3票        「2」  「15」
   ★収束★        発散：バラバラ

[多数決] 8: ★★★ ← 採用 / 2: ★ / 15: ★
```

### なぜこうなるか（確率の話）

CoT のサンプリングは、**「正解に至る全 path の確率の合計」 vs 「各誤答 path の確率」** の戦いになる：

```
P(answer = 8) = P(path1) + P(path2) + P(path3) + ...
              = 全ての "8 に至る path" を合算 ← marginalize される

P(answer = 2)  = P(path4)        ← 1 path だけ
P(answer = 15) = P(path5)        ← 1 path だけ
```

個々の path で見れば greedy より低確率なものも含まれる。でも **答え空間で marginalize（周辺化）すると、正解クラスタが圧倒的に勝つ**。

これが Wang et al. 2022 の原論文で言う *"marginalizing out the sampled reasoning paths"* の意味。

### Greedy との対比

| 観点 | Greedy (temp=0) | Self-Consistency (temp>0, N samples) |
|---|---|---|
| 確率の見方 | 個別 path の確率 | answer 空間での marginal 確率 |
| 中間トークンの誤り | 直接最終答えに影響 | 多数決で吸収される |
| 失敗モード | 1 つの誤りで詰む | 系統的バイアスのみ脆弱 |
| コスト | 1× | N× |
| 本質 | 局所最適を追う | 確率分布の構造を使う |

---

## 3. Self-Consistency が効かないケース

万能ではない。以下のシナリオでは無力：

### ⚠ 系統的バイアス（systematic error）

モデルが **全 path で同じ間違い方をする** ケース。

```
入力: ある特殊な引っ掛け問題

全 path:
  Path 1: 「答えは X」
  Path 2: 「明らかに X だ」
  Path 3: 「これは X」
  ...
  Path N: 「X」

正解: Y

→ N = 100 サンプルしても全部 X
→ self-consistency は X を強く確信してしまう（誤り）
```

例：

- common sense に見えるが実は間違っている知識
- adversarial に作られた入力
- モデルの学習データの偏り
- モデル特有の癖（特定のパターンに弱い）

### ⚠ 易しすぎるタスク

```
質問: "1 + 1 = ?"
Greedy: 2 （正解、確率 0.99）
Self-Consistency: 全 100 サンプル全部 2

→ N 倍のコストを払う見返りがほぼゼロ
```

### ⚠ Open-ended な生成

```
質問: "短編小説を書いて"
→ そもそも "答え" がないので多数決のしようがない
→ self-consistency は適用外
```

### 対策：Multi-Model Ensemble

系統的バイアスは **異なるモデルを混ぜる** ことで decorrelate できる。

```
Gemini 2.5 Flash 系統バイアス: A
Claude Haiku 系統バイアス:    B
GPT-4o-mini 系統バイアス:     C

→ 3 モデル全員一致 = A ∩ B ∩ C のバイアスのみ残存（はるかに小さい）
→ Self-Consistency 単体より強い precision が得られる
```

異なるモデルは異なる学習データ・異なるアーキテクチャ・異なる RLHF を経ているので、**相関しない誤り方をする**ことが期待できる。

---

## 4. 意思決定フロー：いつ何を使うか

```
タスクは何か？
  │
  ├── 単純な分類・抽出（trivial classification）
  │     例: スパム判定、感情分析、簡単なタグ付け
  │     → ✅ Greedy (temp=0) 一発で十分
  │
  ├── 推論を伴う判定（judgment-based）
  │     例: セキュリティ違反判定、法令適合チェック、コードレビュー
  │     │
  │     ├── 推論モデル使える？（o1, Claude thinking, Gemini 2.5）
  │     │     ├── Yes: それで一発、必要なら N=3 の SC を上乗せ
  │     │     └── No:  Self-Consistency N=5〜20
  │     │
  │     ├── Precision 最重視（誤検知を絶対減らしたい）
  │     │     → Self-Consistency + Unanimity（全員一致のみ採用）
  │     │
  │     └── さらに precision を上げたい
  │           → Multi-Model Ensemble + Unanimity
  │
  └── Open-ended 生成（小説、ブレスト、創作）
        → 多様性が欲しいので high temperature で 1 発
        → Self-Consistency は適用外
```

---

## 5. 3 行まとめ

1. **Greedy (`temp=0`)** は各ステップで argmax を取る myopic な戦略。中間トークンで間違えると autoregressive 構造で雪だるま式に効く。
2. **Self-Consistency** は「正解は複数 path で robust に到達される、誤りは path ごとに発散する」という**統計的非対称性**を利用。answer 空間で marginalize して多数決を取る。
3. **系統的バイアス**には無力なので、precision 最優先なら **Multi-Model Ensemble** に進化させる。

---

## 6. キーワード対応表（英 ⇄ 日）

| 英語 | 日本語 |
|---|---|
| autoregressive | 自己回帰的 |
| greedy decoding | 貪欲デコーディング、greedy decoding |
| myopic | 近視眼的 |
| argmax | 最大値を取る要素 |
| logits | logits（生スコア）|
| softmax | softmax（正規化指数関数）|
| marginalize | 周辺化する |
| reasoning path | 推論経路 |
| systematic error / bias | 系統的誤り／バイアス |
| decorrelate | 相関を解く |
| ensemble | アンサンブル |

---

## 参考

- Wang et al. (2022) "Self-Consistency Improves Chain of Thought Reasoning in Language Models" — [arXiv:2203.11171](https://arxiv.org/abs/2203.11171)
- Wei et al. (2022) "Chain-of-Thought Prompting Elicits Reasoning in Large Language Models" — [arXiv:2201.11903](https://arxiv.org/abs/2201.11903)
- Kadavath et al. (2022) "Language Models (Mostly) Know What They Know" — [arXiv:2207.05221](https://arxiv.org/abs/2207.05221)
- AWS Bedrock Blog (2024) "Enhance performance of generative language models with self-consistency prompting" — [link](https://aws.amazon.com/blogs/machine-learning/enhance-performance-of-generative-language-models-with-self-consistency-prompting-on-amazon-bedrock/)
