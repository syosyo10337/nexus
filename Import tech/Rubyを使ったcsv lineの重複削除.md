 

# Rubyを使ったcsv lineの重複削除

Pythonのsetデータ構造にcsvの各行を追加することで、重複が排除する。(何かをエスケープするために\"がつくことがあるので、目視する。)

```Plain
import csv

# 入力ファイル名と出力ファイル名
input_file = "input.csv"
output_file = "output.csv"

# 重複を排除するためにセットを使用
unique_rows = set()

with open(input_file, 'r', newline='', encoding='utf-8') as csvfile:
    csv_reader = csv.reader(csvfile)
    for row in csv_reader:
        # 各行をタプルに変換し、セットに追加
        unique_rows.add(tuple(row))

# 重複のないデータを新しいCSVファイルに書き込む
with open(output_file, 'w', newline='', encoding='utf-8') as csvfile:
    csv_writer = csv.writer(csvfile)
    for row in unique_rows:
        csv_writer.writerow(row)
```

Ruby　version(draft)

🚨

“のエスケープに対応していないので、エラーになる。

```Ruby
require 'csv'

# 対象ads.txtのパスを指定
target_ads_txt = 'ads.txt'

csv_data = CSV.read(target_ads_txt)

sorted_unique_data = csv_data.sort_by { |row| row }.uniq

CSV.open(target_ads_txt, 'wb') do |csv|
  sorted_unique_data.each do |row|
    csv << row
  end
end
```