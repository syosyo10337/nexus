---
tags:
  - rails
  - controller
  - view
  - routing
created: 2026-01-03
status: active
---

🍇

# {Grape} API

```Ruby
desc 'Create a status.'
  params do
    requires :status, type: String, desc: 'Your status.'
  end
  post do
    authenticate!
    Status.create!({
      user: current_user,
      text: params[:status]
    })
end
```

repository

[

GitHub - ruby-grape/grape: An opinionated framework for creating REST-like APIs in Ruby.

An opinionated framework for creating REST-like APIs in Ruby. - GitHub - ruby-grape/grape: An opinionated framework for creating REST-like APIs in Ruby.

![](Ruby%20on%20Rails/Attachments/fluidicon.png)https://github.com/ruby-grape/grape

![](grape.png)](https://github.com/ruby-grape/grape)

[What is Grape?](#69b7144e-58b8-4caf-9d10-e13dfd175420)

[Basic Usage](#b7f58007-a255-4ce1-92e4-a13a21abdec4)

[各ブロックの理解](#97cc6463-2b42-4f5b-ac10-3096125fc41f)

[`desc`](#a68cf41e-0444-4d36-b051-032b95e06688)

[`params`](#d290529d-8fae-4599-8c38-ceb2b949269d)

[Railsでのmounting](#731f0797-11b5-40dd-ab67-d4b480f83869)

[APIのファイルをapp/apiに置く。](#76a7bd9b-3306-4bbd-a89e-d40ef824713a)

## What is Grape?

RubyのためのRESTっぽいAPIフレームワーク。

> Grape is a REST-like API framework for Ruby. It's designed to run on Rack or complement existing web application frameworks such as Rails and Sinatra by providing a simple DSL to easily develop RESTful APIs. It has built-in support for common conventions, including multiple formats, subdomain/prefix restriction, content negotiation, versioning and much more.

## Basic Usage

`Grape::API`のサブクラスとして提供されるRackアプリらしい

TwitterAPIをgrapeで書くと以下のようになるらしい

> Grape APIs are Rack applications that are created by subclassing `Grape::API`. Below is a simple example showing some of the more common features of Grape in the context of recreating parts of the Twitter API.

```Ruby
module Twitter
  class API < Grape::API
    version 'v1', using: :header, vendor: 'twitter'
    format :json
    prefix :api

    helpers do
      def current_user
        @current_user ||= User.authorize!(env)
      end

      def authenticate!
        error!('401 Unauthorized', 401) unless current_user
      end
    end

    resource :statuses do
      desc 'Return a public timeline.'
      get :public_timeline do
        Status.limit(20)
      end

      desc 'Return a personal timeline.'
      get :home_timeline do
        authenticate!
        current_user.statuses.limit(20)
      end

      desc 'Return a status.'
      params do
        requires :id, type: Integer, desc: 'Status ID.'
      end
      route_param :id do
        get do
          Status.find(params[:id])
        end
      end

      desc 'Create a status.'
      params do
        requires :status, type: String, desc: 'Your status.'
      end
      post do
        authenticate!
        Status.create!({
          user: current_user,
          text: params[:status]
        })
      end

      desc 'Update a status.'
      params do
        requires :id, type: String, desc: 'Status ID.'
        requires :status, type: String, desc: 'Your status.'
      end
      put ':id' do
        authenticate!
        current_user.statuses.find(params[:id]).update({
          user: current_user,
          text: params[:status]
        })
      end

      desc 'Delete a status.'
      params do
        requires :id, type: String, desc: 'Status ID.'
      end
      delete ':id' do
        authenticate!
        current_user.statuses.find(params[:id]).destroy
      end
    end
  end
end
```

## 各ブロックの理解

### `desc`

APIメソッドに関する説明を記述するところ

descブロックを作成すると、swaggerのドキュメント作成の際にも使ってくれるらしい。

これは、あくまで説明書きなので、　APIの挙動に対しては影響しない。

### `params`

`entity`から直接、求めるパラメーターを指定する。ブロック

> Define parameters directly from an `Entity`

その下に続くブロックとして methodsを指定する。

```Ruby
e.g.)
      desc 'Create a status.'
      params do
        requires :status, type: String, desc: 'Your status.'
      end
      post do
        authenticate!
        Status.create!({
          user: current_user,
          text: params[:status]
        })
      end
```

# Railsでのmounting

### APIのファイルをapp/apiに置く。

Railsは、module名のサブディレクトリと、class名のファイルを期待します。

上の例で言うと、`app/api/twitter/api.rb`

> Place API files into `app/api`. Rails expects a subdirectory that matches the name of the Ruby module and a file name that matches the name of the class. In our example, the file name location and directory for `Twitter::API` should be `app/api/twitter/api.rb`.

Modify `config/routes`:

```Ruby
mount Twitter::API => '/'
```

なんだか、React Routerみたいではないですか?