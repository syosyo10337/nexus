
```dart
class MyClass {
  // プロパティの宣言
  final String myProperty;

  // コンストラクタ
  MyClass(this.myProperty);

  // メソッドなど他の要素
}
```



- Dartは全ての値がオブジェクトです。Stringのプリミティブとかないらしい。	
String greeting = 'hello';
print(greeting.toUpperCase()); // HELLO
print(greeting.length); // 5

- ! (bang operator)null許容型の変数がnullでないことを示すために使用されます。これは、null許容型の変数をnull非許容型として扱う際に役立ちます。

$を$として表示したいとき、式展開に使われてしまう可能性もあるので
'\$${expense.amount.toStringAsFixed(2)}'
\' for '
\\ for \

$expense.amount.toStringAsFixed(2)の形でも変数展開であれば表現することができる。

- 変数の定義
var lowerCamel = "somethins";
変数をただ初期化する時には、タイプを具体的に指定するべきですよ!!(e.g. Aligment? startAligment;)
ただ、初期化されているならvarにすることもある程度許容される

- var構文
The var keyword in Dart is used to declare a variable without explicitly specifying its type. Dart uses type inference to determine the type of the variable based on the value assigned to it. Once the type is inferred, it cannot be changed.
(具体的な型を指定することなく、変数を宣言しDartの型予測によって初期化された際に、型が決定する。また、変数は再代入可能だが、異なる型の値を再代入することはできない。)


- finalはこれ以上再代入されないことを意味する。
- constは、再代入不可。コンパイルされるときに固定される。
例えば、func()の呼び出しとかはcompileの時に実行できないから、finalを使うよ。



- staticクラスメソッドおよびプロパティを定義するために使う。


- 引数の取り方(how to take argument)
- 当たり前ですが、positional argumentは基本的に必須項目です。
- 名前付き引数はdefaultでoptional, positional argumentは,named argumentの前に来るべきです/


  final String content;

const StyledText({ //{}は名前付き引数のことです。
    super.key,
    required this.content,
  });


- Class構文
```
class KlassName {
	//コンスタラクタ
	KlassName() {
		//initilization work
		// add some comment
	}
	
	
}
//呼び出し
KlassName(param);
```




- コンストラクタの仕組み(PHPでいうconstructor promotionみたいなやつ)
class Klass extends Abstruct {
	//(part1. 基本的な使用方法)
	//String textは仮引数で、":"のあとで実際にクラスのプロパティに代入している。
	const Klass(String _text, {super.key}): text = _text;  //つまり()のなかの値が受け取ってくる値です。
	
	//(part2. short-hand)
	const Klass(this.text, {super.key});

	
	
	
	final String text; // どっちみち必須。クラスの中で再代入しないからこれができます。この操作によってもし、内部的にこのクラスが可変じゃなくなればconstructで、constを使うことができます。
	//then u can use text in methods. just call 'text' (doesnt have to have 'this')
	
	
	  @override
		Widget build(BuildContext context) {
			return Text(
			content,// 呼び出すときはthis.content(プロパティを参照している。)
			style: const TextStyle(
				fontSize: 28,
				color: Colors.white
			),
			);
		}
}
}
'

## initializer Lists(イニシャライザー)
コンストラクタでもらわない引数に対してはこちらを使う。

配列操作等はこちらを見て思い出すこと。

https://zenn.dev/heyhey1028/books/flutter-basics/viewer/dart_4


- 配列の記法
//WordPair型の配列
var favorites = <WordPair>[];
- Set(重複をゆるさない配列{})

- List<Types>

-fromJson('json', タイプ?)
jsonからタイプをコンバージョンする

//Flutterにデフォルトで入っているdart:convertというパッケージ

- 配列に破壊的な変更が加わるメソッドを使うとき

List.of(originalArray)にメソッドチェーンすることで解消する。



- factoryコンストラクタ
ファクトリーデザインパターンの定義を見てみます。

オブジェクトの作成ロジックをクライアントに公開することなく、オブジェクトを作成する。

- 既存の配列を中身そのままでコピーします
List<String>.from


- Flutter非同期処理
https://zenn.dev/iwaku/articles/2020-12-29-iwaku
非同期関数
API 通信など非同期な処理を行う関数では返り値がFutureというデータ型になります。

// ex. APIを呼び出し、レスポンスを受け取るまで処理を待つ関数
		
    return await getWeatherFromAPI(countryCode);
}

Futureの<>に返り値のデータ型を定義し、async/awaitキーワードで完了を待機する処理を定義します。








## late キーワードによる宣言
Late variables
The late modifier has two use cases:

Declaring a non-nullable variable that’s initialized after its declaration.
Lazily initializing a variable


## ..(カスケードオペレーター)
１つのクラスの処理を連鎖的に実行したい場合は カスケードオペレータ(..) と呼ばれるドットを２つ繋げたオペレーターを使う事で実現する事ができます。

```
   late WebViewController controller = WebViewController()
     ..loadRequest(
       Uri.parse(widget.article.url),
     );_text
```


	## generic types are flexible types works together with other types
	
	
	
# カスタムコンストラクタを作成する

class Klass extends SomeClass {
	const Klass(); //デフォルトコンストラクタ

	// カスタムコンストラクタの例
	const Klass.custom({super.key})
		: color1 = Colors.deepPurple,
		: color2 = Colors.indigo,

}

## functions in Dart
In Dart, functions are also just values/objects


## 無名関数の書き方
```() {}```


## visibiltyについて

class _DiceRollerState などと(_)を用いて定義すると、そのファイル内でのみ参照できるクラスになる。(private)


- 関数を引数として取るときの書き方
```
void Function(String) StartQuiz //String型の引数をとってvoidを返す。



- ループ処理

#for 
for (int i = 0; i < 10; i++) {
  print('i = $i');
}

#foreach
var numbers = [1, 2, 3, 4, 5];
numbers.forEach((number) {
  print(number);
});

#for-in
var numbers = [1, 2, 3, 4, 5];
for (var number in numbers) {
  print(number);
}

```foldとfor-inどちらも使って、合計を出してみる。
  double get totalExpenses {
    double sum = 0;
    for (final expense in expenses) {
      sum += expense.amount;
    }
    return sum;
  }

  double get totalExpenses2 {
    return expenses.fold(0, (sum, expnese) => sum += expnese.amount);
}
```


- ...スプレッド演算子
The element type 'Iterable<AnswerButton>' can't be assigned to the list type 'Widget'
map処理で作成したwidget群を、配置する際に、...でIterableから展開して、表示させるl。


# if statement
inside List
https://zero-to-one.slack.com/archives/C060K8URGTH/p1699606664865769?thread_ts=1699592813.478529&cid=C060K8URGTH

# for statement
inside List

```Dart
final numbers = [5, 6];
final myList = [
  1,
  2,
  for (final num in numbers)
    num
];

## for (num in numbers)も使うことができるよ。
ただし、Listの中で、配列の中身を展開したい時には、(...)spread operatorを使うだけで良いよ。


Type Casting
`
variable as String`の形でかく。

```'
get(他のプロパティを使用して、引数を取らずに、anothor propertityを作るとき)
  List<Map<String, Object>> get summaryData {
    final List<Map<String, Object>> summary = [];

    for (var i = 0; i < chosenAnswers.length; i++) {
      summary.add({
        'question_index': i,
        'question': questions[i].text,
        'correct_answer': questions[i].answers[0],
        'user_answer': chosenAnswers[i],
      });
    }
    return summary;
}

- もし、intやdouble型の場合には、`toString()`メソッドを使う。
- doubleの時は, toStringFixed()引数に丸めたい桁数を入れる
e.g. 
1.55454.toStringFixed(2) -> 1.55

こうすると、呼び出さなくても、プロパティのようにsummaryDataが使用できる。


Enum型
の記述
```
e.g. )

//定義する
enum Category { food, travel, leisure, work }
class Expense {
  Expense({
    required this.title,
    required this.ammount,
    required this.date,
  }) : id = uuid.v4();

  //NOTE: idもmodelingできるかもね。
  final Category category;
  final String id;
  final String title;
  final double ammount;
  final DateTime date;
}

https://dart.dev/language/enums


# Future
とは、未来.
非同期関数。処理のオブジェクト

数値をテキストに変換する。できないときはnullを返す。
double.tryParse(_amountController.text) -> String?


