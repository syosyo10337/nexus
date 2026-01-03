
# VScode周りの設定

- @builtinのphpの機能を消す

- ==Laravelのやつintelisense==

- ==namespace resolver==

- php intelephense(extension)を入れる

- ユーザスニペットをひらいて　

```Bash
"php": {
		"prefix": "php",
		"body": [
			"<?php $1 ?>"
		],
		"description": "php tag"
	}
```

を追加する

## デバッグ周りの設定

*php.iniに追記**  
Xdebug ver3の場合

```Markdown
[XDebug]
xdebug.mode=debug,develop,trace
xdebug.start_with_request = yes
zend_extension = C:\MAMP\bin\php\php7.4.1\ext\php_xdebug-3.0.0-7.4-vc15.dll
```

※zend_extensionはXdebug Wizardでコピーした値  
  
Xdebug ver2、またはMacの場合

```Markdown
[XDebug]
xdebug.remote_enable = 1
xdebug.remote_autostart = 1
xdebug.remote_port = 9000
zend_extension = C:\MAMP\bin\php\php7.4.1\ext\php_xdebug-2.0.0-7.4-vc15.dll
```

※Windowsの方はzend_extensionはXdebug Wizardでコピーした値  
※Macの方は動画内で説明しているxdebug.soまでのパスを入力してください。  

## VSCodeのデバック設定を有効化

  
Xdebug ver2の場合はportをphpinfoにある{xdebug.remote_port}と同じ数値に変更  
Xdebug ver3の場合はportをphpinfoにある{xdebug.client_port}と同じ数値に変更  

## PHPのワーニングを画面表示

  
**php.iniの設定値の変更**  

```Ruby
display_errors = on
```

  
## MAMPの再起動を忘れずに。

# 基本文法

```PHP
<?php echo "hello"; ?>
//以下が省略形です。
<?= "hello" ?>

// HTML等の中で使うときには　?>タグ必須
```

??==!!==<?php echo〜」の場合、「<?=」と省略することができます。

## コメントアウト

```PHP
// もしくは
/* 
コメントアウト
*/

#　これでもいいよ。
```

## PHPの命名規則

- スネークケース?

# 変数定義

$をつける`$variable`

## 定数

PHPにおいて、定数は存在する。再度宣言することはできない。

以下の方法で定義する。

1. `const`キーワードを用いる

2. define関数を用いる

```PHP
e.g.)
const TAX_RATE = 0.1;

define('TAX_RATE', 0.1);
```

### `const`と`define()`の違い

- const はif文や関数の中で使用することができない。

- defineではグローバルスコープに値が配置される。

- constでは名前空間内に配置される。

### `defined()`

再定義できない、定数を確認することができる。

```PHP
if (!defined('TAX_RATE')) {
	define("TAX_RATE", 0.1);
}
```

## 文字列の連結

式展開?やエスケープシーケンスを用いたい場合には(””)を用いること

+ではなく(.)によって連結する

```PHP
// e.g.)

<?php
$name = 'masa';
// +ではなく(.)によって連結する
// echoの場合には(,)を使うこともできる。
echo '<div>', $name, '</div>';
echo '<div>'. $name. '</div>';

// (")を用いたときには変数を直接使用できる
echo "hello $name";
// 文字列に挟まれる場合には{}が必要
echo "<div>{$name}</div>";
//(")だとエスケープシーケンスも使用できる。
echo "hello \n";
```

- 自己代入も、インクリメントもある
    
    - `$i ++`
    
    - `$i += $j` 文字列に対して使用することもできる。
    

# 型情報(type)

---

## 型情報を出力する`var_dump()`

変数を出力するコマンド。型情報も手に入る。

```PHP

<?php
var_dump()
```

## 暗黙の型定義と型変換

==true→ intになり得る==

```PHP
<?php
	$i = 1;
	$bool = true;
echo $i + $bool; // -> 2


//明示的に肩を指定することができる。
echo $i + (int) $bool; // -> 2
```

### `intval()`

```Plain
intval('45') #-> 45
```

cf. ) [https://www.php.net/manual/ja/function.intval.php](https://www.php.net/manual/ja/function.intval.php)

## 厳密等価演算子

- データ型での比較が行われる

```PHP
<?php
	var_dump(1 == "1"); //-> bool(true)
	var_dump(1 === "1"); //-> bool(false)
```

- オブジェクトの同一性についても評価できるはず

## 文字列

### array → string

```PHP
implode(string $separator, array $array): string
```

# 算術演算`Math`

## `round()`

浮動小数点を丸める。関数

```PHP
round(int|float $num, int $precision = 0, int $mode = PHP_ROUND_HALF_UP): float
```

第一引数に丸めたい値を渡して、第二引数には有効数字を指定することができる。

$modeの指定によって、切り上げ、切り捨てを扱うことできる。デフォルトは0から離れるように切り上げ、切り捨てされる。(1.5 → 2 ,-1.5 → -2)

# 条件分岐(if)

---

if文は以下のように書く

`else if`でも `elseif`でもいいらしい　

```PHP
<?php
$score = 40;
if ($score < 50) {
  echo '不合格';
} elseif ($score < 70) {
  echo '合格';
} else {
  echo '秀';
}


//cf)
//以下のように書くこともできるよ。
if (!empty($sum)) :
  echo "{$price}円の商品を{$amount}個買ったので{$sum}です。";
else :
  echo "なんか買えよばか";
endif;
```

## falsyな値

falsyな値を取るときには、if文はfalseと処理する。

- 0

- “”

- NULL

- False

- “0”

- array() : 空配列(連想配列はvalueがなくてもturthy)

### 論理演算子

- OR → ||

- AND → &&

- NOT → !  
    e.g.) `var_dump(!0) //-> bool(true)`

# 厳密には、言語構造 `isset()/empty()`

## `isset()`

引数がnull 以外の値で定義されている場合にtrueを返す

値がセットされているかを判定する。

ある連想配列[’key’]の値が存在するかを判定する際によく用いられる。

## `empty()`

引数にとった値が、

- 変数として存在しない。

- falsyな値

の時。→ trueを返す

中身が空白かとどうかを判断する。

```PHP
//つまり
empty($a) ===
 !isset($a) || $a == false
```

0かどうかのチェックに使ったりする

e.g.) `empty(0)`

## 三項演算子(**Ternary operation**)

Ruby JSのように三項演算子は使用することができる。

```PHP
$arry['key'] = isset($arry['key']) ? $arry['key'] * 10 : 1;
print_r($arry);
```

### null合体演算子

(in Ruby) nilガード(`||=`)的な感じだね。

`A ?? B;`の形で用いて、Aがnullの時Bの値が評価され、Aがnull以外のときはそのままAの値が評価される。

```PHP
e.g.)
$arry['key'] = $arry['key'] ?? 1;

//以下と同義である。->
$arry['key'] = isset($arry['key']) ? $arry['key'] : 1;
```

## エルビス演算子

三項演算子の二項版

Aの値を評価して、truthyの時はA、falslyの時はBを返す。

```PHP
A ?: B
```

# 配列

---

## 配列定義/代入/参照

```PHP
$array = ['cat', 'dog', 'shark'];
// or
$arry = array('cat', 'dog', 'shark');


//参照
echo $arry[1];
//代入
$arry[1] = 'masanako';
```

## `print_r`

配列や連想配列を出力するための関数

```PHP
//配列出力用
print_r($array);
//もちろんこちらでも●
var_dump($arry);
```

### push to Array

```PHP
//push to the array
$array[] = 'bird'
```

### `array_shift()`

配列の先頭を削除する。

```PHP
//
array_shift($array);
```

### `array_pop()`

```PHP
//
array_pop($array);
```

  

### `array_splice()`  

```PHP
array_splice(
    array &$array,
    int $offset,
    ?int $length = null,
    mixed $replacement = []
): array


//?T と T|nullということnullableであることの糖衣構文

e.g.)
```

### `is_array()`

引数にとった値が配列かを確認する

```PHP
is_array(mixed $value): bool
```

### `in_array()`

```PHP
in_array(mixed $needle, array $haystack, bool $strict = false): bool
```

  
Searches for `needle` in `haystack` using loose comparison unless `strict` is set.

cf)

[https://www.php.net/manual/en/function.in-array.php](https://www.php.net/manual/en/function.in-array.php)

## for statement

基本的なfor文の形で書いて問題ない。

```PHP
for($i = 0; $i < count($arry); $i++) {
  echo '<div>',$arry[$i], '</div>';
}

//count($arry)これによって、配列の要素をカウントしている。
```

## foreach

配列の各要素自体を走査する処理

もちろん同時にindexを扱うこともできる。(`$index => $value`)

```PHP
e.g.)
foreach($arry as $v) {
  echo '<div>',$v, '</div>';
}

e.g.)
foreach($arry as $index => $value) {
  echo '<div>',$v, '</div>';
}
```

# 連想配列/ map

`=>`をつかって`key ⇒ value`型のデータを扱うことができる。

```PHP
$array = [
    'name' => 'Bob',
    'age' => 12,
    'sports' => ['baseball', 'swimming']
  ];

//参照
$array['name'] 
//代入（自己代入）
$array['age'] += 100;
```

### `unset()`

```PHP
// 特定の要素を削除する
unset($array['name']);


// array_shiftも使えるけれども、あまり使わない。
array_shift($array['name'])
```

### 連想配列の豆知識

null合体演算子は??の左側が、nullを評価した後に、右辺を代入するか決める。という挙動だと理解していました。  
  
そのため、

```Bash

function get_value($array, $key) {
    return $array[$key] ?? null;
}
```

  
こちらの例では、一度左辺を評価するため、warningが発生するという認識なのですが、いかがでしょう

その通りです、ご指摘いただいたとおり、null合体演算子 (`**??**`) は左側の式が null かどうかを評価し、null の場合は右側の式を評価します。しかし、**PHP 7.0** 以降では、null 合体演算子の左辺の評価において、存在しない配列のキーを参照しても `**E_NOTICE**` エラーは発生しません。

つまり、以下のコードは `**E_NOTICE**` エラーを発生させません

($request['important_notices_only'] ?? null)　これもwarning 回避ですね

# 正規表現(Regular Expression)

[👨‍🏫正規表現(Regular Expression)](%E6%AD%A3%E8%A6%8F%E8%A1%A8%E7%8F%BE\(Regular%20Expression\)%20280a25ec3d1d41b3a8bfff4d04b3d6ce.html)

PHPでの用いられ方

## `preg_match`

`P`erform a `reg`ular expression `match`

の略だと思われる。

cf)[https://www.php.net/manual/en/function.preg-match.php](https://www.php.net/manual/en/function.preg-match.php)

`pattern`で指定した 正規表現により`subject`を検索します。

戻り値は、matchした場合には`1`マッチしなかった場合には`0`

失敗した場合には、`false`を返す

```PHP
preg_match(
    string $pattern,
    string $subject,
    array &$matches = null,
    int $flags = 0,
    int $offset = 0
): int|false
```

また、$matches[0]には、パターン全体にマッチしたテキストが代入され、($matches[1]には、１番目のキャプチャ用サブパターンにマッチした文字列が代入され、、といった具合になっていくそう)

基本的な使い方

```PHP
if(preg_match("/<h[1-6]>(.+)<\/h[1-6]>/", $char, $result)) {
  echo '検索成功';
  print_r($result);
} else {
  echo '検索失敗';
}
```

# 関数

## 関数定義/呼び出し

** returnで戻り値を返した時点で、それ以降のコードは実行されない。

```PHP
//定義
function f_name($arg_1, $arg_2, ..) {
	//内部で実行したい処理

	return $retval;
}


//呼び出し
f_name($arg);
```

### デフォルト引数

他言語(ruby,JS)と同様にして、$arg = default_vとすることで定義できる。

```PHP

$price = 1000;

function with_tax($base_price, $tax_rate = 0.1) {
  $taxed_price_f =  $base_price * ($tax_rate + 1);
  $taxed_price = round($taxed_price_f);
  return $taxed_price;
}

$price = with_tax($price);
echo $price;
```

### 文字列を関数として実行

PHPにおいては仮に文字列(e.g. `“with_tax”($price);`)のような場合でも、後ろに()をつけた時には、関数として実行することができる。

文字列自体も関数として実行できる==(PHP独特の記法)==

```PHP
$func = "with_tax";
$price = $func($price);
echo $price;
```

## 関数のオーバーロード

PHPはオーバーロードの仕組みはなく、同じ名前の関数を同一の名前空間で定義すると読み込み時にエラーが発生してしまいます。

- オーバーロード  
    引数の数や型に違いを持つ同名の関数を複数定義すること。

# PHPDoc

`/**`に続いてEnterを押すと、Docコメントというコメント用のブロックを作成できる。

`@`に続くtagを入力することで、アノテーションをつけることができる。

cf）

[

PHPDoc リファレンス — phpDocumentor

![](http://demo.phpdoc.org/Responsive/img/apple-touch-icon-114x114.png)https://zonuexe.github.io/phpDocumentor2-ja/references/phpdoc/index.html



](https://zonuexe.github.io/phpDocumentor2-ja/references/phpdoc/index.html)

[一例]

- `@param`引数

- `@return`戻り値

```PHP
/**
 *  
 */

e.g.)
/**
 *  税率計算のための関数を記述するためのファイル
 * 
 * @author Masanao Takahashi
 * @since 1.0.2
 */
```

### 関数についてPHPDocを書くときの例

```PHP
e.g.)

/**
 * 税込金額を取得する関数
 * 
 * 関数に関する補足説明
 * 
 * @param int $base_price 価格
 * @param float $tax_rate 税率
 * 
 * @return int 税込金額
 * @see http://www.php.net/manual/en/language.types.float.php
 */
function with_tax($base_price, $tax_rate = 0.1) {
    $sum_price = $base_price + ($base_price * $tax_rate);
    $sum_price = round($sum_price);
    return $sum_price;
}

$price = with_tax(10, 0.1);
echo $price
```

# スコープ

スコープとは、ある変数を参照することができる範囲のことです。(変数の有効範囲)

==**PHPではifやfor statement({})では、スコープを形成しません。**==

cf）

[変数のスコープ](JavaScript/%E5%A4%89%E6%95%B0%E3%81%AE%E3%82%B9%E3%82%B3%E3%83%BC%E3%83%97%208274ae915d6748fbb4863b2321964368.html)

PHPにおけるスコープについて以下の種類があることを留意する

- グローバルスコープ

- ローカルスコープ  
    e.g.)関数に囲まれたスコープ  
    つまり、ある関数内で定義された変数は、その関数内でのみ参照することができる。

- スーパーグローバル

## グローバルスコープについて

関数の中でグローバル変数を使用したい時には、必ずglobalキーワードを使用すること。

PHPでは暗黙にグローバル変数を関数の中で使用することはできません。

==ただし、一般的な原則によって、グローバル変数を乱用するようなことは避けること==

```PHP
e.g.)
$a = 1;

function func2(){
  global $a;
  $b = 2;
  echo $b;
  echo $a;
}

func2();
```

### スーパーグローバル

globalキーワードを必要としないグローバル変数のこと。

e.g.) `$_SERVER`

```PHP
var_dump($_SERVER);
//PHPによって設定してもらえる、サーバに関する情報を参照できる変数
```

- `PHP_EOL   改行を表す。`

# プログラムの実行順について

PHPにおいては、

### 関数内の処理は、関数が実行される時初めて動く

よって以下のようなプログラムも正常に動作する。

```PHP
e.g.)
function counter($step = 1) {
  global $num;
  return $num += $step;
}

$num = 0;
echo counter(3);
```

### 関数宣言は、プログラムの実行よりも前に準備される。

つまり、関数の定義は、呼び出される部分よりも後に記述されていたとしても、関数の宣言自体は、プログラムの実行前に行われているらしいので、問題がない。

```PHP
e.g.)
$num = 0;

counter(2);

function counter($step = 1) {
    global $num;
    $num += $step;
    echo $num;
    return $num;
}
```

### それ以外

上から順に実行される。

# ファイルの分割について

PHPでは、ファイルごとにスコープを作成しないので、単に`require`とするとそのファイルに宣言されている関数を呼び出すことができる。

`require()/include()`もしくは、キーワードの形`require/include`で使用することができる。

```PHP
//index.php
require('./file1.php');
func1();
```

```PHP
//file1.php
if(!function_exists('func1')) {
	function func1() {
		echo 'func1 is called';
  };
};

//function_exists()に引数にとった関数名が存在するかを判定する関数。
```

## `require()`

この関数を呼び出すと、**実際にファイルを読み込む**。(HTMLなどを読み込んだ時には、それを読み込んだ数だけ出力する。

```PHP
require('./file1.php');
require('./file2.php');
require('./f1le2.php');
require('./f1le2.php');
//3回分出力される。
```

一度だけ読み込みたい時には

`require_once()`を使うと良い。

## `include`と`require`

引数にとったファイルがみつけられなかったときの挙動が異なる。

`require`の場合には、エラーが見つかった時点で、実行が中断されるが、`include`の場合には実行が中断されない(warningに止まる。)

## パスの書き方

PHPにおけるパスの書き方

### マジック定数

e.g.)`__DIR__`

この定数はrootパスから、現在の’directory’までのフルパスを表示する。

```PHP
echo __DIR__;
```

`__FILE__`こちらは’ファイル’までを表示する。

### `dirname()`

こちらも、パス情報を出力してくれる関数だが、

第二引数をとることで、指定したファイルの親の階層を指定することができる。

```PHP
e.g.)
echo dirname(__FILE__, 2);

//現在のファイルが位置するcurrent_directoryから数えて2階層上のディレクトリ名を表示する。
```

### パス指定における`require`の挙動

- 相対パスと絶対パスを混在させるような書き方も許容してくれる

- \ や￥が混在したとしても、ファイルを表示してくれる。

# 名前空間

名前空間を区切ることで、関数や定数の衝突を避ける。

区切ることができるのは、

- function

- constant

- class

などが挙げられる。

基本的な書き方は以下のようになる。

```PHP
//名前空間の指定

namespace space_name;

const TAX_RATE = 0.1;

function with_tax($base_price, $tax_rate = TAX_RATE) {
    $sum_price = $base_price + ($base_price * $tax_rate);
    $sum_price = round($sum_price);
    return $sum_price;え//名前空間にアクセス
//グローバル空間から直接namespace内にアクセスする際には、\namespace\func...などとかく必要がある。

echo \lib\TAX_RATE;

echo \lib\with_tax(1000);
```

### グローバル空間

Rubyでいうtop levelを表す名前空間をPHPでは、`\`を用いて表現する。

useやグローバル空間では`\`の指定は必要ない。  
つまり、基本的にはnamespaceごとにprefixをつけてパスのように指定する必要がある。ということ

さらに、例外的にグローバル空間に定義されるclassは`\`を指定する必要がある。

### `use`キーワード

`use function/use const`

を用いることで、ファイル内で使用する際に、\namespace\を使う必要がなくなる。

```PHP
require_once 'lib.php';
use function lib\with_tax;
use const lib\TAX_RATE;

$price = with_tax(1000, 0.08);
echo $price;
echo TAX_RATE;
```

### 名前空間の階層

ファイルパスのような指定/参照ができる。

```PHP
namespace lib;


use const lib\sub\TAX_RATE;

function with_tax($base_price, $tax_rate = sub\TAX_RATE) {
  $sum_price = $base_price + ($base_price * $tax_rate);
  $sum_price = round($sum_price);
  return $sum_price;
  
}
namespace lib\sub;
const TAX_RATE = 0.1;
```

# Class

---

PHPにおけるクラスの書き方

```PHP
class SimpleClass
{
    // プロパティの宣言
    public $var = 'a default value';

    // メソッドの宣言
    public function displayVar() {
        echo $this->var;
    }
}

//インスタンスの作成
$obj = new SimpleClass;
```

_**PHPにおいては、メソッドのvisibilityはデフォルトでpublicなので、上の例では、キーワードを省略することもできる。**_

用語整理

[オブジェクト指向の基本](../CS/%E3%82%AA%E3%83%96%E3%82%B8%E3%82%A7%E3%82%AF%E3%83%88%E6%8C%87%E5%90%91%E3%81%AE%E5%9F%BA%E6%9C%AC%20e6cdc7b3488246ad82d1ca6cee1de924.html)

# プロパティ,定数,メソッドのアクセス権  
(visibility)

それぞれの値の可視性について以下のような種類で指定することができる。

- public

- protected

- private

  
cf）

[オブジェクト指向の基本](../CS/%E3%82%AA%E3%83%96%E3%82%B8%E3%82%A7%E3%82%AF%E3%83%88%E6%8C%87%E5%90%91%E3%81%AE%E5%9F%BA%E6%9C%AC%20e6cdc7b3488246ad82d1ca6cee1de924.html)

### readonly

プロパティを初期化後に再代入不可にする

cf. )

[

PHP: Properties - Manual

![](PHP/basic/Attachments/favicon-196x196.png)https://www.php.net/manual/en/language.oop5.properties.php#language.oop5.properties.readonly-properties



](https://www.php.net/manual/en/language.oop5.properties.php#language.oop5.properties.readonly-properties)

## コンストラクタ

```PHP
class Person
{
	function __construct($name, $age) {
			$this->name = $name;
			$this->age = $age;
	}
}
```

## コンストラクタのプロモーション(昇進)

cf. )

[

PHP: コンストラクタとデストラクタ - Manual

![](PHP/basic/Attachments/favicon-196x196.png)https://www.php.net/manual/ja/language.oop5.decon.php#language.oop5.decon.constructor.promotion



](https://www.php.net/manual/ja/language.oop5.decon.php#language.oop5.decon.constructor.promotion)

```PHP
 private $listBunruisService;
 private $listTekigouShashusService;
 private $listVehicleModelIdMappingsService;


 public function __construct(
		ListBunruisService $listBunruisService,
		ListTekigouShashusService $listTekigouShashusService,
		ListVehicleModelIdMappingsService $listVehicleModelIdMappingsService,
		Request $request
	) {
		$this->listBunruisService = $listBunruisService;
		$this->listTekigouShashusService = $listTekigouShashusService;
		$this->listVehicleModelIdMappingsService = $listVehicleModelIdMappingsService;
```

クラスのプロパティとして定義して、その上で、コンストラクタインジェクションしてきたものを該当のクラスのプロパティとして代入し直す。なんて処理を一括でするための記述。

次のようになります。

## インスタンスの初期化/代入/参照

visibilityがpublicの場合、参照も代入もできる。

```PHP
//インスタンスの初期化
$bob = new Person('bob', 234);


//代入
$bob->age = 200;

//参照
echo $bob->age;
```

### **アロー演算子とは**

まず最初に「->」の記号のことをアロー演算子と呼びます。

アロー演算子はその左辺にはクラスのインスタンスを取り、右辺には左辺のクラスが持つプロパティやメソッドを指定しプロパティへのアクセス・メソッドの呼び出しを実行します。

### PHPにおけるメソッドチェーン

`->`

を使って表現する。

ちなみにこの時returnで戻すvalueを$thisにする必要がある。

```PHP
$obj->hello()->bye();
```

## staticメソッド/プロパティ

PHPでstatic メソッドを定義したい時には、 staticキーワードに続く形で、実装する。

この時、メソッド内では、`$this`を使うことはできない。

←なぜなら、$thisで参照するインスタンスを介す必要のないメソッドだから。

p

慣習的にlowerCamelCaseを用いる?

```PHP
//定義
class Some
{
	static function foo() {
		echo 'this is a static method';
	}
	pubcic function bar() {
		echo 'this is a method calling static method inside';
		static::foo(); // Some::foo()とも書ける //self::bye()も可
	}
}

//呼び出し
Some::foo();

//インスタンスから呼び出すこともできる。
$obj = new Some();
$obj->foo();



//プロパティも同様に使える。
class Some
{
	public static $whereToLive = "Earth";
// クラス定数を書くこともできる。
	public const whereToLive = "marz";
}
```

staticとvisibilityキーワードの順序は、公式に習って`public static`

## 継承

以下の書式を用いる。

overrideしたいmethods もしくはpropertyについて書けば、良い。

```PHP
class Japanese extends Person {
	
	// public static $WHERE = '日本';

	function __construct($name, $age)
	{
			$this->name = $name;
			$this->age = '30';
	}

	function hello() {
		echo 'こんにちは', $this->name;
		return $this;
	}

	function address() {
		echo '住所は', static::$WHERE, 'です。';
		return $this;
	}
}
$taro = new Japanese('taro', 18);
$taro->hello();
$taro->address();
echo $taro->age;
```

## `final`キーワード

キーワード `final`  
 を前に付けて定義されたメソッドや定数は、子クラスから上書きできません。 クラス自体がfinalと定義された場合には、このクラスを拡張することはできません

```PHP
class Person {
	final function hello() {
				echo 'hello, ' . $this->name;
				return $this;
		}
}
```

## `abstract`キーワード(抽象クラスと抽象メソッド)

abstract として定義されたクラスのインスタンスを生成することはできません。 1つ以上の抽象メソッドを含む全てのクラスもまた抽象クラスとなります。 abstract として定義されたメソッドは、そのメソッドのシグネチャを宣言するのみで、 実装を定義することはできません。

抽象クラスから継承する際、親クラスの宣言で abstract としてマークされた 全てのメソッドは、子クラスで定義されなければなりません。加えて、 [オブジェクトの継承](https://www.php.net/manual/ja/language.oop5.inheritance.php) と [シグネチャの互換性に関するルール](https://www.php.net/manual/ja/language.oop5.basic.php#language.oop.lsp) に従わなければいけません。

cf)

[

PHP: クラスの抽象化 - Manual

![](PHP/basic/Attachments/favicon-196x196.png)https://www.php.net/manual/ja/language.oop5.abstract.php



](https://www.php.net/manual/ja/language.oop5.abstract.php)

```PHP
e.g.)
abstract class Person {
	abstract function hello();
}


class Japanese extends Person {
	function hello() {
	}
}
```

具体クラスの中で使用されるメソッドを明示するように使う

### `parent`

親クラスを参照する時に使う

```PHP
// 親クラスに$WHEREがあると仮定して

class Child extends Parents
{
	function __construct($name ,$age)
	{
		parent::__construct($name ,$age);
	}

	function greeting() {
		echo 'hello', parent::$WHERE
}

```

### `self`と`static`の違い

親のクラス(継承元)で用いる際に違いが生じる。

selfの場合には、記述されたクラスを指定するので　→ 親クラスのプロパティを探し

static の場合には、継承が行われ最終的に記述されているクラスのプロパティを参照することになるので、　→子クラスのプロパティを探す(子クラスに存在するならば)

- `get_class_methods()`  
    パプリックメソッドを参照できる

- `ReflactionClass()   `だとvisibilityに関わらず見ることができる。

# 型宣言とStrictモード

文頭で以下のように宣言すると、型に対して厳密になります。

```PHP
<?php
declare(strict_types=1);
```

cf)

[

PHP: 型宣言 - Manual

![](PHP/basic/Attachments/favicon-196x196.png)https://www.php.net/manual/ja/language.types.declarations.php#language.types.declarations.strict



](https://www.php.net/manual/ja/language.types.declarations.php#language.types.declarations.strict)

### 関数の型宣言

```PHP
function add1 (int $val): string {
    return (string) ($val + 1);
}
```

### クラス内での型宣言

```PHP
e.g.)
<?php 
namespace animal;

abstract class Person
{
    protected string $name;
    public int $age;
    public static string $WHERE = 'Earth';

    function __construct(string $name, int $age)
    {
        $this->name = $name;
        $this->age = $age;
    }

    abstract function hello(): self;

    static function bye() {
        echo 'bye';
    }
}

class Japanese extends Person {

    public static $WHERE = '日本';
    
    function hello(): self {
        echo 'こんにちは、' . $this->name;
        return $this;
    }

    function jusho() {
        echo '住所は' . parent::$WHERE . 'です。';
        return $this;
    }
}
```

```PHP
require_once 'person.php';
use animal\Person;
use animal\Japanese;

function callHelloMethod(Person $person): void {
		$person->hello();
}

// Japaneseは Personクラスを継承しているので引数に取れる。
//また、内部でhello()呼び出しているため、
// Personクラスにはabstract hello()をもっている必要がある。

callHelloMethod(new Japanese());
```

### `file_put_contents(’file_name’, $arg)`

この時、$argにとった値を指定したファイルに書き込む。モードの選択をすることができる。e.g. `FILE_APPEND`

  

# { 断片的な知識 }

composer  
パッケージ管理ツール

### unset()

引数にとった変数を未定義の状態にできる。メモリから解放するためのメソッド

### nullable

nullであることを許容すること。

?typeの形で書く

e.g.) `?string`

\

## stdClassクラス

動的なプロパティが使える、汎用的な空のクラスです

### `apc_fetch()`

Alternative PHP Cache (APC)というPHPの拡張機能に含まれる関数の一つです。この関数は、キーに基づいてAPCに格納された値を取得するために使用されます。

APCは、PHPの実行速度を向上させるために使用されるキャッシュシステムで、PHPスクリプトのコンパイル済みバージョンやデータベースクエリの結果などをキャッシュに保存することで、再利用することができます。apc_fetch()は、APCに保存されたデータを取得するために使用されます。

```PHP

$key = 'my_key';
$data = apc_fetch($key);

if ($data === false) {
    // キャッシュからデータを取得できなかった場合の処理
} else {
    // キャッシュからデータを取得した場合の処理
}
```

### `htmlspecialchars()`

PHPで使用される関数で、特定の特殊文字をそれぞれのHTMLエンティティに変換するために使用されます。これは、クロスサイトスクリプティング（XSS）攻撃のような問題を防ぐためや、ユーザーが提供したデータがウェブページ上で正しく表示されるようにするために行われます。

この関数は、文字列を入力として受け取り、特殊文字がHTMLエンティティに置き換えられた新しい文字列を返します。変換される一般的な特殊文字は以下の通りです。

> &（アンパサンド）は & になります  
> <（小なり記号）は < になります  
> （大なり記号）は > になります  
> "（二重引用符）は " になります  
> '（単一引用符）は ' または ' になります（使用されるフラグによって異なります）

htmlspecialchars関数の使い方の例を以下に示します。

```PHP
$input = "Hello <b>World</b>! 'Welcome' to \\"PHP\\" & more.";
$converted = htmlspecialchars($input, ENT_QUOTES, 'UTF-8');
echo $converted;
```

出力は次のようになります。

```Plain
Hello &lt;b&gt;World&lt;/b&gt;! &#039;Welcome&#039; to &quot;PHP&quot; &amp; more.
```

ENT_QUOTESフラグは、単一引用符と二重引用符の両方を変換するために使用され、'UTF-8'パラメータは文字エンコーディングを指定します。

つまり、ブラウザがHTMLをパースする際に、特殊文字として変換せずに、文字列文字列として扱わせるための処理。

### 参照渡し

foreachなどを使用する際に、配列のそれぞれの要素となる配列はコピーされ、元の配列に対しては、内容が反映されない。

参照渡しを使うことでそれが行える。

```SQL
foreach ($zaiko_info_array as &$zaiko) {
    $zaiko['maker_name'] = $this->tekigouMakersService
                                     ->getMakerName($zaiko['id1'], $language)['name']; 
    $zaiko['shashu_name'] = $this->tekigouShashusService
                                 ->getShashuName(
                                    $zaiko['id1'],
                                    $zaiko['id2'],
                                    $language
                                )['name'];
}
unset($zaiko); // 参照を解除
dd($zaiko_info_array[0], $zaiko_info_array);
```