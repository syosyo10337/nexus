---
tags:
  - rails
created: 2026-01-03
status: active
---

# Select_box

---

単体でselectボックスを使いたいときには、

select_tagもしくは、collection_selectを使うと良い。

他にも、フォームビルダーオブジェクトをオブジェクトとして、f.collection_selectという形で使えるメソッドが

- [f.select](http://f.select) -最もシンプルはセレクトぼっくすを作成する。

- f.collection_select -fのモデルの情報をもとに、各<option>タグについての、value属性値、テキストの内容を指定できる。

- (f.grouped_collection_select)

cf)

[

フォーム(form) | Railsドキュメント

フォーム関連の約50個のメソッドのオプションや使い方の例など。form_for／form_tag／check_box／check_box_tag／radio_button／radio_button_tag／text_area／text_area_tag／password_field／password_field_tag／hidden_field／hidden_field_tag／label／...

![](favicon%2017.ico)https://railsdoc.com/form#select_tag

![](form.png)](https://railsdoc.com/form#select_tag)

作りたいフォームによって分類 他のモデルの情報が欲しいか？

<option>を作るのか、側も作るのか？

class属性を<select>に付けるには？→

```Ruby
collection_select(オブジェクト名, メソッド名, 要素の配列, value属性の項目, テキストの項目, オプション={}, HTML属性={} or イベント属性={})

# f.object
f.collection_select(メソッド名, 要素の配列, value属性の項目, テキストの項目, オプション={}, HTML属性={} or イベント属性={})
```

わかるように、optionのハッシュを省略すると、HTML/ イベント属性は付与できない。v