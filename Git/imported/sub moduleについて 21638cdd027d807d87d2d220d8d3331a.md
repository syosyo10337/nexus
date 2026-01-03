 

# sub moduleについて

[https://qiita.com/sotarok/items/0d525e568a6088f6f6bb](https://qiita.com/sotarok/items/0d525e568a6088f6f6bb)

いまとなっては文字通りだなと思う。

[https://zenn.dev/sakaki_web/articles/785d2da8aaf2fa](https://zenn.dev/sakaki_web/articles/785d2da8aaf2fa)

## **1. 自分で生成したコードでsubmoduleを更新する場合**  

```Bash
# 1. submoduleのディレクトリに移動
cd path/to/submodule

# 2. 変更を確認
git status

# 3. 変更をステージング
git add .

# 4. コミット
git commit -m "Update generated code from goa gen"

# 5. submoduleのリモートにプッシュ
git push origin main  # またはmaster、developなどのブランチ

# 6. 親リポジトリに戻る
cd ../..

# 7. submoduleの参照を更新
git add path/to/submodule

# 8. 親リポジトリでコミット
git commit -m "Update submodule reference"

# 9. 親リポジトリをプッシュ
git push
```

## **2. チームメンバーの更新を取り込む場合**  

```Bash
# 1. 親リポジトリを最新に
git pull

# 2. submoduleを更新（初回または新しいsubmoduleが追加された場合）
git submodule update --init --recursive

# 3. すでに初期化済みの場合はこちらでもOK
git submodule update --recursive
```

git 2.14以降

```Bash
# 親リポジトリとsubmoduleを一度に最新化
git pull --recurse-submodules
```

cf.

```Bash
https://claude.ai/chat/e8a69685-35ac-48d5-abbc-827cdae50d36
```