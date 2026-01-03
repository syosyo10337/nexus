---
tags:
  - ruby
  - collection
  - oop
created: 2026-01-03
status: active
---

🧵

# eql?の再定義

このメソッドはObject#eql?なのだけども、クラスの性質に合わせて再定義させるべき

代表的な再定義としては、あるクラスの2つのオブジェクトがハッシュのキーとして同値かどうかの判定.

この時、eql?とhashメソッドも再定義して、`a.eql?(b)`が真ならば、`a.hash == b.hash`も真」が成り立つ必要がある。

### ex)同一の国コードをもつインスタンスならば同値のキーとする。

```Ruby
class CountryCode
  attr_reader :code
  
  def initialize(code)
    @code = code
  end

  #CountryCodeというクラスの世界では、国コードが同一のものを同値とみなすようにeql?を再定義
  def eql?(other)
    #otherはCountryCodeかつ、同じ国コードなら同じキーとみなす
    other.instance_of?(CountryCode) && code.eql?(other.code)
  end
  def hash
    #CountryCodeオブジェクトのハッシュ値として国コードのハッシュ値を返す。
    code.hash
  end
end

japan = CountryCode.new("JP")

currencies = { japan => 'yen', us => 'dollar', india => 'rupee'}

key = CountryCode.new("JP")

currencies[key] 
#=> 'yen'
```

### つまり、内部的にはeql?の定義に基づいて、ハッシュのキーを判別していると言える。