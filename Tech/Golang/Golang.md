---
tags:
  - golang
  - syntax
  - error
  - package
created: 2026-01-03
status: active
---

![](Golang/go-8.svg)

# Golang

---

# go.mod とgo.sumについて　

`go.mod` と `go.sum` の関係は、iOS の `Podfile` と `Podfile.lock` に近いものがあります。

簡単に言うと、次のような対応関係になります。

依存関係の宣言は `go.mod`で行い, `go.sum`では実際のバージョンとの整合性の管理を行います。

go.sumではhash値も記録されるためより厳密らしい。

|   |   |   |   |
|---|---|---|---|
|ファイル|Go Modules|CocoaPods|役割|
|**依存関係の宣言**|`go.mod`|`Podfile`|どのライブラリを使うかを定義|
|**実際のバージョンと整合性の管理**|`go.sum`|`Podfile.lock`|インストールされたバージョンとチェックサムを記録|

`go mod tidy`によって、モジュールの整合性を見てくれる。

[go env -w GOPRIVATE=github.com/syoya/](Golang/go%20env%20-w%20GOPRIVATE=github%20com%20syoya%2028638cdd027d807b8cc9e8afaabf6980.html)

# `:=`について

[https://qiita.com/emioiso/items/f83d0460d09edb28aca3](https://qiita.com/emioiso/items/f83d0460d09edb28aca3)

変数宣言を省略することができ、変数の代入を持って初期化を行えるらしい

型推論までついているらしく、面白い

- ちなみにトップレベルだと使えないらしい。

標準プロジェクト設定: [https://github.com/golang-standards/project-layout/blob/master/README_ja.md](https://github.com/golang-standards/project-layout/blob/master/README_ja.md)

[https://github.com/golang-standards/project-layout/blob/master/README_ja.md](https://github.com/golang-standards/project-layout/blob/master/README_ja.md)

[struct（構造体）について](Golang/struct%EF%BC%88%E6%A7%8B%E9%80%A0%E4%BD%93%EF%BC%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6%2025738cdd027d80928a19f8c420c36553.html)

[ポインタについて](Golang/%E3%83%9D%E3%82%A4%E3%83%B3%E3%82%BF%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6%2025b38cdd027d80878cc0f79cdfdcb164.html)

[Go Modulesって?](Golang/Go%20Modules%E3%81%A3%E3%81%A6%2025738cdd027d80e3b55df2b325bbd888.html)

[Exported names](Golang/Exported%20names%2025738cdd027d805bacf4e2397d5114d5.html)

[functions](Golang/functions%2025738cdd027d808e89f7ff56154afea7.html)

[制御構文](Golang/%E5%88%B6%E5%BE%A1%E6%A7%8B%E6%96%87%2027038cdd027d80cfa4c4fec7adff9ed7.html)

[log.FatalF](Golang/log%20FatalF%2027238cdd027d80fbb4ced733b32ae7c6.html)

[trouble shoot](Golang/trouble%20shoot%2025b38cdd027d8072a1d6f3244044262c.html)

[make func](Golang/make%20func%2028638cdd027d80db8b0ddd37108f6a12.html)

[データ構造](Golang/%E3%83%87%E3%83%BC%E3%82%BF%E6%A7%8B%E9%80%A0%2028638cdd027d8089a1d6c1c4232b530e.html)

[panic](Golang/panic%2028638cdd027d80c28d0dd8e3453e9a92.html)

# Library

[bun](Golang/bun%2028738cdd027d80bf9dd1c01066319e31.html)