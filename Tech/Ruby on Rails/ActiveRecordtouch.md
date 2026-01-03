---
tags:
  - rails
  - activerecord
created: 2026-01-03
status: draft
---

# ActiveRecord#touch

[https://railsdoc.com/page/touch](https://railsdoc.com/page/touch)

モデルの更新時刻をアップデートする。引数を指定しない時には、現在時刻

## // ActiveRecord::NoTouching::ClassMethods

  
e.g.)  
User.no_touching do  
//処理  
end  
などとすることで、recordに対してtouchすることをやめる。