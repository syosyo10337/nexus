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
コンパイラにヒントを与えるための仕組み。
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




# 非null assertion 

undefinedでないことをTypeScriptコンパイラに伝えます。

例えば、次のようなコードがあったとします：

typescript
Copy code
let s: string | undefined;
s = "hello";
console.log(s.length);  // Error: Object is possibly 'undefined'.
ここでは、sはstring型またはundefined型を持つことができ、したがってs.lengthはundefinedの可能性があるため、エラーが発生します。

しかし、コードの論理により、ある時点でundefinedではないことが確定している場合（例えば、sに値が代入された後など）、非nullアサーション演算子!を使用してエラーを回避することができます：

typescript
Copy code
let s: string | undefined;
s = "hello";
console.log(s!.length);  // No error



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