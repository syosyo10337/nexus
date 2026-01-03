 

# findコマンド

# ファイルの場所を

ファイル名はわかるが、どこかわからないとき

```Plain
find ~/ -name Foo.txt
```

```Bash
find docs -name "*.md" | while read file; do
  output_file="dist/${file#docs/}"
  output_file="${output_file%.md}.html"
  mkdir -p "$(dirname "$output_file")"
  pandoc "$file" -s -o "$output_file" --metadata title="Cloud Storage Source"
done
```

  
1. while read file で**1行ずつ読み込んで、file 変数に格納**