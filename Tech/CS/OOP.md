---
tags:
  - computer-science
  - oop
  - programming
created: 2026-01-04
status: active
---

# OOP

[__construct と__destruct](#b3ce1fe6-1c56-4de8-9a25-880e22b55680)

[OOPのオブジェクトインターフェースとは](#347af39e-fa6a-4cfb-9b4e-229ee7456e33)

[PHPで書くinterface](#f82d91b8-36ee-470c-95ed-997ddc0094c4)

[DI(Dependancy Injection)](#e618b9fb-ab3b-477e-a58a-06d5d3944bfc)

[インジェクションの種類](#640de202-a088-4632-8521-2b5e8ae058de)

[コンストラクタインジェクション](#fa719d15-d5fe-4419-b960-559b22329de9)

[セッターインジェクション](#ac59fb4e-c9da-40a6-bc45-c85444906ff2)

# __construct と__destruct

- コンストラクタはオブジェクトが生成されるたびに実行される特殊な関数のこと。

- デストラクタ（destructor）は、オブジェクトが不要になり、メモリから解放される際に自動的に呼び出される特殊なメソッドです。デストラクタは、オブジェクトが削除される前にリソースを解放したり、後処理を行ったりするために使用されます。

PHPにおけるデストラクタが呼ばれるタイミング

1. unset()関数による呼び出し

2. スクリプトの実行が終了した場合:  
    スクリプトが終了すると、そのスコープ内で作成されたオブジェクトは自動的に破棄されます。この場合、オブジェクトが破棄されるタイミングはスクリプトの終了時点です。

```PHP
<?php
class MyClass {
    public function __destruct() {
        echo "オブジェクトが破棄されました。\n";
    }
}

$myObj = new MyClass();
// スクリプトが終了すると、オブジェクトが破棄され、デストラクタが呼び出される
```

ただし、オブジェクトが他のオブジェクトや変数によって参照されている場合、参照が解除されるまでオブジェクトは破棄されません。参照カウントが0になると、PHPのガーベジコレクタがオブジェクトを削除し、デストラクタが呼び出されます

# OOPのオブジェクトインターフェースとは

---

  
オブジェクトインターフェイスは、オブジェクト指向プログラミング（OOP）の概念で、あるクラスが実装すべきメソッドの構造のみを定義します。

インターフェイスは実際の実装を持たず、クラスに実装すべきメソッドのシグネチャ（名前、引数、戻り値の型）を提供します。

これにより、異なるクラスが同じインターフェイスを実装することで、共通の振る舞いを持つことができ、柔軟なコードの再利用が可能になります。つまり、共通のインターフェースを持ったクラス達は、それを利用する側のクラスから見ると共通の振る舞いをすることが担保されるということ。

## PHPで書くinterface

PHPにおいてインターフェイスは、interfaceキーワードを使用して定義されます。クラスは、implementsキーワードを使ってインターフェイスを実装できます。インターフェイスを実装するクラスは、インターフェイスで定義されたすべてのメソッドを実装しなければなりません。

以下に、PHPでのインターフェイスの定義と実装の例を示します。

```PHP
interface Animal {
	public function speak(): string;
	public function eat(string $food): void;
}


// クラスにインターフェイスを実装する例:
class Dog implements Animal {
	public function speak(): string {
		return "Woof!";
	}

	public function eat(string $food): void {
    echo "The dog is eating " . $food;
	}
}
```

  
  
cf. )

何のためのインターフェース?  
[https://zenn.dev/sumiren/articles/3e1d976e998c64](https://zenn.dev/sumiren/articles/3e1d976e998c64)[https://www.php.net/manual/ja/language.oop5.interfaces.php](https://www.php.net/manual/ja/language.oop5.interfaces.php)

# DI(Dependancy Injection)

日本語で言うところの依存性注入

オブジェクト指向プログラミングにおいて、クラスが他のクラスやオブジェクトに依存する際に、その依存関係を外部から注入するデザインパターンです。これにより、コードの結合度を低く保ち、再利用性とテスト容易性を向上させることができます。

## インジェクションの種類

1. コンストラクタインジェクション

2. セッターインジェクション

3. インターフェースインジェクション

### コンストラクタインジェクション

クラスのコンストラクタで依存関係を宣言し、外部から注入します。コンストラクタインジェクションは最も一般的な依存性注入の方法です。

```PHP
interface PaymentProcessorInterface
{
    public function processPayment(float $amount);
}

class StripePaymentProcessor implements PaymentProcessorInterface
{
    public function processPayment(float $amount)
    {
        // Stripeを使って支払いを処理する
    }
}

class PaymentService
{
    protected $paymentProcessor;

    public function __construct(PaymentProcessorInterface $paymentProcessor)
    {
        $this->paymentProcessor = $paymentProcessor;
    }

    public function makePayment(float $amount)
    {
        $this->paymentProcessor->processPayment($amount);
    }
}
```

### セッターインジェクション