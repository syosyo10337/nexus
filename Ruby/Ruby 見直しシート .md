---
tags:
  - ruby
created: 2022-12-20
status: active
---

require "./menu"

menu1 = Menu.new(name: "ピザ", price: 800)
menu2 = Menu.new(name: "すし", price: 1000)
menu3 = Menu.new(name: "コーラ", price: 300)
menu4 = Menu.new(name: "お茶", price: 200)

menus = [menu1, menu2, menu3, menu4]

index = 0
menus.each do |menu|
  puts "#{index}. #{menu.info}"
  index += 1
end

puts "--------------"
puts "メニューの番号を選択してください"

# 入力を数値として受け取って変数orderに代入してください
order = gets.chomp.to_i
# 選択されたメニューのインスタンスを変数selected_menuに代入してください
selected_menu = menus[order]
#ここで、変数を定義し直すことで、selected_menu.name も.priceもクラス（別ファイルで定義）内のメソッドも呼び出すことができる。
puts "選択されたメニュー: #{selected_menu.name} "
puts "個数を入力してください(3つ以上で100円割引)"


count = gets.chomp.to_i
puts "お会計は#{selected_menu.get_total_price(count)}円です"



