 

♻️

# envied

[https://pub.dev/packages/envied](https://pub.dev/packages/envied)

`envied`パッケージは、環境変数を型安全な方法で管理するためのツールです。`@EnviedField`アノテーションを使用して、環境変数をDartのコードに結びつけます。

`@EnviedField`アノテーションの主な引数は以下の通りです。

- `varName`: 環境変数の名前を指定します。この名前は、`.env`ファイルで定義されている環境変数の名前と一致する必要があります。(省略可能)

- `obfuscate`: trueに設定すると、生成されたコードで環境変数の値が難読化されます。APIキーなどの秘匿性の高い情報に使用します。

`@EnviedField`アノテーションで定義されたフィールドは、以下のような形式で定義されます。

```Dart
@EnviedField(varName: '環境変数名')
static final String フィールド名 = _Env.フィールド名;
```

例えば、`@EnviedField(varName: 'API_KEY')`と定義されている場合、対応するフィールドは`static final String apiKey = _Env.apiKey;`のように定義されます。

ここで、`_Env`は`envied`パッケージが生成するクラスであり、環境変数の値を保持します。`_Env.apiKey`は、`API_KEY`環境変数の値を表します。

`static final String apiKey`は、Dartのコード内で使用するための定数フィールドです。この定数を通じて、環境変数の値にアクセスします。

したがって、次のコードスニペットでは、

```Dart
@EnviedField(varName: 'API_KEY')
static final String apiKey = _Env.apiKey;
```

- `varName: 'API_KEY'`は、`.env`ファイルで定義されている環境変数の名前を指定しています。

- `static final String apiKey`は、Dartのコード内で使用するための定数フィールドを定義しています。

- `_Env.apiKey`は、`API_KEY`環境変数の値を表します。

これらを組み合わせることで、`.env`ファイルで定義された`API_KEY`環境変数の値を、Dartのコード内の`apiKey`定数フィールドを通じてアクセスできるようになります。

例えば、`.env`ファイルに`API_KEY=your_api_key`と定義されている場合、`Env.apiKey`を使用することで、Dartのコード内で`your_api_key`という値にアクセスできます。

# Secretes

[

【Flutter】APIキーの安全な管理 - Qiita

※「安全な管理」と書きましたが100%というわけではありません。1.導入以前flutter_dotenvパッケージを使用した以下記事を書きましたが、セキュリティリスク等の観点で、私の知識不足がご…

![](Flutter/Attachments%201/production-c620d3e403342b1022967ba5e3db1aaa%204.ico)https://qiita.com/myzw1mt3/items/1543c3e1307fb89279fa

![](Flutter/Attachments%201/article-ogp-background-9f5428127621718a910c8b63951390ad.png)](https://qiita.com/myzw1mt3/items/1543c3e1307fb89279fa)

[

How to Store API Keys in Flutter: --dart-define vs .env files

An overview of different techniques for storing API keys on the client, along with security best practices to prevent them from being stolen.

![](Flutter/Attachments%201/apple-touch-icon.png)https://codewithandrea.com/articles/flutter-api-keys-dart-define-env-files/

![](twitter-card.png)](https://codewithandrea.com/articles/flutter-api-keys-dart-define-env-files/)