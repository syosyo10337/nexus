---
title: "basenameとdirnameコマンドでパスを操作する方法"
source: "https://kazu-oji.com/unixcmd_basename_dirname/"
author:
  - "[[かずおじ]]"
published: 2025-06-26
created: 2026-01-04
description: "basenameコマンドとdirnameコマンドの使い方をわかりやすく解説。ファイル名やディレクトリ名の抽出方法、スクリプトでの応用例、注意点などを網羅。プログラミング初心者から上級者まで役立つ情報満載。"
tags:
  - "clippings"
---


## basenameコマンドとは？ファイル名抽出の基本

basenameコマンドは、指定されたパスからファイル名（またはディレクトリ名）の部分を抽出するUnix系のコマンドです。プログラミングやシェルスクリプトでファイルパスを扱う際に非常に役立ちます。

例えば、 `/path/to/my/file.txt` というパスが与えられた場合、basenameコマンドは `file.txt` を返します。これにより、ファイル名だけを取得して、その後の処理に利用できます。

```bash
basename /path/to/my/file.txt
```

また、basenameコマンドは、サフィックス（拡張子）を取り除くこともできます。 `-s` オプションを使用することで、指定したサフィックスを取り除いたファイル名を抽出できます。

```bash
basename /path/to/my/file.txt .txt
```

## dirnameコマンドとは？ディレクトリパス抽出の基本

dirnameコマンドは、basenameコマンドとは対照的に、指定されたパスからディレクトリパスの部分を抽出します。つまり、ファイル名を除いたパスを取得するコマンドです。

先ほどの例 `/path/to/my/file.txt` であれば、dirnameコマンドは `/path/to/my` を返します。スクリプト内でファイルの存在するディレクトリを特定する必要がある場合に便利です。

```bash
dirname /path/to/my/file.txt
```

## basenameとdirnameコマンドの使い方：オプションと実践例

basenameコマンドとdirnameコマンドは、それぞれ異なるオプションを持つことができますが、基本的な使い方は非常にシンプルです。以下に具体的な例をいくつか示します。

basenameコマンドのオプション:

`-a`: 複数のパスを同時に処理します。

`-s`: サフィックス（拡張子）を取り除きます。

`-z`: 出力する文字列の終端にヌル文字を追加します。

dirnameコマンドのオプション:

`-z`: 出力する文字列の終端にヌル文字を追加します。

実践例:

```bash
# 複数のファイルのbasenameを取得する
ls *.txt | while read file; do
  echo "Basename of $file: $(basename $file)"
done
# ディレクトリを作成し、その親ディレクトリを取得する
mkdir -p /tmp/test/nested
echo $(dirname /tmp/test/nested)
python:# Pythonでbasenameとdirnameを再現する例
import os

file_path = "/path/to/my/file.txt"

file_name = os.path.basename(file_path)
directory_name = os.path.dirname(file_path)

print(f"Basename: {file_name}")
print(f"Dirname: {directory_name}")
```

## スクリプトでの応用：basenameとdirnameの組み合わせ

basenameコマンドとdirnameコマンドは、シェルスクリプト内で組み合わせて使用することで、より複雑なファイル操作を実現できます。

例えば、あるファイルのディレクトリに移動し、そのファイル名を使って別の処理を行うような場合に役立ちます。

```bash
#!/bin/bash

FILE="/path/to/my/file.txt"

# ディレクトリを取得
DIR=$(dirname "$FILE")
# ファイル名を取得
FILENAME=$(basename "$FILE")

# ディレクトリに移動
cd "$DIR"

# ファイル名を使って何か処理を行う
echo "Current directory: $(pwd)"
echo "Processing file: $FILENAME"
```

このスクリプトでは、まずdirnameコマンドでファイルのディレクトリパスを取得し、次にbasenameコマンドでファイル名を取得しています。その後、 `cd` コマンドでディレクトリに移動し、ファイル名を使って何らかの処理を行うという流れです。

## basenameとdirnameコマンドの注意点

basenameコマンドとdirnameコマンドを使用する際には、いくつかの注意点があります。

パスの指定方法:

相対パスと絶対パスで結果が異なる場合があります。スクリプト内でパスを扱う場合は、どちらのパスを使用しているかを意識する必要があります。

存在しないパス:

存在しないパスを指定した場合、basenameコマンドとdirnameコマンドはエラーを返しません。basenameコマンドは指定されたパスをそのまま返し、dirnameコマンドは指定されたパスから最後のスラッシュまでの文字列を返します。期待どおりの結果が得られない可能性があるため、注意が必要です。

空のパス:

空のパスを指定した場合、basenameコマンドは空文字列を返し、dirnameコマンドは`.`を返します。

## 参考リンク

- [basename(1): strip directory and suffix from filenames – Linux man page](https://man7.org/linux/man-pages/man1/basename.1.html)
- [dirname(1): convert a file name to a directory name – Linux man page](https://man7.org/linux/man-pages/man1/dirname.1.html)

## まとめ

basenameコマンドとdirnameコマンドは、ファイルパスを操作するための強力なツールです。これらのコマンドを理解し、使いこなすことで、シェルスクリプトやプログラミングにおけるファイル操作がより効率的に行えるようになります。パスの操作は、ファイル処理を行う上で基本となる知識ですので、しっかりとマスターしておきましょう。