---
tags:
  - react
  - hooks
  - component
  - state
created: 2026-01-03
status: active
---

# useEffect

# [useEffect]

コンポーネント内で、一度だけ呼び出したい機能に対して使用する。  
Effectは、"side effect"から来ています。  
第一引数には、コールバック関数をとって、第二引数には、[]を取る必要があります。  

```JavaScript
useEffect(() => {}, [/*empty*/])
```

- このhooksは必ず、ブラウザ上で実行されるため、NextのSSR実行環境上でwindowオブジェクトなどブラウザ固有のオブジェクトを扱いたい時などには、使用するといい。

## useEffectの第二引数について

useEffectの第二引数に当たる配列は、依存配列と呼ばれる。この依存配列には、コールバック関数の実行タイミングを制御する依存データが入る。  
例えば、なにかしらのStateをこの配列に入れた時、これは、Stateの更新のタイミングに応じて、コールバック関数を再度呼び出す。  
つまり、再実行させる必要がない時には、[]再実行の制御は不要で、逆に1秒ごとに更新させたいのであれば、一秒ごとに更新する値を用意するが吉。若しくは[]ではなく、一度だけ呼び出す関数側で制御するのもアリ。

🔥

### 注意点

useEffectのコールバック関数内で、依存配列と依存性のある関数を呼んだ場合には[]、再帰呼び出しが発生しますので、やめてください。

## useEffectの第一引数にわたるコールバック関数の戻り値。//依存配列が空の場合

この戻り値は、useEffectが呼び出されたコンポーネントが消滅した際に、一度だけ呼び出される関数に当たる。  
これによって、指定されたコンポーネントが消滅した際の挙動も制御できる。  
e.g.)  
useEffect(() => {  
console.log('init');  
window.setInterval(() => {  
setTime(prev => prev + 1);  
}, 1000);  
return () => {  
console.log("done");  
}  
}, [])

## useEffectの第一引数にわたるコールバック関数の戻り値。//依存配列に定期更新される何かが入っている場合

この時コールバック関数の挙動としては、まず一度、第一引数のコールバック関数が呼ばれる。その後、依存配列の制御のともなって、再実行される時に、return以後の戻りに指定された処理も実行されるので、  
callback --> return/callback => return/callbackの順で、依存配列の制御に倣ってよびださられる。

## useEffectのクリーンナップ処理

依存配列が設定されていない場合に、一度useEffectに呼び出されたコールバック関数は再度実行されることはない。  
しかし、clearIntervalなどで定時実行させるものを停止したい場合には、return 以降に、clearIntervalを仕込んで、コンポーネントの消滅にトリガーしてreturnが実行。その中に記述されたclearIntervalによって、クリーンナップできるという設定に使える。

## useEffectの実行されるタイミングについて

1-[依存配列が空の時]

```TypeScript
e.g.)
useEffect(() => {
 //callback処理
	return () => {
	//cleanup処理
  }
}, []);
```

1. コンポーネントがMountedされた時に、callback処理が呼び出されて、

2. UnmountedされたタイミングでcleanUp処理が実行される。

2-[依存配列に値がある時]

```TypeScript
useEffect(() => {
	//callback処理
	return () => {
	//cleanup処理
  }
}, [/*依存値*/]);
```

1. コンポーネントがMountedされた時に、callback処理が呼び出されて、

2. stateの更新などによって、コンポーネントがUpdated(再レンダー&DOM更新)され、依存値に指定していた値が更新されていれば、  
    a. cleanup処理が実行され  
    b. callback処理が実行される

3. 2の操作がUpdatedの都度実行されて、

4. UnmountedされたタイミングでcleanUp処理が実行される。

3-[依存配列が省略されている時]  
2-のケースとの違いは、stateの更新などによるコンポーネントのupdated(再レンダー)が起きた際に、依存値がないため、依存値の更新にかかわらず。(つまり、Updatedされるたびに)cleanup処理とcallback処理が呼び出される。