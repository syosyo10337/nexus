 

🦗

# GithubへのSSH keyの追加

[1. 既存の鍵を確認する](#9fa56d6b-38a0-4c83-97b7-57ef0dac1192)

[2. 鍵をGithubに追加する。](#7032ce56-46b8-4ab0-b1e2-fd087b31a5aa)

[3.](#3b715d31-d53c-4dfb-a5df-d99c689367aa) [ssh-agent](../AWS/SSH%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6%2056fe24c6ca954a129cad57591f2afa73.html)に追加

[4. Github上に公開鍵を追加する(GUI)](#d512fe67-8d8d-494b-a28a-1df4a81f9644)

# 1. 既存の鍵を確認する

```Bash
# ターミナルにて
$ ls -al ~/.ssh
```

現状、Githubでサポートされるpublic key(公開key)は

- _id_rsa.pub_

- _id_ecdsa.pub_

- _id_ed25519.pub_

になります。

cf)

[

既存の SSH キーの確認 - GitHub Docs

SSH キーを生成する前に、SSH キーがすでに存在するかどうかを確認できます。

![](Git/imported/Attachments/favicon%201.png)https://docs.github.com/ja/authentication/connecting-to-github-with-ssh/checking-for-existing-ssh-keys

![](Git/imported/Attachments/github-logo.png)](https://docs.github.com/ja/authentication/connecting-to-github-with-ssh/checking-for-existing-ssh-keys)

# 2. 鍵をGithubに追加する。

次の2つのオプションが考えられる。

1. 既存のkeyをアップロードする。  
    自前で用意してある既存の鍵のペアをつかってもよいです。(鍵形式(id_rsa)などには気をつけて)  
    

2. 新規で鍵を作成する。
    
    1. 参考例
        
        [![](Git/imported/Attachments/github-original%201.svg)(draft)Github/ssh周りの話](\(draft\)Github%20ssh%E5%91%A8%E3%82%8A%E3%81%AE%E8%A9%B1%20a7db42592a124f6cbbe67415dc010586.html)
        
    
    2. 推奨([公式doc](https://docs.github.com/ja/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent))
    

```Bash
# YOUR_EMAILの部分をGithubのアカウントのメアドに置き換える
$ ssh-keygen -t ed25519-sk -C "YOUR_EMAIL"
```

# 3. [ssh-agent](../AWS/SSH%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6%2056fe24c6ca954a129cad57591f2afa73.html)に追加

```Bash
$ eval "$(ssh-agent -s)"
```

Githubのドキュメントを見ると上のようにするらしい。

~/.ssh/configもしっかりを修正すること。

cf)

[

新しい SSH キーを生成して ssh-agent に追加する - GitHub Docs

既存の SSH キーをチェックした後、新しい SSH キーを生成して認証に使用し、ssh-agent に追加できます。

![](Git/imported/Attachments/favicon%201.png)https://docs.github.com/ja/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent

![](Git/imported/Attachments/github-logo.png)](https://docs.github.com/ja/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent)

# 4. Github上に公開鍵を追加する(GUI)

cf)

[

GitHub アカウントへの新しい SSH キーの追加 - GitHub Docs

新しい (または既存の) SSH キーを使うように GitHub.com 上のアカウントを構成するには、アカウントにキーを追加する必要もあります。

![](Git/imported/Attachments/favicon%201.png)https://docs.github.com/ja/authentication/connecting-to-github-with-ssh/adding-a-new-ssh-key-to-your-github-account

![](Git/imported/Attachments/github-logo.png)](https://docs.github.com/ja/authentication/connecting-to-github-with-ssh/adding-a-new-ssh-key-to-your-github-account)