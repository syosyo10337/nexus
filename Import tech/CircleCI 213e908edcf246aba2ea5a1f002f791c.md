 

![](Import%20tech/Attachments/circleci-plain.svg)

# CircleCI

---

[概要](#eab979a2-b376-4888-a80b-8b9cc23f5328)

[Structure](#ea7dcdd2-0341-4c9f-ad2e-b53a8bf3b57c)

[設定](#4139378b-5079-456d-9fe5-5c515a6c147e)

[Jobsについて](#cc93d252-2862-4561-bbb9-efda5a7c05a4)

[ワーキングディレクトリについて](#9a0b333c-27c0-409c-8cdd-2da2aa954685)

[難しいstepsの種類](#62895ac8-26c3-432d-a77f-e6847bbd6522)

[Circle CI](#2d5d5db6-cefa-4035-a7e3-072ef40dd59c)

[失敗したジョブをCircleCIのコンテナに入ってデバッグする。](#9f95877b-8f1f-4b92-8b91-52cb9394729a)

[ここでの前提](#ccce0583-4756-42c3-83b2-db536585a233)

[step2 確認した秘密鍵を指定して実際にコンテナに入る](#cfa97207-3030-47ba-9638-c701d2354da6)

[CLIでのデバッグ](#390d9f73-2f9f-4be1-906e-bf6502138301)

# 概要

Saas型のCI/CDサービスで、CircleCI上でのdockerコンテナを起動して実行環境にすることができます。

- CI (Continuous Integration)

開発者がコードを共有リポジトリの `main`ブランチに素早く頻繁に統合するための手法です。 各機能を個別にビルドして開発サイクルの最後に統合するのではなく、それぞれの開発者のコードが 1 日に何度も共有リポジトリに統合されます。

つまり、細かく変更を加えるたびに、自動でテストやコードチェックをおこない、ビルドが成功する状態を確認して、mainブランチへと次々と統合していく手法のことです。

## Structure

細かい設定は忘れましたが、、、

自分のGithubリポジトリとCircleCIを関連続けて、deploy用のキー設定や、設定ファイルをリモートのリポジトリに置くことで、push(remoteへのcommit)をトリガーとして、circleCIを起動できます。

`.circleci/`ディレクトリと、

circleCI用の設定ファイル`.circleci/config.yml`

設定していく。

(ちなみに、.circleci/自体は、gitHub上にcommitされているので、circleCIの実行環境で使いたいファイルなどをこのディレクトリ下に置くことは事実上可能です。~/.ssh/configとか)

## 設定

```YAML
version: 2.1
jobs:
	test: #jobsの名前
		docker: # jobの実行マシンを定義
			- image: circleci/ruby:    #ビルドしたいイメージを指定
		# 指定したマシン（この場合docker）にどうゆう命令を実行したいのか?
		steps: 
			- checkout # リポジトリからソースを引っ張ってきて
			- run:
					name: echo
					command: echo "Hello masanao"
workflows:
	test_workflow: # ワークフロー名
			jobs:
				- test # 前述で定義されたjobであるtestを実行する。
		
```

テンプレート

```YAML
version: 2.1
	# 実行したい単位を設定する。dockerイメージからのビルドからはじまり,
	# 各種ステップ等
	jobs:
		<job_name>:
			docker:
			steps:
				- checkout
				- run:

workflows: # jobsの実行タイミングについて設定する。
	<work_flow_name>:
		jobs:
```

## Jobsについて

```YAML
e.g.)
jobs:
	<>:
		docker:
			- image: circleci/ruby:2.6.5
				environment:
					BUNDLE_PATH: vendor/bundle
```

- `envrionment:`

環境変数を設定できる。

- `steps` どんなコマンドを実行していきたいかを配列?で設定する。
    
    - `run`
        
        - `name:`コマンド名を命名できる
        
        - `command:`____________________________実行したいコマンドを記述する____________________________
        
    
    - checkout
        
        ソースコードをチェックアウトしてくる(buildしたCI環境に持ってくる)
        
    
    - save_cache
        
        - key:
        
        - paths
        
    
    - restore_cache
        
        - key :
        
        - paths:
        
    
    - deploy  
        廃止予定のステップ。runコマンドによって置換してください。適並行処理が2つ以上の時は多少設定を編集する必要がありそうです。
        
        cf)  
        
    
    [
    
    CircleCI の設定 - CircleCI
    
    このドキュメントは、.circleci/config.yml ファイルで使用される CircleCI 2.x 設定キーのリファレンスガイドです。 config.yml の全体は「 サンプル設定ファイル全文 」で確認できます。 version ○ 文字列 2、 2.0、または 2.1。.circleci/config.yml ファイルの簡素化、再利用、パラメータ化ジョブの利用に役立つバージョン 2.1 の新しいキーの概要については、 設定ファイルの再利用に関するドキュメント を参照してください。 version フィールドは、将来的にサポートの終了や 破壊的変更があった場合に警告するかどうかの判断に用いられます。 setup フィールドを指定すると、プライマリ .circleci 親ディレクトリ外部にある設定ファイルのトリガー、パイプライン パラメーターの更新、およびカスタマイズされた設定ファイルの生成を、条件に従って実行できます。 以下の例は、承認済みの circleci 名前空間に置かれた node Orb を使用します。 使用例や詳細な情報については、 Orb Registry の Node orb のページを参照して下さい。 および に関するドキュメントもご覧ください。 パブリック Orb のリストは、をご覧ください。 commands では、ジョブ内で実行する一連のステップをマップとして定義します。これにより、複数のジョブで 1 つのコマンド定義を再利用できます。
    
    ![](https://circleci.com/docs/assets/meta/favicon.png)https://circleci.com/docs/ja/configuration-reference/#deploy-deprecated
    
    ![](https://circleci.com/docs/assets/meta/open-graph-cci-docs.jpg)](https://circleci.com/docs/ja/configuration-reference/#deploy-deprecated)
    

### ワーキングディレクトリについて

cf)

[

【CircleCI】working_directoryの挙動を実験して確かめてみた｜Webエンジニア研究室

CircleCIの設定ファイルである.circleci/config.yml について勉強し始めたとき、以下のことが気になりました。 working_directoryって何をしてるんだ？？ 何となく、「作業場所」ということは分かります。 しかし、コンテナに展開するためのローカルのディレクトリを指定するのか、それともコンテナ内に置きたいディレクトリを指定するのかが分かりません。 公式ドキュメントにも一応説明はあり、 「stepsを実行する際のディレクトリを指定」 と書かれてありますが、こちらもいまいちハッキリしません。 そこで今回は、実際にCircleCIを動かして、 working_directoryが何を指しているのかを確かめてみました。 今回はその実験結果をシェアします。少しでも同じ疑問を持っている方の参考になれば幸いです。 まずは CircleCIを使うための準備 を行います。 あくまで実験のための環境なので、複雑なアプリケーションを用意する必要はありません。 今回はGitHub上にシンプルなプロジェクト（circleci_test）を作成し、 コードに変更が加わる毎にCircleCIが動くよう設定 しました。 次に、ディレクトリ内に適当なファイルREADME.md、circle.htmlおよび.circleci/config.yml を配置します。（隠しファイルのため、.circleciは表示されていません） そしてconfig.yml内に、CircleCI上にコンテナを生成するためのimageやコンテナ内で行う動作を記述していきます。 要は、CircleCIが実行する動作手順を全て記述するイメージです。 今回はこんな感じのコードをconfig.ymlに書いてみました。このコードをベース（初期状態）にして実験をしていきます。 version: 2.0 jobs: build: docker: - image: alpine:3.7 working_directory: ~/experiment steps: - checkout - run: name: 実験 command: | pwd ls working_directoryの検証に入る前に、 簡単にコードの意味を説明 しておきます。 versionは CircleCIのバージョン です。1か2か2.1を指定可能ですが、今回は2を指定しています。

![](Import%20tech/Attachments/cropped-hide-192x192.jpg)https://www.engilaboo.com/circleci-working-directory/

![](Import%20tech/Attachments/5f952368acddf99753c39236f977a5c2-1.jpg)](https://www.engilaboo.com/circleci-working-directory/)

## 難しいstepsの種類

- `store_artifacts`  
    ファイルをcircle ci上に保存できる。

- `store_test_results`  
    テスト実行結果を、circleCI のwebUI上で見られるようになる。(ローカルでのエラーメッセージをcircleci上で見れるってことらしい)

- `persist_to_workspace:`

- `attach_workspace`
    
    job間でファイルを共有できるらしい。
    

- `add_ssh_keys`  
    sshキーをjobに設定できる。

```YAML
deploy:
      docker:
        - image: cimg/ruby:3.0.4-browsers
      steps:
      - checkout
      - ruby/install-deps
      - add_ssh_keys:
          fingerprints:
            - "a1:a6:dc:87:b3:12:12:82:23:00:33:09:0d:ba:c8:2b"

# fingerprintsの部分には、circleCIのwebアプリから登録したprivatekeyのfignerprint
# を記述することで、実際の実行環境上にssh_keyが配置される。
# 参照の方法は、~/.ssh/id_rsa_<fingerprint without ":">
```

[https://qiita.com/tmasuyama/items/5f1c224d5bc5fe2bf8d9#circleci-の準備](https://qiita.com/tmasuyama/items/5f1c224d5bc5fe2bf8d9#circleci-%E3%81%AE%E6%BA%96%E5%82%99)

[https://circleci.com/docs/ja/browser-testing/#selenium](https://circleci.com/docs/ja/browser-testing/#selenium)

redisの導入について

redisの導入

[https://qiita.com/hirotakasasaki/items/9819a4e6e1f33f99213c](https://qiita.com/hirotakasasaki/items/9819a4e6e1f33f99213c)

dcoekr-compose.ymlのセッティング

[https://qiita.com/WisteriaWave/items/1f799fa20f491b37989e](https://qiita.com/WisteriaWave/items/1f799fa20f491b37989e)

# Circle CI

[https://circleci.com/developer/ja/orbs/orb/circleci/ruby](https://circleci.com/developer/ja/orbs/orb/circleci/ruby)

[https://github.com/CircleCI-Public/circleci-demo-ruby-rails/blob/master/.circleci/config.yml](https://github.com/CircleCI-Public/circleci-demo-ruby-rails/blob/master/.circleci/config.yml)

[https://madogiwa0124.hatenablog.com/entry/2021/12/11/165227](https://madogiwa0124.hatenablog.com/entry/2021/12/11/165227)

[https://zenn.dev/wtkn25/articles/circleci-local-setting](https://zenn.dev/wtkn25/articles/circleci-local-setting)

CLIで設定ファイルを整える

[https://qiita.com/RiSE_blackbird/items/6f8abe4647ddef345013](https://qiita.com/RiSE_blackbird/items/6f8abe4647ddef345013)

cache-keyががorbs: nodeで更新されている

config.ymlについて

dbの設定どうするの？

version 2.1だと　個別の設定が必要になるらしい。

[https://circleci.com/docs/ja/how-to-use-the-circleci-local-cli/](https://circleci.com/docs/ja/how-to-use-the-circleci-local-cli/)

[https://madogiwa0124.hatenablog.com/entry/2021/12/11/165227#開発環境をcirclecirubyからcimgrubyに乗り換える](https://madogiwa0124.hatenablog.com/entry/2021/12/11/165227#%E9%96%8B%E7%99%BA%E7%92%B0%E5%A2%83%E3%82%92circleciruby%E3%81%8B%E3%82%89cimgruby%E3%81%AB%E4%B9%97%E3%82%8A%E6%8F%9B%E3%81%88%E3%82%8B)

[https://circleci.com/developer/ja/images/image/cimg/ruby#ブラウザー](https://circleci.com/developer/ja/images/image/cimg/ruby#%E3%83%96%E3%83%A9%E3%82%A6%E3%82%B6%E3%83%BC)

circleCIのイメージは、新しいのはcimg/rubyになっています。

11/19 testの通し方

ssh disconnect: Broken pipe

sshの設定変える必要がありそう。

[https://circleci.com/developer/ja/orbs/orb/circleci/ruby#commands-rspec-test](https://circleci.com/developer/ja/orbs/orb/circleci/ruby#commands-rspec-test)

[https://circleci.com/docs/ja/browser-testing/](https://circleci.com/docs/ja/browser-testing/)

[https://circleci.com/developer/ja/orbs/orb/circleci/browser-tools#quick-start](https://circleci.com/developer/ja/orbs/orb/circleci/browser-tools#quick-start)

ブラウザーテストorbsについてのドキュメント

orbを使うとpackageのインストールやら、bundle installやら、テストコマンドまで、かなり自動貸してくれる。

新しいバージョンでは、cache-keyはもう不要である。

不具合

CircleCIにおいて　

- Rspecが通らない
    
    - chromeを繋げられていない。設定をうまいことやる必要がありそう。
    

- いずれもdocker開発環境において、どこまでいけているのか？という点について考える必要はありそう。→ドライバーの登録と、ホストの指定が必要

ブラウザテストを実行するには

[https://circleci.com/developer/ja/images/image/cimg/ruby#ブラウザー](https://circleci.com/developer/ja/images/image/cimg/ruby#%E3%83%96%E3%83%A9%E3%82%A6%E3%82%B6%E3%83%BC)

[https://qiita.com/gold-kou/items/4c7e62434af455e977c2](https://qiita.com/gold-kou/items/4c7e62434af455e977c2)

docker circleCI環境でのjsテストの設定について

- docker環境では、Chromeブラウザが動くコンテナをまず用意して、その上で、seleniumのwebdriverを新たに登録した。

- 調べたいこと。CircleCIでテスト実行環境を簡潔におさめてくれるならば、開発環境では今まで通り別コンテナを用意して、仮想ホスト上のwebサーバーコンテナから、ブラウザコンテナにつなぐようにすれば良い。

また、CircleCIを回す際には、CircleCi環境内にブラウザとウェブドライバーをインストールできるので、お手元のPCで開発していた時のようにcapybaraを設定するだけで良い。

# 失敗したジョブをCircleCIのコンテナに入ってデバッグする。

---

circleCIのwebアプリ上で、jobの失敗などした際に、circleCI環境にsshで接続することができます。  
今回はdockerのイメージをもとにビルドを行ったので、実際にはcircleCIが用意したdockerコンテナに入っていることになるという認識になると思います。

cf)

[

SSH を使用したデバッグ - CircleCI

多くの場合、問題を解決するには、ジョブへの SSH 接続を行い、ログ ファイル、実行中のプロセス、ディレクトリ パスなどを調べるのが一番の方法です。 CircleCI では、すべてのジョブに SSH でアクセスできます。 SSH を使用した CI/CD パイプラインのデバッグについては、CircleCI のをご参照ください。 SSH を使用してログインする場合、ユーザーは対話型のログインシェルを実行しています。 最初にコマンドが失敗したディレクトリまたは 1 階層上のディレクトリ (例: ~/project/ または ~/) で、そのコマンドを実行してみてください。 どちらの場合も、クリーンな実行は開始されません。 pwd または ls を実行すると、正しいディレクトリにいることを確認できます。 デフォルトの CirclecI パイプラインは、非対話型のシェルでステップを実行することにご注意ください。 対話型ログインを使用したステップの実行は成功する可能性がありますが、非対話型モードでは失敗する可能性があります。 SSH キーを アカウントまたは アカウントに追加していることを確認します。 SSH 接続を有効にしてジョブを起動するには、[Rerun Workflow (ワークフローを再実行する)] ドロップダウン メニューから [Rerun job with SSH (SSH でジョブを再実行する)] オプションを選択します。 注: Rerun job with SSH 機能はデバッグのための機能です。 これらのジョブは元のジョブと同じパイプライン内に作成されます。 接続の詳細情報を確認するには、ジョブ出力の [Enable SSH (SSH を有効にする)] セクションを展開します。 詳細情報は、ジョブ出力の末尾にある [Wait for SSH (SSH を待機する)] セクションにも再度表示されます。 GitHub または Bitbucket で使用している SSH キーと同じキーを使用して、実行中のジョブに SSH 接続し、必要なトラブルシューティングを行います。 Windows Executor を使用している場合は、SSH 接続を行うシェルを渡す必要があります。 For example, To run powershell in your build you would run: ssh -p -- powershell.exe.

![](https://circleci.com/docs/assets/meta/favicon.png)https://circleci.com/docs/ja/ssh-access-jobs/#debugging-permission-denied-publickey

![](https://circleci.com/docs/assets/meta/open-graph-cci-docs.jpg)](https://circleci.com/docs/ja/ssh-access-jobs/#debugging-permission-denied-publickey)

[

CircleCI の SSHデバッグ の際に Permission denied (publickey) エラーが出る場合は鍵ファイルを指定する - 約束の地

状況 SSHデバッグの際に、以下のように接続を促されたとします。 You can now SSH into this box if your SSH public key is added: $ ssh -p 55555 10.10.10.10 Use the same SSH public key that you use for your VCS-provider (e.g., GitHub). RSA key fingerprint of the host is SHA256:FOOBAR MD5:HOGE This box will stay up for 2h0m0s, or unt...

![](https://obel.hatenablog.jp/icon/favicon)https://obel.hatenablog.jp/entry/20210309/1615235400

![](Import%20tech/Attachments/1568741889764668.png)](https://obel.hatenablog.jp/entry/20210309/1615235400)

webアプリの**Rerun**の項目にて、**Rerun Job with SSH**を選択すると、デバッグのためにコンテナが起動します。

**Enable SSH**のstepsを開くと、コンテナのIPが表示されるので、接続する準備が整います

```Bash
# デバッグをしていく端末を用意して(local)
$ ssh -p 64540 3.88.34.152
```

しかし、このままだと、アクセス認証のためのkeyを設定してないエラーが発生する可能性があります。  
（検証:cicrleCI上にpublickeyがあるといける？？？）

### ここでの前提

circleCIで用意されたコンテナに入るためには、入ろうとしている端末上で、githubとのssh鍵認証が成立している必要があります。

==このgithub上に登録された公開鍵をcircleCIにも提供することでコンテナにログインする？==

~/.ssh/configに設定するか、

```Bash
# ~/.ssh/config

Host github
  Hostname github.com
  User git
  IdentityFile ~/.ssh/<秘密鍵名>
```

接続の際に`-i`オプションをつかってgithubとの認証が済んでいるか確認します。

以下のコマンドで、アクセスの認証がされていることを確認します。

```Bash
$ ssh -i <鍵> git@github.com
# -v オプションでtrace？も見れる(使用した鍵もわかる)
```

## step2 確認した秘密鍵を指定して実際にコンテナに入る

githubに登録した鍵を指定して

```Bash

$ ssh -p <ポート> <circle上に表示されたIP> -i <githubに認証されている秘密鍵>

e.g.)
$ ssh -p 64540 3.88.34.152 -i ~/.ssh/github
```

これでアクセスできるはず、

circleCIの設定を通して、-iの部分を事前に登録できそう。

# CLIでのデバッグ

---

[

まさかPushデバッグしてないよね？ よく使うCircleCIのデバッグ方法 - VTRyo Blog

Pushデバッグってなんぞ？ 〜1年前〜　CircleCIド素人ぼく 「CircleCI configに記述したコードがうまく動かないな......でもGithubにPushして、CircleCIが動いてるところ見ないとわからん......」 などど言い出し、何度もPushしまくってcommitを荒らしたのは私です。 そんな一か八か、動くかわからないコードをPushしまくるのはやめていきたいものです。 インストール方法はそこまで大変でないので、公式に書いてあることをそのまま書きます。 curl -fLSs https://circle.ci/cli | bash brew install circleci CircleCIはローカルで検証することができます。 % circleci config validate .circleci/config.yml Config file at config.yml is valid.

![](https://blog.vtryo.me/icon/favicon)https://blog.vtryo.me/entry/circleci-debug-method#CircleCI-CLI%E3%82%92%E3%82%A4%E3%83%B3%E3%82%B9%E3%83%88%E3%83%BC%E3%83%AB

![](Import%20tech/Attachments/20190521215603.png)](https://blog.vtryo.me/entry/circleci-debug-method#CircleCI-CLI%E3%82%92%E3%82%A4%E3%83%B3%E3%82%B9%E3%83%88%E3%83%BC%E3%83%AB)

関連記事)

[CircleCIを使って、デプロイをトリガーする](Capistrano/CircleCI%E3%82%92%E4%BD%BF%E3%81%A3%E3%81%A6%E3%80%81%E3%83%87%E3%83%97%E3%83%AD%E3%82%A4%E3%82%92%E3%83%88%E3%83%AA%E3%82%AC%E3%83%BC%E3%81%99%E3%82%8B%20eb73ed3a192c42399289557503f80c20.html)