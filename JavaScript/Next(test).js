# Next.js(by Vercel)とは
React開発のためのフレームワークで、高速で高機能なwebアプリケーションを作成することができる。

## 主要な機能
- 複数のレンダリング方法(SSR, SG, ISG)
- ファイルベースルーティング(ダイナミックルート)
- APIの作成(API routes)
- Developerへ優しい開発環境
などの処理を簡便にしてくれる。


### ReactとNext.jsの棲み分け。
- React
UIを構築するための機能を提供するライブラリ

- Next.js
React開発のための機能を提供するフレームワーク


## Next.jsの特徴。
zero_configで高度が機能が使用可能。
複雑な設定をする必要がなく、効率的に進めることができる。




## Next-appのディレクトリ構成について

- /pages
ファイルまでのパスがそのままページのURlとして機能す流。
各コンポーネントを配置する。
1ファイル１ページに対応するように

- /pages/_app.js
Railsでいう、app/views/layouts/application.html.erbのようなもの。
どのページを表示する際にも、このファイルを通るロジックになっている。
グローバルに適応したいスタイルなどはこちらに記述する。(CSSフレームワークの読み込み等。)
e.g.)
import "./<グローバルCSSファイルのパスを指定する。(名前はなんでも良い。)>"

function App({ Component, pageProps}) {
  return <Component {...pageProps} />;
}

export default App;

- styles
スタイルシートを置く場所。
-- /styles/globals.cssにグローバルに適用されるcssが記述されている。

- public
静的なファイルを置くために使う。robot.txtにも使える。


- next.config.js
Next.jsの設定ファイルURlのベースパスを変えるなどの設定を、もし行いたい時にはこちらを使う。細かいconfigについては
cf）
https://nextjs.org/docs/api-reference/next.config.js/introduction


個人的には
- src - - pages
			| - styles
			| - components //部品用のディレクトリ
にした方がいいかもね。




## 環境構築

```
//アプリケーションの雛形を作成する。パッケージをインストール
$ npm i -g create-next-app

//
$ create-next-app



// アプリの起動
$ npm run dev 
$ yarn dev

## Routingについて
Nextでは、ファイルベースルーティングが採用されている。
- Nextでは、pages配下のフォルダから,デフォルトエクスポートされた関数コンポーネントがそのまま、1ページとして表示される。
より明確に言うと、URLがどのように決まるかと言うのは、pagesディレクトリ配下のパスによってきまる。ファイル名まで含めて、素直に読み込むことでパスを設定することができる。そのコンポーネントに記述される内容が描画される。
//パスの指定はpagesディレクトリをルートとして指定すること。


ただし、そのディレクトリ下指定がなければ配下にあるindex.jsに記述されているコンポーネントが描画される。

ex)
export default function Home() {
  return (
    <>
      <h1>Home</h1>
    </>
  )
}


# Dynamicルーティングについて(動的ルーティング)
掲示板のように、動的に生成されるリソースに対してのルーティングの仕方。

- ファイル名を連番で対応させたい時には、[number].js
- ディレクトリについても、[name]/
などと[]で囲むと、ダイナミック(動的に)に描画するリソースを自動的に判定してくれる。

- これらはある種ワイルドカード的に動作し、固定のディレクトリや、ファイル名がある場合には、そちらが優先される。
- 一階層にはダイナミックルーティングは一つだけ作成できる。

## JSのファイル内で、動的な値を取得する。
①特殊な関数getServerSidePropsをエクスポートする。(SSRの時に使う。)

e.g.)

export default function Setting({ hello }) {
  return <h1>[name]/Setting.js</h1>
}
export async function 
getServerSideProps(context) {
  console.log(context.query)
return {
	//この関数のreturnに指定される返り値の部分(propsのプロパティ)がコンポーネントの引数にわたされる。
    props: { hello: "こんにちは" }
  }
}

- さらに、動的に設定された値については（dynamicルーティング等）引数として受け取ることができるので、そのプロパティ.queryをつけると、取得できる。
e.g.)
export default function Setting({ hello, query }) {
  return (
    <>
<h1>[name]/Setting.js</h1>
//query : { name: "a" }なので、name プロパティを取得させて、、

      <h1>{query.name}</h1>
    </>
  )
}


export async function
// context.queryのプロパティだけを分割代入で取得している。
getServerSideProps({ query }) {

  return {
    props: { hello: "こんにちは",
            query//query: queryになるので省略
            }
}


② Nextの提供するuseRouterというフックを使用する。
e.g.)
import { useRouter } from "next/router";

useRouterを使用した返り値には、ルーティングに関する情報や動的に決まったパスに関する情報などが入ったオブジェクトなので、
e.g.)
  route: '/07_router/[name]/setting',
  pathname: '/07_router/[name]/setting',
  query: { name: 'a' }, //クエリパラメータに関するkey: valueもこちらで参照できる。
  asPath: '/07_router/a/setting',
  isFallback: false,
  basePath: '',
  locale: undefined,
  locales: undefined,
  defaultLocale: undefined,
  isReady: true,
  domainLocales: undefined,
  isPreview: false,
  isLocaleDomain: false
}


export default function Setting({ hello, query }) {
  const router = useRouter();
  console.log(router)
  return (
    <>
      <h1>[name]/Setting.js</h1>
      <h1>routeから取得されます。{router.query.name}</h1>
    </>
  )
}

以上のように<取得したオブジェクト>.query.name
と言うようにすることで取得可能である。



## useRouter
const router = useRouter();とした時に

- queryプロパティ
こちらは動的に生成されたパス名についての[key]とvalue。
クエリパラメータのkey=valueについて参照できる。
e.g.)



### 画面遷移に関するメソッド
- router.push("パス名", "/dummy=url")
第一引数にとった、パス名のページに遷移する。第二引数は(opt)でこの時にURLは見かけ上で表示することができる。(一応第三引数を取ることもできる。) 
//ブラウザの更新走らない。のでstateを保持できる。

- router.replace("パス名", "/dummy=url") 
pushのように画面遷移を行うが、挙動としては、現在のページを指定したパスのページに置き換えることになる。
この時、replace前のページは置き換えられるため、ブラウザバッグでも確認できなくなる。

- router.back()
ひとつ前の画面に戻る。
- router.reload()
画面を更新することができる。

e.g.)	
	const router = useRouter();
  console.log(router.query);
  const clickHandler = () => {
    router.reload()
  }
	return (
	<button onClick={clickHandler}>アクションによる画面遷移</button>
);



# Linkコンポーネントを使いこなす。
(client-Side Navigationをするためのコンポーネント)
aタグなどのように画面遷移行いたい時に使うコンポーネント。
ただし,Linkコンポーネントを使用するとブラウザの更新は行われない。
client-Side navigationとは、JavaScriptを使ったページ遷移(transition)で、ブラウザによる遷移よりも高速です。

//基本書式
import Link from "next/link";

<Link href="/07_router" as="/dummy_url">
	表示させたいテキスト
</Link>

- href: 実際に遷移したいパス名を指定

- オブジェクトを記載することも可能。
e.g.)//記載したパスに、クエリパラメータ付きで送信
<Link href={
	{ pathname: "/07_router", 
		query: { key : "value"}
	}
}>

- as: ブラウザのHTML上で表示させたいパス名を指定。



//Next.js 13から、 <Link><a></a></Link>のようにaタグをネストさせる必要がない。むしろエラーになるそうです。
cf)
https://nextjs.org/docs/messages/invalid-new-link-with-extra-anchor



## シングルコンポーネントによる複数画面を作成する方法
### クエリパラメータによる値の受け渡し。
import { useRouter } from "next/router";


export default function MultiPage() {
	const router = useRouter();
	//この部分でstepというクエリパラメータを毎度受け取る。
  const step = router.query.step ?? 0;
//実態としては`/08_multipage?step=${_step}`に指定したパス(pages)を描画し、asPathの値をダミーのURlとして表示する。
  const goToStep = (_step, asPath) => {
    router.push(`/08_multipage?step=${_step}`, asPath)
  }
  return (
    <div>
      {step == 0 && (
        <>
          <h3>Step {step}</h3>
          <button onClick={()=> goToStep(1, "/personal")}>Next step</button>
        </>
      )}
      {step == 1 && (
        <>
          <h3>Step {step}</h3>
          <button onClick={()=> goToStep(2, "/confirm")}>Next step</button>
        </>
      )}
      {step == 2 && (
        <>
          <h3>Step {step}</h3>
          <button onClick={()=> goToStep(0, "/08_multipage")}>Next step</button>
        </>
      )}
    </div>
  )
}



## ダミーURlへ直接ユーザからアクセスされた際にはどう対応するのか。
-> rewrites処理を加える。

e.g.)# next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
reactStrictMode: true,
async rewrites() {
return [
	{
		source: "/personal",
		destination: "/08_multipage?step=1"
	},
	{
		source: "/confirm",
		destination: "/08_multipage?step=2"
	},
	
]
}
}

source: ユーザから送信されるであろうパス
destination: 実際にnext側で処理したいパス
の二つを紐づける。


## コンポーネント間でステートを維持する方法
①useContextを使う。

1. コンテキストについての/src/context/AppContext.js
などとディレクトリとファイルを作成し、
コンテキストのための、設定を書き込む。
アプリ全体のコンテキストとして使用するために、トップレベルのコンポーネントを囲みたい。

->2. _app.jsの Componentsコンポーネントを作成したProviderで囲む。
e.g.)

return (
    <AppPrivder>
      <Component {...pageProps} />
    </AppPrivder>
);

3. stateを使用したい部分にて、useContextを呼び出す。

②Reduxを使用する。



# _app.jsでサイト全体に設定を加える
e.g.)
export default function App({ Component, pageProps }) {
  return (
        <Component {...pageProps} />
  );
}

- ページが初期化される際には、毎回このページを通る。
//Railsで言うところの、layout的な役回り
- グローバルに適応したいCSSファイルや、BootstrapなどのCSSフレームワークも読み込むなら、ここ！

例えば、aboutのページをレンダーする時にAboutコンポーネントを読みこむ場合について考える。

この時仮引数Componentに対しては、Aboutコンポーネントが渡される。
Aboutコンポーネントが、受け取る引数をpagePropsで受ける？


// nextが用意するHeadとScriptのコンポーネントを利用する。
```
import Head from "next/head";
import Script from "next/script";
```

- Headコンポーネント
HTMLの<head>タグの中に何かを追加したい時に使用するもの。
- Scriptコンポーネント
独自に<script>を仕込みたい時に使用するコンポーネント

- Headの使い方
<head>内の記述を書くことができる。複数書いても、統合されてHTMLとして表示される。
e.g.)
<Head>
	<title>ページのタイトル</title>
	<meta property="og:title" content="ページのタイトル"/>
</Head>

Scriptの使い方
素のHTMLの場合には、headの中にscriptタグを書いていたが、これだと、外部スクリプトの読み込みがパフォーマンスに影響を出す。(不要に読み込む等)
Scriptコンポーネントで外部スクリプトを組み込むときには、Headコンポーネントとは別にScriptコンポーネントを記述する。


e.g.)
const [load, setLoad] = useState(false);
<Head></ Head>
<Script src="/読み込みたいスクリプトのパスを指定する"
onLoad={() => {setLoad(true)}} 
onError={ e => {console.error(e)} 
/>

// Scriptコンポーネントのprops
- strategy
スクリプトの読み込みタイミングについて、指定できる。
{とりうる値}
1. beforeInteractive
2. lazyOnLoad: 優先度の高くないスクリプトをブラウザの処理が空いている時にロードする指定

- onLoad
ここには実行したいJSコードを記述する。ここに書かれた記述は、strategyのタイミングで読み込まれた後即時実行される。

### インラインでスクリプトを直書きしたい時
<Script dangerouslySetInnerHTML={{
		__html: `console.log("Inline Script")`
}} />



//外部スクリプトを呼び込んだり、インラインで書くことはあまりない。package.jsonなどを利用してパッケージとして読み込むことが多いよ






}


# Nextのレンダリングについて
- デフォルトでは、ネクストは全てのページをpre-renderingする(すべてのページのHTMLを事前に生成する。)

- この時、生成されるHTMLは最小限のJSコードが関連付けられており、ブラウザで実行された際に、そのコードを読み込むことでページを動的にしている。(hydrationと呼ばれている。)
- ちなみにLinkコンポーネントなどをつかって、別のページをpre-renderするような場合には、hydation(SGされたページに必要なJSが読み込まれた後に、ロードを始める。)

### レンダリングの種類
- CSR: Client Side Rendering
- SSR: Server Side Rendering
- SG: Static Generation(静的サイト生成)
- ISR: Incremental Static Regeneration(インクリメンタル静的再生成)	

### Next用いられる基本的な構成について
基本的なページについてはSGで、動的に作成するページについてはSSRを使う。
*SGを使うかの基準として一つ挙げられるとすれば、
 "Can I pre-render this page ahead of a user's request?"ということ。


## CSR
データを外部APIから取得することや、ルーティングなどを全てクライアント上で行うこと。
//ブラウザ(クライアント上)でReactが動作するイメージ
これまで行ってきたReact単体での開発はCSRに分類される。
//Nextを使用する際には、クライアント側で”のみ”行いたい処理は、useEffectで囲むことにする。

- SWR(react hook made by NEXT.js)
クライアントsideでデータを取得するような際におすすめされる。


## SSR
Node.js(サーバー)にリクエストが来たタイミングで動的にHTMLを生成
//node.jsでReactが動くイメージ
クライアントには、HTMLを返す。
{メリット}
SEOに強いね
{デメリット}
生成処理がサーバー側なので、サーバーの負担大きめ。

## SG
- "ビルド時"に、データフェッチやpropsの値の決定などを行い、HTMLを構築する。
- クライアントからのリクエストされたら、サーバー側で構築することなく、生成済みのHTMLを渡す。
{メリット}
SEOに強いね.表示速度が早い
{デメリット}
更新頻度の高い動的コンテンツとの相性が悪い。

###ISR
- ビルド時にHTMLを構築
- 一定時間後にアクセスがあった場合には、生成済みのHTMLを返す。
- その時にサーバ側ではHTMLを更新して
- 時間アクセス時には、更新済みのHTMLを返す。
{メリット}
SGと動的なコンテンツ更新もできる
{デメリット}
サーバの設定が少し手間
基本的にはVercelを用いると良いらしいよ。



# SSRの挙動について理解する

- Next.js上でコンポーネント(関数)は、ブラウザ上でも、node.js(サーバサイドでも)実行されている。
e.g.)//コンポーネントにconsole.logを吐かせるとわかる。

export default function SSR() {
  console.log("hello")
}

- Nextにリクエストが送信されると、
-> Node上でコードが実行され、JSXが返される
-> JSXがReact要素(JSオブジェクト)に変換されて -> HTMLとして補完されてから
-> ブラウザに対してレスポンスを返す。

//stateなどの場合にも同様で、サーバ上で値が挿入され、その後にHTMLとしてレスポンスを返している。


### Node上で実行できない機能。
windowオブジェクトを操作することはできない。
e.g.)// NG
window.document .... ❌

- 使用したい場合には、useEffectを使用すること。
(このhooksは必ずブラウザ上で実行される。)


### Nodeが実行されるか否か(サーバでレンダリングが行われるか)

- URLづたいのリクエストで、当該のページにランディングした時には、サーバ上でレンダリングが行われる。(初期表示の時)
- 他のページから遷移してきた際には、あくまでブラウザ上でコンポーネントが実行される(CSR)


# getServerSideProps
Node.js上で実行される関数。
pages/ディレクトリ下でのみ使用可能。


export async function getServerSideProps(context) {
	return (
		//同ファイル内のコンポーネントのprops(引数の値)として渡す値を設定できる。
		props: {
			key: "value",
		}
	)
}

- Next.js上でCSRする際に、ページとなるコンポーネントに渡ってくるはずのpropsの値は、getServerSidePropsのを介して、JSON形式でサーバーから渡される。

### getServerSidePropがとるプロパティについて
-  props
コンポーネントに対して、サーバを介して渡したいプロップスを指定
- redirect
コンポーネントに対してリダイレクト先を指定。



# SGの挙動について学ぶ
- SGとは Static Site Generationの略である。
- 外部データを必要としない場合には自動的に、SGが行われる。

- build後のファイルは、静的ファイル群はoutディレクトリ下に配置される。

## 使用するための設定をする
at package.json
//コマンドを追加
    "export": "next export"


## SGをエクスポートする際の注意点
実際に静的ファイルだけで、リンクを跳ぼうとする時には、.htmlの拡張子が必要になってくる。
がしかし、デフォルトでnextで指定するパスにはついていないので、エラーが起きる。
(ホームのページから遷移する時は、ブラウザ上でjavascriptが動作しているため問題ない。)

//next.config.js
にて、

```
const nextConfig = {
	trailingSlash: true,
}
//これによって、 nextがパス名にて、リンク先のファイルを探す際に、パス名/(つまりディレクトリ指定で探すことになる。)
これによって、具体的な.html拡張子付きのファイルを直接するのではなく、指定されたディレクトリのindex.jsを読み込むことでうまいこと行く。




## SGの際に利用するprops渡しの方法
- getStaticProps()(非同期関数async)
//getServerSidePropsとの制御の違い
- build時に実行される。
- この関数の中で、外部データをfetchする処理を記述し、propsとしてページに値を渡すことができる。

- この関数の戻り値が、data/ディレクトリ下にpageProps: { "key": "value"}の形でJSONデータとして渡されるので、
- 各ページコンポーネントでは、これらを引数として受け取り利用できる。
- JSを利用したページ移動の際には、ページの切り替えは、ビルドされたSGもしくはブラウザ側のJSがページを組み替えてくれる。その際に必要なデータだけをJSON(getStaticPropsによってビルド時に返された値)を取りに行くことになる。
- つまり、ビルド時に、必要な外部データを取るasync関数のresolveを待ってね！っていうことです。
//devモードではeach requestに対して実行されます。(開発体験をよくする目的)

// また、pageからのみexport可能です。(pageとはapp/pagesディレクトリ下のReactコンポーネント)
//なぜなら、Reactはレンダー前に全てのデータが必要になるためです。


# 動的なルーティングを持つ静的ページの生成
(ブログコンテンツ等)
1. [id].jsとなるページを作る(e.g. パラメ〜タはidでなくても良い。)
2. そのページ内で、ページをレンダーするコンポーネントを作成する。
3. getStaticPaths() を使って、idの部分となりうる値のarrayを返す(公式チュートリアルでは、ファイルシステム内のmdファイルを読み込んで、idにあてがっていた)
//この時オブジェクトを要素とする配列を返す必要がある。//params:キーも必須
e.g.)
return fileNames.map(fileName => {
	return {
		params: {
			id: fileName.replace(/.md$/, '')
		};
	};
};



4. getStaticPropsでデータをfetchする。同時ににidデータもプロップスから受け取る。context.paramsプロップスにリクエストされ、事前に動的生成しておいたidが格納されるので、、、
export async function getStaticProps(context) {
		console.log(context)
//context:{
//	{
//		params: { id: 'ssg-ssr' },
//		locales: undefined,
//		locale: undefined,
//		defaultLocale: undefined
//	};
//}
  const postData = getPostData(context.params.id);
  return {
    props: {
      postData,
    },
  };
}
	
	
	
## getStaticPathsについて
- ダイナミックルーティングを用いたSGの方法
//ダイナミックルーティングの場合には、名前が未確定なので、SGで静的ファイルをビルドできない。
e.g.)
export async function getStaticPaths() {
  return {
		paths: [ 
//idの値に文字列を指定する。
//これによって、動的に決定するパスに対しても、このページコンポーネントを返すようになる。(前もって予想して準備するイメージ)
      { params: { id: "1" }},
      { params: { id: "2" }},
  ],
    fallback: false
  }
}
getStaticPathsで渡されたpaths: [以下の内容については、fgetStaticPropsにcontextという引数で渡されている
//e.g.)
//コンソールで確認してみてね。
export async function getStaticProps(context) {
  console.log(context)
  return {
    props: {id: "1" }
  }
}


//さらに
- ディレクトリ名についてもダイナミックルーティングしたい時には、

params: {id: "1"}だけでなく、ディレクトリに当たる[]の内容も入力する必要がある。

- fallbackフラグについて
## nextのSGを使う時の２種類の立ち上げ方
1. npm build && npm export 
2. npm build && npm start
2.の場合には、fallbackフラグに気を止める必要がる。
そもそも、2.の場合にはNodeサーバーが起動することになります。この時,outディレクトリを参照しないことになります。(/*参照する時は.nextディレクトリ以下を参照することになる。*/)

## fallback: falseだと、
paths:[{ params: {id: "1"},,,,]のプロパティに指定されていないものはエラーになる。
(完全に動的なルーティングは許可しない)

## fallback: trueの時、
Node.js側で動的にページを作成してくれるらしい。
(-> .next/)
//実際にはnode上でgetStaticProps関数が呼び出されているということらしい。
その時、ページが作成されるまで、
router = useRouter();
router.isFallback //->trueになる。

ページが作成されると
router.isFallback //->falseになる。
これを利用して、loading中用のJSXを表示することができる。

e.g.)
import { useRouter } from "next/router"
export default function Page({ id }) {
  const router = useRouter();
  if (router.isFallback) {
    return <h3>now loading...</h3>
  }
  return (
    <h3>このページは{id}です。</h3>
  )
}

## fallback: "blocking"
- loadingの表示を設定せずに、読み込まれるまで
画面遷移を我慢する感じ。

# Catch-allルーティング
pages/posts/[...].jsでparamsを受け取るようにした時に
/posts/a, but also /posts/a/b, /posts/a/b/c and so on.でマッチするようになる。

# 404 pages
404ページをカスタマイズしたい時には、pages/404.jsページを作りましょう。


## ISRについて
SG & SSR
versel以外のホストサービス上だと、設定が面倒らしい。

e.g.)
```
export async function getStaticProps({ params }) {
  console.log("gets static props executed")
x  //特殊なデータ型を扱うためにtoJSON()でparse
  const date = new Date;
  return {
    props: {
      id: params.id,
      date: date.toJSON()
		},
		//5s経つと新たに静的ファイルを生成する。s
    revalidate: 5
  }
}



## 外部APIからデータを取得し、SGを生成する。
- NEXT.jsではfetch()をインポートすることなく、外部APIに対してアクセスできます。

axiosを使います。
e.g.)

export async function getStaticProps() {
  const ENDPOINT = "http://localhost:4030/articles/"
  const result = await axios.get(ENDPOINT).then(res => res.data);
  console.log(result);
  return {
    props: { articles: result }
  }}



















## エラーログ
Error: Image Optimization using Next.js' default loader is not compatible with `next export`.'

Next12,13辺りから、nextで提供されるimageコンポーネントにて、自動で画像のサイズを調整してくれるようになっているらしい。(next/imageはHTMLの拡張で、size optimize/rezeもしてくれる)
＠next.config.js
  images: {
    loader: "custom"
}

//として、Imageコンポーネント内にて

<Image loader={({src}) => src} src="/vercel.svg" alt="vercel" width={177} height={40} />
のように設定する。

- ここでやっていることとしては、独自のloaderを定義している。
- loaderは関数であり、propsとして渡されるのは、sourceのパス。今回はそれをそのまま返している。

# チュートリアルの情報だと、loader自体必要なさそう




## API Routesについて
next.js上で簡易的なAPIを作成するための機能。
getStaticPropsやgetStaticPathsから、API Routesを取得するのをやめましょう。代わりに、これらの関数の中で直接呼び出すコードを書くと良いでしょう。というのも、上記の関数はブラウザ上で実行されることも、公開されることもないからです。
//これは、実際のブラウザ上から直接APIに対してリクエストを送信させないようにする(隠蔽する)。このAPIを一枚噛ませることで、利用者からはnextのAPIにアクセスしているようにみせる。

- フォームの入力をhandleする場合に使う。
ユーザの入力値のエンドポイントとしてAPI Routesを使用し、その関数の中で、バックエンドへ送信するコードを書く。


api/ディレクトリに配下にファイルを配置する。
e.g.)
今回はhello.jsにしてみる
@ src/pages/api/hello.js
```
// req = HTTP incoming message,
// res = HTTP server response
export default function handler(req, res) {
  res.status(200).json({ name: 'John Doe' })
}
```

http://localhost:3000/api/hello
にアクセス(GETリクエストを送信すると)
設定したレスポンスが得られる。
// 200のステータスコードで、name: "john Doe"のJSONデータを取得できる。


今回は、json_serverからのレスポンスを受け取って、フロント側へ流すAPIを作成する。(プロキシ的)
e.g.)

import axios from "axios";

const JSON_SERVER_URL = "http://localhost:4030/articles";

export default async function handler(req, res) {
  try {
    if (req.method === "GET") {
      const result = await axios.get(JSON_SERVER_URL).then(_res => _res.data);
      return res.status(200).json(result);
    }
  } catch {}

  return res.status(500).json({
    error: {
      status: 500,
      code: "BAD_REQUEST",
      message: "不正なリクエストです。"
    }
  })
}

//今回は外部のjson_serverへのアクセスの結果を返してくれるAPI設計をしました。
ディレクトリでいう、pages/api/articlesへのGETアクセスによって、index.jsが読み込まれて、
その中にデフォルトとして設定されている関数が呼び出されれた結果が表示される。

これをページ内から呼び出すようにするには、
以下のようになる。
//ポイントとしては、ENDPOINTのURLがapi/routesのディレクトリを参照することになるので、同一オリジン。つまり省略してパスを記載できる。
//非同期な関数をuseEffectないで別途定義することで、呼び出しやすくする。

import axios from "axios";
import Head from "next/head";
import { useEffect, useState } from "react";

import ArticleList from "../../components/articleList";

export default function Page() {
  const [ articles, setArticles ] = useState([]); 
  useEffect(() => {
    const getArticles = async () => {
      const ENDPOINT = "/api/articles/"
      const result = await axios.get(ENDPOINT).then(res => res.data);
      setArticles(result);
    };
    getArticles();
  }, []) 

  if (!articles) {
    return <div>データがありません。</div>
  }
  return (
    <>
      <Head>
        <title>ページ一覧</title>
      </Head>
      <h3>API_routeを使う
      </h3>
      <ArticleList list={articles}/>
    </>
  )
}


## NEXT環境での環境変数
1. .env.<環境名>のファイルをプロジェクトトップレベルにて設定する。

2. 次に、process.env.<設定した変数名>として参照する。

e.g.)
const JSON_SERVER_URL = `${process.env.JSON_SERVER_URL}/articles`;


このようにすることで、動的に受けとた[id]などの値を受けて、対応するページを返すように設定できる。











// Styling tips
clsxライブラリ:
クラス名をトグルできるライブラリ
```bash
$ npm install clsx
$ yarn add clsx
```
