 

# const/final/var(WIP)

[var](#66b8e8c7-efb8-491e-bbc3-9a843262bc15)

[final](#5bed9f8d-0f80-4ff7-a857-795d9030f60f)

[const/final](#39d4edf2-5b2f-4ec0-ab8b-30a611720e4b)

[配列(List)についてのimmutable/mutableの話。](#03173a3f-984b-4019-b900-a2d24d00eac8)

memory内でのaddressの話をしています。

実際に使用する上で、再代入ができるかとか、値の参照を変更できるかは別として

# var

```Dart
var users = ['Max']
```

1. ['Max']というList Objectが生成される

2. 変数usersに対して、　`Users List (Max) → 0x21d36e0`
    
    1. その変数が指し示す値(List Object)のaddress(場所)を保存する。
    

```Dart
users = ['Max', 'Manu']
```

1. ['Max', ‘Manu’]というList Objectが==**新規**==で生成される

2. ==**既存**==変数usersに対して、　`Users List (Max, Manu) → 0x21d36e0`
    
    1. その変数が指し示す値(List Object)のaddress(場所)を保存する。
    

💡

*古い`Users List (Max) → 0x21d36e0`はgarabage collectionで勝手に消える。

# final

は変数に対して、memory上の新しいaddressを保存することを防ぐ。つまり、変数名が示す参照先を切り替わることがvarではできるが、finalではできず、

add()などの操作は、すでに存在しているaddressにある値を変更している。参照のaddressは変更していない。

## const/final

constはコンパイル時に値が代入され、それ以降変更できない  
さらに、modifyもできない。値の参照も変更もできない。

```Plain
//これは同じこと。
final numbers = const[1, 2, 3];
const numbers = [1, 2, 3];
```

numbers.add(4);  
final  
finalはプログラムを実行して値が代入されたあと変更できない  
cf. )[https://zenn.dev/captain_blue/articles/dart-const-and-final](https://zenn.dev/captain_blue/articles/dart-const-and-final)

# 配列(List)についてのimmutable/mutableの話。

```Plain
//finalなのに値追加できているじゃん。
  final numbers = [1, 2, 3];
numbers.add(4);

これは参照が切り替わっているのでOK
numbersとその値が保存されているところが2箇所あるイメージ(memoryの中に)
numbers -> [1,2,3]
から
numbers -|
		| -> [1,2,3,4]
に参照先が切り替わっただけ。
```

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