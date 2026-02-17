---
tags:
  - react
  - key
  - list
  - component
created: 2026-02-10
status: active
---

# Reactのkeyの指定

## JSX内で配列を使用する際の注意

Reactで配列をレンダリングする際、以下のような警告が表示されます：

```bash
Warning: Each child in a list should have a unique "key" prop.
```

これは、list（ul/ol）の親から見て、子要素が識別できるようにする必要があることを意味します。

**つまり、li要素がそれぞれkey属性（プロパティ）が必要です。**

## なぜkeyを指定する必要があるのか？

### Reactの差分検出の仕組み

Reactは、Fiberツリー（h1などのHTML要素とReact要素からなるツリー）の差分検出によって、実際のDOMを書き換えています。

### keyがない場合の問題

- **末尾への追加**: 親nodeから見た末尾の要素が追加された場合、子要素をそれぞれ比較し、新たに追加された要素を実際のDOMに反映します（効率的）
- **先頭への追加**: 親nodeから見た先頭の要素が追加された場合、実際には先頭に追加されただけでも、Reactは**子要素をツリー構造の位置をもとにした子要素の中身**で比較します。そのため、今までのツリー上の位置のものが全て変わったと認識し、すべての子要素を洗いがえることになります（非効率）

### keyをつけることで解決

keyプロパティをつけることで、Reactの処理は以下のように変わります：

- 子要素の位置と中身での比較ではなく、**keyによる変化前後の紐付け**を行う
- 新たなkeyの値を持つ要素が追加された、もしくは削除されたかをもとに更新する
- 同じkeyを持つ要素で中身が同じならば更新しない
- 連想配列のように、keyによって要素の増減を見て、同一keyのもので変化があれば更新する
- これにより、**実際の差分だけを更新**することができる

## keyをつける際の注意点

### 1. keyはuniqueであること

兄弟要素の中で、keyは重複しないようにすること。

### 2. keyに設定した値は変更しない

比較の基準を失うため、洗い替えの可能性が上がります。

### 3. 配列のインデックスをなるべく使わないこと ⚠️

#### なぜindexは危険なのか

```jsx
// 初期状態
const todos = ["タスクA", "タスクB"]; // index: 0, 1

// 先頭に追加
const todos = ["タスクC", "タスクA", "タスクB"]; // index: 0, 1, 2
```

**問題点:** indexは配列内の**位置**を表すため、要素を追加・削除・並び替えすると全要素のindexが変わります。

**Reactの判断:**

- `key={0}`: 前は"タスクA"、今は"タスクC" → 内容を更新
- `key={1}`: 前は"タスクB"、今は"タスクA" → 内容を更新
- `key={2}`: 前はなし → 新規追加

結果：全要素が更新される（非効率）、さらに**inputなどの状態がずれる**（バグ）

---

### なぜkeyが同じでも更新されるのか？

**疑問:** keyが変わっていないのに、なぜ更新される？

**答え:** keyは同じだが、中身（children/props）が異なるから。

#### Reactの差分検出ルール

1. **keyが同じ** → DOM要素を再利用
2. **keyが同じ & 中身が異なる** → DOM要素を再利用して内容だけ更新
3. **keyが新しい** → 新しいDOM要素を作成

#### inputの状態がずれる理由

```jsx
// ユーザーがタスクAにチェック
<li key={0}><input checked /> タスクA</li>

// 先頭にタスクCを追加
<li key={0}><input checked /> タスクC</li>  // ← チェックが残る！
<li key={1}><input /> タスクA</li>
```

**原因:**

- Reactは`key={0}`のDOM要素を再利用し、テキストだけ更新
- `<input>`のチェック状態はDOM要素に紐づいているため保持される
- 結果：タスクCがチェックされているように見える😱

---

## indexをkeyに使っても良いケース（実践的ガイドライン）

ESLintの`react/no-array-index-key`ルールは、indexをkeyに使うことを警告しますが、**以下のすべての条件を満たす場合は例外的に許容されます**。

### ✅ 許容されるケース

#### 1. Loading Skeleton（ローディング表示）

```jsx
// ✅ OK
function UserListSkeleton() {
  return (
    <div>
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className="skeleton">
          <div className="skeleton-avatar" />
          <div className="skeleton-text" />
        </div>
      ))}
    </div>
  );
}
```

**理由:** 要素数固定、変更なし、一時的な表示

#### 2. 完全に静的なリスト

```jsx
// ✅ OK
const NAV_ITEMS = ["ホーム", "について", "お問い合わせ"];

function Navigation() {
  return (
    <nav>
      {NAV_ITEMS.map((item, index) => (
        <a key={index} href={`/${item}`}>
          {item}
        </a>
      ))}
    </nav>
  );
}
```

**理由:** 定数データ、変更なし、状態なし

#### 3. 単純な読み取り専用の表示

```jsx
// ✅ OK: propsで受け取ったタグを表示するだけ
function TagList({ tags }) {
  return (
    <div>
      {tags.map((tag, index) => (
        <span key={index} className="tag">
          {tag}
        </span>
      ))}
    </div>
  );
}
```

**理由:** コンポーネント内で変更なし、フォーム要素なし

⚠️ **注意:** 親でpropsが変更される場合、全要素が更新される（バグはないが非効率）。要素数が多い、頻繁に変わる、パフォーマンス重視の場合はユニークID推奨。

---

### ❌ 絶対に使ってはいけないケース

1. **並び替え・追加・削除がある**
2. **フォーム要素（input等）を含む**
3. **focus、スクロール位置などDOM状態を持つ**
4. **アニメーション・トランジションがある**

```jsx
// ❌ 典型的なNG例
function TodoList({ todos }) {
  return (
    <>
      {todos.map((todo, index) => (
        <div key={index}>
          <input type="checkbox" />
          {todo.text}
        </div>
      ))}
    </>
  );
}
```

---

### 判断基準

以下すべてに該当する場合のみindex使用OK：
**1つでも×ならユニークID必須**

- [ ] リストの順序・要素数が変わらない
- [ ] フォーム要素、focus、アニメーションがない
- [ ] ユーザーインタラクションがない

---

### IDがない場合の対処法

```jsx
// ❌ BAD
items.map((item, index) => <li key={index}>{item}</li>);

// ✅ GOOD: 値がユニークならそれを使う
items.map((item) => <li key={item}>{item}</li>);

// ✅ GOOD: nanoid等でID生成
import { nanoid } from "nanoid";
const itemsWithId = items.map((item) => ({ id: nanoid(), value: item }));
```

---

### まとめ

- **原則**: ユニークなIDを使う
- **例外**: Loading skeleton、完全に静的なリストのみ
- **迷ったら**: ユニークID（安全策）
