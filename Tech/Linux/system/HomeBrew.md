---
description: macOS用パッケージマネージャーの使い方とaptコマンドとの対応
tags:
  - package manager
  - homebrew
  - macos
  - linux
created: 2026-01-04
updated: 2026-02-08
status: active
---

# HomeBrew

macOS（およびLinux）用のパッケージマネージャー。ソフトウェアのインストール、更新、管理を簡単に行える。

## 基本的な使い方

### パッケージのインストール

✅ **推奨**: インストール前にHomebrew自体を更新する

```bash
# Homebrewを最新版に更新
brew update

# パッケージをインストール
brew install <package-name>

# e.g. : gitをインストール
brew install git
```

### パッケージの検索

```bash
# パッケージを検索
brew search <keyword>

# e.g.: pythonを検索
brew search python
```

### インストール済みパッケージの確認

```bash
# インストール済みパッケージ一覧
brew list

# 特定のパッケージの情報を表示
brew info <package-name>
```

### パッケージの更新

```bash
# すべてのパッケージを更新
brew upgrade

# 特定のパッケージのみ更新
brew upgrade <package-name>
```

### パッケージのアンインストール

```bash
# パッケージをアンインストール
brew uninstall <package-name>
```

### メンテナンス

```bash
# 古いバージョンのパッケージを削除してディスク容量を節約
brew cleanup

# Homebrewの状態をチェック（問題がないか確認）
brew doctor
```

## 日常的なワークフロー

### 新しいパッケージをインストールする場合

```bash
# 1. Homebrewを更新
brew update

# 2. パッケージをインストール
brew install <package-name>
```

### 定期的なメンテナンス

```bash
# すべてのパッケージを最新に保つ
brew update && brew upgrade

# 不要なファイルを削除
brew cleanup

# Brewfileという形でインストールされているものをfileの形で残しておきたい
  brew bundle dump --file=~/dotfiles/Brewfile --force
```

## brew と apt の対応表

パッケージ管理コマンドの対応関係：

| 操作                       | apt (Debian/Ubuntu)                     | brew (macOS)         |
| -------------------------- | --------------------------------------- | -------------------- |
| パッケージマネージャを更新 | `sudo apt update`                       | `brew update`        |
| 更新可能なパッケージを確認 | `apt list --upgradable`                 | `brew outdated`      |
| パッケージを更新           | `sudo apt upgrade`                      | `brew upgrade`       |
| 特定パッケージを更新       | `sudo apt install --only-upgrade <pkg>` | `brew upgrade <pkg>` |
| 不要なパッケージを削除     | `sudo apt autoremove`                   | `brew autoremove`    |
| キャッシュを削除           | `sudo apt clean`                        | `brew cleanup`       |

## よくあるコマンド

- `brew update`: Homebrewのフォーミュラ（パッケージ定義）を更新
- `brew upgrade`: インストール済みパッケージを最新版に更新
- `brew outdated`: 更新可能なパッケージを確認
- 定期的に `brew doctor` を実行して問題がないか確認するのがベストプラクティス
