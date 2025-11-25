	# TypeScript
JSを拡張したプログラミング言語

## 特徴
1. JSに変更してから実行される。
//TSはブラウザでは実行できない。
2. 型の定義が可能。
3. JSにはない記述が可能

- tscコマンドによって、明示的に変換できる。
- フレームワークを用いる際には、babelやwebpackによってJSに変更される。


## 導入方法
``` TypeScript CLIを使う方法

$ npm install -g typescript 
```

``` React ProjectとしてTSを使う時

$ npx create-react-app <プロジェクト名> --template typescript
```

# tsconfig.jsonxファイル
TSからJSへトランスパイルする際の設定を指定するファイル


# tscコマンド
TSファイルをJSにトランスパイルするコマンド

# reactプロジェクトにおけるトランスパイルは、src以下のディレクトリはwebpackによって自動的に変換してくれるらしい。





# プリミティブ
TypeScriptが扱うことの出来る基本的な値のこと
e.g.)
文字列(string)、
数値(number)、
巨大な数値(bigint)//ES2020以降の仕様、
真偽値(boolean)、null、undefinedなどがある

### 超基本的な記述
let <変数名>: <型> = <代入値>;
e.g.)
let str: string = "hello world";
//型宣言はなくても動作はする。

### 型注釈(type annotation)
コンパイラにヒントを与えるための仕組み。いわゆる変数などの型を定義することを、型注釈(type annotation)と呼ぶ。
e.g.)
text: stringでいう。": string"の部分。



# リテラル型(literal_types)
型の中でも,リテラルに一致する値のみを許可する。
e.g.)
  let trueVal : true = true;
	trueVal = false; //❌

  let num123: 123 = 123;
	num123 = 3 //❌ 123 のみ受け付ける



# ユニオン型(union_types)
複数の方を組み合わせて、「型Tと型U」 などのような、「または」の意味を表すことができる。(T | U )
e.g.)
let strOrNumOrBool : string | number | boolean = " hello";
  strOrNumOrBool  = true;
  console.log(strOrNumOrBool)
//stringもしくはnumber、booleanを許可する変数。

let helloOrNumOrBool : "Hello" | number | boolean = "Hello";

//typeキーワードで型定義することをできる。
//型の名前はUpperCamel

e.g.)
type HelloOrNum = "Hello" | number;
conse hello: HelloOrNum = "Hello";

e.g.)
// | "Monday"の部分の最初のパイプは文法上は不要です。

  type DayOfWeek =
    | 'Monday' 
    | 'Tuesday' 
    | 'Wednesday' 
    | 'Thursday' 
    | 'Friday' 
    | 'Saturday'
    | 'Sunday'

    const day: DayOfWeek = "Monday";


# 配列やオブジェクトの型定義

## 配列の型定義
//基本書式
1. const 変数名: 型[] = 値;
2. const 変数名: Array<型> = 値; //ジェネリック型

e.g.)
  const arry1: number[] = [1,2,3];
  const arry2: string[] = ["hello", "bye"];
  const arry3: Array<number> = [1,2,3];
  const arry4: (string | number)[] = [1,"byebye"];
	const arry5: Array<number | string> = [1,"hello"];



## オブジェクト
  //基本的にはプロパティの過不足を許容しない
  const obj1: {name: string, age: number} = {name: "masanao", age: 1};
  
  // typeキーワードでの例
  // プロパティのkeyに対して?をつけると、そのプロパティの不足を許容するようになる。
  // 存在しないプロパティにアクセスする場合に、JSだと -> undefinedだが,
  //TSの場合にはエラーになる

  type Person = { name: string, age?: number}
  const obj2: Person = {name: "masanao"};
  //オブジェクトを要素として持つ配列の型定義
  const users: Person[] = [
    {name: "masanao"},
    {name: "karin"},
    {name: "hana", age: 200},
  ]
  console.log(users);
  //上記の型定義は以下と同義
	const users: { name: string, age?: number}[] = [];




## TSの型推論(暗黙的な型定義)
- 型をある程度推定してくれる機能
- //基本的には、明らかに型が分かるような場合の型定義は型推論に任せるようにする
- //オブジェクトのオプションや外部に送るようなものには、明示的に型を宣言すること。
e.g.)
let str: string = "hello";
//これを
let str = "hello";

//オブジェクトについてもある程度、暗黙的に型定義してくれる。
let obj = { name: "taro", age: 10 };

- constを使った場合には、リテラル型として定義される。
  const bye = "bye"; //bye: "bye"型
	const number = 123; // number: 123 型


# type文
type文を用いて型に別名を付けることができる。これを 型エイリアス(type alias) と呼ぶ
//命名規則としてはパスカルケース(UpperCamel)

e.g.)
type User = {
    name: string,
    age: number
	}

  const user: User = { name: 'Taro', age: 10 }


- あくまでtype(型)のまとまりに別名をつけるニュアンスなどの以下のようなこともできる。
e.g.)
//それぞれの型を定義して
	type UserName = string;
  type UserAge = number;
  type UserGender = "man" | "woman" | "others";
//ユーザのプロフィールobjectに関する型をまとめた。
  type UserProfile = {
    name: UserName,
    age: UserAge,
    gender: UserGender
  };
  const userProfile: UserProfile = {
    name: "hanako",
    age: 22,
    gender: "others"
};



# 関数に対する型情報(function_type)
//関数の引数については型推論は行われないので、常に明示的に型定義をする必要がある。
## 関数の引数について
e.g.)
function sum1(x: number, y: number) {
    return x + y;
}	
//アロー関数の場合
const sum2 = (x: number, y: number) => x + y;

- TSの場合には、引数の個数も過不足なく必要です。引数の数が違うとエラーになる。
{回避法}
1. 引数にデフォルト値を渡す。
  function sum1(x: number, y: number = 1) {
    return x + y;
}
2. ?をコロンの前につける。
  function sum1(x: number, y?: number) {
    return x + y;
}
この時y?の時,型情報としては number | undefined　型として扱われる。


## 関数の戻り値について
TSでは、関数の戻り値は、ある程度であるが型推論が行われる。
- 明示的に戻り値の型を定義する
//引数の()の後ろに:<型>の形で定義する
e.g.)
  const sum2 = (x: number, y: number):number => x + y;
  const result2 = sum2(10,30);
console.log(typeof(result2));


## :void型
戻り値の型がvoidの関数は、戻り値を持たないことを意味する。


## typeをつかって関数自体の型情報を定義することもできる。
可読性が低くなるので、あまり使われません。

e.g.)
  type Sum = (x: number, y: number) => number;
//これはあくまで型情報の定義なので、関数ではない。
定義した型を利用するには、関数名の後に :で追加する。
  const sum3: Sum = (x,y) => x + y;


# ジェネリクス

ジェネリクスとは、型引数(type parameters)を受け取る関数を作る機能のこと。
//ジェネリック医薬品のようなイメージ
<T>というように引数の手前に、変数(型引数)をさらにとるようにして、関数を呼び出す際に、変数に受け取る型を指定する。
型引数には、大文字が慣習的に用いられる。
//また、型引数を取らなくても、関数自体の引数の型推論によって指定する必要がない場合もある。


e.g.)
const Example = () => {
  const repeatStr = (value: string, times: number): string[] => {
    return new Array(times).fill(value)
  }
  const repeatNum = (value: number, times: number): string[] => {
    return new Array(times).fill(value)
  }

  const repeat = <T>(value: T, times: number): T[] => {
    return new Array(times).fill(value)
  }

  const strArray = repeatStr("hello", 3);
  const numArray = repeat<number>(10, 3);
  console.log(strArray); 
  console.log(numArray);
};

export default Example;


## 関数コンポーネントにたいして型定義を行う。
コンポーネント名に続く形で、: React.FCの型宣言をする。
React.FCとは、Reactのネームスペースで囲まれた、FC(Functional Component)型を利用するということになる。
e.g.)

const Hello: React.FC  = () => {
  return <h1>Hello TypeScript</h1>
};

export default Hello;


## propsに対して型定義を導入してみよう。
<>を使った型引数の部分に対して、propsに対応する型情報を渡す。

e.g.)
//型エイリアスを用いて、textというキーでstring型の値を持つオブジェクトの型情報を定義する。
type HelloProps = {
  text: string
}

//定義した型情報をReact.FCの型引数<>として渡すことで、その関数型コンポーネントのpropsの型情報を定義することができる。

const Hello: React.FC<HelloProps>  = (props) => {
  return <h1>Hello {props.text}</h1>
};

export default Hello;


//実際には、index.d.tsファイル内にて、
    type FC<P = {}> = FunctionComponent<P>;

    interface FunctionComponent<P = {}> {
        (props: P, context?: any): ReactElement<any, any> | null;
        propTypes?: WeakValidationMap<P> | undefined;
        contextTypes?: ValidationMap<any> | undefined;
        defaultProps?: Partial<P> | undefined;
        displayName?: string | undefined;
}

このようにして、FCのPに対して、
渡ってきたジェネリクスの型情報が、propsとして扱われるように定義されている。そのため、利用者都しては、ジェネリクスに対して、オブジェクトの形で型情報を与えることで関数コンポーネントのprops似たしても型情報を付与することができる。



## childrenプロパティについての明示的に型定義する。
React18から、FCでは、childrenプロップスに対して明示的に型定義をする必要がある。

e.g.)

type HelloProps = {
  text?: string,
  children?: React.ReactNode
}


## cf)btnコンポーネントの作成と、関数をpropsとして渡す際の型情報の定義について
e.g.)
type FnProps = {
  fn: (text: string) => void
}

export const Btn: React.FC<FnProps> = (props) => {
  return <button onClick={() => props.fn("TypeScirpt")}>ボタン</button>
};



## classを用いた型定義の仕方

TypeScriptにおいては、クラスのコンストラクタの引数だけでなく、そのクラスのメンバ変数の値についても、型を明示的に宣言する必要がある。
//また、変数の可視性？アクセス権についても明示的に宣言する必要がある。

e.g.)

class User {
  public name: string = "初期値";
  private age: number;
  // protected

  constructor(name: string, age: number) {
    this.name = name;
    this.age = age;
  }
}



## Eventの型定義について
onClickなどの際に渡ってくる(e) =>{}のeの部分の型定義について。


- eventプロップスをコンソールで表示するとわかるが、基本的にはonClickによるMouseEventの型情報や、onChangeの際にはChangeEventという型情報が定義されている。

e.g.)//onClickプロップスに直接定義した場合には、暗黙的に定義される
<div onClick={(event) => console.log("MouseEvent", event)}>divタグ</div>

e.g.)//明示的に型を定義する場合
const clickHandler = (event:React.MouseEvent<HTMLButtonElement, MouseEvent>) => console.log(event)

//面倒な場合には,anyとしても良いよ。



## useStateでの型定義について

e.g.)
type User = {
  name: string,
  age: number,
}
const Example = () => {
  const [text, setText] = useState("hello");
  const [animals, setAnimals] = useState<string[]>(["dog", "cat"]);
  const [users, setUsers] = useState<User[]>([{name: "Tom", age:22}])
};


通常の型定義と同様に扱えるが、ジェネリクスを利用することで、typeによる型エイリアスを使用した型の宣言も可能になる。
上の例では、User型という、二つのプロパティをもつオブジェクトの配列が代入されるように型の宣言をしている。
//オブジェクトの配列が入るようば場合には、type文を使った型エイリアスを利用すると良い。


# 型アサーション
asを使う




## TSテスト
インストールが必要なパッケージは、次の3つです。

1. jest
2. ts-jest
3. @types/jest

e.g.)
$ yarn add -D jest@^28.0.0 \
ts-jest@^28.0.0 \
@types/jest@^28.0.0


- JestでTypeScriptをテストできるようにする。
//jest.config.jsをいじりたいので、当該ファイルを生成する。

```
$ yarn ts-jest config:init
```






# ES_lint
コードの書き方の取り決めは「コーディング規約(coding standards)」と呼ばれます。
これを取り入れることで共同開発をよりやりやすくする。

### コンパイラとリンター
両者共に、コードのチェック機能を持ちます。そのため、機能としては重複する部分もあります。(e.g)コンパイラオプションnoUnusedLocalsを有効にすると、未使用の変数をチェックできます。)

- コンパイラは型チェックに特化している。
- リンターはインデントや命名規則などのコーディングスタイルや、どのようなコードを書くべきか避けるべきかの意思決定、セキュリティやパフォーマンスに関する分野でのチェックが充実しています。\


## ESlintを手動で導入する。
```
$ yarn add -D 'eslint@^8'

```


## 設定ファイル".eslintrc.js"を設定する。
- root
eslintコマンドを実行したディレクトリを起点に、ディレクトリをさかのぼって設定ファイルを探す仕様がESLintにはあります。たとえば、ディレクトリ/a/b/でコマンドを実行した場合、ESLintは次の順で設定ファイルを探します。
1. /a/b/.eslintrc.js
2. /a/.eslintrc.js
3. /.eslintrc.js

この探索はルートディレクトリに達するまでさかのぼります。探索中に複数の設定ファイルが見つかった場合は、設定内容がマージされていきます。この仕様は便利な反面、プロジェクト外の設定ファイルまで見にいってしまう危険性もあります。設定ファイルの探索範囲をしぼるためにも、rootにtrueを設定するのがお勧めです。これがある設定ファイルが見つかると、これ以上ディレクトリをさかのぼらなくなります

- env
envはチェック対象のJavaScript/TypeScriptコードがどの実行環境で使われるかをESLintに伝えるためのオプションです。これを設定すると、ESLintがグローバル変数を認識するようになります。たとえば、browser: trueを設定すると、windowやalertなどのグローバル変数が認識されます。es2021を設定すると、ES2021までに導入されたグローバル変数が認識されます。他にもnodeなどの指定ができます。指定できる実行環境の一覧は公式ドキュメントをご覧ください。
https://eslint.org/docs/latest/user-guide/configuring/language-options#specifying-environments

parserOptions
- ecmaVersion 
ECMAの利用するバージョンを指定する。envにて指定されている場合には省略することができる。

- sourceType
JavaScriptにはスクリプトモードとモジュールモードがあります。sourceTypeはJavaScriptコードがどちらのモードで書かれるかを指定するオプションです。モジュールモードでは、import文やexport文といった追加の構文がサポートされます。sourceTypeのデフォルト値は"script"(スクリプトモード)です。実務で開発する場合は、モジュールモードでJavaScript/TypeScriptを書くほうが普通なので、sourceTypeには"module"(モジュールモード)を指定しましょう。


#ESlintのルールを設定する。
ESLintには「ルール(rule)」という概念があります。ルールはチェックの最小単位です。たとえば、ルールには次のようなものがあります。
e.g.)
no-console: console.logを書いてはならない
camelcase: 変数名はキャメルケースにすること
semi: 文末セミコロンは省略しない

cf)公式のルール一覧
https://eslint.org/docs/latest/rules/

- rulesは、ルールは.eslintrc.jsのrulesフィールドに、ルール名: 重大度のキーバリュー形式で書きます。
e.g.)
module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
  },
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
},
//この部分がコンソールlogなどを残してはいけないというルールを設定している。
  rules: {
    "no-console": "error",
  }
};

e.g.2)//プロパティ名に限って、キャメルケースを強制しない例
camelcase: ["error", { properties: "never" }],


e.g.3) semiによる文末セミコロンの有無
  rules: {
    semi: ["error", "always"],
},


### ルールの重みづけ
ルールには、重大度(severity)という重み付けが設定できます。重大度は、off、warnとerrorの3種類です。offはルールを無効化し、チェックを行わなくする設定です。warnは発見した問題を警告として報告します。報告はするものの、eslintコマンドの終了コードには影響しません。errorは発見した問題をエラーとして報告し、終了コードを1にする効果があります。それぞれの重大度は、0から2までの数値で設定することもできます。


## ESlintの実行
```
$ npx eslint src(対象ディレクトリ)
```


## ESLintの自動修正コマンド
--fixオプションをつけて実行する。
```
$ npx eslint <対象ファイル名> --fix
```


## shareable configを利用して、パッケージングされたコード規約を一括で適用する。

https://typescriptbook.jp/tutorials/eslint#shareable-config%E3%82%92%E5%B0%8E%E5%85%A5%E3%81%99%E3%82%8B

e.g.)
Airbnbのshareable configを利用する。

```bash
yarn add -D \
  'eslint-config-airbnb-base@^15' \
'eslint-plugin-import@^2'
```

その上で、設定ファイルにて以下を追記する。

```@.eslintrc.js

extends: ["airbnb-base"],
```


- これらの設定の上書きの仕方について
エラーを吐かれたルール名について、
rules: {}の項目で上書きする。
e.g.)//import/export をdefaultで行うのをoffにして、stringのquotesについて、""を容認する。

module.exports = {
	extends: ["airbnb-base"],
		rules: {
			"import/prefer-default-export": "off",
			quotes: ["error", "double"],
		},
};


- ルール無効化コメントを使用して、部分的にルールを無視する。



# TypeScriptを使って、ESlintを用いる。
step1. ディレクトリを用意する。

step2. TypeScriptの導入を確認
```
$ yarn add -D 'typescript@^4.6' '@types/node@^16'
```

step3. TypeScript ESLintを導入する
ESLint本体とTypeScript ESLintの両方をインストールします。

```
yarn add -D \
  'eslint@^8' \
  '@typescript-eslint/parser@^5' \
	'@typescript-eslint/eslint-plugin@^5'
```\
//
@typescript-eslint/parserは、ESLintにTypeScriptの構文を理解させるためのパッケージです。@typescript-eslint/eslint-pluginは、TypeScript向けのルールを追加するパッケージ


# TypeScript向けのshareable configを導入する
コーディング規約Airbnb JavaScript Style Guideに準拠したshareable configをインストールします。

```bash
yarn add -D \
  'eslint-config-airbnb-base@^15' \
  'eslint-plugin-import@^2' \
'eslint-config-airbnb-typescript@^17'
```
- eslint-config-airbnb-baseはJavaScript向けのshareable configです。
- これを上書きして、TypeScript ESLintのルールを追加したり、TypeScriptコンパイラがチェックするためESLintでチェックする必要がないルールを除外する設定を加えるのがeslint-config-airbnb-typescriptです。

- eslint-plugin-importは依存関係上、導入が必要なパッケージです。


# TypeScript ESLintの設定ファイルを作る
2つの設定ファイルが必要になります。
tsconfig.eslint.json
.eslintrc.js

## tsconfig.eslint.json
TypeScript ESLintは、チェック時に型情報を利用するために、TypeScriptコンパイラを使います。その際のコンパイラ設定をtsconfig.eslint.jsonに書きます。コンパイラ設定は、tsconfig.jsonの内容をextendsで継承しつつ、上書きが必要なところだけ記述していきます。


TypeScriptファイルに加えて、ESLintの設定ファイル.eslintrc.js自体もESLintのチェック対象に含めたいので、allowJsの追加とincludeの上書きをします。

tsconfig.eslint.json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "allowJs": true
  },
  "include": ["src", ".*.js"]
}
".*.js"は、.eslintrc.jsなどドット始まりのJSファイルにマッチするパターンです。
jest.config.jsなどの導入も見越して、*.jsをあらかじめ追加することも良い。


TypeScriptを使った、.eslintrc.jsの設定ファイル例
e.g.)

module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  env: {
    browser: true,
    es2021: true,
  },
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    project: "./tsconfig.eslint.json",
    tsconfigRootDir: __dirname,
  },
  ignorePatterns: ["dist"],
  extends: [
    "airbnb-base",
    "airbnb-typescript/base",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
  ],
  rules: {
    "import/prefer-default-export": "off",
    "@typescript-eslint/quotes": ["error", "double"],
  },
};


- parser: 
parserで設定したパーサーを使って、ESLintはJavaScriptやTypeScriptの構文を解析します。上の例では、TypeScriptパーサーを指定しています。この指定がないと、ESLintはTypeScriptを解釈できず、エラーが発生します

- plugins:
ESLintは公式が提供するルールに加えて、第三者が作成したルールを使うこともできます。第三者が作成したルールはプラグインという形で公開されています。このpluginsフィールドにプラグインを追加すると、ルールが追加できます。上の例では、TypeScript ESLint独自のルールを追加するために、@typescript-eslintを設定しています。

- parserOptions:
projectとtsconfigRootDirはTypeScript ESLint独自のオプションです。tsconfigRootDirはプロジェクトルートの絶対パスを指定します。project、ESLint実行時に使うコンパイラ設定ファイルをtsconfigRootDirからの相対パスで指定します。これらの設定は、TypeScript ESLintが型情報を参照するために必要な設定です。


__dirname: 現在のディレクトリ名を表す特殊な変数

- ignorePatterns:
ignorePatternsはESLintのチェック対象外にするファイルやディレクトリを指定するオプションです。TypeScriptプロジェクトでは、コンパイルで生成されるJavaScriptは、リントしないのが普通です。なので、distディレクトリをチェック対象外にしておきます。


- extends: 
extendsはshareable configを使うための設定です。①は、JavaScript向けのルールです。これを拡張してTypeScript ESLintのルールにも範囲を広げたのが②です。①と②は上の順番でないと正しく設定されないので注意してください。

③はTypeScript ESLintが提供する推奨ルールセットで、型情報を要するルールを含みます。このルールセットでどのルールが有効になるかは、公式ドキュメントをご覧ください。



typeof (TS)演算子
TSにおけるtypeof演算子は、変数やプロパティの方を参照することができる。