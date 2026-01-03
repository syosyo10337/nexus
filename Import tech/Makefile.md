 

# Makefile

[.PHONY](#2c338cdd-027d-8040-8296-f10d37949159)

[**@ の意味**](#2cb38cdd-027d-8086-a20f-c1230d30904c)

[$(MAKE)](#2cb38cdd-027d-8015-a573-c229c5aaaeeb) 

[-C ディレクトリ](#2cb38cdd-027d-8099-96ca-ee7fd8faff36)

# .PHONY

偽りの。みたいな意味のもの

- `**Makefile**` **における予約語**: 実際にファイルを作成するものではなく、実行時に定義されたコマンドを実行するためのターゲット名であることを示します。

- **仮想的なターゲット**: `clean` のようなコマンドを想定して使用されます。`clean` は通常、`Makefile` のターゲットとして定義されますが、実行しても物理的なファイル（`clean` という名前のファイル）が作成されるわけではありません。

- `**Makefile**` **の例**:
    
    - `clean` のようなコマンドで、`make clean` と実行した時に、物理的な `clean` というファイルが生成されてしまうことを防ぐために使われます。
    
    - `MAKEFILE`の例:この例では、`clean` というターゲットはファイルとして扱われず、`make clean` を実行しても `clean` というファイルが作られることはありません。
        
        makefile
        
        `.PHONY: clean      clean:   rm -rf *~ core.*`
        
    

# **@ の意味**

@ は、コマンドを実行する前にそのコマンド自体を表示しないようにするプレフィックスです。

**例：**

```Makefile
# @なしの場合
help:
	echo "Hello World"
```

```Bash
$ make help

echo "Hello World"    *# ← コマンドが表示される*
Hello World           *# ← 実行結果*
```

```Makefile
# @ありの場合
help:
	@echo "Hello World"
```

```Bash
$ make help

Hello World           # ← コマンドは表示されず、結果だけ
```

# $(MAKE) 

Makefile の組み込み変数で、make コマンドの実行ファイル名（通常は make）を表します。

なぜmakeと書かないのか？

1. 　環境に応じた make の使用
    
    - システムによっては gmake や bsdmake など別名の make を使う場合がある
    
    - $(MAKE) を使うと、その環境に適した make が自動的に使われる
    

2. 再帰的な Make 呼び出しの正しい動作
    
    - Makefile 内で別の Makefile を呼び出す場合、$(MAKE) を使うと再帰呼び出しが正しく動作する
    
    - フラグ（-j など）や変数が適切に引き継がれる
    

# -C ディレクトリ

指定ディレクトリでMakefileを実行

```Bash
# 親ディレクトリで、makefileを実行する 
	@$(MAKE) -C .. encrypt-secrets-tools
```