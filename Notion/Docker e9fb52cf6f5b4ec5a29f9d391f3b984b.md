 

![](Notion/Attachments/docker-original.svg)

# Docker

---

## Docker学習

[⛴️Docker学習メモ](Docker/Docker%E5%AD%A6%E7%BF%92%E3%83%A1%E3%83%A2%20d8e6a9c1101f443691204def8b354678.html)

[😶‍🌫️イメージ](Docker/%E3%82%A4%E3%83%A1%E3%83%BC%E3%82%B8%206ebc02bf76b348d1aca70b744db7064c.html)

[🪣コンテナ](Docker/%E3%82%B3%E3%83%B3%E3%83%86%E3%83%8A%20ed3374b6c64f44dab773142171c200aa.html)

[🐭Dockerコマンドチートシート](Docker/Docker%E3%82%B3%E3%83%9E%E3%83%B3%E3%83%89%E3%83%81%E3%83%BC%E3%83%88%E3%82%B7%E3%83%BC%E3%83%88%20f5e6db7a763e4004b02b45ab27c31fe9.html)

[🚤Dockerfile](Docker/Dockerfile%201fa03e40c5b14260893c679556ba7cb7.html)

[🕸️network](Docker/network%20b5a901f183c74e92933846d6b016787c.html)

[🌋volume](Docker/volume%20e2f72c158b0c490c8b19911058551ddd.html)

[オーケストレーションツール](Docker/%E3%82%AA%E3%83%BC%E3%82%B1%E3%82%B9%E3%83%88%E3%83%AC%E3%83%BC%E3%82%B7%E3%83%A7%E3%83%B3%E3%83%84%E3%83%BC%E3%83%AB%2052520f8cbec94910ae79df6929126109.html)

[コンテナ構築とデプロイ](Docker/%E3%82%B3%E3%83%B3%E3%83%86%E3%83%8A%E6%A7%8B%E7%AF%89%E3%81%A8%E3%83%87%E3%83%97%E3%83%AD%E3%82%A4%20a8b7d271ecc54bba91f957f57ad955a5.html)

[M1 (arm)チップへの対応](Docker/M1%20\(arm\)%E3%83%81%E3%83%83%E3%83%97%E3%81%B8%E3%81%AE%E5%AF%BE%E5%BF%9C%202fced2be0a404700a028054521b47cf3.html)

[(tips)コンテナ上でデバッグする](Docker/\(tips\)%E3%82%B3%E3%83%B3%E3%83%86%E3%83%8A%E4%B8%8A%E3%81%A7%E3%83%87%E3%83%90%E3%83%83%E3%82%B0%E3%81%99%E3%82%8B%204a832afaaae84296b91184bf57ce84f4.html)

## Rails開発環境構築

---

[docker-composeの書き方](Docker/docker-compose%E3%81%AE%E6%9B%B8%E3%81%8D%E6%96%B9%2011e9e870c3b5495baa5c6168454eb90b.html)

[docker-compose.yaml](Docker/docker-compose%20yaml%20a4b91b4bba1e47858a2948b997efdcf9.html)

[Evil martians流の環境構築のメモ](Docker/Evil%20martians%E6%B5%81%E3%81%AE%E7%92%B0%E5%A2%83%E6%A7%8B%E7%AF%89%E3%81%AE%E3%83%A1%E3%83%A2%202f3d5d5e202040dfabd2dda715093f87.html)

[

クジラに乗ったRuby: Evil Martians流Docker+Ruby/Rails開発環境構築（更新翻訳）｜TechRacho by BPS株式会社

本記事では、著者がRuby on Railsプロジェクトの開発に用いているDockerの設定を紹介いたします。この設定はEvil Martiansのproduction development環境で生まれ、さらに進化を遂げたものです。本記事の内容の利用や共有はご自由にどうぞ。存分に楽しみましょう！ さて、どこからお話を始めましょうか。ここに到達するまでに長い長い旅路をたどりました。かつて私は開発にVagrantを使っていましたが、当時のVMは私の4GB RAMのノートPCでは少々重すぎました。そして2017年にコンテナへの乗り換えを決意したときに、やっとDockerを使い始めました。 しかしDockerで問題がたちまち解決したという気持ちではありません。自分自身やチーム、そしてすべての人々にとって完璧な設定を追求し続けてきましたが、「これでよし」と言える究極の設定はありません。標準的なアプローチを見出すまでにかなりの時間を要しました（2019年に本記事を最初に公開した時点でも相当の時間を費やしていました）。 本記事を最初に公開して私の秘密を隅々までオープンにして以来、多くのRailsチームや開発者が私の手法を採用し、さらに改良や貢献にもご協力をいただきました。 前置きはこのぐらいにして、いよいよ設定そのものをご覧に入れたいと思います。設定のほぼすべての行に解説を付けています（「Dockerをわかっている」前提のわかりにくいチュートリアルにしたくなかったので）。 本記事のソースコードは、GitHubのevilmartians/ruby-on-whalesでご覧いただけます。 その前に、この設定例では以下のような最新バージョンのソフトウェアを使っている点にご留意ください。 本記事の大半はコメント付きコードと設定例で構成されており、以下のようになっています。 🔗 Dockerfile Dockerfileは、Rubyアプリケーションの 環境を定義します。この環境でサーバーを実行したり、 rails cでコンソールを実行したり、テストやrakeタスクを走らせたり、その他にも 開発者として あらゆる形でのコードとのやりとりを行います。 ARG RUBY_VERSION ARG DISTRO_NAME=bullseye FROM ruby:$RUBY_VERSION-slim-$DISTRO_NAME ARG DISTRO_NAME # 共通の依存関係 RUN apt-get update -qq\ && DEBIAN_FRONTEND=noninteractive apt-get install -yq --no-install-recommends\ build-essential\ gnupg2\ curl\ less\ git\ && apt-get clean\ &&

![](https://techracho.bpsinc.jp/wp-content/themes/techracho/assets/images/favicon.ico?_=28l85c)https://techracho.bpsinc.jp/hachi8833/2022_04_07/116843

![](Notion/Attachments/dockerizing_ruby_rails_development_eyecatch3-min.png)](https://techracho.bpsinc.jp/hachi8833/2022_04_07/116843)

[🙄Dockerでローカル開発環境を構築する。Rails/postgres](Docker/Docker%E3%81%A7%E3%83%AD%E3%83%BC%E3%82%AB%E3%83%AB%E9%96%8B%E7%99%BA%E7%92%B0%E5%A2%83%E3%82%92%E6%A7%8B%E7%AF%89%E3%81%99%E3%82%8B%E3%80%82Rails%20postgres%208daf2924bb5d4147abf448313c865fd5.html)

---

### step2. nginx/puma用のコンテナも用意して、本番環境を再現できるようにする。

本番環境を再現するために、外部からリクエストを受けるnginxを、pumaでつないでappにつながるようにする。

dbもコンテナは別で用意します。ディレクトリに構成については、、

### step3. 本番環境もコンテナ基盤で構築する。

[🐋コンテナでの秘密鍵情報の取り扱い](Docker/%E3%82%B3%E3%83%B3%E3%83%86%E3%83%8A%E3%81%A7%E3%81%AE%E7%A7%98%E5%AF%86%E9%8D%B5%E6%83%85%E5%A0%B1%E3%81%AE%E5%8F%96%E3%82%8A%E6%89%B1%E3%81%84%204e641dcb345a4f3e918987639a3acb81.html)

USER追加した方が良いかも。

→ /root/.ssh/ここに鍵とか置いちゃっているわ

本来はhome/ユーザ名/.ssh/ です。

### docker-composeの文脈における環境変数の設定

設定の方法はDockerFileとか色々あると思うんだけども、更新された値が反映されるのは、イメージがこうしんされた時

`docker compose build --no-cache`

もしくは、

`docker compose up`

コンテナが立ち上がったとき。

場合によっては、docker compose upではなく特定のタイミングで起動するもの(npmコンテナ)が存在する場合には、イメージの再ビルドが必要になりそうな気がする。