---
tags:
  - ruby
created: 2026-01-03
status: active
---

# OStruct

デバッグ用のレスポンスを作ったりできる。

```Plain
require 'ostruct'
son = OpenStruct.new({ :name => "Thomas", :age => 3 })
p son.name        # => "Thomas"
p son.age         # => 3
son.age += 1
p son.age         # => 4
son.items = ["candy","toy"]
p son.items       # => ["candy","toy"]
p son             # => #<OpenStruct name="Thomas", age=4, items=["candy", "toy"]>
```

https://github.com/ZERO-TO-ONE-TEAM/zas-cityhall/pull/723/files