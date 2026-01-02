 

# URi

- **Uri.encodeComponent(value)**

URLとして問題がないように、value %エンコーディングをしてくれる。

### **1.** **URIの解析と構築**

- `**Uri.parse**`: 文字列から `**Uri**` オブジェクトを生成します。

- `**Uri.http**` や `**Uri.https**`: 特定のHTTPまたはHTTPSスキームを持つ `**Uri**` オブジェクトを構築します。

- `**Uri.file**`: ファイルパスから `**Uri**` オブジェクトを生成します。

### **2.** **URIコンポーネントのエンコード/デコード**

- `**Uri.encodeComponent**`: 特定のURIコンポーネントをエンコードします。

- `**Uri.encodeFull**`: URI全体をエンコードします。

- `**Uri.decodeComponent**`: エンコードされたURIコンポーネントをデコードします。

- `**Uri.decodeFull**`: エンコードされたURI全体をデコードします。

### **3.** **URIコンポーネントへのアクセス**

- `**Uri.scheme**`: URIのスキーム部分（例：`**http**`）にアクセスします。

- `**Uri.host**`: ホスト名にアクセスします。

- `**Uri.port**`: ポート番号にアクセスします。

- `**Uri.path**`: パス部分にアクセスします。

- `**Uri.query**`: クエリストリングにアクセスします。

- `**Uri.fragment**`: フラグメントにアクセスします。

### **4.** **URIの変更**

- `**Uri.replace**`: 既存の `**Uri**` オブジェクトの特定の部分を変更した新しい `**Uri**` オブジェクトを生成します。

### **5.** **URIの比較と構成**

- `**Uri.hasScheme**`: 特定のスキームを持つかどうかをチェックします。

- `**Uri.hasAbsolutePath**`: 絶対パスを持つかどうかをチェックします。

- `**Uri.hasQuery**`: クエリコンポーネントを持つかどうかをチェックします。

- `**Uri.resolve**`: 与えられた相対URIをこのURIに対して解決します。

### **6.** **その他のユーティリティ**

- `**Uri.toFilePath**`: ファイルシステムパスに `**Uri**` を変換します。

- `**Uri.dataFromString**`: データURIを生成します。

これらの機能を組み合わせることで、URIの解析、構築、変更、比較などを柔軟に行うことができます。URIはウェブの世界で非常に重要な役割を果たすため、`**Uri**` クラスのこれらの機能はウェブアプリケーションやHTTPクライアントの開発において特に役立ちます。

cf.

[

Uri class - dart:core library - Dart API

API docs for the Uri class from the dart:core library, for the Dart programming language.

![](Flutter/Attachments%201/favicon.png)https://api.dart.dev/stable/3.2.4/dart-core/Uri-class.html



](https://api.dart.dev/stable/3.2.4/dart-core/Uri-class.html)