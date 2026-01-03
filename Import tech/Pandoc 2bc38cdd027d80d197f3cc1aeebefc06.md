 

# Pandoc

[mdからHTMLを生成する](#2bc38cdd-027d-8080-aa9e-d997a1d3603f)

[**Pandoc テンプレート記法ガイド**](#2be38cdd-027d-80ae-b2a1-efac3aa60ea2)

[https://pandoc-doc-ja.readthedocs.io/ja/latest/users-guide.html](https://pandoc-doc-ja.readthedocs.io/ja/latest/users-guide.html)

# mdからHTMLを生成する

単純にインプットとアウトプットを出力するだけで良いらしいんですが、、

```Plain
pandoc memo.md -s -o memo.html
```

**ポイント:** `-s` (standalone) オプションを付けると、単なるHTMLタグの断片ではなく、`<head>`や`<body>`を含んだ完全なHTMLファイルとして出力されます。

`**--self-contained**`

## **Pandoc テンプレート記法ガイド**

**1. 変数の展開 $variable$**

YAML front matterやコマンドラインで指定した値を埋め込む：

_<!-- Markdownのfront matter -->_

- --

title: ドキュメントのタイトル

author: 田中太郎

- --

_<!-- テンプレートでの展開 -->_

<h1>$title$</h1>        _<!-- → <h1>ドキュメントのタイトル</h1> -->_

<p>$author$</p>         _<!-- → <p>田中太郎</p> -->_

**2. 条件分岐 $if(variable)$...$endif$**

変数が存在する（または true）場合のみ出力：

$if(title)$

<h1>$title$</h1>

$endif$

_<!-- else も使える -->_

$if(author)$

<p>著者: $author$</p>

$else$

<p>著者: 不明</p>

$endif$

_<!-- elseif も可能 -->_

$if(format)$

フォーマット: $format$

$elseif(type)$

タイプ: $type$

$else$

情報なし

$endif$

**3. ループ $for(variable)$...$endfor$**

配列をループ処理：

_# front matter_

tags:

- JavaScript

- TypeScript

- React

_<!-- テンプレート -->_

<ul>

$for(tags)$

<li>$tags$</li>

$endfor$

</ul>

_<!-- 出力 -->_

<ul>

<li>JavaScript</li>

<li>TypeScript</li>

<li>React</li>

</ul>

**4. セパレータ $sep$**

ループ内で要素間に区切り文字を挿入：

$for(tags)$$tags$$sep$, $endfor$

_<!-- → JavaScript, TypeScript, React -->_

$for(author)$$author$$sep$ / $endfor$

_<!-- → 田中太郎 / 山田花子 -->_

**5. ネストしたオブジェクト**

ドット記法でアクセス：

_# front matter_

meta:

created_at: 2024-01-01

updated_at: 2024-06-15

<p>作成日: $meta.created_at$</p>

<p>更新日: $meta.updated_at$</p>