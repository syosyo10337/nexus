---
created_at: 2026-01-17
tags:
  - UTF-8
  - BOM
  - encoding
  - character-encoding
  - csv
---

# 概要

BOM (Byte Order Mark) は、ファイルがUTF-8エンコーディングであることを示すマーカーです。

## 実態と文字表現の関係

```
Unicode文字     → UTF-8エンコード → ファイル上の実態
U+FEFF (\ufeff) → 0xEF 0xBB 0xBF  → 実際に存在する3バイト
```

### `\ufeff` とは

- Unicodeコードポイント `U+FEFF` (ZERO WIDTH NO-BREAK SPACE)
- 文字としての**抽象的な表現**
- プログラム内やドキュメント上での記述方法

### `0xEF 0xBB 0xBF` とは

- ✅ **実際にファイルやメモリ上に存在する3バイト**
- `U+FEFF`をUTF-8でエンコードした結果
- バイナリエディタで見える実体

## 確認方法

UTF-8 BOM付きファイルを作成して確認：

```bash
# UTF-8 BOM付きファイルを作成
echo -ne '\xEF\xBB\xBF' > test.txt
echo "Hello" >> test.txt

# バイナリで確認
hexdump -C test.txt
```

出力例：

```
00000000  ef bb bf 48 65 6c 6c 6f 0a
          ^^^^^^^^ これがBOMの実態
```

## まとめ

- **ファイルの実態**: `0xEF 0xBB 0xBF` という3バイトのシーケンス
- **Unicode表現**: `U+FEFF` または `\ufeff`
- **役割**: ファイルがUTF-8でエンコードされていることを示す

BOMは主にWindowsの一部アプリケーションで使用されますが、Unix/Linux環境では一般的に不要とされることが多いです。