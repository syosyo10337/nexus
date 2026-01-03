 

# ReactとPure functions

関数コンポーネントは、基本的には純粋関数として振る舞うことを求められる。

外部スコープで定義された変数と直接参照する様にしてはいけない。

副作用を保つ。つまり、純粋関数でない場合の例

1. コンソールへのログ出力

2. DOM操作

3. サーバとの通信

4. タイマー処理

5. ランダムな値の生成  
    -->>useEffectやイベントハンドラ内に記述すべき。

```JavaScript
e.g.)
// 以下の様な実装だと、pure functionとは呼べず、Reactでは使用してはいけない。
let value = 0;
const Child = () => {
  value++;
  return <div>{value}</div>
};



//純粋関数の場合
const ChildPure = ({ value }) => {
  return <div>{value}</div>
}

const Example = () => {
  let value = 0;
  return (
    <>
      <Child />
      <Child />
      <Child />
      <ChildPure value={++value}/>
      <ChildPure value={++value}/>
      <ChildPure value={++value}/>
    </>
  );
};
//どちらの場合にも1,2,3というように返すが、ChildPureの方は状態を持たない。
```

## ReactとState管理

状態管理と処理を分離しているよね。useStateとコンポーネントの関係に対応する。

stateの値の変更によって、出力が異なるので、関数コンポーネントは厳密には、pure functionsではない。

もし、完璧な純粋関数を作成したいときには、例えばRootにstateを集約すればできるよ