---
tags:
  - misc
  - testing
  - api
  - architecture
created: 2026-01-04
status: active
---

# MVVMを本気で理解する。

関連するlibraryやらを整理する。

- riverpod: ご定番のグローバルなステート管理用ライブラリ

- freezed: immutableなデータクラスを作れる。

目的やできること

view とmodelの結合度を小さくすることができる。　

これによって、

- maintainabilty

- testability

- Extensibility

を得られますと。

[

Flutter: MVVM Architecture

Model–View–ViewModel (MVVM) is a very established architectural pattern when it’s come to software development. What is so special about…

![](Import%20tech/Attachments/1*sHhtYhaCe2Uc3IU0IgKwIQ.png)https://medium.com/flutterworld/flutter-mvvm-architecture-f8bed2521958

![](Import%20tech/Attachments/1*vXhzgjHv6mrbZQzKnOCIDA.png)](https://medium.com/flutterworld/flutter-mvvm-architecture-f8bed2521958)

[

MVVMを勉強するときに参考になった 概要まとめ & アンチパターン & リンク集 - Qiita

MVVMについて勉強したことのまとめ今更ながら、MVVMな開発をお仕事で行なっています。全然理解できていないので、色々と調べつつメモを残していきます。また、こんな実装はMVVMじゃない？ってき…

![](Import%20tech/Attachments/production-c620d3e403342b1022967ba5e3db1aaa.ico)https://qiita.com/ebi-toro/items/046c9a43b15b9e376198

![](Import%20tech/Attachments/article-ogp-background-412672c5f0600ab9a64263b751f1bc81.jpeg)](https://qiita.com/ebi-toro/items/046c9a43b15b9e376198)

そもそものmodelとviewを整理する。

# **Model**

データを表現するクラスで、business ロジック等を持っても良い。

> The model represents a single source of truth that carries the real-time fetch data or database-related queries.

> This layer can contain business logic, code validation, etc. This layer interacts with ViewModel for local data or for real-time. Data are given in response to ViewModel.

# **ViewModel**

viewとmodelの仲介者

> ViewModel is the mediator between View and Model, which accept all the user events and request that to Model for data. Once the Model has data then it returns to ViewModel and then ViewModel notify that data to View.

1つのviewModelは複数のviewによって利用されることができる。

[

Flutter: Riverpod(v2)を使ったViewModelの作り方

Flutterで riverpod という状態管理ライブラリを使って、MVVMアーキテクチャにおけるViewModelを作成する。

![](Import%20tech/Attachments/icon%201.png)https://zenn.dev/hakoten/articles/dacefd6f63768e

![](Import%20tech/Attachments/og-base-w1200-v2.png)](https://zenn.dev/hakoten/articles/dacefd6f63768e)

[

【Flutter】実務で使うMVVMの実装例

みなさんこんにちは。 これまで参画してきた案件の中で、MVVM（MVCの場合もありましたが）の実装例が自分の中で固まってきたと感じたので、こちらで記事をまとめてみようと思います。 個人開発でも使用できますが、スピードなどを考えると微妙な部分もありますのでご注意ください（個人的にはAPI連携も含めると保守性が上がるので個人開発でもアリです）。

![](Import%20tech/Attachments/icon%201.png)https://zenn.dev/kisia_flutter/articles/febeddb432491e

![](Import%20tech/Attachments/og-base-w1200-v2%201.png)](https://zenn.dev/kisia_flutter/articles/febeddb432491e)

[

RiverpodでFormのValidationをやりたい!

前回、StatefulWidgetの機能を使って、FormのValidationをやってたのですが、これはよくないよね〜ということで、頑張ってコード書いていい感じのコードが書けましたので記事にしようと思いました。

![](Import%20tech/Attachments/icon%201.png)https://zenn.dev/joo_hashi/articles/97105a03ef21b9

![](Import%20tech/Attachments/og-base-w1200-v2%202.png)](https://zenn.dev/joo_hashi/articles/97105a03ef21b9)