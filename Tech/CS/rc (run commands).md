# rc (run commands)

## 🔤 「rc」の語源

**"run commands" の略**

### 歴史的背景

- **UNIX（1970年代）**の `.rc` ファイルから来ている
  - プログラムやシェルが起動時に実行するコマンドを記述するファイル
  - 「run commands」または「runcom（run command）」の略

### 由来

- **MIT CTSS（1960年代のOS）**の RUNCOM コマンドが起源
- プログラム実行時に自動的に読み込まれる設定スクリプト

## 📝 .npmrc とは何か

**npm Run Commands = npmの設定ファイル**

### 役割

npmコマンドの動作を制御する設定ファイル

### 何を設定するのか

- パッケージをどこからダウンロードするか（レジストリ）
- どうやって認証するか（トークン）
- npmの動作オプション

## 🎯 .npmrc の具体例

### 基本的な使い方

```ini
# どのレジストリを使うか
registry=https://registry.npmjs.org/

# スコープ付きパッケージのレジストリ
@syoya:registry=https://asia-northeast1-npm.pkg.dev/syoya-internal/syoya-avalon-npm-registry/

# 認証トークン
//registry.npmjs.org/:_authToken=npm_xxxxxxxx

# その他の設定
save-exact=true
package-lock=true
```

### 設定ファイルの優先順位

1. プロジェクトローカル（`.npmrc`）
2. ユーザーローカル（`~/.npmrc`）
3. グローバル（`$PREFIX/etc/npmrc`）
4. npm組み込みデフォルト

### その他の rc ファイル例

- `.bashrc` - Bash起動時の設定
- `.vimrc` - Vim起動時の設定
- `.zshrc` - Zsh起動時の設定
- `.gitconfig` - Gitの設定（rcという名前ではないが同様の役割）
