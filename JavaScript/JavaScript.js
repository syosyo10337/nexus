# immutableとmutable
## immutableな値
書き換えが不可（元の値は変わらない）
e.g.)
//primitive型
文字列、数値、BigInt, 真偽値, undefined, シンボル
 ❌ "masanao"[2] = "A";

## mutableな値
イミュータブルな値以外。オブジェクトや配列

### immutableな値の変更
e.g.)
let val = 0;
val = 1;
//変数の参照する先が変わっているだけで、メモリの中で今の変数valに対して、格納される参照の先が1に変わっただけ。

### mutableな値の変更
e.g.)
let val =[1,2,3];
val.push(4);
//変数名が意味する参照先が変更されるわけではない。変数名が参照するものが参照する先が変更(追加など)されているだけ。

### immutabilityの保持
mutableな値をimmutableのように扱う。
e.g.)
let val = [1,2]
val = [..val, 3]
//valが参照する先が、新しくなっている。ただ、元々valに参照されていた値に変更は加えていない。


//Math.〇〇 --> Math という名前空間の中にある〇〇関数という使い方ができる。

- プリミティブ型
そのプログラミング言語に最初から用意されている変数の型のうち、基本的な型っぽいやつ。int型やchar型のこと
- オブジェクト型
オブジェクトとはプロパティ（値）とメソッド（操作）の集まりです。
" ラッパーオブジェクト
なお、数値、文字列、論理値といったプリミティブ型をオブジェクトとして扱うデータ型が用意されています。それれらの型をラッパーオブジェクトと呼びます。"
Number
String
Boolean

https://qiita.com/makotoo2/items/9566cebf205ef8b42505



# 文字列(String)の扱い
---
- strとcharを区別しない。
- ''もしくは""で囲まれたものを文字列リテラル(string literalと呼ぶ。)
- 文字列中で、'',""に干渉する場合は、特殊文字(\n-改行,\t-tab,\文字-文字列として扱う)を使ってエスケープ処理を行う。
e.g) console.log('it\'s me');
もしくは、'',""を使い分ける。

// 文字のエスケープとは、その文字が、コードではなく、文字列の一部であるとブラウザーに認識させる書き方です。
*文字列の連結 --「+」記号を用いて、文字列同士を連結できる。ex)"にんじゃ" + "わんこ" =>「"にんじゃわんこ"」
*// Unicode のコードポイントを使って、文字を出力することができる
console.log('\u3042');
//=> あ



## 型強制(type coercion)
JavaScriptにおいて、異なるデータ型を持つ2つの値の演算結果がエラーならない場合に発生する仕組み。
e.g)
'文字列' + 数値 を +オペレータで操作する時に、暗黙の型変換によって、文字列に変換される。

### 明示的に型を変換する

- Number()関数
	渡された文字列？をすべてnum型に変換する関数。
- .toString()メソッド
	全てのnumが持つメソッドの一つで、文字列に変換する。


## テンプレートリテラル(template literals)
文字列構文の一つで、
バッククォート（`）によって囲まれた文字列の中で,プレースホルダーと呼ばれる${定数または変数}を記すと、文字列の中に定数や変数を埋め込むことができる。
また、ソースコード中の改行をそのまま、再現できる。

# {文字列操作のメソッド(Stringオブジェクトのメソッドとプロパティ}

```
let browserType = 'mozilla';

//長さを調べる
browserType.length;

//配列のように[]indexで文字列から文字を参照(get)することはできるが、代入はできない。->Stringはimmutableなので
//0-based
browerType[2];

//文字列の最後の文字を取り出したい時
browserType[browserType.length-1];

//NG immutableなStringに対してsetできないよ。
browerType[2] = "no i can't ";

```

### 部分文字列抽出
- (indexOf)
もし対象の文字列中に部分文字列が見つかった場合、このメソッドは部分文字列のインデックス位置を表す数値 (対象の文字列上で部分文字列が始まる文字数) を返します。もし対象の文字列中に部分文字列が見つからなかった場合は、-1 の値を返します。


```
browserType.indexOf('zilla');
```

- 特定の文字列が含まれているかについて調べるより効果的な方法は、
indexOfが一致するものがない場合に-1を返すことを利用した条件分岐をさせること。
```
if(browserType.indexOf('mozilla') === -1) {
  // もし部分文字列 'mozilla' が含まれていない場合の処理
}

if(browserType.indexOf('mozilla') !== -1) {
  // もし部分文字列 'mozilla' が含まれている場合の処理。
}
```

- slice(indexStart[, indexEnd])
  /substring(indexStart[, [indexEnd])
文字列の開始位置と終了位置がわかっている場合に、そのindexを指定して、抽出する。indexEndを指定しないと、開始位置から文字列の最後までを抽出する。
切り出された部分の文字列を返す。
```
browserType.slice(0,3);
//>'moz'
//なぜならば0-m 1-o 2-z 3-i...というようにコンピュータ上では対応付けされているため、(0,3)で指定すると0--3の間にある文字列を抽出できる。

- toLowerCase()/toUpperCase()
引数として渡された文字列のすべての文字の大文字・小文字を切り替えます
```
let radData = 'My NaMe Is MuD';
radData.toLowerCase();
radData.toUpperCase();
```

- 文字列の置換 replace(substr, newSubstr)
文字列を対象のとった場合には、最初に一致したもののみを変換する。すべて変換させたい場合には、replaceAllを使うこと。
変数の破壊的変更は行わないので、変数自体の値を変更させたい時は
```
browserType = browserType.replace('moz','van');
```
cf)
https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/String/replace


## {文字列の操作}
- join() 
配列の要素を文字列として結合する。引数にとった値区切り文字として使う。defaultは(",")区切り

- split()
文字列を引数にとった文字列を区切り文字として分割して、それを配列にする。そうした配列を分割代入で、別々の定数に入れたりする。
e.g))
const d = [2019, 11, 14];
console.log(d.join('/')); //->'2019/11/14'

const t = '17:08:24'
const [hour, minute, second] = t.split(':')
//hour, minute, secondに対して、分割代入している。


- includes()
Arrayオブジェクトにも同名のメソッドが存在する。
Stringオブジェクトで用いた場合には、第二引数でとった文字列を、レシーバー側の一部になるかを判定する。ある場合にはtrueを返す。/なければfalse

- Array.prototype.includes()
こちらの場合には、単に配列内の要素で第二引数にとった値を持つかどうか？という視点で判断される。


# 数値型(number)の扱いについて
---

//整数も小数もこの型に当てはまる //一応BigIntもあるみたい。　
- integer
- float
- double
## 算術演算子(operator)
+ - * / で %は余り,**でべき乗を表現できる
ex)
// 有効数字 16 桁で 17 桁目が以降を丸めた数になります
console.log(1 / 30000000);
// Infinity は正の無限大という意味です
console.log(1 / 0); #=> Infinity
// NaN は、Not a Number という意味です
// 0 で割った時は、言語によって仕様が異なります
console.log(0 / 0); #=> NaN
10 /8 > 1.25

## increment/decrement演算子
++と--
//この演算子は数値に直接使用できない。変数に対して新しい値を代入する。

```
let num1 = 4; //変数の初期化をして
num1++; //> 4 //これは、num1が現在の値(4)を返して、その後に行く裏面とを実行しているから。

//以下のように先にインクリメント処理をした値を返すこともできる。
++num1 === num1 = num1 + 1;

## 代入演算子
+= 加算代入
-= 減算代入 etc... 右辺の値を左辺の変数値に加算してから新しい値を返す。


## 比較演算子
厳密等価演算子(===)は、データ型のレベルでの同値性を判定する。
(==)は、16 == "16" //>trueを返す



*小数のE表記 --JSでは小数のE表記に対応している。
ex)console.log(1.23456E4)
//=>12345.6

---
#使えるメソッド一例
```
//数を引数にとった値分だけ固定小数点表記に整形する。
Number.prototype.toFixed() 

//数値データ型への変換
e.g.)データがフォーム入力に入力され、input タイプが text である場合など。
```
//string + number => stringになる例
let myNumber = '74';
myNumber + 3;
> '743'

//Number()コンストラクタで修正する
Number(myNumber) +3 ;
もしくはparseInt(文字列)を入力して




**Undefined --undefined (定義されていないデータ型)
**Null --null (何もない)
# 真偽値とBooleanオブジェクト
真偽値とは、true/falseのこと。

Booleanオブジェクトは、真偽値のオブジェクトマッパーです。

- Boolean()関数
引数に対して、falsy/truthyを判別して論理値を返す。

# truthy/falsy

## {falsyな値(falseと見做されるもの。)}
false
0 (数字)
0n (big int)
"" (空文字)
null
undefined
NaN (Not a Number)
## truthy それ以外の値。


# short circuit(短絡評価)
評価式全体の評価が決まった時点で、その値を返すこと。
//Rubyと同じ

## 論理積()
評価する値がfalsyになるものがあった時点で、評価が終了し、その時点で評価されていた値を返す
e.g.)//ショートサーキットを利用して、変数に特定の値を格納する例。


```
const resultA = "" \ "foo";
const resultB = 2 && 1 && 0 && 3;
const resultC = "foo" && 4;

console.log(resultA); //-> null
console.log(resultB);	//-> 0
console.log(resultC);	//-> 4

```

## 論理和
評価する値がtruthyなものがあった時点で、評価が終了し、その時点で評価された値を返す。



- isNaN()関数。引数にとった値が数値かと判定する。NaN(not a number)なら、trueを返し、数値であればfalseを返す。


**オブジェクト(Object) --{a:3, b:5}
**配列(Array)





## typeof 
データ型をしらべるメソッド 
で出力もできる。console.log(typeof 調べたいもの);

## Object.is(value1,value2)
2つの値が同一値であるかを判定する。(同値性ではなく、同一性ってこと？)
//型変換も行わないよ。
e.g.)
Object.is('',false) //-> false
"" == false //--> false


--


*JavaScriptでは数字からなる文字列も数値に変換して演算できてしまいます。但し,+は文字列の連結とみられるので例外。文字列の連結ではなく、足し算にしたい(つまり、文字列を数値としてみたい）場合は次のようにする。
ex)console.log(parseInt('5',10) + 3); --'5'を10進数のIntegerに解析する
また、数値に変換できない値にparseInt()命令をすると、
ex)console.log(parseInt('hello', 10)); =>「 NaN 」となる。Not A Numberの略で数字型の一種になるらしい。
*単一の値で、falseと評価されるものがある。(0, null, undefined, ""-空の文字列,false)これら以外は全てtrueと評価される。


---------------------------------------------------


***[定数と変数]---------------------------------
変数にはなんでも格納できる。

- 変数はまとめて定義することもできるらしいよ。
  const val1 = 2, val2 = 4;


*変数の更新 -四則演算を用いた値の更新の記法
let price = 500;
price = price + 100 => price += 100;
+= 1;の場合のみさらに,price++, price-- が使える。
+= のことを加算代入演算子という。　


---

# ブロックスコープ
{}によって囲むとそこにブロックスコープを発生させる。その中で宣言された変数のスコープを決めることができる。

***[条件分岐]-----------------------------------
*論理演算子 --戻り値はboolean
a && b(AND) ex) if (score >= 80 && name === "masa") {}
a || b(OR)
a ! b(NOT)
*等価演算子(a == b,a != b)		
--aとbが等しい時、a == b -> true, aとbが等しくない時 a != b ->trueとなる。
また、JavaScriptで等価演算子だと文字列も中身が数字であれば変換され 12 = "12" => trueとなってしまうので、それらも区別にしたい場合には厳密等価演算子を用いるex)a === b a !== b



# if statements
//{ }で囲った部分をブロックと言い、命令がブロックで終わる場合には;不要。 
//条件の部分は述語(predicate)とも言われる。
//{}ブロックが1行の時は、省略できる。
// ネストしたif文を構成することもできる。(非推奨)

if(条件1(述語)){
	条件が１が真の時の処理
} else if(条件２){
	条件1が偽、かつ条件2が真の時の処理
} else{
	条件の1,2ともに偽の時の処理
}
else if でいくらでも条件を書き足せる。


### 三項演算子 --「条件式 ? trueの処理 : falseの処理」という書式でif..else文を短く書ける。
e.g.)//animalsという配列がある時に、"Dog"に対してのみ星付きで解答したい。

<ul>
	{animals
		.filter((animal) => {
			const isMatch = animal.indexOf(filterVal) !== -1;
			console.log(animal.indexOf(filterVal));
			return isMatch;
		})
		.map((animal) => {
			return  <li key={animal}> 
			{animal}{animal === "Dog" && "☆"} //論理積(short circuit ver)
			// 三項演算子ver
				{/* {animal === "Dog" 
				//   ? animal + "☆" 
				//   : animal */}
				</li>;
			})}
</ul>


```
e.g.)
const score = 85;
if (score >= 80) {
  console.log('great!');
}  else {
  console.log('soso');
}
e.g)
score >= 80 ? console.log('great!') : console.log('ok'); 
```


## (??)null合体演算子
```
A ?? B 
// Aの値がnullもしくはundefinedの時に、->Bの値を返す
// それ以外の時には, ->の値を返す。
```
//Rubyでいうnilガードみたいですね。
A ?? B //Javascript
A ||= B //Ruby

# switch statements
一つの式または値を受け取り、
それに合致する値が見つかるまで選択肢を探します
(Rubyでいうところのcase~whenですね。少し仕様が違いますが、、）
等価がどうかを評価する条件分岐が羅列される場合に用いると良い。

```
switch (条件の値or式){
	case 値1:
		条件の値 === 値1 の時に実行する処理; 
		break;
	case 値2:
		条件の値 === 値2 の時に実行する処理;
		break;
	case 値3:
		条件の値 === 値3 の時に実行する処理;
		break;
	default:
		条件の値がいずれの値とも一致しないときに実行する処理;
	}
	// defaultの部分にはbreakいらないです。
```


*caseの値と条件の値が一致した後は、breakを記述しないと以降の処理も全て実行される点を注意。またdefault（いずれの場合にも一致しなかった場合の処理）は不要な場合は省略可。

--------------------------------------------------------

***[繰り返し処理]
cf) Notion

# [関数] --------------------------------
複数の処理をまとめるため記法。オブジェクトを引数として渡されると、関数がオブジェクトのプロパティを変更した時に、その変更が関数外でも有効になります。


## 関数の定義(関数宣言による書式)
function 関数名(仮引数 ='デフォルト値',....) {
	処理
	return 返り値（-必要に応じて)
}
e.g.)
function multiply() {
  return num1 * num2;
}
- JavaScriptでは,//関数宣言による場合には、関数の巻き上げもできる。
- 関数はそれ自体がオブジェクトであるので、Functionオブジェクトのメソッド持っています。

### return --この命令を受けた関数は、実引数をもらって、処理を行い、実行結果の値を呼び出し元に返す。値が返されるとそれ以降の処理は実行されない。
*if文で使うような式(expression)をreturnすると、その条件式の結果として得られる真偽値（trueまたはfalse）を返す


# 無名関数/関数リテラル（関数式による関数の定義）
関数を定数や変数に値として代入する形をとりながら、定義する。
//基本書式
const 変数名 = function(仮引数 ='デフォルト値',....) {
	処理
	処理
	return 返り値（-必要に応じて)
};

e.g.)// イベント発火に用いられたりするそうです。
myButton.onclick = function() {
	alert('hello');
};


### 呼び出し
変数名();

### 注意点
// 形としては変数や定数に値を代入しているので、ブロックで囲まれているが文末でのセミコロン(;)が必要。これを省略すると関数の呼び出しまでされてしまう？らしい。

// 関数式に名前を指定することもできます。これによって関数の参照だけをすることもできるし、デバッグのトレースも追いやすくなります。
e.g.)
```
const factorial = function fac(n) { return n < 2 ? 1 : n * fac(n - 1) }

console.log(factorial(3))

```


# 再帰関数
関数は自身を参照し、呼び出すことができます。関数が自身を参照する方法は 3 種類あります。

1. 関数名
2. arguments.callee
3. 関数を参照しているスコープ内の変数



# アロー関数(関数式を短くことができる書式)
無名関数の省略形の関数

e.g.)
const 定数 = (仮引数 ='デフォルト値',....) => {
	処理
	処理
	return 返り値
};

e.g.2)
textBox.addEventListener('keydown', (event) => {
  console.log(`You pressed "${event.key}".`);
});

// 書き方のコツ //
1. 関数の中括弧内の処理が1行の場合には{}が省略できる。
2. また、引数を一つだけ取る場合には、()も省略できる。
3. さらに、処理の中身がreturnするだけの場合は、{}を外して,returnを省略して記述できる。

```
// 単一式の場合はブラケットやreturnを省略できる
const fn = (a, b) => a + b;

// ブラケットやreturnを省略してオブジェクトを返したい場合は`()`で囲む
const fn = (a, b) => ({ sum: a + b });
```

// [注意]オブジェクト取る時
// これだと、関数式の{}なのかオブジェクトのための{}なのかが理解できない。
const fnArrotObj = number => { result: number * 2 }
//オブジェクトを戻り値として受け取りたいのであれば、、
//()によって囲むこと。
const fnArrotObj = number => ({ result: number * 2 })


## https://ja.javascript.info/function-expressions
- 関数式には;がつく、なぜならば形としては変数に対して代入している代入文であるから。
- また、呼び出しの際に()がない場合には、関数を参照しているだけで、呼び出しとは見なされない。もし、これを出力するとコードが参照できる。
また、値として持つ関数を別の変数に代入して、その新たな変数から()呼び出し演算子を用いて、呼び出すこともできる。

```
function sayHi() {   // (1) 作成
  alert( "Hello" );
}

let func = sayHi;    // (2) コピー

func(); // Hello     // (3) コピーの実行(動きます)!
sayHi(); // Hello    //     これもまだ動きます(なぜでしょう？)
```


# スコープ --関数の外側(toplevel)で定義した定数や変数は、全ての範囲で有効でこれをグローバルスコープと呼ぶ。
//for(){}によるループや、ifによる条件分岐の際は、この関数についてのスコープは適用されません。Rubyだと、if forはない。eachはスコープを作る。

# 複数のスクリプトがある時（複数のスクリプトファイルを読み込んだ時等）,この時 ファイルが分かれても、スコープが分かれているわけではないので、グローバルスコープの定数を書き換えるようなことはできない。それを避けるためにも、書いたコードはブロックで囲って、スコープを分けるよう気を配りましょう
ex)
{
	const x = 300;
	console.log(x); 
}

## 関数の中の関数
```
function myBigFunction() {
  let myValue;

  subFunction1();
  subFunction2();
  subFunction3();
}

function subFunction1() {
  console.log(myValue);
}

function subFunction2() {
  console.log(myValue);
}

function subFunction3() {
  console.log(myValue);
}

```
この例は動作しません。それは// 関数の定義部にmyVauleという変数が存在しないため。
// スコープの異なる変数を用いたい場合には、引数として呼び出し時に渡す。

```
function myBigFunction() {
  let myValue = 1;

  subFunction1(myValue);
  subFunction2(myValue);
  subFunction3(myValue);
}

function subFunction1(value) {
  console.log(value);
}

function subFunction2(value) {
  console.log(value);
}

function subFunction3(value) {
  console.log(value);
}
```

# カスタム関数を作成する。
関数名() --()は関数呼び出し演算子とも言われ、現在のスコープですぐに関数を実行する場合にのみ使用します。無名関数の場合にも関数のコードは定義部のスコープ内に当たるため、即時実行はされない。
```
e.g.)
 btn.onclick = function() {
        displayMessage('Woo, this is a different message');
      }
// displayMessageにあたる部分は事前に定義されている関数の呼び出し。
btn.onclick = displayMessage("fdafa")とはできない。
// この場合はclickイベントとは無関係に実行されてしまう。

# 関数の戻り値(return value)
---------------------------------------------------------------




# 配列
---
- 配列は「リストのようなオブジェクトである」と説明され、単一のオブジェクト内に複数の値をリストとして持っています。リスト内の値に個別にアクセスすることができ、繰り返しを用いて全ての値に同じことをするなどと活用されます。

- 配列には何でも格納することができる。文字列、数値、オブジェクト、その他の変数、さらには別の配列ですら格納することができます。そして混ぜ合わせることも。すべて同じデータ型である必要はありません。

- 配列の生成。
new Array() or []

e.g.)
new Array(3) //-> undefined,undefined,undefined
[3] //-> 3
new Array(1,2,3) //-> 1,2,3
[1,2,3] //-> 1,2,3



- 配列の要素の参照/get
shopping[0]; //shopping変数に格納された最初のようそを返す。

- 配列の要素への代入/set
// 配列の場合にはconst宣言した変数だとしても中の要素を書き換えることはできる。配列そのものへの再代入は不可能。
// また、文字列に対して"adfa"[2] = hogeなどは不可能(immutableなので)
shopping[0] = 'タヒーニ';

- 多次元配列
配列の中に配列があるとき、その配列は多次元配列と呼ばれます。
array[1][3]のようにしてアクセスできる。

### 長さを調べる
*Array.lengthプロパティを使用することで、要素の個数を取得できます(sizeはRubyだけ？）
	
- loop処理における配列の扱い方のコツ
e.g.)// 配列中の全項目をループする
for(let i = 0; i < someArray.length; i++) {
	console.log(someArray[i]); 
}

# {配列の操作}
## 文字列への変換
- toString() joinのように配列の要素をカンマ区切りの文字列に変換する。join()の場合は区切り文字を指定できる。

- join() 引数を取らない時は、"カンマ区切り"で要素を文字列に変換する。


## 要素の追加と削除
//配列への破壊的変更をする

### 末尾に対する操作
- pop() 
配列の最後の要素を削除する。(ひとつずつ)。返り値は削除した配列の要素

- push(element0, element1, /* … ,*/ elementN)
配列の末尾に 1 つ以上の要素を追加する.
メソッドが呼び出されたオブジェクトの新しい length プロパティを返す


### 先頭に対する操作
- shift()
先頭の要素を削除する。(ひとつずつ)

- unshift(element0, element1, /* … ,*/ elementN)
先頭に引数にとった要素を追加する。(複数要素追加可)
メソッドを呼び出した後のオブジェクトの新しい length プロパティを返す


 
# splice(変化が開始する位置,削除数,追加する要素) --配列の途中の要素を操作する。//追加する要素は配列の末尾に対して追加される。
ex)
const scores = [80, 90, 40, 70]
scores.splice(1,1,40,50);  --添字1の要素から、1つ削除して、40,50を要素として追加する。

for(let i =0; i < scores.length; i++) {
	console.log(`score ${i} ${scores[i]}`); 
}

ex)console.log("abcd"["abcd".length - 1]);
//配列の最後から1番目の文字列を取り出すrubyでいう.lastメソッドもしくは、[-1]



## スプレッド構文 
「...」を配列の中で使うことで、そこに別の配列を展開してくれます。また、関数の(実)引数として、配列を渡す時にもスプレッド構文を使うと、中身を展開して渡してくれるよ。//Rubyでいう*splat演算子と同じ。
e.g.)
const otherScores = [10, 20];
const scores = [80, 90, 40, 70,...otherScores];
console.log(scores);	//--80 90 40 70 10 20 の出力されるはずです。

const sum = (a, b) =>  {
    console.log(a + b);
  }

sum(...otherScores);  //配列の中身が展開されるのでsum(10,20)と同義になってるよ。

### 厳密等価演算子とスプレッド構文
e.g.)
let arr1 = [1, 2, 3];
let newArrSpread = [...arr1]; //①
let newArr1 = arr1; //②
以上のような時、①では、
スプレッド演算子によって、arr1の配列を展開して、新たに変数をアドレスを用意して格納している。
②では、最初に宣言されたarr1をどちらも参照することになるので、同一のアドレスを参照している。すなわち newArr1 === arr1 //true 


## 分割代入(Object destrutin)
配列から値を取り出して、もしくはオブジェクトからプロパティを取り出して別個の変数に直接代入することを可能にする。
e.g.)
const scores =[80, 90, 40, 70];
//abcdの変数それぞれに対して、分割代入している。
const [a, b, c, d] =scores; 
// 頭と末尾だけという指定も可能
const [a, , , d] = scores;

# レスト構文 (残余引数/レストパラメータ
複数の値を...<配列名>という形で、配列にまとめる式のこと。
e.g.)
const restA = (...argA) => console.log(argA);
restA(1, 3, 4) // [1, 3, 4]
//3つの引数を渡して、関数の定義側では、それをargA（配列）にまとめて扱っている

[,...配列名]と配列の要素の最後に書くと、分割代入に割り当てられなかった値を指定した配列内に格納する構文のこと
e.g.)
const scores =[80, 90, 40, 70];
const [a,b,...others] = scores;		// --レスト構文。othersに40,70を格納している。
console.log(a);
console.log(b);
console.log(others); //-> [40, 70]

### また、分割代入は値の交換にも使われる。
ex)x,yという変数があったとして、、	
let x = 30; 
let y = 70;
[x,y] = [y,x]; //配列の要素としてx <- y, y <- xを代入して入れ替えを行う
console.log(x);
console.log(y); 

### さらに、

# [配列の操作Arrayオブジェクトのメソッド]

## Array.prototype.forEach() 
配列の中の要素を1つずつ取り出して、全ての要素に繰り返し同じ処理を行うメソッド
// 基本書式
forEach((element, index, array) => { /* … */ })

e.g.)
 const scores =[80, 90, 40, 70];

 scores.forEach((score,index) => {		
  console.log(`Score ${index}: ${score}`);
 });


# Array.prototype.map()
配列の各要素に何らかの処理をして別の配列を作る
undefinedの要素に対してはスキップされてしまう。
// 基本書式
// arrayには配列がそのまま渡されるので、配列自体も扱うことができる。
map((element, index, array) => { /* … */ })

e.g.)
const prices =[180,190,200];
const updatedPrices = prices.map((price) => {
		return price + 20 ;
});
//アロー関数の省略を使うと...
const updatedPrices = prices.map(price => price + 20);
console.log(updatedPrices);



## Array.prototype.filter()
対象となる配列オブジェクトから、与えられた関数にtrueを返す要素だけを抽出して,別の配列として取得することができる
e.g)
const numbers =[1, 4, 7, 8, 10];
const evenNumbers = numbers.filter((number) => {
	if (number % 2 === 0 ) {
			return true;
	}else {
			return false;
	}
}); 
//こちらも省略して書いてみると、、、、
 const evenNumbers = numbers.filter(number => number % 2 === 0);
 console.log(evenNumbers);


## Array.prototype.reduce(callbackFunc, initialValue)
callback関数の中で、二つの引数を取り（本当は4つ）、callbackの一つ目の引数に対して、reduceの第二引数を初期値をして代入し、callbackの第二引数には配列の要素がそれぞれ渡される。これらの引数を使って、????
---



# [オブジェクト]
key: valueの形で管理することができるもの。(Rubyではハッシュとして扱われているね。)

### 構成要素の呼称
各プロパティは キー:値で構成されています。
e.g.) 
const point = {x: 180, y: 100}
この時、
x:180 --プロパティ（メンバ）,
x --key(名前,プロパティ名),
180 --値となってます。


## 各プロパティの値の呼び出し(参照、get)
「オブジェクト名.キーの名前」or「オブジェクト名['キー']」
e.g.)
	const point = { x: 100, y: 180};
	console.log(point.x);
	console.log(point['x']); //飽くまでkeyは文字列として扱われているのね？

## 値のset、再代入
e.g.)
	point.x = 200;
or
	point['y'] = 300;




## プロパティ自体の追加と削除 
「オブジェクト名.新しいキー = 値」or「オブジェクト名['新しいキー'] = 値」
削除する場合には、 
delete オブジェクト名.キー」deleteキーワードを使用する。

e.g.)
point.z = 90; delete point.y;



# オブジェクトの分割代入
"オブジェクトのキーと同じ定数名を指定すること"で、そのプロパティの値を代入できる。
e.g.)
const points = {x: 100, y: 180, r: 4, color: 'red'};
の時,keyと同名の変数を指定すると、
const {x,r,...others} = points;

console.log(x); //-> 180
console.log(r); //->4
console.log(others); //->レスト構文を用いたので、残りのオブジェクトがそのまま出てくる。

- また、プロパティ名を別名にして、扱いたい時には、:の右側に変更したい名前を持たせる。
const {x: aliasx,r: aliasr,...others} = points;

## Object.keys() 
引数にとったオブジェクトが持つプロパティの 名前の"配列"を、通常のループで取得するのと同じ順序で返します。
- オブジェクトには forEach() が使えない。Object.keys(オブジェクト) とすると、(オブジェクト)のキーの配列を取得でき、これを定数に代入すると、forEach()が使えるようになる。
e.g.)
const point = {
  x: 100, 
  y: 180,
  
};

const keys = Object.keys(point);

keys.forEach( key => {
console.log(`Key: ${key} Value: ${point[key]}`); 
//keyが文字列として取得されてるので、${point.key}とは書かずに、左のように書く。
});

## 配列とオブジェクトを用いた複雑なデータ構造
- オブジェクトを要素として持つ配列 
プロパティへのアクセスは 配列名[添字].キーで指定する。
ex)
const points =[
    {x:30, y:20},
    {x:31, y:30},
    {x:20, y:40},
    {x:35, y:60},
    {x:31, y:33},
];
この時データへのアクセス方法は、ex)points[1].yというように書く。

*オブジェクトは値として文字列と数字だけ出なく、オブジェクトを取ることもできる。
ex)
const character={
	name:"どらえもん"
	favorite: {
		food: "ラーメン"
		sports: '野球'
		color: '緑'
	}
};
といった構造をとることができ、オブジェクト名.プロパティ.プロパティで指定してアクセスできる。ex)character.favorite.color

*オブジェクトの値として、配列（複数の値）を持つこともできる。
const character={
	name:"BOY",age:14,foods:['a','b','c']
}
この時、foodsというプロパティ名は、配列['a','b','c']の変数、定数名としても機能するため、
character.foods[0]や、foods.lengthと書くこともできる。


# オブジェクトの値に関数を取ることもできる。->メソッド
ex)
const animal = {
	name:'レオ',
	age:3,
	greet: () => {
    console.log("こんにちは");
	}
//  この時さらに、以下のようにメソッドを定義することも可能です。
	great () => {
	}
}



console.log(animal.name);
//メソッドの呼び出し
animal.greet(); //()忘れずに
## this
同じオブジェクトないのプロパティにアクセスする時は、this.プロパティ名(キー)と書く。


---



## {データ型によって異なる変数の代入の挙動}
- 数値や文字列などの単純なデータ型と、配列やオブジェクトといった複雑なデータ型では、変数を代入したときの挙動が大きく異なる
ex)
- 数値を扱う時 (primitive型?)
let x= 1;
let y = x;

x = 5;
console.log(x); //->5
console.log(y); //->1

- 配列を扱う時
let x = [1, 2];
let y = x;

x[0] = 5;
console.log(x); //-> 5,2
console.log(y); //-> 5,2
/*
primitive型の場合には、変数に対して、直接アドレスを割り当てられる。xはどこ、yはどこなどというように。そして、そのアドレスに値を格納している。
しかし、オブジェクトや配列のような型の場合には、格納先の参照先を保持したデータが変数に格納されている。つまり、上の例でいうと、yに対して配列xを代入しましたが、変数yが持つのは、配列xと同様の配列自身ではなく、配列xが格納されているアドレスの情報である。ということ。このとき二つの変数の間で参照している値は同一なので、どちらかが変更された時には、全ての参照元に対して変更が反映されてしまう。
*/
もし、値そのものを格納したい時はy =[...x]のようにスプレッド演算子を使い、配列と展開すると良い。


## {数値の操作}
- 配列の中の数値を足し上げる。--sum()ってのはないので、
ex)const scores = [10, 3, 9];

let sum = 0; //--変数を用意して

scores.forEach( score => {  //--用意した変数にforEachを使いながら、配列の中身を足し上げる。
  sum += score 
});

- 配列の中の平均値を出す。 --avg()ってのはないので、
const avg = sum / scores.length; // --forEachを用いて導き出したsumを配列の個数で割る。

*Math.floor() --小数点以下の値の切り捨て
*Math.ceil() --小数点以下の値の切りあげ
*Math.round() --小数点以下の値の四捨五入
*定数名.toFixed() --小数点以下の値を()の桁数まで表示(()内の桁に丸める。)
*Math.floor() --小数点以下の値の切り捨て
**Math.random() --０以上1未満のランダムな数値を生成する。();忘れるなー

## 乱数作成のコツ
*Math.random()を応用して、
0からnまでの整数値をランダムで出すには、、、
-Math.floor(Math.random() * (n + 1))  ---0からn+1未満のランダムな値(小数値を含む)の少数を切り捨てる。
minからmaxまでの整数値をランダムに出すには、,
-Math.floor(Math.random() * ( max +1 -min ) + min
--+minをすることで、最小値をminにして、その分最大値もminだけ増えてしまったので、max +1 -min の切り捨てた整数範囲を適応する。
ex)--サイコロ
console.log(
  Math.floor(Math.random() * (6 + 1 -1) + 1 )
);

Math.sqrt() -- 引数にとった値の平方根(square root)を表示する。
Math.pow(base, exponent)
第一引数にとった値を底とし、第二引数の値を累乗した指数を表現する
Math.PI --円周率

---

# {日時を扱う}
- 現在時刻の取得  -- new Date();
### 日時のgetter
*const d = new Date();と定数を置いた時、
d.getFullYear(); 
d.getMonth(); //0-11 0 -> jan,,,
d.getDate(); //1-31
d.getDay(); //0-6 0: sun,1: mon
d.getHours(); //0-23
d.getMinutes(); //0-59
d.getSeconds(); // 0-59
d.getMilliseconds(); //0-999  
として取得できる。(timezone依存してます。)

d.getTime(); --世界のどこから取得しても同じ値が取得できる。UTCを使った値らしい。UTC1970/01/01/00:00:00:00からの経過ミリ秒を表す。


### 日時のsetter
- 特定の日時の値を作る時
const d = new Date(YYYY, MM, .....)と書く。月以降は省略可能。
d.setHours(); で設定したい日時を引数として与えられる。
.
.
.
.
ex)
d.setHours(10, 20, 30);  //複数引数を渡すと、勝手に分、秒に割り当ててくれる。
d.setDate(31); //30日までしかない月だと翌月の1日に補正してくれる。
//今日から3日後というように設定したいなら、
d.setDate(d.getDate() + 3); 
console.log(d);


## タイマー機能 
- setInterval(呼び出すもの、秒数);
この関数の戻り値は、インターバルを一意に識別するインターバルIDになります。

e.g)
function showTime() {
  console.log(new Date());
}

setInterval(showTime, 1000); //1000ms -> 1sごとに現在時刻を表示する。
// 注意点、関数名()にすると、関数を即時呼び出しして、undefinedを1s毎に行わる。
window.setIntervalとも書ける。
	この時windowオブジェクトは、DOMドキュメントを収めるウィンドウをあらわすオブジェクトです。topレベルみたいな意味ですね。



- clearInterval() を呼び出して、後でインターバルを削除できます。下の例では、引数にfunc(関数)とdelay(指定した関数またはコードを実行する前にタイマーが待つべき時間/間隔？)
- clearInterval(intervalID)
setIntervalの返り値であるintervalIDを受け取ると、関数の処理を止める。
ex)3秒で止まる機能
let i = 0

function showTime() {
  console.log(new Date());
  i ++;
  if (i > 2) {
    clearInterval(intervalId);
  }
};



- setTimeout(code, delay) 
第二引数で指定した時間の後に、 1 回だけ処理(関数)を実行するように予約するメソッド。
連続してsetTimeout()を呼び出すことで、setIntervalのように繰り返し処理もできます。
- clearTimeoutで、setTimeoutをキャンセルできる

e.g.)
let i = 0;  //カウンタ用の変数

function showTime() {
	console.log(new Date());  //現在の時刻を取得し、コンソールに出力
	const timeOutID = setTimeout(showTime, 1000); //再帰処理
	//1sごとにshowtime(関数)を呼び出すsetTimeoutメソッド。とその返り値をもらう定数 timeOutID
	i ++
	if (i > 2) {
	clearTimeout(timeOutID); //setTimeoutの帰り値をもらうと、処理を止める。
	}
}
showTime(); //<- 関数の呼び出し！

---

# setTimeoutとsetIntervalによる繰り返し処理の違い。
所要時間が長い処理を扱う時に、setTimeoutは、処理が終わった時点で一定インターバルの挟んで再度処理を始める。setIntervalは処理が始まった時点から一定インターバルを挟み出すので、所要時間が長い処理の場合は処理が重複しシステムに負担をかけることになる。つまり、setIntervalは処理時間に関わらず、処理が始まった地点からの時間間隔で次の実行が予定される。



# [例外処理]

例外が起きそうな箇所をtry{}で囲み、その後にcatch{}をつづけて、例外が起きた場合の処理を書く。catch に対してこのように引数を渡してあげると、例外が起きた場合、その例外に関する情報をこの名前で扱えるようにもなる。
ex)
const name = 5;

try {
  console.log(name.toUpperCase());
}catch (e) {
    console.log(e);  //エラーに関数情報を持っているeを出力
  }
  
console.log('finish');




# [クラスの概念]

## クラスの定義（クラス宣言）
慣習的に頭大文字を使う e.g.) class Post
//基本書式
class クラス名 {
	//コンストラクタや、メソッドを定義する。
}


## コンストラクタ
constructor()という特殊なメソッドで初期化する。
コンストラクタはインスタンスを生成された直後に実行される。
インスタンスのプロパティがセットされる。
//Rubyでいうところの、initializeメソッドで、インスタンス変数への値の代入と、attrでのアクセサーの定義をまとめている。
ex)
class Post {
  constructor(text) {  //クラスから作られるインスタンスをクラス内では this というキーワードで表現する
    this.text = text;
    this.likeCounter = 0;
  }
}

## メソッド
オブジェクトのプロパティの値に関数とした時に、その関数をメソッドと呼ぶ。(単にオブジェクト内で定義された関数 => メソッドと理解しても良い。)
e.g.1)
const posts = [{
		text: 'aaaa',
		likeCounter = 0,
		//これがメソッド。show() {}と短く書ける。(もしくは、show: () => {})	
		show: function () {  
		//同じオブジェクト内のプロパティにアクセスする時は thisをつける。
		console.log(`${this.text}`);  
		},
		},
		{
			text: 'aa3a',
			id_number: '454'
			...
		}
];
## メソッドの呼び出し
「オブジェクト名.メソッド」で呼び出す。ex)posts[0].show(); 
*メソッド内でインスタンスの値を使用するには、「this.プロパティ名」とします。
ex)
show () {
      console.log(`${this.text} -${this.likeCounter}`);
}
//値と同様にメソッド内で、同じクラスの他のメソッドを使うこともできます。
ex)
like() {
      this.likeCount++
      this.show();
}


# インスタンスの作成 
「new クラス名(引数)」と書き、必要に応じてconstrutor()に引数を渡す。
cf) in Ruby //Class_name.new(args)

e.g.) --今回は、配列のなかにインスタンスを作成してますが、単に定数に代入するかたちももちろんありです。
const posts = [
  new Post ('JavaScriptの勉強中...'),
  new Post ('プログラミング楽しい'),
];


# 静的メソッド(staticメソッド) 
通常メソッドはインスタンスから呼び出すが、インスタンスを介さず直接クラスから呼び出すメソッドのこと。(Rubyでいうクラスメソッド/singletonメソッドに近い)

クラス内でメソッドを定義する際に、staticとつけること。
//thisは使えない(インスタンスからの呼び出しではないため)。

ex)
class Post {
    static showInfo() {
      console.log('Post class version 1.1')
	}
}
# 静的メソッドの呼び出し。
「クラス名.メソッド名」で呼び出せる。
e.g.) Post.showinfo();


## カプセル化
プロパティの値を、直接参照、操作するのではなく、メソッドを介して操作すること


## {プロパティ、メソッドの可視性}
- public
- private
- protected
の３種類があり、

## public
クラスの内外に関わらずアクセスすることができる。

## private
クラスの中でのみアクセス可能なプロパティを宣言

## protected
クラス内と、そのクラスを継承したクラスの中でのみ使用することのできるプロパティ
-------------------------------------------------------------------

# [継承]

## 継承
親クラスの記述が子クラスへも適応される。
//基本書式
class 子クラス extends 親クラス{}
e.g.)
class SponsoredPost extends Post {}


# オーバーライド
親クラスにすでにあるメソッドと同じ名前のメソッドを子クラスで上書きすること。

子クラスのコンストラクタで独自のプロパティの初期する前(this.〇〇などをする前)に、super(引数);を使って親クラスのコンストラクタを呼び出し、引数を渡す。
*親メソッドもsuper.xxxx();で呼び出せる。
ex)
constructor(text, sponsor) {
      super(text);  //親クラスのコンストラクタに引数を渡す。　親のtextになります。
      this.sponsor = sponsor;
    }

    show() {
      super.show();
      console.log(`... sponsored by ${this.sponsor}`);
    }


---





# [DOM]
document object modelのことで、HTMLをJavaScriptから参照・操作する仕組み/データ構造です。DOMはHTMLを操作するAPIのようなもの。
HTMLの要素を書き換えることから、JavascriptがHTML自体を操作しているように思われるが、実際に操作しているのは、このDOMと言われるもの。
e.g.)
```
document
|-- doctype
`-- html
	|-- head
	|	|-- title
	|	`-- "my Site"
	|
	|-- ↩︎
	`-- body
		`-- p
			`-- "hello"
```

- DOM(Document Object Model)
HTMLを読み込むと内部的にDOMと呼ばれるデータ構造が作られて、その内容に応じてページが描画がされる、という仕組みになっている。DOMはnodeを組み合わせで出来ていて、その全体構造をDOMツリー(Nodeツリー)と呼ぶ。
(html階下の先頭の字下げ(インデント)や、最後の改行を除く字下げ改行も1つのNodeです。)。

### - Nodeの種類
Node には種類はあって、 document と doctype は少し特殊なのですが、それ以外のHTMLの要素を表すNodeは、Element Node(要素 Node)。
Text、空白もしくは改行は Text Node と呼ばれます。
*Nodeは階層構造を持っていて、
- Parent Node(親)
- Child Node(子)
- Sibling Node(兄弟)という表現を用いる。

- DOMは、documentという特殊なオブジェクトで扱うことができて、文書内から特定の要素を取得する時は、documentオブジェクトのメソッドを使います。
(idがあるなら、getElementById('<id属性の値>')や、querySelector()等)

e.g.)//hを取得し、テキストの内容をchangedにする。

const h1 = document.querySelector('h1').textContent = 'changed'; 


### DOMの実体を見る。
上で取得した要素をconsoleで見る。
- console.log(h1) //-> <h1></h1> h1タグを取得していることがわかる
- console.dir(h1) //-> <h1>タグの要素をオブジェクトとして保存しているため、そのオブジェクトがもつ全てのプロパティを参照できる


## {要素の取得するメソッドの一例}
- querySelector()
引数にCSSのセレクター指定する。当該の要素の1つ目の要素を取得する。
e.g.)document.querySelector('#target').textContent = 'changed!'; //idセレクタ--#targetを問い合わせ

- querySelectorAll()[]
当該セレクタの全ての要素を取得し、配列のようにインデックスで何個目のセレクタかを指定する。
// 取得した全ての要素を操作したい場合には、forEachを使う。
e.g.)document.querySelectorAll('p').forEach((p,index) => {
      p.textContent = `${index + 1}番目のpです。`;
});

- getElementById()
引数にHTMLのid属性を渡して、その属性をもつ要素を取得する。
//idがtargetの要素を取得
e.g.)document.getElementById('target').textContent = 'changed!';

- getElementsByTagName()
要素名(タグ)を取得して、複数の要素を取得する。(querySelectorAllで代用可)

*getElementsByClassName()
クラス名を取得して、複数の要素を取得する。(querySelectorAllで代用可)


## DOMツリーの階層関係から要素を取得する方法。
e.g.)以下のような構造のHTMLがある時
```
<ul>
	<li>item</li>
	<li>item</li>
	<li>item</li>
</ul>
```
DOMツリーは,以下のようになる。
ul
|-- ↩︎
|-- li
|	`-- 'item'
|-- ↩︎
|-- li
|	`-- 'item'
|-- ↩︎
|-- li
|	`-- 'item'
`-- ↩︎

これを例として見ていくと、
- .childNodes
呼び出されたオブジェクトの全ての子Nodeを取得する(孫は対象外)
(Text NodeもElement Nodeも)
e.g.) //↩︎もliも取得
ul.childNodes

- .children
テキストNodeを無視して、メソッドレシーバーの要素Nodeだけを取得する。
// liだけ取得

- .firstChild/.lastChild
最初や最後の子Nodeを取得する。
- .firstElementChild/.lastElementChild
最初や最後の子の"Element"Nodeを取得する。

- .parentNode --親Node を取得
e.g.)li.parentNode //->ul要素のこと

- .previousSibling/.nextSibling
前後の兄弟のNodeを取得する。
- .previousElementSibling/.nextElementSibling
前後の兄弟の"Element"Nodeを取得する。

---


## 要素内の属性操作
DOM ではclass属性とカスタムデータ属性を除いて、html要素の内で使われる属性と同名のプロパティが用意されている。
JSで属性を扱う時はそのようにプロパティを利用する。

e.g.)
- .textContent --テキストの内容
- .title  --タイトル属性
- .style --(CSS)スタイル属性
e.g.)
btn.addEventListener('click',()=> {
	const targetNode = document.getElementById('target')
	// JSでCSSのプロパティについて言及する際には、lowerCamelCase(not kebab)
  targetNode.style.backgroundColor = 'green';
});
// ただし、JSではCSSの書き換えをするのではなく、class属性を書き換えて、そのクラス属性をセレクタにしたCSSを書くという書き分けが推奨されます。

- .className --クラス属性。(JSのclassは別の予約語) 
//このプロパティを使ってクラス属性を書き換えをする時、指定された要素のclass属性は、丸々上書きされ、元々のスタイルは消える。
- .dataset.<カスタムデータ属性>
この形で、独自定義したdata-xx属性の値にアクセスできる。

- .value --バリュー属性、inputタグなどだとユーザの入力はこちらの属性にあるよ。
e.g.)input.value
ex)
document.querySelector('button').addEventListener('click', () => {
	const targetNode = document.getElementById('target');

	targetNode.textContent ="change!";
	targetNode.title ='this is title!';
	targetNode.style.color ='red';
	targetNode.style.backgroundColor ='olive'; 
//-見た目の指定はCSSに任せたいので、非推奨。またプロパティ名に(-)が入る場合は、２語目を大文字から始めて対処する。
	targetNode.textContent = targetNode.dataset.translation; //<data-translation="値"をテキストに代入
});

## class属性の操作をより簡便に
単にclassNameプロパティを指定するのではなく、classListプロパティを用いると、次のメソッドを使い様々な操作をすることができる。
1. classList.add()
既存のクラスの設定に,加えて引数で与えたクラスを新しく追加

2. classList.remove()
既存のクラスの設定に引数で与えたクラスを削除

3. classList.contains()
既存のクラスの設定に引数で与えたクラスがあるかどうかをtrue/falseで返す。

4. classList.toggle() --既存のクラスの設定に引数で与えたクラスがあれば、削除し、なければ追加する。
e.g.) //classList.toggleを以外のメソッドで記してみた
if (targetNode.classList.contains('my-color')) {
	targetNode.classList.remove('my-color');
} else {
	targetNode.classList.add('my-color');
}

---

# {DOM要素の追加}

DOMへの要素を追加する手順は
	①要素を作成,
	②そのうえで中身のテキストを設定,
	③DOMツリーに組み込む

- .createElement()
引数にとった文字列の要素を作り出すメソッド。

- .appendChild()
親Nodeに対して使用し、引数にとった要素を子要素の末尾に追加するメソッド。
//appendは付与すると言う意
e.g.)
const btn = document.querySelector('button')
btn.addEventListener('click', () => {
  const item2 = document.createElement('li'); 
  item2.textContent ="item2";
  const ulNode = document.querySelector('ul');
  ulNode.appendChild(item2);
});


# {要素の複製、挿入}
DOMへの要素を複製、挿入する手順は
	①要素を複製
	②親要素から見てあfる要素の手前に追加する。

- .cloneNode()
Nodeオブジェクトをコピーするメソッド。
渡される引数がtrueの時-中身も丸ごと
falseの時、要素の中身を複製しない(要素のみ)

- Node.insertBefore(newNode, referenceNode)
親Nodeオブジェクトに対して使用し、第1引数に挿入したい要素、挿入位置として参照したい要素を指定する。（挿入する要素の一つ後となる要素)

e.g.)
document.querySelector('button').addEventListener('click', () => {
  const item0 = document.querySelectorAll('li')[0]; 
  const copy = item0.cloneNode(true);
	const ul = document.querySelector('ul');
  const item2 = document.querySelectorAll('li')[2]; /
  ul.insertBefore(copy, item2);	
});


# {要素の削除}
- .remove()
指定したNodeを削除するメソッド
古いブラウザで非対応のものがある時は
- .removeChild() 
「親Node.removeChild(削除するNode)」で削除するメソッド

e.g.)
document.querySelector('button').addEventListener('click', () => {
	const item1 = document.querySelectorAll('li')[1];

	item1.remove();
	//もしくはalt.optionとして
	document.querySelector('ul').removeChild(item1);
});

## input要素への入力値を操作する
inputやformを経由したユーザからの入力を操作する。

- value
input要素のvalue(入力値)を指定できるプロパティ

- HTMLElement.focus()
指定したhtml要素(オブジェクト)にフォーカスを移動させるメソッド。
e.g.)
document.querySelector('button').addEventListener('click', () => {
	const li = document.createElement('li');	
	const text = document.querySelector('input'); 
	li.textContent = text.value;
	document.querySelector('ul').appendChild(li);
	text.value = '';
	text.focus();
});


- 動画に関するもの
.play(); 動画のあるDOM要素を再生する。
.pause(); 停止する。			


## セレクトボックスの操作
- <select>の要素を jsで取得した時、
	1. valueプロパティで選択された値
	2. selectedIndexプロパティで選択された値のoptionの中での添字にも
また,HTML内でのそれぞれの選択肢にvalue属性を付与できる。
(初期値だと中のコンテンツ)
ex)
document.querySelector('button').addEventListener('click', () => {
	const li = document.createElement('li');
	const color = document.querySelector('select'); 
	li.textContent = `${color.value} - ${color.selectedIndex}`; 
	document.querySelector('ul').appendChild(li);
});

## ラジオボタンの操作
セレクトのようにHTMLの要素がまとまっていない点と、
排他的に選択された要素を受け取ってliのコンテンツにしていく点に注意。
- .checked
プロパティ。その要素がチェックされている時trueを返す
e.g.)
const btn = document.querySelector('button');

btn.addEventListener('click', () => {
  const li = document.createElement('li');
  const colors = document.querySelectorAll('input');
  let selectedColor;

	colors.forEach((color) => {
    if (color.checked) {
      selectedColor = color.value;
    }
  });
  li.textContent = selectedColor;
  document.querySelector('ul').appendChild(li);
  
});


## チェックボックスの操作
ラジオボタンとの違いは、複数選択可ということ。つまり入出力される値が複数になる可能性がある。//---> 配列。
e.g.)
const btn = document.querySelector('button');

btn.addEventListener('click', () => {
  const li = document.createElement('li');
  const colors = document.querySelectorAll('input');
  const selectedColors = [];

  colors.forEach((color) => {
    if (color.checked) {
      selectedColors.push(color.value);
    }
	});
	// join()メソッドを省略してもカンマ区切りで、文字列に変換される
  li.textContent = selectedColors.join('と');
  document.querySelector('ul').appendChild(li);
  
});





# [イベント]
- イベントハンドラーとは、イベントに発火した時に実行される (通常はユーザー定義の JavaScript 関数) コードのブロックのこと。

- イベント発火に対応してコードブロックが実行されるように定義することを、イベントハンドラーを登録するという。

- 厳密に言えば一緒に動作する別のものです。イベントリスナーはイベントの発生を監視し、イベントハンドラーは発生したイベントの応答として動作するコードです。

- これらは、JavaScriptの主要部分ではなく、ブラウザーに組み込まれた JavaScript API の一部として定義されたものです。

# addEventListener() //推奨
比較的新しいイベント機構です。おすすめです。
第一引数であるイベントの種類についてみていく。

```
//基本書式
EventTarget.addEventListener(type, listener, [options])
```

- type -対象とするイベントの種類を表す。
- listener -指定された種類のイベントが発生するときに通知 (Event インターフェースを実装しているオブジェクト) を受け取るオブジェクトを取る。

e.g.)
//無名関数自体を第二引数に取ることで、clickのイベントに対して発火するコードを実装している。
btn.addEventListener('click', function() {
  const rndCol = 'rgb(' + random(255) + ',' + random(255) + ',' + random(255) + ')';
  document.body.style.backgroundColor = rndCol;
});

````
## addEventListenerのメリット
1. removeEventListener()を使ったリスナーの削除
以前に追加したリスナーを削除できます
2. ひとつのリスナーに対して、複数のハンドラー(トリガーさせたいコード)を登録できる。


## Eventオブジェクト
addEventListenerの第二引数にあたる関数に引数を渡すと、ブラウザがイベントの発火に伴う情報をセットして渡してくれるという仕組みになっている。
この情報をEventオブジェクトと呼び、慣習的に event の e が仮引数としてよく使われる
このオブジェクトのtargetプロパティは、常にイベントが生じた要素への参照となっています
e.g.)
- e.key
keydownの時に、入力されたkeyを取得できるプロパティ

- e.clientX/e.clientY
イベントの発生した座標に関するプロパティ(ブラウザ表示領域の左上を0,0としたもの)mousemoveなので有用
e.g.)
document.addEventListener('mousemove', e => {  
  console.log(e.clientX, e.clientY);
});

## イベントtype
### マウス系のイベントtype一例
- click --クリックされた時
- dblclick --DouBLeCLICKされた時 
- mousemove --マウスが動いた時。

### キーボード系のイベントtype
- keydown --キーボードが押された時。 このイベントオブジェクトの情報をe.keyとして取得すると、押したキーの情報を取得できる。

### その他のイベントtype
- focus --フォーカスが当たったとき
- blur --フォーカスが外れたとき
- input --内容が更新された時
- change --更新内容が確定された時。(textareaでいうと入力がされてフォーカスが外れたとき)
e.g.)
const text = document.querySelector('textarea');
text.addEventListener('blur', () => {
//valueプロパティで入力された値を取得して、lengthで文字数を取得する。
	console.log(text.value.length);	
	
});

### formタグのイベントtype
- submit 
ボタン(<button>)をformタグ中に配置ある場合に、ボタンをクリックしたとき(もしくはEnterされたとき)に発生するイベント
また、<input type="text"> が 1 つだけformタグ内に含まれる場合は、buttonタグの代替をして利用できる。
e.g.)
document.querySelector('form').addEventListener('submit', e => { //フォームにサブミットイベントが発生した時の、イベントオブジェクトに対して、preventDefault()メソッドを実行する。
//既定動作としてページ遷移してしまうのをキャンセルする。
	e.preventDefault();
	console.log('サブミット！');
});


# イベントの伝播
## Event Bubbling
実際にイベントが発生した要素から、順々にその親要素に対しても、ハンドラが実行されるということ。
(liの全てにaddEventListener書かずとも、ulでもイベント発生がする。ってこと。)

- Event.target
実際にイベントが、割り振られたオブジェクト(要素)への参照を持ちます。  
e.g.) ul > li の時 ul.addEventListenerしながら、liをクリックした時。

- Event.currentTarget
e.g.)
//li.doneクラスには打ち消し線がスタイリングされてます。
const ul = ocument.querySelector('ul');
ul.addEventListener('click', e => {
	// e.targetはli
	e.target.classList.toggle('done');
	// e.currentTargetはul(addEventListenerが追加されたもの)
	e.currentTarget.style.backgroundColor = "red";
	}
});


- Element.setAttribute('属性','値');





# [ESModule]
jsファイルごとにモジュールとして扱えるようにある。
- export/import
文字列や数値や関数など、どんな値でもエクスポートが可能です。

```
export (default) <定数名>;
import ,<定数名> from "./ファイル名";
```

- 直接HTMLファイルに読み込む際には、
<script type="module" src="ファイルのパス"></script>
//Reactの場合には、ESModuleを変換してくれるのでこの記述は必要ないらしい。

## exportの書き方
これを記述することで、外部から使えるようになる。
1. const宣言の手前につけるような書き方
e.g.)
export const hello = () => {
console.log('hello');
}

2. オブジェクトリテラル{}を使用して、クラスや関数をexport 
//名前付きエクスポート
e.g.)
class User {
  constructor(name) {
    this.name = name;
  }
}

//名前付きエクポート
export { User }

//export default xxx の形でモジュールをexportできるのは、1モジュール(1ファイル)につき1回だけ。


## import
他のファイルで定義されているクラスを使用するにはインポートをする必要があります。使用するファイルの先頭で
import { インポートしたいもの(クラスでも、関数でも), [複数選択可] } 
from "./<ファイルパス>"; //相対パスでも\./の記述は必須です。じゃないとパッケージだと勘違いされる。
e.g.)
//名前付インポートされた時
import { hello, User } from './module.js';

hello();
const user = new User('Tom');

user.hello();

- default exportの読み込み
default exportでエクスポートされたモジュールは、そのモジュールファイルの中で一意に決まるので、{}なしで呼び出し可能。かつ、import先での改名もできる。(言い換えれば、importする際にそのファイル内で好きな名前をつけても良い)
e.g.)
import functionB, { hello, User } from './module.js';

functionB();

*パッケージ---パッケージのimportは、ファイル名ではなくパッケージ名を指定します。ex.)import 定数名　from "chalk";
				readline-syncパッケージを下のように記述し、
				import 定数名 from "read-line-package";
				readlineSync.question(質問文) やreadlineSyne.questionInt(質問文)←数字を受け取るint=integer(整数お)
					と書くと、
コンソールに質問文が出力され、一旦処理が止まり、コンソールに値が入力されると、次の処理に進みます。








# エラーの修正
---
###よく見るエラー

- SyntaxError: missing ; before statement
大抵は;が不足していることを表しています。また、もう一つのパターンとして、=の代わりに===を使ってしまうことが挙げられます。

- SyntaxError: missing ) after argument list
メソッドや、関数で)の閉じ忘れがある時

- SyntaxError: missing : after property id
オブジェクトの記述ミスの場合もありますし、

```
function checkGuess( {
```
のような文法ミスの場合にもあります。（関数の内容を関数の引数と勘違いしている)

- SyntaxError: missing } after function body





---
# Window関数
---
ダイアログをボックスを表示させるための関数?
### Window.prompt()関数 
ユーザーにテキストを入力するように促すダイアログをオプションのメッセージと共に表示し、ユーザーがテキストを送信するかダイアログをキャンセルするまで待機するようにブラウザーに指示します。

//基本書式
prompt()
prompt(message) //ユーザに表示する文字列を引数に取れる。
prompt(message, default) //テキスト入力フィールドに表示される既定値を指定する文字列

### Window.alert()関数
-引数にアラートダイアログボックスに表示したい文字等を渡す。引数を省略することもできる。

window.confirm() --引数に確認時に表示したい文字等を渡す。ユーザのアクションはOK -> true/cancel -> falseで、confirm()の返り値として取得できるので、ユーザのアクションに対して何か処理したい場合は、
ex)
const answer = confirm('削除しやす？');

if(answer) {
	console.log('deleted');
} else {
	console.log('canceled');
}





# NodeListオブジェクト
(https://developer.mozilla.org/ja/docs/Web/API/NodeList)
Node.childNodesやdocument.querySelectorAll()の返り値として用いられる。
```js
// HTML文書内にある複数のbutton要素全てに対して、メソッドを使っている。
buttons.forEach(function(button) {
  button.onclick = bgChange;
});

```

## preventDefault()
イベントオブジェクトの持つメソッドの一つで、規定の動作を停止する。e.g.)フォーム送信の停止や、送信後のページ遷移をしないなど。



## Event Bubbling
これは、クリックされた最も内側の要素からイベントが発生するということで説明します。






{
# 昔のイベントの書き方

## イベントハンドラープロパティ// 非推奨(古い)
イベントハンドラーコードを代入するためのいろいろなプロパティのこと。(e.g. .onclickとか)これらは、btn.textContentやbtn.styleと同じプロパティの一つでありますが、コードを代入すると、代入したコードがボタンでイベントが発火した際に実行されるという性質を持つ。
```

const btn = document.querySelector('button');
// 無名関数を代入している例。

btn.onclick = function() {
  const rndCol = 'rgb(' + random(255) + ',' + random(255) + ',' + random(255) + ')';
  document.body.style.backgroundColor = rndCol;
}

//名前付き関数を設定している例。bgChange()を代入すると、即時実行されるので注意。
function bgChange() {
const rndCol = 'rgb(' + random(255) + ',' + random(255) + ',' + random(255) + ')';
  document.body.style.backgroundColor = rndCol;
}

btn.onclick = bgChange;

### イベントハンドラープロパティの一例
- onclick
- onfocus/onblur
- ondblclick
- window.onkeypress, window.onkeydown, window.onkeyup 
キーボードのキーが押された時に色が変わります。keypress は普通のキー入力(ボタンを押して離して)を示しますが、keydown と keyup はキーストロークのうち押すだけ、離すだけの部分それぞれを指します。ボタンそのもののイベントハンドラーに登録しても上手く動かないことに注意してください
//window オブジェクトに登録しなければならず、これはブラウザーのウィンドウ全体を表わしています。
- onmouseover と onmouseout — マウスポインタがボタンの上に来たときとボタンの上から外れた時に色が変わります。


### //イベントハンドラーのアンチパターン
1. インラインイベントハンドラーを使う。
イベントハンドラー HTML 属性と呼ばれるものがあり、HTMLの属性にそのままイベントハンドラーを登録する方法になりますが、よくはありません。
 
e.g.)
<button onclick="bgChange()">Press me</button>

<button onclick="alert('Hello, this is my old-fashioned event handler!');">Press me</button>
}


# 高階関数
JavaScript では関数もオブジェクトのひとつであり、関数を呼びだす時に引数として関数を指定したり、関数の中から戻り値として関数を返すことができます。このように関数を受け取ったり返したりする関数のことを高階関数と呼びます。

# (コールバック)callback関数
引数に渡された関数のこと。つまり高階関数に呼ばれた関数のこと
//RubyでいうProcオブジェクトに近い。

function print(callback) {
	console.log(callback); //callbackを確認するためだけ
  const result = callback(5);
	console.log(result);
}

function fn(number = 3) {
    return number * 2;
}

print(fn); //関数fnを引数に取るprint関数を呼び出し。


??コールバック関数自体に引数を渡すには？


//promiseについて、Notion参照




# オブジェクトの構造を比較する

https://typescript-jp.gitbook.io/deep-dive/recap/equality#nostructural-equality

通常はidで比較するべ