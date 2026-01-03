---
tags:
  - typescript
  - function
  - data-structure
created: 2026-01-03
status: active
---

# Date/RegExp from JS

build-inの問題点

1. **非直感的な動作**: `Date`オブジェクトは、常識的には存在しない日付を解析しようとすると自己補正を試みます。たとえば、存在しない日付である2月30日を`Date`オブジェクトとして表現しようとすると、JavaScriptはこれを3月1日に補正します。これは読み手に混乱をもたらし、予期しない結果を生む可能性があります。

2. **フォーマットが手間**: `Date`オブジェクトを特定のフォーマットで表示するためには、しばしば独自のフォーマット関数を作成する必要があります。これは手間がかかるだけでなく、バグの原因ともなり得ます。

3. **タイムゾーンの扱い**: JavaScriptの`Date`オブジェクトは、常にローカルタイムゾーンで時間を表示します。しかし、ユーザーが世界中のさまざまな時間帯に分散している場合、これは非常に混乱を招きます。

`date-fns`や`Day.js`などのthird party製のライブラリを使って解消すると良いと思います。

[https://typescriptbook.jp/reference/builtin-api/regexp](https://typescriptbook.jp/reference/builtin-api/regexp)