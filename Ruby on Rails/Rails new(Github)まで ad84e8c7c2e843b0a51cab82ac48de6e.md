 

![](icons8-jewel-96.png)

# Rails new(Github)まで

---

### 1. Ruby のversionを確認する

```Shell
$ ruby -v
```

- バージョンが気に入らない時はrbenvを使って、バージョンを変更しましょう

---

### 2.gemを使って Railsをインストールしているかと確認

Rubyのversionによってはrails入ってなかったりするので、(rubyのバーションごとにinstallされているgemは独立している)

```Shell
#ローカルにあるgemを一覧表示
$ gem list ジェム名
#ex)
$ gem list rails 


#ローカルにレイルズをインストール　
$ gem install rails 
#-vオプションでバージョンも指定できる。(6.1系だと6.1.5が最終?)
$ gem install rails -v 6.0.4
```

[

【Rails】Ruby on Railsのバージョンを下げる方法を実例で解説｜指定したバージョンをインストールして、ダウングレードする手順

rails new で新しいRailsのアプリケーションを作成すると、インストール済みのRialsの中の最新のバージョンが使用されます。 Railsのバージョンが新しいすぎる場合、アプリケーションの中で使用しているgemのパッケージが対応しておらず使用できない場合があります。 ここではそんなときに、ダウングレードした昔のバージョンでRialsアプリケーションを作成する方法についてまとめています。 まずは、「gem list rails」コマンドを使って、現在インストールされているRailsのバージョンを確認します。 実例 #現在インストール済みのバージョンを確認 $ gem list rails *** LOCAL GEMS *** bulma-rails (0.9.1) rails (6.1.3) rails-dom-testing (2.0.3) rails-html-sanitizer (1.3.0) sass-rails (6.0.0) sassc-rails (2.1.2) sprockets-rails (3.2.2) この場合、「rails (6.1.3)」となっているので、インストールされているRailsのバージョンは「6.1.3」のみであることがわかります。 以下で、このRails「6.1.3」をRails「５.1.4」（５系の最新版）にダウングレードします。 ダウングレードしたいRailsのバージョンがインストールされていない場合は、別途インストールする必要があります。 実例 Railsの「5.2.4」をインストールする場合は以下のようになります。 #5系のインストール $ gem install -v 5.2.4 rails 実行後に、再度「gem list rails」を実行して、インストール済みのパッケージを確認します。 $ gem

![](cropped-7ae63ebcd302897cd8cbf97b5f2a73b2-192x192.png)https://prograshi.com/framework/rails/how-to-downgrade-rails-version/

![](image-3.png)](https://prograshi.com/framework/rails/how-to-downgrade-rails-version/)

- おニューのマシンを使った環境ならgem “bundler” もインストールしているか確認

---

### 3. Rails newする

- rails newコマンドについて

```Shell
#_x.x.x_でバージョンを指定してアプリ作成
$ rails _x.x.x_ new アプリ名

#カレントディレクトリにアプリ作成
$ rails  new .
```

---