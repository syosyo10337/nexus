 

# Dockerイメージの種類(silm/apline)

# slim

フルベースイメージの下位互換。

aptでパッケージをマネジメントし、glibcが使える。

# apline

Apline Linuxをベースに構築されている。コンテナで利用することが前提になっており、極めて軽量。

apkでパッケージマネジメントし、最小限のコマンドしかインストールされていない。slimよりも軽量。

glibc → muslが入っている。

[

Dockerイメージ alpine,slim,stretch,buster,jessie等の違いと使い分け

利用するDocker imageを選ぶ際、同じバージョンであっても、後ろに-stretchやら、-busterやらがついていて迷うことがあります。 これはimageがベースとしているOSの種類によるものです。

![](https://www.ted027.com/favicon.ico)https://www.ted027.com/post/docker-debian-difference/



](https://www.ted027.com/post/docker-debian-difference/)