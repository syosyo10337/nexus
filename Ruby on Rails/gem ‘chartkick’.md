 

# gem ‘chartkick’

---

現状railsアプリでグラフを描画したい時は、使える選択肢

[

Chartkick - Create beautiful JavaScript charts with one line of Ruby

Create beautiful JavaScript charts with one line of Ruby Loading... Add this line to your application's Gemfile: gem "chartkick" Then follow the instructions for your framework: This sets up Chartkick with Chart.js. For other charting libraries and frameworks, see detailed instructions.

https://chartkick.com/



](https://chartkick.com/)

[

groupdate | RubyGems.org | your community gem host

RubyGems.org is made possible through a partnership with the greater Ruby community. Fastly provides bandwidth and CDN support, Ruby Central covers infrastructure costs, and Ruby Together funds ongoing development and ops work. Learn more about our sponsors and how they work together.

![](favicon%2025.ico)https://rubygems.org/gems/groupdate/versions/2.5.2

![](a2f2287b6054926438eb65f8726cc77d.jpeg)](https://rubygems.org/gems/groupdate/versions/2.5.2)

SQLiteでも、動きそうだけど、本番もpostgresqlならそっちに合わせて、rails new <アプリ名>　-d postgresql指定しても良い。

また、ログの取得を、default-scopeつけていると、groupdateライブラリと干渉するので、、、、

```Ruby
@data = [
      {
        name: "Fantasy & Sci Fi", 
        data: [["2010", 10], ["2020", 16], ["2030", 28]]
      },
      {
        name: "Romance", 
        data: [["2010", 24], ["2020", 22], ["2030", 19]]
      },
      {
        name: "Mystery/Crime", 
        data: [["2010", 20], ["2020", 23], ["2030", 29]]
      }
    ]
```

```Ruby
<%= column_chart @data, stacked:true%>
```