 

⚠️

# Deviseのユーザ認証設計を理解する

config/initializer/devise.rbで

パスワードの文字数の設定や、emailの正規表現の設定が行える。

### Emailについて

- presence/uniquenessのvalidation

[

devise/validatable.rb at main · heartcombo/devise

You can't perform that action at this time. You signed in with another tab or window. You signed out in another tab or window. Reload to refresh your session. Reload to refresh your session.

![](Ruby%20on%20Rails/Attachments/favicon%203.ico)https://github.com/heartcombo/devise/blob/main/lib/devise/models/validatable.rb

![](devise.png)](https://github.com/heartcombo/devise/blob/main/lib/devise/models/validatable.rb)

- case_sensitive: trueのまま、validationを評価する直前(before_validation)で小文字に変更することで、validationレベルとデータベースレベルでの大文字小文字区別の問題を解消している。
    
    `before_validation :downcase_keys`
    
    の部分に注目
    

[

devise/authenticatable.rb at main · heartcombo/devise

This file contains bidirectional Unicode text that may be interpreted or compiled differently than what appears below. To review, open the file in an editor that reveals hidden Unicode characters. Learn more about bidirectional Unicode characters You can't perform that action at this time. You signed in with another tab or window.

![](Ruby%20on%20Rails/Attachments/favicon%203.ico)https://github.com/heartcombo/devise/blob/main/lib/devise/models/authenticatable.rb

![](devise.png)](https://github.com/heartcombo/devise/blob/main/lib/devise/models/authenticatable.rb)

### Passwordについて

> presence of password, confirmation and length.

[

devise/validatable.rb at main · heartcombo/devise

You can't perform that action at this time. You signed in with another tab or window. You signed out in another tab or window. Reload to refresh your session. Reload to refresh your session.

![](Ruby%20on%20Rails/Attachments/favicon%203.ico)https://github.com/heartcombo/devise/blob/main/lib/devise/models/validatable.rb

![](devise.png)](https://github.com/heartcombo/devise/blob/main/lib/devise/models/validatable.rb)

[

devise/database_authenticatable.rb at 6d32d2447cc0f3739d9732246b5a5bde98d9e032 · heartcombo/devise

You can't perform that action at this time. You signed in with another tab or window. You signed out in another tab or window. Reload to refresh your session. Reload to refresh your session.

![](Ruby%20on%20Rails/Attachments/favicon%203.ico)https://github.com/heartcombo/devise/blob/6d32d2447cc0f3739d9732246b5a5bde98d9e032/lib/devise/models/database_authenticatable.rb#L71

![](devise.png)](https://github.com/heartcombo/devise/blob/6d32d2447cc0f3739d9732246b5a5bde98d9e032/lib/devise/models/database_authenticatable.rb#L71)

ソースコードより

- 存在性○

- コンファメーションとの一致のvalidation○
    
    長さのvalidation○ (設定を変更したいときconfig/のdevise.rbで変更できる
    

- 歴史的経緯から、ハッシュ化されたパスワードの値は、encrypted_passwordカラムに保存される。

- 仮想的な属性にアクセスできる

```Ruby
#devise/lib/devise/models/database_authenticatable.rb

attr_reader :password, :current_password
attr_accessor :password_confirmation




def password=(new_password)
	@password = new_password
	self.encrypted_password = password_digest(@password) if @password.present?
end
#setterはメソッドとして定義されている
```

#deviseを使ったとき、開発者が意識するのはpassword属性だけで良い？

→deviseでハッシュ化して保存してくれる。

→factoryデータにconfirmation属性を持たせる必要がない