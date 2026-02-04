---
tags:
  - shell-script
  - shell
  - linux
  - source
  - dot-command
created: 2022-12-20
status: active
---

# sourceコマンド

> **関連**: [シェルスクリプト.md](シェルスクリプト.md)｜[スクリプトの作成と実行.md](スクリプトの作成と実行.md)｜[シェル変数.md](シェル変数.md)

`source`（`.`）でスクリプトを現在のシェルで読み込む方法と、通常実行との違いをまとめます。

---

## 概要

`source`コマンド（または`.`コマンド）は、指定されたファイルを現在のシェル環境で読み込んで実行します。

> **詳細**: 設定ファイルの永続化については[シェル変数.md](シェル変数.md)を参照してください。

## 通常実行とsourceの違い

### 通常実行（`./script.sh`）

サブシェルで実行されるため、スクリプト内の変数は親シェルに影響しません。

```bash
$ cat set.sh
#!/bin/bash
abc=xyz
echo $abc

$ echo $abc
# 何も表示されない（変数が未定義）

$ ./set.sh
xyz
# スクリプト内で設定された変数が出力される

$ echo $abc
# 何も表示されない（変数はサブシェル内でのみ有効）
```

### source実行

現在のシェル環境で実行されるため、変数が保持されます。

```bash
$ source set.sh
xyz

$ echo $abc
xyz
# sourceで読み込んだため、変数が現在のシェルに残る
```

## 主な用途

- 設定ファイル（`.bashrc`, `.bash_profile`など）の変更を即座に反映
- 共通の変数や関数を複数のスクリプトで共有

```bash
# 設定ファイルの変更を即座に反映
$ source ~/.bashrc

# 短縮形
$ . ~/.bashrc
```
