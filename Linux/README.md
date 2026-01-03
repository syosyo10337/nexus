---
tags:
  - linux
  - index
created: 2026-01-04
status: active
---

# Linux ナレッジベース

Linuxに関する知識をトピック別に整理したドキュメント集です。

---

## 📚 カテゴリ一覧

### [Shell Scripting](shell-scripting/) 🐚

シェルスクリプトの基礎から応用まで

**基礎:**
- [シェルスクリプト](shell-scripting/シェルスクリプト.md) - 基礎知識と基本的な使い方
- [シェル変数](shell-scripting/シェル変数.md) - 変数の設定と環境変数
- [特殊変数](shell-scripting/特殊変数.md) - `$?`, `$!`, `$#`など
- [変数展開](shell-scripting/変数展開.md) - 変数展開のテクニック
- [エイリアス](shell-scripting/エイリアス.md) - エイリアスの設定方法

**制御構文:**
- [条件分岐](shell-scripting/条件分岐.md) - if文、case文、演算子
- [繰り返し処理](shell-scripting/繰り返し処理.md) - for、while、until、select

**高度なトピック:**
- [関数](shell-scripting/関数.md) - 関数の定義、引数、戻り値
- [デバッグ](shell-scripting/デバッグ.md) - デバッグ手法、エラーハンドリング

**その他:**
- [IFS (Internal Field Separator)](shell-scripting/IFS%20(Internal%20Field%20Separator)%20とは.md) - フィールド区切り文字
- [Parameter Expansion](shell-scripting/Parameter%20Expansion%20とか.md) - パラメータ展開
- [set オプション](shell-scripting/set%20+e%20-e%20-u%20-o.md) - set -e, -u, -o pipefail
- [シェバン](shell-scripting/!%20bin%20bashって？.md) - `#!/bin/bash`の意味

---

### [Commands](commands/) 💻

コマンドリファレンス

**ファイル操作:**
- [基本的なコマンド](commands/%20基本的なコマンド２.md)
- [findコマンド](commands/findコマンド.md) - ファイル検索
- [解凍コマンド](commands/解凍コマンド周りについて.md) - tar、zip、gzipなど

**テキスト処理:**
- [grep](commands/grep.md) - テキスト検索
- [sed コマンド](commands/sed%20コマンド.md) - ストリームエディタ
- [readコマンド](commands/readコマンド.md) - 標準入力からの読み込み

**システム情報:**
- [psコマンド](commands/psコマンド.md) - プロセス一覧
- [du -sh sort -h](commands/du%20-sh%20sort%20-h%20ディスク使用量を確認する.md) - ディスク使用量確認

**ネットワーク:**
- [curlコマンド](commands/curlコマンド.md) - HTTP通信
- [ネットワークコマンド](commands/ネットワークコマンド.md) - 各種ネットワークコマンド

**その他:**
- [passwdコマンド](commands/passwdコマンド.md) - パスワード変更
- [dirnameコマンド](commands/dirnameコマンド.md) - ディレクトリ名取得

---

### [System](system/) ⚙️

システム管理・プロセス管理

**プロセス管理:**
- [プロセス](system/プロセス.md) - プロセスの基礎
- [プロセス管理とマウント](system/プロセス管理とマウント%206.md)
- [systemd](system/systemdって何？.md) - システムとサービスマネージャー
- [SIG について理解する](system/SIG%20について理解する。.md) - シグナル

**権限管理:**
- [chmod(ファイルパーミッション)](system/chmod(ファイルパーミッション).md) - ファイル権限
- [ユーザの権限を移譲する](system/ユーザの権限を移譲する。.md) - sudo設定

**ファイルシステム:**
- [Linuxのディレクトリシステム](system/Linuxのディレクトリシステム.md) - ディレクトリ構造

**パッケージ管理:**
- [Package Manager](system/Package%20Manager.md) - パッケージマネージャーの概要
- [apt dpkg](system/apt%20dpkgなにこれ？.md) - Debian系パッケージ管理
- [HomeBrew](system/HomeBrew.md) - macOSのパッケージマネージャー
- [AppImageとdebパッケージの違い](system/AppImageとdebパッケージの違い.md)

---

### [Network](network/) 🌐

ネットワーク・開発環境設定

**ローカル開発環境:**
- [localhostへ外部リソースからアクセスする](network/localhostへ外部リソースからアクセスする。.md)
- [local環境もHttpsにする](network/local環境もHttpsにする.md)
- [unboundを使って、local環境にスマホからアクセスする](network/unboundを使って、local環境にスマホからアクセスする。.md)

**ネットワークツール:**
- [ngrok](network/ngrok.md) - ローカルサーバーを公開
- [etc hosts](network/etc%20hosts.md) - hostsファイルの設定

**SSH・リモート接続:**
- [macのsshの仕方詰まったとき](network/macのsshの仕方詰まったとき.md)
- [Ubuntuをdockerを立ち上げたサーバとして扱いつつMacからremote-sshで接続して開](network/Ubuntuをdockerを立ち上げたサーバとして扱いつつMacからremote-sshで接続して開.md)

---

### [I/O](io/) 📝

入出力・ストリーム

- [stderr stdin stdout](io/stderr%20stdin%20stdout.md) - 標準入出力
- [dev null](io/dev%20null.md) - /dev/null の使い方

---

### [Tools](tools/) 🔧

各種ツール・ビルドシステム

**ビルドツール:**
- [Makefile](tools/Makefile.md) - Makeの使い方
- [Pandoc](tools/Pandoc.md) - ドキュメント変換ツール

**開発環境:**
- [CursorをUbuntuで利用する](tools/CursorをUbuntuで利用する。.md)
- [Linear on Linux](tools/Linear%20on%20Linux.md)
- [マルチカーソルを使う](tools/マルチカーソルを使う.md)

**Docker関連:**
- [dockerコマンドで毎回sudoしなくてよ様にするには](tools/dockerコマンドで毎回sudoしなくてよ様にするには。.md)

**その他:**
- [musl](tools/musl.md) - musl libc
- [posix cron sytanx](tools/posix%20cron%20sytanx.md) - cron構文
- [httpdのdってなんのこと？](tools/httpdのdってなんのこと？.md) - デーモンプロセス
- [乱数生成がLinuxの日時に依存しているかも](tools/乱数生成がLinuxの日時に依存しているかも.md)

---

### [Basics](basics/) 📖

Linux基礎知識

- [CS基礎](basics/CS基礎.md) - コンピュータサイエンスの基礎
- [新しいLinuxの教科書](basics/新しいLinuxの教科書.md) - 学習メモ

---

## 🎯 学習パス

### 初心者向け

1. [Basics](basics/) - Linux基礎知識
2. [Commands](commands/) - 基本的なコマンド
3. [Shell Scripting](shell-scripting/シェルスクリプト.md) - スクリプトの基礎

### 中級者向け

1. [条件分岐](shell-scripting/条件分岐.md) - 制御構文
2. [繰り返し処理](shell-scripting/繰り返し処理.md) - ループ
3. [関数](shell-scripting/関数.md) - 関数の活用
4. [System](system/) - システム管理

### 上級者向け

1. [デバッグ](shell-scripting/デバッグ.md) - デバッグ手法
2. [I/O](io/) - 入出力制御
3. [Network](network/) - ネットワーク設定

---

## 📝 ドキュメント作成ガイドライン

### ファイル命名規則

- 日本語ファイル名OK
- スペースは避ける（やむを得ない場合はOK）
- 拡張子は`.md`

### タグ付け

```yaml
tags:
  - linux
  - カテゴリ名
  - 詳細タグ
```

### 相互リンク

関連ドキュメントへのリンクを積極的に追加してください。

```markdown
> **関連ドキュメント**: [シェル変数.md](シェル変数.md)を参照してください。
```

---

## 🔍 検索のヒント

### Obsidianでの検索

```
tag:#linux/shell-scripting
tag:#linux/commands
```

### ファイル内検索

```bash
# grepで検索
grep -r "キーワード" Linux/

# findで検索
find Linux/ -name "*キーワード*.md"
```

---

## 📅 更新履歴

- 2026-01-04: ディレクトリ構造をトピック別に再編成
- 2026-01-04: シェルスクリプト関連ドキュメントを分割・整理
- 2022-12-20: 初版作成

---

## 🤝 貢献

ドキュメントの追加・修正は随時歓迎します。

### 新規ドキュメント追加時

1. 適切なカテゴリディレクトリに配置
2. frontmatterにタグを追加
3. このREADME.mdに項目を追加
4. 関連ドキュメントとリンク

---

## 📚 外部リソース

- [GNU Bash Manual](https://www.gnu.org/software/bash/manual/)
- [Linux Documentation Project](https://tldp.org/)
- [Arch Linux Wiki](https://wiki.archlinux.org/)

