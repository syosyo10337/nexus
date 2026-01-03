 

# git configのいじり方

```YAML
# 現在の設定の確認
# --show-originをつけると、どのファイルから読み込んでいるかを確認できる

git config --list --show-origin
```

## 自分のalias集

```YAML
[user]
        name = masanaotakahashi
        email = syosyo.ds@gmail.com

[alias]
        co = "!f() { git checkout \"$@\"; }; f"
        sw = switch
        st = status
        ci = commit
        cm = "commit -m"
        lg = log --oneline --graph --all
        rh = "!f() { git reset --hard \"$1\"; }; f"
        sb = submodule
        br = branch --format='%(HEAD) %(color:yellow)%(refname:short)%(color:reset) - %(contents:subject) %(color:green)(%(committerdate:relative)) [%(authorname)]' --sort=-committerdate
[status]
        submoduleSummary = true
~                                
```

```YAML
推奨
# 基本的な短縮形
git config --global alias.st "status -sb"
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.ci commit
git config --global alias.cm "commit -m"

# unstage(ステージングから戻す)
git config --global alias.unstage "reset HEAD --"

# 最新のコミットを確認
git config --global alias.last "log -1 HEAD --stat"

# ブランチを最終更新日順にソート
git config --global alias.br "branch --format='%(HEAD) %(color:yellow)%(refname:short)%(color:reset) - %(contents:subject) %(color:green)(%(committerdate:relative)) [%(authorname)]' --sort=-committerdate"

# きれいなログ表示
git config --global alias.lg "log --graph --pretty=format:'%C(yellow)%h%Creset -%C(yellow)%d%Creset %s %C(green)(%cr) %C(bold blue)<%an>%Creset' --abbrev-commit"
```

# Configの保存場所

## 1. local 最優先

保存先: `.git/config`

特定のリポジトリのみで有効なもの

`--local`オプションで指定します(デフォルト)。 [Git](https://git-scm.com/book/en/v2/Customizing-Git-Git-Configuration)[Git](https://git-scm.com/book/en/v2/Getting-Started-First-Time-Git-Setup)

## 2. Global 中優先度

保存先: `~/.gitconfig` または `~/.config/git/config`

`--global`オプションで指定します。

## **3. System 最低優先度**

**保存先:** `**/etc/gitconfig**`

`**--system**`

## 追加方法

```YAML
# 基本的な形式
git config --global alias.<エイリアス名> '<コマンド>'

# 例:よく使うコマンドの短縮形
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.ci commit
git config --global alias.st status
```

```YAML
# エディタで開く
git config --global -e
```

```YAML
~/.gitconfigを編集:
ini[alias]
    co = checkout
    br = branch
    ci = commit
    st = status
    # 複雑なコマンドも可能
    unstage = reset HEAD --
    last = log -1 HEAD --stat
```