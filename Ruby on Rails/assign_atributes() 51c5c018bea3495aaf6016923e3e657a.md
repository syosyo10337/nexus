 

# assign_atributes()

cf)

[

update_attibutesとassign_attributes違い - Qiita

update_attibutes updateは複数のattributeをまとめて変更してDBに保存します。 assign_attributes assign_attributesは特定のattributeを変更するための...

![](apple-touch-icon-ec5ba42a24ae923f16825592efdc356f%202.png)https://qiita.com/ryuuuuuuuuuu/items/d0819cc46976cdde8731

![](article-ogp-background-9f5428127621718a910c8b63951390ad%206.png)](https://qiita.com/ryuuuuuuuuuu/items/d0819cc46976cdde8731)

属性のハッシュを渡すことで、属性値を変更することができる。

この時、DBにほぞんされているわけではないらしい。

```Ruby
e.g.)
class Cat
  include ActiveModel::AttributeAssignment
  attr_accessor :name, :status
end
cat = Cat.new
cat.assign_attributes(name: "Gorby", status: "yawning")
cat.name #=> 'Gorby'
cat.status #=> 'yawning'
cat.assign_attributes(status: "sleeping")
cat.name #=> 'Gorby'
cat.status #=> 'sleeping'
```