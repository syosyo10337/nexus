 

# Modelの保存/読み込み

作成したモデルをファイルとして保存しておきましょう。

Python標準のライブラリであるpickleを使用します。

[保存する](#2a89ebfc-66b6-4811-850f-7408517dfa3a)

[読み込む](#2f010525-d4c3-4b5e-b047-9128d4cbeb31)

## 保存する

```Python
import pickle

# open funcをwrite & binaryモードで使用する。
# pickle.dumpメソッドでmodel変数に格納されたモデルを、ファイルに
# 複製する
with open('<file_name>.pkl', 'wb') as f:
	pickle.dump(model, f)
```

## 読み込む

```Python
import pickle

# rbモードでファイルを読み込む
# pickle.load()メソッドで、ファイルを読み込む
with open('<file_name.pkl>', 'rb') as f:
	new_model = pickle.load(f)
```