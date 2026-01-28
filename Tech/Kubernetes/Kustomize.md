---
tags: [kubernetes, kustomize, manifest]
created: 2026-01-28
status: active
---

# Kustomize

base/overlaysのディレクトリ構成になる。
buildする際には、kustomization.yamlを参照される。

- resources: ベースになるディレクトリを指定する
- patches: overlaysするものをここに当てる。

実際マニフェストを適用する例

```bash
❯ kustomize build ./overlays/staging | k -n default apply -f - 
```
