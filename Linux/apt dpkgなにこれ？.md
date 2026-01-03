---
tags:
  - linux
  - command
  - package
created: 2026-01-04
status: active
---

# apt/dpkgなにこれ？

aptやdpkgはUbuntuなどのDebian系でよく使われるパッケージマネージャ。

ネットワークを介して依存関係を解決したりするためにはaptがよく使われている。

```Shell
# パッケージリストの更新
sudo apt update

# インストール済みパッケージをすべてアップグレード
sudo apt upgrade

# パッケージのインストール
sudo apt install <package-name>

# パッケージの削除
sudo apt remove <package-name>

# パッケージ検索
apt search <keyword>

# パッケージ情報の表示
apt show <package-name>

# 不要なパッケージの削除
sudo apt autoremove
```

特定のパッケージのみアップデート

```Shell
# まずパッケージリストを更新
sudo apt update

# 特定のパッケージのみをアップグレード
sudo apt install --only-upgrade <package-name>

# 例: nginxのみ更新
sudo apt install --only-upgrade nginx
```

`

## apt vs apt-get の違い

|   |   |   |
|---|---|---|
|観点|apt|apt-get|
|登場時期|Ubuntu14.04|従来からある|
|対象|エンドユーザ向け|スクリプト自動化向け|
|出力|プログレスバーや、カラー表示あり|シンプル|
|安定性|CLIが変更される可能性あり|後方互換性が保証されている|

aptapt-get登場時期Ubuntu 14.04 / Debian 8 以降従来からある対象エンドユーザー向けスクリプト・自動化向け出力プログレスバーあり、カラー表示シンプルなテキスト安定性CLI が変更される可能性あり後方互換性が保証される