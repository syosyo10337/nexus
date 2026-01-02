 

# **graphql-batchライブラリ**

そもそも、Active Recordになぞられた形で、作成した

例えば,以上のようなケースに

```Ruby
class User < ApplicationRecord
  has_many :customers
end

class Customer < ApplicationRecord
  belongs_to :user
  has_many :orders
  has_many :deliverers, through: :orders
end

class Deliverer < ApplicationRecord
  has_many :orders
  has_many :customers, through: :orders
end

class Order < ApplicationRecord
  belongs_to :customer
  belongs_to :deliverer
end
```

[https://showme.redstarplugin.com/d/jUCfZU1Z](https://showme.redstarplugin.com/d/jUCfZU1Z)