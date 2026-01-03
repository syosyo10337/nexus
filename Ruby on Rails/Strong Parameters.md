 

# Strong Parameters

[**Strong Parametersの基本的な概念**](#6ad75d10-d11b-4b61-b898-6d3f577ec77b)

[`**User**`**モデルでのStrong Parametersの実装**](#cfc89fc2-29f9-4862-886d-ee213b853a7c)

[**Strong Parametersの活用**](#dcf030a2-c7f0-480a-8586-0248189aff21)

[`**require**`**と**`**permit**`**の違い**](#61717f88-088e-4c61-86f5-b4bda355507f)

[**paramsハッシュの構造**](#323f4923-2c5f-4ed2-889f-979b8904831a)

Ruby on RailsにおけるStrong Parametersの仕組みは、ユーザからのリクエストの際に送られてくるパラメータに対するセキュリティを高める仕組みの一つです。

### **Strong Parametersの基本的な概念**

Strong Parametersは、Railsのコントローラー内で使用されるセキュリティ機能です。これは、ユーザーから送信されるパラメータのうち、開発者が事前に定義したもののみをデータベースに保存することを可能にします。これにより、悪意のあるユーザーによる不正なデータの注入や、アプリケーションの不正操作を防ぐことができます。

一言で言えば、Mass Assignmentを防ぐ機能です。

### `**User**`**モデルでのStrong Parametersの実装**

例として`**User**`**モデルが**`**name**`, `**email**`, `**password**`といった属性を持つ場合、これらを安全に扱うためには次のようにコントローラーにStrong Parametersを設定します。

```Ruby
class UsersController < ApplicationController

  # ...（その他のアクション）

  private

  def user_params
    params.require(:user).permit(:name, :email, :password)
  end
end
```

ここで、`**params.require(:user)**`は`**:user**`キーにネストされたパラメータの存在を必須とすることを意味しています。`**permit(:name, :email, :password)**`は、これら指定された属性のみがデータベースに保存されることを許可するためのものです。

### **Strong Parametersの活用**

コントローラーのアクション（例えば、ユーザー作成の`**create**`アクション）では、`**user_params**`メソッドを使用してパラメータをフィルタリングします。

```Ruby
def create
  @user = User.new(user_params)
  if @user.save
    # 成功した場合の処理
  else
    # 失敗した場合の処理
  end
end
```

この方法により、不正なパラメータがモデルに渡されることを防ぎ、アプリケーションのセキュリティを向上させることができます。

### `**require**`**と**`**permit**`**の違い**

- `**require**`: 必須とされるパラメータを指定します。この例では`**:user**`キーが必須であることを意味しています。`**:user**`キーが存在しない場合、エラーが発生します。

- `**permit**`: 許可されたパラメータを指定します。これにより、`**name**`、`**email**`、`**password**`のみが許可され、他のパラメータは無視されます。

### **paramsハッシュの構造**

paramsハッシュは通常、次のような構造を持っています：

```Ruby
params = {
  user: {
    name: "ユーザー名",
    email: "user@example.com",
    password: "password"
  }
}

```

このハッシュ内で、`**require(:user)**`は`**user**`キー下のパラメータ群を指定し、`**permit(:name, :email, :password)**`はその中の特定のパラメータのみを許可することを意味します。これにより、安全でコントロールされた方法でユーザー入力を扱うことが可能になります。