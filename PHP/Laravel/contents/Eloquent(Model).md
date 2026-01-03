---
tags:
  - php
  - laravel
created: 2026-01-03
status: active
---

# Eloquent(Model)

## Eloquentって？

RailsでいうActiveRecord, つまりモデル操作等を行うために用意されたクラス。

そしてこれらはどちらもデザインパターンでいうところの、Active Recordパターンを採用している。

### Active Recordパターン

Active-Recordパターンは、Enterprise Application Patternsの一種で、一つのデータベースのテーブルと一つのクラスを対応付け、またそのクラスのインスタンスを(クラスに対応する)テーブルの一つのレコードに紐付ける、というパターンです。よくRuby on RailsやLaravelなどのWebフレームワークで用いられます。cf.) [P of EAA: ActiveRecord](https://www.martinfowler.com/eaaCatalog/activeRecord.html)

cf.)  
[https://qiita.com/CostlierRain464/items/5be3c1860bb5137db3d1#active-recordを自前実装する方法](https://qiita.com/CostlierRain464/items/5be3c1860bb5137db3d1#active-record%E3%82%92%E8%87%AA%E5%89%8D%E5%AE%9F%E8%A3%85%E3%81%99%E3%82%8B%E6%96%B9%E6%B3%95)