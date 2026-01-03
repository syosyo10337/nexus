 

🤙

# Callbacks

---

### callbackとは？

一般に特定の処理をフックにして、別の処理を呼び出すこと。

### ActiveRecordにおけるcallback

インスタンスを作成して、レコードとして保存するまでの間に、オブジェクトに発生するイベントの前後に、任意の処理を発火させること。

発火させる処理は、

- callbackメソッドにブロック{ }を渡す、

- (==推奨==)メソッド参照(:シンボルでメソッドを参照)で指定する。

## callbackの一例

---

### before_save

Registers a callback to be called before a record is saved.

(引数に取った処理をオブジェクトがsaveする前にコールバックしてくるメソッド。

```Ruby
#メソッドにブロックを渡して、ブロックに実行する処理を記述
before_save { email.downcase! }
```

### before_create

オブジェクトをDBへレコードとして新規に保存されるときに、コールバックをトリガーさせるメソッド。newでは呼ばれない。

```Ruby
#create_activation_digestというメソッドを呼び出し
before_create :create_activation_digest
```

より詳しく知りたい場合には

[

Active Record コールバック - Railsガイド

Railsアプリケーションを普通に操作すると、その内部でオブジェクトが作成・更新・削除（destroy）されます。Active Recordはこの オブジェクトライフサイクル へのフックを提供しており、これを用いてアプリケーションやデータを制御できます。 コールバックは、オブジェクトの状態が切り替わる「前」または「後」にロジックをトリガします。 コールバックとは、オブジェクトのライフサイクル期間における特定の瞬間に呼び出されるメソッドのことです。コールバックを利用することで、Active Recordオブジェクトが作成/保存/更新/削除/検証/データベースからの読み込み、などのイベント発生時に常に実行されるコードを書くことができます。 コールバックを利用するためには、コールバックを登録する必要があります。コールバックの実装は普通のメソッドと特に違うところはありません。これをコールバックとして登録するには、マクロのようなスタイルのクラスメソッドを使います。 このマクロスタイルのクラスメソッドはブロックを受け取ることもできます。以下のようにコールバックしたいコードがきわめて短く、1行に収まるような場合にこのスタイルを使ってみます。 コールバックを登録して、特定のライフサイクルのイベントでのみ呼び出されるようにすることも可能です。 コールバックはprivateメソッドとして宣言するのが好ましい方法です。コールバックメソッドがpublicな状態のままだと、このメソッドがモデルの外から呼び出され、オブジェクトのカプセル化の原則に違反する可能性があります。 Active Recordで利用可能なコールバックの一覧を以下に示します。これらのコールバックは、実際の操作中に呼び出される順序に並んでいます。 after_saveコールバックは作成と更新の両方で呼び出されますが、コールバックマクロの呼び出し順序にかかわらず、常に、より具体的な after_createコールバックや after_updateコールバックより 後に 呼び出されます。 コールバック内では属性の更新や保存は行わないようにしてください。たとえば、コールバック内で update(attribute: "value")を呼び出してはいけません。このような操作はモデルのステートを変化させて、コミット時に思わぬ副作用が生じる可能性があります。 before_create、 before_update、およびそれより前に発火するコールバックで値を（ self.attribute = "value" のように）直接代入するのは安全です。 before_destroyコールバックは、 dependent: :destroyよりも 前に配置してください（または prepend: trueオプションをお使いください）。理由は、そのレコードが dependent: :destroy関連付けによって削除されるよりも前に before_destroy コールバックが実行されるようにするためです。 after_initialize コールバックは、Active Recordオブジェクトが1つインスタンス化されるたびに呼び出されます。インスタンス化は、直接 newを実行する他にデータベースからレコードが読み込まれるときにも行われます。これを利用すれば、Active Recordの initialize メソッドを直接オーバーライドせずに済みます。 コールバックは、Active Recordがデータベースからレコードを1つ読み込むたびに呼び出されます。 after_findと after_initializeが両方定義されている場合は、 after_find が先に実行されます。 after_initializeと after_findコールバックには、対応する before_* メソッドはありませんが、他のActive Recordコールバックと同様に登録できます。 irb> User.new オブジェクトは初期化されました => # irb> User.first オブジェクトが見つかりました オブジェクトは初期化されました => # after_touch コールバックは、Active Recordオブジェクトがtouchされるたびに呼び出されます。 irb> u = User.create(name: 'Kuldeep') => #<User id: 1, name: "Kuldeep", created_at: "2013-11-25 12:17:49", updated_at: "2013-11-25 ...

![](Ruby%20on%20Rails/Attachments/favicon%202.ico)https://railsguides.jp/active_record_callbacks.html#%E5%88%A9%E7%94%A8%E5%8F%AF%E8%83%BD%E3%81%AA%E3%82%B3%E3%83%BC%E3%83%AB%E3%83%90%E3%83%83%E3%82%AF

![](cover_for_facebook.png)](https://railsguides.jp/active_record_callbacks.html#%E5%88%A9%E7%94%A8%E5%8F%AF%E8%83%BD%E3%81%AA%E3%82%B3%E3%83%BC%E3%83%AB%E3%83%90%E3%83%83%E3%82%AF)

# オプションをつけた条件付きのcallback

---

オプションハッシュとして、`:if` または`:unless` をキーに、

値として、:シンボル、`Proc`または`Array`を引数に取ります

```Ruby
after_destroy if: :high_price? do
    Rails.logger.warn "Book with high price is deleted: #{self.attributes}"
    Rails.logger.warn "check it!"
  end

#:if => :high_price?のハッシュロケット表記でもok
```

#controllerでは、コールバックのような機能でbefore_actionなどがある。--こちらはbeforeフィルタ/フックと呼ばれる