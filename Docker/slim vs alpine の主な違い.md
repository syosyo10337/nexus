---
tags:
  - docker
  - dockerfile
  - optimization
created: 2026-01-03
status: active
---

# slim vs alpine の主な違い

```Plain
項目slim (Debian-based)alpineC libraryglibcmuslPackage managerapt/dpkgapkBase image size~70-100MB~5-7MBDefault shellbash/dashash (BusyBox)GNU coreutilsありBusyBox版
```

## その他の重要な違い

### 1. **DNS解決の挙動**

musl の DNS resolver は glibc と異なり、`/etc/resolv.conf` の `search` ディレクティブの扱いや、複数 DNS サーバーへのクエリ方法が異なります。Kubernetes環境で問題になることがあります。

### 2. **ロケール/i18n サポート**

Alpine は軽量化のためロケールサポートが限定的です。日本語処理で問題が出ることがあります。

### 3. **スレッドスタックサイズ**

musl のデフォルトスタックサイズは glibc より小さく（約80KB vs 8MB）、スタックを多用するアプリでクラッシュすることがあります。

---

## musl で問題が起きやすいライブラリ例

```Plain
カテゴリ具体例Python C拡張numpy,pandas,scipy,pillow（pre-built wheel が glibc 向け）Node.js native addonsbcrypt,sharp,node-sassデータベースドライバOracle Instant Client, 一部の商用JDBCドライバgRPC過去に musl 環境で問題あり（現在は改善）JVM関連一部のJNIライブラリ、Netty の native transport機械学習系TensorFlow,PyTorch（公式 wheel が glibc 向け）
```

---

## 実用的な選択指針

✅ **Alpine が適するケース**:

- Go / Rust などの静的リンクバイナリ

- シンプルなシェルスクリプト

- イメージサイズが最優先

✅ **slim が適するケース**:

- Python/Node.js でネイティブ拡張を使う

- 商用ライブラリを使う

- 互換性問題を避けたい

近年は **distroless** や **chainguard images** も選択肢に入ってきています。セキュリティとサイズのバランスが良いです。

何か特定のユースケースで迷っていますか？