---
tags:
  - linux
  - command
  - file
  - package
created: 2026-01-04
status: active
---

# CursorをUbuntuで利用する。

1. AppImageをDLする。[https://www.cursor.com/ja](https://www.cursor.com/ja)

2. AppImageに実行権限を付与する `chmod +x`

3. 立ち上げる。 `./[package_name] —no-sandbox`

4. AppImageやIconを適宜名前を書き換える。

5. /opt配下に設置する。

```Shell
mv /home/takahashimasanao/Downloads/cursor.AppImage /opt/cursor/cursor.AppImage
mv xxxx  /opt/cursor/cursor.AppImage
```

1. デスクトップエントリを作成する。

```Shell
cat /usr/share/applications/cursor.desktop

[Desktop Entry]
Name=Cursor
Exec=/opt/cursor/cursor.AppImage --no-sandbox
Icon=/opt/cursor/cursor.png
Type=Application
Categories=Development;
```

libfuse2も必要。

cf.

[https://zenn.dev/mizki/articles/36535a1b75ab81#6.-アプリとアイコンの名前を書き換える](https://zenn.dev/mizki/articles/36535a1b75ab81#6.-%E3%82%A2%E3%83%97%E3%83%AA%E3%81%A8%E3%82%A2%E3%82%A4%E3%82%B3%E3%83%B3%E3%81%AE%E5%90%8D%E5%89%8D%E3%82%92%E6%9B%B8%E3%81%8D%E6%8F%9B%E3%81%88%E3%82%8B)