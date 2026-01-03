---
tags:
  - rails
  - activerecord
  - controller
  - routing
created: 2026-01-03
status: active
---

# ActiveAdmin

[https://activeadmin.info/documentation.html](https://activeadmin.info/documentation.html)

[https://activeadmin.info/documentation.html](https://activeadmin.info/documentation.html)

[

ActiveAdmin のメニュー設定をすごく便利にする ActiveAdmin::MenuTree のご紹介 - Qiita

ActiveAdminのメニュー設定を便利にする ActiveAdmin::MenuTree というgemを作ったのでご紹介します。ActiveAdminとはhttps://activeadmi…

![](Ruby%20on%20Rails/Attachments/apple-touch-icon-ec5ba42a24ae923f16825592efdc356f.png)https://qiita.com/shuuuuun/items/55e26c798281c006ad30

![](Ruby%20on%20Rails/Attachments/article-ogp-background-9f5428127621718a910c8b63951390ad.png)](https://qiita.com/shuuuuun/items/55e26c798281c006ad30)

[

Active Admin 徹底解説 - Qiita

はじめにActiveAdminを仕事でいじったので分かった事をまとめてみます。(Ruby on rails 4.3)ActiveAdminとはModelに設定したパラメータを利用してCRUDを…

![](Ruby%20on%20Rails/Attachments/apple-touch-icon-ec5ba42a24ae923f16825592efdc356f.png)https://qiita.com/MariMurotani/items/aed93986e29249fd65e5

![](Ruby%20on%20Rails/Attachments/article-ogp-background-9f5428127621718a910c8b63951390ad%201.png)](https://qiita.com/MariMurotani/items/aed93986e29249fd65e5)

[基本的な使い方](#c8fe1329-56bd-42bd-be7c-7f3725bacf7e)

[`ActiveAdmin.register {model} do`](#d3e62f77-39bb-4dde-990e-19a2c84e5c3c)

[`ActiveAdmin.register_page {} do`](#f4ef90f0-2e90-46de-8f9d-3656c02231f8)

[`menu`](#5459744d-796c-4cf2-b01a-66c73d70320f)

[4**つのオプション**](#23d1e5a8-1424-492c-b69c-b6ae88961430)

[`**actions**`:](#70719406-9a25-4a41-a458-f3000f4c1452)

[`**permit_params**`:](#843f45dc-26e5-4751-99f7-5d8dfa169f71)

[`filter`](#0f65722c-e4a6-45e2-be63-5f1565cb661e)

[`**before_action**`:](#d1a33880-881f-4a2a-bb18-f4dca9a5325c)

[`index`](#66d424ce-492f-4aa6-907e-67c8e224038d)

[`form`](#2a292601-e2fc-4981-ad8f-77802afc0d59)

[`**controller**`](#a582ec9e-7466-4ad7-a6e5-069cafd62a5f)

[attr_reader](#db672ac6-e1d8-4c66-9cb1-04a0a6e67d9e)

[**アクションのカスタマイズ**](#7430438f-cfab-477e-9880-bc65988752db)

[**フィルタリングとスコープ**](#2b8fb228-052b-4c86-ad12-4dc1885bb310)

[**データの前処理**](#2cdda84c-8b20-4310-abc4-ba5b64ab7012)

[**データの後処理**](#824a1bfb-9eff-4b6e-b3c7-2f7ff0a07a6e)

[**追加のヘルパーメソッド**](#2a18f5b4-1a4f-4ed1-bf1f-f8dff6a86916)

[**権限の管理**](#91aca726-351e-402c-8b1a-565ccf8acf4a)

[**カスタムページのレンダリング**](#bd86191d-18c6-468f-9ebe-982cf04be7c2)

[**エラーハンドリング**](#67f1082a-66f7-45ff-b592-d079613cfadd)

[`member_action`](#70661702-41db-4a9b-8459-09cba31b4026)

[`**action_item**`](#caca545c-34ac-474f-b01a-f085f07570af)

[`config`](#5fb378ab-aa2a-4b9c-9501-2c23d284b7eb)

[`.batch_actions`](#7cdf646a-737d-4612-b916-23d61e0a7ef5)

# 基本的な使い方

```Ruby
ActiveAdmin.register RouletteQrCode do 
  decorate_with RouletteQrCodeDecorator

  menu parent: Roulette.model_name.human, priority: 4

  config.batch_actions = false

  actions :show, :index, :deliver_qr_code

  filter :roulette
  filter :shop_id

  before_action :warm_cache_shop, only: :index

  index do
    id_column
    column :roulette
    column :shop
    column :qr_code_content
    column :last_mail_send_at
    actions
  end

  controller do

    private

    def warm_cache_shop
      shop_ids = collection.map { |roulette_qr_code| roulette_qr_code.shop_id }
      return if shop_ids.blank?

      KikanClient::Models::Paddock::V1::Business.cache
        .warm_cache!(shop_ids)
    end
  end


  show do |roulette_qr_code|
    attributes_table do
      row(:id)
      row(:roulette)
      row(:shop)
      row(:qr_code_content)
      row(:qr_code_gantry_file) do
        roulette_qr_code.qr_code_image_tag
      end
      row(:poster_with_qr_image) do
        roulette_qr_code.poster_with_qr_image_tag
      end
      row(:last_mail_send_at)
    end
  end
end
```

## `ActiveAdmin.register {model} do`

model(リソース名)を指定して、作成する管理画面を指定する。

## `ActiveAdmin.register_page {} do`

modelに関係ない新規ページを作成できる。

e.g. `ActiveAdmin.register_page "RoulettePosterProcessor" do`

```Ruby
ActiveAdmin.register_page "RoulettePosterProcessor" do
  menu false

  content title: 'ルーレットのポスターのQRコードの位置を設定' do
    div do
      render Admin::RoulettePosterProcessorComponent.new(Roulette.find(params[:roulette_id]))
    end
  end
end
```

## `menu`

`menu false`

を指定するとmenu barから非表示にできる。

### 4**つのオプション**

`menu`メソッドでは以下の４つのオプションによってメニューをカスタマイズできます。

- `:label` - 文字列かprocでメニューに表示するラベルを設定できる

- `:parent` - 文字列IDかラベルで親メニューを指定できる(ネストさせることができる)  
    `menu parent: Roulette.model_name.human, priority: 4`

- `:if` - ブロックかメソッドのシンボルでメニューを表示するかどうか制御できる

- `:priority` - 数値で優先度を設定できる(デフォルトは10)

ここでは`priority`と`parent`を中心に紹介します。

# `**actions**`:

利用可能なアクション（例えば表示、作成、更新）を定義しています

もちろん、Modelに存在する独自のメソッドも指定可能。

```Ruby
actions :all, except: %i[destroy edit]
```

# `**permit_params**`:

コントローラに渡されるパラメータを指定します。これにより、セキュリティリスクを減らすために、どのパラメータが許可されているかを制御できます。

受け取ることができるパラメータを前もって設定する

```Ruby
permit_params :shop_id, :roulette_id
```

## `filter`

画面右の検索ボックスのカスタム

絞り込み検索の項目を追加できる。

```Ruby
filter :roulette
filter :shop_id
```

# `**before_action**`:

これらは、特定のアクションが実行される前に実行されるメソッドを定義しています。例えば、`**before_create**` というのもの存在して、新しいレコードが作成される前に、トランザクションIDを割り当てます。

```Ruby
 	before_create :assign_transaction_id
  before_action :warm_cache_kikan_users, only: :index



def assign_transaction_id(resource)
      if resource.new_record?
        resource.transaction_kind = :manual_assignment
      end
    end

    def warm_cache_kikan_users
      KikanClient::Models::Paddock::V1::User.cache
        .warm_cache!(collection.map { |zurp| zurp.zas_user.kikan_user_id })
    end
```

# `index`

このブロック内で、indexページの表示項目の設定ができる。

こちらに記載があるものがoverrideできるらしい。[https://github.com/activeadmin/activeadmin/blob/master/lib/active_admin/resource_dsl.rb](https://github.com/activeadmin/activeadmin/blob/master/lib/active_admin/resource_dsl.rb)

```Ruby
index do
    id_column
    column :roulette
    column :shop
    column :qr_code_content
    column :last_mail_send_at
    actions
  end
```

# `form`

new/createようのフォーム生成しているんだな、きっと。

# `**controller**`

この ブロックは、特定の ActiveAdmin リソース（通常はモデルに対応）のためのコントローラーの振る舞いをカスタマイズするために使われます

**Controllerを簡易的に書くためのブロックらしい。**

Adminによって自動的に提供される標準のリソースアクション（例えば、`**index**`, `**show**`, `**new**`, `**create**`, `**edit**`, `**update**`, `**destroy**`）

## attr_reader

controllerブロックのなかでインスタンス変数への読み取りを許可する。

```Ruby
ActiveAdmin.register User do
  controller do
    attr_reader :custom_variable

    def some_method
      @custom_variable = "Some Value"
    end
  end
end
// .cutom_variableで読み取りができるようです.
```

このブロックでできること(by chat GPT)

### **アクションのカスタマイズ**

- **特定のアクションの振る舞いを変更**: 例えば、`**create**` や `**update**` アクションをオーバーライドして、レコードの作成や更新時のロジックをカスタマイズすることができます。

### **フィルタリングとスコープ**

- `**scoped_collection**` **メソッドのオーバーライド**: 特定の条件に基づいて表示するレコードのセットをフィルタリングすることができます（例：特定のユーザーに対してのみ表示するレコードを限定する）。
    
    - `**collection**`変数は、特定のモデルの全てのレコード、または特定のクエリによってフィルタリングされたレコードの集合を表します。例えば、あるモデルのインデックスページでは、そのモデルの全レコードが`**collection**`として表示されます。また、検索やフィルタリングを行うと、`**collection**`はその条件に合致するレコードのみを含むようになります。
    

### **データの前処理**

- `**before_action**` **フックの使用**: 特定のアクションが実行される前に特定のコードを実行することができます（例：データの検証、キャッシュのウォームアップ）。

### **データの後処理**

- `**after_action**` **フックの使用**: アクションの実行後に特定のコードを実行することができます。

### **追加のヘルパーメソッド**

- **ヘルパーメソッドの定義**: ビューで使用するためのヘルパーメソッドを定義することができます。

### **権限の管理**

- **アクセス制御**: 特定のアクションへのアクセスを制御するためのロジックを実装することができます。

### **カスタムページのレンダリング**

- **カスタムレスポンスの提供**: 特定のフォーマット（JSON、CSVなど）でのカスタムレスポンスを提供することができます。

### **エラーハンドリング**

- **例外処理**: 特定のアクションで発生した例外をキャッチ

# `member_action`

現在作成しているリソース(modelを元にしたもの)に特定のアクションを作成する。

- **動作**: このメソッドを使用すると、リソースの各インスタンスに対して特定のアクション（例えば、詳細表示、編集、削除などの標準アクションに加えて）を追加できます。

- **例**: ある特定のユーザーに対してのみ「承認」や「アーカイブ」などのカスタムアクションを追加する場合に使用します。

# `**action_item**`

- 特定のリソースのビューにカスタムボタンやリンクを追加するために使用されます。(カスタムでボタンを追加している感じ。)

- **動作**: このメソッドを使用すると、リソースの詳細ページやインデックスページにカスタムアクションへのリンクやボタンを追加できます。これは、リソース全体に対してではなく、特定のビューに対してアクションを追加する場合に便利です。

- **例**: 新しいレポートを作成するための「レポートを追加」ボタンや、特定の条件を満たすレコードに対してのみ表示される「特別な操作」リンクを追加する場合に使用します。

# `config`

### `.batch_actions`

一括処理の設定

- `**config.batch_actions = false**` という設定は、Ruby on RailsのActive Adminフレームワークにおいて使用されます。この設定は、Active Adminのインターフェース内でのバッチアクション（一括操作）の有効化または無効化を制御します。

具体的には、`**config.batch_actions = false**` と設定すると、以下のような効果があります：

1. **バッチアクションの無効化**: Active Adminの各リソース（例えば、ユーザーや記事などのデータモデル）のインデックスページにおいて、複数のレコードを選択して一括で操作する機能（バッチアクション）が無効になります。

2. **UIの変更**: バッチアクションを行うためのチェックボックスや、バッチアクションを選択するためのドロップダウンメニューなどのUI要素がインデックスページから削除されます。

3. **セキュリティ向上**: 特定の状況下で、バッチアクションがセキュリティリスクを引き起こす可能性がある場合、この設定を用いることでそのリスクを軽減できます。

4. **シンプルなインターフェース**: バッチアクションが必要ない場合や、インターフェースをよりシンプルに保ちたい場合に有用です。