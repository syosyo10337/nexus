 

# jsconfig.json

例えば、ベースとなるurlを指定して、

@で、`resources/js/`配下を省略して指定することができる。

これは、ただ相対パスを省略するのではなく、どの階層のファイルからでも、特定のパスを書くことができる。

設定の一例

```JavaScript
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": [
        "resources/js/*"
      ]
    },
    "jsx": "preserve",
  },
  "exclude": [
    "node_modules",
    "public"
  ]
}
```