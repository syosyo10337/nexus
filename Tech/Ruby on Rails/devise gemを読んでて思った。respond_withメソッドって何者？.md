---
tags:
  - rails
  - controller
  - routing
  - auth
created: 2026-01-03
status: active
---

# devise gemを読んでて思った。respond_withメソッドって何者？

---

## そもそも

Rails 4.2のリリースノートにて、`respond_with`メソッドはrails本体のメソッドでは無くなったそうです。

参考)

[

Ruby on Rails 4.2 リリースノート - Railsガイド

既存のアプリケーションをアップグレードするのであれば、その前に質のよいテストカバレッジを用意するのはよい考えです。Railのバージョンが4.1に達していない場合は、まずアプリケーションをRails 4.1にアップグレードし、アプリケーションが期待どおりに動作することを確認してからRails 4.2にアップグレードしてください。アップグレードの際に注意すべき点のリストについては、 Ruby on Rails アップグレードガイド を参照してください。 Active Jobとは、Rails 4.2から採用された新しいフレームワークです。Active Jobは、 Resque、 Delayed Job、 Sidekiq など、さまざまなクエリシステムの最上位に位置するものです。 Active Job APIを使用して記述されたジョブは、Active Jobがサポートするどのクエリシステムでもアダプタを介して実行できます。Active Jobは、ジョブを直ちに実行できるインラインランナー (inline runner) として最初から構成済みです。 ジョブの引数にActive Recordオブジェクトを与えたくなることはよくあります。Active Jobでは、オブジェクト参照をURI (uniform resource identifiers) として渡します。オブジェクト自身をマーシャリングしません。このURIは、Railsに新しく導入された Global ID ライブラリによって生成され、ジョブはこれを元にオブジェクトを参照します。Active Recordオブジェクトをジョブの引数として渡すと、内部的には単にGlobal IDが渡されます。 たとえば、 trashable というActive Recordオブジェクトがあるとすると、以下のようにシリアライズをまったく行わずにジョブに引き渡すことができます。 詳細については、 Active Jobの基礎 を参照してください。 今回のリリースで、Action MailerはActive Jobの最上位に配置され、 deliver_later メソッドを使用してジョブキューからメールを送信できるようになりました。これにより、キューを非同期

![](favicon%2020.ico)https://railsguides.jp/4_2_release_notes.html#respond-with%E3%81%A8%E3%82%AF%E3%83%A9%E3%82%B9%E3%83%AC%E3%83%99%E3%83%AB%E3%81%AErespond-to%E3%81%AE%E6%89%B1%E3%81%84%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6

![](cover_for_facebook%206.png)](https://railsguides.jp/4_2_release_notes.html#respond-with%E3%81%A8%E3%82%AF%E3%83%A9%E3%82%B9%E3%83%AC%E3%83%99%E3%83%AB%E3%81%AErespond-to%E3%81%AE%E6%89%B1%E3%81%84%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6)

そんでもって、respondersというgemにその機能が移植される形になったそうです。`devise`gemと依存性があるため、deviseを入れた際に勝手にインストールされて、勝手に使えるようになっています。

[

responders/respond_with.rb at main · heartcombo/responders

You can't perform that action at this time. You signed in with another tab or window. You signed out in another tab or window. Reload to refresh your session. Reload to refresh your session.

![](favicon%2021.ico)https://github.com/heartcombo/responders/blob/main/lib/action_controller/respond_with.rb

![](responders.png)](https://github.com/heartcombo/responders/blob/main/lib/action_controller/respond_with.rb)

Devise gemを読み解く上で最低限読み解く上での挙動としては、

**respond_withの挙動**

1. アクションに対応するテンプレートを探して表示する

2. テンプレートが無い場合　
    
    1. GETアクセスだったら　テンプレートが見つからないエラーを返す　
    
    2. GETアクセス以外だったら
        
        1. validation のエラーがあれば編集（もしくは新規）画面を render する
        
        2. validation のエラーが無ければリダイレクト（locationパラメータで指定可能）
        
    

つまり、

```Ruby
def create
	if
		redirect_to xxxx
	else
		render xxx
	end
end
```

と条件分岐を必要がないってこと。らしい。

参考)

[

respond_with

![](favicon%2022.ico)https://apidock.com/rails/v4.0.2/ActionController/MimeResponds/respond_with



](https://apidock.com/rails/v4.0.2/ActionController/MimeResponds/respond_with)

[

![](favicon%2023.ico)http://blog.livedoor.jp/sasata299/archives/51804693.html



](http://blog.livedoor.jp/sasata299/archives/51804693.html)