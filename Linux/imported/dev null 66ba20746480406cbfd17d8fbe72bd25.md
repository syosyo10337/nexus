 

# /dev/null

  
LinuxなどのUNIX系OSの特殊なデバイスファイルの一種で、投入された入力を単に捨て去る機能を提供する

用途としては

- 何らかの出力先の指定が必要だが何の処理もしたくない場合や、

- 標準では画面に表示されるメッセージなどを抑止したい場合、

- 空の入力元が必要な場合などに利用される。

### e.g.)リダイレクト(>)と併用して、標準出力を捨てることができる。

```Bash
if docker ps -q -f Name=zto-services-interchange | grep -e ".*" > /dev/null; then
  docker-compose -f `dirname ${0}`/../docker-compose.with-zto-services.yml up;
else
  docker-compose up;
fi
```

cf)

[

/dev/nullとは - IT用語辞典

/dev/null【nullデバイス】とは、LinuxなどのUNIX系OSの特殊なデバイスファイルの一種で、投入された入力を単に捨て去る機能を提供するもの。英語圏では俗に “black hole” (ブラックホール)、“bit bucket” (ビットバケツ)などと呼ばれることもある。

![](https://p.e-words.jp/favicon.png)https://e-words.jp/w/-dev-null.html

![](Linux/imported/Attachments/ogimage.png)](https://e-words.jp/w/-dev-null.html)