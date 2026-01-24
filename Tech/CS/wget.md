---
created_at: 2026-01-24
tags:
  - cs
  - cli
  - networking
  - linux
---

# wget

**wget** は、コマンドラインからHTTP/HTTPS/FTPでファイルをダウンロードするためのツール。

## 基本構文

```bash
wget [オプション] [URL]
```

## なぜ curl ではなく wget？

- **軽量コンテナでは `curl` が入っていないことが多い**
- `wget` は Alpine Linux などの軽量イメージにデフォルトで含まれている ✅
- `busybox` ベースのイメージにも `wget` が含まれている ✅

## よく使うオプション

| オプション | 説明 |
|-----------|------|
| `-q` | quiet（静かに）= 進捗表示を抑制 |
| `-O-` | 標準出力に出力（ファイル保存しない） |
| `-O filename` | 指定ファイル名で保存 |
| `--spider` | ダウンロードせずにURLの存在確認のみ |
| `-c` | 中断したダウンロードを再開 |
| `-r` | 再帰的にダウンロード |
| `-t N` | リトライ回数を N 回に指定 |

## 使用例

### レスポンスを標準出力に表示

```bash
wget -qO- http://localhost:8080/health
```

- `-q`: 進捗を非表示
- `-O-`: ファイルに保存せず標準出力へ

### ファイルをダウンロード

```bash
wget https://example.com/file.tar.gz
```

### ファイル名を指定してダウンロード

```bash
wget -O myfile.tar.gz https://example.com/file.tar.gz
```

### URLの存在確認のみ（ダウンロードしない）

```bash
wget --spider https://example.com/
```

## curl との比較

| 機能 | wget | curl |
|------|------|------|
| 再帰的ダウンロード | ✅ `-r` | ❌ |
| レジューム | ✅ `-c` | ✅ `-C -` |
| 軽量イメージでの可用性 | ✅ 高い | ⚠️ 低い |
| プロトコル対応 | HTTP, HTTPS, FTP | 多数対応 |
| API テスト向き | ⚠️ | ✅ |

## Kubernetes での使用例

Pod 内でヘルスチェックを確認する際によく使われる：

```bash
kubectl exec <pod-name> -- wget -qO- http://localhost:8081/health
```

## 参考

- [GNU Wget Manual](https://www.gnu.org/software/wget/manual/wget.html)
